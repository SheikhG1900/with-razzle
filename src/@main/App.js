import '@/App.css'
import '@/tailwind.css'
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import loadable  from '@loadable/component'

const Home = loadable(() => import('@/Home'))

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
  </Switch>
)

export default App

