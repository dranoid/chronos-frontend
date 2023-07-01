import { api } from "src/boot/axios";

const getItems = async () => {
  try {
    console.log("items");
    const res = await api.get("http://localhost:3000/products");
    const items = res.data;
    return items;
  } catch (e) {
    console.log(e);
  }
};

function findItemIndex(itemArr, payloadItemId) {
  let index = undefined;
  itemArr.forEach((item, ind) => {
    if (item.id == payloadItemId) {
      index = ind;
    }
  });
  return index;
}

function findCartItemIndex(cart, payloadItemId) {
  let index = undefined;
  cart.forEach((cartItem, ind) => {
    if (cartItem.product.id == payloadItemId) {
      index = ind;
    }
  });
  return index;
}

export { findItemIndex, getItems, findCartItemIndex };
