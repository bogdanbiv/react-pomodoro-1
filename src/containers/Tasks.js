import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import {
  updateCurrent,
  removeTask,
  closeTask,
  reopenTask,
  fetchTasks
} from 'modules/tasks'
import { setMode } from 'modules/timer'
import { saveTaskTimer } from 'modules/tasks'

import NewTask from 'components/NewTask'
import TaskList from 'components/TaskList'

class Tasks extends Component {
  componentDidMount() {
    this.props.fetchTasks()
  }

  onDelete = id => {
    const { removeTask } = this.props
    const confirmationMessage =
      "Are you sure you want to delete this task? This action can't be undone."
    const r = window.confirm(confirmationMessage)

    if (r === true) {
      removeTask(id)
    }
  }

  onClose = id => {
    const { closeTask } = this.props
    const confirmationMessage =
      'Is this task done? \nCongratulations! What a productive day 🎉'
    const r = window.confirm(confirmationMessage)

    if (r === true) {
      closeTask(id)
    }
  }

  onReopen = id => {
    const { reopenTask } = this.props
    const confirmationMessage = 'Do you really want to reopen this task?'
    const r = window.confirm(confirmationMessage)

    if (r === true) {
      reopenTask(id)
    }
  }

  onPlay = id => {
    const {
      timerActions,
      timerState,
      updateCurrent,
      saveTaskTimer,
      current
    } = this.props

    saveTaskTimer(current)
    updateCurrent(id)

    if (!timerState.running) {
      timerActions.play()
    }
  }

  onStop = () => {
    const { timerActions } = this.props

    timerActions.stop()
  }

  isRunning = id => {
    const { timerState, current } = this.props

    return timerState.running && current === id
  }

  render = () => {
    const { closedTasks, timerState, openTasks, current } = this.props

    return (
      <TaskBox>
        <section>
          <SectionTitle>New Task</SectionTitle>
          <NewTask />
        </section>
        <section>
          <TaskList
            active
            title="To do"
            data={openTasks}
            current={current}
            isRunning={timerState.running}
            actions={[
              {
                icon: 'check',
                onClick: this.onClose
              },
              {
                icon: 'times',
                onClick: this.onDelete
              },
              {
                icon: 'play',
                isActive: id => !this.isRunning(id),
                onClick: this.onPlay
              },
              {
                icon: 'stop',
                isActive: id => this.isRunning(id),
                onClick: this.onStop
              }
            ]}
          />
        </section>
        <section>
          <TaskList
            title="Done"
            data={closedTasks}
            actions={[
              {
                icon: 'history',
                onClick: id => this.onReopen(id)
              },
              {
                icon: 'times',
                onClick: id => this.onDelete(id)
              }
            ]}
          />
        </section>
      </TaskBox>
    )
  }
}

const SectionTitle = styled.h3`
  margin-bottom: 5px;
  color: #777b92;
`

const TaskBox = styled.section`
  width: 85%;
  margin-right: 5%;
  margin: 0 auto;
  padding: 20px 0px;
  color: #353849;
`

const mapStateToProps = state => ({
  openTasks: state.tasks.open,
  closedTasks: state.tasks.closed,
  current: state.tasks.current,
  mode: state.timer.mode
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateCurrent,
      saveTaskTimer,
      removeTask,
      fetchTasks,
      reopenTask,
      closeTask,
      setMode
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Tasks)
