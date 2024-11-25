import {Router} from 'express'
import { register } from '../controllers/User.controller.js'
const router =Router() 

router.route('/register').post(register)

export default router