import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/"));
  },
  filename: (req, file, cb) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Format: yyyy-mm-dd-originalname
    const fileName = `${formattedDate}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed"));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB
  },
});

export default upload;
