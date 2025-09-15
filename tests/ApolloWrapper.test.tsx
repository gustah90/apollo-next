/**
 * @jest-environment jsdom
 */
import React from 'react'
import type { ReactElement, ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { HttpLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'
import { ApolloWrapper } from '@/app/apollo-wrapper'

type ProviderProps = { children?: ReactNode; makeClient: () => unknown }
type HttpLinkArg = { uri: string; fetch: typeof fetch }

const mockFetch = jest.fn(() => Promise.resolve(new Response())) as unknown as typeof fetch
globalThis.fetch = mockFetch

jest.mock('@apollo/client', () => {
  const HttpLink = jest.fn()
  return { HttpLink }
})

jest.mock('@apollo/client-integration-nextjs', () => {
  const React = jest.requireActual('react') as typeof import('react')
  return {
    ApolloNextAppProvider: jest.fn(
      ({ children }: ProviderProps): ReactElement => <div>{children}</div>,
    ),
    ApolloClient: jest.fn(),
    InMemoryCache: jest.fn(),
  }
})

const mockedHttpLink = HttpLink as unknown as jest.Mock<object, [HttpLinkArg]>
const mockedApolloClient = ApolloClient as unknown as jest.Mock<
  object,
  [{ cache: object; link: object }]
>
const mockedInMemoryCache = InMemoryCache as unknown as jest.Mock<object, []>
const mockedProvider = ApolloNextAppProvider as unknown as jest.Mock<ReactElement, [ProviderProps]>

describe('ApolloWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockedHttpLink.mockImplementation(() => ({}))
    mockedApolloClient.mockImplementation(() => ({}))
    mockedInMemoryCache.mockImplementation(() => ({}))
  })

  it('deve renderizar children corretamente', () => {
    render(
      <ApolloWrapper>
        <div>Test Children</div>
      </ApolloWrapper>,
    )

    expect(screen.getByText('Test Children')).toBeInTheDocument()
  })

  it('deve usar ApolloNextAppProvider', () => {
    render(
      <ApolloWrapper>
        <div>Test Children</div>
      </ApolloWrapper>,
    )

    expect(mockedProvider).toHaveBeenCalledTimes(1)
  })

  it('deve criar HttpLink com a URI correta (ao executar makeClient)', () => {
    render(
      <ApolloWrapper>
        <div>Test Children</div>
      </ApolloWrapper>,
    )

    const firstCallArgs = mockedProvider.mock.calls[0]?.[0] as ProviderProps
    expect(firstCallArgs).toBeTruthy()

    firstCallArgs.makeClient()

    expect(mockedHttpLink).toHaveBeenCalledWith({
      uri: 'https://spacex-production.up.railway.app/',
      fetch: globalThis.fetch,
    })
  })

  it('deve criar ApolloClient com cache e link corretos (ao executar makeClient)', () => {
    const httpLinkInstance = {}
    mockedHttpLink.mockImplementationOnce(() => httpLinkInstance)

    render(
      <ApolloWrapper>
        <div>Test Children</div>
      </ApolloWrapper>,
    )

    const firstCallArgs = mockedProvider.mock.calls[0]?.[0] as ProviderProps
    firstCallArgs.makeClient()

    expect(mockedApolloClient).toHaveBeenCalledWith({
      cache: expect.any(Object),
      link: httpLinkInstance,
    })
  })

  it('deve criar InMemoryCache (ao executar makeClient)', () => {
    render(
      <ApolloWrapper>
        <div>Test Children</div>
      </ApolloWrapper>,
    )

    const firstCallArgs = mockedProvider.mock.calls[0]?.[0] as ProviderProps
    firstCallArgs.makeClient()

    expect(mockedInMemoryCache).toHaveBeenCalled()
  })

  it('deve passar makeClient function para ApolloNextAppProvider', () => {
    render(
      <ApolloWrapper>
        <div>Test Children</div>
      </ApolloWrapper>,
    )

    const firstCallArgs = mockedProvider.mock.calls[0]?.[0] as ProviderProps

    expect(typeof firstCallArgs.makeClient).toBe('function')
    expect(firstCallArgs.children).toBeTruthy()
  })

  it('deve ser acessível (container renderizado)', () => {
    const { container } = render(
      <ApolloWrapper>
        <div>Test Content</div>
      </ApolloWrapper>,
    )

    expect(container.firstChild).toBeTruthy()
  })
})
