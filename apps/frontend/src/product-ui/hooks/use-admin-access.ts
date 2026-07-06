"use client";

import { useEffect, useState } from "react";

type AdminState = {
  readonly admin: boolean;
  readonly address: string;
  readonly loading: boolean;
};

export function useAdminAccess(): AdminState {
  const [state, setState] = useState<AdminState>({ admin: false, address: "", loading: true });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch("/api/admin/me", { cache: "no-store" });
        const body = await response.json().catch(() => ({})) as { admin?: boolean; address?: string };
        if (!mounted) return;
        setState({ admin: response.ok && Boolean(body.admin), address: body.address ?? "", loading: false });
      } catch {
        if (!mounted) return;
        setState({ admin: false, address: "", loading: false });
      }
    }

    void load();
    window.addEventListener("storage", load);
    return () => {
      mounted = false;
      window.removeEventListener("storage", load);
    };
  }, []);

  return state;
}
