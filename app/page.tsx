import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { TurkishFlagBackground } from "@/components/turkish-flag-background"
import { ApplicationForm } from "@/components/application-form"

export default function HomePage() {
  return (
    <main className="relative min-h-dvh">
      <TurkishFlagBackground />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-2xl flex-col px-4 py-10 sm:py-14">
        <header className="mb-8">
          <div className="mx-auto max-w-md rounded-xl bg-card/85 px-6 py-5 text-center shadow-sm backdrop-blur-sm">
            <h1 className="text-3xl font-bold tracking-tight text-card-foreground text-balance sm:text-4xl">
              Başvuru Formu
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
              Talebinizi aşağıdaki formu doldurarak iletebilirsiniz. Bilgileriniz
              gizli tutulur ve yalnızca değerlendirme amacıyla kullanılır.
            </p>
          </div>
        </header>

        <section className="rounded-xl border border-border bg-card/95 p-6 shadow-sm sm:p-8">
          <ApplicationForm />
        </section>

        <footer className="mt-8 flex items-center justify-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Yönetici Girişi
          </Link>
        </footer>
      </div>
    </main>
  )
}
