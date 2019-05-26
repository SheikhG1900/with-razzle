export interface IDictionary<T> {
    [key: string]: T
}

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
}

export interface IAppContext {
    redux: {
        reducers: any,
        sagaMatchers: IDictionary<(actoin: any) => any>,
        initialState: object,
    },
    app: {
        browserHistory: any
    }
}
