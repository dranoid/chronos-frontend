import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";

async function getUsers() {
  try {
    const res = await api.get("http://localhost:3000/users", {
      // headers: {
      //   Authorization: `Bearer ${authToken}`,
      // },
    });

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
