import express from "express";
import UserModel from "../models/UserModel.js";
import createSecretToken from "../utils/secretToken.js";
import bcrypt from "bcrypt";

const authRouter = express.Router();

authRouter.post("/signup/", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if ((!first_name, !email, !password))
      return res.status(400).send({
        message: "first_name, email, and password field are required",
      });

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.send({ message: "user already exist" });
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password,
    });
    const token = createSecretToken(newUser._id);
    res.cookie("token", token, { httpOnly: false, withCredentials: true });
    res
      .status(201)
      .send({ message: "user signed successfully", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if ((!email, !password))
      return res
        .status(400)
        .send({ message: "email and password are required" });
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).send({ message: "email not found" });
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return res.status(400).send({ message: "password incorect" });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
    });
    res.status(201).send({ message: "user logged successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: "server error" });
  }
});

export default authRouter;
