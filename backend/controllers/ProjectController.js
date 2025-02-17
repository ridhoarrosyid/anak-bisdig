import express from "express";
import ProjectModel from "../models/ProjectModel.js";
import mongoose from "mongoose";

const projectRoute = express.Router();

projectRoute.get("/", async (req, res) => {
  try {
    const projects = await ProjectModel.find();
    if (projects.length === 0)
      return res.status(404).send({ message: "project not found" });
    res.status(200).send({ data: projects });
  } catch (err) {}
});

projectRoute.get("/get3", async (req, res) => {
  try {
    const projects = await ProjectModel.aggregate([
      { $sample: { size: 3 } },
      { $project: { description: 0 } },
    ]);
    if (projects.length === 0)
      return res.status(404).send({ message: "data not found" });
    res.status(200).send({ data: { projects } });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ message: "internal server error" });
  }
});

projectRoute.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send({ message: "invalid id format" });
  try {
    const project = await ProjectModel.findById(req.params.id);
    if (!project) return res.status(404).send({ message: "object not found" });
    res.status(200).send({ data: project });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ message: "server error" });
  }
});

projectRoute.post("/", async (req, res) => {
  const { name, description, image, link } = req.body;
  if (!name || !description || !image || !link) {
    return res.status(400).send({
      message: "name, description, image, and link field are required",
    });
  }
  const newProject = new ProjectModel({ name, description, image, link });
  try {
    newProject.save();
    res.status(201).send({ data: newProject });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ message: "server error" });
  }
});

projectRoute.patch("/:id/", async (req, res) => {
  const { name, description, image, link } = res.body;
  if ((!name || !description, !image, !link))
    return res
      .status(400)
      .send({ message: "name, description, image, and link are required" });
  if (mongoose.isValidObjectId(req.params.id))
    return res.status(400).send({ message: "id is not valid" });

  try {
    const updateProject = ProjectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true, new: true }
    );
    if (!updateProject) {
      res.status(404).send({ message: "id not found" });
    }
    res.status(200).send({ data: updateProject });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ message: "server error" });
  }
});

projectRoute.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send({ message: "id is not valid" });
  try {
    const deleteProject = await ProjectModel.findByIdAndDelete(req.params.id);
    if (!deleteProject)
      return res.status(404).send({ message: "project was not found" });
    res
      .status(200)
      .send({ message: "preject deleted", dataDeleted: deleteProject });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "internal server error" });
  }
});

export default projectRoute;
