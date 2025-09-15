'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Url } from 'next/dist/shared/lib/router/router'
import { Loader2 } from 'lucide-react'

type Props = React.PropsWithChildren<{
  href: Url
  className?: string
  ariaLabel?: string
  onNavigateStart?: () => void
}>

export default function NavLink({ href, className, ariaLabel, onNavigateStart, children }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <>
      <a
        href={typeof href === 'string' ? href : undefined}
        onClick={(e) => {
          e.preventDefault()
          onNavigateStart?.()
          startTransition(() => {
            ;(document.activeElement as HTMLElement | null)?.blur()
            router.push(href as string, { scroll: false })
          })
        }}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>

      {isPending && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[9999] grid place-items-center bg-black/40 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 px-4 py-3 ring-1 ring-white/15">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span className="text-slate-100 text-sm">Carregando…</span>
          </div>
        </div>
      )}
    </>
  )
}
