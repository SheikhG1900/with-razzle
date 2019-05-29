import { Router } from 'express'

const base = Router()
export default base

const router = Router()
const { route } = router
base.use('/dummy', router)

router.get('/b', (request, response) => {
    response.json({ dummy: 'dummy val b' })
})
