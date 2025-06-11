import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:{ type: String, enum:['user','admin'],default:'user'},
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    status: { type: Number, default: 1, },
    createdAt: { type: Date, default: Date.now() },
})

const userModel = mongoose.models.uesr || mongoose.model('user', userSchema)

export default userModel;