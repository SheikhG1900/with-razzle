import { Router } from 'express'
export default Router().use('/dummy', Router()
    .get('/b', (request, response) => {
        response.json({ dummy: 'dummy val b' })
    })
)
