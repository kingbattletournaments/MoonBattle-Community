import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modeId = searchParams.get("modeId");
  const store = getStore();

  if (modeId) {
    const mode = await store.getMode(modeId);
    if (!mode) return NextResponse.json({ error: "Mode not found" }, { status: 404 });
    return NextResponse.json(mode, { headers: NO_STORE_HEADERS });
  }

  const gameId = searchParams.get("gameId") ?? searchParams.get("game_id");

  // Prefer per-game fetch — unfiltered queries have returned [] in production.
  if (gameId) {
    const modes = await store.gameModes(gameId);
    return NextResponse.json(modes, { headers: NO_STORE_HEADERS });
  }

  const games = await store.games();
  const perGame = await Promise.all(games.map((g) => store.gameModes(g.id)));
  const modes = perGame.flat();
  return NextResponse.json(modes, { headers: NO_STORE_HEADERS });
}
