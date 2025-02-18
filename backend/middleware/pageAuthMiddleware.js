import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

const pageAuthMiddleware = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ status: false, message: "there's no token" });
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ success: false, message: "token invalid" });
    } else {
      const user = await UserModel.findById(data.id);
      if (user) {
        return res.json({ success: true, email: user.email });
      } else {
        return res.json({ success: false, message: "user not found" });
      }
    }
  });
};

export default pageAuthMiddleware;
