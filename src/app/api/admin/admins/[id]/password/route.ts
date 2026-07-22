import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getAdminSession } from "@/lib/admin-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (admin.id !== id) {
    return NextResponse.json({ error: "You can only change your own password" }, { status: 403 });
  }
  const body = await request.json();
  const { newPassword } = body;
  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }
  const ok = await getStore().updateAdminPassword(admin.id, id, newPassword);
  if (!ok) return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  return NextResponse.json({ success: true });
}
