import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

const storage = new GridFsStorage({
  url: process.env.DATABASE_URI,
  file: (req, file) => {
    return {
      bucketName: "photos",
      fileName: `${Date.now()}-photo-${file.originalname}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const mimeTypes = ["image/jpeg", "image/png"];
  if (mimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("File type not Allowed. Only JPEG and PNG are accepted.", false)
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter,
});

export default upload;
