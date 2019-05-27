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

import { PUBLIC_DIR } from '_/env'
import appContext from './app-context'
import LayoutRouter from './shared/layouts/layout-router'
import initStore from './shared/redux/init-store.js'

const server = express()
const extractor = new ChunkExtractor({ stats, entrypoints: ['client'] })
const configuredCors = cors()
const store = initStore(appContext)
server
    .disable('x-powered-by')
    .use(bodyParser.json({ limit: '20mb' }))
    .use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
    .use(compression())
    .use(express.static(PUBLIC_DIR))
    .use('/api', configuredCors, (req, res) => res.json({ status: 'done' }))
    .get('/*', (req, res) => {
        const context: { url?: any } = {}
        const markup = renderToString(
            <Provider store={store}>
                <ChunkExtractorManager extractor={extractor}>
                    <StaticRouter context={context} location={req.url}>
                        <LayoutRouter />
                    </StaticRouter>
                </ChunkExtractorManager>
            </Provider>
        )

        if (context.url) {
            res.redirect(context.url)
        } else {
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
    </body>
</html>`
            )
        }
    })

export default server
