import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({ name, email, password });
    await user.save();

    // Create jwt payload

    const payload = { user: { id: user._id, role: user.role } };

    //  sign and return the token along iwt user data
    const secretKey = process.env.JWT_SECRET?.trim();

    jwt.sign(payload, secretKey, { expiresIn: "40h" }, (err, token) => {
      if (err) throw err;

      // send the uer and token in responese
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// @route Post/ api/user/login
//@desc Auteticate user
// @acces Public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter both email and password" });
  }
  try {
    let user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid Email try again" });
    }
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(400).json({message: "Wrong Password"})
    }

    const payload = { user: { _id: user._id, role: user.role } };
    const secretKey = process.env.JWT_SECRET.trim();

    jwt.sign(payload, secretKey, { expiresIn: "40h" }, async (err, token) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" }); 
      }

      res.status(201).json({
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    });
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});

// @route Get/ api/user/profile
// @desc Get logged-in users profile (protected route)
// @access Private
router.get("/profile", protect, async (req, res) => {
  res.json(req.user)
});




export default router;
