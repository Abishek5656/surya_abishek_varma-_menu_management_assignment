import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  editCategoryById,
  updateCoverImage,
  getSubcategoriesUnderCategories,
} from "../controllers/category.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/subcategories").get(getSubcategoriesUnderCategories);

router.route("/create-category").post(createCategory);

router.route("/all-category").get(getCategories);

router.route("/:categoryId").get(getCategoryById).patch(editCategoryById);

router
  .route("/:categoryId/cover-image")
  .patch(upload.single("coverImage"), updateCoverImage);



export default router;
