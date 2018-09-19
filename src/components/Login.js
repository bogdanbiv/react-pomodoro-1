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
  top: 20px;
  width: 100%;
  padding: 0px 30px;
  color: #f3eeee;
  font-weight: 100;
  box-sizing: border-box;
  line-height: 2.5rem;

  display: flex;
  justify-content: space-between;
`

const Link = styled.span`
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.1s linear;
  color: #f3eeee;

  &:hover {
    color: #fff;
  }
`

const Logo = styled.h2`
  color: #cdd0e1;
  font-weight: 100;
  margin: 0;
  text-transform: uppercase;
  font-size: 27px;
  text-align: center;
  background: linear-gradient(to bottom right, #8da2b9, #d2b0c4);
  height: 47px;
  padding: 0px 7px;
  border-radius: 5px;
  line-height: 2.1rem;
  opacity: 0.65;

  cursor: default;
  user-select: none;

  strong {
    color: #cccfe0;
    font-size: 12.2px;
    position: relative;
    top: -21px;
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
