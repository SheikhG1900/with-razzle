import { IStore } from '../redux-types'

export const getActionsSummary = ({ actionsSummary }: IStore) => actionsSummary
export const getRoot = (state) => state
export const getEntitySelector = (moduleName: string, entityName: string) => (state) => {
  const module = state[moduleName]
  if (module) {
    return module[entityName]
  }
  return null
}
