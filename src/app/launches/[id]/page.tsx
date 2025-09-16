import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getLaunchById } from '@/lib/api'
import VideoPlayer from '@/components/layout/VideoPlayer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MapPin, ArrowLeft, ArrowRight, ExternalLink, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CustomBreadcrumb } from '@/components/layout/CustomBreadcrumb'

type PageProps = { readonly params: { id: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const launch = await getLaunchById(id)
    const title = launch?.mission_name
      ? `${launch.mission_name} — SpaceX Launch Portal`
      : 'Detalhes do Lançamento — SpaceX Launch Portal'
    const description =
      launch?.details ?? `Detalhes do lançamento ${launch?.mission_name} no SpaceX Launch Portal.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: launch?.links?.mission_patch
          ? [{ url: launch.links.mission_patch, width: 512, height: 512, alt: launch.mission_name }]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    }
  } catch {
    return {
      title: 'Detalhes do Lançamento — SpaceX Launch Portal',
      description: 'Página de detalhes do lançamento.',
    }
  }
}

export default async function LaunchDetailsPage({ params }: PageProps) {
  const { id } = await params

  const launch = await getLaunchById(id).catch(() => null)
  if (!launch) return notFound()

  const iso = launch.launch_date_utc
  const human = new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })

  const launchDate = new Date(launch.launch_date_utc)
  const isFutureLaunch = launchDate > new Date()

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

  const hasVideo = launch.links?.video_link && launch.links.video_link !== ''
  const cover = launch.links?.mission_patch || launch.links?.flickr_images?.[0] || null
  const flickrImages = launch.links?.flickr_images || []

  return (
    <>
      <Header />

      <main
        id="conteudo-principal"
        role="main"
        className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white py-10"
        tabIndex={-1}
      >
        <CustomBreadcrumb
          items={[
            { href: '/', label: 'Início' },
            { href: '/launches', label: 'Lançamentos' },
            { href: '#', label: launch.mission_name, isCurrent: true },
          ]}
        />

        <div className="mx-auto max-w-5xl px-4 space-y-8">
          <Card className="border-slate-700/50 bg-slate-800/50 ring-1 ring-white/10 overflow-hidden">
            <div className="relative aspect-[16/6] w-full bg-slate-900">
              {cover ? (
                <Image
                  src={cover}
                  alt={`Capa do lançamento ${launch.mission_name}`}
                  fill
                  className="object-cover object-center opacity-90"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center opacity-70">
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

            <CardContent className="pb-6 px-6 pt-4 sm:pb-8 sm:px-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
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

                {launch.links?.wikipedia && (
                  <Badge
                    variant="outline"
                    className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 cursor-pointer inline-flex items-center px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                  >
                    <a
                      href={launch.links.wikipedia}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Wikipedia
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Badge>
                )}

                {launch.links?.article_link && (
                  <Badge
                    variant="outline"
                    className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30 cursor-pointer inline-flex items-center px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                  >
                    <a
                      href={launch.links.article_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Artigo
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Badge>
                )}
              </div>

              <CardTitle className="text-3xl sm:text-4xl font-bold mb-2 text-slate-100">
                {launch.mission_name}
              </CardTitle>

              <CardDescription className="text-slate-300 text-lg">
                <time dateTime={iso} title={iso}>
                  {human}
                </time>
              </CardDescription>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="bg-slate-900/40 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 pt-4">
                      Foguete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-md text-slate-100">
                      {launch.rocket.rocket_name}
                      <span className="text-slate-400 ml-1">({launch.rocket.rocket_type})</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/40 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 pt-4">
                      <MapPin className="h-4 w-4" />
                      Local
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-md text-slate-100">{launch.launch_site || 'Indisponível'}</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/40 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 pt-4">
                      ID do Lançamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-md text-slate-100 font-mono">{launch.id}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/50 ring-1 ring-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center gap-2 text-slate-100 pt-4">
                Detalhes da Missão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="leading-7 text-slate-300">
                {launch.details || 'Sem descrição disponível para este lançamento.'}
              </p>

              {hasVideo && (
                <VideoPlayer
                  videoUrl={launch.links.video_link as string}
                  buttonLabel="Assistir vídeo do lançamento"
                />
              )}
            </CardContent>
          </Card>

          {flickrImages.length > 0 && (
            <Card className="border-slate-700/50 bg-slate-800/50 ring-1 ring-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-100 pt-4">
                  Galeria de Imagens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flickrImages.map((src, index) => (
                    <Dialog key={src}>
                      <DialogTrigger asChild>
                        <div className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg">
                          <Image
                            src={src}
                            alt={`Imagem ${index + 1} do lançamento ${launch.mission_name}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </div>
                      </DialogTrigger>
                      <DialogContent
                        className="w-full h-full max-w-none max-h-none p-0 bg-black/95 border-none"
                        aria-describedby={undefined}
                      >
                        <div className="relative w-full h-full flex items-center justify-center">
                          <DialogTitle>{`Imagem ${index + 1} do lançamento ${launch.mission_name}`}</DialogTitle>
                          <DialogDescription className="sr-only">
                            Visualização ampliada da imagem do lançamento.
                          </DialogDescription>
                          <Image
                            src={src}
                            alt={`Imagem ${index + 1} do lançamento ${launch.mission_name} em tamanho ampliado`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <DialogClose className="absolute cursor-pointer top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                            <X className="h-6 w-6 text-white" />
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button asChild size="lg" className="px-8 py-4 text-base">
              <Link href="/" scroll={false} aria-label="Ir à página inicial">
                <ArrowLeft className="h-4 w-4" />
                Ir ao Início
              </Link>
            </Button>

            <Button asChild size="lg" className="px-8 py-4 text-base">
              <Link
                href="/launches"
                scroll={false}
                aria-label="Explorar catálogo completo de lançamentos"
              >
                Voltar ao Catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="sr-only" aria-live="polite">
            Página de detalhes carregada para o lançamento {launch.mission_name}.
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
