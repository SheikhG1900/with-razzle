import { Router } from 'express'
export default Router().use('/dummy', Router()
    .get('/a', (request, response) => {
        response.json({ dummy: 'dummy val a' })
    })
)
