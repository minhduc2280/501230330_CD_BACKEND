import OrderModel from "../models/orderModel.js"
import { ObjectId } from "mongodb";


const sortObject = [
  { code: "name_ASC", name: "tên tăng dần" },
  { code: "name_DESC", name: "tên giảm dần" },
  { code: "code_ASC", name: "mã tăng dần" },
  { code: "code_DESC", name: "mã giảm dần" }
]

export async function listOrder(req, res) {
  const search = req.query?.search
  const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize) : 5
  const page = !!req.query.page ? parseInt(req.query.page) : 1
  const skip = (page - 1) * pageSize
  let sort = !!req.query.sort ? req.query.sort : "null"
  let filters = {
    deletedAt: null,
  };

  if(search && search.length > 0){
    filters.orderNo = search
  }

  let sortQuery = { createdAt: -1 };
  if (sort) {
    const sortArray = sort.split('_');
    sortQuery = { [sortArray[0]]: sortArray[1] === "ASC" ? 1 : -1 };
  }

  if (search && search.length > 0) {
    filters.searchString = { $regex: removeVietnameseAccents(search), $options: "i" };
  }

  try {
    const countOrders = await OrderModel.countDocuments(filters)
    const orders = await OrderModel.find(filters).skip(skip).limit(pageSize).sort(sortQuery)

    res.render("pages/orders/list", {
      title: "Orders",
      orders: orders,
      countPagination: Math.ceil(countOrders / pageSize),
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

export async function createOrder(req, res) {
  const { discount, status, orderItems } = req.body
  let subTotal = 0, total = 0, numericalOrder = 1;

  const lastOrder = await OrderModel.findOne().sort({ createdAt: -1 });
  
  if(lastOrder && !isNaN(lastOrder.numericalOrder)){
    numericalOrder = lastOrder.numericalOrder + 1
  }
  
  const orderNo = "order - " + numericalOrder

  if(orderItems.length > 0){
    for(let orderItem of orderItems){
      subTotal += (orderItem.quantity * orderItem.price)
    }
  }
  total = subTotal * (100 - discount) / 100

  try {
    const rs = await OrderModel.create({
      orderNo: orderNo,
      discount: discount,
      total: total,
      status: status,
      orderItems: orderItems,
      numericalOrder: numericalOrder,
      createdAt: new Date()
    })
    res.send(rs)
  } catch (error) {
    console.log("err", error);
    
  }
}



// export async function renderPageCreateCategory(req, res) {
//   res.render("pages/categories/form", {
//     title: "Create Categories",
//     mode: "Create",
//     category: {},
//     err: {}
//   })
// }

// export async function updateCategory(req, res) {
//   const { ...data } = req.body
//   const {id} = req.params
//   try {
//     const category = await CategoryModel.findOne({ code: data.code, deletedAt: null })
//     if (category) {
//       throw ("code")
//     }
//     await CategoryModel.updateOne(
//       { _id: new ObjectId(id) },
//       {
//         ...data,
//         updateAt: new Date()
//       })
//     res.redirect("/categories")
//   } catch (error) {
//     let err = {}
//     if (error === "code") {
//       err.code = "Ma san pham nay da ton tai"
//     }
//     if (error.name === "ValidationError") {
//       Object.keys(error.errors).forEach(key => {
//         err[key] = error.errors[key].message
//       })
//     }
//     console.log("err", err);

//     res.render("pages/categories/form" , {
//       title: "Update Categories",
//       mode: "Update",
//       category: { ...data, _id: id },
//       err
//     })
//   }
// }

// export async function renderPageUpdateCategory(req, res) {
//   try {
//     const { id } = req.params
//     const category = await CategoryModel.findOne({ _id: new ObjectId(id), deletedAt: null })
//     if (category) {
//       res.render("pages/categories/form", {
//         title: "Create Categories",
//         mode: "Update",
//         category: category,
//         err: {}
//       })
//     }
//     else {
//       res.send("hien khong co san pham nao phu hop!")
//     }
//   } catch (error) {
//     res.send("trang web nay khong ton tai!")
//   }
// }

// export async function deleteCategory(req, res) {
//   const { id } = req.body
//   try {
//     await CategoryModel.updateOne(
//       { _id: new ObjectId(id) },
//       {
//         deletedAt: new Date()
//       })
//     res.redirect("/categories")
//   } catch (error) {
//     console.log(error);
//     res.send("Xoa san pham khong thanh cong!")
//   }
// }

// export async function renderPageDeleteCategory(req, res) {
//   try {
//     const { id } = req.params
//     const category = await CategoryModel.findOne({ _id: new ObjectId(id), deletedAt: null })
//     if (category) {
//       res.render("pages/categories/form", {
//         title: "Delete Categories",
//         mode: "Delete",
//         category: category,
//         err: {}
//       })
//     }
//     else {
//       res.send("hien khong co san pham nao phu hop!")
//     }
//   } catch (error) {
//     console.log(error);
//     res.send("trang web nay khong ton tai")
//   }
// }

