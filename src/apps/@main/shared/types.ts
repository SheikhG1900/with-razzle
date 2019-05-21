export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
}

export interface IAppContext {
    redux: {
        reducers: any
    }
}
