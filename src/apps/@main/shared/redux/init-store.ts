import { ENV_PRODUCTION } from '_/env'
import { routerMiddleware } from 'react-router-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import { IAppContext } from '../types'
import rootReducer from './reducers/root-reducer'
import { IStore } from './redux-types'

const initStore = (appContext: IAppContext) => {
    const {
        app: { browserHistory },
        redux: { initialState },
    } = appContext

    // ** Middlewares **
    const middlewares: any[] = []

    // saga middleware
    const sagaMiddleware = createSagaMiddleware()
    middlewares.push(sagaMiddleware)

    // router redux middleware
    if (browserHistory) {
        middlewares.push(routerMiddleware(browserHistory))
    }

    // Store Enhancers
    const enhancers = [
        applyMiddleware(...middlewares),
    ]

    // Compose Enhancers
    const composeEnhancers =
        (!ENV_PRODUCTION && typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
        || compose

    const store: IStore = createStore(rootReducer(appContext), initialState, composeEnhancers(...enhancers))
    store.runSaga = sagaMiddleware.run
    store.close = () => store.dispatch(END)
    return store
}

export default initStore
