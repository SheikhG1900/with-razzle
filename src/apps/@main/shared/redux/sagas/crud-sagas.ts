import callApi from '../../api/api-caller'
import { actionCommands, actionModes } from '../redux-const'
import { IAction } from '../redux-types'
import { $execute } from './action-executioner'

export const $load = (action: IAction) => {
  const { meta: { module, entity }, data } = action
  return $execute(action, () => callApi(`${module}/${entity}/search`, 'post', data))
}

export const $add = (action: IAction) => {
  const { meta: { module, entity }, data } = action
  return $execute(action, () => callApi(`${module}/${entity}`, 'post', data))
}

export const $match = ({ command, mode }: IAction) => {
  if (mode === actionModes.REQUEST) {
    switch (command) {
      case actionCommands.LOAD:
        return $load

      case actionCommands.ADD:
        return $add

      default:
        return null
    }
  }

  return null
}
