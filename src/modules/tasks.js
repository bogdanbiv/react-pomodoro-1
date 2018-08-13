import Immutable, { merge } from 'seamless-immutable'
import { id } from 'utils'

export const UPDATE_OPEN_TASKS = 'tasks/CREATE_CLOSED_TASK'
export const UPDATE_CLOSED_TASKS = 'tasks/UPDATE_CLOSED_TASKS'
export const UPDATE_CURRENT = 'tasks/UPDATE_CURRENT'

// Only milliseconds here

const initialState = Immutable({
  open: [],
  closed: [],
  current: null
})

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_OPEN_TASKS:
      return merge(
        state,
        {
          open: action.tasks
        },
        { deep: true }
      )

    case UPDATE_CLOSED_TASKS:
      return merge(
        state,
        {
          cloased: action.tasks
        },
        { deep: true }
      )

    case UPDATE_CURRENT:
      return merge(state, {
        current: action.current
      })

    default:
      return state
  }
}

export const createTask = task => (dispatch, getState) => {
  const { open } = getState().tasks
  const formattedTask = {
    id: id(),
    title: task.title,
    estimate: task.estimate,
    spent: 0
  }

  dispatch({
    type: UPDATE_OPEN_TASKS,
    tasks: open.concat(formattedTask)
  })
}

export const closeTask = id => (dispatch, getState) => {
  const { open, closed } = getState().tasks
  const task = open.find(task => task.id === id)
  const openTasks = open.filter(task => task.id !== id)
  const closedTasks = closed.concat(task)

  dispatch({
    type: UPDATE_OPEN_TASKS,
    openTasks
  })
  dispatch({
    type: UPDATE_CLOSED_TASKS,
    closedTasks
  })
}

export const updateCurrent = id => dispatch => {
  dispatch({
    type: UPDATE_CURRENT,
    current: id
  })
}

export const incrementTaskTime = task => (dispatch, getState) => {
  const { mode } = getState().timer
  const { open, current } = getState().tasks
  const tasks = open.map(task => {
    let increment = { spent: 0 }

    if (task.id === current && mode === 'pomodoro') {
      increment.spent = task.spent + 1000
    }

    return { ...task, ...increment }
  })

  dispatch({
    type: UPDATE_OPEN_TASKS,
    tasks
  })
}
