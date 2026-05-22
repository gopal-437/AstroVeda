import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { generateAstrologyReport } from "@/lib/astrology-engine";
import { getBirthHash } from "@/lib/astrology-engine/helpers";

export async function POST(request) {
  try {
    const { featureId, birthDetails, token, lang } = await request.json();

    if (!featureId || !birthDetails) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    let isPremium = false;

    // Horoscope is a fully free feature
    if (featureId === "horoscope") {
      isPremium = true;
    } else if (token) {
      try {
        const jwtSecret = process.env.JWT_SECRET || "astro_jwt_secret_key_xyz";
        const decoded = jwt.verify(token, jwtSecret);

        // Verify that the token corresponds to the requested feature
        // AND that it matches the hash of the current birth details (prevents sharing tokens)
        const currentHash = getBirthHash(birthDetails);
        
        if (decoded.featureId === featureId && decoded.birthHash === currentHash) {
          isPremium = true;
        } else {
          console.warn("JWT Verification failed: Feature ID or Birth Details Hash mismatch.");
        }
      } catch (err) {
        console.warn("JWT token verification failed:", err.message);
        // Token is invalid/expired, keep isPremium = false
      }
    }

    // Generate the report using the hybrid astrology engine
    const reportData = generateAstrologyReport(featureId, birthDetails, isPremium, lang);

    return NextResponse.json(reportData);
  } catch (error) {
    console.error("Report generation endpoint error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
