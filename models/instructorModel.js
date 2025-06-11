import mongoose from "mongoose";

const Schema = mongoose.Schema;

const instructorSchema = new Schema({
    name: { type: String, required: true },
    detail: { type: String},
    description: { type: String},
    address:{type:String},
    email:{type:String},
    phone:{type:String},
    image:{type:String},
    status: { type: Number, default: 1, },
    createdAt: { type: Date, default: Date.now() },
})

const instructorModel = mongoose.models.instructor || mongoose.model('instructor', instructorSchema)

export default instructorModel;