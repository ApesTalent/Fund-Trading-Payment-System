import React from 'react'
import { Redirect, Route } from 'react-router-dom'

function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => JSON.parse(localStorage.getItem('user'))?.loggedIn
          ? <Component {...props} />
          : <Redirect to={{pathname: '/auth/login', state: {from: props.location}}} />}
      />
    )
  }

export default PrivateRoute
