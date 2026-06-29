"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDict } from "@/providers/lib/i18n/client"
import { signInAction } from "@/providers/services/admin-auth/actions"
import { Logo } from "@/app/_components/logo"

export function LoginForm() {
  const dict = useDict()
  const [state, formAction, pending] = useActionState(signInAction, {
    error: false,
  })

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-5">
      <Link href="/" className="mb-8">
        <Logo className="h-9" />
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-primary/20 bg-card p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent">
            <Lock className="size-5 text-primary" />
          </div>
          <h1 className="font-serif text-2xl">{dict.admin.title}</h1>
        </div>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{dict.admin.password}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              placeholder={dict.admin.passwordPlaceholder}
              className="bg-brand-green-deep/40"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{dict.admin.wrongPassword}</p>
          )}
          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {dict.admin.signIn}
          </Button>
        </form>
      </div>
      <Link
        href="/"
        className="mt-6 text-sm text-muted-foreground transition hover:text-primary"
      >
        ← {dict.nav.home}
      </Link>
    </div>
  )
}
