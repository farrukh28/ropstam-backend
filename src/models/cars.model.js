import { Schema, model } from "mongoose";

const CarsSchema = new Schema(
  {
    color: {
      type: String,
      required: [true, "Color is required"],
    },
    make: {
      type: String,
      required: [true, "Make is required"],
    },
    model: {
      type: String,
      required: [true, "Model is required"],
    },
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: [true, "Category is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
    },
  },
  { timestamps: true }
);

export default model("cars", CarsSchema);
