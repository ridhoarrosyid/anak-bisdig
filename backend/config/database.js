import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const connect = await mongoose.connect(process.env.DATABASE_URI);
    console.log(`MongoDB Connected ${connect.connection.host}`);
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}
