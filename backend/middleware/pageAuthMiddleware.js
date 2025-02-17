import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.json({ status: false });
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ success: false });
    } else {
      const user = UserModel.findById(data.id);
      if (user) {
        next();
        return res.json({ status: true, user: user.email });
      } else {
        return res.json({ success: false });
      }
    }
  });
};

export default authMiddleware;
