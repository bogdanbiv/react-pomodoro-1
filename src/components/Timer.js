import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import CircularProgressbar from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import { decrement, setMode } from 'modules/timer'
import { store } from 'store'
import parseMs from 'parse-ms'

const ring = require('assets/ring.mp3')

class Timer extends Component {
  constructor() {
    super()

    this.audio = new Audio()
    this.audio.src = ring
  }

  state = {
    finished: false,
    playing: false,
    options: true,
    streak: [],

    possibleActions: ['stop', 'play', 'check'],
    currentAction: 'play'
  }

  interval = null

  play = () => {
    const { decrement, mode } = this.props

    this.setState({
      currentAction: 'stop',
      playing: true,
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

      decrement()
    }, 1000)
  }

  finishCounter = () => {
    clearInterval(this.interval)

    this.setState({
      currentAction: 'check',
      playing: false,
      options: false,
      finished: true
    })
  }

  stop = () => {
    const { setMode, mode } = this.props

    this.setState({
      currentAction: 'play',
      playing: false,
      options: true
    })

    clearInterval(this.interval)
    setMode(mode)
  }

  check = () => {
    const { setMode } = this.props

    this.setState({
      currentAction: 'play',
      playing: false,
      options: true,
      finished: false
    })

    setMode(this.getNextMode())
  }

  action = () => {
    const { currentAction } = this.state
    const actions = {
      play: this.play,
      stop: this.stop,
      check: this.check
    }

    actions[currentAction]()
  }

  getNextMode = () => {
    const { mode } = this.props

    if (mode === 'pomodoro') {
      return 'short'
    } else {
      return 'pomodoro'
    }
  }

  getPercentage = () => {
    const { counter, mode, config } = this.props

    return 100 - counter / config[mode].duration * 100
  }

  getTimer = () => {
    const { counter } = this.props
    const zeroPad = value => `0${value}`.slice(-2)
    const minutes = zeroPad(parseMs(counter).minutes)
    const seconds = zeroPad(parseMs(counter).seconds)

    return `${minutes} : ${seconds}`
  }

  getGreeting = (mode, finished, config) => {
    if (!finished) {
      return (
        <div>
          <strong>Timer mode: </strong> {config[mode].label}
        </div>
      )
    } else {
      return {
        pomodoro: (
          <div>
            <strong>Congratulations!</strong> You worked a lot, get some rest!
          </div>
        ),
        short: (
          <div>
            <strong>Well done!</strong> You got some rest, now let's get back to
            work.
          </div>
        ),
        long: (
          <div>
            <strong>Well done!</strong> Are you ready for the hard work?
          </div>
        )
      }[mode]
    }
  }

  render = () => {
    const { finished, currentAction, options } = this.state
    const { config, setMode, mode: activeMode } = this.props
    const modes = Object.keys(config)

    return (
      <TimerBox optionsVisible={options}>
        <Label className="fixed-height" active>
          {this.getGreeting(activeMode, finished, config)}
        </Label>
        <Monitor>
          {finished && (
            <Sonar>
              <Pulse />
              <Shield />
            </Sonar>
          )}
          <CircularProgressbar
            percentage={this.getPercentage()}
            styles={{
              path: {
                stroke: finished ? 'rgb(96, 194, 141)' : 'rgb(234, 83, 96)',
                strokeWidth: 3
              },
              trail: {
                stroke: 'rgb(213, 215, 217)',
                strokeWidth: 1.5
              }
            }}
          />
          <Clock>{this.getTimer()}</Clock>
        </Monitor>

        {true && (
          <Label className="margin-below" active={activeMode === 'pomodoro'}>
            <strong>Your taks is </strong> Mediação para solicitação de vínculo
            e outras regras
          </Label>
        )}

        <Options visible={options}>
          {modes.map(mode => (
            <Option active={activeMode === mode} onClick={() => setMode(mode)}>
              {config[mode].label}
            </Option>
          ))}
        </Options>

        <Toggle onClick={this.action} finished={finished}>
          <i className={`fa fa-${currentAction}`} />
        </Toggle>
      </TimerBox>
    )
  }
}

