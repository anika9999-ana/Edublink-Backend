import express from 'express'
// import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userController.js';
import { admin, auth } from "../middleware/userAuth.js";

const userRouter=express.Router();

userRouter.get('/data',auth,getUserData)
// userRouter.get('/data',getUserData)

export default userRouter;