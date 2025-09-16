import { generateMetadata } from '@/app/launches/[id]/page'
import { getLaunchById } from '@/lib/api'

jest.mock('@/lib/api', () => ({
  getLaunchById: jest.fn(),
}))

const mockLaunch = {
  id: 'test-id-123',
  mission_name: 'Test Mission',
  details: 'Test mission details',
  links: {
    mission_patch: 'https://example.com/patch.png',
  },
}

export function formatLaunchDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
}

export function isFutureLaunch(isoDate: string): boolean {
  return new Date(isoDate) > new Date()
}

export interface LaunchStatus {
  status: string
  statusColor: string
  statusDescription: string
  statusIcon: string
  statusIconAlt: string
}

export function getLaunchStatus(launchSuccess: boolean | null, launchDate: string): LaunchStatus {
  const launchDateObj = new Date(launchDate)
  const isFutureLaunch = launchDateObj > new Date()

  if (launchSuccess === null) {
    if (isFutureLaunch) {
      return {
        status: 'Agendado',
        statusColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        statusDescription: 'Lançamento programado para o futuro',
        statusIcon: '⏰',
        statusIconAlt: 'Ícone de relógio indicando agendamento',
      }
    } else {
      return {
        status: 'Status Indeterminado',
        statusColor: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
        statusDescription: 'Status do lançamento não determinado',
        statusIcon: '❓',
        statusIconAlt: 'Ícone de interrogação indicando status indeterminado',
      }
    }
  } else if (launchSuccess) {
    return {
      status: 'Lançado com Sucesso',
      statusColor: 'bg-green-500/20 text-green-300 border border-green-500/30',
      statusDescription: 'Lançamento realizado com sucesso',
      statusIcon: '✅',
      statusIconAlt: 'Ícone de check indicando sucesso',
    }
  } else {
    return {
      status: 'Falhou',
      statusColor: 'bg-red-500/20 text-red-300 border border-red-500/30',
      statusDescription: 'Lançamento não foi bem-sucedido',
      statusIcon: '❌',
      statusIconAlt: 'Ícone de xis indicando falha',
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasVideo(links: any): boolean {
  return !!(links?.video_link && links.video_link !== '')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCoverImage(links: any): string | null {
  return links?.mission_patch || links?.flickr_images?.[0] || null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getGalleryImages(links: any): string[] {
  return links?.flickr_images || []
}

describe('generateMetadata', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve gerar metadados com dados do lançamento', async () => {
    ;(getLaunchById as jest.Mock).mockResolvedValue(mockLaunch)

    const metadata = await generateMetadata({ params: { id: 'test-id-123' } })

    expect(metadata).toEqual({
      title: 'Test Mission — SpaceX Launch Portal',
      description: 'Test mission details',
      openGraph: {
        title: 'Test Mission — SpaceX Launch Portal',
        description: 'Test mission details',
        images: [
          {
            url: 'https://example.com/patch.png',
            width: 512,
            height: 512,
            alt: 'Test Mission',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Test Mission — SpaceX Launch Portal',
        description: 'Test mission details',
      },
    })
  })

  it('deve gerar metadados de fallback quando o lançamento não tem detalhes', async () => {
    const launchWithoutDetails = {
      ...mockLaunch,
      details: null,
      links: { mission_patch: null },
    }
    ;(getLaunchById as jest.Mock).mockResolvedValue(launchWithoutDetails)

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

  it('deve gerar metadados padrão quando o lançamento não for encontrado', async () => {
    ;(getLaunchById as jest.Mock).mockRejectedValue(new Error('Not found'))

    const metadata = await generateMetadata({ params: { id: 'invalid-id' } })

    expect(metadata).toEqual({
      title: 'Detalhes do Lançamento — SpaceX Launch Portal',
      description: 'Página de detalhes do lançamento.',
    })
  })
})

describe('dateUtils', () => {
  describe('isFutureLaunch', () => {
    it('deve retornar true para datas futuras', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString()
      expect(isFutureLaunch(futureDate)).toBe(true)
    })

    it('deve retornar false para datas passadas', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString()
      expect(isFutureLaunch(pastDate)).toBe(false)
    })
  })
})

describe('getLaunchStatus', () => {
  const futureDate = new Date(Date.now() + 86400000).toISOString()
  const pastDate = new Date(Date.now() - 86400000).toISOString()

  it('deve retornar status agendado para lançamentos futuros com sucesso nulo', () => {
    const status = getLaunchStatus(null, futureDate)

    expect(status.status).toBe('Agendado')
    expect(status.statusColor).toContain('blue')
    expect(status.statusIcon).toBe('⏰')
  })

  it('deve retornar status indeterminado para lançamentos passados com sucesso nulo', () => {
    const status = getLaunchStatus(null, pastDate)

    expect(status.status).toBe('Status Indeterminado')
    expect(status.statusColor).toContain('gray')
    expect(status.statusIcon).toBe('❓')
  })

  it('deve retornar status de sucesso para lançamentos bem-sucedidos', () => {
    const status = getLaunchStatus(true, pastDate)

    expect(status.status).toBe('Lançado com Sucesso')
    expect(status.statusColor).toContain('green')
    expect(status.statusIcon).toBe('✅')
  })

  it('deve retornar status de falha para lançamentos que falharam', () => {
    const status = getLaunchStatus(false, pastDate)

    expect(status.status).toBe('Falhou')
    expect(status.statusColor).toContain('red')
    expect(status.statusIcon).toBe('❌')
  })
})

describe('mediaUtils', () => {
  const mockLinks = {
    video_link: 'https://example.com/video.mp4',
    mission_patch: 'https://example.com/patch.png',
    flickr_images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  }

  const emptyLinks = {
    video_link: null,
    mission_patch: null,
    flickr_images: [],
  }

  describe('hasVideo', () => {
    it('deve retornar true quando o link de vídeo existe', () => {
      expect(hasVideo(mockLinks)).toBe(true)
    })

    it('deve retornar false quando o link de vídeo está vazio', () => {
      expect(hasVideo({ video_link: '' })).toBe(false)
    })

    it('deve retornar false quando o link de vídeo é nulo', () => {
      expect(hasVideo(emptyLinks)).toBe(false)
    })
  })

  describe('getCoverImage', () => {
    it('deve retornar a missão patch quando disponível', () => {
      expect(getCoverImage(mockLinks)).toBe('https://example.com/patch.png')
    })

    it('deve retornar a primeira imagem flickr quando não há mission patch', () => {
      const linksWithoutPatch = {
        ...mockLinks,
        mission_patch: null,
      }
      expect(getCoverImage(linksWithoutPatch)).toBe('https://example.com/image1.jpg')
    })

    it('deve retornar null quando não há imagens disponíveis', () => {
      expect(getCoverImage(emptyLinks)).toBeNull()
    })
  })

  describe('getGalleryImages', () => {
    it('deve retornar imagens flickr quando disponíveis', () => {
      expect(getGalleryImages(mockLinks)).toEqual([
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ])
    })

    it('deve retornar array vazio quando não há imagens flickr', () => {
      expect(getGalleryImages(emptyLinks)).toEqual([])
    })
  })
})
