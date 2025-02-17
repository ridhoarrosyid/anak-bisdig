import mongoose from "mongoose";

const purchaseschema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      alias: "user_id",
    },
  },
  {
    timestamps: true,
  }
);

const PurchaseModel = mongoose.model("Purchase", purchaseschema);

export default PurchaseModel;
