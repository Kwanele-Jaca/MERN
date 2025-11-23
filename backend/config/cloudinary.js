import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';
    
    return {
      folder: "projects",
      resource_type: isPDF ? "image" : "auto", // Use 'image' for PDFs
      format: isPDF ? 'pdf' : undefined, // Specify format for PDFs
      use_filename: true,
      unique_filename: false,
      filename_override: file.originalname.replace(/\s+/g, "_"),
    };
  },
});



const upload = multer({ storage });


export { cloudinary, upload };
