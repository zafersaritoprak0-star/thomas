import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, Wallet, Calendar, FileText } from "lucide-react"
import { isAdmin } from "@/lib/admin-auth"
import { getApplication } from "@/app/actions/applications"
import { formatCurrency, formatDate } from "@/lib/format"

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  if (!(await isAdmin())) redirect("/admin")

  const { id } = await params
  const numericId = Number(id)
  if (!Number.isInteger(numericId)) notFound()

  const app = await getApplication(numericId)
  if (!app) notFound()

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link
          href="/admin/basvurular"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Tüm başvurular
        </Link>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4 border-b border-border pb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {app.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-card-foreground">
                {app.full_name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Başvuru #{app.id}
              </p>
            </div>
          </div>

          <dl className="grid gap-5 py-6 sm:grid-cols-2">
            <DetailRow icon={<Mail className="h-4 w-4" />} label="E-posta" value={app.email} />
            <DetailRow icon={<Phone className="h-4 w-4" />} label="Telefon" value={app.phone} />
            <DetailRow
              icon={<Wallet className="h-4 w-4" />}
              label="Talep Edilen Tutar"
              value={formatCurrency(app.amount)}
            />
            <DetailRow
              icon={<Calendar className="h-4 w-4" />}
              label="Başvuru Tarihi"
              value={formatDate(app.created_at)}
            />
          </dl>

          <div className="border-t border-border pt-6">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-card-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Açıklama
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground text-pretty">
              {app.description || "Açıklama girilmemiş."}
            </p>
          </div>

          {app.image_data && (
            <div className="border-t border-border pt-6 mt-6">
              <p className="mb-3 text-sm font-medium text-card-foreground">
                Yüklenen Belge
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={app.image_data || "/placeholder.svg"}
                alt={`${app.full_name} tarafından yüklenen belge`}
                className="max-h-96 w-full rounded-lg border border-border object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </dt>
      <dd className="text-sm font-medium text-card-foreground break-words">{value}</dd>
    </div>
  )
}
