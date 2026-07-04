"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { Loader2, Upload, X, CheckCircle2 } from "lucide-react"
import { createApplication } from "@/app/actions/applications"

export function ApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [imageData, setImageData] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Lütfen bir resim dosyası seçin.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resim en fazla 5MB olabilir.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImageData(reader.result as string)
      setImageName(file.name)
    }
    reader.readAsDataURL(file)
  }

  function clearImage() {
    setImageData(null)
    setImageName(null)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (imageData) formData.set("imageData", imageData)

    startTransition(async () => {
      const res = await createApplication(formData)
      if (res.ok) {
        setSubmitted(true)
        formRef.current?.reset()
        clearImage()
      } else {
        toast.error(res.error)
      }
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle2 className="h-14 w-14 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">
            Başvurunuz alındı
          </h2>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Talebiniz başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-secondary"
        >
          Yeni başvuru oluştur
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-5">
      <Field label="Ad Soyad" htmlFor="fullName">
        <input
          id="fullName"
          name="fullName"
          required
          autoComplete="name"
          placeholder="Örn. Ahmet Yılmaz"
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="E-posta" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ornek@eposta.com"
            className={inputClass}
          />
        </Field>

        <Field label="Telefon No" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="05XX XXX XX XX"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Talep Edilen Tutar (₺)" htmlFor="amount">
        <input
          id="amount"
          name="amount"
          inputMode="decimal"
          required
          placeholder="Örn. 50000"
          className={inputClass}
        />
      </Field>

      <Field label="Açıklama" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Talebinizle ilgili detayları buraya yazabilirsiniz."
          className={`${inputClass} resize-y`}
        />
      </Field>

      <Field label="Belge / Resim (opsiyonel)" htmlFor="image">
        {imageData ? (
          <div className="flex items-center gap-3 rounded-md border border-border bg-secondary/50 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageData || "/placeholder.svg"}
              alt="Yüklenen belge önizlemesi"
              className="h-14 w-14 rounded object-cover"
            />
            <span className="flex-1 truncate text-sm text-card-foreground">
              {imageName}
            </span>
            <button
              type="button"
              onClick={clearImage}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-card-foreground"
              aria-label="Resmi kaldır"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="image"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-secondary/30 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/60"
          >
            <Upload className="h-4 w-4" />
            Resim yüklemek için tıklayın (en fazla 5MB)
          </label>
        )}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="sr-only"
        />
      </Field>

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? "Gönderiliyor..." : "Başvuruyu Gönder"}
      </button>
    </form>
  )
}

const inputClass =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-card-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}
