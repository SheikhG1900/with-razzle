import { Router } from 'express'
import c1 from './another-dummy'
import c2 from './dummy'
import notFound from './not-found-controller'

const router = Router().use('/moduleA', [c1, c2])
export default [ router, notFound ]
