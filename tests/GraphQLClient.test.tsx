/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'

type HeadersInitLike = Record<string, string>
type CtorArgs = [string, { headers: HeadersInitLike; fetch?: typeof fetch }]

const mockFetch = jest.fn(() => Promise.resolve(new Response())) as unknown as typeof fetch
globalThis.fetch = mockFetch

jest.mock('graphql-request', () => {
  const GraphQLClient = jest.fn().mockImplementation(() => {
    let instance: unknown = null
    return {
      getInstance: () => {
        if (!instance) {
          instance = { tag: 'singleton' }
        }
        return instance
      },
      getSSRClient: () => {
        if (!instance) {
          throw new Error('getSSRClient() chamada antes da 1ª chamada getInstance()')
        }
        const newClient = { tag: 'ssr' }
        instance = newClient
        return newClient
      },
    }
  })
  return { GraphQLClient }
})

jest.mock('graphql-request', () => {
  const GraphQLClient = jest.fn()
  return { GraphQLClient }
})

describe('graphql-client', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('cria o singleton graphQLClient com endpoint e headers corretos na importação', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GraphQLClient } = require('graphql-request') as {
      GraphQLClient: jest.Mock<object, CtorArgs>
    }

    const firstInstance = { tag: 'singleton' }
    GraphQLClient.mockImplementationOnce(() => firstInstance)

    let mod: typeof import('@/lib/graphql-client')
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      mod = require('@/lib/graphql-client')
    })

    expect(GraphQLClient).toHaveBeenCalledTimes(1)
    const [endpointArg, optionsArg] = GraphQLClient.mock.calls[0] as CtorArgs
    expect(endpointArg).toBe('https://spacex-production.up.railway.app/')
    expect(optionsArg.headers).toEqual({ 'Content-Type': 'application/json' })

    expect(mod!.graphQLClient).toBe(firstInstance)
  })

  it('getSSRClient() cria nova instância com headers e fetch definidos', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GraphQLClient } = require('graphql-request') as {
      GraphQLClient: jest.Mock<object, CtorArgs>
    }

    const firstInstance = { tag: 'singleton' }
    const secondInstance = { tag: 'ssr' }
    GraphQLClient.mockImplementationOnce(() => firstInstance).mockImplementationOnce(
      () => secondInstance,
    )

    let mod: typeof import('@/lib/graphql-client')
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      mod = require('@/lib/graphql-client')
    })

    expect(GraphQLClient).toHaveBeenCalledTimes(1)
    expect(mod!.graphQLClient).toBe(firstInstance)

    const ssrClient = mod!.getSSRClient()

    expect(GraphQLClient).toHaveBeenCalledTimes(2)
    const [endpointArg2, optionsArg2] = GraphQLClient.mock.calls[1] as CtorArgs
    expect(endpointArg2).toBe('https://spacex-production.up.railway.app/')
    expect(optionsArg2.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(optionsArg2.fetch).toBe(globalThis.fetch)

    expect(ssrClient).toBe(secondInstance)
    expect(ssrClient).not.toBe(firstInstance)
  })
})
