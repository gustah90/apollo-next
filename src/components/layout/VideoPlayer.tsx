'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  readonly videoUrl: string
  readonly buttonLabel?: string
  readonly className?: string
}

export default function VideoPlayer({
  videoUrl,
  buttonLabel = 'Assistir vídeo',
  className,
}: Props) {
  const [open, setOpen] = useState(false)

  const toEmbed = (url: string) => {
    try {
      const u = new URL(url)
      if (u.hostname.includes('youtube.com')) {
        const v = u.searchParams.get('v')
        return v ? `https://www.youtube.com/embed/${v}` : url
      }
      if (u.hostname.includes('youtu.be')) {
        const id = u.pathname.replace('/', '')
        return id ? `https://www.youtube.com/embed/${id}` : url
      }
      return url
    } catch {
      return url
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={cn(
          'bg-purple-500/20 text-purple-300 border border-purple-500/30',
          'hover:bg-purple-500/30 hover:text-purple-200',
          'focus-visible:ring-red-400 focus-visible:ring-offset-slate-800',
          'px-4 py-2 text-sm font-medium',
          'inline-flex items-center gap-2 cursor-pointer',
        )}
        aria-pressed={open}
        aria-expanded={open}
        aria-controls="video-container"
      >
        <span aria-hidden="true">{open ? '❌' : '▶️'}</span>
        {open ? 'Ocultar vídeo' : buttonLabel}
      </Button>

      {open && (
        <div id="video-container" className="mt-4">
          <div className="aspect-video w-full overflow-hidden rounded-xl ring-1 ring-white/10 bg-black">
            <iframe
              title="Player do lançamento"
              src={toEmbed(videoUrl)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}
