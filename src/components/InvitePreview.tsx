import { useEffect, useRef, useState } from "react";
import type { InviteFields } from "@/lib/creations";
import { CANVAS_H, CANVAS_W, drawInvite, ensureFonts, loadImage } from "@/lib/render";
import type { Template } from "@/lib/templates";

type Props = {
  template: Template;
  fields: InviteFields;
  photo?: string | null;
  className?: string;
  /** Replays the reveal animation whenever this value changes. */
  animateKey?: string | number;
};

export function InvitePreview({ template, fields, photo, className, animateKey }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null);
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      await ensureFonts();
      const img = await loadImage(template.bg);
      if (alive) setBgImg(img);
    })();
    return () => {
      alive = false;
    };
  }, [template.bg]);

  useEffect(() => {
    let alive = true;
    if (!photo) {
      setPhotoImg(null);
      return;
    }
    void loadImage(photo).then((img) => {
      if (alive) setPhotoImg(img);
    });
    return () => {
      alive = false;
    };
  }, [photo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bgImg) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = () => {
      const progress = Math.min((performance.now() - start) / duration, 1);
      drawInvite(ctx, { bg: bgImg, photo: photoImg, template, fields, progress });
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bgImg, photoImg, template, fields, animateKey]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      className={
        className ??
        "w-full rounded-2xl border border-border bg-muted shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
      }
    />
  );
}
