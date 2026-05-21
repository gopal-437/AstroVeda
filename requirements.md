# Project Requirements & Feature Specifications

This document serves as the single source of truth for the features, tech stack, pricing, and step-by-step implementation plan for the Astrology Platform MVP.

---

## 🛠️ Technology Stack
* **Framework**: Next.js (React 19, App Router)
* **Styling**: Vanilla CSS & CSS Modules (custom premium dark cosmic design system)
* **Payments**: Razorpay Checkout Integration (with test-mode fallback)
* **Security**: JWT-signed purchase tokens (database-less security, verification client-side/server-side)
* **Deployment**: Production-ready for Vercel/Netlify

---

## 💰 Pricing Matrix
| Feature | Type | Free Teaser Features | Paid Features | Suggested Price |
| :--- | :--- | :--- | :--- | :--- |
| **1. Daily Horoscope** | Retention | Mood score, lucky color, lucky number, love/career one-liners | *None (Fully Free)* | Free |
| **2. Compatibility Match** | Hook | Compatibility %, emotional score, short relationship insight | Long-term analysis, communication, red flags, intimacy, timeline | **₹19** |
| **3. Numerology Report** | Impulse | Life path number, lucky number, basic personality insight | Career/wealth numbers, lucky dates, relationship, year prediction | **₹19** |
| **4. Career Prediction** | Professional | Career score, one-line career prediction | Job switch/promotion timing, business success, wealth analysis | **₹19** |
| **5. Palm Scan AI** | Viral Hook | Simulated vector line detection, 2-3 teaser insights | Love, head, life line full analysis, future timeline, PDF report | **₹29** |
| **6. Marriage Prediction** | High-Value | Marriage possibility score, general marriage age range | Best years, love vs arranged, partner traits, obstacles, stability | **₹29** |
| **7. Future Timeline** | Visual Hook | Next 30 days mood/fortune overview, 1 highlighted event | 1-year timeline, career growth, financial & relationship cycles | **₹29** |
| **8. Kundli / Birth Chart** | Core Cred | Basic Vedic chart SVG, Nakshatra, planet positions table | Full PDF, Dosha/Yog analysis, career/wealth remedies, full reports | **₹49** |

---

## 🎨 Premium Visual Theme
* **Theme**: Deep Cosmic Dark Mode
* **Backgrounds**: Deep space blue/violet (`#080710`, `#121026`) with glowing radial gradients.
* **Accents**: Celestial gold (`#dfb750`), cosmic magenta (`#e93d82`), glowing cyan (`#00f5ff`).
* **Animations**: Laser scanning for Palm Scan, dial spin for Compatibility, smooth charts for Future Timeline.
* **Layout**: Clean grid sections in order of conversion potential:
  1. Palm Scan AI (First, highest viral conversion)
  2. Compatibility Match
  3. Marriage Prediction
  4. Future Timeline
  5. Kundli Report
  6. Career Prediction
  7. Numerology
  8. Daily Horoscope (Last, daily return traffic)

---

## 🏗️ Step-by-Step Build Plan
We will build, test, and verify features in this sequential order:

* [ ] **Step 1: Setup & Cosmic Core System**
  * Initialize Next.js project inside the workspace.
  * Implement `globals.css` with color variables, animations, and typography (Outfit/Inter).
  * Build page layout and cosmic header.
* [ ] **Step 2: Core Payment & Token API (Razorpay + JWT)**
  * Create `/api/checkout` and `/api/verify` routes.
  * Create client-side `CheckoutModal` integrating Razorpay SDK with fallback testing support.
  * Setup token-verification route `/api/report` to server-side encrypt/decrypt report payloads.
* [ ] **Step 3: Feature 1 - Daily Horoscope**
  * Build zodiac selectors, mood progress bars, and randomized (but seed-locked) daily horoscopes.
* [ ] **Step 4: Feature 2 - Compatibility / Love Match**
  * Implement side-by-side DOB inputs, synastry score speedometers, and the ₹19 premium relationship timeline.
* [ ] **Step 5: Feature 3 - Numerology Report**
  * Add Pythagorean calculation rules, digital number badges, and the ₹19 premium destiny roadmap.
* [ ] **Step 6: Feature 4 - Career Prediction**
  * Create professional career scores, job-switch timing indicators, and the ₹19 premium business guidance.
* [ ] **Step 7: Feature 5 - Palm Scan AI**
  * Build canvas-based scanner interface with file uploads, animated scanning lasers, vector mapping, and the ₹29 full analysis report.
* [ ] **Step 8: Feature 6 - Marriage Prediction**
  * Create relationship timeline meters, love vs. arranged predictions, and the ₹29 marriage obstacle advisor.
* [ ] **Step 9: Feature 7 - Future Timeline**
  * Implement SVG line graph rendering for future life cycles, showing the ₹29 1-year timeline preview.
* [ ] **Step 10: Feature 8 - Kundli / Birth Chart**
  * Develop Vedic chart calculation engine (North Indian style SVG), planet grids, and the ₹49 Dosha/Yog premium report.
* [ ] **Step 11: Production Verification & PDF Styles**
  * Test print styles (PDF exports), error handling, environment configs, and verify deployment parameters.
