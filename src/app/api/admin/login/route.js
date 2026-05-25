import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const jwtSecret = process.env.JWT_SECRET || "astro_jwt_secret_key_xyz";

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate JWT token for admin session
    const token = jwt.sign(
      { role: "admin", authenticatedAt: Date.now() },
      jwtSecret,
      { expiresIn: "24h" } // 24-hour admin session
    );

    return NextResponse.json({
      success: true,
      token,
      message: "Admin authenticated successfully!"
    });
  } catch (error) {
    console.error("Admin login endpoint error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
