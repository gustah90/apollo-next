import { getLaunches, getLaunchesStats } from '@/lib/api'
import Link from 'next/link'
import LaunchCard from '@/components/layout/LaunchCard'
import RefreshButton from '@/components/layout/RefreshButton'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function HomePage() {
  const [launches, stats] = await Promise.allSettled([getLaunches(), getLaunchesStats()])

  const successfulLaunches =
    launches.status === 'fulfilled'
      ? launches.value.filter((launch) => launch.launch_success != null).length
      : 0

  const hasVideoLaunches =
    launches.status === 'fulfilled'
      ? launches.value.filter(
          (launch) => launch.links.video_link != '' && launch.links.video_link != null,
        ).length
      : 0

  const launchesData = launches.status === 'fulfilled' ? launches.value.slice(0, 6) : []
  const statsData = stats.status === 'fulfilled' ? stats.value : { total: 0, successful: 0 }

  const formattedTotal = new Intl.NumberFormat('pt-BR').format(statsData.total)
  const formattedSuccessful = new Intl.NumberFormat('pt-BR').format(statsData.successful)
  const formattedVideoLaunches = new Intl.NumberFormat('pt-BR').format(hasVideoLaunches)

  const shouldHoverScale = (value: number) => value > 0

  return (
    <>
      <Header />

      <main
        id="conteudo-principal"
        className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white"
        role="main"
        tabIndex={-1}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-14 md:py-16 lg:py-20">
          <section aria-labelledby="titulo-principal" className="text-center">
            <h1
              id="titulo-principal"
              className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
              SpaceX Launch Portal
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-200 sm:text-lg">
              Explore todos os lançamentos da SpaceX com informações detalhadas sobre missões e
              foguetes!
            </p>
          </section>

          <section aria-labelledby="estatisticas-titulo" className="mt-12 sm:mt-14 md:mt-16">
            <h2 id="estatisticas-titulo" className="sr-only">
              Estatísticas dos lançamentos da SpaceX
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
              <Link
                href="/launches"
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300 rounded-xl"
                aria-label="Ir para o catálogo de lançamentos"
              >
                <Card
                  role="listitem"
                  tabIndex={0}
                  aria-label={`Total de lançamentos: ${formattedTotal}`}
                  className={`rounded-xl bg-slate-800/70 p-6 ring-1 ring-white/10 backdrop-blur transition-transform ${
                    shouldHoverScale(statsData.total) ? 'hover:scale-102 cursor-pointer' : ''
                  }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md text-slate-300">Total de lançamentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="flex-shrink-0" aria-hidden="true">
                        <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">🚀</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <dd
                          className="mt-1 text-2xl font-semibold text-slate-300"
                          aria-live="polite"
                        >
                          {formattedTotal}
                        </dd>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Card
                className={`rounded-xl bg-slate-800/70 p-6 ring-1 ring-white/10 backdrop-blur transition-transform ${
                  shouldHoverScale(successfulLaunches) ? 'hover:scale-102 cursor-pointer' : ''
                }`}
                role="listitem"
                tabIndex={0}
                aria-label={`Lançamentos bem-sucedidos: ${formattedSuccessful}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-md text-slate-300">Bem-sucedidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="flex-shrink-0" aria-hidden="true">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <dd className="mt-1 text-2xl font-semibold text-green-400">
                        {formattedSuccessful}
                      </dd>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Link
                href={{ pathname: '/launches', query: { video: '1' } }}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300 rounded-xl"
                aria-label="Ver lançamentos que possuem vídeo"
              >
                <Card
                  role="listitem"
                  className={`rounded-xl bg-slate-800/70 p-6 ring-1 ring-white/10 backdrop-blur transition-transform ${
                    shouldHoverScale(hasVideoLaunches) ? 'hover:scale-102 cursor-pointer' : ''
                  }`}
                  tabIndex={0}
                  aria-label={`Lançamentos com vídeo: ${formattedVideoLaunches}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md text-slate-300">Lançamentos com Vídeo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="flex-shrink-0" aria-hidden="true">
                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">▶️</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <dd className="mt-1 text-2xl font-semibold text-yellow-400">
                          {formattedVideoLaunches}
                        </dd>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Card
                className="rounded-xl bg-slate-800/70 p-6 ring-1 ring-white/10 backdrop-blur"
                role="listitem"
                aria-label="Última atualização dos dados"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-md text-slate-300">
                    {' '}
                    <dt className="text-sm font-medium text-slate-300">Atualizado em</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-100">
                      {new Date().toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </dd>
                  </CardTitle>
                </CardHeader>
                <CardContent style={{ marginTop: '-1rem' }}>
                  <RefreshButton className="text-sm font-semibold text-slate-100" />
                </CardContent>
              </Card>
            </div>
          </section>

          <section aria-labelledby="ultimos-lancamentos-titulo" className="mt-10">
            <header className="text-center mb-8">
              <h2 id="ultimos-lancamentos-titulo" className="text-2xl font-semibold mb-2">
                Últimos Lançamentos
              </h2>
              <p className="text-slate-300 text-md">
                Confira os lançamentos mais recentes da SpaceX
              </p>
            </header>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              role="list"
              aria-label="Lista de lançamentos recentes"
            >
              {launchesData.map((launch) => (
                <LaunchCard key={launch.id} launch={launch} />
              ))}
            </div>
          </section>

          <section aria-labelledby="cta-titulo" className="mt-12 text-center">
            <Card className="bg-slate-800/50 rounded-2xl p-8 ring-1 ring-white/10 backdrop-blur">
              <CardHeader className="text-center pb-4 text-slate-300">
                <CardTitle id="cta-titulo" className="text-2xl font-semibold">
                  Explore todos os lançamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-300 mb-6 max-w-prose mx-auto text-base">
                  Descubra detalhes completos de cada missão, incluindo foguetes utilizados,
                  resultados e muito mais em nosso catálogo completo.
                </p>

                <nav aria-label="Navegação de call-to-action">
                  <Button asChild size="lg" className="px-8 py-4 text-base">
                    <Link href="/launches" aria-label="Explorar catálogo completo de lançamentos">
                      <span aria-hidden="true" className="mr-2">
                        🚀
                      </span>
                      {''}
                      Explorar Catálogo
                    </Link>
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />

      <div className="sr-only" role="note">
        <p>Use a tecla Tab para navegar entre os elementos interativos.</p>
        <p>
          Use as teclas de seta para navegar entre os cards de lançamento quando estiverem em foco.
        </p>
      </div>
    </>
  )
}
