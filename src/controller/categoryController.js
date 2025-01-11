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
