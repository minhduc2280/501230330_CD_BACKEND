import { ObjectId } from "mongodb";


export function prepareOrderItems({
  itemSelect, quantity, itemPrice, itemColor, itemSize
}){
  return itemSelect.map((productId, index) => {
    return{
      productId: new ObjectId(productId),
      quantity: quantity[index],
      price: itemPrice[index],
      color: itemColor[index],
      size: itemSize[index],
    }
  })
}