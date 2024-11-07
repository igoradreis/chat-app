import Router, { Request, Response } from 'express'
import { list as listController, select as selectController, insert as insertController } from '../controllers/message.controller'

const router = Router()

router.post('/list', listController as any)
router.post('/select', selectController as any)
router.post('/insert', insertController as any) 

export default router
