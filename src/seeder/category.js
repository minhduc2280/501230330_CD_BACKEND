import CategoryModel from "../models/categoryModel.js"
const data = [
  {
    code: "A_001",
    name: "Ao",
    image: "cat-1.jpg",
    searchString: "ao nu",
    createdAt: new Date(),
  },
  {
    code: "MA_001",
    name: "May anh",
    image: "cat-2.jpg",
    searchString: "may anh",
    createdAt: new Date(),
  },
  {     
    code: "G_001",
    name: "Giay ",
    image: "cat-3.jpg",
    searchString: "giay nam",
    createdAt: new Date(),
  },
  {
    code: "MP_001",
    name: "My pham",
    image: "cat-4.jpg",
    searchString: "my pham",
    createdAt: new Date(),
  },
]
export default async function categorySeeder() {
  await CategoryModel.deleteMany()
  await CategoryModel.insertMany(data)
}