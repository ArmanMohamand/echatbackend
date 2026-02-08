import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CloudINARY_CLOUD_NAME,
  api_key: process.env.CloudINARY_API_KEY,
  api_secret: process.env.CloudINARY_API_SECRET,
});
export default cloudinary;
