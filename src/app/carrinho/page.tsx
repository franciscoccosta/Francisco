import type { Metadata } from "next";
import { Checkout } from "./Checkout";

export const metadata: Metadata = { title: "A tua reserva", robots: { index: false } };

export default function CarrinhoPage() {
  return (
    <div className="wrap py-10 md:py-14">
      <h1 className="display text-5xl text-navy md:text-6xl">A tua reserva</h1>
      <div className="mt-8">
        <Checkout />
      </div>
    </div>
  );
}
