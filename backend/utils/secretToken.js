import jwt from "jsonwebtoken";

export default function createSecretToken(id) {
  return jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: "7d" });
}
