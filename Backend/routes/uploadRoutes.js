import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier'

import dotenv from 'dotenv';
dotenv.config();

const router = express.Router()


// Cloudinary Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
})


//Multer setup using memory storagae
const storage = multer.memoryStorage();
const upload = multer({ storage });



router.post('/', upload.single("image"), async(req, res) => {
  try {
    if(!req.file) {
      return res.status(400).json({message: "No file Uploaded "})
    }

    // function to handle to stream upload to cloudinary
    
    const streamUpload = (filebuffer) => {
      return new Promise((reslove, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if(result) {
            reslove(result)
          } else {
            reject(error)
          }
        });
        
        // use streamifier to convert file buffer to a stram
        streamifier.createReadStream(filebuffer).pipe(stream);
      })
    }

       // Call the streamUpload  function
       const result = await streamUpload(req.file.buffer);

       // Respond with teh uploaded image URL
       res.json({imageUrl: result.secure_url});
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Server Error"})
  }
})

export default router;

