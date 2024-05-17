import { Router } from 'express';

import { createSubCategory, getSubCategories,getSubCategoryById, editSubCategoryById
    
 } from "../controllers/subCategory.controller.js";

import { upload } from "../middlewares/multer.middleware.js";


const router = Router();


router.route("/create-subcategory").post(createSubCategory);

router.route("/subcategories").get(getSubCategories);

// router.route("/all-category").get(getCategory);

router.route("/:subcategoryId").get(getSubCategoryById).patch(editSubCategoryById);


export default router