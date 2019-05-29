import $matchSaga from '@/shared/redux/sagas/saga-matcher'
import { fork, take } from 'redux-saga/effects'

const $executeMatchedSaga = function* $saga() {
  const forever = true
  while (forever) {
    const action = yield take()
    const $matchedSaga = $matchSaga(action)
    if ($matchedSaga) {
      yield fork($matchedSaga, action)
    }
  }
}

export default function* $root() {
  yield fork($executeMatchedSaga)
}
