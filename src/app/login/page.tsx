import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

// Verificado no servidor em cada visita (nunca gerado de antemão)
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Login", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="wrap flex justify-center py-16 md:py-24">
      <div className="w-full max-w-sm rounded-3xl border border-line p-6 md:p-8">
        <p className="kicker text-blue">Back office</p>
        <h1 className="display mt-2 text-4xl text-navy">Login</h1>
        <p className="mt-2 text-sm text-muted">Acesso reservado à direção do clube.</p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
