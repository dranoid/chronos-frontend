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
    link: "/login",
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
      user.value = payload;
      $q.localStorage.set("user-details", payload);
    };
    function handleGetItem(payload) {
      items.value = payload;
      $q.localStorage.set("items-details", payload);
    }

    const handleAddToCart = (payload) => {
      // Scaffolding the orderObj
      const orderObj = {
        product: { id: 0, name: "", price: 0 },
        orderQuantity: 0,
      };
      orderObj.orderQuantity = payload.order_qty;
      orderObj.product.id = payload.item.id;
      orderObj.product.name = payload.item.name;
      orderObj.product.price = payload.item.price;

      // To update inventory
      const itemIndex = findItemIndex(items.value, payload.item.id);
      const item = items.value[itemIndex];
      item.qty -= payload.order_qty;

      // To merge duplicates
      const cartItemIndex = findCartItemIndex(cart.value, orderObj.product.id);
      if (cartItemIndex != undefined) {
        const cartItem = cart.value[cartItemIndex];
        cartItem.orderQuantity += orderObj.orderQuantity;
        return;
      }
      cart.value.push(orderObj);
      $q.localStorage.set("cart-details", cart.value);
    };
    const handleDeleteItem = (payload) => {
      const delItem = cart.value.splice(payload, 1)[0];

      // To update inventory
      const itemIndex = findItemIndex(items.value, delItem.product.id);
      const item = items.value[itemIndex];
      item.qty += delItem.orderQuantity;
    };
    function handleEssentialClick(linkObj) {
      if (linkObj.title == "Logout") {
        logOut();
      }
    }
    function logOut() {
      $q.localStorage.remove("access-token");
      $q.localStorage.remove("user-details");
      $q.localStorage.remove("items-details");
      $q.localStorage.remove("cart-details");
      router.push("/login");
      api.get("http://localhost:3000/users/me/logout");
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
    });

    onUpdated(() => {
      console.log("iya yin");
      const token = $q.localStorage.getItem("access-token");
      if (token && isTokenExpired(token)) {
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
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
