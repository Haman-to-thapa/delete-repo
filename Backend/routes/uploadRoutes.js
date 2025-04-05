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
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Enable HTTPS
})

// Multer setup with file size limit and file type validation
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.post('/', upload.single("image"), async(req, res) => {
  try {
    if(!req.file) {
      return res.status(400).json({message: "No file uploaded"})
    }

    // Optimize image before upload
    const streamUpload = (filebuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
          },
          (error, result) => {
            if(result) {
              resolve(result)
            } else {
              reject(error)
            }
          }
        );
        
        streamifier.createReadStream(filebuffer).pipe(stream);
      })
    }

    const result = await streamUpload(req.file.buffer);
    
    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading image'
    });
  }
});

export default router;

