import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category: { type: String, required: true },
    status: { type: Number, default: 1, },
    createdAt: { type: Date, default: Date.now() },
})

const categoryModel = mongoose.models.category || mongoose.model('category', categorySchema)

export default categoryModel;