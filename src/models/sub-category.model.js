import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    img: {
      type: String,
    },
    categoryName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String,
      lowercase: true,
      default:"",
    },
    taxApplicability: {
      type: Boolean,
      required: true,
    },
    taxNumber: {
      type: Number,
    },
    taxType: {
      type: String,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
      },
    },
  },
  {
    timestamps: true,
  }
);

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
