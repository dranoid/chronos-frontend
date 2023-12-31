<template>
  <q-layout view="lHh Lpr lFf">
    <div v-if="showHeader">
      <q-header elevated>
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />

          <q-toolbar-title>
            <router-link to="/" style="text-decoration: none; color: white">
              Chronos Store
            </router-link>
          </q-toolbar-title>

          <div class="text-h6" style="position: relative">
            <router-link
              :to="{ name: 'cart' }"
              style="text-decoration: none; color: white"
            >
              Cart <q-icon name="shopping_cart" size="md" />
              <q-badge
                v-if="cart && cart.length"
                color="orange"
                rounded
                floating
                >{{ cart.length }}</q-badge
              >
            </router-link>
          </div>
          <div class="text-h q-ml-lg">
            <router-link
              :to="{ name: 'profile' }"
              style="text-decoration: none; color: white"
            >
              Profile <q-icon name="account_circle" size="md" />
            </router-link>
          </div>
        </q-toolbar>
      </q-header>
    </div>

    <q-drawer v-if="showHeader" v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :isAdmin="isUserAdmin"
          @click="handleEssentialClick(link)"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          @add-to-cart="handleAddToCart"
          @delete-item="handleDeleteItem"
          @login-user="handleLoginUser"
          @get-item="handleGetItem"
          @place-order="handlePlaceOrder"
          :cart="cart"
          :items="items"
          :user="user"
        />
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import jwtDecode from "jwt-decode";
import { useQuasar } from "quasar";
import { defineComponent, ref, computed, onMounted, onUpdated } from "vue";
import { useRoute, useRouter } from "vue-router";
import { findItemIndex, findCartItemIndex } from "../composables/items";
import EssentialLink from "components/EssentialLink.vue";
import { api } from "src/boot/axios";

const linksList = [
  {
    title: "Store",
    caption: "Place an order for your items",
    icon: "store",
    link: "/",
    admin: false,
  },
  {
    title: "Dashboard",
    caption: "Monitor the store",
    icon: "dashboard",
    link: "/dashboard",
    admin: true,
  },
  {
    title: "Logout",
    caption: "Logout of this session",
    icon: "logout",
    // link: "/login",
    admin: false,
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const route = useRoute();
    const router = useRouter();
    const user = ref(null);
    const cart = ref([]);
    const items = ref([]);

    const isUserAdmin = computed(() => {
      if (user.value) {
        return user.value.roles[0] == "admin" ? true : false;
      }
      return false;
    });
    const routeName = computed(() => {
      return route.name;
    });
    const showHeader = computed(() => {
      return routeName.value !== "login" && routeName.value !== "register";
    });

    const handleLoginUser = (payload) => {
      // To update UI to empty the cart
      cart.value = $q.localStorage.getItem("cart-details");
      user.value = payload;
      $q.localStorage.set("user-details", payload);
    };
    function handleGetItem(payload) {
      items.value = payload;
      $q.localStorage.set("items-details", payload);
    }

    const handleAddToCart = (payload) => {
      // cos of refresh itempage getting mounted resets the count since count is not reflecting on db. choos whether instock disappears or not
      // Scaffolding the orderObj
      const orderObj = {
        product: { _id: 0, name: "", price: 0 },
        orderQuantity: 0,
      };
      orderObj.orderQuantity = payload.order_qty;
      orderObj.product._id = payload.item._id;
      orderObj.product.name = payload.item.name;
      orderObj.product.price = payload.item.price;

      // To update inventory
      const itemIndex = findItemIndex(items.value, payload.item._id);
      const item = items.value[itemIndex];
      item.qty -= payload.order_qty;

      // To merge duplicates
      const cartItemIndex = findCartItemIndex(cart.value, orderObj.product._id);
      if (cartItemIndex != undefined) {
        const cartItem = cart.value[cartItemIndex];
        cartItem.orderQuantity += orderObj.orderQuantity;

        // Persist data
        $q.localStorage.set("cart-details", cart.value);
        $q.localStorage.set("items-details", items.value);
        return;
      }
      cart.value.push(orderObj);

      // Persist data
      $q.localStorage.set("cart-details", cart.value);
      $q.localStorage.set("items-details", items.value);
    };
    const handleDeleteItem = (payload) => {
      const delItem = cart.value.splice(payload, 1)[0];

      // To update inventory
      const itemIndex = findItemIndex(items.value, delItem.product._id);
      const item = items.value[itemIndex];
      item.qty += delItem.orderQuantity;

      // Persist data
      $q.localStorage.set("cart-details", cart.value);
      $q.localStorage.set("items-details", items.value);
    };
    function handleEssentialClick(linkObj) {
      if (linkObj.title == "Logout") {
        logOut();
      }
    }
    async function handlePlaceOrder() {
      router.push("/");
      cart.value = [];
      const refreshedUser = await api.get("users/me");
      user.value = refreshedUser.data;
      // Persist data
      $q.localStorage.set("cart-details", cart.value);
      $q.localStorage.set("user-details", refreshedUser.data);
    }
    async function logOut() {
      const res = await api.get("/users/me/logout");
      $q.localStorage.set("access-token", "");
      $q.localStorage.set("user-details", "");
      $q.localStorage.set("items-details", "");
      $q.localStorage.set("cart-details", []);
      router.push("/login");
    }
    function isTokenExpired(token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token has expired
          return true;
        } else {
          // Token is still valid
          return false;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        return true; // Treat token as expired if decoding fails
      }
    }

    onMounted(() => {
      if ($q.localStorage.has("user-details")) {
        user.value = $q.localStorage.getItem("user-details");
      }
      if ($q.localStorage.has("items-details")) {
        items.value = $q.localStorage.getItem("items-details");
      }
      if ($q.localStorage.has("cart-details")) {
        cart.value = $q.localStorage.getItem("cart-details");
      }

      const token = $q.localStorage.getItem("access-token");
      if (
        token &&
        isTokenExpired(token) &&
        route.path != "/login" &&
        route.path != "/register"
      ) {
        // Token has expired, logout
        logOut();
      }
    });

    onUpdated(() => {
      const token = $q.localStorage.getItem("access-token");
      if (
        token &&
        isTokenExpired(token) &&
        route.path != "/login" &&
        route.path != "/register"
      ) {
        // Token has expired, logout
        logOut();
      }
    });

    return {
      essentialLinks: linksList,
      user,
      cart,
      items,
      leftDrawerOpen,
      isUserAdmin,
      showHeader,
      handleLoginUser,
      handleAddToCart,
      handleDeleteItem,
      handleGetItem,
      handleEssentialClick,
      handlePlaceOrder,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
