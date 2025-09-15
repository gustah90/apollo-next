'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RefreshButtonProps {
  readonly className?: string
}

export default function RefreshButton({ className = '' }: RefreshButtonProps) {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <Button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={cn(
        'bg-purple-500/20 text-purple-300 border border-purple-500/30',
        'hover:bg-purple-500/30 hover:text-purple-200',
        'focus-visible:ring-red-400 focus-visible:ring-offset-slate-800',
        'px-4 py-2 text-sm font-medium',
        'inline-flex items-center gap-2 cursor-pointer',
        ' disabled:cursor-not-allowed',
        className,
      )}
      aria-label="Atualizar dados"
      title="Clique para atualizar os dados mais recentes"
    >
      <span className={cn('mr-2', isRefreshing && 'animate-spin')}>
        {isRefreshing ? '⏳' : '🔄'}
      </span>
      {''}
      Atualizar
    </Button>
  )
}
