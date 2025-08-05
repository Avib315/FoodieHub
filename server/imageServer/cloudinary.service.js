const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
async function connect() {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    console.log(`\x1b[42m [cloudinary.service.js] connected to images db \x1b[0m`);
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isBase64Image(str) {
  return /^data:image\/[a-zA-Z]+;base64,/.test(str);
}
// Upload a single image to Cloudinary
async function uploadImage(fileBase64, folderName = "") {
  try {
    if (!isBase64Image(fileBase64)) {
      throw new Error("Provided input is not a base64-encoded image");
    }

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: folderName
    });

    console.log("------upload image--------");
 
    return {
      src: result.url,
      alt: result.original_filename || "item-img"
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}




module.exports = { connect, uploadImage };
