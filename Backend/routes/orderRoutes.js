import express from 'express';
import protect from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';




const router = express.Router()

//@route GET / api/orders/my-orders
// @desc GET logged=in user's orders 
// @access private

router.get('/my-orders', protect, async(req,res) => {
  try {
    //Find orders for the authenicated user
    const orders = await Order.find({user: req.user._id}).sort({
      createdAt: -1,
    }) // sort by most  recent orders
   
    return res.json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"})
    
  }
})

// @route GET /api/orders/:id
// @desc Get order details by ID
// @access Private 

router.get('/:id', protect, async(req,res) => {

  try {
    const orders = await Order.findById(req.params.id).populate("user", "name email");

    if(!orders) {
      return res.status(404).json({ message: "Order not found" });
    }
    //Return the full order details
    return res.json(orders)
    
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"})
    
  }
})


export default router;