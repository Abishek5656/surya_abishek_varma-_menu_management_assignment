import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/sub-category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createCategory = asyncHandler(async (req, res) => {

  const { name, description, taxApplicability, taxNumber, taxType } = req.body;

  // Check if the category already exists
  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new ApiError(400, "Category already exists");
  }

  // Create the category
  const category = await Category.create({
    name,
    description,
    taxApplicability,
    taxNumber,
    taxType,
  });

  // Check if the category was successfully created
  if (!category) {
    throw new ApiError(400, "Failed to create category");
  }

  // Return the response
  return res.status(201).json(new ApiResponse(201, category));
});

// Get category
const getCategories = asyncHandler(async (req, res) => {

  const categories = await Category.find({}).sort({ name: 1 });

  if (!categories || categories.length === 0) {
    throw new ApiError(400, "No categories found");
  }

  return res.status(200).json(new ApiResponse(200, categories));
});

// Get category by ID
const getCategoryById = asyncHandler(async (req, res) => {

  const { categoryId } = req.params;

  // Validate categoryId presence
  if (!categoryId) {
    throw new ApiError(400, "categoryId  is required");
  }

  // Find category by ID
  const category = await Category.findById(categoryId);

  // If category not found, throw an error
  if (!category) {
    throw new ApiError(400, "Category not found");
  }

  // Return category in JSON response
  return res.status(200).json(new ApiResponse(200, category));
});

// Edit category by ID

const editCategoryById = asyncHandler(async (req, res) => {

  const { categoryId } = req.params;

  const { name, description } = req.body;

  // Validate categoryId presence
  if (!categoryId) {
    throw new ApiError(400, "categoryId  is required");
  }

  // Update category in the database
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      $set: {
        name,
        description,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedCategory) {
    throw new ApiError(400, "Error while updating category");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "updated the data successfully")
    );
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  const { categoryId } = req.params;

  if (!categoryId) {
    throw new ApiError(400, "categoryId is required");
  }

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on image");
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Cover image updated successfully"));
});

const getSubcategoriesUnderCategories = asyncHandler(async (req, res) => {

  // Aggregation pipeline
  // $group method -> Groups the data based on the categoryName field. This means documents with the same categoryName will be grouped together.
  // $push method -> Within each group, creates an array (subCategoryName) containing the values of the name field for each document in the group
  // $project method -> Projects the grouped data into a new format, removing the _id field and renaming the fields to category and subCategory
  //$sort method ->  Sorts the resulting documents based on the category field in ascending order
  const listOfsubCategories = await SubCategory.aggregate([
    {
      $group: {
        _id: { category: "$categoryName" },
        subCategoryName: { $push: "$name" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        subCategory: "$subCategoryName",
      },
    },
    {
      $sort: {
        category: 1,
      },
    },
  ]);

  if (!listOfsubCategories || listOfsubCategories.length === 0) {
    throw new ApiError(400, "No subcategories found");
  }

  return res.status(200).json(new ApiResponse(200, listOfsubCategories));
});

export {
  createCategory,
  getCategories,
  getCategoryById,
  editCategoryById,
  updateCoverImage,
  getSubcategoriesUnderCategories,
};
