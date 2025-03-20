// import app from "./app.js";
// import cloudinary from "cloudinary";

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// app.listen(process.env.PORT, () => {
//   console.log(`Server listening on port ${process.env.PORT}`);
// });


import app from "./app.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";

// Load environment variables
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Log Cloudinary config to verify it’s loading correctly
console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "*****" : "NOT SET",
});

// ✅ Test Cloudinary upload (optional)
cloudinary.v2.uploader.upload("path-to-image.jpg", (error, result) => {
  if (error) {
    console.log("Cloudinary Upload Error:", error);
  } else {
    console.log("Cloudinary Upload Success:", result);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
