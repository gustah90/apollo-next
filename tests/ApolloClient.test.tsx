/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'

type HttpLinkArgs = {
  uri: string
  fetchOptions?: { next?: { revalidate?: number } }
  fetch: typeof fetch
}
type ApolloArgs = { cache: object; link: object }

const mockFetch = jest.fn(() => Promise.resolve(new Response())) as unknown as typeof fetch
globalThis.fetch = mockFetch

jest.mock('@apollo/client', () => {
  const HttpLink = jest.fn()
  return { HttpLink }
})

jest.mock('@apollo/client-integration-nextjs', () => {
  const ApolloClient = jest.fn()
  const InMemoryCache = jest.fn()
  const registerApolloClient = (fn: () => unknown) => ({
    getClient: () => fn(),
  })
  return { ApolloClient, InMemoryCache, registerApolloClient }
})

import { getClient } from '@/lib/apollo-client'

const { HttpLink } = jest.requireMock('@apollo/client') as {
  HttpLink: jest.Mock<object, [HttpLinkArgs]>
}
const apolloIntegration = jest.requireMock('@apollo/client-integration-nextjs') as {
  ApolloClient: jest.Mock<object, [ApolloArgs]>
  InMemoryCache: jest.Mock<object, []>
  registerApolloClient: jest.Mock
}

describe('apollo-client (registerApolloClient)', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    apolloIntegration.ApolloClient.mockImplementation(() => ({ kind: 'ApolloClient' }))
    apolloIntegration.InMemoryCache.mockImplementation(() => ({ kind: 'Cache' }))
    ;(HttpLink as jest.Mock).mockImplementation(() => ({ kind: 'HttpLink' }))
  })

  it('expõe getClient como função', () => {
    expect(typeof getClient).toBe('function')
  })

  it('ao chamar getClient(), cria HttpLink com URI, fetchOptions e fetch esperados', () => {
    getClient()

    expect(HttpLink).toHaveBeenCalledTimes(1)
    const args = (HttpLink as jest.Mock).mock.calls[0]?.[0] as HttpLinkArgs
    expect(args).toBeTruthy()
    expect(args.uri).toBe('https://spacex-production.up.railway.app/')
    expect(args.fetchOptions).toEqual({ next: { revalidate: 60 } })
    expect(args.fetch).toBe(globalThis.fetch)
  })

  it('ao chamar getClient(), cria InMemoryCache e ApolloClient com { cache, link }', () => {
    const httpLinkInstance = { tag: 'http' }
    const cacheInstance = { tag: 'cache' }

    ;(HttpLink as jest.Mock).mockImplementationOnce(() => httpLinkInstance)
    apolloIntegration.InMemoryCache.mockImplementationOnce(() => cacheInstance)

    getClient()

    expect(apolloIntegration.InMemoryCache).toHaveBeenCalledTimes(1)
    expect(apolloIntegration.ApolloClient).toHaveBeenCalledTimes(1)

    const apolloArgs = apolloIntegration.ApolloClient.mock.calls[0]?.[0] as ApolloArgs
    expect(apolloArgs.link).toBe(httpLinkInstance)
    expect(apolloArgs.cache).toBe(cacheInstance)
  })
})
