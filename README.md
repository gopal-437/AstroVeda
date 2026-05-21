# 🔮 AstroVeda — Premium Vedic Astrology & Predictions Portal

AstroVeda is a high-end, responsive Web3-themed astrology platform powered by Next.js and authentic Vedic mathematics. The site includes a modern cosmic purple design, animated geometry wheels, real-time calculators, print/PDF layout isolations, and a secure serverless payment gateway integration using Razorpay and JWT-signed purchase tokens.

---

## ✨ Features & Modules

1. **🔮 Daily Horoscope (Free)**: Interactive sun sign selector featuring calculated mood scores, lucky numbers, color matches, and personal readings.
2. **✋ Cosmic Palm Scan (Premium — ₹29)**: Simulated palm vector lines scanner with interactive concentric progress meters, mounts, and detailed milestone timelines.
3. **❤️ Love Compatibility (Premium — ₹19)**: Dual partner chart calculator rendering a custom SVG speedometer gauge measuring relationship synastry.
4. **💍 Marriage Prediction (Premium — ₹29)**: Favorable wedding age indicators, Seventh House transit guides, and union obstacle checklists.
5. **📈 Future Timeline (Premium — ₹29)**: Visual HTML5 SVG line graph plotting a 30-day timeline with interactive hover coordinates and peaks.
6. **☸️ Kundli / Birth Chart (Premium — ₹49)**: Interactive North Indian natal chart plotting planetary placements with Manglik/Kaal Sarp Dosha shields and clicked gemstone guidelines.
7. **💼 Career Prediction (Premium — ₹19)**: Custom SVG career score gauge, job-switch timing graphs, and wealth generation streams.
8. **🔢 Numerology Report (Premium — ₹19)**: Pythagorean calculators computing Life Path, Destiny, Soul Urge, and Birth Day coordinates.

---

## 🛠️ Technology Stack
- **Framework**: Next.js (App Router, Turbopack optimized)
- **Styling**: Pure CSS / CSS Modules
- **Payments**: Razorpay Checkout SDK integration
- **Security**: Stateless JSON Web Token (JWT) signature checks to verify purchased sections database-lessly.

---

## ⚙️ Environment Variables Config
Create a `.env.local` file in the root directory to run payments:
```env
# Razorpay Credentials (https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Secret JWT Key
JWT_SECRET=your_super_secret_jwt_key
```

---

## 🚀 Getting Started

First, install dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Production Build & Deploy

Verify compile correctness locally:
```bash
npm run build
```

This app compiles into a hybrid of static (`○`) and dynamic (`ƒ`) routes, optimized for deployment on Vercel.
