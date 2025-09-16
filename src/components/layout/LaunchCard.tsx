'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Launch } from '@/app/types/launch'

interface LaunchCardProps {
  readonly launch: Launch
}

export default function LaunchCard({ launch }: LaunchCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const launchDate = new Date(launch.launch_date_utc).toLocaleDateString('pt-BR')
  const isFutureLaunch = new Date(launch.launch_date_utc) > new Date()
  const hasVideo = Boolean(launch.links.video_link && launch.links.video_link !== '')

  let status = ''
  let statusColor = ''
  let statusDescription = ''
  let statusIcon = ''
  let statusIconAlt = ''

  if (launch.launch_success === null) {
    if (isFutureLaunch) {
      status = 'Agendado'
      statusColor = 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
      statusDescription = 'Lançamento programado para o futuro'
      statusIcon = '⏰'
      statusIconAlt = 'Ícone de relógio indicando agendamento'
    } else {
      status = 'Status Indeterminado'
      statusColor = 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
      statusDescription = 'Status do lançamento não determinado'
      statusIcon = '❓'
      statusIconAlt = 'Ícone de interrogação indicando status indeterminado'
    }
  } else if (launch.launch_success) {
    status = 'Lançado com Sucesso'
    statusColor = 'bg-green-500/20 text-green-300 border border-green-500/30'
    statusDescription = 'Lançamento realizado com sucesso'
    statusIcon = '✅'
    statusIconAlt = 'Ícone de check indicando sucesso'
  } else {
    status = 'Falhou'
    statusColor = 'bg-red-500/20 text-red-300 border border-red-500/30'
    statusDescription = 'Lançamento não foi bem-sucedido'
    statusIcon = '❌'
    statusIconAlt = 'Ícone de xis indicando falha'
  }

  const imageUrl =
    launch.links?.mission_patch ||
    (launch.links?.flickr_images?.[0] ?? launch.links?.mission_patch_small)

  return (
    <Card
      key={launch.id}
      className={cn(
        'bg-slate-800/50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer h-full',
        'focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-900',
        'border border-slate-700/50 hover:border-slate-600/70 backdrop-blur-sm hover:scale-102 flex flex-col',
      )}
    >
      <article
        aria-labelledby={`mission-title-${launch.id}`}
        aria-describedby={`mission-desc-${launch.id}`}
      >
        <Link
          href={`/launches/${launch.id}`}
          scroll={false}
          className="block h-full no-underline text-inherit focus:outline-none group"
          aria-label={`Ver detalhes da missão ${launch.mission_name}`}
        >
          <div className="relative aspect-[16/9] w-full bg-slate-900">
            {imageUrl && !imageError ? (
              <>
                {!imageLoaded && (
                  <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
                )}
                <Image
                  src={imageUrl}
                  alt={`Imagem do lançamento ${launch.mission_name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={cn(
                    'object-cover object-center opacity-90 transition-opacity duration-300',
                    'group-hover:opacity-100',
                    imageLoaded ? 'visible' : 'invisible',
                  )}
                  onError={() => setImageError(true)}
                  onLoad={() => setImageLoaded(true)}
                  priority={false}
                />
              </>
            ) : (
              <div className="h-full w-full bg-slate-800/50 flex items-center justify-center group-hover:bg-slate-700/60 transition-colors duration-300">
                <span
                  className="text-7xl hover:animate-pulse"
                  role="img"
                  aria-label="Ícone de foguete representando missão espacial"
                >
                  🚀
                </span>
              </div>
            )}
          </div>

          <div className="p-6 h-full flex flex-col">
            <h3
              id={`mission-title-${launch.id}`}
              className="text-xl font-semibold text-white mb-4 text-center group-hover:text-blue-300 transition-colors duration-200"
            >
              {launch.mission_name}
            </h3>

            <div className="space-y-2 mb-4">
              <p className="text-slate-300">
                <strong className="font-semibold text-slate-100">Lançamento:</strong>{' '}
                <time dateTime={launch.launch_date_utc} className="text-slate-300">
                  {launchDate}
                </time>
              </p>

              <p className="text-slate-300">
                <strong className="font-semibold text-slate-100">Foguete:</strong>{' '}
                <span className="text-slate-300">{launch.rocket.rocket_name}</span>
                {launch.rocket.rocket_type && (
                  <span className="text-slate-400 ml-1">({launch.rocket.rocket_type})</span>
                )}
              </p>

              <p className="text-slate-300">
                <strong className="font-semibold text-slate-100">Local:</strong>{' '}
                <span className="text-slate-300">
                  {(launch.launch_site as string) || 'Indisponível'}
                </span>
              </p>
            </div>

            <div className="mb-5">
              <Badge
                variant="outline"
                className={cn(
                  'inline-flex items-center px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm',
                  statusColor,
                )}
                aria-label={statusDescription}
                title={statusDescription}
              >
                <span className="mr-2 text-xs" role="img" aria-label={statusIconAlt}>
                  {statusIcon}
                </span>
                {status}
              </Badge>
            </div>

            {hasVideo && (
              <div className="mb-4">
                <Badge
                  variant="outline"
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30"
                >
                  <span className="mr-2" role="img" aria-label="Disponível com vídeo">
                    ▶️
                  </span>
                  {''}
                  Com Vídeo
                </Badge>
              </div>
            )}

            {launch.details && (
              <div>
                <p
                  id={`mission-desc-${launch.id}`}
                  className="text-slate-400 line-clamp-3 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-200"
                >
                  {launch.details}
                </p>
              </div>
            )}

            <span className="sr-only">Clique para ver detalhes completos desta missão</span>
          </div>
        </Link>
      </article>
    </Card>
  )
}
