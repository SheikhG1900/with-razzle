import { IState } from '../redux-types'

export const getActionsSummary = ({ actionsSummary }: IState) => actionsSummary
export const getRoot = (state) => state
export const getEntitySelector = (moduleName: string, entityName: string) => (state) => {
  const module = state[moduleName]
  if (module) {
    return module[entityName]
  }
  return null
}
