import React, { Component } from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { setExpand } from 'modules/app'
import { decrement, setMode } from 'modules/timer'
import { incrementTaskTime, saveTaskTimer } from 'modules/tasks'
import { store } from 'store'

import Timer from './Timer'
import Tasks from './Tasks'
import Login from '../components/Login'

import { getTimer } from 'utils'

const ring = require('assets/ring.mp3')

class App extends Component {
  constructor() {
    super()

    this.audio = new Audio()
    this.audio.src = ring
  }

  state = {
    finished: false,
    running: false,
    options: true,
    streak: [],
    title: 'React Pomodoro',

    possibleActions: ['stop', 'play', 'check'],
    currentAction: 'play'
  }

  interval = null

  play = () => {
    const { decrement, mode, incrementTaskTime } = this.props

    this.setState({
      currentAction: 'stop',
      running: true,
      options: false,
      streak: this.state.streak.concat(mode)
    })

    this.interval = setInterval(() => {
      const { counter } = store.getState().timer

      if (counter <= 0) {
        this.finishCounter()
        this.audio.play()

        return false
      }

      document.title = `${getTimer(counter)} | ${this.state.title}`
      incrementTaskTime()
      decrement()
    }, 1000)
  }

  finishCounter = () => {
    document.title = this.state.title
    clearInterval(this.interval)

    this.setState({
      currentAction: 'check',
      running: false,
      options: false,
      finished: true
    })
  }

  stop = () => {
    const { setMode, mode, saveTaskTimer, current } = this.props

    this.setState({
      currentAction: 'play',
      running: false,
      options: true
    })

    saveTaskTimer(current)

    document.title = this.state.title
    clearInterval(this.interval)
    setMode(mode)
  }

  check = () => {
    const { setMode, saveTaskTimer, current } = this.props

    saveTaskTimer(current)

    this.setState({
      currentAction: 'play',
      running: false,
      options: true,
      finished: false
    })

    setMode(this.getNextMode())
  }

  getNextMode = () => {
    const { mode } = this.props

    if (mode === 'pomodoro') {
      return 'short'
    } else {
      return 'pomodoro'
    }
  }

  componentDidMount() {
    const { user, setExpand } = this.props

    setExpand(user ? null : 'timer')
  }

  render = () => {
    const timerState = this.state
    const { expand, user } = this.props

    console.log(expand)
    console.log(user)

    const timerActions = {
      play: this.play,
      stop: this.stop,
      check: this.check
    }
    return (
      <Main className="App">
        <TimerContainer expand={expand}>
          <Login timerActions={timerActions} />
          <Timer timerActions={timerActions} timerState={timerState} />
        </TimerContainer>
        <TasksContainer expand={expand}>
          <Tasks timerActions={timerActions} timerState={timerState} />
        </TasksContainer>
      </Main>
    )
  }
}

const Main = styled.main`
  height: 100vh;
  width: 100vw;
`

const TimerContainer = styled.section`
  width: 35%;
  height: 100vh;
  float: left;
  background: linear-gradient(to bottom right, #c9d4e8, #e6bab8);

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  transition: 0.85s all ease-in-out;
  position: absolute;
  z-index: 2;
  left: 0px;
  top: 0px;

  ${props => props.expand === 'timer' && 'width: 100%'};
`

const TasksContainer = styled.section`
  width: 65%;
  height: 100vh;
  float: left;
  overflow-y: auto;
  opacity: 1;
  overflow-y: scroll;

  transition: 0.5s all ease-in-out;
  position: absolute;
  z-index: 1;
  right: 0px;
  top: 0px;

  ${props => props.expand === 'timer' && 'opacity: 0;'};
`

const mapStateToProps = state => ({
  counter: state.timer.counter,
  current: state.tasks.current,
  expand: state.app.expand,
  mode: state.timer.mode,
  user: state.user.data
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      incrementTaskTime,
      saveTaskTimer,
      setExpand,
      decrement,
      setMode
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(App)
