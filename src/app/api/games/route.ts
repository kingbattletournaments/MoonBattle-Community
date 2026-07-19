import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

/** Always read from DB — do not freeze the list at build time or in-memory. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
} as const;

export async function GET() {
  const store = getStore();
  const games = await store.games();
  return NextResponse.json(games, { headers: NO_STORE_HEADERS });
}
