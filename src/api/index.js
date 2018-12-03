import axios from 'axios'
import { store } from '../store'

const api = {
  dev: 'http://localhost:5000/react-pomodoro-2018/us-central1/app',
  prod: 'http://localhost:5000/react-pomodoro-2018/us-central1/app'
}
const getConfig = () => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: store.getState().user.data.token
  }
})

export const getTasks = () => {
  return axios
    .get(`${api.dev}/hello`, getConfig())
    .then(response => response.data)
}
