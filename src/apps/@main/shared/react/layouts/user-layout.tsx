import loadable from '@loadable/component'
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import './user-layout.css'

const Home = loadable(() => import('../pages/home'))

const UserLayout = () => (
  <Switch>
    <Route exact path='/' component={Home} />
  </Switch>
)

export default UserLayout
