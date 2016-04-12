import React  from 'react'
import { connect } from 'react-redux'
import { Router, Route, Redirect } from 'react-router'

import { checkExistingLogin, userLoggedIn } from '../../manager/actions/user'
import NoAccessScreen  from '../components/NoAccessScreen'
import ActiveFeedSourceViewer  from '../../manager/containers/ActiveFeedSourceViewer'
import ActiveProjectViewer  from '../../manager/containers/ActiveProjectViewer'
import ActiveProjectsList  from '../../manager/containers/ActiveProjectsList'
import ActivePublicFeedSourceViewer  from '../../public/containers/ActivePublicFeedSourceViewer'
import ActivePublicFeedsViewer  from '../../public/containers/ActivePublicFeedsViewer'
import ActiveSignupPage  from '../../public/containers/ActiveSignupPage'
import ActiveUserAccount  from '../../public/containers/ActiveUserAccount'
import ActiveUserAdmin  from '../../admin/containers/ActiveUserAdmin'

import ActiveGtfsPlusEditor from '../../gtfsplus/containers/ActiveGtfsPlusEditor'

// import { UserIsAuthenticated, UserIsAdmin } from '../util/util'

class App extends React.Component {

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.checkExistingLogin()
    .then((action) => {
      console.log('got config + login')
    })
  }

  render () {
    const checkLogin = (callback) => {
      return this.props.fetchConfig()
      .then(() => {
        this.props.checkExistingLogin()
        .then((action) => {
          console.log(action)
          callback()
        })
      })
    }

    const requireAuth = (nextState, replace, callback) => {
      // checkLogin(callback).then(something => {
      //   if (this.props.user.profile === null) {
      //     replace(null, '/')
      //   }
      // })
      this.props.checkExistingLogin()
      .then((action) => {
        console.log('requiring auth')
        if (this.props.user.profile === null) {
          replace(null, '/')
        }
        callback()
      })
    }

    const requireAdmin = (nextState, replace, callback) => {
      this.props.checkExistingLogin()
      .then((action) => {
        console.log('requiring admin')
        if (!this.props.user.permissions.isApplicationAdmin()) {
          replace(null, '/')
        }
        callback()
      })
    }

    let canAccess = false, noAccessReason
    if(this.props.user.profile === null) {
      noAccessReason = 'NOT_LOGGED_ID'
    }
    else {
      canAccess = true
    }
    return (
      // AUTH WITH HOC
      // <Router history={this.props.history}>
      //   <Redirect from='/' to='explore' />
      //   <Route path='/account' component={UserIsAuthenticated(ActiveUserAccount)} />
      //   <Route path='/admin' component={UserIsAdmin(ActiveUserAdmin)} />
      //   <Route path='/signup' component={ActiveSignupPage} />
      //   <Route path='/explore' component={ActivePublicFeedsViewer} />
      //   <Route path='/public/feed/:feedSourceId' component={ActivePublicFeedSourceViewer} />
      //   <Route path='/project' component={UserIsAuthenticated(ActiveProjectsList)} />
      //   <Route path='/project/:projectId' component={UserIsAuthenticated(ActiveProjectViewer)} />
      //   <Route path='/feed/:feedSourceId' component={UserIsAuthenticated(ActiveFeedSourceViewer)} />
      // </Router>

      <Router history={this.props.history}>
        <Redirect from='/' to='explore' />
        <Route path='/account' component={ActiveUserAccount} onEnter={requireAuth} />
        <Route path='/admin' component={ActiveUserAdmin} onEnter={requireAdmin} />
        <Route path='/signup' component={ActiveSignupPage} />
        <Route path='/explore' component={ActivePublicFeedsViewer} />
        <Route path='/public/feed/:feedSourceId' component={ActivePublicFeedSourceViewer} />
        <Route path='/project' component={ActiveProjectsList} onEnter={requireAuth} />
        <Route path='/project/:projectId' component={ActiveProjectViewer} onEnter={requireAuth} />
        <Route path='/feed/:feedSourceId' component={ActiveFeedSourceViewer} onEnter={requireAuth} />
        <Route path='/gtfsplus/:feedSourceId' component={ActiveGtfsPlusEditor} onEnter={requireAuth} />
      </Router>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    checkExistingLogin: (callback) => dispatch(checkExistingLogin())
  }
}

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default App
