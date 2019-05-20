import { actionCommands, actionModes } from '@/shared/redux/redux-const'
import { IAction } from '@/shared/redux/redux-types'

const makeActionType = (module: string, command: string, entity: string, mode: string) =>
    `${module.toUpperCase()}_${entity.toUpperCase()}_${command}_${mode}`

export const makeActionTypeByAction = ({ command, meta: { module, entity } }: IAction, mode: string) =>
    makeActionType(module, command, entity, mode)

export default ((module: string, entity: string) => {
    const makeActionTypeByCommand = (command: string, mode: string) => makeActionType(module, command, entity, mode)
    const makeActionCreator = (command: string, mode: string) => (data: any, onMount: boolean): IAction => {
        // --- onMount ---
        // it is used to avoid extra data fetching.
        // if request comes with onMount flag true, it means fetching data for first time rendering
        // if it is already server rendered then we dont need to render it again.
        // actionModes.IGNORED mode is introduced for this purpose.

        // --- Defining Promise ---
        // To define Promise for request actions is helpful to handle Component's async logics.
        // callback is being triggered from reducer. see commonReducerCreator for more details.

        // eslint-disable-next-line
        let done = Promise.resolve()

        const callback: IAction['callback'] = {}
        if (mode && mode === actionModes.REQUEST) {
            // eslint-disable-next-line
            done = new Promise((resolve, reject) => {
                callback.resolve = resolve
                callback.reject = reject
            })
        }

        return {
            callback,
            command,
            data,
            done,
            meta: { module, entity },
            mode,
            onMount,
            type: makeActionTypeByCommand(command, mode),
        }
    }

    return {
        makeActionCreator,
        makeActionTypeByCommand
    }
})
