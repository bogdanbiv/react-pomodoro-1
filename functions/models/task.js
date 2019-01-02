const uuid = require('uuid')

const createTask = (task, userId) => ({
  owner_id: userId,
  id: uuid.v4(),
  created_at: Date.now(),
  title: task.title,
  estimate: task.estimate,
  status: 'open',
  spent: {
    total: 0,
    daily: {}
  }
})

module.exports = createTask
