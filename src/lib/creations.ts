export type InviteFields = {
  title: string;
  subtitle: string;
  date: string;
  message: string;
  footer: string;
};

export type Creation = {
  id: string;
  templateId: string;
  fields: InviteFields;
  photo?: string | null;
  updatedAt: number;
};

const KEY = "utsav.creations";

function read(): Creation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Creation[]) : [];
  } catch {
    return [];
  }
}

export function listCreations(): Creation[] {
  return read().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getCreation(id: string): Creation | undefined {
  return read().find((c) => c.id === id);
}

export function saveCreation(c: Omit<Creation, "updatedAt">): Creation {
  const all = read().filter((x) => x.id !== c.id);
  const next = { ...c, updatedAt: Date.now() };
  all.push(next);
  window.localStorage.setItem(KEY, JSON.stringify(all));
  return next;
}

export function deleteCreation(id: string) {
  window.localStorage.setItem(KEY, JSON.stringify(read().filter((c) => c.id !== id)));
}
