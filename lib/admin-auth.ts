import { cookies } from "next/headers"
import { createHash } from "crypto"

// Simple password gate for the admin panel. Set ADMIN_PASSWORD in the project
// environment to change it; otherwise the default below is used.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123"

const COOKIE_NAME = "admin_session"

function tokenFor(password: string) {
  // Derive a non-obvious cookie value from the password so the stored cookie
  // is not the raw password.
  return createHash("sha256")
    .update(`basvuru-admin::${password}`)
    .digest("hex")
}

export function verifyPassword(password: string) {
  return password === ADMIN_PASSWORD
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  const value = store.get(COOKIE_NAME)?.value
  return value === tokenFor(ADMIN_PASSWORD)
}

export async function setAdminSession() {
  const store = await cookies()
  store.set(COOKIE_NAME, tokenFor(ADMIN_PASSWORD), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export async function clearAdminSession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
