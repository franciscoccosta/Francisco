import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { MaterialFilterDefs } from "@/components/visuals/MaterialFilters";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ReMade — Furniture with a past",
    template: "%s · ReMade",
  },
  description:
    "ReMade recovers surplus material from construction projects and gives it a second form. Every piece is one of one.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt" className={`${instrumentSerif.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-charcoal">
        <MaterialFilterDefs />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
