import { boot } from "quasar/wrappers";
import axios from "axios";
import { LocalStorage } from "quasar";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
let api;
export default boot(({ app }) => {
  api = axios.create({ baseURL: "http://localhost:3000" });

  api.interceptors.request.use((config) => {
    const token = LocalStorage.getItem("access-token");
    console.log(token, "booooot");
    if (token) {
      console.log(token, "ooo");
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  // api.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     const { $router } = app;
  //     const { status } = error.response;

  //     if (status === 401) {
  //       console.log("weee");
  //       $router.push("/login");
  //     } else if (status === 403) {
  //       $router.push("/");
  //     }

  //     return Promise.reject(error);
  //   }
  // );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const { status } = error.response;
      const router = app.config.globalProperties.$router;

      if (status === 401) {
        console.log("weee");
        router.push("/login");
      } else if (status === 403) {
        router.push("/");
      }

      return Promise.reject(error);
    }
  );

  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
