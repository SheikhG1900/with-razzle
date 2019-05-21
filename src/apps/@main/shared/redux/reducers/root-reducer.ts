/**
 * Root Reducer
 */
import { IAppContext } from '@/shared/types'
import { routerReducer } from 'react-router-redux'
import { IAction, IStore } from '../redux-types'
import actionsSummaryReducer from './actions-summary-reducer'

export default (appContext: IAppContext) => (state: Partial<IStore> = {}, action: any): IStore => {
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
