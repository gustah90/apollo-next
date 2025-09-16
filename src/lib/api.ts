import { Launch } from '@/app/types/launch'
import { getSSRClient, getCSRClient } from './graphql-client'
import { GET_LAUNCHES, GET_LAUNCHES_SIMPLE, GET_LAUNCH_DETAILS } from './queries'

const getUniversalClient = () => (typeof window === 'undefined' ? getSSRClient() : getCSRClient())

export async function getLaunchesCSR(limit?: number, offset?: number): Promise<Launch[]> {
  try {
    const client = getCSRClient()
    const variables: { limit?: number; offset?: number } = {}
    if (limit !== undefined) variables.limit = limit
    if (offset !== undefined) variables.offset = offset

    const data: { launches: Partial<Launch[]> } = await client.request(GET_LAUNCHES, variables)

    const sorted = (data.launches ?? []).slice().sort((a, b) => {
      const ad = Date.parse(a!.launch_date_utc)
      const bd = Date.parse(b!.launch_date_utc)
      return bd - ad
    })

    return limit !== undefined ? (sorted.slice(0, limit) as Launch[]) : (sorted as Launch[])
  } catch (error) {
    console.error('Error fetching launches from GraphQL (CSR):', error)
    return getFallbackLaunches()
  }
}

export async function getLaunchByIdCSR(id: string): Promise<Launch> {
  try {
    const client = getCSRClient()
    const data: { launch: Launch } = await client.request(GET_LAUNCH_DETAILS, { id })
    return data.launch
  } catch (error) {
    console.error('Error fetching launch details (CSR):', error)
    throw new Error('Failed to fetch launch details')
  }
}

export async function getLaunchesStatsCSR(): Promise<{ total: number; successful: number }> {
  try {
    const client = getCSRClient()
    const data: { launches: Launch[] } = await client.request(GET_LAUNCHES_SIMPLE)
    const launches = data.launches || []
    return {
      total: launches.length,
      successful: launches.filter((l) => Boolean(l.launch_success)).length,
    }
  } catch (error) {
    console.error('Error fetching stats (CSR):', error)
    return { total: 0, successful: 0 }
  }
}

export async function getLaunchesUniversal(limit?: number, offset?: number): Promise<Launch[]> {
  try {
    const client = getUniversalClient()
    const variables: { limit?: number; offset?: number } = {}
    if (limit !== undefined) variables.limit = limit
    if (offset !== undefined) variables.offset = offset

    const data: { launches: Launch[] } = await client.request(GET_LAUNCHES, variables)

    const sorted = (data.launches ?? []).slice().sort((a, b) => {
      const ad = Date.parse(a.launch_date_utc)
      const bd = Date.parse(b.launch_date_utc)
      return bd - ad
    })

    return limit !== undefined ? sorted.slice(0, limit) : sorted
  } catch (error) {
    console.error('Error fetching launches (Universal):', error)
    return getFallbackLaunches()
  }
}

export async function getLaunchById(id: string): Promise<Launch> {
  try {
    const client = getUniversalClient()
    const data: { launch: Launch } = await client.request(GET_LAUNCH_DETAILS, { id })
    return data.launch
  } catch (error) {
    console.error('Error fetching launch details (Universal):', error)
    throw new Error('Failed to fetch launch details')
  }
}

export async function getLaunchesStatsUniversal(): Promise<{ total: number; successful: number }> {
  try {
    const client = getUniversalClient()
    const data: { launches: Launch[] } = await client.request(GET_LAUNCHES_SIMPLE)
    const launches = data.launches || []
    return {
      total: launches.length,
      successful: launches.filter((l) => Boolean(l.launch_success)).length,
    }
  } catch (error) {
    console.error('Error fetching stats (Universal):', error)
    return { total: 0, successful: 0 }
  }
}

export async function getLaunches(limit?: number, offset?: number): Promise<Launch[]> {
  try {
    const client = getSSRClient()

    const variables: { limit?: number; offset?: number } = {}
    if (limit !== undefined) variables.limit = limit
    if (offset !== undefined) variables.offset = offset

    const data: { launches: Launch[] } = await client.request(GET_LAUNCHES, variables)

    const sorted = (data.launches ?? []).slice().sort((a: Launch, b: Launch) => {
      const ad = Date.parse(a.launch_date_utc)
      const bd = Date.parse(b.launch_date_utc)
      return bd - ad
    })

    if (limit !== undefined) {
      return sorted.slice(0, limit)
    }

    return sorted
  } catch (error) {
    console.error('Error fetching launches from GraphQL:', error)
    return getFallbackLaunches()
  }
}

export async function getLaunchesStats(): Promise<{ total: number; successful: number }> {
  try {
    const client = getSSRClient()
    const data: { launches: Launch[] } = await client.request(GET_LAUNCHES_SIMPLE)
    const launches = data.launches || []

    return {
      total: launches.length,
      successful: launches.filter((launch: Launch) => launch.launch_success).length,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return { total: 0, successful: 0 }
  }
}

/** Fallback permanece igual */
function getFallbackLaunches(): Launch[] {
  return [
    {
      id: 'fallback-1',
      mission_name: 'Falcon 9 Test Flight',
      launch_date_utc: '2024-01-01T00:00:00Z',
      launch_success: true,
      launch_site: 'Cape Canaveral',
      details: 'Mission demonstration flight',
      links: {
        mission_patch: '',
        mission_patch_small: '',
        article_link: '',
        video_link: '',
        wikipedia: '',
        flickr_images: [],
      },
      rocket: { rocket_name: 'Falcon 9', rocket_type: 'FT' },
    },
  ]
}
