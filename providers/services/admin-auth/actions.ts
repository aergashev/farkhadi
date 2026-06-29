"use server"

import { redirect } from "next/navigation"

import { signIn, signOut } from "./server"

export async function signInAction(
  _prev: { error: boolean } | undefined,
  formData: FormData,
): Promise<{ error: boolean }> {
  const password = String(formData.get("password") ?? "")
  const ok = await signIn(password)
  if (!ok) return { error: true }
  redirect("/admin")
}

export async function signOutAction(): Promise<void> {
  await signOut()
  redirect("/admin")
}
