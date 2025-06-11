import express from 'express'
import { getcategoryData, addcategoryData,getProductById,updateCategory,deleteCategory } from '../controllers/categoryController.js';
import { admin, auth } from "../middleware/userAuth.js";
const categoryRouter = express.Router();

categoryRouter.get('/data', getcategoryData)
categoryRouter.post('/add-data', addcategoryData)
categoryRouter.get('/get-product/:id',getProductById)
categoryRouter.put('/edit-category/:id', updateCategory)
categoryRouter.delete('/delete-category/:id',deleteCategory)



export default categoryRouter;