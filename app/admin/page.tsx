import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { isAdmin } from "@/lib/admin-auth"
import { TurkishFlagBackground } from "@/components/turkish-flag-background"
import { AdminLoginForm } from "@/components/admin-login-form"

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin/basvurular")

  return (
    <main className="relative min-h-dvh">
      <TurkishFlagBackground />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10">
        <div className="rounded-xl border border-border bg-card/95 p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
            Yönetici Girişi
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
            Başvuruları görüntülemek için yönetici şifresini girin.
          </p>
          <div className="mt-6">
            <AdminLoginForm />
          </div>
        </div>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Başvuru formuna dön
        </Link>
      </div>
    </main>
  )
}
