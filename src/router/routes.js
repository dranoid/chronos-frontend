const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/ItemsPage.vue") },
      {
        path: "/register",
        component: () => import("pages/SignupPage.vue"),
        name: "register",
      },
      {
        path: "/login",
        component: () => import("pages/LoginPage.vue"),
        name: "login",
      },
      {
        path: "/cart",
        component: () => import("pages/CartPage.vue"),
        name: "cart",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
