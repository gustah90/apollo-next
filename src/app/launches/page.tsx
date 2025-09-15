'use client'

import React, { useCallback, useEffect, useRef, useState, Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import LaunchCard from '@/components/layout/LaunchCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getLaunchesCSR } from '@/lib/api'
import { useSearchParams } from 'next/navigation'
import { Launch } from '../types/launch'

const PAGE_SIZE = 6
const PULL_THRESHOLD = 60

function LaunchesContent() {
  const [launches, setLaunches] = useState<Launch[]>([])
  const [offset, setOffset] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [reachedEnd, setReachedEnd] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const searchParams = useSearchParams()
  const showVideoOnly = searchParams?.get('video') === '1'

  const didInitRef = useRef(false)
  const offsetRef = useRef(0)
  useEffect(() => {
    offsetRef.current = offset
  }, [offset])

  const pullingRef = useRef<boolean>(false)
  const pullStartYRef = useRef<number>(0)
  const canPullRef = useRef<boolean>(false)

  const loadMore = useCallback(async () => {
    if (isLoading || reachedEnd) return
    setIsLoading(true)
    setError(null)

    try {
      const currentOffset = offsetRef.current
      const data = await getLaunchesCSR(PAGE_SIZE, currentOffset)

      const filtered = showVideoOnly
        ? data.filter((l) => l.links?.video_link && l.links.video_link.trim() !== '')
        : data

      setLaunches((prev) => {
        const seen = new Set(prev.map((l) => l.id))
        const toAdd = filtered.filter((l) => !seen.has(l.id))
        return toAdd.length ? [...prev, ...toAdd] : prev
      })

      setOffset((prev) => prev + PAGE_SIZE)
      if (filtered.length < PAGE_SIZE) setReachedEnd(true)
    } catch {
      setError('Não foi possível carregar os lançamentos. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, reachedEnd, showVideoOnly])

  useEffect(() => {
    if (didInitRef.current) return
    didInitRef.current = true

    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' })

    setLaunches([])
    setReachedEnd(false)
    setError(null)
    setOffset(0)
    offsetRef.current = 0

    void loadMore()
  }, [loadMore])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoading && !reachedEnd) {
          void loadMore()
        }
      },
      { rootMargin: '120px 0px 120px 0px', threshold: 0.1 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [loadMore, isLoading, reachedEnd])

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight - 100
      canPullRef.current = nearBottom && reachedEnd && !isLoading
    }

    const onTouchStart = (e: TouchEvent) => {
      if (!canPullRef.current) return
      pullingRef.current = true
      pullStartYRef.current = e.touches[0]?.clientY ?? 0
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!pullingRef.current) return
      const y = e.touches[0]?.clientY ?? 0
      const delta = y - pullStartYRef.current
      if (delta > PULL_THRESHOLD) {
        pullingRef.current = false
        setReachedEnd(false)
        void loadMore()
      }
    }

    const onTouchEnd = () => {
      pullingRef.current = false
    }

    const onWheel = (e: WheelEvent) => {
      if (!canPullRef.current) return
      if (e.deltaY > 0) {
        setReachedEnd(false)
        void loadMore()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })

    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('wheel', onWheel)
    }
  }, [reachedEnd, isLoading, loadMore])

  return (
    <>
      <Header />

      <main
        id="conteudo-principal"
        role="main"
        tabIndex={-1}
        className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 md:py-16 lg:py-20">
          <section aria-labelledby="lista-lancamentos" className="relative">
            <header className="text-center mb-8">
              <h1 id="lista-lancamentos" className="text-3xl font-bold mb-2">
                Catálogo de Lançamentos
              </h1>
              <p className="text-slate-300">Explore todos os lançamentos da SpaceX</p>
            </header>

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200"
              >
                {error}{' '}
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => void loadMore()}
                >
                  Tentar novamente
                </Button>
              </div>
            )}

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              role="list"
              aria-label="Lançamentos"
            >
              {launches.map((launch) => (
                <LaunchCard key={launch.id} launch={launch} />
              ))}
            </div>

            {isLoading && (
              <div
                className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                aria-live="polite"
              >
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-48 rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            <div ref={sentinelRef} className="h-12" aria-hidden="true" />

            {reachedEnd && !isLoading && (
              <div className="mt-8 text-center text-slate-400">
                <p>Você chegou ao fim 🎯</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function LaunchesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
          <div className="text-white">Carregando...</div>
        </div>
      }
    >
      <LaunchesContent />
    </Suspense>
  )
}
