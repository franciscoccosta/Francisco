"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, isAdmin } from "@/lib/auth";
import { deleteOrder, setPaid } from "@/lib/orders";

/** Todas as ações voltam a confirmar no servidor que quem pede é o administrador. */
async function guard() {
  if (!(await isAdmin())) redirect("/login");
}

export async function markPaid(id: string, paid: boolean) {
  await guard();
  await setPaid(String(id).slice(0, 64), Boolean(paid));
  revalidatePath("/admin");
}

export async function removeOrder(id: string) {
  await guard();
  await deleteOrder(String(id).slice(0, 64));
  revalidatePath("/admin");
}

export async function logout() {
  await endSession();
  redirect("/login");
}
