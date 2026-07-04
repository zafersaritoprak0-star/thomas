"use server"

import { verifyPassword, setAdminSession, clearAdminSession } from "@/lib/admin-auth"
import { redirect } from "next/navigation"

export async function login(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "")
  if (!verifyPassword(password)) {
    return { error: "Şifre hatalı." }
  }
  await setAdminSession()
  redirect("/admin/basvurular")
}

export async function logout() {
  await clearAdminSession()
  redirect("/admin")
}
