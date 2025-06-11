import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import instructorRouter from "./routes/instructorRoutes.js"
import courseRouter from "./routes/courseRoutes.js"
import customerRouter from "./routes/customerRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import payment from './routes/payment.js'

const app = express();
const port = process.env.PORT || 3001
connectDB();

const allowedOrigins=['http://localhost:5173','http://localhost:3000']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials:true}))
app.use('/node-files', express.static('uploads'))
app.use('/node-files', express.static('uploads/course'))
// app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
// app.use('/public/uploads', express.static(__dirname + '/public/uploads'));


app.get('/',(req,res)=>res.send("API working"));
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/instructor', instructorRouter);
app.use('/api/course', courseRouter);
app.use('/api/customer', customerRouter);
app.use('/api/payment', payment);
app.use('/api/order', orderRouter);


app.listen(port,()=>console.log(`Server started on PORT=>${port}`))
