import multer from "multer";
import path from "path";
import fs from "fs";
import instructorModel from "../models/instructorModel.js";

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

    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }else if(isValid){
      uploadError = null
    }
    cb(uploadError, "./uploads");
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

export const addInstructor = async (req, res) => {
  try {
    const fileWithData = upload.single("image");

    fileWithData(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      console.log(req.body);
      console.log(req.file);
      if(!req.file) return res.status(400).send('No image in the request')

      const { name,detail,description,address,email,phone } = req.body;

      const img = req.file ? req.file.filename : null;
      const created = await instructorModel.create({
        name: name,
        detail:detail,
        description:description,
        address:address,
        email:email,
        phone:phone,
        image: img,
      });
      return res.status(200).json({
        data: created,
        message: "Brand Created Successfull",
        success: true,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};


// http://localhost:3001/node-files/team-01-1736529469627.jpeg
export const getInstructor = async (req, res) => {
  try {
    const instructorData = await instructorModel.find().limit(6);
    return res.status(200).json({
      data: instructorData,
      filepath: "http://localhost:3001/uploads",
      massage: "Instructor Fetched",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ massage: error.massage, success: false });
  }
};

export const deleteInstructor=async(req,res)=>{
  try {
    const id=req.params.id;
    const catData=await instructorModel.deleteOne({_id:id});

    if(catData.deletedCount>0){
      return res.status(200).json({
        message:"Deleted",
        success:true
      })
      // window.location.reload();
    }
    else{
      return res.status(400).json({
        message:"Something Went Wrong",
        success:false,
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}