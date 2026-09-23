import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Tracker } from "@/components/Tracker";

const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "ReMade — Giving the past a future",
    template: "%s · ReMade",
  },
  description:
    "ReMade connects reclaimed wood from Lisbon's buildings with the architects and designers creating what comes next. Every material carries its history in a Material Passport.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "ReMade — Giving the past a future",
    description: "Reclaimed wood from Lisbon's buildings, with its history preserved.",
    images: ["/images/hero-beam.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${inter.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Tracker />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
