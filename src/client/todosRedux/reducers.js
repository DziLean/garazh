import Action, {
    ADD_TODO,
    CHANGE_TODO_TEXT, TOGGLE_STATUS, LOAD_START, LOAD_END, FILTER_UNDONE, FILTER_COMPLETED,
} from './action.js'
import { STATUSES } from './constants.js'
import { composeReducers, inverseStatus } from './utils.js'

function reducerAddTodo(prevState, action) {
    const { todos, todoText } = prevState
    const type = Action.makeAction(action).getType()

    if (ADD_TODO === type) {
        return { ...prevState, todoText: '', todos: [...todos, { text: todoText, id: Date.now(), status: STATUSES.TODO }] }
    }

    return prevState
}

function reducerChangeTodoText(prevState, plainAction) {
    const action = Action.makeAction(plainAction)

    if (CHANGE_TODO_TEXT === action.getType()) {
        return { ...prevState, todoText: action.get('todoText') }
    }

    return prevState
}

function reducerToggleStatus(prevState, plainAction) {
    const action = Action.makeAction(plainAction)

    if (TOGGLE_STATUS === action.getType()) {
        const id = action.get('id')
        const status = action.get('status')
        const { todos } = prevState
        const nextStatus = inverseStatus(status)
        const todoIndex = todos.findIndex((todo) => todo.id === id)

        const nextTodos = [...todos]
        const nextTodo = { ...nextTodos[todoIndex], status: nextStatus }

        nextTodos.splice(todoIndex, 1, nextTodo)

        return { ...prevState, todos: nextTodos }
    }

    return prevState
}

function reducerLoad(state, plainAction) {
    const action = Action.makeAction(plainAction)

    if (action.getType() === LOAD_START) {
        return { isLoading: true }
    }

    if (action.getType() === LOAD_END) {
        return { isLoading: false, loaded: action.getPayload() }
    }

    return state
}


function reducerFilter(state, plainAction) {
    const action = Action.makeAction(plainAction)

    if (FILTER_UNDONE === action.getType() || FILTER_COMPLETED === action.getType()) {
        return {
            ...state,
            filter: action.getType(),
        }
    }

    return state
}

export default function reducers(state, action) {
    return composeReducers(
        reducerChangeTodoText,
        reducerAddTodo,
        reducerToggleStatus,
        reducerLoad,
        reducerFilter,
    )(state, action)
}
