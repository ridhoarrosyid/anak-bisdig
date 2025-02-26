import multer from "multer";
import dotenv from "dotenv";
import ProductModel from "../models/ProductModel.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./backend/files/photo");
  },
  filename: (req, file, cb) => {
    const original = file.originalname.replaceAll(" ", "_");
    cb(null, `${req.user._id}-${Date.now()}-photo-${original}`);
  },
});

const fileFilter = async (req, file, cb) => {
  if (req.method === "PATCH") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const oldPath = path.join(__dirname, "../files/photo", file.originalname);

    if (fs.existsSync(oldPath)) {
      cb(null, false);
      return;
    }
  }

  const mimeTypes = ["image/jpeg", "image/png"];
  if (mimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("File type not Allowed. Only JPEG and PNG are accepted."),
      false
    );
  }
};

const limits = { fileSize: 20 * 1024 * 1024 };
const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
