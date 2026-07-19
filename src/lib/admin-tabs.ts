/**
 * Admin sidebar tabs and permission helpers.
 *
 * Change only labels/ids here — sidebar, create-admin checkboxes, and
 * canAccessAdminTab() all read from this list.
 */

export const ADMIN_TAB_DEFINITIONS = [
  { id: "games", label: "Games" },
  { id: "moneyorders", label: "Deposits" },
  { id: "withdrawals", label: "Withdrawals" },
  { id: "transactions", label: "Transactions" },
  { id: "users", label: "Users" },
  { id: "appsettings", label: "App Setting" },
  { id: "admins", label: "Admin" },
] as const;

export type AdminTabId = (typeof ADMIN_TAB_DEFINITIONS)[number]["id"];
export type AdminPanelTab = AdminTabId | "dashboard";

export type AdminTabAccess = Record<AdminTabId, boolean>;

export const ALL_ADMIN_TAB_IDS: AdminTabId[] = ADMIN_TAB_DEFINITIONS.map((t) => t.id);

export function emptyTabAccess(): AdminTabAccess {
  return Object.fromEntries(ALL_ADMIN_TAB_IDS.map((id) => [id, false])) as AdminTabAccess;
}

export function masterTabAccess(): AdminTabAccess {
  return Object.fromEntries(ALL_ADMIN_TAB_IDS.map((id) => [id, true])) as AdminTabAccess;
}

type LegacyAdminFields = {
  isMasterAdmin: boolean;
  usersAccess: boolean;
  coinsAccess: boolean;
  gamesAccessType: "all" | "specific";
  allowedGameIds: string[];
  tabAccess?: (Partial<AdminTabAccess> & {
    modes?: boolean;
    presets?: boolean;
    storage?: boolean;
    notifications?: boolean;
    referrals?: boolean;
    banners?: boolean;
  }) | null;
};

export function normalizeTabAccess(admin: LegacyAdminFields): AdminTabAccess {
  if (admin.isMasterAdmin) return masterTabAccess();

  if (admin.tabAccess && typeof admin.tabAccess === "object") {
    const merged = emptyTabAccess();
    for (const id of ALL_ADMIN_TAB_IDS) {
      merged[id] = !!admin.tabAccess[id];
    }
    // Migrate legacy "modes" tab permission → "games"
    if (!merged.games && admin.tabAccess.modes) {
      merged.games = true;
    }
    return merged;
  }

  const tabs = emptyTabAccess();
  const hasGames = admin.gamesAccessType === "all" || (admin.allowedGameIds?.length ?? 0) > 0;
  if (hasGames) {
    tabs.games = true;
  }
  if (admin.coinsAccess) {
    tabs.moneyorders = true;
    tabs.withdrawals = true;
    tabs.transactions = true;
  }
  if (admin.usersAccess) {
    tabs.users = true;
  }
  return tabs;
}

/** Maps tab checkboxes to legacy DB columns used by existing API routes. */
export function legacyPermissionsFromTabAccess(tabAccess: Partial<AdminTabAccess>) {
  const tabs = { ...emptyTabAccess(), ...tabAccess };
  return {
    usersAccess: tabs.users || tabs.appsettings || tabs.admins,
    coinsAccess: tabs.moneyorders || tabs.withdrawals || tabs.transactions,
    gamesAccessType: (tabs.games ? "all" : "specific") as "all" | "specific",
    allowedGameIds: [] as string[],
  };
}

export function canAccessAdminTab(admin: LegacyAdminFields, tab: AdminPanelTab): boolean {
  if (tab === "dashboard") return true;
  if (admin.isMasterAdmin) return true;
  return normalizeTabAccess(admin)[tab];
}

export function visibleAdminTabDefinitions(admin: LegacyAdminFields) {
  return ADMIN_TAB_DEFINITIONS.filter((def) => canAccessAdminTab(admin, def.id));
}

export function tabAccessLabel(id: AdminTabId): string {
  return ADMIN_TAB_DEFINITIONS.find((t) => t.id === id)?.label ?? id;
}

export function adminClientPayload(admin: LegacyAdminFields & { id: string; adminname: string }) {
  const tabAccess = normalizeTabAccess(admin);
  return {
    id: admin.id,
    adminname: admin.adminname,
    isMasterAdmin: admin.isMasterAdmin,
    usersAccess: admin.usersAccess,
    coinsAccess: admin.coinsAccess,
    gamesAccessType: admin.gamesAccessType,
    allowedGameIds: admin.allowedGameIds,
    tabAccess,
  };
}
