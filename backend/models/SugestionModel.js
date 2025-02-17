import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    suggestion: { type: String, required: true },
  },
  { timestamps: true }
);

const SuggestionModel = mongoose.model("Suggestion", suggestionSchema);

export default SuggestionModel;
