import { loadableReady } from '@loadable/component'
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import appContext from './app-context'
import $rootSaga from './client/redux/sagas/root-saga'
import LayoutRouter from './shared/react/layouts/layout-router'
import initStore from './shared/redux/init-store'

// preloaded state from the server
appContext.redux.initialState = (window as any).__PRE_LOADED_STATE__

const store = initStore()
store.runSaga($rootSaga)

const cache = new InMemoryCache({
    dataIdFromObject: ({ uuid, __typename }: any) => (uuid + __typename) || null
})

const client = new ApolloClient({
    cache,
    uri: 'http://3.92.170.103:5555/',
})

loadableReady(() => {
    hydrate(
        <ApolloProvider client={client}>
            <Provider store={store}>
                <BrowserRouter>
                    <LayoutRouter />
                </BrowserRouter>
            </Provider>
        </ApolloProvider>,
        document.getElementById('root')
    )
})

if (module.hot) {
    module.hot.accept()
}

export default () => { console.log('client') }
