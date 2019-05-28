import { Store } from 'redux'
import { Task } from 'redux-saga'

export interface IAction {
    type: string,
    data?: any,
    mode: string,
    command: string,
    done: Promise<any>,
    callback: {
        resolve?(result: any, action: IAction): void,
        reject?(error: any, action: IAction, result?: any): void
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

export interface IStateActionsSummary {
    total: number,
    pending: number,
    done: number,
    success: number,
    ignored: number,
    error: number,
    pendings: IAction[],
    errors: IAction[],
}
export interface IState {
    actionsSummary: IStateActionsSummary
}

export interface IStore extends Store<IState, any> {
    runSaga: (saga: any) => Task,
    close: () => any,
}
