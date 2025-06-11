import categoryModel from "../models/categoryModel.js";

export const getcategoryData = async (req, res) => {
    try {
        const categoryList = await categoryModel.find();
        if (!categoryList) {
            return res.json({ success: false, message: 'category Not Found' });
        }
        res.json({
            count:categoryList.length,
            success: true,
            categoryData:categoryList,            
        })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const addcategoryData = async (req, res) =>{
    let categoryData = new categoryModel({
        category: req.body.category,
    })
    await categoryData.save();

    if(!categoryData)
    return res.status(400).send('the category cannot be created!')

    res.send(categoryData);
}

export const updateCategory=async(req,res)=>{
    try {
      const id=req.params.id;
      const{category}=req.body;
  
      const catData=await categoryModel.updateOne
      ({_id:id},{$set:{
        category:category
      }})
  
      if(catData.modifiedCount>0){
        return res.status(200).json({
          message:"Updated",
          success:true
        })
      }
      else{
        return res.status(400).json({
          message:"Something went wrong",
          success:false
        })
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  }

  export const deleteCategory=async(req,res)=>{
    try {
      const id=req.params.id;
      const catData=await categoryModel.deleteOne({_id:id});
  
      if(catData.deletedCount>0){
        return res.status(200).json({
          message:"Deleted",
          success:true
        })
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

  export const getProductById = async (req, res) => {
    let data = await categoryModel.findById(req.params.id)
    if (data) {
        res.send({ code: 200, message: 'fetch by id success', data: data })
    } else {
        res.send({ code: 500, message: 'Server Err.' })
    }
}