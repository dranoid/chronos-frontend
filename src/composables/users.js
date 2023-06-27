import axios from "axios";

async function getUsers() {
  try {
    const res = await axios.get("http://localhost:3000/users");
    const users = res.data;
    return users;
  } catch (e) {
    console.log(e);
  }
}

export { getUsers };
