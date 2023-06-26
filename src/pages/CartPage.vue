<template>
  <q-page padding>
    <!-- content -->
    <div class="text-h4 q-my-md">Cart</div>
    <div v-if="cart.length == 0">
      <p class="text-italic">
        Nothing in your cart yet. Check out the
        <router-link to="/" class="text-primary">store.</router-link>
      </p>
    </div>
    <div v-else class="flex column items-center">
      <q-card style="width: 80%">
        <q-card-section>
          <div class="text-center text-h5">Order</div>
        </q-card-section>

        <q-card-section class="row justify-between">
          <span>Name</span>
          <span>Price</span>
          <span>Quantity</span>
          <q-btn flat disabled color="white">x</q-btn>
        </q-card-section>

        <q-separator inset />

        <CartItem
          v-for="(cartItem, index) in cart"
          :cartItem="cartItem"
          :key="index"
          @delete-item="$emit('delete-item', index)"
        ></CartItem>

        <q-card-section class="row justify-between">
          <span class="text-h6">TOTAL</span>
          <span class="text-h6">NGN {{ total }}</span>
        </q-card-section>

        <q-card-actions class="row justify-end">
          <q-btn
            class="q-ma-md"
            style="width: 100%"
            color="primary"
            @click="handleOrderClick"
            >Order</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { computed, ref } from "vue";
import CartItem from "src/components/CartItem.vue";

export default {
  // name: 'PageName',
  props: ["cart"],
  components: {
    CartItem,
  },
  setup(props, { emit }) {
    const total = computed(() => {
      let amount = 0;
      const cart = props.cart;
      const cartPrices = cart.map((item) => {
        return item.product.price * item.orderQuantity;
      });
      amount = cartPrices.reduce((acc, curr) => {
        return acc + curr;
      });
      return amount;
    });
    const handleOrderClick = () => {
      console.log("Order-placed");
      emit("place-order");
    };

    return {
      total,
      handleOrderClick,
    };
  },
};
</script>
