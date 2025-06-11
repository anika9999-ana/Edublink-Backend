import express from 'express'
import {addInstructor,getInstructor,deleteInstructor} from '../controllers/instructorController.js';
import { admin, auth } from "../middleware/userAuth.js";
const instructorRouter = express.Router();

instructorRouter.get('/data', getInstructor)
instructorRouter.post('/add-data',auth,admin, addInstructor)
// categoryRouter.get('/get-product/:id',auth,admin, getProductById)
// categoryRouter.put('/edit-category/:id',auth,admin, updateCategory)
instructorRouter.delete('/delete-instructor/:id',deleteInstructor)


export default instructorRouter;