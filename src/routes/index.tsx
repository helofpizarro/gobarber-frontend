import React from 'react'

import { Switch} from 'react-router-dom'

import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Dashboard from '../pages/Dashboard'
import Route from './Route'


const Router = () => (

  <Switch>
    <Route path='/' exact component={SignIn}   />
    <Route path='/signup'  component={SignUp} />
    <Route path='/signin'  component={SignUp} />
    <Route path='/dashboard'  component={Dashboard} isPrivate />
  </Switch>

)

export default Router