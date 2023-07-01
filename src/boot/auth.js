import { LocalStorage } from "quasar";
import { getUserRole } from "../composables/users";

export default async ({ router }) => {
  router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isAuthenticated = LocalStorage.getItem("access-token"); // Check if the token exists in local storage
    const requiredRoles = to.meta.requiredRoles;
    const userRole = getUserRole();

    if (requiresAuth && !isAuthenticated) {
      // User is not authenticated, redirect to login page
      next("/login");
    } else if (
      requiresAuth &&
      requiredRoles &&
      !requiredRoles.includes(userRole)
    ) {
      next("/");
    } else {
      // User is authenticated or the route doesn't require authentication
      next();
    }
  });
};
