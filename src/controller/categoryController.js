import CategoryModel from "../models/categoryModel.js"
import { ObjectId } from "mongodb";

export async function listCategory(req, res) {
  try {
    const categories = await CategoryModel.find()
    res.render("pages/categories/list", {
      title: "Categories",
      categories: categories
    })
  } catch (error) {
    console.log(error);
    res.send("Hien tai khong co san pham nao!")
  }
}

export async function createCategory(req, res) {
  const { code, name, image } = req.body
  try {
    const categories = await CategoryModel.create({
      code, name, image, createdAt: new Date()
    })
    // res.send("tao san pham thanh cong!")
    res.redirect("/categories")
  } catch (error) {
    console.log(error);
    res.send("tao san pham khong thanh cong!")
  }
}

export async function renderPageCreateCategory(req, res) {
  res.render("pages/categories/form", {
    title: "Create Categories",
    mode: "Create",
    category: {}
  })
}

export async function updateCategory(req, res) {
  const { code, name, image, id } = req.body
  try {
    await CategoryModel.updateOne(
      { _id: new ObjectId(id) },
      {
        code,
        name,
        image,
        updateAt: new Date()
      })
    res.redirect("/categories")
  } catch (error) {
    console.log(error);
    res.send("cap nhap san pham khong thanh cong!")
  }
}

export async function renderPageUpdateCategory(req, res) {
  const { id } = req.params
  const category = await CategoryModel.findOne({ _id: new ObjectId(id) })
  if (category) {
    res.render("pages/categories/form", {
      title: "Create Categories",
      mode: "Update",
      category: category
    })
  }
  else{
    res.send("hien khong co san pham nao phu hop!")
  }
}
