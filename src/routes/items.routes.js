import { Router } from "express";
import {
  createItems,
  editItemById,
  getItem,
} from "../controllers/items.controller.js";

const router = Router();

// router.route("/create-category").post(createCategory);

router.route("/create-item").post(createItems);

router.route("/:itemId").patch(editItemById);

router.route("/").get(getItem);

export default router;
