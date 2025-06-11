import orderModel from "../models/orderModel.js";

export const getOrdersController = async (req, res) => {
    try {
      const courseid = req.params.id;
      console.log(courseid)
      const orders = await orderModel.find({ payment_id: courseid}).populate("courses")
      // .populate("customers","name")
  
      res.status(200).json({
        data: orders,
        message: "order data",
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  }