import express from 'express'
import {generateOtp} from '../controllers/advConcepts.js'

const router = express.Router();

router.get('/otp',generateOtp)


export default router;