import React from 'react'
import styled from 'styled-components'

import Timer from './Timer'
import Tasks from './Tasks'

const App = () => (
  <Main className="App">
    <TimerContainer>
      <Timer />
    </TimerContainer>
    <TasksContainer>
      <Tasks />
    </TasksContainer>
  </Main>
)

const Main = styled.main`
  height: 100vh;
  width: 100vw;
`

const TimerContainer = styled.section`
  width: 35%;
  height: 100vh;
  float: left;

  display: flex;
  align-items: center;
  justify-content: center;
`

const TasksContainer = styled.section`
  width: 65%;
  height: 100vh;
  float: left;
  overflow-y: auto;
`

export default App
