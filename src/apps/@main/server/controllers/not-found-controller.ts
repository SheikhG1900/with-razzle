import { Router } from 'express'

export default Router()
    .get('/*', (request, response) => response.status(404).send({ msg: 'not implemented' }))
