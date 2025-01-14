import CategoryModel from "../models/categoryModel.js"

export async function listCategory(req, res){
  try {
    const categories = await CategoryModel.find()
    res.render("pages/categories/list",{
      title: "Categories",
      categories: categories
    })
  } catch (error) {
    console.log(error);
    res.send("Hien tai khong co san pham nao!")
  }
}

export async function createCategory(req, res){
  const {code, name, image} = req.body
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

export async function renderPageCreateCategory(req, res){
  res.render("pages/categories/create",{
    title: "Create Categories",
  })
}
