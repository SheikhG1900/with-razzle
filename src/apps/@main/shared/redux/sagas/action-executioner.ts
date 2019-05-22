import { call, put, select } from 'redux-saga/effects'
import { produceErrorAction, produceIgnoredAction, produceSuccessAction } from '../actions/mode-action-producers'
import { IAction } from '../redux-types'
import { crudIsLoaded } from '../selectors/entity-crud-selectors'
import { getEntitySelector } from '../selectors/root-selectors'

export function* $execute(action: IAction, job) {
  const { onMount, meta: { module, entity }, callback = {} } = action
  const { resolve, reject } = callback

  // specific case for avoiding extra loading of data.
  // when data were already fetched during server side rendering.
  if (onMount) {
    const entityState = yield select(getEntitySelector(module, entity))
    const alreadyLoaded = crudIsLoaded(entityState)
    if (alreadyLoaded) {
      yield put(produceIgnoredAction(action))
      if (resolve) {
        resolve(null, action)
      }
      return
    }
  }

  try {
    const result = yield call(job)
    yield put(produceSuccessAction(action, result))
    if (resolve) {
      resolve(action, result)
    }
  } catch (error) {
    yield put(produceErrorAction(action, error))
    if (reject) {
      reject(error, action)
    }
  }
}

export const dummy = {}
