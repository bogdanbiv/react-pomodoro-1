import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import enhanceWithClickOutside from 'react-click-outside'
import { connect } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import styled from 'styled-components'

import Spinner from 'components/Spinner'

import { resetTasks } from 'modules/tasks'
import { setUser } from 'modules/user'
import { setExpand } from 'modules/app'

class Login extends PureComponent {
  state = {
    userMenu: false
  }

  provider = new firebase.auth.GoogleAuthProvider()

  auth = () => firebase.auth().signInWithRedirect(this.provider)

  logout = () => {
    const { timerActions, setUser, resetTasks, setExpand } = this.props

    timerActions.stop()
    firebase
      .auth()
      .signOut()
      .then(() => {
        setExpand('timer')

        setTimeout(() => {
          // Delay for a better visual experience
          setUser(null)
          resetTasks()
        }, 300)
      })
      .catch(error => alert('Logout failed.\nPlease try again.'))
  }

  handleClickOutside() {
    this.setState({ userMenu: false })
  }

  render() {
    const { user, loading } = this.props
    const { userMenu } = this.state

    return (
      <Header>
        <Logo>
          React<br />
          <strong>Pomodoro</strong>
        </Logo>

        <div>
          {user ? (
            <Greetings onClick={() => this.setState({ userMenu: !userMenu })}>
              Hello, {user.name}
              {userMenu && (
                <Menu>
                  <MenuItem onClick={this.logout}>Logout</MenuItem>
                </Menu>
              )}
            </Greetings>
          ) : (
            <Link onClick={this.auth}>
              {loading ? <SmallSpinner /> : 'Login with Google'}
            </Link>
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

const Greetings = styled.span`
  position: relative;
  cursor: pointer;

  &::after {
    content: '';
    border-color: #f3eeee transparent;
    border-style: solid;
    border-width: 5px 4px 0 4px;
    width: 0;
    height: 0;
    margin-left: 6px;
    top: -2px;
    line-height: 6px;
    display: inline-block;
    position: relative;
  }
`

const Menu = styled.ul`
  position: absolute;
  box-shadow: 0 0.1em 0.25em rgba(0, 0, 0, 0.15),
    0 0.1em 0.2em rgba(0, 0, 0, 0.2);
  right: 0px;
  top: 100%;
  background-color: #fff;
  border-radius: 2px;
  overflow: hidden;
`

const MenuItem = styled.li`
  width: 100%;
  cursor: pointer;
  min-width: 90px;
  padding: 0px 10px;
  box-sizing: border-box;
  color: #676464;

  &:hover {
    background-color: #f7f7f7;
  }
`

const Link = styled.span`
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.1s linear;
  color: #f3eeee;

  background-color: #d76b6b;
  height: 30px;
  padding: 10px 15px 0px;
  border-radius: 3px;
  line-height: 1em;
  display: block;
  text-decoration: none;
  margin-top: 3px;

  &:hover {
    color: #fff;
  }
`

const SmallSpinner = styled(Spinner)`
  width: 24px;
  height: 39px;
  margin-top: -10px;
  margin-left: 0px;
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
  user: state.user.data,
  loading: state.user.loading
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      resetTasks,
      setExpand,
      setUser
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(
  enhanceWithClickOutside(Login)
)
