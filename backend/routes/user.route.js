import express from 'express'
import { currentUser, Signin, SignUp } from '../controllers/user.controller.js';
import { AutenticateUser } from '../middlewares/auth.middleware.js';
import userModel from '../models/user.model.js';

const router = express.Router();

router.post('/signup',SignUp)
router.post('/signin',Signin)
router.get('/me',AutenticateUser,currentUser);
router.get('/all',async (req,res) =>{
    const AllUsers = await userModel.find({});
    res.json(AllUsers)
})


export default router;