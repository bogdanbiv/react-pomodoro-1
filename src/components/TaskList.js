import React, { Component } from 'react'
import styled from 'styled-components'
import parseMs from 'parse-ms'

const timeFormatter = milli => {
  const { days, hours, minutes } = parseMs(parseInt(milli))
  let timeString = ''

  if (days) {
    timeString += `${days}d `
  }
  if (hours) {
    timeString += `${hours}h `
  }
  if (minutes) {
    timeString += `${minutes}m `
  }

  return timeString
}

class TaskList extends Component {
  render = () => {
    const { data, active, current, title } = this.props

    if (!data || !data.length) {
      return null
    }

    return (
      <div>
        <SectionTitle>{title}</SectionTitle>
        <List active={active}>
          {data.map(item => (
            <ListItem key={item.id}>
              <Title>{item.title}</Title>
              <Misc>
                {item.estimate && (
                  <MiscEntry>
                    <strong>Time planned: </strong>
                    {timeFormatter(item.estimate)}
                  </MiscEntry>
                )}
                <MiscEntry>
                  <strong>Time spent: </strong>
                  {timeFormatter(item.spent) || '0m'}
                </MiscEntry>
                {item.id === current && <Running />}
              </Misc>
            </ListItem>
          ))}
        </List>
      </div>
    )
  }
}

const SectionTitle = styled.h3`
  margin-bottom: 5px;
  color: #777b92;
`

const List = styled.ul`
  margin-bottom: 40px;

  ${props => !props.active && 'opacity: .5;'};
`

const ListItem = styled.li`
  width: 100%;
  background-color: #f7f7f7;
  padding: 20px 94px 20px 20px;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0px 3px 29px -9px rgba(0, 0, 0, 0.13);
  margin: 1px 0px 0px 0px;

  color: #74768a;
`

const Title = styled.h3`
  font-size: 16px;
  margin: 0;
  width: 100%;
  font-weight: 300;
`

const Misc = styled.div`
  width: 100%;
  margin-top: 11px;
`

const MiscEntry = styled.div`
  font-weight: 300;
  font-size: 12px;
  color: #a2a4b1;
  display: inline-block;
  margin-right: 20px;
`

const Running = styled(MiscEntry)`
  color: rgb(234, 83, 96);
  font-weight: bold;

  &::before {
    content: 'RUNNING';
  }
`

export default TaskList
