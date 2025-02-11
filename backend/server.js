import express from "express";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const uri: string =
//   process.env.MONGODB_URI || "mongodb://localhost:27017/your-app";

// (async () => {
//   try {
//     await mongoose.connect(uri);
//     console.log("Connected to the database");
//   } catch (error) {
//     console.error(error);
//   }
// })();

app.get("/health", (req, res) => {
  console.log(req.headers);
  res.status(200).send("Server is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
