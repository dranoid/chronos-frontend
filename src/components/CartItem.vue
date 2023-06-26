<template>
  <q-card-section class="row justify-between">
    <span>{{ cartItem.product.name }}</span>
    <span>{{ cartItem.product.price }}</span>
    <span>{{ cartItem.orderQuantity }}</span>
    <q-btn color="negative" @click="$emit('delete-item', cartItem)">x</q-btn>
  </q-card-section>

  <q-separator inset />
</template>

<script>
export default {
  name: "CartItem",
  props: ["cartItem"],
  emits: ["delete-item"],
};
</script>

<style scoped></style>
