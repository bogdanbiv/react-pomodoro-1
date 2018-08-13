import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { updateCurrent } from 'modules/tasks'
import { setMode } from 'modules/timer'
import NewTask from 'components/NewTask'
import TaskList from 'components/TaskList'

class Tasks extends Component {
  render = () => {
    const {
      updateCurrent,
      timerActions,
      closedTasks,
      timerState,
      openTasks,
      current,
      setMode
    } = this.props

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
                icon: 'play',
                onClick: id => {
                  updateCurrent(id)
                  timerActions.stop()
                  setMode('pomodoro')
                  timerActions.play()
                }
              }
            ]}
          />
        </section>
        <section>
          <TaskList data={closedTasks} title="Done" />
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
  current: state.tasks.current
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateCurrent,
      setMode
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Tasks)
