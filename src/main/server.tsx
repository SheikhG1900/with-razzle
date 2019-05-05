import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Capture } from 'react-loadable'
import { getBundles } from 'react-loadable/webpack'
import { StaticRouter } from 'react-router-dom'
import stats from '../../build/react-loadable.json'

import App from './App'

// tslint:disable-next-line:no-var-requires
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const server = express()

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context: {url?: any} = {}
    const modules = []
    const modulePusher = (moduleName)  => modules.push(moduleName)
    const markup = renderToString(
      <Capture report={modulePusher}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </Capture>
    )

    if (context.url) {
      res.redirect(context.url)
    } else {
      modules.push('@aw/Home')
      const bundles = getBundles(stats, modules)
      const jsChunks = bundles.filter((bundle) => bundle && bundle.file.endsWith('.js'))
      const cssChunks = bundles.filter((bundle) => bundle && bundle.file.endsWith('.css'))
      // tslint:disable-next-line:object-literal-sort-keys
      console.log({ url: req.url, cssChunks, jsChunks, modules, bundles
        ,           len: bundles.length, env: process.env.RAZZLE_ASSETS_MANIFEST })
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}"></link>`
            : ''
        }
        ${cssChunks.map((chunk) => `<link rel="stylesheet" href="${chunk.publicPath}"></link>`).join('\n')}
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
        ${jsChunks.map((chunk) => `<script src="${chunk.publicPath}"></script>`).join('\n')}
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
      )
    }
  })

export default server
