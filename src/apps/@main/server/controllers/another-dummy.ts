import { Router } from 'express'
export default Router().use('/group', Router()
    .get('/', (request, response) => {
        response.json({ rows: [{ id: '1', name: 'dummy val a' }]})
    })
)
