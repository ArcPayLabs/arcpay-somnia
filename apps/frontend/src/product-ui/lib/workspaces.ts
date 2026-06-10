import { getOptionalSupabaseClient } from "../../app/supabase-client";

type SupabaseClient = NonNullable<ReturnType<typeof getOptionalSupabaseClient>>;
export type ArcPayNetwork = "somnia" | "mantle" | "arbitrum";

export type WorkspaceRecord = {
  id: string;
  name: string;
  network: ArcPayNetwork;
  isActive: boolean;
  source: "cloud" | "local";
};

const DEFAULT_WORKSPACE: Record<ArcPayNetwork, string> = {
  somnia: "Somnia agent treasury",
  mantle: "Mantle agent treasury",
  arbitrum: "Arbitrum agent treasury",
};

const CACHE_PREFIX = "arcpay-workspaces";

export function loadCachedWorkspaces(network: ArcPayNetwork, fallbackName = DEFAULT_WORKSPACE[network]): WorkspaceRecord[] {
  if (typeof window === "undefined") return [localWorkspace(network, fallbackName)];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(cacheKey(network)) ?? "null") as WorkspaceRecord[] | null;
    const rows = Array.isArray(parsed)
      ? parsed.filter((row) => row?.network === network && typeof row.name === "string" && row.name.trim())
      : [];
    if (rows.length) return ensureOneActive(rows);
  } catch {
    window.localStorage.removeItem(cacheKey(network));
  }

  return [localWorkspace(network, fallbackName)];
}

export function saveCachedWorkspaces(network: ArcPayNetwork, workspaces: WorkspaceRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cacheKey(network), JSON.stringify(ensureOneActive(workspaces)));
}

export async function loadWorkspaces(
  supabase: SupabaseClient,
  network: ArcPayNetwork,
  fallbackName = DEFAULT_WORKSPACE[network],
): Promise<WorkspaceRecord[]> {
  const fallback = loadCachedWorkspaces(network, fallbackName);
  const userId = await getUserId(supabase);
  if (!userId) return fallback;

  try {
    const { data, error } = await supabase
      .from("arcpay_workspaces")
      .select("id, name, network, is_active")
      .eq("user_id", userId)
      .eq("network", network)
      .order("is_active", { ascending: false })
      .order("updated_at", { ascending: false });

    if (error) return fallback;

    if (!data?.length) {
      const created = await createWorkspace(supabase, network, fallbackName);
      return created ? [created] : fallback;
    }

    const hasActive = data.some((row) => row.is_active);
    const rows = data.map((row, index) => ({
      id: row.id,
      name: row.name,
      network: row.network,
      isActive: row.is_active || (!hasActive && index === 0),
      source: "cloud" as const,
    }));

    const active = rows.find((row) => row.isActive) ?? rows[0];
    saveCachedWorkspaces(network, rows);
    if (active) void syncWorkspaceSettings(supabase, userId, network, active.name);
    return rows;
  } catch {
    return fallback;
  }
}

export async function createWorkspace(
  supabase: SupabaseClient,
  network: ArcPayNetwork,
  name: string,
): Promise<WorkspaceRecord | null> {
  const cleanName = name.trim();
  if (!cleanName) return null;

  const local = localWorkspace(network, cleanName);
  saveCachedWorkspaces(network, [local]);

  const userId = await getUserId(supabase);
  if (!userId) return local;

  const now = new Date().toISOString();
  const deactivate = await supabase
    .from("arcpay_workspaces")
    .update({ is_active: false, updated_at: now })
    .eq("user_id", userId)
    .eq("network", network);

  if (deactivate.error) {
    void syncWorkspaceSettings(supabase, userId, network, cleanName);
    return local;
  }

  const { data, error } = await supabase
    .from("arcpay_workspaces")
    .upsert(
      { user_id: userId, network, name: cleanName, is_active: true, updated_at: now },
      { onConflict: "user_id,network,name" },
    )
    .select("id, name, network, is_active")
    .single();

  void syncWorkspaceSettings(supabase, userId, network, cleanName);
  if (error || !data) return local;

  const workspace = { id: data.id, name: data.name, network: data.network, isActive: true, source: "cloud" as const };
  saveCachedWorkspaces(network, [workspace]);
  return workspace;
}

export async function activateWorkspace(
  supabase: SupabaseClient,
  network: ArcPayNetwork,
  workspace: WorkspaceRecord,
) {
  saveCachedWorkspaces(network, [{ ...workspace, isActive: true }]);

  const userId = await getUserId(supabase);
  if (!userId) return true;

  if (workspace.source === "cloud") {
    const now = new Date().toISOString();
    await supabase.from("arcpay_workspaces").update({ is_active: false, updated_at: now }).eq("user_id", userId).eq("network", network);
    const { error } = await supabase
      .from("arcpay_workspaces")
      .update({ is_active: true, updated_at: now })
      .eq("user_id", userId)
      .eq("network", network)
      .eq("id", workspace.id);
    if (error) return true;
  }

  void syncWorkspaceSettings(supabase, userId, network, workspace.name);
  return true;
}

async function syncWorkspaceSettings(supabase: SupabaseClient, userId: string, network: ArcPayNetwork, name: string) {
  try {
    await supabase.from("user_workspace_settings").upsert(
      {
        user_id: userId,
        workspace_name: name,
        default_network: network as never,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
  } catch {
    // Local workspace cache keeps the UI usable when cloud sync is temporarily unavailable.
  }
}

async function getUserId(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user?.id ?? null;
}

function localWorkspace(network: ArcPayNetwork, name: string): WorkspaceRecord {
  return { id: `local-${network}-${slugify(name)}`, name, network, isActive: true, source: "local" };
}

function ensureOneActive(workspaces: WorkspaceRecord[]) {
  const hasActive = workspaces.some((workspace) => workspace.isActive);
  return workspaces.map((workspace, index) => ({
    ...workspace,
    isActive: workspace.isActive || (!hasActive && index === 0),
  }));
}

function cacheKey(network: ArcPayNetwork) {
  return `${CACHE_PREFIX}:${network}`;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "workspace";
}
