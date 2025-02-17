import express from "express";
import ProductModel from "../models/ProductModel.js";
import mongoose from "mongoose";
import apiAuthMiddleware from "../middleware/apiAuthMiddleware.js";

const productRoute = express.Router();

productRoute.get("/", apiAuthMiddleware, async (req, res) => {
  try {
    const products = await ProductModel.find();
    if (products.length === 0)
      return res.status(404).send({ message: "product not found" });
    res.status(200).send({ data: products });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: "server error" });
  }
});

productRoute.get("/get3", async (req, res) => {
  try {
    const products = await ProductModel.aggregate([
      { $sample: { size: 3 } },
      { $project: { description: 0 } },
    ]);
    if (products.length === 0)
      return res.status(404).send({ message: "tidak ada product" });

    res.status(200).send({
      data: products,
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ message: "server error" });
  }
});

productRoute.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send({ message: "id tidak valid" });
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({ data: product });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ message: "server error" });
  }
});

productRoute.post("/", async (req, res) => {
  const field = Object.values(req.body);

  field.map((e) => {
    if (!e) {
      return res.status(400).send({ message: `${e} cant be empty` });
    }
  });
  const newProduct = new ProductModel({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
  });
  try {
    await newProduct.save();
    res.status(200).send({ data: newProduct });
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: "server error" });
  }
});

productRoute.patch("/:id/", async (req, res) => {
  const { name, description, image, price } = req.body;
  const productId = req.params.id;

  if (!mongoose.isValidObjectId(productId))
    return res.status(404).send({ message: "invalid id format" });

  if (!name || !description || !image || !price)
    return res.status(400).send({
      message: "name, description, image, and price fields are required",
    });
  try {
    const updateProduct = await ProductModel.findByIdAndUpdate(
      productId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
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
});

productRoute.delete("/:id/", async (req, res) => {
  const productId = req.params.id;
  if (!mongoose.isValidObjectId(productId))
    return res.status(400).send({ message: "format id tidak valid" });

  try {
    const deleteProduct = await ProductModel.findByIdAndDelete(productId);
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
