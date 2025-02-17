import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "your firstname is required"],
    },
    last_name: String,
    email: {
      type: String,
      required: [true, "your email required"],
      unique: true,
    },
    password: { type: String, required: [true, "your password required"] },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
