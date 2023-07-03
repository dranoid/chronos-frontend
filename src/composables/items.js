import { api } from "src/boot/axios";

async function getItems(page = undefined, limit = undefined) {
  try {
    if (page && limit) {
      const res = await api.get(
        `http://localhost:3000/products?page=${page}&limit=${limit}`
      );
      const items = res.data;
      console.log(
        items,
        "requst",
        `http://localhost:3000/products?page=${page}&limit=${limit}`,
        "link!!"
      );
      return items;
    }

    const res = await api.get("http://localhost:3000/products");
    const items = res.data;
    return items;
  } catch (e) {
    console.log(e);
  }
}

function findItemIndex(itemArr, payloadItemId) {
  let index = undefined;
  itemArr.forEach((item, ind) => {
    if (item._id == payloadItemId) {
      index = ind;
    }
  });
  return index;
}

function findCartItemIndex(cart, payloadItemId) {
  let index = undefined;
  cart.forEach((cartItem, ind) => {
    if (cartItem.product._id == payloadItemId) {
      index = ind;
    }
  });
  return index;
}

export { findItemIndex, getItems, findCartItemIndex };
