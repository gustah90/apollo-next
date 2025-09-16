'use client'

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import LaunchCard from '@/components/layout/LaunchCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getLaunchesCSR } from '@/lib/api'
import { useSearchParams } from 'next/navigation'
import type { Launch } from '../types/launch'
import { CustomBreadcrumb } from '@/components/layout/CustomBreadcrumb'

function useAdaptiveValues() {
  const isMobile =
    typeof window !== 'undefined' && window.matchMedia?.('(max-width: 720px)').matches

  return useMemo(
    () => ({
      pageSize: isMobile ? 6 : 12,
      rootMarginPx: isMobile ? 240 : 400,
    }),
    [isMobile],
  )
}

function LaunchesContent() {
  const { pageSize, rootMarginPx } = useAdaptiveValues()
  const searchParams = useSearchParams()
  const showVideoOnly = searchParams?.get('video') === '1'

  const [launches, setLaunches] = useState<Launch[]>([])
  const [offset, setOffset] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [reachedEnd, setReachedEnd] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLoadingRef = useRef(false)
  const reachedEndRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    isLoadingRef.current = isLoading
    reachedEndRef.current = reachedEnd
  }, [isLoading, reachedEnd])

  const abortOngoing = () => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
  }

  const fetchPage = useCallback(
    async (nextOffset: number) => {
      if (isLoadingRef.current || reachedEndRef.current) return
      setError(null)
      setIsLoading(true)
      isLoadingRef.current = true

      abortOngoing()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const raw = await getLaunchesCSR(pageSize, nextOffset)
        const filtered = showVideoOnly
          ? raw.filter((l) => l.links?.video_link && l.links.video_link.trim() !== '')
          : raw

        setLaunches((prev) => {
          const seen = new Set(prev.map((l) => l.id))
          const unique = filtered.filter((l) => !seen.has(l.id))
          return unique.length ? [...prev, ...unique] : prev
        })

        setOffset((prev) => prev + filtered.length)
        if (filtered.length < pageSize) {
          reachedEndRef.current = true
          setReachedEnd(true)
        }
      } catch (e) {
        if ((e as { name?: string })?.name !== 'AbortError') {
          setError('Não foi possível carregar os lançamentos. Tente novamente.')
        }
      } finally {
        setIsLoading(false)
        isLoadingRef.current = false
      }
    },
    [pageSize, showVideoOnly],
  )

  useEffect(() => {
    abortOngoing()
    setLaunches([])
    setOffset(0)
    setReachedEnd(false)
    reachedEndRef.current = false
    setError(null)
    fetchPage(0)
    return abortOngoing
  }, [fetchPage])

  useEffect(() => {
    const target = sentinelRef.current
    if (!target) return

    let debounce: ReturnType<typeof setTimeout> | null = null

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry.isIntersecting) return
        if (isLoadingRef.current || reachedEndRef.current) return

        if (debounce) clearTimeout(debounce)
        debounce = setTimeout(() => {
          fetchPage(offset)
        }, 90)
      },
      { root: null, rootMargin: `${rootMarginPx}px 0px ${rootMarginPx}px 0px`, threshold: 0.01 },
    )

    io.observe(target)
    return () => {
      io.disconnect()
      if (debounce) clearTimeout(debounce)
    }
  }, [fetchPage, offset, rootMarginPx])

  return (
    <>
      <Header />

      <main
        id="conteudo-principal"
        role="main"
        tabIndex={-1}
        className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white"
      >
        <CustomBreadcrumb
          items={[
            { href: '/', label: 'Início' },
            { href: '#', label: 'Lançamentos' },
          ]}
          className="mx-auto max-w-4xl px-4 pt-12 space-y-8"
        />
        <div className="mx-auto max-w-7xl px-4 py-4 sm:py-4">
          <section aria-labelledby="lista-lancamentos" className="relative">
            <header className="mb-6 text-center sm:mb-8">
              <h1 id="lista-lancamentos" className="text-2xl font-bold sm:text-3xl">
                Catálogo de Lançamentos
              </h1>
              <p className="mt-1 text-sm text-slate-300 sm:text-base">
                Explore todos os lançamentos da SpaceX
              </p>
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                {isLoading
                  ? 'Carregando mais lançamentos…'
                  : reachedEnd
                    ? 'Você chegou ao fim da lista.'
                    : ''}
              </p>
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
                  onClick={() => fetchPage(offset)}
                >
                  Tentar novamente
                </Button>
              </div>
            )}

            <div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              role="list"
              aria-label="Lançamentos"
            >
              {launches.map((launch) => (
                <div
                  key={launch.id}
                  className="[content-visibility:auto] [contain-intrinsic-size:420px]"
                >
                  <LaunchCard launch={launch} />
                </div>
              ))}
            </div>

            {isLoading && (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-44 rounded-xl sm:h-48" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            <div aria-hidden="true" className="h-16" />
            <div ref={sentinelRef} className="h-1 opacity-0" aria-hidden="true" />

            {reachedEnd && !isLoading && launches.length > 0 && (
              <div className="mt-10 border-t border-slate-700/50 py-8 text-center text-slate-400">
                <p className="text-base sm:text-lg">🎯 Você chegou ao fim!</p>
                <p className="mt-1 text-xs sm:text-sm">
                  Todos os {launches.length} lançamentos foram carregados.
                </p>
              </div>
            )}

            {!isLoading && launches.length === 0 && !error && (
              <div className="py-14 text-center text-slate-400">
                <p>Buscando lançamentos....</p>
                {showVideoOnly && (
                  <p className="mt-2 text-sm">Tente desativar o filtro de vídeo.</p>
                )}
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="text-white">Carregando…</div>
        </div>
      }
    >
      <LaunchesContent />
    </Suspense>
  )
}
