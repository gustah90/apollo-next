import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BreadcrumbItem {
  href: string
  label: string
  isCurrent?: boolean
}

interface CustomBreadcrumbProps {
  readonly items: BreadcrumbItem[]
  readonly className?: string
  readonly separator?: React.ReactNode
  readonly ariaLabel?: string
}

export function CustomBreadcrumb({
  items,
  className,
  separator = <ChevronRight className="h-3 w-3" />,
  ariaLabel = 'Trilha de navegação',
}: CustomBreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel} className={className}>
      <Breadcrumb>
        <BreadcrumbList className="flex items-center gap-2 text-slate-300 text-sm mx-auto max-w-5xl px-4 pb-10">
          {items.map((item, index) => {
            const isLastItem = index === items.length - 1

            return (
              <React.Fragment key={item.href}>
                <BreadcrumbItem>
                  {isLastItem ? (
                    <span
                      className={cn(
                        'text-white font-medium truncate max-w-xs',
                        item.isCurrent && 'aria-current-page',
                      )}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href}
                        scroll={false}
                        className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded transition-colors"
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {!isLastItem && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  )
}

interface LaunchBreadcrumbProps {
  readonly missionName: string
  readonly className?: string
}

export function LaunchBreadcrumb({ missionName, className }: LaunchBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { href: '/', label: 'Início' },
    { href: '/launches', label: 'Lançamentos' },
    { href: '#', label: missionName, isCurrent: true },
  ]

  return (
    <CustomBreadcrumb
      items={items}
      className={cn('mx-auto max-w-5xl px-4 pb-10', className)}
      ariaLabel="Trilha de navegação do lançamento"
    />
  )
}
