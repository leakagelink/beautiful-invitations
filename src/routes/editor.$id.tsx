import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Crop, Download, MessageCircle, Music2, Share2, Type as TypeIcon, ImagePlus, Video } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { InvitePreview } from "@/components/InvitePreview";
import { PhotoCropper } from "@/components/PhotoCropper";
import { saveCreation, getCreation, type InviteFields } from "@/lib/creations";
import { pick, useLang } from "@/lib/i18n";
import { CANVAS_H, CANVAS_W, drawInvite, ensureFonts, loadImage } from "@/lib/render";
import { templateById } from "@/lib/templates";
import { useTemplate } from "@/hooks/useTemplates";
import { isCustomId } from "@/lib/customTemplates";
import { downloadBlob, renderVideo, shareFile } from "@/lib/video";
import { UnlockSheet } from "@/components/UnlockSheet";
import { isUnlocked, markUnlocked } from "@/lib/pricing";

export const Route = createFileRoute("/editor/$id")({
  validateSearch: (search: Record<string, unknown>): { c?: string } =>
    typeof search["c"] === "string" ? { c: search["c"] } : {},
  loader: ({ params }) => {
    if (!isCustomId(params.id) && !templateById(params.id)) throw notFound();
    return null;
  },
  head: ({ params }) => {
    const tpl = templateById(params.id);
    const name = tpl ? tpl.name.en : "Invitation";
    return {
      meta: [
        { title: `Customise ${name} — My Invitation` },
        {
          name: "description",
          content: `Add your names, date, venue, photo and song to the ${name} invitation, then export a card or video.`,
        },
        { property: "og:title", content: `Customise ${name}` },
        { property: "og:description", content: "Edit the text, photo and music of your invitation." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Editor,
});

type Tab = "text" | "photo" | "music";

/** Character limits keep long names from breaking the design. */
const LIMITS: Record<keyof InviteFields, number> = {
  subtitle: 40,
  title: 34,
  date: 46,
  message: 140,
  footer: 60,
};

function Editor() {
  const { id } = Route.useParams();
  const { c } = Route.useSearch();
  const { lang, t } = useLang();
  const template = useTemplate(id);

  const [fields, setFields] = useState<InviteFields>(
    () => (lang === "te" ? template?.fieldsTe : template?.fields) ?? {
      title: "",
      subtitle: "",
      date: "",
      message: "",
      footer: "",
    },
  );
  const [photo, setPhoto] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const openCrop = useCallback((src: string) => {
    window.history.pushState({ ...(window.history.state ?? {}), crop: true }, "");
    setCropSrc(src);
  }, []);
  const closeCrop = useCallback(() => {
    setCropSrc(null);
    if ((window.history.state as { crop?: boolean } | null)?.crop) {
      window.history.back();
    }
  }, []);
  // Phone/browser back should close the cropper, not leave the editor.
  useEffect(() => {
    const onPop = () => setCropSrc(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [musicName, setMusicName] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("text");
  const [seconds, setSeconds] = useState(60);
  const [busy, setBusy] = useState<null | "video" | "image">(null);
  const [status, setStatus] = useState<string | null>(null);
  const [video, setVideo] = useState<{ url: string; blob: Blob; ext: string } | null>(null);
  const [creationId] = useState(() => c ?? `inv_${Date.now().toString(36)}`);
  const [showUnlock, setShowUnlock] = useState(false);
  const [paid, setPaid] = useState(false);
  const photoInput = useRef<HTMLInputElement | null>(null);
  const musicInput = useRef<HTMLInputElement | null>(null);

  // Load a previously saved invitation when arriving from Creations.
  useEffect(() => {
    if (!c) return;
    const saved = getCreation(c);
    if (saved) {
      setFields(saved.fields);
      setPhoto(saved.photo ?? null);
    }
  }, [c]);

  // Custom (admin-added) templates load from device storage, so seed their text once ready.
  const seeded = useRef(false);
  useEffect(() => {
    if (c || seeded.current || !template) return;
    seeded.current = true;
    setFields(lang === "te" ? template.fieldsTe : template.fields);
  }, [c, template, lang]);

  useEffect(() => setPaid(isUnlocked(creationId)), [creationId]);


  const labels = useMemo(
    () => ({
      subtitle: { en: "Top line", te: "పైవరుస" },
      title: { en: "Main names / title", te: "పేర్లు / శీర్షిక" },
      date: { en: "Date & time", te: "తేదీ & సమయం" },
      message: { en: "Invitation message", te: "ఆహ్వాన సందేశం" },
      footer: { en: "Venue / signature", te: "వేదిక / సంతకం" },
    }),
    [],
  );

  if (!template) return null;
  const tpl = template;

  const update = (key: keyof InviteFields) => (value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  async function exportImage() {
    setBusy("image");
    setStatus(null);
    try {
      await ensureFonts();
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_W;
      canvas.height = CANVAS_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      const bg = await loadImage(tpl.bg);
      const photoImg = photo ? await loadImage(photo) : null;
      drawInvite(ctx, { bg, photo: photoImg, template: tpl, fields, progress: 1 });
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.94));
      if (blob) {
        const file = new File([blob], `invitation.jpg`, { type: "image/jpeg" });
        const shared = await shareFile(file, fields.title);
        if (!shared) downloadBlob(blob, "invitation.jpg");
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not export the card");
    } finally {
      setBusy(null);
    }
  }

  async function exportVideo() {
    setBusy("video");
    setStatus(t("making"));
    setVideo(null);
    try {
      await ensureFonts();
      const bg = await loadImage(tpl.bg);
      const photoImg = photo ? await loadImage(photo) : null;
      const result = await renderVideo(
        { bg, photo: photoImg, template: tpl, fields },
        { seconds, musicUrl },
      );
      setVideo({ url: result.url, blob: result.blob, ext: result.ext });
      setStatus(null);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not create the video");
    } finally {
      setBusy(null);
    }
  }

  function save() {
    saveCreation({ id: creationId, templateId: tpl.id, fields, photo });
    setStatus(t("saved"));
  }

  return (
    <AppShell title={pick(template.name, lang)} back="/">
      <main className="px-4 pt-4">
        <InvitePreview
          template={template}
          fields={fields}
          photo={photo}
          animateKey={`${fields.title}|${photo ?? ""}`}
        />

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => (paid ? exportVideo() : setShowUnlock(true))}
            disabled={busy !== null}
            className="btn-gold sheen press flex h-12 items-center justify-center gap-2 rounded-full text-sm disabled:opacity-60"
          >
            <Video className="size-4" /> {busy === "video" ? t("making") : t("makeVideo")}
          </button>
          <button
            onClick={exportImage}
            disabled={busy !== null}
            className="btn-ghost-line press flex h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold disabled:opacity-60"
          >
            <Download className="size-4" /> {t("downloadImage")}
          </button>
        </div>

        <button
          type="button"
          disabled
          title={t("comingSoon")}
          className="mt-2 flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-border bg-card text-sm font-semibold text-muted-foreground opacity-70"
        >
          <MessageCircle className="size-4" /> {t("shareWhatsapp")} · {t("comingSoon")}
        </button>

        <div className="mt-2 flex items-center justify-between rounded-full border border-border bg-card px-4 py-2 text-sm">
          <span className="text-muted-foreground">
            {t("videoLen")}: {seconds} {t("seconds")}
          </span>
          <div className="flex gap-1">
            {[15, 30, 60].map((s) => (
              <button
                key={s}
                onClick={() => setSeconds(s)}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  seconds === s ? "btn-gold" : "text-muted-foreground"
                }`}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>

        {status ? <p className="mt-3 text-center text-sm text-primary">{status}</p> : null}

        {video ? (
          <section className="surface-card mt-4 rounded-2xl p-4">
            <video src={video.url} controls playsInline className="w-full rounded-xl" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={async () => {
                  const file = new File([video.blob], `invitation.${video.ext}`, {
                    type: video.blob.type,
                  });
                  const shared = await shareFile(file, fields.title);
                  if (!shared) downloadBlob(video.blob, `invitation.${video.ext}`);
                }}
                className="btn-gold press flex h-11 items-center justify-center gap-2 rounded-full text-sm"
              >
                <Share2 className="size-4" /> {t("share")}
              </button>
              <button
                onClick={() => downloadBlob(video.blob, `invitation.${video.ext}`)}
                className="btn-ghost-line press flex h-11 items-center justify-center rounded-full text-sm font-semibold"
              >
                {t("download")}
              </button>
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${fields.title} — ${fields.date}\n${fields.message}`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-center text-xs font-semibold text-primary"
            >
              {t("shareWhatsapp")}
            </a>
          </section>
        ) : null}

        <div className="mt-6 flex gap-2">
          {(
            [
              ["text", TypeIcon, t("text")],
              ["photo", ImagePlus, t("photo")],
              ["music", Music2, t("music")],
            ] as const
          ).map(([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold ${
                tab === key ? "btn-gold" : "btn-ghost-line text-muted-foreground"
              }`}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>

        <section className="surface-card mt-3 rounded-2xl p-4">
          {tab === "text" ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("fields")}
              </p>
              {(Object.keys(labels) as (keyof InviteFields)[]).map((key) => (
                <label key={key} className="block">
                  <span className="text-xs text-muted-foreground">{pick(labels[key], lang)}</span>
                  {key === "message" ? (
                    <textarea
                      value={fields[key]}
                      onChange={(e) => update(key)(e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  ) : (
                    <>
                      <input
                        value={fields[key]}
                        maxLength={LIMITS[key]}
                        onChange={(e) => update(key)(e.target.value.slice(0, LIMITS[key]))}
                        className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                      />
                      <span
                        className={`mt-1 block text-right text-[11px] ${
                          fields[key].length > LIMITS[key] - 6
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {fields[key].length}/{LIMITS[key]}
                      </span>
                    </>
                  )}
                </label>
              ))}
            </div>
          ) : null}

          {tab === "photo" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("photo_hint")}</p>
              <input
                ref={photoInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setCropSrc(String(reader.result));
                  reader.readAsDataURL(file);
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => photoInput.current?.click()}
                  className="btn-gold press h-11 flex-1 rounded-full text-sm"
                >
                  {t("addPhoto")}
                </button>
                {photo ? (
                  <button
                    onClick={() => setCropSrc(photo)}
                    className="btn-ghost-line press flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full text-sm font-semibold"
                  >
                    <Crop className="h-4 w-4" />
                    {t("editPhoto")}
                  </button>
                ) : null}
                {photo ? (
                  <button
                    onClick={() => setPhoto(null)}
                    className="btn-ghost-line press h-11 flex-1 rounded-full text-sm font-semibold"
                  >
                    {t("removePhoto")}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {tab === "music" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("music_hint")}</p>
              <input
                ref={musicInput}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setMusicUrl(URL.createObjectURL(file));
                  setMusicName(file.name);
                }}
              />
              {musicUrl ? (
                <audio src={musicUrl} controls className="w-full" />
              ) : null}
              {musicName ? (
                <p className="truncate text-xs text-muted-foreground">{musicName}</p>
              ) : null}
              <div className="flex gap-2">
                <button
                  onClick={() => musicInput.current?.click()}
                  className="btn-gold press h-11 flex-1 rounded-full text-sm"
                >
                  {t("addMusic")}
                </button>
                {musicUrl ? (
                  <button
                    onClick={() => {
                      setMusicUrl(null);
                      setMusicName(null);
                    }}
                    className="btn-ghost-line press h-11 flex-1 rounded-full text-sm font-semibold"
                  >
                    {t("removeMusic")}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        <button
          onClick={save}
          className="btn-ghost-line press mt-4 h-12 w-full rounded-full text-sm font-semibold"
        >
          {t("saveInvite")}
        </button>

        <Link
          to="/creations"
          className="mt-3 block text-center text-xs font-semibold text-primary"
        >
          {t("creations")} →
        </Link>
      </main>

      {cropSrc ? (
        <PhotoCropper
          src={cropSrc}
          onCancel={() => setCropSrc(null)}
          onApply={(cropped) => {
            setPhoto(cropped);
            setCropSrc(null);
          }}
        />
      ) : null}

      {showUnlock ? (
        <UnlockSheet
          titleText={fields.title}
          onClose={() => setShowUnlock(false)}
          onUnlock={(_plan, price) => {
            markUnlocked(creationId);
            setPaid(true);
            setShowUnlock(false);
            setStatus(
              pick(
                { en: `Unlocked for ₹${price} — making your video…`, te: `₹${price}కి అన్‌లాక్ — వీడియో తయారవుతోంది…` },
                lang,
              ),
            );
            void exportVideo();
          }}
        />
      ) : null}
    </AppShell>
  );
}
