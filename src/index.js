import React from 'react'
import axios from 'axios'
import firebase from 'firebase'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { persistor, store } from './store'

import App from './containers'
import { setUser } from 'modules/user'

import './firebase'
import './index.css'

const target = document.querySelector('#root')
const { dispatch } = store

firebase
  .auth()
  .getRedirectResult()
  .then(auth => {
    if (auth.user) {
      setUser({
        name: auth.user.displayName,
        id: auth.user.uid
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
