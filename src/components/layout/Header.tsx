'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const nav = [
  { href: '/', label: 'Início' },
  { href: '/launches', label: 'Catálogo' },
  { href: '/about', label: 'Sobre' },
]

export function Header() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700"
    >
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-current={isMounted && pathname === '/' ? 'page' : undefined}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-blue-700 rounded-lg grid place-items-center" aria-hidden>
              <span className="text-white font-bold text-lg">🚀</span>
            </div>
            <span className="text-xl font-bold text-white">SpaceX Launch Portal</span>
          </Link>

          <nav aria-label="Navegação principal" className="ml-auto hidden md:block">
            <ul className="flex items-center gap-6">
              {nav.map(({ href, label }) => {
                const active = isMounted && pathname === href
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'text-slate-300 hover:text-white transition-colors font-medium',
                        active && 'text-white',
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ml-auto md:hidden">
            <MobileNav pathname={isMounted ? (pathname as string) : ''} />
          </div>
        </div>
      </div>
    </header>
  )
}

function MobileNav({ pathname }: Readonly<{ pathname: string }>) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild aria-label="Abrir menu">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <Menu className="h-5 w-5" aria-hidden />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="bg-slate-900 border-slate-700 text-white">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-white flex items-center gap-3">
            <span
              className="inline-grid place-items-center w-8 h-8 rounded-md bg-blue-700"
              aria-hidden
            >
              🚀
            </span>{' '}
            {''}
            SpaceX Launch Portal
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Menu móvel">
          <ul className="flex flex-col gap-1">
            {nav.map(({ href, label }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500',
                      active && 'bg-slate-800 text-white',
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
