import React from 'react'
import styled from 'styled-components'

import Timer from 'components/Timer'
import TaskList from 'components/TaskList'

const App = () => (
  <Main className="App">
    <TimerContainer>
      <Timer />
    </TimerContainer>
    <ListContainer>
      <TaskList />
    </ListContainer>
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

const ListContainer = styled.section`
  width: 65%;
  height: 100vh;
  float: left;
  overflow-y: auto;
`

export default App
