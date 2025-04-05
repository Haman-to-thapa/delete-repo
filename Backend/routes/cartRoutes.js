
import express from 'express';
import Cart from "../models/Cart.js";
import Product from '../models/product.js'; 
import protect from '../middleware/authMiddleware.js';


const router = express.Router();

// Helper function to get a cart by user ID or guest ID
const getCart = async (userId, guestId) => {  
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// @route   POST /api/cart
// @desc    Add a product to the cart for a guest or logged-in user
// @access  Public
router.post('/', async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);  
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Determine if the user is logged in or guest
    let cart = await getCart(userId, guestId); 

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId && 
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        // if the product already exist , update the quantity
        cart.products[productIndex].quantity += quantity; 
      } else {
        // Add new product
        cart.products.push({
          productId,
          name: product.name, 
          image: product.images[0].url, 
          price: product.price, 
          size,
          color,
          quantity,
        });
      }

      // Recalculate the total price
      cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // Create a new cart for the guest or user
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [ 
          {
            productId,
            name: product.name, 
            image: product.images[0].url, 
            price: product.price, 
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity, 
      });

      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});


// @route Put / api/ cart
// @desc Update product in the cart for a guest or logged-in user
//@access public

router.put('/', async(req, res) => {

  const {productId, quantity, size, color, guestId, userId} = req.body;



  try {
    let cart = await getCart(userId, guestId); 
    if(!cart) {
      return res.status(404).json({message: "Cart not found"})};
    
    
      const productIndex = cart.products.findIndex(
        (p) => 
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
      );


      
    if(productIndex > -1) {
      // update quantity
      
      if(quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); // reomver produt if quantity is 0
      }

      cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0) 
      await cart.save();
      return res.status(200).json(cart);

    } else {
      return res.status(404).json({message: "Product not found in Cart"})
    }
   
    
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: "server error"})
    
  }
})

// @route DELETE /api/cart
// @desc Remove a product form the cart 
// @access Public
router.delete('/', async (req, res) => {
  const {productId, size, color, guestId, userId} = req.body;

  try {
    
    let cart = await getCart(userId, guestId);

    if(!cart) {
      return res.status(404).json({message: "Cart not found"});
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
      && p.size === size 
      && color === color
    );

    if(productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalPrice = cart.products.reduce((acc, item) => 
      acc + item.price * item.quantity, 0);

      await cart.save() 

      return res.status(200).json(cart)
    } else {
      return res.status(404).json({message: "product not found in cart"})
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Server Error"})
  }
})

// @route GET / api/cart
// @desc GET logged-in user's or guest user's cart
// @access Public
router.get('/', async(req, res) => {
  const {userId, guestId} = req.query;

  try {
    
    const cart = await getCart(userId, guestId);
    if (cart) {
     return res.json(cart);
    } else {
    return  res.status(404).json({message: "Cart not found"})
    }

  } catch (error) {
    console.error(error)
    return  res.status(500).json({message: "Server Error"})
    
  }
})

// @route POST /api/cart/merge 
//@desc Merge guest cart into user cart on login
// @access Private

router.post('/merge', protect, async(req, res) => {
  const {guestId} = req.body;

  const guestCard = await Cart.findOne({guestId});
  const userCart = await Cart.findOne({user: req.user._id});

  try {
    //checking guestCard first
  if(guestCard) {
    if(guestCard.products.length === 0) {
      return res.status(400).json({message: "Guest cart is empty"})
    }

    if(userCart) {
      // merge guest cart inot user cart
      guestCard.products.forEach((guestItem) => {
        const productIndex = userCart.products.findIndex(
          (item) => item.productId.toString() === 
          guestItem.productId.toString()
          && item.size === guestItem.size 
          && item.color === guestItem.color
        );

        if(productIndex > -1) {
          // if the items exist in the user cart , updat the quantity

          userCart.products[productIndex].quantity += guestItem.quantity;
        } else {
          // Otherwise , add the guest item to the cart
          userCart.products.push(guestItem)
        }
      });
    
      userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
      await userCart.save();

      // Remove the guest cart after merging
      try {
        await Cart.findOneAndDelete({guestId})

      } catch (error) {
        console.error("Error deleting guestCard", error)
      }

      return res.status(200).json(userCart)

    } else {
      // if the user has no existing cart, assign the guest cart to the user
      guestCard.user = req.user._id;
      guestCard.guestId = undefined;
      await guestCard.save()

      return res.status(200).json(userCart)
    }

    res.status(404).json({message: "Guest cart not found"})
  }
  else {
    if(userCart) {
      // Guest cart has already been merged, return user cart
      return res.status(200).json(userCart)
    }
  }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server Error" })
  }
})

export default router;
