import express from 'express'
import { PostingLogic,GettingLogic,PuttingLogic,DeletingLogic } from '../controllers/upload.controller.js';

const router = express.Router();

router.post('/posting',PostingLogic);
router.get('/getting',GettingLogic)
router.put('/update/:id',PuttingLogic)
router.delete('/delete/:id',DeletingLogic);

export default router;