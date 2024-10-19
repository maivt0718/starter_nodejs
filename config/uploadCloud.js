import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer, { diskStorage } from "multer";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatar", // define folder on cloudinary
    format: async (req, file) => {
      // validate the image type
      const validImgFormat = ["png", "jpeg", "gif", "webp", "heic"];

      // get the type of file
      // abc.jpg
      // mimetype: 'image/jpeg'
      const fileFormat = file.mimetype.split("/")[1];

      // validate the correction of file type
      if (validImgFormat.includes(fileFormat)) {
        return fileFormat;
      }
      return ".png";
    },
    transformation: [{ height: 200, width: 200, quality: "auto:good" }],
    public_id: (req, file) => file.originalname.split(".")[0], // define the name
  },
});

export const uploadCloud = multer({ storage });
