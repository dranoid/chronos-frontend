import axios from "axios";

const getItems = async () => {
  try {
    const res = await axios.get("http://localhost:3000/products");
    const items = res.data;
    return items;
  } catch (e) {
    console.log(e);
  }
};

export default getItems;
