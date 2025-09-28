import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        addedAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);


// Index is already created by unique: true constraint above

export default mongoose.model("Wishlist", wishlistSchema);
