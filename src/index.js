import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { persistor, store } from './store'

import App from './containers'
import { fetchTasks } from 'modules/tasks'
import { setUser, setLoading } from 'modules/user'
import { setExpand } from 'modules/app'

import './firebase'
import './index.css'

const target = document.querySelector('#root')
const { dispatch } = store

firebase
  .auth()
  .getRedirectResult()
  .then(auth => {
    setLoading(false)(dispatch)

    if (auth.user) {
      fetchTasks()(dispatch)
      setExpand()(dispatch)
      setUser({
        name: auth.user.displayName,
        id: auth.user.uid,
        photo: auth.user.photoURL,
        email: auth.user.email
      })(dispatch)
    }
  })
  .catch(error => console.log(error))

render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <div>
        <App />
      </div>
    </PersistGate>
  </Provider>,
  target
)
