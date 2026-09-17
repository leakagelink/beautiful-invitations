import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X, ZoomIn, ZoomOut } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { loadImage } from "@/lib/render";

const OUT = 900; // exported crop size (px)

type Props = {
  src: string;
  onApply: (croppedDataUrl: string) => void;
  onCancel: () => void;
};

/**
 * Square cropper with pinch-style zoom slider and drag-to-move.
 * Exports an 900x900 JPEG data URL covering exactly the visible square.
 */
export function PhotoCropper({ src, onApply, onCancel }: Props) {
  const { t } = useLang();
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [box, setBox] = useState(320);
  const areaRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    let alive = true;
    loadImage(src).then((el) => {
      if (alive) {
        setImg(el);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      }
    });
    return () => {
      alive = false;
    };
  }, [src]);

  // Measure the crop square once mounted.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setBox(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const coverScale = img ? Math.max(box / img.naturalWidth, box / img.naturalHeight) : 1;
  const drawW = img ? img.naturalWidth * coverScale * zoom : 0;
  const drawH = img ? img.naturalHeight * coverScale * zoom : 0;

  const clampOffset = useCallback(
    (o: { x: number; y: number }, z: number) => {
      if (!img) return o;
      const w = img.naturalWidth * coverScale * z;
      const h = img.naturalHeight * coverScale * z;
      const mx = Math.max(0, (w - box) / 2);
      const my = Math.max(0, (h - box) / 2);
      return { x: Math.min(mx, Math.max(-mx, o.x)), y: Math.min(my, Math.max(-my, o.y)) };
    },
    [img, coverScale, box],
  );

  const changeZoom = (z: number) => {
    const next = Math.min(3, Math.max(1, z));
    setZoom(next);
    setOffset((o) => clampOffset(o, next));
  };

  function apply() {
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const k = OUT / box; // view -> output scale
    const w = drawW * k;
    const h = drawH * k;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, OUT, OUT);
    ctx.drawImage(img, OUT / 2 + offset.x * k - w / 2, OUT / 2 + offset.y * k - h / 2, w, h);
    onApply(canvas.toDataURL("image/jpeg", 0.92));
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onCancel}
          aria-label={t("cancelCrop")}
          className="press flex h-10 w-10 items-center justify-center rounded-full border border-border"
        >
          <X className="h-5 w-5" />
        </button>
        <p className="text-sm font-semibold">{t("cropTitle")}</p>
        <button
          onClick={apply}
          aria-label={t("applyCrop")}
          className="btn-gold press flex h-10 w-10 items-center justify-center rounded-full"
        >
          <Check className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <div
          ref={areaRef}
          className="relative aspect-square w-full max-w-[340px] touch-none overflow-hidden rounded-2xl border border-border bg-black"
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            dragRef.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
          }}
          onPointerMove={(e) => {
            const d = dragRef.current;
            if (!d) return;
            setOffset(
              clampOffset({ x: d.ox + (e.clientX - d.px), y: d.oy + (e.clientY - d.py) }, zoom),
            );
          }}
          onPointerUp={() => (dragRef.current = null)}
          onPointerCancel={() => (dragRef.current = null)}
        >
          {img ? (
            <img
              src={src}
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
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[340px] items-center gap-3 px-2 pb-10 pt-4">
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
          max={3}
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
    </div>
  );
}
