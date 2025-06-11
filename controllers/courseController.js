import multer from "multer";
import path from "path";
import fs from "fs";
import courseModel from "../models/courseModel.js";
import categoryModel from "../models/categoryModel.js"
import { count } from "console";
import { query } from "express";

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  // destination of file
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type');

    if (!fs.existsSync("./uploads/course")) {
      fs.mkdirSync("./uploads/course");
    } else if (isValid) {
      uploadError = null
    }
    cb(uploadError, "./uploads/course");
  },
  filename: function (req, file, cb) {
    // renaming file name
    const orgName = file.originalname;
    const name = path.parse(orgName).name;
    const ext = path.parse(orgName).ext;
    const unique = Date.now();

    cb(null, name + "-" + unique + ext);
  },
});

//instance of multer
const upload = multer({ storage: storage });

export const addcourse = async (req, res) => {
  try {
    const fileWithData = upload.single("image");

    fileWithData(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      console.log(req.body);
      console.log(req.file);
      if (!req.file) return res.status(400).send('No image in the request')

      const { name, category, level, description, price, instructor,
        duration, lessons, students, language, certification, rating
      } = req.body;

      const img = req.file ? req.file.filename : null;
      const created = await courseModel.create({
        name: name,
        category: category,
        level: level,
        description: description,
        image: img,
        price: price,
        instructor: instructor,
        duration: duration,
        lessons: lessons,
        students: students,
        language: language,
        certification: certification,
        rating: rating,
      });
      return res.status(200).json({
        data: created,
        message: "Course Added Successfull",
        success: true,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getcourse = async (req, res) => {
  try {

    let productData = await courseModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categorydetails"
        },
      },
      { $unwind: "$categorydetails" },
      {
        $lookup: {
          from: "instructors",
          localField: "instructor",
          foreignField: "_id",
          as: "instructordetails"
        },
      },
      { $unwind: "$instructordetails" },
      {
        $project: {
          name: 1,
          price: 1,
          level: 1,
          image: 1,
          price: 1,
          duration: 1,
          lessons: 1,
          students: 1,
          language: 1,
          certification: 1,
          rating: 1,
          category: "$categorydetails.category",
          cid: "$categorydetails._id",
          inid:"$instructordetails._id",
          instructor: "$instructordetails.name",
        }
      },
    ])

    return res.status(200).json({
      data: productData,
      count: productData.length,
      massage: "products Fetched",
      success: true,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, success: false })
  }
}

export const updateCourse = async (req, res) => {
  try {
    const updateWithFile = upload.single("image");
    updateWithFile(req, res, async function (err) {
      if (err) return res.status(400).json({ massage: err.message });

      const courseid = req.params.id;
      const { name, category, level, description, price, instructor,
        duration, lessons, students, language, rating, certification
      } = req.body;

      const imageData = await courseModel.findOne({ _id: courseid });
      const img = req.file ? req.file.filename : imageData.image;

      if (req.file) {
        if (fs.existsSync('./uploads/course' + imageData.logo)) {
          fs.unlinkSync('./uploads/course' + imageData.logo);
        }
      }
      const updatecourse = await courseModel.updateOne(
        { _id: courseid },
        {
          $set: {
            name: name,
            category: category,
            level: level,
            description: description,
            image: img,
            price: price,
            instructor: instructor,
            duration: duration,
            lessons: lessons,
            students: students,
            language: language,
            rating: rating,
            certification: certification,
          }
        }
      );

      if (updatecourse.modifiedCount > 0) {
        return res.status(200).json({
          message: "course data updated!",
          success: true,
        });
      }

      return res.status(400).json({
        message: "Something went wrong!",
        success: false,
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};


export const getSingleCourse = async (req, res) => {
  const { id } = req.params;
  let productData = await courseModel.aggregate([
    { $match: { $expr: { $eq: ['$_id', { $toObjectId: `${id}` }] } } },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categorydetails"
      },
    },
    { $unwind: "$categorydetails" },
    {
      $lookup: {
        from: "instructors",
        localField: "instructor",
        foreignField: "_id",
        as: "instructordetails"
      },
    },
    { $unwind: "$instructordetails" },
    {
      $project: {
        name: 1,
        price: 1,
        level: 1,
        image: 1,
        price: 1,
        duration: 1,
        lessons: 1,
        students: 1,
        language: 1,
        certification: 1,
        rating: 1,
        category: "$categorydetails.category",
        cid: "$categorydetails._id",
        instructor: "$instructordetails.name",
      }
    },
  ])
  return res.status(200).json({
    data: productData,
    count: productData.length,
    massage: "products Fetched",
    success: true,
  });

}

export const relatedCourse = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    let courseData = await courseModel.find({ category: cid, _id: { $ne: pid } })
      .limit(3).populate("category", "category").populate("instructor", "name");

    // const courseData=await courseModel.findOne({category:cid})
    // const courseData=await courseModel.findOne({category:cid,
    //   _id:{$ne:pid}
    // }).limit(3).populate("category","category").populate("instructor","name");

    res.status(200).json({
      count: courseData.length,
      data: courseData,
      message: "Single course data",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}

//get course by category

export const courseCategory = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ category: req.params.category })

    const courses = await courseModel.find({ category }).populate("category", "category").populate("instructor", "name")

    res.status(200).json({
      data: courses,
      message: "Single course data",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}




export const getFilterCourse = async (req, res) => {
  try {
    const { checked } = req.body
    console.log(checked)
    let args={
      $or: [
        { category:  checked },
        { instructor: checked },
       
      ]
    }
    //  if(checked.length>0)

      // (args.category)=checked 
    // else  args.instructor=checked
    console.log(args)
    const courses = await courseModel.find(args)

    res.status(200).json({
      count:courses.length,
      data: courses,
      message: "Single course data",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}


//search course
export const searchCourse=async(req,res)=>{
  try {
    const {keyword } = req.params;
    console.log(keyword)
    const result=await courseModel.find({
     name:{$regex:keyword,$options: "i"}
    })
    res.json(result)
    
  } catch (error) {
    console.log(error)
    res.status(400).send({
      message: "Error in serach course api",
      success: false,
    });
  }
}


// try new
// http://localhost:3001/api/course/filter-course?category=677d5835a600e1d659cdbb8a&level=Beginner
export const getSearchItem =async(req,res)=>{
  try {
    console.log(req.query)
    const courses = await courseModel.find(req.query)

    res.status(200).json({
      count:courses.length,
      data: courses,
      message: "Single course data",
      success: true,
    });
    
  } catch (error) {
    console.log(error)
    res.status(400).send({
      message: "Error in serach course api",
      success: false,
    });
  }
}



