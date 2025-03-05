import OrderModel from "../models/orderModel.js"
import ProductModel from "../models/productModel.js"
import {prepareOrderItems} from "../utils/order.js"

import { ObjectId } from "mongodb";


const sortObjectUIs = [
  { code: "name_ASC", name: "tên tăng dần" },
  { code: "name_DESC", name: "tên giảm dần" },
  { code: "code_ASC", name: "mã tăng dần" },
  { code: "code_DESC", name: "mã giảm dần" }
]

const sizes = ["S","M","L","XL"]
const colors = ["red","green","yellow","white","black"]

export async function listOrder(req, res) {
  const search = req.query?.search
  const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize) : 5
  const page = !!req.query.page ? parseInt(req.query.page) : 1
  const skip = (page - 1) * pageSize
  let sort = !!req.query.sort ? req.query.sort : null, sortObj= {}
  let filters = {
    deletedAt: null,
  };

  if(search && search.length > 0){
    filters.orderNo = search
  }

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
    const countOrders = await OrderModel.countDocuments(filters)
    const orders = await OrderModel.find(filters).populate("orderItems.product", "name code").skip(skip).limit(pageSize).sort(sortObj).lean({ virtuals: true })

    // res.send(orders)
    res.render("pages/orders/list", {
      title: "Orders",
      orders: orders,
      countPagination: Math.ceil(countOrders / pageSize),
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

export async function createOrder(req, res) {
  const { discount, orderItems, billingAddress } = req.body
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
      status: "created",
      orderItems: orderItems,
      numericalOrder: numericalOrder,
      billingAddress: billingAddress,
      createdAt: new Date()
    })
    res.send(rs)
  } catch (error) {
    console.log("err", error);
    
  }
}

export async function simulatorCreateOrder(req, res) {
  const { discount, itemSelect, quantity, itemColor,itemSize, itemPrice, billingName, billingEmail, 
    billingPhoneNumber, billingAddress: address, billingDistrict, billingCity} = req.body
  let subTotal = 0, total = 0, numericalOrder = 1;

  const lastOrder = await OrderModel.findOne().sort({ createdAt: -1 });
  
  if(lastOrder && !isNaN(lastOrder.numericalOrder)){
    numericalOrder = lastOrder.numericalOrder + 1
  }
  
  const orderNo = "order - " + numericalOrder


  const billingAddress = {
    name: billingName,
    email: billingEmail,
    phoneNumber: billingPhoneNumber,
    address: address,
    district: billingDistrict,
    city: billingCity,
  }

  const orderItems = prepareOrderItems({
    itemSelect: itemSelect, 
    quantity: quantity, 
    itemPrice: itemPrice, 
    itemColor: itemColor, 
    itemSize: itemSize
  })

  if(orderItems.length > 0){
    for(let orderItem of orderItems){
      subTotal += (orderItem.quantity * orderItem.price)
    }
  }
  total = subTotal * (100 - discount) / 100

  try {
    const rs = await OrderModel.create({
      orderNo: orderNo,
      discount: parseFloat(discount),
      total: total,
      status: "created",
      orderItems: orderItems,
      numericalOrder: numericalOrder,
      billingAddress: billingAddress,
      createdAt: new Date()
    })
    res.redirect("/orders")
  } catch (error) {
    console.log("err", error);
    
  }
}

export async function renderPageSimulateCreateOrder(req, res) {
  const products = await ProductModel.find({deletedAt: null}, "code name price sizes colors")
  res.render("pages/orders/form", {
    title: "Create Orders",
    mode: "Create",
    order: {},
    products:products,
    err: {}
  })
}

export async function updateStatusDeliveringOrder(req, res) {
  const { orderId } = req.body
  const currentOrder = await OrderModel.findOne({ _id: new ObjectId(orderId) }
  )
  try {
    // console.log(rs);
    if(currentOrder){
      const rs = await OrderModel.updateOne(
        { _id: new ObjectId(orderId) },
        {
          status: "delivering",
          updateAt: new Date()
        })
        res.send({success: true})
    }else{
      res.send({
        success: false,
        message:"Không tồn tại order này"
      })
    }
  } catch (error) {
    console.log("err", error);
    res.send({
      success: false,
      message:"Thay đổi trạng thái không thành công: " + currentOrder.orderNo
    })
  }
}
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

