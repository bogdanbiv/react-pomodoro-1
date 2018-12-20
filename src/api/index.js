import axios from 'axios'
import firebase from 'firebase'

const getToken = () =>
  new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        user
          .getIdToken(true)
          .then(data => resolve(data))
          .catch(err => reject(err))
      } else {
        reject(403)
      }
    })
  })
const api = {
  dev: 'http://localhost:5000/react-pomodoro-2018/us-central1/app',
  prod: 'http://localhost:5000/react-pomodoro-2018/us-central1/app'
}
const getConfig = token => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
})

export const create = async task => {
  const token = await getToken()

  return axios
    .post(`${api.dev}/tasks`, task, getConfig(token))
    .then(response => response.data)
}

export const get = async () => {
  const token = await getToken()

  return axios
    .get(`${api.dev}/tasks`, getConfig(token))
    .then(response => response.data)
}

export const update = async (id, task) => {
  const token = await getToken()

  return axios
    .put(`${api.dev}/tasks/${id}`, task, getConfig(token))
    .then(response => response.data)
}

export const remove = async id => {
  const token = await getToken()

  return axios
    .delete(`${api.dev}/tasks/${id}`, getConfig(token))
    .then(response => response.data)
}
