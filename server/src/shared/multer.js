// src/shared/multer.js
import multer from "multer";

const MB = 1024 * 1024;

const memoryStorage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * MB, 
    files: 10,
    fieldSize: 10 * MB,  // Increase field value size limit for large JSON strings (variants, gallery, etc.)
    fields: 100,        // Allow many fields for complex product data
  },
  fileFilter: (req, file, cb) => {
    // accept images only
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];
    
    // Check mimetype or file extension (some systems don't detect HEIC mimetype correctly)
    const hasValidMimetype = allowed.includes(file.mimetype);
    const hasValidExtension = allowedExtensions.some(ext => 
      file.originalname.toLowerCase().endsWith(ext)
    );
    
    if (hasValidMimetype || hasValidExtension) {
      cb(null, true);
    } else {
      cb(new Error("Only webp, png and webp images are allowed"));
    }
  },
});

// Document upload middleware for blog documents
export const documentUploadMiddleware = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * MB, // 10MB for documents
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/msword", // .doc (legacy)
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are allowed"));
    }
  },
});


