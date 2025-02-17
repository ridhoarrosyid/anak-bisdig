import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { AllowAPI } from "../utils/constanta.js";

const apiAuthMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.json({ status: false });
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ success: false });
    }
    try {
      const user = await UserModel.findById(data.id);
      if (!user) {
        return res.json({ success: false });
      }

      const allow = AllowAPI.find(
        (el) =>
          el.baseUrl === req.baseUrl &&
          el.method === req.method &&
          el.role.includes(user.role)
      );
      if (!allow) return res.send({ success: false, step: "allow if", allow });
      next();
    } catch (err) {
      console.log(err);
      return res.send({ message: "server error" }).status(500);
    }
  });
};

export default apiAuthMiddleware;
