import { GraphQLClient } from 'graphql-request'

const endpoint = 'https://spacex-production.up.railway.app/'

export const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getSSRClient = () => {
  return new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
    fetch,
  })
}

export const getCSRClient = (): GraphQLClient => {
  return new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, { ...init, cache: 'no-store' }),
  })
}
