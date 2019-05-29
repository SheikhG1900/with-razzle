import { IAction, IState } from './shared/redux/redux-types'

export interface IDictionary<T> {
    [key: string]: T
}

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
}

export interface IAppContext {
    redux: {
        reducers: IDictionary<(state: IDictionary<any>, action: IAction, root: Partial<IState>) => any>,
        sagaMatchers: IDictionary<(actoin: any) => any>,
        initialState: object,
    },
    app: {
        routerContext: object
    }
}
