import { Schema, model } from "mongoose";

const CategoriesSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Category title is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      lowercase: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
    },
  },
  { timestamps: true }
);

export default model("categories", CategoriesSchema);
