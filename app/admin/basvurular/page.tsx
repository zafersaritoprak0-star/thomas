import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Inbox, ImageIcon } from "lucide-react"
import { isAdmin } from "@/lib/admin-auth"
import { getApplications } from "@/app/actions/applications"
import { formatCurrency, formatDate } from "@/lib/format"
import { LogoutButton } from "@/components/logout-button"

export default async function ApplicationsPage() {
  if (!(await isAdmin())) redirect("/admin")

  const applications = await getApplications()

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Başvurular
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Toplam {applications.length} başvuru
            </p>
          </div>
          <LogoutButton />
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card py-16 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Henüz başvuru bulunmuyor.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {applications.map((app) => (
              <li key={app.id}>
                <Link
                  href={`/admin/basvurular/${app.id}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {app.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-card-foreground">
                        {app.full_name}
                      </p>
                      {app.image_data && (
                        <ImageIcon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                      )}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {app.email} · {formatDate(app.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-primary">
                      {formatCurrency(app.amount)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
