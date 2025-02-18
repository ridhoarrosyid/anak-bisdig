import express from "express";
import SuggestionModel from "../models/SugestionModel.js";
import mongoose from "mongoose";
import apiAuthMiddleware from "../middleware/apiAuthMiddleware.js";

const suggestionRoute = express.Router();

suggestionRoute.get("/", async (req, res) => {
  const skip = parseInt(req.query.skip);
  const limit = parseInt(req.query.limit);
  try {
    const suggestion = await SuggestionModel.find()
      .skip(skip)
      .limit(limit)
      .exec();

    if (suggestion.length === 0)
      return res.status(404).send({ message: "product not found" });
    res.status(200).send({ data: suggestion });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: "server error" });
  }
});

suggestionRoute.post("/", apiAuthMiddleware, async (req, res) => {
  const { suggestion } = req.body;
  if (!suggestion)
    return res.status(400).send({ message: "suggestion field required" });
  const newSuggestion = new SuggestionModel({
    user_id: res.locals.user._id,
    suggestion,
  });
  try {
    newSuggestion.save();
    res.status(201).send({ data: newSuggestion });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "server error" });
  }
});

suggestionRoute.patch("/:id", apiAuthMiddleware, async (req, res) => {
  const { suggestion } = req.body;
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).send({ message: "id is not valid" });
  if (!suggestion)
    return res.status(400).send({ message: "field suggestion diperlukan" });
  try {
    const editSuggestion = await SuggestionModel.findByIdAndUpdate(
      id,
      req.body,
      { runValidators: true, new: true }
    ).where(user_id, res.locals.user._id);
    if (!editSuggestion)
      return res.status(404).send({ message: "id not found" });
    res.status(200).send({ data: editSuggestion });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "server error" });
  }
});

suggestionRoute.delete("/:id", apiAuthMiddleware, async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).send({ message: "id is not valid" });
  try {
    const deleteSuggestion = await SuggestionModel.findByIdAndDelete(id).where(
      user_id,
      res.locals.user._id
    );
    if (!deleteSuggestion)
      return res
        .status(404)
        .send({ message: `suggestion with id: ${id} was not found` });
    res.status(200).send({ message: "product deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "internal server error" });
  }
});

export default suggestionRoute;
