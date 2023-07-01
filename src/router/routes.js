const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/ItemsPage.vue"),
        meta: { requiresAuth: true },
      },
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
        path: "/dashboard",
        component: () => import("pages/DashboardPage.vue"),
        name: "dashboard",
        meta: { requiresAuth: true, requiredRoles: ["admin"] },
      },
      {
        path: "/profile",
        component: () => import("pages/ProfilePage.vue"),
        name: "profile",
        meta: { requiresAuth: true },
      },
      {
        path: "/cart",
        component: () => import("pages/CartPage.vue"),
        name: "cart",
        meta: { requiresAuth: true },
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
