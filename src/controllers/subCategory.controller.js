import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/sub-category.model.js";
import { Item } from "../models/item.model.js";

const createSubCategory = asyncHandler(async (req, res) => {

  const { name, description, categoryName } = req.body;

  if (!categoryName) {
    throw new ApiError(400, "categoryname is required");
  }

  const existingCategory = await Category.findOne({ name: categoryName });



  if (!existingCategory) {
    throw new ApiError(400, "Category not found");
  }


  const existingSubCategory = await SubCategory.findOne({name});

  if(existingSubCategory !== null) {
    throw new ApiError(400, "subCategory already exists")
  }

  const subCategory = await SubCategory.create({
    name,
    description,
    categoryName,
    categoryId: existingCategory?._id,
    taxApplicability: existingCategory?.taxApplicability,
    taxNumber: existingCategory?.taxNumber,
  });

  if (!subCategory) {
    throw new ApiError(400, "Error While creating sub-Category");
  }

// If the subCategory is created successfully, we add its ID to the existingCategory's subCategories array
  if (subCategory) {
    existingCategory.subCategories.push(subCategory?._id);
    await existingCategory.save();
  }

  return res.status(201).json(new ApiResponse(201, subCategory, "subCategory created successfully"));
});

const getSubCategories = asyncHandler(async (req, res) => {

//Aggregate 
//$group -> group the data based on the subCategory
//  // $project method -> Projects the grouped data into a new format
  //$sort method ->  Sorts the resulting documents based on the subCategory field in ascending order
  const subCategories = await Item.aggregate([
    {
      $group: {
        _id: { subCategory: '$subCategory' },
        itemsList: { $push: '$name' }
      }
    },
    {
      $project: {
        _id: 0,
        subCategory: '$_id.subCategory',
        itemsList: '$itemsList'
      }
    },
    {
      $sort: {
        subCategory: 1
      }
    }
  ]);
  
  if (subCategories.length === 0) {
    throw new ApiResponse(400, "No subCategoies found");
  }

  return res.status(200).json(new ApiResponse(200, subCategories));
});

//
const getSubCategoryById = asyncHandler(async (req, res) => {

    const { subcategoryId } = req.params;

    //Fetches the subCategory based on its ID
    const subCategory = await SubCategory.findById(subcategoryId);

    if(!subCategory || subCategory.length === 0) {
        throw new ApiError(400, "subCategory Not found ")
    }

    return res.status(200).json(new ApiResponse(200, subCategory, "fetch data successfully "))

})


const editSubCategoryById = asyncHandler(async (req, res) => {

    const { subcategoryId } = req.params;

    const {name, description} = req.body;

    //fetch and update the subCategory by its ID
    // Updating the data using MongoDB's $set method
    //new: true is used to save the data in mongodb
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
        subcategoryId,
        {
          $set: {
            name,
            description
          }
        },
        {
          new: true
        }
      );
      
    if(!updatedSubCategory ||  updatedSubCategory.length === 0) {
        throw new ApiError(400, "Failed to update the subcategory")
    }

    return res.status(200).json(new ApiResponse(200, updatedSubCategory))

})

export { createSubCategory, getSubCategories, getSubCategoryById, editSubCategoryById };
