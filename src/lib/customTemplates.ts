import { templates as builtIn, type Template } from "./templates";

export type CustomTemplate = Template & { custom: true; createdAt: number };

const KEY = "utsav.customTemplates";
const EVENT = "utsav:templates";

function read(): CustomTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CustomTemplate[]) : [];
  } catch {
    return [];
  }
}

function write(list: CustomTemplate[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

export function listCustomTemplates(): CustomTemplate[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function addCustomTemplate(input: Omit<Template, "id">): CustomTemplate {
  const tpl: CustomTemplate = {
    ...input,
    id: `cust-${Date.now().toString(36)}`,
    custom: true,
    createdAt: Date.now(),
  };
  write([tpl, ...read()]);
  return tpl;
}

export function deleteCustomTemplate(id: string) {
  write(read().filter((t) => t.id !== id));
}

export function isCustomId(id: string) {
  return id.startsWith("cust-");
}

export function allTemplates(): Template[] {
  return [...listCustomTemplates(), ...builtIn];
}

export function findTemplate(id: string): Template | undefined {
  return allTemplates().find((t) => t.id === id);
}

export function subscribeTemplates(fn: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}

/** Shrinks an uploaded picture to the invitation canvas size so it fits in device storage. */
export async function toBackgroundDataUrl(file: File, w = 810, h = 1080): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the image"));
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Could not open the image"));
    i.src = dataUrl;
  });
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  const ratio = Math.max(w / img.width, h / img.height);
  const dw = img.width * ratio;
  const dh = img.height * ratio;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return canvas.toDataURL("image/jpeg", 0.82);
}
