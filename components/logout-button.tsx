"use client"

import { LogOut } from "lucide-react"
import { logout } from "@/app/actions/admin"

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground transition-colors hover:bg-secondary"
      >
        <LogOut className="h-3.5 w-3.5" />
        Çıkış Yap
      </button>
    </form>
  )
}
