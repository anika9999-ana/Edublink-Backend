import express from 'express'
import {  getOrdersController} from '../controllers/orderController.js';
import { requireSignIn} from "../middleware/userAuth.js";
const orderRouter = express.Router();

orderRouter.get('/orders/:id',getOrdersController)

export default orderRouter;