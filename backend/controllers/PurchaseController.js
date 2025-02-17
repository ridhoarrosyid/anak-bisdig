import express from "express";
import PurchaseModel from "../models/PurchaseModel.js";

const purchaseRouter = express.Router();

purchaseRouter.get("/", async (req, res) => {
  const skip = parseInt(req.query.skip);
  const limit = parseInt(req.query.limit);
  try {
    const purchases =
      !skip || !limit
        ? await PurchaseModel.find()
        : await PurchaseModel.find().skip(skip).limit(limit);
    if (purchases.length === 0)
      return res.status(404).send({ message: "purchases not found" });
    res.status(200).send({ data: purchases });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: "server error" });
  }
});

purchaseRouter.post("/", async (req, res) => {
  const { product_id, buyer_id } = req.body;
  if (!product_id || !buyer_id)
    return res
      .status(400)
      .send({ message: "product_id and buyer_id required" });
  const newPurchase = new PurchaseModel({ product_id, buyer_id });
  try {
    await newPurchase.save();
    res.status(201).send({ data: newPurchase });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "server error" });
  }
});

export default purchaseRouter;
