/**
 * @jest-environment jsdom
 */
import React, { cloneElement, isValidElement } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

type PropsWithChildren<P = Record<string, unknown>> = P & { children?: ReactNode }

interface ButtonProps extends PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> {
  asChild?: boolean
}
jest.mock('@/components/ui/button', () => ({
  Button: ({ asChild, children, ...rest }: ButtonProps): ReactElement => {
    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement, { ...rest })
    }
    return <button {...rest}>{children}</button>
  },
}))

type CardShellProps = PropsWithChildren<{ className?: string }>
jest.mock('@/components/ui/card', () => ({
  Card: ({ className, children, ...rest }: CardShellProps): ReactElement => (
    <div data-testid="card" className={className} {...rest}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...rest }: PropsWithChildren): ReactElement => (
    <div {...rest}>{children}</div>
  ),
  CardTitle: ({ children, ...rest }: PropsWithChildren): ReactElement => (
    <div {...rest}>{children}</div>
  ),
  CardContent: ({ children, ...rest }: PropsWithChildren): ReactElement => (
    <div {...rest}>{children}</div>
  ),
}))

jest.mock('@/components/layout/Header', () => ({ Header: (): ReactElement | null => null }))
jest.mock('@/components/layout/Footer', () => ({ Footer: (): ReactElement | null => null }))

interface LaunchCardProps {
  launch: {
    id: string
    mission_name: string
  }
}
jest.mock('@/components/layout/LaunchCard', () => ({
  __esModule: true,
  default: ({ launch }: LaunchCardProps): ReactElement => (
    <article data-testid="launch-card">
      <h3>{launch.mission_name}</h3>
    </article>
  ),
}))

type RefreshButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
jest.mock('@/components/layout/RefreshButton', () => ({
  __esModule: true,
  default: (props: RefreshButtonProps): ReactElement => <button {...props}>Atualizar</button>,
}))

interface LinkProps extends PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>> {
  href: string
}
jest.mock('next/link', () => {
  const Link = ({ href, children, ...rest }: LinkProps): ReactElement => (
    <a href={href} {...rest}>
      {children}
    </a>
  )
  ;(Link as unknown as { displayName: string }).displayName = 'Link'
  return Link
})

interface MockImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string
}
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: MockImageProps): ReactElement => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt ?? ''} {...props} />
  },
}))

type GetLaunchesFn = jest.Mock<Promise<unknown[]>, []>
type GetStatsFn = jest.Mock<Promise<{ total: number; successful: number }>, []>

jest.mock('@/lib/api', () => ({
  getLaunches: jest.fn(),
  getLaunchesStats: jest.fn(),
}))

import HomePage from '@/app/page'

describe('HomePage (unit)', () => {
  const api = jest.requireMock('@/lib/api') as {
    getLaunches: GetLaunchesFn
    getLaunchesStats: GetStatsFn
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('renderiza título, estatísticas (pt-BR) e no máximo 6 LaunchCards', async () => {
    const launchesMock = Array.from({ length: 8 }).map((_, i) => ({
      id: `id-${i}`,
      mission_name: `Missão ${i}`,
      launch_date_utc: '2020-01-01T00:00:00.000Z',
      launch_success: i % 2 === 0,
      details: 'Detalhes',
      links: {
        mission_patch_small: '',
        mission_patch: '',
        flickr_images: [] as string[],
        video_link: i % 3 === 0 ? 'https://youtube.com/x' : null,
      },
      rocket: { rocket_name: 'Falcon 9', rocket_type: 'Block 5' },
      launch_site: 'LC-39A',
    }))
    const statsMock = { total: 1234, successful: 987 }

    api.getLaunches.mockResolvedValueOnce(launchesMock)
    api.getLaunchesStats.mockResolvedValueOnce(statsMock)

    const element = await HomePage()
    render(element)

    expect(screen.getByRole('heading', { name: /spacex launch portal/i })).toBeInTheDocument()

    expect(screen.getByText(/total de lançamentos/i)).toBeInTheDocument()
    expect(screen.getByText('1.234')).toBeInTheDocument()

    expect(screen.getByText(/bem-sucedidos/i)).toBeInTheDocument()
    expect(screen.getByText('987')).toBeInTheDocument()

    expect(screen.getByText(/lançamentos com vídeo/i)).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()

    const cards = screen.getAllByTestId('launch-card')
    expect(cards).toHaveLength(6)
    expect(cards[0]).toHaveTextContent('Missão 0')
  })

  it('usa fallbacks quando as promessas falham', async () => {
    api.getLaunches.mockRejectedValueOnce(new Error('fail'))
    api.getLaunchesStats.mockRejectedValueOnce(new Error('fail'))

    const element = await HomePage()
    render(element)

    expect(screen.getByText(/total de lançamentos/i)).toBeInTheDocument()
    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
    expect(screen.getByText(/bem-sucedidos/i)).toBeInTheDocument()
    expect(screen.getByText(/lançamentos com vídeo/i)).toBeInTheDocument()

    expect(screen.queryByTestId('launch-card')).not.toBeInTheDocument()
  })
})
