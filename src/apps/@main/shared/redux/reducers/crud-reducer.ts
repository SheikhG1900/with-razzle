import { actionCommands, actionModes } from '../redux-const'
import { IAction, IStoreCrud } from '../redux-types'

const { LOAD, ADD } = actionCommands
const { SUCCESS } = actionModes
const initialState: IStoreCrud = { crud: { rows: [] } }
export default (entity) => (state: IStoreCrud = initialState, action: IAction): IStoreCrud => {
  const { crud } = state
  let newCrud: IStoreCrud['crud'] | null = null

  const { data, command, mode: currentMode, meta } = action

  if (meta && meta.entity === entity) {
    if (currentMode === SUCCESS) {
      switch (command) {
        case LOAD:
          newCrud = { ...crud, rows: data.rows, loaded: true }
          break

        case ADD:
          newCrud = { ...crud, rows: [data.row, ...crud.rows] }
          break
      }
    }
  }

  return (newCrud) ? { ...state, crud: newCrud } : state
}
