import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    coverImage: {
      type: String,
      default:"",
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
      default: 0,
    },
    taxType: { 
        // type: String,
        // default:"",
        type: [String],
        default: []
     },
    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
  },
  {
 toJSON: {
  transform(doc, ret) {
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.__v;
  }
 },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model("Category", categorySchema);
