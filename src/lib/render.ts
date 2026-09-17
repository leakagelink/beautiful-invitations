import type { InviteFields } from "./creations";
import type { Template } from "./templates";

export const CANVAS_W = 810;
export const CANVAS_H = 1080;

export type DrawInput = {
  bg: HTMLImageElement;
  photo?: HTMLImageElement | null;
  template: Template;
  fields: InviteFields;
  /** 0 → 1 animation progress. Use 1 for a static render. */
  progress?: number;
};

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load image: ${src}`));
    img.src = src;
  });
}

function ease(t: number) {
  return 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
}

function stage(progress: number, start: number, span = 0.18) {
  return ease((progress - start) / span);
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const ratio = Math.max(w / img.width, h / img.height);
  const dw = img.width * ratio;
  const dh = img.height * ratio;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    lines.push(line);
  }
  return lines;
}

function centerText(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const lines = wrap(ctx, text, maxWidth);
  lines.forEach((line, i) => ctx.fillText(line, CANVAS_W / 2, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

const DISPLAY = `"Fraunces", "Noto Serif Telugu", Georgia, serif`;
const BODY = `"Manrope", "Noto Sans Telugu", system-ui, sans-serif`;

/** Finds the biggest font size that keeps the text within maxWidth and maxLines. */
function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  base: number,
  min: number,
  maxLines: number,
  family: string,
  weight: number,
) {
  const original = ctx.font;
  let size = base;
  while (size > min) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (wrap(ctx, text, maxWidth).length <= maxLines) break;
    size -= 2;
  }
  ctx.font = original;
  return size;
}

/** Draws one frame of the invitation. Shared by the live preview, PNG export and video export. */
export function drawInvite(ctx: CanvasRenderingContext2D, input: DrawInput) {
  const p = input.progress ?? 1;
  const { template, fields, bg, photo } = input;

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = "#f6f1e6";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Slow ken-burns on the background
  const zoom = 1 + 0.06 * ease(p);
  const zw = CANVAS_W * zoom;
  const zh = CANVAS_H * zoom;
  drawCover(ctx, bg, (CANVAS_W - zw) / 2, (CANVAS_H - zh) / 2, zw, zh);

  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  let y = 210;

  if (photo) {
    const a = stage(p, 0.02, 0.25);
    const r = 150;
    const cx = CANVAS_W / 2;
    const cy = 300;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.save();
    ctx.clip();
    const size = r * 2;
    drawCover(ctx, photo, cx - r, cy - r, size, size);
    ctx.restore();
    ctx.lineWidth = 8;
    ctx.strokeStyle = template.accent;
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.beginPath();
    ctx.arc(cx, cy, r + 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    y = cy + r + 60;
  }

  // Subtitle
  ctx.globalAlpha = stage(p, 0.15);
  ctx.fillStyle = template.accent;
  ctx.font = `500 26px ${BODY}`;
  y = centerText(ctx, fields.subtitle, y, CANVAS_W - 200, 36) + 18;

  // Title — long names automatically shrink so they never spill out of the card
  ctx.globalAlpha = stage(p, 0.28, 0.22);
  ctx.fillStyle = template.ink;
  const titleSize = fitFontSize(ctx, fields.title, CANVAS_W - 150, 64, 32, 2, DISPLAY, 700);
  ctx.font = `700 ${titleSize}px ${DISPLAY}`;
  y = centerText(ctx, fields.title, y, CANVAS_W - 150, Math.round(titleSize * 1.22)) + 26;

  // Divider
  ctx.globalAlpha = stage(p, 0.45);
  ctx.strokeStyle = template.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CANVAS_W / 2 - 90, y);
  ctx.lineTo(CANVAS_W / 2 + 90, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(CANVAS_W / 2, y, 7, 0, Math.PI * 2);
  ctx.fillStyle = template.accent;
  ctx.fill();
  y += 36;

  // Date
  ctx.globalAlpha = stage(p, 0.55);
  ctx.fillStyle = template.ink;
  ctx.font = `700 32px ${BODY}`;
  y = centerText(ctx, fields.date, y, CANVAS_W - 160, 44) + 26;

  // Message
  ctx.globalAlpha = stage(p, 0.68);
  ctx.font = `400 28px ${BODY}`;
  ctx.fillStyle = template.ink;
  y = centerText(ctx, fields.message, y, CANVAS_W - 220, 40) + 30;

  // Footer
  ctx.globalAlpha = stage(p, 0.82);
  ctx.font = `600 26px ${BODY}`;
  ctx.fillStyle = template.accent;
  centerText(ctx, fields.footer, y, CANVAS_W - 220, 36);

  ctx.globalAlpha = 1;
}

export async function ensureFonts() {
  if (typeof document !== "undefined" && "fonts" in document) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }
}
