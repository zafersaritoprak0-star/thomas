"use server"

import { pool, ensureSchema, type Application } from "@/lib/db"
import { isAdmin } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"

export type CreateApplicationResult =
  | { ok: true }
  | { ok: false; error: string }

export async function createApplication(
  formData: FormData,
): Promise<CreateApplicationResult> {
  const fullName = String(formData.get("fullName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const amountRaw = String(formData.get("amount") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const imageData = String(formData.get("imageData") ?? "").trim()

  // Basic server-side validation.
  if (!fullName) return { ok: false, error: "Ad Soyad zorunludur." }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) return { ok: false, error: "Geçerli bir e-posta giriniz." }
  if (!phone) return { ok: false, error: "Telefon numarası zorunludur." }

  const amount = Number(amountRaw.replace(/[^\d.,]/g, "").replace(",", "."))
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Geçerli bir tutar giriniz." }
  }

  // Guard against very large base64 payloads (~5MB image limit).
  if (imageData && imageData.length > 7_000_000) {
    return { ok: false, error: "Yüklenen resim çok büyük (en fazla 5MB)." }
  }

  try {
    await ensureSchema()
    await pool.query(
      `INSERT INTO applications (full_name, email, phone, amount, description, image_data)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [fullName, email, phone, amount, description, imageData || null],
    )
    revalidatePath("/admin/basvurular")
    return { ok: true }
  } catch (err) {
    console.log("[v0] createApplication error:", (err as Error).message)
    return { ok: false, error: "Başvuru kaydedilemedi. Lütfen tekrar deneyin." }
  }
}

export async function getApplications(): Promise<Application[]> {
  if (!(await isAdmin())) throw new Error("Unauthorized")
  await ensureSchema()
  const { rows } = await pool.query<Application>(
    `SELECT id, full_name, email, phone, amount, description, image_data, created_at
     FROM applications
     ORDER BY created_at DESC`,
  )
  return rows
}

export async function getApplication(id: number): Promise<Application | null> {
  if (!(await isAdmin())) throw new Error("Unauthorized")
  await ensureSchema()
  const { rows } = await pool.query<Application>(
    `SELECT id, full_name, email, phone, amount, description, image_data, created_at
     FROM applications
     WHERE id = $1`,
    [id],
  )
  return rows[0] ?? null
}
