/* eslint-disable @next/next/no-img-element */

/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('graphql-request', () => {
  const GraphQLClient = jest.fn()
  return { __esModule: true, GraphQLClient }
})

jest.mock('@/lib/api', () => ({ getLaunchById: jest.fn() }))

jest.mock('next/navigation', () => ({ notFound: jest.fn() }))

jest.mock('next/link', () => {
  const Link = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
  >(({ href, ...props }, ref) => <a ref={ref} href={href} {...props} />)
  Link.displayName = 'Link'
  return { __esModule: true, default: Link }
})

jest.mock('@/components/ui/button', () => {
  const { cloneElement, isValidElement } = React
  const Button = ({
    asChild,
    children,
    ...rest
  }: {
    asChild?: boolean
    children: React.ReactNode
  } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    if (asChild && isValidElement(children)) {
      return cloneElement(children as React.ReactElement, { ...rest })
    }
    return <button {...rest}>{children}</button>
  }
  return { __esModule: true, Button }
})

jest.mock('@/components/ui/card', () => ({
  __esModule: true,
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid="card-title">{children}</h3>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="card-description">{children}</p>
  ),
}))
jest.mock('@/components/ui/badge', () => ({
  __esModule: true,
  Badge: ({ children, className, ...props }: { children: React.ReactNode; className?: string }) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
}))

jest.mock('@/components/ui/dialog', () => ({
  __esModule: true,
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog">{children}</div>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogClose: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="dialog-close">{children}</button>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h4 data-testid="dialog-title">{children}</h4>
  ),
}))

