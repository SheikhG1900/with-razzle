import '@/App.css'
import '@/tailwind.css'
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Loadable from 'react-loadable'

const Home = Loadable({
  loader: () => import('@/Home'),
  loading: () => null,
})

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
  </Switch>
)

export default App

