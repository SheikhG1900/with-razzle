import { loadableReady } from '@loadable/component'
import { Provider } from 'react-redux'
import React from 'react'
import { hydrate } from 'react-dom'
import BrowserRouter from 'react-router-dom/BrowserRouter'
import LayoutRouter from './shared/layouts/layout-router'
import initStore from './shared/redux/init-store.js'
import appContext from './app-context'

const preLoadedState = (window as any).__PRE_LOADED_STATE__
loadableReady(() => {
  hydrate(
    <BrowserRouter>
      <LayoutRouter />
    </BrowserRouter>,
    document.getElementById('root')
  )
})

if (module.hot) {
  module.hot.accept()
}

export default () => { console.log('client') }
