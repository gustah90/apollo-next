/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LaunchesPage from '@/app/launches/page'
import { getLaunchesCSR } from '@/lib/api'

jest.mock('@/lib/api', () => ({
  __esModule: true,
  getLaunchesCSR: jest.fn(),
}))

jest.mock('@/components/layout/Header', () => ({
  __esModule: true,
  Header: () => <header>Header</header>,
}))

jest.mock('@/components/layout/Footer', () => ({
  __esModule: true,
  Footer: () => <footer>Footer</footer>,
}))

jest.mock('@/components/layout/LaunchCard', () => ({
  __esModule: true,
  default: () => <div role="listitem">LaunchCard</div>,
}))

jest.mock('@/components/ui/button', () => ({
  __esModule: true,
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/components/layout/CustomBreadcrumb', () => ({
  __esModule: true,
  CustomBreadcrumb: ({
    items,
  }: {
    items: Array<{ href: string; label: string; isCurrent?: boolean }>
  }) => (
    <nav data-testid="breadcrumb">
      {items.map((item, i) => (
        <span key={i}>{item.label}</span>
      ))}
    </nav>
  ),
}))

jest.mock('@/components/ui/skeleton', () => ({
  __esModule: true,
  Skeleton: ({ className = '' }: { className?: string }) => (
    <div data-slot="skeleton" className={`skeleton ${className}`}>
      Skeleton
    </div>
  ),
}))

jest.mock('next/navigation', () => ({
  __esModule: true,
  useSearchParams: () => ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    get: (_key: string) => null,
  }),
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ioInstances: any[] = []

beforeAll(() => {
  class IO {
    callback: IntersectionObserverCallback
    constructor(cb: IntersectionObserverCallback) {
      this.callback = cb
      ioInstances.push(this)
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
    root: Element | Document | null = null
    rootMargin = ''
    thresholds: ReadonlyArray<number> = []
    __trigger(entry: Partial<IntersectionObserverEntry> = {}) {
      const full: IntersectionObserverEntry = {
        isIntersecting: true,
        intersectionRatio: 1,
        target: document.createElement('div'),
        time: 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        boundingClientRect: {} as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        intersectionRect: {} as any,
        rootBounds: null,
        ...entry,
      }
      this.callback([full], this as unknown as IntersectionObserver)
    }
  }
  global.IntersectionObserver = IO

  window.scrollTo = jest.fn()
})

afterEach(() => {
  ioInstances.length = 0
})

const mockGetLaunchesCSR = getLaunchesCSR as jest.MockedFunction<typeof getLaunchesCSR>

describe('LaunchesPage - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('deve lidar com erros de rede repetidos (sem warning de act)', async () => {
    mockGetLaunchesCSR.mockRejectedValueOnce(new Error('Network error'))

    render(<LaunchesPage />)

    expect(
      await screen.findByText('Não foi possível carregar os lançamentos. Tente novamente.'),
    ).toBeInTheDocument()

    mockGetLaunchesCSR.mockRejectedValueOnce(new Error('Still failing'))

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /tentar novamente/i }))

    await waitFor(() => {
      expect(mockGetLaunchesCSR).toHaveBeenCalledTimes(2)
    })
  })

  it('deve evitar race conditions durante carregamentos rápidos', async () => {
    let callCount = 0
    mockGetLaunchesCSR.mockImplementation(() => {
      callCount++
      return Promise.resolve([
        {
          id: String(callCount),
          mission_name: `Mission ${callCount}`,
          launch_date_utc: '2023-01-01',
          launch_success: true,
          details: 'Test',
          launch_site: 'LC-39A',
          links: {
            mission_patch_small: null,
            mission_patch: null,
            flickr_images: [],
            video_link: null,
            article_link: null,
            wikipedia: null,
          },
          rocket: { rocket_name: 'Falcon 9', rocket_type: 'FT' },
        },
      ])
    })

    render(<LaunchesPage />)

    await waitFor(() => {
      expect(mockGetLaunchesCSR).toHaveBeenCalledTimes(1)
    })

    act(() => ioInstances[0]?.__trigger({ isIntersecting: true }))

    expect(mockGetLaunchesCSR).toHaveBeenCalledTimes(1)
  })
})
