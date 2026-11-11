import { NextResponse } from "next/server";

// Liveness check for the hosting platform (e.g. Render "Health Check Path").
// Intentionally does not touch the database — it only confirms the server is up.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { status: "ok", uptime: Math.round(process.uptime()), timestamp: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
