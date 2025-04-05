import express from 'express'
import product from '../models/product.js'
import protect from '../middleware/authMiddleware.js'
import admin from '../middleware/adminMiddleware.js'
import upload from '../routes/uploadRoutes.js'

const router = express.Router()

// @route GET /api/admin/products
// @des Get all products (Admin only)
// @access Private/Admin
router.get('/', protect, admin, async(req, res) => {
  try {
    const products = await product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"})    
  }
})

// @route POST /api/admin/products
// @desc Create a new product
// @access Private/Admin
router.post('/', protect, admin, async(req, res) => {
  try {
    const {
      name,
      description,
      price,
      disCountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      isFeatured,
      isPublished,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      weight
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !countInStock || !sku || !category || !sizes || !colors || !collections) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new product({
      name,
      description,
      price,
      disCountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      isFeatured,
      isPublished,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      weight,
      user: req.user._id
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/admin/products/:id
// @desc Update a product
// @access Private/Admin
router.put('/:id', protect, admin, async(req, res) => {
  try {
    const {
      name,
      description,
      price,
      disCountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      isFeatured,
      isPublished,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      dimensions,
      weight
    } = req.body;

    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        disCountPrice,
        countInStock,
        sku,
        category,
        brand,
        sizes,
        colors,
        collections,
        material,
        gender,
        isFeatured,
        isPublished,
        tags,
        metaTitle,
        metaDescription,
        metaKeywords,
        dimensions,
        weight
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/admin/products/:id
// @desc Delete a product
// @access Private/Admin
router.delete('/:id', protect, admin, async(req, res) => {
  try {
    const productToDelete = await product.findById(req.params.id);
    
    if (!productToDelete) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated images from Cloudinary if they exist
    if (productToDelete.images && productToDelete.images.length > 0) {
      for (const image of productToDelete.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }

    await productToDelete.remove();
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;