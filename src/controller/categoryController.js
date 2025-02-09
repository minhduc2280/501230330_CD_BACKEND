import CategoryModel from "../models/categoryModel.js"
import { ObjectId } from "mongodb";
import { removeVietnameseAccents } from "../common/index.js";
export async function listCategory(req, res) {
  const search = req.query?.search
  const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize):5
  const page = !!req.query.page ? parseInt(req.query.page):1
  const skip = (page-1) * pageSize
  let filters = {
    deletedAt: null,
  };
  if (search && search.length > 0) {
    filters.searchString = { $regex: removeVietnameseAccents(search), $options:"i"};
  }
  try {
    const countCategories = await CategoryModel.countDocuments(filters)
    const categories = await CategoryModel.find(filters).skip(skip).limit(pageSize)
    // res.json(categories)
    res.render("pages/categories/list", {
      title: "Categories",
      categories: categories,
      countPagination: Math.ceil(countCategories/pageSize),
      pageSize,
      page,
    })
  } catch (error) {
    console.log(error);
    res.send("Hien tai khong co san pham nao!")
  }
}

export async function createCategory(req, res) {
  const data = req.body
  try {
    const categories = await CategoryModel.create({
      ...data, createdAt: new Date()
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
  const { id, ...data } = req.body
  try {
    await CategoryModel.updateOne(
      { _id: new ObjectId(id) },
      {
        ...data,
        updateAt: new Date()
      })
    res.redirect("/categories")
  } catch (error) {
    console.log(error);
    res.send("cap nhap san pham khong thanh cong!")
  }
}

export async function renderPageUpdateCategory(req, res) {
  try {
    const { id } = req.params
    const category = await CategoryModel.findOne({ _id: new ObjectId(id), deletedAt:null })
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
  } catch (error) {
    res.send("trang web nay khong ton tai!")
  }
}

export async function deleteCategory(req, res) {
  const { id } = req.body
  try {
    await CategoryModel.updateOne(
      { _id: new ObjectId(id) },
      {
        deletedAt: new Date()
      })
    res.redirect("/categories")
  } catch (error) {
    console.log(error);
    res.send("Xoa san pham khong thanh cong!")
  }
}

export async function renderPageDeleteCategory(req, res) {
  try {
    const { id } = req.params
    const category = await CategoryModel.findOne({ _id: new ObjectId(id), deletedAt:null })
    if (category) {
      res.render("pages/categories/form", {
        title: "Delete Categories",
        mode: "Delete",
        category: category
      })
    }
    else{
      res.send("hien khong co san pham nao phu hop!")
    }
  } catch (error) {
    console.log(error);
    res.send("trang web nay khong ton tai")
  }
}

