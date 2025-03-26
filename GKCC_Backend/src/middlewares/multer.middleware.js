import multer from "multer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Define __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

// Set up Multer storage with dynamic destination based on field name (tag)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get the field name (which will act as the tag)
    const fieldName = file.fieldname; // This will be 'mainimage', 'sideimage', etc.

    let destinationPath = "";
    if (fieldName === "signature") {
      destinationPath = path.join(__dirname, "../../Public/AllImages/signature");
    } else if (fieldName === "logo") {
      destinationPath = path.join(__dirname, "../../Public/AllImages/logo");
    } else if (fieldName === "albumphotos") {
      destinationPath = path.join(__dirname, "../../Public/AllImages/albumphotos");
    } else {
      destinationPath = path.join(__dirname, "../../Public/default");
    }

    // Set the destination path dynamically
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using timestamp or UUID
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extname}`);
  },
});

// Set up Multer with size limit and file filter (optional)
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});


export {upload}
// Example route with multiple fields
