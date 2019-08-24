import { Dictionary } from './types'

export const listToDict = <T>(list: T[], getKey?: (t: any) => string): Dictionary<T> =>
    list.reduce((dict, item) => {
        const key = (getKey) ? getKey(item) : (item as any)
        dict[key] = item
        return dict
    }, {})
