/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
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
  default: () => <div>LaunchCard</div>,
}))

jest.mock('@/components/ui/button', () => ({
  __esModule: true,
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
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

beforeAll(() => {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
    root = null
    rootMargin = ''
    thresholds = []
  }
  global.IntersectionObserver = IO

  window.scrollTo = () => {}
})

const mockGetLaunchesCSR = getLaunchesCSR as jest.MockedFunction<typeof getLaunchesCSR>

describe('LaunchesPage - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve lidar com array vazio de lançamentos', async () => {
    mockGetLaunchesCSR.mockResolvedValue([])

    render(<LaunchesPage />)

    await waitFor(() => {
      expect(screen.getByText('Você chegou ao fim 🎯')).toBeInTheDocument()
    })
  })

  it('deve lidar com erros de rede repetidos', async () => {
    mockGetLaunchesCSR.mockRejectedValueOnce(new Error('Network error'))

    render(<LaunchesPage />)

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível carregar os lançamentos. Tente novamente.'),
      ).toBeInTheDocument()
    })

    mockGetLaunchesCSR.mockRejectedValueOnce(new Error('Still failing'))
    screen.getByRole('button', { name: /tentar novamente/i }).click()

    await waitFor(() => {
      expect(mockGetLaunchesCSR).toHaveBeenCalledTimes(2)
    })
  })

  it('deve evitar race conditions durante carregamentos rápidos', async () => {
    let callCount = 0
    mockGetLaunchesCSR.mockImplementation(() => {
      callCount++
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: callCount.toString(),
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
        }, 50)
      })
    })

    render(<LaunchesPage />)

    await waitFor(() => {
      expect(mockGetLaunchesCSR).toHaveBeenCalledTimes(1)
    })

    expect(mockGetLaunchesCSR).toHaveBeenCalledTimes(1)
  })
})
