import ProductModel from "../models/productModel.js"
import CategoryModel from "../models/categoryModel.js"
import { ObjectId } from "mongodb";
import { removeVietnameseAccents } from "../common/index.js";

const sortObject = [
  { code: "name_ASC", name: "tên tăng dần" },
  { code: "name_DESC", name: "tên giảm dần" },
  { code: "code_ASC", name: "mã tăng dần" },
  { code: "code_DESC", name: "mã giảm dần" }
]

const sizes = ["S","M","L","XL"]
const colors = ["red","green","yellow","white","black"]

export async function listProduct(req, res) {
  const search = req.query?.search
  const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize) : 5
  const page = !!req.query.page ? parseInt(req.query.page) : 1
  const skip = (page - 1) * pageSize
  let sort = !!req.query.sort ? req.query.sort : "null"
  let filters = {
    deletedAt: null,
  };

  let sortQuery = { createdAt: -1 };
  if (sort) {
    const sortArray = sort.split('_');
    sortQuery = { [sortArray[0]]: sortArray[1] === "ASC" ? 1 : -1 };
  }

  if (search && search.length > 0) {
    filters.searchString = { $regex: removeVietnameseAccents(search), $options: "i" };
  }

  try {
    const countProducts = await ProductModel.countDocuments(filters)
    const products = await ProductModel.find(filters).skip(skip).limit(pageSize).sort(sortQuery).populate("category")
    res.render("pages/products/list", {
      title: "Products",
      products: products,
      countPagination: Math.ceil(countProducts / pageSize),
      pageSize,
      page,
      sort,
      sortObject
    })
  } catch (error) {
    console.log(error);
    res.send("Hien tai khong co san pham nao!")
  }
}

export async function createProduct(req, res) {
  
const sizes = ["S","M","L","XL"]
const colors = ["red","green","yellow","white","black"]
  const categories = await CategoryModel.find({deletedAt: null})
  const {sizes: productSize, colors: productColor, image, ...dataOther} = req.body
  console.log("dataOther",dataOther);
  let sizeArray = [], colorArray = [], imageArray = image
  if(typeof productSize === "string" ){
    sizeArray = [productSize]
  }
  if(typeof productSize === "object" ){
    sizeArray = productSize
  }
  if(typeof productColor === "string" ){
    colorArray = [productColor]
  }
  if(typeof productColor === "object" ){
    colorArray = productColor
  }
  try {
    const product = await ProductModel.findOne({code : dataOther.code, deletedAt: null})
    if (product) {
      throw ("code")
    }
    await ProductModel.create({
      sizes: sizeArray,
      colors: colorArray,
      images: imageArray,
      ...dataOther, createdAt: new Date()
    })
    res.redirect("/products")
  } catch (error) {
    console.log("err", error);
    let err = {}
    if (error === "code") {
      err.code = "Ma san pham nay da ton tai"
    }
    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach(key => {
        err[key] = error.errors[key].message
      })
    } 
    

    res.render("pages/products/form", {
      title: "Create Products",
      mode: "Create",
      product: {
        sizes: sizeArray,
        colors: colorArray, 
        images: imageArray,
        ...dataOther
      },
        sizes: sizes,
        colors: colors,
        categories:categories,
        err
    })
  }
}

export async function renderPageCreateProduct(req, res) {
  const categories = await CategoryModel.find({deletedAt: null})
  res.render("pages/products/form", {
    title: "Create Products",
    mode: "Create",
    product: {},
    err: {},
    sizes: sizes,
    colors: colors,
    categories:categories
  })
}

export async function updateProduct(req, res) {
  const { ...data } = req.body
  const {id} = req.params
  const { sizes: productSize, colors: productColor } = req.body;
  let sizeArray = [], colorArray = []
  if(typeof productSize === "string" ){
    sizeArray = [productSize]
  }
  if(typeof productSize === "object" ){
    sizeArray = productSize
  }
  if(typeof productColor === "string" ){
    colorArray = [productColor]
  }
  if(typeof productColor === "object" ){
    colorArray = productColor
  }
  try {
    const product = await ProductModel.findOne({ code: data.code, _id: new ObjectId(id) , deletedAt: null });
    if (product) {
      throw ("code")
    }
    await ProductModel.updateOne(
      { _id: new ObjectId(id) },
      {
        ...data,
        sizes: sizeArray,
        colors: colorArray,
        updateAt: new Date()
      })
    res.redirect("/products")
  } catch (error) {
    let err = {}
    if (error === "code") {
      err.code = "Mã sản phẩm này đã tồn tại"
    }
    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach(key => {
        err[key] = error.errors[key].message
      })
    }
    console.log("err", err);
    
    const product = await ProductModel.findOne({ _id: new ObjectId(id), deletedAt: null });
    const categories = await CategoryModel.find({ deletedAt: null });
    res.render("pages/products/form" , {
      title: "Update Products",
      mode: "Update",
      product: product,
      category: { ...data, _id: id },
      sizes: sizes,
      colors: colors,
      categories: categories,
      err
    })
  }
}

export async function renderPageUpdateProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await ProductModel.findOne({ _id: new ObjectId(id), deletedAt: null });

    const categories = await CategoryModel.find({ deletedAt: null });
    if(product){
      console.log("product",product)
      res.render("pages/products/form", {
        title: "Cập nhật sản phẩm",
        mode: "Update",
        product: product,
        sizes: sizes,
        colors: colors,
        categories: categories,
        err: {}
      });
    } else {
      res.send("Hiện không có sản phẩm nào phù hợp")
    }
  } catch (error) {
    console.error("Lỗi khi render trang cập nhật sản phẩm:", error);
    res.send("Đã xảy ra lỗi khi tải trang!");
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.body
  try {
    await ProductModel.updateOne(
      { _id: new ObjectId(id) },
      {
        deletedAt: new Date()
      })
    res.redirect("/products")
  } catch (error) {
    console.log(error);
    res.send("Xóa sản phẩm không thành công!")
  }
}

export async function renderPageDeleteProduct(req, res) {
  try {
    const { id } = req.params
    const product = await ProductModel.findOne({ _id: new ObjectId(id), deletedAt: null })
    const categories = await CategoryModel.find({ deletedAt: null });
    if (product) {
      res.render("pages/products/form", {
        title: "Delete Products",
        mode: "Delete",
        product: product,
        sizes:sizes,
        colors:colors,
        categories: categories,
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

