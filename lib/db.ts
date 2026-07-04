import { Pool } from "pg"

// Single shared pool across hot reloads in dev.
const globalForPg = globalThis as unknown as { pgPool?: Pool }

export const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  })

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool
}

let tableReady: Promise<void> | null = null

// Lazily ensure the applications table exists. This avoids the need for a
// separate migration step / script.
export function ensureSchema() {
  if (!tableReady) {
    tableReady = pool
      .query(
        `
        CREATE TABLE IF NOT EXISTS applications (
          id SERIAL PRIMARY KEY,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          amount NUMERIC(14, 2) NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          image_data TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        `,
      )
      .then(() => undefined)
      .catch((err) => {
        // Reset so a later call can retry.
        tableReady = null
        throw err
      })
  }
  return tableReady
}

export type Application = {
  id: number
  full_name: string
  email: string
  phone: string
  amount: string
  description: string
  image_data: string | null
  created_at: string
}