jest.mock('@/components/layout/Header', () => ({
  __esModule: true,
  Header: () => <header data-testid="header">Header</header>,
}))
jest.mock('@/components/layout/Footer', () => ({
  __esModule: true,
  Footer: () => <footer data-testid="footer">Footer</footer>,
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

jest.mock('@/components/layout/VideoPlayer', () => ({
  __esModule: true,
  default: ({ videoUrl, buttonLabel }: { videoUrl: string; buttonLabel: string }) => (
    <div data-testid="video-player">
      <button>{buttonLabel}</button>
      <span>{videoUrl}</span>
    </div>
  ),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
    priority,
    loading,
  }: {
    src: string
    alt: string
    className?: string
    priority?: boolean
    loading?: 'lazy' | 'eager'
  }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      data-priority={priority}
      data-loading={loading}
      data-testid="image"
    />
  ),
}))

import LaunchDetailsPage, { generateMetadata } from '@/app/launches/[id]/page'
import { getLaunchById } from '@/lib/api'
import { notFound } from 'next/navigation'

const mockLaunch = {
  id: 'test-id-123',
  mission_name: 'Test Mission',
  launch_date_utc: '2023-01-01T12:00:00.000Z',
  details: 'Test mission details',
  launch_success: true,
  rocket: { rocket_name: 'Falcon 9', rocket_type: 'FT' },
  launch_site: 'Kennedy Space Center',
  links: {
    mission_patch: 'https://example.com/patch.png',
    video_link: 'https://example.com/video.mp4',
    wikipedia: 'https://en.wikipedia.org/wiki/Test_Mission',
    article_link: 'https://example.com/article',
    flickr_images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  },
}
const mockFailedLaunch = { ...mockLaunch, launch_success: false }
const mockFutureLaunch = {
  ...mockLaunch,
  launch_date_utc: new Date(Date.now() + 86400000).toISOString(),
  launch_success: null as unknown as boolean,
}
const mockLaunchWithoutDetails = {
  ...mockLaunch,
  details: null as unknown as string,
  links: {
    ...mockLaunch.links,
    mission_patch: null as unknown as string,
    video_link: null as unknown as string,
    wikipedia: null as unknown as string,
    article_link: null as unknown as string,
    flickr_images: [] as string[],
  },
}

describe('LaunchDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar a página com dados válidos', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockLaunch)

    render(await LaunchDetailsPage({ params: { id: 'test-id-123' } }))

    await waitFor(() => {
      expect(screen.getByText('Test mission details')).toBeInTheDocument()
      expect(screen.getByText('Falcon 9')).toBeInTheDocument()
      expect(screen.getByText('Kennedy Space Center')).toBeInTheDocument()
    })
  })

  it('deve chamar notFound quando o lançamento não for encontrado', async () => {
    ;(getLaunchById as jest.Mock).mockRejectedValue(new Error('Not found'))

    render(await LaunchDetailsPage({ params: { id: 'invalid-id' } }))

    await waitFor(() => {
      expect(notFound).toHaveBeenCalled()
    })
  })

  it('deve mostrar status "Lançado com Sucesso"', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockLaunch)

    render(await LaunchDetailsPage({ params: { id: 'test-id-123' } }))

    await waitFor(() => {
      expect(screen.getByText('Lançado com Sucesso')).toBeInTheDocument()
    })
  })

  it('deve mostrar status "Falhou"', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockFailedLaunch)

    render(await LaunchDetailsPage({ params: { id: 'test-id-123' } }))

    await waitFor(() => {
      expect(screen.getByText('Falhou')).toBeInTheDocument()
    })
  })

  it('deve mostrar status "Agendado" para futuro', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockFutureLaunch)

    render(await LaunchDetailsPage({ params: { id: 'test-id-123' } }))

    await waitFor(() => {
      expect(screen.getByText('Agendado')).toBeInTheDocument()
    })
  })

  it('deve mostrar mensagem padrão sem detalhes', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockLaunchWithoutDetails)

    render(await LaunchDetailsPage({ params: { id: 'test-id-123' } }))

    await waitFor(() => {
      expect(screen.getByText('Sem descrição disponível para este lançamento.')).toBeInTheDocument()
    })
  })

  it('renderiza links externos quando disponíveis', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockLaunch)

    render(await LaunchDetailsPage({ params: { id: 'test-id-123' } }))

    await waitFor(() => {
      expect(screen.getByText('Wikipedia')).toBeInTheDocument()
      expect(screen.getByText('Artigo')).toBeInTheDocument()
    })
  })

  it('renderiza o video player quando houver link de vídeo', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockLaunch)

    render(await LaunchDetailsPage({ params: { id: 'test-id-123' } }))

    await waitFor(() => {
      expect(screen.getByTestId('video-player')).toBeInTheDocument()
      expect(screen.getByText('Assistir vídeo do lançamento')).toBeInTheDocument()
    })
  })

  it('não renderiza o video player quando não houver link de vídeo', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockLaunchWithoutDetails)

    render(await LaunchDetailsPage({ params: { id: 'test-id-123' } }))

    await waitFor(() => {
      expect(screen.queryByTestId('video-player')).not.toBeInTheDocument()
    })
  })

  it('renderiza galeria de imagens quando houver imagens', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockLaunch)

    render(await LaunchDetailsPage({ params: { id: 'test-id-123' } }))

    await waitFor(() => {
      expect(screen.getByText('Galeria de Imagens')).toBeInTheDocument()
    })
  })

  it('não renderiza a galeria quando não houver imagens', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockLaunchWithoutDetails)

    render(await LaunchDetailsPage({ params: { id: 'test-id-123' } }))

    await waitFor(() => {
      expect(screen.queryByText('Galeria de Imagens')).not.toBeInTheDocument()
    })
  })

  it('renderiza o placeholder quando não houver mission patch', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockLaunchWithoutDetails)

    render(await LaunchDetailsPage({ params: { id: 'test-id-123' } }))

    await waitFor(() => {
      expect(
        screen.getByLabelText(/ícone de foguete representando missão espacial/i),
      ).toBeInTheDocument()
    })
    expect(screen.queryByTestId('image')).not.toBeInTheDocument()
  })

  it('formata a data corretamente (Intl)', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockLaunch)

    render(await LaunchDetailsPage({ params: { id: 'test-id-123' } }))

    const formatted = new Date(mockLaunch.launch_date_utc).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    await waitFor(() => {
      expect(screen.getByText(new RegExp(formatted, 'i'))).toBeInTheDocument()
    })
  })
})

describe('generateMetadata', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('gera metadata sem imagens quando não houver mission patch', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockLaunchWithoutDetails)

    const metadata = await generateMetadata({ params: { id: 'test-id-123' } })

    expect(metadata).toEqual({
      title: 'Test Mission — SpaceX Launch Portal',
      description: 'Detalhes do lançamento Test Mission no SpaceX Launch Portal.',
      openGraph: {
        title: 'Test Mission — SpaceX Launch Portal',
        description: 'Detalhes do lançamento Test Mission no SpaceX Launch Portal.',
        images: undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Test Mission — SpaceX Launch Portal',
        description: 'Detalhes do lançamento Test Mission no SpaceX Launch Portal.',
      },
    })
  })

  it('gera metadata padrão quando o lançamento não for encontrado', async () => {
    ;(getLaunchById as jest.Mock).mockRejectedValue(new Error('Not found'))

    const metadata = await generateMetadata({ params: { id: 'invalid-id' } })

    expect(metadata).toEqual({
      title: 'Detalhes do Lançamento — SpaceX Launch Portal',
      description: 'Página de detalhes do lançamento.',
    })
  })
})
