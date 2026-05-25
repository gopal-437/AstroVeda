import { NextResponse } from "next/server";
import { trackVisit } from "@/lib/db";

export async function POST(request) {
  try {
    const { eventType, moduleName, country, city, ip } = await request.json();

    if (!eventType) {
      return NextResponse.json({ error: "Missing eventType parameter" }, { status: 400 });
    }

    // Capture IP from server headers if client didn't supply a valid one
    let finalIp = ip;
    if (!finalIp || finalIp === "Unknown IP" || finalIp === "127.0.0.1" || finalIp === "::1") {
      finalIp = request.headers.get("x-forwarded-for")?.split(",")[0] || 
                 request.headers.get("x-real-ip") || 
                 ip || 
                 "Unknown IP";
    }

    const loggedVisit = await trackVisit({
      eventType,
      moduleName,
      country,
      city,
      ip: finalIp
    });

    return NextResponse.json({ success: true, visit: loggedVisit });
  } catch (error) {
    console.error("Track endpoint error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
