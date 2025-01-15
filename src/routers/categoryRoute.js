import express from "express";
import { 
  listCategory, 
  createCategory, 
  renderPageCreateCategory, 
  updateCategory,
  renderPageUpdateCategory, 
  deleteCategory,
  renderPageDeleteCategory } from "../controller/categoryController.js";
const router = express.Router();

router.get("/", listCategory)

router.get("/create", renderPageCreateCategory)//render ra from create
router.post("/create", createCategory)

router.get("/update/:id", renderPageUpdateCategory)//render ra from create
router.post("/update", updateCategory)

router.get("/delete/:id", renderPageDeleteCategory)//render ra from create
router.post("/delete", deleteCategory)

export default router;