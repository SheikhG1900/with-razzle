import { testConnectivity } from '../../server/entities/_auto'

import { Router } from 'express'
export default Router().use('/group', Router()
    .get('/', (request, response) => {
        response.json({ rows: [{ id: '1', name: 'dummy val a' }]})
    }).get('/entity', (request, response) => {
        testConnectivity()
        console.log('testing- entity')
        response.json({ rows: [{ id: '1', name: 'entity' }]})
    })
)
