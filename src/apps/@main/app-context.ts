import crudReducer from './shared/redux/reducers/crud-reducer'
import { $match as $crudMatch } from './shared/redux/sagas/crud-sagas'
import { IAppContext } from './types'

const context: IAppContext = {
    app: {
        routerContext: {}
    },
    redux: {
        initialState: {},
        reducers: {
            moduleA: {
                cat: crudReducer('moduleA', 'cat')
            }
        },
        sagaMatchers: {
            crud: $crudMatch
        },
    },
}
export default context
