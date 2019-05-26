import sagaMatcher from '@/shared/redux/sagas/saga-matcher'
import { IAppContext } from '_/apps/@main/types'
import { fork, take } from 'redux-saga/effects'

const $executeMatchedSaga = (appContext: IAppContext) => function* $saga() {
  const forever = true
  const $matchSaga = sagaMatcher(appContext)
  while (forever) {
    const action = yield take()
    const $matchedSaga = $matchSaga(action)
    if ($matchedSaga) {
      yield fork($matchedSaga, action)
    }
  }
}

export default (appContext) => function* $root() {
  yield fork($executeMatchedSaga(appContext))
}
