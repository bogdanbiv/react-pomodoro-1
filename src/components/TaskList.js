import React from 'react'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { decrement, setMode } from 'modules/timer'

const Search = props => <div />

const Results = styled.ul`
  position: absolute;
  left: -15px;
  top: 100%;
  width: 100%;
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

export default connect(mapStateToProps, mapDispatchToProps)(Search)
