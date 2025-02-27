import express from "express";
import apiAuthMiddleware from "../middleware/apiAuthMiddleware.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const fileRouter = express.Router();

fileRouter.get("/image/:filename", apiAuthMiddleware, async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const { filename } = req.params;
  const fileUser = filename.split("-")[0];
  const userVerified = res.locals.user._id.toString();
  if (fileUser !== userVerified)
    return res
      .status(400)
      .send({ success: false, message: "user not allow to access image" });
  const filePath = path.join(__dirname, "../files/photo", filename);
  if (!fs.existsSync(filePath))
    return res.status(404).send({ success: false, message: "image not found" });

  return res.sendFile(filePath);
});

export default fileRouter;
