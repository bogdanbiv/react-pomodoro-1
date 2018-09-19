import Immutable, { merge } from 'seamless-immutable'

export const UPDATE_USER = 'user/UPDATE_USER'

// Only milliseconds here

const initialState = Immutable({
  data: null
})

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return merge(state, {
        data: action.data
      })

    default:
      return state
  }
}

export const setUser = data => dispatch => {
  dispatch({
    type: UPDATE_USER,
    data
  })
}
