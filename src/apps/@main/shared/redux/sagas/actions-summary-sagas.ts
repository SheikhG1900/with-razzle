import { all, fork, join, select } from 'redux-saga/effects'
import { IAction, IStoreActionsSummary } from '../redux-types'
import { getActionsSummary } from '../selectors/root-selectors'

export const $processPendingRequests = ($matchSaga) => function* $saga() {
    const summary: IStoreActionsSummary = yield select(getActionsSummary)

    const tasks = yield all(summary.pendings.map((action: IAction) => {
        const $matchedSaga = $matchSaga(action)
        return ($matchedSaga) ? fork($matchedSaga, action) : null
    }).filter((item) => item))

    yield all(tasks.map((task) => join(task)))
}

export const dummy = null
