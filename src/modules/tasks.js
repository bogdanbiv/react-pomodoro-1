import Immutable, { merge } from 'seamless-immutable'
import { get, create, remove, update } from 'api'

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
          closed: action.tasks
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

export const fetchTasks = () => async (dispatch, getState) => {
  try {
    const open = []
    const closed = []
    const result = await get()

    await result.forEach(
      task => (task.status === 'open' ? open.push(task) : closed.push(task))
    )

    dispatch({
      type: UPDATE_OPEN_TASKS,
      tasks: open
    })
    dispatch({
      type: UPDATE_CLOSED_TASKS,
      tasks: closed
    })
  } catch (err) {}
}

export const createTask = task => async (dispatch, getState) => {
  try {
    const { open } = getState().tasks
    const formattedTask = {
      title: task.title,
      estimate: task.estimate
    }
    const newTask = await create(formattedTask)

    dispatch({
      type: UPDATE_OPEN_TASKS,
      tasks: open.concat(newTask)
    })
  } catch (err) {}
}

export const removeTask = id => async (dispatch, getState) => {
  try {
    await remove(id)
    const { open, closed } = getState().tasks
    const openTasks = open.filter(task => task.id !== id)
    const closedTasks = closed.filter(task => task.id !== id)

    dispatch({
      type: UPDATE_OPEN_TASKS,
      tasks: openTasks
    })
    dispatch({
      type: UPDATE_CLOSED_TASKS,
      tasks: closedTasks
    })
  } catch (err) {}
}

export const closeTask = id => async (dispatch, getState) => {
  try {
    const data = { status: 'closed' }
    await update(id, data)

    const { open, closed } = getState().tasks
    const task = {
      ...open.find(task => task.id === id),
      ...data
    }
    const openTasks = open.filter(task => task.id !== id)
    const closedTasks = closed.concat(task)

    dispatch({
      type: UPDATE_OPEN_TASKS,
      tasks: openTasks
    })
    dispatch({
      type: UPDATE_CLOSED_TASKS,
      tasks: closedTasks
    })
  } catch (err) {}
}

export const reopenTask = id => async (dispatch, getState) => {
  try {
    const data = { status: 'open' }
    await update(id, data)

    const { open, closed } = getState().tasks
    const task = {
      ...closed.find(task => task.id === id),
      ...data
    }
    const openTasks = open.concat(task)
    const closedTasks = closed.filter(task => task.id !== id)

    dispatch({
      type: UPDATE_OPEN_TASKS,
      tasks: openTasks
    })
    dispatch({
      type: UPDATE_CLOSED_TASKS,
      tasks: closedTasks
    })
  } catch (err) {}
}

export const updateCurrent = id => dispatch => {
  dispatch({
    type: UPDATE_CURRENT,
    current: id
  })
}

export const incrementTaskTime = task => (dispatch, getState) => {
  const { open, current } = getState().tasks
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  const today = date.getTime()

  const tasks = open.map(task => {
    let increment = {}

    if (task.id === current) {
      increment.spent = {}
      increment.spent.daily = {}
      let totalSpent =
        typeof task.spent === 'number' ? task.spent : task.spent.total
      let totalSpentDaily =
        task.spent.daily && task.spent.daily[today]
          ? task.spent.daily[today]
          : 0

      increment.spent.total = totalSpent + 1000
      increment.spent.daily = {
        ...task.spent.daily,
        ...{ [today]: totalSpentDaily + 1000 }
      }
    }

    return { ...task, ...increment }
  })

  dispatch({
    type: UPDATE_OPEN_TASKS,
    tasks
  })
}
