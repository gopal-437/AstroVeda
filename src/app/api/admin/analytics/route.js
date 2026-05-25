import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getAnalyticsData } from "@/lib/db";

export async function GET(request) {
  try {
    // Read the authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET || "astro_jwt_secret_key_xyz";

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Verify user role
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Access denied: Unauthorized role" }, { status: 403 });
    }

    // Fetch and return metrics
    const analytics = await getAnalyticsData();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Admin analytics endpoint error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
