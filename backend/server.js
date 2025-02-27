import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import productRoute from "./controllers/ProductController.js";
import projectRoute from "./controllers/ProjectController.js";
import suggestionRoute from "./controllers/SuggenstionController.js";
import purchaseRouter from "./controllers/PurchaseController.js";
import authRouter from "./controllers/AuthController.js";
import cookieParser from "cookie-parser";
import pageAuthMiddleware from "./middleware/pageAuthMiddleware.js";
import fileRouter from "./controllers/FileController.js";
import getOldData from "./middleware/getOldDataMiddleware.js";

dotenv.config();

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use();

app.use("/api/products", productRoute);
app.use("/api/projects", projectRoute);
app.use("/api/suggestion", suggestionRoute);
app.use("/api/purchases", purchaseRouter);
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);
app.get("/pageauth", pageAuthMiddleware);
app.get("/getoldata/halo/kenapa", async (req, res) => {
  res.send(req.originalUrl);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});
