/**
 * Root Reducer
 */
import appContext from '@/app-context'
import { IAction, IState } from '../redux-types'
import actionsSummaryReducer from './actions-summary-reducer'

export default (state: Partial<IState> = {}, action: IAction): IState => {
  const { redux: { reducers } } = appContext
  const newState = {
    actionsSummary: actionsSummaryReducer(state.actionsSummary, action),
  }

  // custom reducers
  Object.keys(reducers).forEach((key) => {
    newState[key] = reducers[key](state[key], action, state)
  })

  return newState
}
