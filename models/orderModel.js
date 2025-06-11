import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    courses: [
        {
            type: mongoose.ObjectId,
            ref: "course",
        }
    ],
    payments:{},
    buyer:{
        type:mongoose.ObjectId,
        ref:"customer"
    },
    payment_id:{},
    createdAt: { type: Date, default: Date.now() },
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)

export default orderModel;