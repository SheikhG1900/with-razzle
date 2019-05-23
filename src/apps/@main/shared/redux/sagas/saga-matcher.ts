import { IAppContext } from '@/shared/types'
import { IAction } from '../redux-types'
import { $match as $crudMatch } from './crud-sagas'

export default (appContext: IAppContext) => (action: IAction) => {
  let $saga = $crudMatch(action)

  if (!$saga) {
    const { redux: { sagaMatchers } } = appContext
    Object.values(sagaMatchers).some(($match) => {
      $saga = $match(action)
      return Boolean($saga)
    })
  }

  return $saga
}
