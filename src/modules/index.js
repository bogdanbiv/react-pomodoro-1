import { combineReducers } from 'redux'
import timer from './timer'
import tasks from './tasks'
import user from './user'

export default combineReducers({
  timer,
  tasks,
  user
})
