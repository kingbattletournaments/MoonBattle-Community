import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getAdminSession } from "@/lib/admin-auth";
import { invalidateAdminApiCache } from "@/lib/admin-api-cache";

async function checkGameAccess(adminId: string, gameId: string): Promise<boolean> {
  const store = getStore();
  const admin = await store.getAdminById(adminId);
  if (!admin) return false;
  if (admin.isMasterAdmin || admin.gamesAccessType === "all") return true;
  return admin.allowedGameIds.includes(gameId);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!(await checkGameAccess(admin.id, id))) {
    return NextResponse.json({ error: "No access to this game" }, { status: 403 });
  }
  const store = getStore();
  const ok = await store.deleteGame(id);
  if (!ok) return NextResponse.json({ error: "Game not found" }, { status: 404 });
  invalidateAdminApiCache("games:");
  invalidateAdminApiCache("public:games");
  invalidateAdminApiCache("modes:");
  invalidateAdminApiCache("public:modes");
  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!(await checkGameAccess(admin.id, id))) {
    return NextResponse.json({ error: "No access to this game" }, { status: 403 });
  }
  const body = await request.json();
  const { name, imageUrl } = body as { name?: string; imageUrl?: string | null };

  const hasName = typeof name === "string" && name.trim().length > 0;
  const hasImageUrl = imageUrl !== undefined;

  if (!hasName && !hasImageUrl) {
    return NextResponse.json({ error: "name or imageUrl is required" }, { status: 400 });
  }

  const updates: { name?: string; imageUrl?: string | null } = {};
  if (hasName) updates.name = name.trim();
  if (hasImageUrl) updates.imageUrl = imageUrl;

  const store = getStore();
  const game = await store.updateGame(id, updates);
  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });
  invalidateAdminApiCache("games:");
  invalidateAdminApiCache("public:games");
  return NextResponse.json(game);
}
