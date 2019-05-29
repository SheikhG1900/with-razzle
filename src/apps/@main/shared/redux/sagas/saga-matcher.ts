import appContext from '@/app-context'
import { IAction } from '../redux-types'

export default (action: IAction) => {
  let $saga = null
  const { redux: { sagaMatchers } } = appContext
  Object.values(sagaMatchers).some(($match) => {
    $saga = $match(action)
    return Boolean($saga)
  })

  return $saga
}
