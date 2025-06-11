import mongoose from "mongoose";
const Schema = mongoose.Schema;

const customerSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course',
    },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    status: { type: Number, default: 1, },
    createdAt: { type: Date, default: Date.now() },
})

const customerModel = mongoose.models.customer || mongoose.model('customer', customerSchema)

export default customerModel;