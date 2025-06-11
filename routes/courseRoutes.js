import express from 'express'
import { addcourse, getcourse, updateCourse, relatedCourse, courseCategory, getSingleCourse,getFilterCourse,searchCourse,getSearchItem} from '../controllers/courseController.js';
import { admin, auth } from "../middleware/userAuth.js";
const courseRouter = express.Router();

courseRouter.get('/data', getcourse)
courseRouter.post('/search', getSearchItem)
courseRouter.post('/add-data', auth, admin, addcourse)
courseRouter.get('/single/:id', getSingleCourse)
courseRouter.post('/filter-course', getFilterCourse)
courseRouter.get('/related-course/:pid/:cid', relatedCourse)
courseRouter.get('/category-course/:category', courseCategory)
courseRouter.put('/edit/:id', auth, admin, updateCourse)
courseRouter.get('/search/:keyword', searchCourse)
// categoryRouter.delete('/delete-category/:id',auth,admin,deleteCategory)



export default courseRouter;