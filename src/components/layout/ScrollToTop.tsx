'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function ScrollToTop({
  focusMainId = 'conteudo-principal',
  offset = -50,
}: {
  focusMainId?: string
  offset?: number
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
    } catch {}

    window.scrollTo({ top: offset, left: 0, behavior: 'auto' })

    document.getElementById(focusMainId)?.focus()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()])

  return null
}
