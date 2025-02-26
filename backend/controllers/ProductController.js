import express from "express";
import ProductModel from "../models/ProductModel.js";
import mongoose from "mongoose";
import apiAuthMiddleware from "../middleware/apiAuthMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const productRoute = express.Router();

productRoute.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find().where(publish, true);
    if (products.length === 0)
      return res.status(404).send({ message: "product not found" });
    res.status(200).send({ data: products });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "server error" });
  }
});

productRoute.get("/myproduct", apiAuthMiddleware, async (req, res) => {
  const user = res.locals.user;
  try {
    const products = await ProductModel.find().where("user_id", user._id);
    if (products.length === 0)
      return res.status(404).send({ message: "product not found", data: [] });
    res.status(200).send({ data: products });
  } catch (err) {
    console.log(err.message);
    res.status(200).send({ message: "server error" });
  }
});

productRoute.get("/get3", async (req, res) => {
  try {
    const products = await ProductModel.aggregate([
      { $match: { publish: true } },
      { $sample: { size: 3 } },
      { $project: { name: 1, image: 1, price: 1, _id: 1, description: 1 } },
    ]);
    if (products.length === 0)
      return res
        .status(404)
        .send({ message: "tidak ada product", success: false });

    res.status(200).send({ success: true, data: products });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ success: false, message: "server error" });
  }
});

productRoute.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send({ message: "id tidak valid" });
  try {
    const product = await ProductModel.findById(req.params.id).where(
      publish,
      true
    );
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({ data: product });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ message: "server error" });
  }
});

productRoute.post(
  "/",
  apiAuthMiddleware,
  upload.single("image"),
  async (req, res) => {
    const field = Object.values(req.body);

    field.map((e) => {
      if (!e) {
        return res
          .status(400)
          .send({ success: false, message: `${e} cant be empty` });
      }
    });

    if (!req.file)
      return res
        .status(400)
        .send({ success: false, message: "image is required" });

    const newProduct = new ProductModel({
      user_id: res.locals.user._id,
      name: req.body.name,
      description: req.body.description,
      image: req.file.filename,
      price: req.body.price,
    });
    try {
      await newProduct.save();
      res.status(200).send({ success: true, data: newProduct });
    } catch (e) {
      console.log(e.message);
      res.status(500).send({ success: true, message: "server error" });
    }
  }
);

productRoute.patch(
  "/:id/",
  apiAuthMiddleware,
  upload.single("image"),
  async (req, res) => {
    const { name, description, price } = req.body;
    const newImage = req.file;
    const productId = req.params.id;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    if (!mongoose.isValidObjectId(productId))
      return res.status(404).send({ message: "invalid id format" });

    if (!name || !description || !price)
      return res.status(400).send({
        message: "name, description, and price fields are required",
      });
    try {
      const oldProduct = await ProductModel.findById(productId);
      if (newImage && oldProduct.image) {
        const oldImagePath = path.join(
          __dirname,
          "../files/photo",
          oldProduct.image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      const newData = newImage
        ? { ...req.body, image: newImage.filename }
        : req.body;
      const updateProduct = await ProductModel.findByIdAndUpdate(
        productId,
        newData,
        {
          new: true,
          runValidators: true,
        }
      ).where("user_id", res.locals.user._id);
      if (!updateProduct) {
        return res
          .status(404)
          .send({ message: `Product with id ${productId} was not found` });
      }
      res.status(200).send({ data: { updateProduct } });
    } catch (e) {
      console.log(e.message);
      res.status(500).send({ message: "server error" });
    }
  }
);

productRoute.delete("/:id/", apiAuthMiddleware, async (req, res) => {
  const productId = req.params.id;
  if (!mongoose.isValidObjectId(productId))
    return res.status(400).send({ message: "format id tidak valid" });

  try {
    const deleteProduct = await ProductModel.findByIdAndDelete(productId).where(
      "user_id",
      res.locals.user._id
    );
    if (!deleteProduct) {
      return res
        .status(404)
        .send({ message: `Product with id ${productId} was not found` });
    }
    res.status(200).send({ message: "product deleted" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: "server error" });
  }
});

export default productRoute;
