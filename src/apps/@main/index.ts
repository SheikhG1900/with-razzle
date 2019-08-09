import http from 'http'
import Loadable from 'react-loadable'

import { APP_PORT } from '../../env'
import app from './server-no-render'

const server = http.createServer(app)
let currentApp = app

Loadable.preloadAll().then(() => {
  server.listen(APP_PORT, (error?) => {
    if (error) {
      console.log(error)
    }
    console.log('🚀 started')
  })
})

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!')

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...')
    server.removeListener('request', currentApp)
    const newApp = require('./server').default
    server.on('request', newApp)
    currentApp = newApp
  })
}

export default () => { console.log('index') }