const TimerBox = styled.section`
  width: 310px;
  border-radius: 8px;
  position: relative;
  display: inline-block;

  text-align: center;
  color: #353849;

  background-color: #f2f3f6;
  box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.13), 8px 8px 40px rgba(0, 0, 0, 0.12);
  transition: all 0.32s cubic-bezier(0.42, 0, 0.36, 0.99);

  padding-top: 20px;
  padding-bottom: ${props => (props.optionsVisible ? '45px' : '10px')};
`

const Monitor = styled.header`
  margin-top: 0px;
  margin-bottom: 15px;
  display: inline-block;
  width: 250px;
  position: relative;
  box-sizing: border-box;
  padding: 5px 5px;

  svg {
    position: relative;
  }
`

const Sonar = styled.div`
  position: absolute;
  width: calc(100% - 38px);
  height: calc(100% - 41px);
  left: 50%;
  top: 50%;
  margin-top: -3px;
  transform: translate(-50%, -50%);
`

const Pulse = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  border-radius: 100%;
  animation: pulse 2s ease infinite;
  background: rgb(96, 194, 141);

  @keyframes pulse {
    0% {
      transform: scale(1, 1);
    }
    50% {
      opacity: 0.3;
    }
    95% {
      opacity: 0;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`

const Shield = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background: #f2f3f6;
`

const Clock = styled.div`
  font-size: 35px;
  font-weight: 700;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Label = styled.div`
  text-align: center;
  box-sizing: border-box;
  padding: 5px 10px;
  margin: 0 30px;
  font-size: 14px;
  color: #8e90a2;
  font-weight: 100;
  margin-bottom: 9px;
  transition: all 0.2s linear;
  opacity: 1;
  border-radius: 3px;

  opacity: ${({ active }) => (active ? 1 : 0.3)};

  &.margin-below {
    margin-bottom: 20px;
  }
  &.fixed-height {
    height: 38px;
  }
`

const Options = styled.ul`
  height: 26px;
  padding: 0px 0px 0px;
  margin: 0px 30px 10px;
  display: flex;
  justify-content: space-between;
  transition: all 0.2s linear;
  position: relative;

  opacity: ${({ visible }) => (visible ? '1' : '0')};

  ${props =>
    !props.visible &&
    `
    &::after {
      content: "";
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 0px;
    }
  `};
`

const Option = styled.li`
  display: inline-block;
  padding: 5px 0px;
  width: 31%;
  text-align: center;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 300;
  margin: 0px 0px;
  cursor: pointer;
  transition: all 0.14s linear;

  background-color: ${props => (props.active ? '#e85e6a' : 'transparent')};
  color: ${props => (props.active ? '#ffffff' : '#8a8c94')};
  box-shadow: ${props =>
    !props.active && 'inset 0px 0px 0px 1px rgba(0,0,0,0.13)'};
`

const Toggle = styled.button`
  outline: none;
  border: none;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%, 50%);
  overflow: hidden;
  cursor: pointer;

  ${({ finished }) =>
    finished
      ? `
        background: linear-gradient(to bottom, #83e2b7, #55ab6d);
        box-shadow: 0px 19px 20px -10px rgba(85, 171, 79, 0.38);
      `
      : `
        background: linear-gradient(to bottom, #ea8379, #cf3845);
        box-shadow: 0px 19px 20px -10px rgba(207, 56, 69, 0.38);
      `} font-size: 20px;
  color: white;

  .fa {
    position: relative;
    z-index: 1;
  }

  .fa-play {
    left: 3px;
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;

    top: 13%;
    left: 0px;
    z-index: 0;

    ${({ finished }) =>
      finished
        ? `background: linear-gradient(to bottom, #65cd9e, #55ab6d);`
        : `background: linear-gradient(to bottom, #eb6267, #cf3845);`};
  }
`

const mapStateToProps = state => ({
  counter: state.timer.counter,
  mode: state.timer.mode,
  config: state.timer.config
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      decrement,
      setMode
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Timer)
