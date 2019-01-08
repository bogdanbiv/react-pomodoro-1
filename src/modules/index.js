import { combineReducers } from 'redux'
import timer from './timer'
import tasks from './tasks'
import user from './user'
import app from './app'

export default combineReducers({
  timer,
  tasks,
  user,
  app
})
