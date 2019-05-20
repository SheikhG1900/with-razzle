import createFunctions from '@/shared/redux/actions/action-helper'
import { actionCommands, actionModes } from '@/shared/redux/redux-const'

export default ((module: string, entity: string) => {
  const { makeActionCreator } = createFunctions(module, entity)
  const load = makeActionCreator(actionCommands.LOAD, actionModes.REQUEST)
  const add = makeActionCreator(actionCommands.ADD, actionModes.REQUEST)

  return {
    add,
    load,
  }
})
