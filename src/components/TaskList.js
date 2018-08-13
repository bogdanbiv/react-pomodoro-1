import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { createTask } from 'modules/tasks'
import NewTask from 'components/NewTask'

class TaskList extends Component {
  render = () => {
    console.log(this.props.data)
    return <div>Ei</div>
  }
}

const TaskBox = styled.section`
  width: 85%;
  margin-right: 5%;
  margin: 0 auto;
  padding: 20px 0px;
  color: #353849;
`

const SectionTitle = styled.h3`
  margin-bottom: 5px;
`

const mapStateToProps = state => ({
  openTasks: state.tasks.open,
  closedTasks: state.tasks.closed
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createTask
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
