/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'

type RequestFn = jest.Mock<Promise<unknown>, [string, Record<string, unknown>?]>
interface MockClient {
  request: RequestFn
}
const mockClient: MockClient = { request: jest.fn() as RequestFn }

jest.mock('@/lib/graphql-client', () => ({
  getSSRClient: (): MockClient => mockClient,
  getCSRClient: (): MockClient => mockClient,
}))

jest.mock('@/lib/queries', () => ({
  GET_LAUNCHES: 'GET_LAUNCHES',
  GET_LAUNCHES_SIMPLE: 'GET_LAUNCHES_SIMPLE',
  GET_LAUNCH_DETAILS: 'GET_LAUNCH_DETAILS',
}))

import { getLaunches, getLaunchById, getLaunchesStats } from '@/lib/api'
import { GET_LAUNCHES, GET_LAUNCHES_SIMPLE, GET_LAUNCH_DETAILS } from '@/lib/queries'
import { Launch } from '@/app/types/launch'

const originalError = console.error
beforeAll(() => {
  ;(console as unknown as { error: (...args: unknown[]) => void }).error = (...args: unknown[]) => {
    const first = String(args[0] ?? '')
    if (
      first.includes('Error fetching launches from GraphQL:') ||
      first.includes('Error fetching launch details:') ||
      first.includes('Error fetching stats:')
    ) {
      return
    }
  }
})
afterAll(() => {
  console.error = originalError
})

beforeEach(() => {
  jest.clearAllMocks()
})

const makeLaunch = (over: Partial<Launch>): Launch => ({
  id: 'id',
  mission_name: 'Mission',
  launch_date_utc: '2020-01-01T00:00:00Z',
  launch_success: true,
  launch_site: 'LC-39A',
  details: 'details',
  links: {
    mission_patch: '',
    mission_patch_small: '',
    article_link: '',
    video_link: '',
    wikipedia: '',
    flickr_images: [],
  },
  rocket: { rocket_name: 'Falcon 9', rocket_type: 'Block 5' },
  ...over,
})

describe('getLaunches', () => {
  it('chama o client com GET_LAUNCHES e sem variáveis quando não há limit/offset; retorna ordenado desc por data', async () => {
    const a = makeLaunch({ id: 'a', launch_date_utc: '2020-01-01T00:00:00Z' }) // mais antigo
    const b = makeLaunch({ id: 'b', launch_date_utc: '2020-01-03T00:00:00Z' }) // mais novo
    const c = makeLaunch({ id: 'c', launch_date_utc: '2020-01-02T00:00:00Z' })
    mockClient.request.mockResolvedValueOnce({ launches: [a, b, c] })

    const res = await getLaunches()

    expect(mockClient.request).toHaveBeenCalledWith(GET_LAUNCHES, {})
    expect(res.map((l) => l.id)).toEqual(['b', 'c', 'a'])
  })

  it('envia limit/offset nas variáveis e aplica slice por limit', async () => {
    const items = [
      makeLaunch({ id: '1', launch_date_utc: '2020-01-01T00:00:00Z' }),
      makeLaunch({ id: '2', launch_date_utc: '2020-01-02T00:00:00Z' }),
      makeLaunch({ id: '3', launch_date_utc: '2020-01-03T00:00:00Z' }),
      makeLaunch({ id: '4', launch_date_utc: '2020-01-04T00:00:00Z' }),
    ]
    mockClient.request.mockResolvedValueOnce({ launches: items })

    const res = await getLaunches(2, 10)

    expect(mockClient.request).toHaveBeenCalledWith(GET_LAUNCHES, { limit: 2, offset: 10 })
    expect(res.map((l) => l.id)).toEqual(['4', '3'])
  })

  it('retorna fallback quando a request falha', async () => {
    mockClient.request.mockRejectedValueOnce(new Error('boom'))

    const res = await getLaunches()

    expect(res.length).toBeGreaterThan(0)
    expect(res[0].id).toBe('fallback-1')
  })
})

describe('getLaunchById', () => {
  it('chama GET_LAUNCH_DETAILS e retorna o launch', async () => {
    const launch = makeLaunch({ id: 'xyz', mission_name: 'Demo' })
    mockClient.request.mockResolvedValueOnce({ launch })

    const res = await getLaunchById('xyz')

    expect(mockClient.request).toHaveBeenCalledWith(GET_LAUNCH_DETAILS, { id: 'xyz' })
    expect(res.id).toBe('xyz')
    expect(res.mission_name).toBe('Demo')
  })

  it('lança erro com mensagem amigável quando falha', async () => {
    mockClient.request.mockRejectedValueOnce(new Error('network'))

    await expect(getLaunchById('nope')).rejects.toThrow('Failed to fetch launch details')
  })
})

describe('getLaunchesStats', () => {
  it('chama GET_LAUNCHES_SIMPLE e calcula total/successful', async () => {
    const data: Launch[] = [
      makeLaunch({ id: '1', launch_success: true }),
      makeLaunch({ id: '2', launch_success: false }),
      makeLaunch({ id: '3', launch_success: true }),
    ]
    mockClient.request.mockResolvedValueOnce({ launches: data })

    const stats = await getLaunchesStats()

    expect(mockClient.request).toHaveBeenCalledWith(GET_LAUNCHES_SIMPLE)
    expect(stats).toEqual({ total: 3, successful: 2 })
  })

  it('retorna { total: 0, successful: 0 } quando falha', async () => {
    mockClient.request.mockRejectedValueOnce(new Error('down'))

    const stats = await getLaunchesStats()

    expect(stats).toEqual({ total: 0, successful: 0 })
  })
})
