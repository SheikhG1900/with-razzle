// @flow
import { actionModes } from '@/shared/redux/redux-const'
import { IAction, IActionError } from '@/shared/redux/redux-types'
import { makeActionTypeByAction } from './action-helper'

export const makeErrorAction = (action: IAction, error: any): IActionError => ({
  ...action,
  error,
  mode: actionModes.ERROR,
  request: action,
  type: makeActionTypeByAction(action, actionModes.ERROR),
})

export const makeSuccessAction = (action: IAction, result: any): IAction => ({
  ...action,
  data: result,
  mode: actionModes.SUCCESS,
  request: action,
  type: makeActionTypeByAction(action, actionModes.SUCCESS),
})

export const makeIgnoredAction = (action: IAction): IAction => ({
  ...action,
  mode: actionModes.IGNORED,
  request: action,
  type: makeActionTypeByAction(action, actionModes.IGNORED),
})
