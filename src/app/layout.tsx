import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";

const barlow = Barlow_Condensed({ variable: "--font-barlow", subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Loja Camões Andebol — Reservas", template: "%s · Loja Camões Andebol" },
  description: "Reserva o equipamento oficial e o merchandising do Camões Andebol (Clube Desportivo Escolar Camões, Lisboa).",
  openGraph: { images: ["/fotos/amarelo-10.jpg"], locale: "pt_PT" },
};

export const viewport: Viewport = { themeColor: "#13294F" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-PT" className={`${barlow.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header logo={<Logo light />} />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
