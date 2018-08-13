import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { createTask } from 'modules/tasks'
import { timeParser } from 'utils'

class NewTask extends Component {
  state = {
    title: '',
    estimate: ''
  }

  hasValue = () => this.state.title.trim().length

  onSubmit = e => {
    e.preventDefault()

    if (this.hasValue()) {
      this.addTask()
    }
  }

  addTask = () => {
    const { title, estimate } = this.state
    const { createTask } = this.props

    createTask({
      title,
      estimate: timeParser(estimate)
    })

    this.setState({
      title: '',
      estimate: ''
    })
  }

  handleChange = e => {
    const { name, value } = e.target

    this.setState({
      [name]: value
    })
  }

  render = () => {
    return (
      <NewItemForm onSubmit={this.onSubmit}>
        <InputContainer width="64%" marginLeft="0">
          <InputTitle>What will you work on?</InputTitle>
          <Input
            type="text"
            name="title"
            onChange={this.handleChange}
            value={this.state.title}
            placeholder="Refactor chat messages using Redux"
          />
        </InputContainer>
        <InputContainer width="26.5%" marginLeft="1%">
          <InputTitle>What's your time estimate?</InputTitle>
          <Input
            name="estimate"
            type="text"
            onChange={this.handleChange}
            value={this.state.estimate}
            placeholder="2h 20m"
          />
        </InputContainer>
        <InputContainer width="7.5%" marginLeft="1%">
          <Submit active={this.hasValue()} type="submit" placeholder="2h 20m" />
        </InputContainer>
      </NewItemForm>
    )
  }
}

const NewItemForm = styled.form`
  width: 100%;
  display: inline-block;
  margin-bottom: 20px;
`

const InputContainer = styled.div`
  float: left;
  position: relative;

  margin-left: ${props => props.marginLeft};
  width: ${props => props.width};
`

const InputTitle = styled.h2`
  width: 100%;
  display: inline-block;
  font-weight: 400;
  font-size: 11px;
  padding: 0px;
  position: absolute;
  top: -3px;
  left: 8px;
  color: #828388;
`

const Input = styled.input`
  width: 100%;
  display: inline-block;
  background-color: transparent;
  border: none;
  border-radius: 3px;
  background: #ffffff;
  font-weight: 100;
  font-size: 17px;
  padding: 24px 8px 11px 8px;
  box-sizing: border-box;
  margin-top: 0px;
  color: #74768a;

  &::placeholder {
    color: #c8c9d0;
  }
`

const Submit = styled.input`
  background: #9ed2ad;
  background: -webkit-linear-gradient(to bottom, #bde6d3, #9ed2ad);
  background: linear-gradient(to bottom, #bde6d3, #9ed2ad);
  box-shadow: 1px 3px 35px -4px rgba(85, 171, 79, 0.26);
  display: inline-block;
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 3px;
  color: white;
  font-size: 13px;
  font-weight: 100;
  cursor: pointer;
  transition: all linear 0.2s;

  ${props =>
    !props.active &&
    `
    opacity: .4;
    cursor: default;
  `};
`

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createTask
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(NewTask)
