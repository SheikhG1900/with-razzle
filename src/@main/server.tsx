import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import stats from '../../build/react-loadable.json'

import App from './App'

const server = express()
const extractor = new ChunkExtractor({ stats, entrypoints: ['client'] })

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context: {url?: any} = {}
    const markup = renderToString(
      <ChunkExtractorManager extractor={extractor}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </ChunkExtractorManager>
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
