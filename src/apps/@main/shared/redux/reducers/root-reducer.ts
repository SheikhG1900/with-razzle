/**
 * Root Reducer
 */
import { IAppContext } from '_/apps/@main/types'
import { routerReducer } from 'react-router-redux'
import { IAction, IState } from '../redux-types'
import actionsSummaryReducer from './actions-summary-reducer'

export default (appContext: IAppContext) => (state: Partial<IState> = {}, action: any): IState => {
  const { redux: { reducers } } = appContext
  const newState = {
    actionsSummary: actionsSummaryReducer(state.actionsSummary, action),
    routing: routerReducer(state.routing, action, state),
  }

  // custom reducers
  Object.keys(reducers).forEach((key) => {
    newState[key] = reducers[key](state[key], action, state)
  })

  return newState
}
