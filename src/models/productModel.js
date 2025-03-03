import mongoose from "mongoose";
const {Schema} = mongoose;

const productSchema = new Schema({
  code: {
    type: String,
    required: [true, "Bắt buộc phải nhập mã loại sản phẩm"],

  },
  name:{
    required: [true, "Bắt buộc phải nhập tên loại sản phẩm"],
    type: String,
  },
  price:{
    required: [true, "Bắt buộc phải nhập giá sản phẩm"],
    type: Number,
  },
  searchString:{
    required: [true, "Bắt buộc phải nhập chuỗi tìm kiếm"],
    type: String,
  },
  sizes:{
    type:[String],
    enum: ["S","M","L","XL"]
  },
  colors:{
    type:[String],
    enum: ["red","green","yellow","white","black"]
  },
  active: String,
  description: String,
  information: String,
  images: [String],
  categoryId: Schema.Types.ObjectId,
  createdAt: Date,
  updateAt: Date,
  deletedAt: Date

},{
  versionKey:false,
  collection:"products",
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
})

productSchema.virtual("category", {
  ref: "Category" , 
  localField: "categoryId",
  foreignField: "_id",
  justOne: true
})
productSchema.virtual("categoryIdString").get(function(){
  return !!this.categoryId ? this.categoryId .toString() : ""
})
productSchema.virtual("create").get(function(){
  return new Date().getTime() - new Date(this.createdAt).getTime()
})

const ProductModel = mongoose.model("Product", productSchema)
export default ProductModel