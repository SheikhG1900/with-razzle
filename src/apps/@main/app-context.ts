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
            moduleA: (state = { cat: undefined }, action, root) => {
                const crud = crudReducer('moduleA', 'cat')
                const { cat } = state
                const newCat = crud(cat, action)
                return (newCat === cat) ? state : { ...state, cat: newCat }
            }
        },
        sagaMatchers: {
            crud: $crudMatch
        },
    },
}
export default context
