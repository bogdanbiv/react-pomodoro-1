import Immutable, { merge } from 'seamless-immutable'

export const UPDATE_COUNTER = 'search/UPDATE_COUNTER'
export const UPDATE_MODE = 'search/UPDATE_MODE'
export const UPDATE_CONFIG = 'search/UPDATE_CONFIG'

// Only milliseconds here

const initialState = Immutable({
  counter: 0,
  mode: 'pomodoro',
  config: {
    pomodoro: 2700000,
    short: 300000,
    long: 900000
  }
})

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COUNTER:
      return merge(state, {
        counter: action.counter
      })

    case UPDATE_MODE:
      return merge(state, {
        mode: action.mode
      })

    case UPDATE_CONFIG:
      return merge(state, {
        config: action.config
      })

    default:
      return state
  }
}

export const decrement = () => (dispatch, getState) => {
  const { counter } = getState().timer

  dispatch({
    type: UPDATE_COUNTER,
    counter: counter - 1000
  })
}

export const setMode = mode => (dispatch, getState) => {
  const { config } = getState().timer
  const clock = config[mode]

  dispatch({
    type: UPDATE_MODE,
    mode
  })
  dispatch({
    type: UPDATE_COUNTER,
    counter: clock
  })
}
