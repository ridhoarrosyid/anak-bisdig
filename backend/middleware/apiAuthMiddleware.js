import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { AllowAPI } from "../utils/constanta.js";

const apiAuthMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.json({ success: false, messagge: "token not found" });
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ success: false, message: "token invalid" });
    }
    try {
      const user = await UserModel.findById(data.id);
      if (!user) {
        return res.json({ success: false, message: "user not found" });
      }

      const allow = AllowAPI.find(
        (el) =>
          el.baseUrl === req.baseUrl &&
          el.method === req.method &&
          el.role.includes(user.role)
      );
      if (!allow) return res.send({ success: false, message: "not allow" });
      req.user = user;
      res.locals.user = user;
      next();
    } catch (err) {
      console.log(err);
      return res.send({ success: false, message: "server error" }).status(500);
    }
  });
};

export default apiAuthMiddleware;
