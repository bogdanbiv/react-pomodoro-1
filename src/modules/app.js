import Immutable, { merge } from 'seamless-immutable'

export const SET_EXPAND = 'app/SET_EXPAND'

// Only milliseconds here

const initialState = Immutable({
  expand: null
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_EXPAND:
      return merge(state, {
        expand: action.expand
      })

    default:
      return state
  }
}

export const setExpand = mode => (dispatch, getState) => {
  dispatch({
    type: SET_EXPAND,
    expand: mode
  })
}
