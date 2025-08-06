const fs = require('fs');
const path = require('path');
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

// Convert file path to base64 (Node.js version)
function fileToBase64(filePath) {
  return new Promise((resolve, reject) => {
    try {
      // Read the file from filesystem
      const fileBuffer = fs.readFileSync(filePath);
      
      // Get file extension to determine mime type
      const ext = path.extname(filePath).toLowerCase();
      let mimeType;
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          mimeType = 'image/jpeg';
          break;
        case '.png':
          mimeType = 'image/png';
          break;
        case '.gif':
          mimeType = 'image/gif';
          break;
        case '.webp':
          mimeType = 'image/webp';
          break;
        default:
          mimeType = 'image/jpeg'; // default fallback
      }
      
      // Convert to base64 with proper data URL format
      const base64 = fileBuffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64}`;
      
      resolve(dataUrl);
    } catch (error) {
      reject(error);
    }
  });
}

function isBase64Image(str) {
  return /^data:image\/[a-zA-Z]+;base64,/.test(str);
}

// Upload a single image to Cloudinary
async function uploadImage(fileInput, folderName = "") {
  try {
    let base64;
    
    // Check if input is already base64
    if (typeof fileInput === 'string' && isBase64Image(fileInput)) {
      base64 = fileInput;
    } 
    // If it's a file path (string), convert to base64
    else if (typeof fileInput === 'string') {
      // Check if file exists
      if (!fs.existsSync(fileInput)) {
        throw new Error(`File not found: ${fileInput}`);
      }
      base64 = await fileToBase64(fileInput);
    }
    // If it's a file object from multer, use the path
    else if (fileInput && fileInput.path) {
      // Check if file exists
      if (!fs.existsSync(fileInput.path)) {
        throw new Error(`File not found: ${fileInput.path}`);
      }
      base64 = await fileToBase64(fileInput.path);
    }
    else {
      throw new Error('Invalid file input provided');
    }

    console.log("Uploading image to Cloudinary...");
    
    const result = await cloudinary.uploader.upload(base64, {
      folder: folderName,
      resource_type: "image"
    });

    console.log("------upload image success--------");
    console.log("Cloudinary URL:", result.url);
    
    // Clean up the temporary file after successful upload
    if (fileInput && fileInput.path && fs.existsSync(fileInput.path)) {
      try {
        fs.unlinkSync(fileInput.path);
        console.log("Temporary file cleaned up:", fileInput.path);
      } catch (cleanupError) {
        console.warn("Could not clean up temporary file:", cleanupError.message);
      }
    }
    
    return {
      url: result.url,
      alt: result.original_filename || "recipe-img"
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    
    // Clean up the temporary file even if upload failed
    if (fileInput && fileInput.path && fs.existsSync(fileInput.path)) {
      try {
        fs.unlinkSync(fileInput.path);
        console.log("Temporary file cleaned up after error:", fileInput.path);
      } catch (cleanupError) {
        console.warn("Could not clean up temporary file after error:", cleanupError.message);
      }
    }
    
    throw new Error("Failed to upload image: " + error.message);
  }
}

// Alternative method: Upload directly using file path (more efficient)
async function uploadImageDirect(fileInput, folderName = "") {
  try {
    let filePath;
    
    // Get file path
    if (typeof fileInput === 'string') {
      filePath = fileInput;
    } else if (fileInput && fileInput.path) {
      filePath = fileInput.path;
    } else {
      throw new Error('Invalid file input provided');
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log("Uploading image directly to Cloudinary...");
    
    // Upload directly from file path (more efficient than base64)
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      resource_type: "image"
    });

    console.log("------upload image success--------");
    console.log("Cloudinary URL:", result.url);
    
    // Clean up the temporary file after successful upload
    try {
      fs.unlinkSync(filePath);
      console.log("Temporary file cleaned up:", filePath);
    } catch (cleanupError) {
      console.warn("Could not clean up temporary file:", cleanupError.message);
    }
    
    return {
      url: result.url,
      alt: result.original_filename || "recipe-img"
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    
    // Clean up the temporary file even if upload failed
    let filePath = typeof fileInput === 'string' ? fileInput : fileInput?.path;
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log("Temporary file cleaned up after error:", filePath);
      } catch (cleanupError) {
        console.warn("Could not clean up temporary file after error:", cleanupError.message);
      }
    }
    
    throw new Error("Failed to upload image: " + error.message);
  }
}

module.exports = {
  connect,
  uploadImage,
  uploadImageDirect
};