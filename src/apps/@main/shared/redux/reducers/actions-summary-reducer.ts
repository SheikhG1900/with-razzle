import { actionModes } from '../redux-const'
import { IAction, IStateActionsSummary } from '../redux-types'

const {
  SUCCESS, ERROR, REQUEST, IGNORED,
} = actionModes

const defaultState: IStateActionsSummary = {
  done: 0,
  error: 0,
  errors: [],
  ignored: 0,
  pending: 0,
  pendings: [],
  success: 0,
  total: 0,
}

export default (state: IStateActionsSummary = defaultState, action: IAction): IStateActionsSummary => {
  const { mode: currentMode, request } = action
  const { total, pending, done, success, ignored, error, pendings, errors } = state
  switch (currentMode) {
    case REQUEST:
      return {
        ...state,
        pending: pending + 1,
        pendings: [...pendings, action],
        total: total + 1,
      }
    case SUCCESS:
      return {
        ...state,
        done: done + 1,
        pending: pending - 1,
        pendings: pendings.filter((act) => act !== request),
        success: success + 1,
      }

    case IGNORED:
      return {
        ...state,
        done: done + 1,
        ignored: ignored + 1,
        pending: pending - 1,
        pendings: pendings.filter((act) => act !== request),
      }

    case ERROR:
      return {
        ...state,
        done: done + 1,
        error: error + 1,
        errors: [...errors, action],
        pending: pending - 1,
        pendings: pendings.filter((act) => act !== request),
      }

    default:
      return state
  }
}
