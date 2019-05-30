import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import stats from '../../../build/react-loadable.json'

import controllers from '@/server/controllers'
import { PUBLIC_DIR } from '_/env'
import appContext from './app-context'
import LayoutRouter from './shared/layouts/layout-router'
import initStore from './shared/redux/init-store'
import { $processPendingRequests } from './shared/redux/sagas/actions-summary-sagas'
import $matchSaga from './shared/redux/sagas/saga-matcher'
import { getActionsSummary } from './shared/redux/selectors/root-selectors'

const server = express()
const extractor = new ChunkExtractor({ stats, entrypoints: ['client'] })
const configuredCors = cors()
const store = initStore()

server
    .disable('x-powered-by')
    .use(bodyParser.json({ limit: '20mb' }))
    .use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
    .use(compression())
    .use(express.static(PUBLIC_DIR))
    .use('/api', configuredCors, controllers)
    .get('/*', (req, res) => {
        console.log('react endpoint called')
        const context: { url?: any } = {}
        const render = () => renderToString(
            <Provider store={store}>
                <ChunkExtractorManager extractor={extractor}>
                    <StaticRouter context={context} location={req.url}>
                        <LayoutRouter />
                    </StaticRouter>
                </ChunkExtractorManager>
            </Provider>
        )

        // First render is to initiate all redux actions
        let markup = render()

        if (context.url) {
            res.redirect(context.url)
        } else {
            const sendResponse = () => {
                const preLoaded = JSON.stringify(store.getState())
                res.status(200).send(
                    `<!doctype html>
<html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${extractor.getStyleTags()}
        ${extractor.getScriptTags()}
    </head>
    <body>
        <div id="root">${markup}</div>
        <script>
            window.__PRE_LOADED_STATE__ = ${preLoaded}
        </script>
    </body>
</html>`
                )
            }
            if (getActionsSummary(store.getState()).pending) {
                store.runSaga($processPendingRequests($matchSaga)).toPromise().then(() => {
                    // This we are assuming that react will reder with data.
                    markup = render()
                    sendResponse()
                })
            } else {
                sendResponse()
            }

        }
    })

export default server
