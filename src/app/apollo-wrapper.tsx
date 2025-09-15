'use client'

import { HttpLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'

function makeClient() {
  const httpLink = new HttpLink({
    //uri: 'https://api.spacex.land/graphql/',
    uri: 'https://spacex-production.up.railway.app/',
    fetch,
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  })
}

export function ApolloWrapper({ children }: { readonly children: React.ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}
