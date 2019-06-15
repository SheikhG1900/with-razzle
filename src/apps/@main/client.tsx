import { loadableReady } from '@loadable/component'
import React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter} from 'react-router-dom'
import appContext from './app-context'
import $rootSaga from './client/redux/sagas/root-saga'
import LayoutRouter from './shared/react/layouts/layout-router'
import initStore from './shared/redux/init-store'

// preloaded state from the server
appContext.redux.initialState = (window as any).__PRE_LOADED_STATE__

const store = initStore()
store.runSaga($rootSaga)

loadableReady(() => {
    hydrate(
        <Provider store={store}>
            <BrowserRouter>
                <LayoutRouter />
            </BrowserRouter>
        </Provider>,
        document.getElementById('root')
    )
})

if (module.hot) {
    module.hot.accept()
}

export default () => { console.log('client') }
