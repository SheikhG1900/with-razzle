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

export interface IPartial {
    crud: {
        loaded: boolean,
        rows: any[]
    }
}
export interface IStoreCrud {
    crud: {
        loaded: boolean,
        rows: any[]
    }
}

export interface IStore<T> {
    [key: string]: T
}
