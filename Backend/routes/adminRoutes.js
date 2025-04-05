import express from 'express'
import User from '../models/User.js'
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

// @route GET / api/admin/users
// @desc Get all users (admin only)
// @access Private/Admin



router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users)

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"})
    
  }
})

// @route POST /api/admin/users
// @desc add a new user (admin only)
// @access Private/Admin
router.post('/', protect, admin, async(req, res) => {

  const {name, email, password, role} = req.body;

  try {
    let user = await User.findOne({email});
    if(user) {
      return res.status(400).json({message: "User already exists"})
    }
    user = new User({
      name, 
      email,
      password,
      role: role || "customer",
    })
    await user.save()
    res.status(201).json({message:"user create successfully ", user})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Server Error"})
  }
})

// @route PUT /api/admin/users/:id
// @desc Update user info (admin ony) = Name , email and role 
// @access Private /Admin
router.put("/:id",protect,admin, async(req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.role !== undefined) {
        user.role = req.body.role;  // Update role only if it is provided
      }
    }
    const updatedUser = await user.save();

    res.json({message: "user updated successfully", user: updatedUser})

  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Server Error"})
  }
})

// @rout DELETe /api/amdin/user/:id
// @Desc Delete a user
// @access Private/Admin
router.delete('/:id',protect, admin, async(req, res) => {
   
  try {
    const user = await User.findById(req.params.id);
    if(user) {
      await user.deleteOne();
      res.json({message: "User delete successfully"});
    } else {
      res.status(404).json({message:"User not Found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Server Error"})
  }
})

export default router;