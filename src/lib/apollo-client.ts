import { HttpLink } from '@apollo/client'
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      //uri: 'https://api.spacex.land/graphql/',
      uri: 'https://spacex-production.up.railway.app/',
      fetchOptions: {
        next: { revalidate: 60 },
      },
      fetch,
    }),
  })
})
