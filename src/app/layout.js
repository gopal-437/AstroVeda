import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "AstroVeda | Premium Vedic Astrology & Predictions",
  description: "Discover your cosmic blueprint. Get personalized daily horoscopes, Vedic Kundli birth charts, compatibility matchmaking, marriage timelines, AI palm scanning, and career predictions.",
  metadataBase: new URL("https://astroveda-mvp.vercel.app"),
  openGraph: {
    title: "AstroVeda | Premium Vedic Astrology & Predictions",
    description: "Get daily horoscopes, Vedic Kundli, compatibility matches, marriage forecasts, AI palm readings, and future timelines.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

