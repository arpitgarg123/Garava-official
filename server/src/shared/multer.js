// src/shared/multer.js
import multer from "multer";

const MB = 1024 * 1024;

const memoryStorage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * MB, 
    files: 10,    
  },
  fileFilter: (req, file, cb) => {
    // accept images only
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, png and webp images are allowed"));
    }
  },
});

