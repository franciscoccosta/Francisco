"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { useCart } from "@/lib/cart/context";
import { useAuth } from "@/lib/auth/context";
import { PRODUCTS } from "@/lib/data";
import { categoryLabel } from "@/lib/i18n/categories";
import { createOrder, generateOrderNumber } from "@/lib/orders/store";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Order } from "@/lib/types";

type Step = "account" | "shipping" | "review" | "payment" | "confirmed";

export default function CheckoutPage() {
  const { t, locale } = useLanguage();
  useDocumentTitle(t("checkout", "title"));
  const { lines, clear } = useCart();
  const { user, login } = useAuth();

  const [step, setStep] = useState<Step>("account");
  const [email, setEmail] = useState(user?.email ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [address, setAddress] = useState({ line: "", city: "", postalCode: "", country: "Portugal", phone: "" });
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [orderNumber, setOrderNumber] = useState("");

  const items = lines
    .map((line) => ({ line, product: PRODUCTS.find((p) => p.id === line.productId) }))
    .filter((i): i is { line: typeof lines[number]; product: NonNullable<(typeof PRODUCTS)[number]> } => Boolean(i.product));

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.line.quantity, 0);
  const shippingCost = delivery === "express" ? 35 : 0;
  const total = subtotal + shippingCost;

  if (items.length === 0 && step !== "confirmed") {
    return (
      <div className="container-page py-20">
        <EmptyState title={t("cart", "empty")} description={t("cart", "emptyDesc")} action={<ButtonLink href="/marketplace">{t("cart", "browseCta")}</ButtonLink>} />
      </div>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: "account", label: t("checkout", "stepAccount") },
    { key: "shipping", label: t("checkout", "stepShipping") },
    { key: "review", label: t("checkout", "stepReview") },
    { key: "payment", label: t("checkout", "stepPayment") },
  ];
  const currentIndex = steps.findIndex((s) => s.key === step);

  function placeOrder() {
    login(email, name);
    const order: Order = {
      id: crypto.randomUUID(),
      customerEmail: email,
      items: items.map((i) => ({ productId: i.product.id, price: i.product.price, quantity: i.line.quantity })),
      total,
      status: "processing",
      createdAt: new Date().toISOString(),
      shippingCity: address.city,
    };
    createOrder(order);
    const num = generateOrderNumber();
    setOrderNumber(num);
    clear();
    setStep("confirmed");
  }

  if (step === "confirmed") {
    return (
      <div className="container-page py-20 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-good/15 text-good">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h1 className="font-display text-3xl">{t("checkout", "confirmedTitle")}</h1>
          <p className="mt-3 text-ink-soft">{t("checkout", "confirmedDesc")}</p>
          <p className="mt-4 text-sm text-ink-soft">
            {t("checkout", "orderNumberLabel")}: <span className="font-semibold text-charcoal">{orderNumber}</span>
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <ButtonLink href="/account">{t("checkout", "goToAccount")}</ButtonLink>
            <ButtonLink href="/marketplace" variant="outline">{t("checkout", "backToShop")}</ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="mb-8 font-display text-3xl sm:text-4xl">{t("checkout", "title")}</h1>

      <div className="mb-10 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                i <= currentIndex ? "bg-ember text-paper" : "bg-stone text-ink-soft"
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-sm ${i === currentIndex ? "font-semibold text-charcoal" : "text-ink-soft"}`}>{s.label}</span>
            {i < steps.length - 1 && <div className="mx-2 h-px w-8 bg-charcoal/15" />}
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          {step === "account" && (
            <div className="max-w-md space-y-4">
              <h2 className="font-display text-xl">{t("checkout", "accountTitle")}</h2>
              <p className="text-sm text-ink-soft">{t("checkout", "accountDesc")}</p>
              <div>
                <Label htmlFor="name">{t("auth", "nameLabel")}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">{t("auth", "emailLabel")}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button disabled={!email || !name} onClick={() => setStep("shipping")}>
                {t("checkout", "guestContinue")}
              </Button>
            </div>
          )}

          {step === "shipping" && (
            <div className="max-w-md space-y-4">
              <h2 className="font-display text-xl">{t("checkout", "shippingTitle")}</h2>
              <div>
                <Label htmlFor="addr">{t("checkout", "addressLine")}</Label>
                <Input id="addr" value={address.line} onChange={(e) => setAddress({ ...address, line: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">{t("checkout", "city")}</Label>
                  <Input id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="postal">{t("checkout", "postalCode")}</Label>
                  <Input id="postal" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label htmlFor="country">{t("checkout", "country")}</Label>
                <Input id="country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="phone">{t("checkout", "phone")}</Label>
                <Input id="phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="delivery">{t("checkout", "deliveryOption")}</Label>
                <Select id="delivery" value={delivery} onChange={(e) => setDelivery(e.target.value as "standard" | "express")}>
                  <option value="standard">{t("checkout", "deliveryStandard")}</option>
                  <option value="express">{t("checkout", "deliveryExpress")}</option>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep("account")}>{t("common", "back")}</Button>
                <Button disabled={!address.line || !address.city || !address.postalCode} onClick={() => setStep("review")}>
                  {t("common", "continueLabel")}
                </Button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="max-w-md space-y-5">
              <h2 className="font-display text-xl">{t("checkout", "reviewTitle")}</h2>
              <div className="rounded-2xl border border-charcoal/10 p-4 text-sm">
                <p className="font-medium text-charcoal">{name}</p>
                <p className="text-ink-soft">{address.line}</p>
                <p className="text-ink-soft">{address.postalCode} {address.city}, {address.country}</p>
                <p className="text-ink-soft">{email}</p>
              </div>
              <ul className="space-y-2 text-sm">
                {items.map((i) => (
                  <li key={i.line.productId} className="flex justify-between">
                    <span>{categoryLabel(i.product.categoryId, locale)} #{i.product.code}</span>
                    <span>€{i.product.price}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep("shipping")}>{t("common", "back")}</Button>
                <Button onClick={() => setStep("payment")}>{t("common", "continueLabel")}</Button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="max-w-md space-y-4">
              <h2 className="font-display text-xl">{t("checkout", "paymentTitle")}</h2>
              <p className="rounded-lg bg-info/10 px-3 py-2 text-xs text-info">{t("checkout", "testModeNotice")}</p>
              <div>
                <Label htmlFor="cardName">{t("checkout", "cardName")}</Label>
                <Input id="cardName" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="cardNumber">{t("checkout", "cardNumber")}</Label>
                <Input id="cardNumber" inputMode="numeric" placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cardExpiry">{t("checkout", "cardExpiry")}</Label>
                  <Input id="cardExpiry" placeholder="MM/AA" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="cardCvc">{t("checkout", "cardCvc")}</Label>
                  <Input id="cardCvc" inputMode="numeric" placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} required />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep("review")}>{t("common", "back")}</Button>
                <Button disabled={!card.number || !card.expiry || !card.cvc || !card.name} onClick={placeOrder}>
                  {t("checkout", "placeOrder")}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="h-fit rounded-2xl border border-charcoal/10 bg-paper-dim p-6">
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.line.productId} className="flex justify-between text-ink-soft">
                <span>{categoryLabel(i.product.categoryId, locale)} #{i.product.code}</span>
                <span>€{i.product.price}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-charcoal/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">{t("checkout", "subtotal")}</span>
              <span>€{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">{t("checkout", "shipping")}</span>
              <span>{shippingCost === 0 ? t("checkout", "freeLabel") : `€${shippingCost}`}</span>
            </div>
            <div className="flex justify-between border-t border-charcoal/10 pt-2 font-display text-lg text-charcoal">
              <span>{t("checkout", "total")}</span>
              <span>€{total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/cart" className="text-sm text-ink-soft hover:text-ember">← {t("cart", "title")}</Link>
      </div>
    </div>
  );
}
