import appContext from '@/app-context'
import { ENV_PRODUCTION } from '_/env'
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import rootReducer from './reducers/root-reducer'
import { IStore } from './redux-types'

const initStore = () => {
    const {
        redux: { initialState },
    } = appContext

    // ** Middlewares **
    const middlewares: any[] = []

    // saga middleware
    const sagaMiddleware = createSagaMiddleware()
    middlewares.push(sagaMiddleware)

    // Store Enhancers
    const enhancers = [
        applyMiddleware(...middlewares),
    ]

    // Compose Enhancers
    const composeEnhancers =
        (!ENV_PRODUCTION && typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
        || compose

    const store: IStore = createStore(rootReducer, initialState, composeEnhancers(...enhancers))
    store.runSaga = sagaMiddleware.run
    store.close = () => store.dispatch(END)
    return store
}

export default initStore
