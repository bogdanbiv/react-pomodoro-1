import Immutable, { merge } from 'seamless-immutable'

export const UPDATE_USER = 'user/UPDATE_USER'
export const SET_LOADER = 'user/SET_LOADER'

// Only milliseconds here

const initialState = Immutable({
  data: null,
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return merge(state, {
        data: action.data
      })
    case SET_LOADER:
      return merge(state, {
        loading: action.loading
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

export const setLoading = loading => dispatch => {
  dispatch({
    type: UPDATE_USER,
    loading
  })
}
