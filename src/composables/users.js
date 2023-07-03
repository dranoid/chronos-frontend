import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";

async function getUsers(page = undefined, limit = undefined) {
  try {
    if (page && limit) {
      const res = await api.get(
        `http://localhost:3000/users?page=${page}&limit=${limit}`
      );
      const users = res.data;
      return users;
    }

    const res = await api.get("http://localhost:3000/users");
    const users = res.data;
    return users;
  } catch (e) {
    console.log(e);
  }
}

function getUserRole() {
  const user = LocalStorage.getItem("user-details");
  if (user && user.roles) {
    return user.roles[0];
  }
}

export { getUsers, getUserRole };
