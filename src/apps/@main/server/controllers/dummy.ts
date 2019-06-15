import { Router } from 'express'
export default Router().use('/cat', Router()
    .get('/', (request, response) => {
        response.json({ rows: [{ id: '5', name: 'dummy val a' }]})
    })
    .post('/search', (request, response) => {
        response.json({ rows: [{ id: '5', name: 'dummy val a' }]})
    })
)
