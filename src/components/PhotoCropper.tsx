import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Crop,
  FlipHorizontal,
  RotateCcw,
  RotateCw,
  RefreshCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { loadImage } from "@/lib/render";

const MAX_OUT = 1200; // longest side of the exported crop

type Ratio = { id: string; label: string; value: number | null }; // null = original image ratio

const RATIOS: Ratio[] = [
  { id: "1:1", label: "1:1", value: 1 },
  { id: "4:5", label: "4:5", value: 4 / 5 },
  { id: "3:4", label: "3:4", value: 3 / 4 },
  { id: "9:16", label: "9:16", value: 9 / 16 },
  { id: "4:3", label: "4:3", value: 4 / 3 },
  { id: "16:9", label: "16:9", value: 16 / 9 },
];

type Props = {
  src: string;
  onApply: (croppedDataUrl: string) => void;
  onCancel: () => void;
};

/**
 * Photo cropper with separate Crop and Zoom tabs.
 * Crop tab: aspect presets, original ratio, custom width/height.
 * Zoom tab: slider, +/- buttons, rotate, flip, reset. Drag to pan, pinch to zoom.
 */
export function PhotoCropper({ src, onApply, onCancel }: Props) {
  const { t } = useLang();
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [viewSrc, setViewSrc] = useState(src);
  const [rot, setRot] = useState(0); // 0 | 90 | 180 | 270
  const [flip, setFlip] = useState(false);
  const [tab, setTab] = useState<"crop" | "zoom">("crop");
  const [ratioId, setRatioId] = useState("1:1");
  const [cw, setCw] = useState(4);
  const [ch, setCh] = useState(5);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [area, setArea] = useState({ w: 320, h: 320 });
  const areaRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);

  // Build a rotated / flipped source whenever the user changes orientation.
  useEffect(() => {
    let alive = true;
    loadImage(src).then((base) => {
      if (!alive) return;
      if (rot === 0 && !flip) {
        setViewSrc(src);
        setImg(base);
        return;
      }
      const swap = rot === 90 || rot === 270;
      const c = document.createElement("canvas");
      c.width = swap ? base.naturalHeight : base.naturalWidth;
      c.height = swap ? base.naturalWidth : base.naturalHeight;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.translate(c.width / 2, c.height / 2);
      ctx.rotate((rot * Math.PI) / 180);
      if (flip) ctx.scale(-1, 1);
      ctx.drawImage(base, -base.naturalWidth / 2, -base.naturalHeight / 2);
      const url = c.toDataURL("image/jpeg", 0.95);
      loadImage(url).then((el) => {
        if (!alive) return;
        setViewSrc(url);
        setImg(el);
      });
    });
    return () => {
      alive = false;
    };
  }, [src, rot, flip]);

  // Measure the available crop stage.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setArea({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const imgRatio = img ? img.naturalWidth / img.naturalHeight : 1;
  const ratio = useMemo(() => {
    if (ratioId === "orig") return imgRatio;
    if (ratioId === "custom") {
      const w = Math.max(1, cw);
      const h = Math.max(1, ch);
      return w / h;
    }
    return RATIOS.find((r) => r.id === ratioId)?.value ?? 1;
  }, [ratioId, cw, ch, imgRatio]);

  // Frame fitted inside the stage with the chosen aspect ratio.
  const frame = useMemo(() => {
    let w = area.w;
    let h = w / ratio;
    if (h > area.h) {
      h = area.h;
      w = h * ratio;
    }
    return { w: Math.round(w), h: Math.round(h) };
  }, [area, ratio]);

  const coverScale = img
    ? Math.max(frame.w / img.naturalWidth, frame.h / img.naturalHeight)
    : 1;
  const drawW = img ? img.naturalWidth * coverScale * zoom : 0;
  const drawH = img ? img.naturalHeight * coverScale * zoom : 0;

  const clampOffset = useCallback(
    (o: { x: number; y: number }, z: number) => {
      if (!img) return o;
      const w = img.naturalWidth * coverScale * z;
      const h = img.naturalHeight * coverScale * z;
      const mx = Math.max(0, (w - frame.w) / 2);
      const my = Math.max(0, (h - frame.h) / 2);
      return { x: Math.min(mx, Math.max(-mx, o.x)), y: Math.min(my, Math.max(-my, o.y)) };
    },
    [img, coverScale, frame],
  );

  // Keep the photo inside the frame when the crop shape changes.
  useEffect(() => {
    setOffset((o) => clampOffset(o, zoom));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame.w, frame.h]);

  const changeZoom = (z: number) => {
    const next = Math.min(4, Math.max(1, Number(z.toFixed(3))));
    setZoom(next);
    setOffset((o) => clampOffset(o, next));
  };

  function reset() {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setRot(0);
    setFlip(false);
  }

  function apply() {
    if (!img) return;
    const outW = ratio >= 1 ? MAX_OUT : Math.round(MAX_OUT * ratio);
    const outH = ratio >= 1 ? Math.round(MAX_OUT / ratio) : MAX_OUT;
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const k = outW / frame.w; // view -> output scale
    const w = drawW * k;
    const h = drawH * k;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, outW, outH);
    ctx.drawImage(img, outW / 2 + offset.x * k - w / 2, outH / 2 + offset.y * k - h / 2, w, h);
    onApply(canvas.toDataURL("image/jpeg", 0.92));
  }

  const chip = (active: boolean) =>
    `press rounded-full border px-3 py-1.5 text-xs font-medium transition ${
      active
        ? "border-transparent bg-primary text-primary-foreground"
        : "border-border text-muted-foreground"
    }`;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-background">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onCancel}
          aria-label={t("cancelCrop")}
          className="press flex h-10 w-10 items-center justify-center rounded-full border border-border"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold">{t("cropTitle")}</p>
          <p className="text-[11px] text-muted-foreground">{t("cropHint")}</p>
        </div>
        <button
          onClick={apply}
          aria-label={t("applyCrop")}
          className="btn-gold press flex h-10 w-10 items-center justify-center rounded-full"
        >
          <Check className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={areaRef}
        className="relative mx-auto min-h-0 w-full max-w-[360px] flex-1 px-4 py-2"
      >

        <div
          className="absolute left-1/2 top-1/2 touch-none overflow-hidden rounded-2xl border border-border bg-black"
          style={{
            width: frame.w,
            height: frame.h,
            transform: "translate(-50%, -50%)",
          }}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pointers.current.size === 2) {
              const pts = [...pointers.current.values()];
              const a = pts[0]!;
              const b = pts[1]!;
              pinchRef.current = {
                dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
                zoom,
              };
              dragRef.current = null;
            } else {
              dragRef.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
            }
          }}
          onPointerMove={(e) => {
            if (pointers.current.has(e.pointerId)) {
              pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            }
            const pinch = pinchRef.current;
            if (pinch && pointers.current.size >= 2) {
              const pts = [...pointers.current.values()];
              const a = pts[0]!;
              const b = pts[1]!;
              const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
              changeZoom(pinch.zoom * (d / pinch.dist));
              return;
            }

            const d = dragRef.current;
            if (!d) return;
            setOffset(
              clampOffset({ x: d.ox + (e.clientX - d.px), y: d.oy + (e.clientY - d.py) }, zoom),
            );
          }}
          onPointerUp={(e) => {
            pointers.current.delete(e.pointerId);
            if (pointers.current.size < 2) pinchRef.current = null;
            dragRef.current = null;
          }}
          onPointerCancel={(e) => {
            pointers.current.delete(e.pointerId);
            pinchRef.current = null;
            dragRef.current = null;
          }}
        >
          {img ? (
            <img
              src={viewSrc}
              alt=""
              draggable={false}
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
              style={{
                width: drawW,
                height: drawH,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              }}
            />
          ) : null}
          {/* crop guides */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 ring-1 ring-inset ring-white/30" />
            <div className="absolute left-1/3 top-0 h-full w-px bg-white/15" />
            <div className="absolute left-2/3 top-0 h-full w-px bg-white/15" />
            <div className="absolute left-0 top-1/3 h-px w-full bg-white/15" />
            <div className="absolute left-0 top-2/3 h-px w-full bg-white/15" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[360px] px-4 pb-8">
        {/* tabs */}
        <div className="mb-3 flex rounded-full border border-border p-1">
          <button
            onClick={() => setTab("crop")}
            className={`press flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold ${
              tab === "crop" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <Crop className="h-4 w-4" />
            {t("tabCrop")}
          </button>
          <button
            onClick={() => setTab("zoom")}
            className={`press flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold ${
              tab === "zoom" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <ZoomIn className="h-4 w-4" />
            {t("tabZoom")}
          </button>
        </div>

        {tab === "crop" ? (
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {t("cropShape")}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRatioId("orig")}
                className={chip(ratioId === "orig")}
              >
                {t("ratioOriginal")}
              </button>
              {RATIOS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRatioId(r.id)}
                  className={chip(ratioId === r.id)}
                >
                  {r.label}
                </button>
              ))}
              <button
                onClick={() => setRatioId("custom")}
                className={chip(ratioId === "custom")}
              >
                {t("ratioCustom")}
              </button>
            </div>
            {ratioId === "custom" ? (
              <div className="flex items-end gap-3">
                <label className="flex-1 text-[11px] text-muted-foreground">
                  {t("customW")}
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={cw}
                    onChange={(e) => setCw(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                    className="mt-1 w-full rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                  />
                </label>
                <span className="pb-3 text-sm text-muted-foreground">:</span>
                <label className="flex-1 text-[11px] text-muted-foreground">
                  {t("customH")}
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={ch}
                    onChange={(e) => setCh(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                    className="mt-1 w-full rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-foreground"
                  />
                </label>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => changeZoom(zoom - 0.25)}
                aria-label={t("zoomOut")}
                className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <input
                type="range"
                min={1}
                max={4}
                step={0.01}
                value={zoom}
                onChange={(e) => changeZoom(Number(e.target.value))}
                aria-label={t("zoom")}
                className="w-full accent-[hsl(var(--primary))]"
              />
              <button
                onClick={() => changeZoom(zoom + 0.25)}
                aria-label={t("zoomIn")}
                className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setRot((r) => (r + 270) % 360)}
                className="press flex flex-col items-center gap-1 rounded-xl border border-border py-2 text-[10px] text-muted-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                {t("rotateLeft")}
              </button>
              <button
                onClick={() => setRot((r) => (r + 90) % 360)}
                className="press flex flex-col items-center gap-1 rounded-xl border border-border py-2 text-[10px] text-muted-foreground"
              >
                <RotateCw className="h-4 w-4" />
                {t("rotateRight")}
              </button>
              <button
                onClick={() => setFlip((f) => !f)}
                className="press flex flex-col items-center gap-1 rounded-xl border border-border py-2 text-[10px] text-muted-foreground"
              >
                <FlipHorizontal className="h-4 w-4" />
                {t("flipPhoto")}
              </button>
              <button
                onClick={reset}
                className="press flex flex-col items-center gap-1 rounded-xl border border-border py-2 text-[10px] text-muted-foreground"
              >
                <RefreshCw className="h-4 w-4" />
                {t("resetPhoto")}
              </button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">
              {t("zoom")}: {zoom.toFixed(2)}x
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
