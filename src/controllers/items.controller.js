import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Item } from "../models/item.model.js";
import { SubCategory } from "../models/sub-category.model.js";

const createItems = asyncHandler(async (req, res) => {
  const { name, description, baseAmount, subCategory } = req.body;

  const category = await SubCategory.findOne({ name: subCategory });

  const existingItem = await Item.findOne({ name });

  if (existingItem) {
    throw new ApiError(400, "Already Item Created");
  }

  const createItem = await Item.create({
    name,
    description,
    baseAmount,
    subCategory,
  });

  if (!createItem) {
    throw new ApiError(400, "Error while creating");
  }

  if (createItem) {
    category.items.push(createItem?._id);
    await category.save();
  }

  return res.status(200).json(new ApiResponse(200, { Item: createItem }));
});

const editItemById = asyncHandler(async (req, res) => {
  
  const { itemId } = req.params;

  const { name, description, baseAmount } = req.body;

  if (!itemId) {
    throw new ApiError(400, "ItemId is required");
  }

  const updatedItem = await Item.findByIdAndUpdate(
    itemId,
    {
      $set: {
        name,
        description,
        baseAmount,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedItem || updatedItem.length === 0) {
    throw new ApiError("Error while updating Item");
  }

  return res.status(200).json(new ApiResponse(200, updatedItem));
});

const getItem = asyncHandler(async (req, res) => {

  //itemname gets from the url query
  const { itemname } = req.query;

  //it fetchs the single item base on the name
  const item = await Item.findOne({ name: itemname });

  if (!item) {
    throw new ApiError(400, "Search item not found");
  }

  return res.status(200).json(new ApiResponse(200, item));
});

export { createItems, editItemById, getItem };
