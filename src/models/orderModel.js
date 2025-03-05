import mongoose from "mongoose";
const {Schema} = mongoose;

const orderItemSchema = new Schema({
  productId: Schema.Types.ObjectId,
  quantity: Number,
  price: Number,
  color:{
    type:String,
    enum: ["red","green","yellow","white","black"]
  },
  size:{
    type:String,
    enum: ["S","M","L","XL"]
  },
},{
  versionKey:false,
});
const billingAddressSchema = new Schema({
  name: String,
  email: String,
  phoneNumber: Number,
  address: String,
  district: String,
  city: String,

},{
  versionKey:false,
  _id:false,
});

const orderSchema = new Schema({
  orderNo: String,
  status:{
    type: String,
    enum:["created","completed","cancelled","delivering"]
  },
  orderItems: {
    type: [orderItemSchema],
    required:[true, "Bắt buộc phải có sản phẩm trong đơn hàng"]
  },
  billingAddress: {
    type: billingAddressSchema,
  },
  total: Number,
  discount: {
    type: Number,
  },
  numericalOrder: Number,
  createdAt:Date,
  updatedAt:Date,
  deletedAt:Date,
},{
  versionKey:false,
  collection:"orders",
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
})

orderItemSchema.virtual("product", {
  ref: "Product" , 
  localField: "productId",
  foreignField: "_id",
  justOne: true
})

orderItemSchema.virtual("priceFormatString").get(function(){  
  return this.price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND"
  })
})

orderItemSchema.virtual("totalFormatString").get(function(){  
  return this.total.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND"
  })
})

const OrderModel = mongoose.model("Order", orderSchema)
export default OrderModel  