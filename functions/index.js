/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict'

const functions = require('firebase-functions')
const admin = require('firebase-admin')
const firebaseHelper = require('firebase-functions-helper')
admin.initializeApp()
const express = require('express')
const cookieParser = require('cookie-parser')()
const bodyParser = require('body-parser')
const cors = require('cors')({ origin: true })
const db = admin.firestore()
const app = express()
db.settings({ timestampsInSnapshots: true })

const { tasks: tasksCollection } = require('./collections')
const validateFirebaseIdToken = require('./auth')
const { error, success, unauthorized, forbidden } = require('./status')
const createTask = require('./models/task')

app.use(cors)
app.use(cookieParser)
app.use(validateFirebaseIdToken)

// Create new Task
app.post('/tasks', (req, res) => {
  const task = createTask(req.body, req.user.user_id)

  db
    .collection(tasksCollection)
    .doc(task.id)
    .set(task)

  res.status(200).json(task)
})

// Update Task
app.put('/tasks/:id', async (req, res) => {
  try {
    const taskRef = db.collection(tasksCollection).doc(req.params.id)
    const task = await taskRef.get()

    if (task.data().owner_id !== req.user.user_id) {
      throw forbidden
    }

    taskRef.set(req.body, { merge: true })

    res.status(success.status).json(success)
  } catch (err) {
    console.log(err)
    res.status(err.status).json(err)
  }
})

// Get a single Task
app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await db
      .collection(tasksCollection)
      .doc(req.params.id)
      .get()

    res.status(200).json(task.data())
  } catch (err) {
    console.log(err)
    res.status(error.status).json(error)
  }
})

// View all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = []
    const snapshot = await db
      .collection(tasksCollection)
      .where('owner_id', '==', req.user.user_id)
      .get()

    await snapshot.forEach(doc => tasks.push(doc.data()))
    const sortedTasks = await tasks.sort((a, b) => b - a)

    res.status(200).json(sortedTasks)
  } catch (err) {
    res.status(error.status).json(error)
  }
})

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const taskRef = db.collection(tasksCollection).doc(req.params.id)
    const task = await taskRef.get()

    if (task.data().owner_id !== req.user.user_id) {
      throw forbidden
    }

    taskRef.delete()

    res.status(success.status).json(success)
  } catch (err) {
    console.log(err)
    res.status(err.status).json(err)
  }
})

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app)
