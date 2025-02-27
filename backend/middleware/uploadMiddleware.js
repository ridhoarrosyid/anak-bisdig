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
    const fileUser = req.oldData.user_id.toString();
    const userVerified = req.user._id.toString();

    if (fileUser !== userVerified) {
      console.log(fileUser, userVerified);
      cb(null, false);
      return;
    }

    if (fs.existsSync(oldPath)) {
      console.log(2);
      cb(null, false);
      return;
    }
  }

  const mimeTypes = ["image/jpeg", "image/png"];
  if (mimeTypes.includes(file.mimetype)) {
    console.log(3);
    cb(null, true);
    return;
  } else {
    console.log(4);
    cb(
      new Error("File type not Allowed. Only JPEG and PNG are accepted."),
      false
    );
    return;
  }
};

const limits = { fileSize: 20 * 1024 * 1024 };
const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
