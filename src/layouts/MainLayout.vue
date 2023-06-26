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
              <q-badge v-if="cart.length" color="orange" rounded floating>{{
                cart.length
              }}</q-badge>
            </router-link>
          </div>
          <div class="text-h q-ml-lg">
            Profile <q-icon name="account_circle" size="md" />
          </div>
        </q-toolbar>
      </q-header>
    </div>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :isAdmin="isUserAdmin"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          @add-to-cart="handleAddToCart"
          @delete-item="handleDeleteItem"
          :cart="cart"
          :items="items"
        />
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useRoute } from "vue-router";
import {
  getItems,
  findItemIndex,
  findCartItemIndex,
} from "../composables/items";
import EssentialLink from "components/EssentialLink.vue";

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
  // {
  //   title: "Discord Chat Channel",
  //   caption: "chat.quasar.dev",
  //   icon: "chat",
  //   link: "https://chat.quasar.dev",
  // },
  // {
  //   title: "Forum",
  //   caption: "forum.quasar.dev",
  //   icon: "record_voice_over",
  //   link: "https://forum.quasar.dev",
  // },
  // {
  //   title: "Twitter",
  //   caption: "@quasarframework",
  //   icon: "rss_feed",
  //   link: "https://twitter.quasar.dev",
  // },
  // {
  //   title: "Facebook",
  //   caption: "@QuasarFramework",
  //   icon: "public",
  //   link: "https://facebook.quasar.dev",
  // },
  // {
  //   title: "Quasar Awesome",
  //   caption: "Community Quasar projects",
  //   icon: "favorite",
  //   link: "https://awesome.quasar.dev",
  // },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const route = useRoute();
    const isUserAdmin = ref(false);
    const cart = ref([]);
    const items = ref([]);

    const routeName = computed(() => {
      return route.name;
    });
    const showHeader = computed(() => {
      return routeName.value !== "login" && routeName.value !== "register";
    });

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
    };
    const handleDeleteItem = (payload) => {
      const delItem = cart.value.splice(payload, 1)[0];

      // To update inventory
      const itemIndex = findItemIndex(items.value, delItem.product.id);
      const item = items.value[itemIndex];
      item.qty += delItem.orderQuantity;
    };
    async function fetchData() {
      items.value = await getItems();
    }
    fetchData();

    return {
      essentialLinks: linksList,
      cart,
      items,
      leftDrawerOpen,
      isUserAdmin,
      showHeader,
      handleAddToCart,
      handleDeleteItem,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
