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
      return <Link onClick={this.auth}>Login with Google</Link>
    }

    return <div>Hello, {user.name}</div>
  }
}

const Link = styled.span`
  background-color: green;
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
