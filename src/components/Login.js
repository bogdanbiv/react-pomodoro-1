import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import firebase from 'firebase'
import styled from 'styled-components'

import { setUser } from 'modules/user'

class Login extends PureComponent {
  provider = new firebase.auth.GoogleAuthProvider()

  auth = () => firebase.auth().signInWithRedirect(this.provider)

  render() {
    const { user } = this.props

    if (!user) {
      return
    }

    return (
      <Header>
        <Logo>
          React<br />
          <strong>Pomodoro</strong>
        </Logo>

        <div>
          {user ? (
            <span>Hello, {user.name}</span>
          ) : (
            <Link onClick={this.auth}>Login with Google</Link>
          )}
        </div>
      </Header>
    )
  }
}

const Header = styled.header`
  position: absolute;
  top: 25px;
  width: 100%;
  padding: 0px 30px;
  color: white;
  font-weight: 100;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;
`

const Link = styled.button`
  background-color: green;
`

const Logo = styled.h2`
  color: #80d6af;
  font-weight: 100;
  margin: 0;
  text-transform: uppercase;
  font-size: 30px;
  text-align: center;
  background: #ffffff4d;
  height: 53px;
  padding: 0px 6px;
  border-radius: 5px;

  strong {
    color: #55ab6d;
    font-size: 13.5px;
    position: relative;
    top: -29px;
  }
`

const mapStateToProps = state => ({
  user: state.user.data
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setUser
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Login)
