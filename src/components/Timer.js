import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import CircularProgressbar from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import { decrement, setMode } from 'modules/timer'
import parseMs from 'parse-ms'

class Timer extends Component {
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
    const { decrement, counter, mode, setMode } = this.props

    this.setState({
      currentAction: 'stop',
      playing: true,
      options: false,
      streak: this.state.streak.concat(mode)
    })

    this.interval = setInterval(() => {
      if (counter <= 0) {
        this.finishCounter()
        setMode(this.getNextMode())
        return false
      }
      decrement()
    }, 1000)
  }

  finishCounter = () => {
    const { setMode, mode } = this.props

    clearInterval(this.interval)
    setMode(mode)

    this.setState({
      currentAction: 'check',
      playing: false,
      options: false
    })
  }

  stop = () => {
    this.setState({
      currentAction: 'play',
      playing: false,
      options: true
    })

    clearInterval(this.interval)

    this.finishCounter()
  }

  check = () => {
    this.setState({
      currentAction: 'play',
      playing: true,
      options: false
    })
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

    return 100 - counter / config[mode] * 100
  }

  render = () => {
    const { finished, currentAction, options } = this.state
    const { config, mode: activeMode, counter } = this.props
    const modes = Object.keys(config)

    return (
      <TimerBox>
        <Cheers>Well done!</Cheers>
        <Monitor>
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
          <Clock>{`${parseMs(counter).minutes} : ${
            parseMs(counter).seconds
          }`}</Clock>
        </Monitor>
        <Label>
          <strong>Task:</strong> [APP/BACK] Mediação para solicitação de vínculo
          - OUTRAS REGRAS
        </Label>

        <Options visible={options}>
          {modes.map(mode => (
            <Option active={activeMode === mode}>
              {parseMs(config[mode]).minutes} min
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
  padding-bottom: 50px;
  display: inline-block;

  text-align: center;
  color: #353849;

  background-color: #f2f3f6;
  box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.13), 8px 8px 40px rgba(0, 0, 0, 0.12);
`

const Monitor = styled.header`
  margin-top: 35px;
  display: inline-block;
  width: 250px;
  position: relative;
  box-sizing: border-box;
  padding: 15px 15px;
`

const Cheers = styled.h2`
  box-sizing: border-box;
  padding: 0px 20px;
  margin-bottom: -40px;
  font-size: 33px;
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
  padding: 0px 30px;
  font-size: 14px;
  color: #74768a;
  font-weight: 100;
  margin-bottom: 9px;
`

const Options = styled.ul`
  height: 26px;
  padding: 5px 0px 0px;
  margin-bottom: -5px;
  display: inline-block;
  transition: all 0.2s linear;

  opacity: ${({ visible }) => (visible ? '1' : '0')};
`

const Option = styled.li`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 300;
  margin: 0px 2px;

  background-color: ${({ active }) => (active ? '#e85e6a' : '#dedede')};
  color: ${({ active }) => (active ? '#ffffff' : '#353849')};
`

const Toggle = styled.button`
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
