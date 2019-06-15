import { Router } from 'express'

export default Router()
    .use('/*', (request, response) => response.status(404).send({ msg: 'not implemented' }))
