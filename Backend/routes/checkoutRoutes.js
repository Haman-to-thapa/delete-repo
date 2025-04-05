import Order from '../models/Order.js'
import express from 'express'
import Cart from '../models/Cart.js'
import Checkout from '../models/Checkout.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// @route POST / api/checkout
// @desc Create a new checkout session
// @access Private


router.post('/', protect, async(req, res) => {
  const {checkoutItems ,shippingAddress, paymentMethod, totalPrice} = req.body

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }
  

  try {
    const newChekout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });
    console.log(`checkout created for user ${req.user._id}`)
    res.status(201).json(newChekout);

  } catch (error) {
    console.error("Erorr creating checkout session ", error);
    res.status(500).json({message: "Server Error"});
    
  }
})


// @route PUT /api/checlut/:id/pay
// @desc Update checkout to make as paid after succesful payment
// @access Private

router.put('/:id/pay', protect, async(req,res) => {
  const {paymentStatus , paymentDetails} = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if(!checkout) {
      return res.status(404).json({message: "Checkout not found"});
    }
    if(paymentStatus === "Paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save()

      res.status(200).json(checkout)
    } else {
      res.status(400).json({message: "Invalid Payment status"})
    }

  } catch (error) {
   console.error(error);
   res.status(500).json({message: "Server Error"});
   
  }

})

// @route POST / api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confimration
// @access Private 
router.post('/:id/finalize', protect, async(req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if(!checkout) {
      return res.status(404).json({message: "Checkout not found"});
    }
    if(checkout.isPaid && !checkout.isFinalized) {
      // Create final order based on the checkout details 

      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails, 
      });

      // Mark the checkout as finalized 
      checkout.isFinalized = true;
      checkout.finalizedAt  = Date.now();
      await checkout.save()

      await Cart.findOneAndDelete({user: checkout.user});
      res.status(201).json(finalOrder)

    } else if (checkout.isFinalized) {
   res.status(400).json({message: "Checkout already finalized"})
    } else {
      res.status(400).json({message: "Checkout is not paid"})
    }


  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
})


export default router