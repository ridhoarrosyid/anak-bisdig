import mongoose from "mongoose";
import ProductModel from "../models/ProductModel.js";
import ProjectModel from "../models/ProjectModel.js";

const getOldData = async (req, res, next) => {
  const model = req.baseUrl.split("/")[2];
  const productId = req.params.id;
  if (!mongoose.isValidObjectId(productId))
    return res.status(404).send({ message: "invalid id format" });
  try {
    let oldData;
    if (model === "products") {
      oldData = await ProductModel.findById(productId);
    } else if (model === "projects") {
      oldData = await ProjectModel.findById(productId);
    }

    res.locals.oldData = oldData;
    req.oldData = oldData;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ success: false, message: "server error" });
  }
};

export default getOldData;
