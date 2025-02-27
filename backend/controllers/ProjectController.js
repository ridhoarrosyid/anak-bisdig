import express from "express";
import ProjectModel from "../models/ProjectModel.js";
import mongoose from "mongoose";
import apiAuthMiddleware from "../middleware/apiAuthMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import getOldData from "../middleware/getOldDataMiddleware.js";

const projectRoute = express.Router();

projectRoute.get("/", async (req, res) => {
  try {
    const projects = await ProjectModel.find().where("publish", true);
    if (projects.length === 0)
      return res.status(404).send({ message: "project not found" });
    res.status(200).send({ data: projects });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "server error" });
  }
});

projectRoute.get("/myprojects", apiAuthMiddleware, async (req, res) => {
  const user = res.locals.user;
  try {
    const projects = await ProjectModel.find().where("user_id", user._id);
    if (products.length === 0)
      return res
        .status(404)
        .send({ success: false, message: "products not found", data: [] });
    res.status(200).send({ success: true, data: products });
  } catch (err) {}
});

projectRoute.get("/get3", async (req, res) => {
  try {
    const projects = await ProjectModel.aggregate([
      { $match: { publish: true } },
      { $sample: { size: 3 } },
      { $project: { _id: 1, name: 1, description: 1, image: 1, link: 1 } },
    ]);
    if (projects.length === 0)
      return res
        .status(404)
        .send({ success: false, message: "data not found" });
    res.status(200).send({ success: true, data: { projects } });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ success: false, message: "internal server error" });
  }
});

projectRoute.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res
      .status(400)
      .send({ success: false, message: "invalid id format" });
  try {
    const project = await ProjectModel.findById(req.params.id).where(
      "publish",
      true
    );
    if (!project)
      return res
        .status(404)
        .send({ success: false, message: "object not found" });
    res.status(200).send({ success: true, data: project });
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ success: false, message: "server error" });
  }
});

projectRoute.post(
  "/",
  apiAuthMiddleware,
  upload.single("image"),
  async (req, res) => {
    const { name, description, link } = req.body;
    if (!name || !description || !link) {
      return res.status(400).send({
        message: "name, description, and link field are required",
      });
    }
    if (!req.file)
      return res
        .status(400)
        .send({ success: false, message: "image is required" });

    const newProject = new ProjectModel({
      name,
      description,
      image: req.file.filename,
      link,
    });
    try {
      newProject.save();
      res.status(201).send({ success: true, data: newProject });
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ success: false, message: "server error" });
    }
  }
);

projectRoute.patch(
  "/:id/",
  apiAuthMiddleware,
  upload.single("image"),
  async (req, res) => {
    const { name, description, link } = res.body;
    const newImage = req.file;
    const projectId = req.params.id;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const fileUser = res.locals.oldData.user_id.toString();
    const userVerified = res.locals.user._id.toString();

    if ((!name || !description, !link))
      return res.status(400).send({
        success: false,
        message: "name, description, and link are required",
      });
    if (mongoose.isValidObjectId(projectId))
      return res
        .status(400)
        .send({ success: false, message: "id is not valid" });

    try {
      const oldProject = res.locals.oldData;
      if (newImage && oldProject.image) {
        const oldImagePath = path.join(
          __dirname,
          "../files/photo",
          oldProject.image
        );
        if (fs.existsSync(oldImagePath) && fileUser === userVerified) {
          fs.unlink(oldImagePath, (err) => {
            console.log(err);
          });
        }
      }
      const newData = newImage
        ? { name, description, link, image: newImage.filename }
        : { name, description, price };
      const updateProject = ProjectModel.findByIdAndUpdate(projectId, newData, {
        runValidators: true,
        new: true,
      }).where("user_id", res.locals.user._id);

      if (!updateProject) {
        res.status(404).send({ message: `${name} was not found` });
      }
      res.status(200).send({ success: true, data: updateProject });
    } catch (e) {
      console.error(e.message);
      res.status(500).send({ success: false, message: "server error" });
    }
  }
);

projectRoute.delete("/:id", apiAuthMiddleware, getOldData, async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectId = req.params.id;
  const userVerified = res.locals.user._id.toString();
  const fileUser = res.locals.oldData.user_id.toString();

  if (!mongoose.isValidObjectId(projectId))
    return res.status(400).send({ success: false, message: "id is not valid" });
  try {
    const oldProject = res.locals.oldData;
    if (oldProject.image) {
      const oldImagePath = path.join(
        __dirname,
        "../files/photo",
        oldProject.image
      );
      if (fs.existsSync(oldImagePath) && fileUser === userVerified) {
        fs.unlink(oldImagePath);
      }
    }

    const deleteProject = await ProjectModel.findByIdAndDelete(projectId).where(
      "user_id",
      res.locals.user._id
    );
    if (!deleteProject)
      return res
        .status(404)
        .send({ success: false, message: "project was not found" });
    res
      .status(200)
      .send({ message: "preject deleted", dataDeleted: deleteProject });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "internal server error" });
  }
});

export default projectRoute;
