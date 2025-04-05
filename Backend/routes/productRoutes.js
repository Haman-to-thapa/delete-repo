import express from "express";
import protect from "../middleware/authMiddleware.js";
import Product from "../models/product.js";
import admin from "../middleware/adminMiddleware.js";



const router = express.Router();

// @route POST /api/products
// @desc Create a new Product
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
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
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
    } = req.body;

    // Correct model name
    const product = new Product({
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
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      user: req.user._id, // Reference to the admin user who created it
    });


    if (!collections) {
      return res.status(400).json({ error: 'Collections field is required' });
  }

    // Save product to DB
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route PUT / api/products/:id
// @desc Update an existing product ID
// @access Private/Admi
router.put("/:id", protect, admin, async (req, res) => {
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
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
    } = req.body;

    // Find product by ID
    const product = await Product.findById(req.params.id);
    
    if(product) {
      //update product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.disCountPrice = disCountPrice || product.disCountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.sku = sku || product.sku;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

      product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      
      // save the update product 
      const updateProduct = await product.save();
      res.json(updateProduct)
    } else {
      res.status(404).json({message :" product not found"})
    }
  } catch (error) {
    console.error(error)
    res.status(401).json({message: "Server Error"})
  }
});

// @route DELELTE /api/products/:id
//@desc Delete a proudct by ID
// @access Private/Admin 

router.delete('/:id', protect, admin, async(req, res) => {
  
  const product = await Product.findById(req.params.id);

  try {
    if(product) {
      await product.deleteOne();
      res.json({message : "Product Removed"});
    } else {
      res.status(404).json({message: "Product Not Found"})
    }
  } catch (error) {
    console.error(error)
    res.status(404).json({message:"Server Error"})
  }

})

// @route GET / api/products
// @desc Get all proudcts with optional query filters
// @access pulic

router.get('/', async (req, res) => {
  try {
    const {collection, size, color, gender, minPrice, maxPrice,sortBy, search, category, material, brand, limit} = req.query;

    let query = {};

    //  Filter logic 
    //collections
    if(collection && collection.toLocaleLowerCase() !== 'all'){
      query.collections = collection;
    }

    //category
    if(category && category.toLocaleLowerCase() !== "all"){
      query.category = category;
    }
  //material
  if(material) {
    query.material = {$in : material.split(",")};
  }
  //brand 
  if(brand) {
    query.brand = {$in  : brand.split(",")}
  }
  //size
  if(size) {
    query.size = {$in : size.split(",")}
  }

  // color 
  if(color) {
    query.color = {$in : [color]}
  }
  // gender 
  if(gender) {
    query.gender = gender;
  }

  // minPrice 
  if(minPrice || maxPrice) {
    query.price = {};
    if(minPrice) query.price.$gte = Number(minPrice);
    if(maxPrice) query.price.$lte = Number(maxPrice);
  }
// search
  // if(search) {
  //   query.$or = [
  //     { name: {$regex: search , $option: "i"}},
  //     {description: {$regex: search, $option: "i"}},
  //   ]
  // }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } }, 
      { description: { $regex: search, $options: "i" } }, 
    ];
  }

  // Sort Logic 
 let sort = {};
  if(sortBy) {
    switch (sortBy) {
      case "priceAsc": sort = {price : 1};
      break;
      case "priceDesc": sort = {price : -1};
      break;
      case "popularity": sort = {rating: -1};
      break;
      default: 
      break;
    }
  }

  // Fetching products and apply shorting and limit
  let products = await Product.find(query).sort(sort)
  .limit(Number(limit) || 0)
  res.json(products)

  } catch (error) {
    console.error(error)
    res.status(500).json("server error");
  }
})


// @route Get / api/products/best-seller
// @desc Retrieve the product with highest rating
// @access Public

router.get("/best-seller", async(req, res) => {
  try {
    const bestSeller  = await Product.findOne().sort({rating : -1});
    
    if(bestSeller) {
      res.json(bestSeller)
    }else {
      res.status(404).json({messgae: "No best seller found" })
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error")
  }
})



//@route Get / api/products/new-arrivals
//dec Reterive latest 8 products - creation date
// @access public

router.get('/new-arrivals', async (req, res) => {
  try {
    //fetching latest 8 products
    const newArrivals = await Product.find().sort({createdAt: -1}).limit(8)
    res.json(newArrivals);

  } catch (error) {
    console.error(error)
    res.status(500).json("Server Error")
  }
})


// @route Get / api/products/:id
// @desc Get a single poduct by ID
// @access Public

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if(product) {
      res.json(product)
    } else {
      console.error(error)
    res.status(500).send("Server Error")
    }   
  } catch (error) {
  }
})

// @route GET /api/products/similar/:id
// @desc Retrieve similar based on the current product's gender and category
// @access Public 
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received ID:", id);

  try {
    const handleProduct = await Product.findById(id)
    
    

    if (!handleProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const similarProducts = await Product.find({
      _id: { $ne: id }, // Exclude the current product
      gender: handleProduct.gender,
      category: handleProduct.category,
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});



export default router;
