import { NextResponse } from "next/server";
import { lookupSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const result = await lookupSession();

    if (result.status === "none") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (result.status === "inactive") {
      return NextResponse.json({ error: "Not authorized as admin" }, { status: 403 });
    }

    return NextResponse.json({ admin: result.admin });
  } catch (error) {
    console.error("Error fetching admin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
