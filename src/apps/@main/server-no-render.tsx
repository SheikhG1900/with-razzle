import { ChunkExtractor } from '@loadable/server'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import stats from '../../../build/react-loadable.json'

import { PUBLIC_DIR } from '../../env'
import controllers from './server/controllers'
const server = express()
const extractor = new ChunkExtractor({ stats, entrypoints: ['client'] })
const configuredCors = cors()

server
    .disable('x-powered-by')
    .use(bodyParser.json({ limit: '20mb' }))
    .use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
    .use(compression())
    .use(express.static(PUBLIC_DIR))
    .use('/api', configuredCors, controllers)
    .use('/*', (req, res) => {
        console.log('react endpoint called- no render')

        const sendResponse = (preLoadedState) => {
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
        <div id="root"></div>
        <script>
            window.__PRE_LOADED_STATE__ = ${preLoadedState}
        </script>
    </body>
</html>`
            )
        }

        sendResponse('undefined')
    })

export default server
