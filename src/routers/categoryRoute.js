import express from "express";
import { listCategory, createCategory, renderPageCreateCategory } from "../controller/categoryController.js";
const router = express.Router();

router.get("/", listCategory)
router.get("/create", renderPageCreateCategory)//render ra from create
router.post("/create", createCategory)

export default router;