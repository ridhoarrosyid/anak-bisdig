import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    suggestion: { type: String, required: true },
  },
  { timestamps: true }
);

const Suggestion = mongoose.Model("Suggestion", suggestionSchema);

export default Suggestion;
