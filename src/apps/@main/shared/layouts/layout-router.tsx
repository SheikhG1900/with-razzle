import '@/tailwind.css'
import loadable from '@loadable/component'
import React from 'react'
import {Route, Switch} from 'react-router-dom'
const UserLayout = loadable(() => import('../layouts/user-layout'))
const LayoutRouter = () => (
  <Switch>
    <Route exact path='/' component={UserLayout} />
  </Switch>
)
export default LayoutRouter
