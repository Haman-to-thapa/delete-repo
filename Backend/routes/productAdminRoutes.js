import express from 'express'
import product from '../models/product.js'
import protect from '../middleware/authMiddleware.js'
import admin from '../middleware/adminMiddleware.js'


const router = express.Router()

// @route GET /api/admin/products
// @des Get all products (Admin only)
// @access Private/Admin


router.get('/',protect, admin, async(req, res) => {
  try {
    const products = await product.find({});
    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Sever Error"})    
  }
})


export default router;