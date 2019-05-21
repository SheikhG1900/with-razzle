export interface IAction {
    type: string,
    data?: any,
    mode: string,
    command: string,
    done: Promise<any>,
    callback: {
        resolve?(result?: any): void,
        reject?(error: any, result?: any): void
    },
    onMount: boolean
    meta: {
        module: string,
        entity: string
    },
    request?: IAction
}

export interface IActionError extends IAction {
    error: any
}
export interface IStoreCrud {
    crud: {
        loaded?: boolean,
        rows: any[]
    }
}

export interface IStoreActionsSummary {
    total: number,
    pending: number,
    done: number,
    success: number,
    ignored: number,
    error: number,
    pendings: IAction[],
    errors: IAction[],
}
export interface IStore {
    routing: any,
    actionsSummary: IStoreActionsSummary
}
