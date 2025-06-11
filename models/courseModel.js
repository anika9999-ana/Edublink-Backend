import mongoose from "mongoose";

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: { type: String, required: true },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required:true
    },
    level:{ type: String, enum:['All Levels','Beginner','Intermediate','Expert']},
    description: { type: String},
    image:{type:String},
    price:{type:String},
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'instructor',
        required:true
    },
    duration:{type:String},
    lessons:{type:String},
    students:{type:String},
    rating:{type:Number},
    language:{type:String,default:'English'},
    certification:{type:String,enum:['Yes','No'],default:'Yes'},
    status: { type: Number, default: 1, },
    createdAt: { type: Date, default: Date.now() },
})

const courseModel = mongoose.models.course || mongoose.model('course', courseSchema)

export default courseModel;