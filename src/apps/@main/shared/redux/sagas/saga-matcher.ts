import { IAppContext } from '_/apps/@main/types'
import { IAction } from '../redux-types'
import { $match as $crudMatch } from './crud-sagas'

export default (appContext: IAppContext) => (action: IAction) => {
  let $saga = null
  const { redux: { sagaMatchers } } = appContext
  Object.values(sagaMatchers).some(($match) => {
    $saga = $match(action)
    return Boolean($saga)
  })

  return $saga
}
