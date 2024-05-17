import mongoose, { Schema } from "mongoose";


const itemSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
      },
      img: {
        type: String,
      },
      description: {
        type: String,
        // required: true,
        lowercase: true,
      },
      taxApplicability: {
        type: Boolean,
        // required: true,
      },
      taxNumber: {
        type: Number,
      },
      baseAmount: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
      },
      totalAmount: {
        type: Number,
      },
      // category: {
      //   type: Schema.Types.ObjectId,
      //   ref: "Category",
      // },
      subCategory: {
        type: String,
      },
      // subCategory: {
      //   type: Schema.Types.ObjectId,
      //   ref: "SubCategory",
      // },
    },
    {
      toJSON: {
       transform(doc, ret) {
         delete ret.createdAt;
         delete ret.updatedAt;
       }
      },
       },
    {
      timestamps: true,
    }
  );

export const Item = mongoose.model("Item", itemSchema);
