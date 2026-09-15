import { CANVAS_H, CANVAS_W, drawInvite, type DrawInput } from "./render";

export type VideoResult = { blob: Blob; url: string; mime: string; ext: string };

function pickMime() {
  const candidates = [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const mime of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return "";
}

/**
 * Renders the invitation to an animated clip with optional music, entirely in the browser.
 */
export async function renderVideo(
  input: Omit<DrawInput, "progress">,
  opts: { seconds: number; musicUrl?: string | null },
): Promise<VideoResult> {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available on this device");

  const fps = 30;
  const stream = canvas.captureStream(fps);

  let audioEl: HTMLAudioElement | null = null;
  let audioCtx: AudioContext | null = null;
  if (opts.musicUrl) {
    try {
      audioEl = new Audio(opts.musicUrl);
      audioEl.crossOrigin = "anonymous";
      audioEl.loop = true;
      audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(audioEl);
      const dest = audioCtx.createMediaStreamDestination();
      source.connect(dest);
      dest.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
      await audioEl.play().catch(() => undefined);
    } catch {
      audioEl = null;
    }
  }

  const mime = pickMime();
  const recorder = new MediaRecorder(stream, {
    ...(mime ? { mimeType: mime } : {}),
    videoBitsPerSecond: 6_000_000,
  });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };

  const done = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
  });

  recorder.start(200);

  const totalMs = opts.seconds * 1000;
  const start = performance.now();
  await new Promise<void>((resolve) => {
    const tick = () => {
      const elapsed = performance.now() - start;
      // Reveal over the first 70% of the clip, then hold.
      const progress = Math.min(elapsed / (totalMs * 0.7), 1);
      drawInvite(ctx, { ...input, progress });
      if (elapsed >= totalMs) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  recorder.stop();
  const blob = await done;
  audioEl?.pause();
  await audioCtx?.close().catch(() => undefined);
  stream.getTracks().forEach((t) => t.stop());

  const type = blob.type || "video/webm";
  return { blob, url: URL.createObjectURL(blob), mime: type, ext: type.includes("mp4") ? "mp4" : "webm" };
}

export async function shareFile(file: File, title: string) {
  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    await nav.share({ files: [file], title, text: title });
    return true;
  }
  return false;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
