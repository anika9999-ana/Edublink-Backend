import express from 'express';
import Razorpay from 'razorpay';
import 'dotenv/config';
import crypto from 'crypto'
import Payment from '../models/Payment.js';
import orderModel from '../models/orderModel.js'
import { auth } from "../middleware/userAuth.js";

const router = express.Router();

const razorpayInstance= new  Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
})

// ROUTE 1 : Create Order Api Using POST Method http://localhost:3001/api/payment/order
router.post('/order', (req, res) => {
    const { cart} = req.body;
    try {
        let total=0;
        cart.map((i) => {
            if(i.price=="Free"){
                i.price="$0";
            }
            total += Number(i.price.slice(1))
        });
        const options = {
            amount: total*100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            
            res.status(200).json({ data: order });
            console.log(order)
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
})

// ROUTE 2 : Create Verify Api Using POST Method http://localhost:4000/api/payment/verify
router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,auth,data,cart } = req.body;
    // console.log("req.body", req.body);

    try {
        // Create Sign
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        // Create ExpectedSign
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        // console.log(razorpay_signature === expectedSign);

        // Create isAuthentic
        const isAuthentic = expectedSign === razorpay_signature;

        // Condition 
        if (isAuthentic) {
            const payment = new Payment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            });

            // Save Payment 
            await payment.save();
            const ordernew = new orderModel ({
                courses:cart,
                payments:data.amount/100,
                payment_id:razorpay_order_id,
                buyer:auth.user._id
            }).save()

            // Send Message 
            res.json({
                message: "Payement Successfully"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
})

export default router