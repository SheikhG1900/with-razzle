import { IStoreCrud } from '@/shared/redux/redux-types'
import { RecursivePartial } from '_/apps/@main/types'
export const crudIsLoaded = ({ crud: { loaded } = {} }: RecursivePartial<IStoreCrud>): boolean => Boolean(loaded)
export const crudGetRows = ({ crud: { rows = [] } = {} }: RecursivePartial<IStoreCrud>): any[] => rows
export const crudGetFilteredRows = (entity: IStoreCrud, filter): any[] => crudGetRows(entity).filter(filter)
export const crudGetRowById = (entity: IStoreCrud, id) => crudGetFilteredRows(entity, ({ pId }) => id === pId)[0]
