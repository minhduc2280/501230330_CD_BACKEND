import CategoryModel from "../models/categoryModel.js"
import { ObjectId } from "mongodb";
import { removeVietnameseAccents } from "../common/index.js";

const sortObjectUIs = [
  { code: "name_ASC", name: "tên tăng dần" },
  { code: "name_DESC", name: "tên giảm dần" },
  { code: "code_ASC", name: "mã tăng dần" },
  { code: "code_DESC", name: "mã giảm dần" }
]

export async function listCategory(req, res) {
  const search = req.query?.search
  const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize) : 5
  const page = !!req.query.page ? parseInt(req.query.page) : 1
  const skip = (page - 1) * pageSize
  let sort = !!req.query.sort ? req.query.sort : null, sortObj= {}
  let filters = {
    deletedAt: null,
  };

  if (!sort) {
    sortObj = { createdAt: -1 };
  }else{
    const sortArray = sort.split('_');
    sortObj = { [sortArray[0]]: sortArray[1] === "ASC" ? 1 : -1 };
  }

  if (search && search.length > 0) {
    filters.searchString = { $regex: removeVietnameseAccents(search), $options: "i" };
  }

  try {
    const countCategories = await CategoryModel.countDocuments(filters)
    const categories = await CategoryModel.find(filters).skip(skip).limit(pageSize).sort(sortObj)


    res.render("pages/categories/list", {
      title: "Categories",
      categories: categories,
      countPagination: Math.ceil(countCategories / pageSize),
      pageSize,
      page,
      sort,
      sortObjectUIs
    })
  } catch (error) {
    console.log(error);
    res.send("Hien tai khong co san pham nao!")
  }
}

export async function createCategory(req, res) {
  const data = req.body
  try {
    const category = await CategoryModel.findOne({ code: data.code, deletedAt: null })
    if (category) {
      throw ("code")
    }
    const categories = await CategoryModel.create({
      ...data, createdAt: new Date()
    })
    // res.send("tao san pham thanh cong!")
    res.redirect("/categories")
  } catch (error) {
    let err = {}
    if (error === "code") {
      err.code = "Ma san pham nay da ton tai"
    }
    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach(key => {
        err[key] = error.errors[key].message
      })
    } 
    console.log("err", err);

    res.render("pages/categories/form", {
      title: "Create Categories",
      mode: "Create",
      category: { ...data },
      err
    })
  }
}

export async function renderPageCreateCategory(req, res) {
  res.render("pages/categories/form", {
    title: "Create Categories",
    mode: "Create",
    category: {},
    err: {}
  })
}

export async function updateCategory(req, res) {
  const { ...data } = req.body
  const {id} = req.params
  try {
    const category = await CategoryModel.findOne({ code: data.code, deletedAt: null })
    if (category) {
      throw ("code")
    }
    await CategoryModel.updateOne(
      { _id: new ObjectId(id) },
      {
        ...data,
        updateAt: new Date()
      })
    res.redirect("/categories")
  } catch (error) {
    let err = {}
    if (error === "code") {
      err.code = "Ma san pham nay da ton tai"
    }
    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach(key => {
        err[key] = error.errors[key].message
      })
    }
    console.log("err", err);

    res.render("pages/categories/form" , {
      title: "Update Categories",
      mode: "Update",
      category: { ...data, _id: id },
      err
    })
  }
}

export async function renderPageUpdateCategory(req, res) {
  try {
    const { id } = req.params
    const category = await CategoryModel.findOne({ _id: new ObjectId(id), deletedAt: null })
    if (category) {
      res.render("pages/categories/form", {
        title: "Create Categories",
        mode: "Update",
        category: category,
        err: {}
      })
    }
    else {
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
    const category = await CategoryModel.findOne({ _id: new ObjectId(id), deletedAt: null })
    if (category) {
      res.render("pages/categories/form", {
        title: "Delete Categories",
        mode: "Delete",
        category: category,
        err: {}
      })
    }
    else {
      res.send("hien khong co san pham nao phu hop!")
    }
  } catch (error) {
    console.log(error);
    res.send("trang web nay khong ton tai")
  }
}

