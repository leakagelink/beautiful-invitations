import { useEffect, useState } from "react";
import { allTemplates, subscribeTemplates } from "@/lib/customTemplates";
import { templates as builtIn, type Template } from "@/lib/templates";

/** Built-in templates plus the ones added in the Admin Panel on this device. */
export function useTemplates(occasion?: string): Template[] {
  const [list, setList] = useState<Template[]>(builtIn);

  useEffect(() => {
    const sync = () => setList(allTemplates());
    sync();
    return subscribeTemplates(sync);
  }, []);

  return occasion ? list.filter((t) => t.occasion === occasion) : list;
}

export function useTemplate(id: string): Template | undefined {
  return useTemplates().find((t) => t.id === id);
}
