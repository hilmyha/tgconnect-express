import { CloudinaryStorage, Options } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";
import cloudinary from "../cloudinary.config";

interface CloudinaryParams extends Options {
  folder: string;
  format: (req: any, file: any) => Promise<string> | string;
  public_id: (req: any, file: any) => string;
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cloud-uploads",
    format: async (req, file) => {
      const mimeType = file.mimetype.split("/")[1];
      return mimeType === "jpeg" ||
        mimeType === "png" ||
        mimeType === "jpg" ||
        mimeType === "heic" ||
        mimeType === "heif"
        ? mimeType
        : "jpg";
    },
    public_id: (req, file) => {
      // format timestamp(2024-08-07T00:53:12.263Z) - filename
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      return `${timestamp}-${file.originalname}`;
    },
  } as CloudinaryParams,
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/heic",
      "image/heif",
    ];
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
