<template>
  <q-card class="q-ma-md flex row" style="width: 80%">
    <q-icon
      class="col-2 col-xs-12 col-sm-2 col-md-2"
      color="primary"
      :left="true"
      size="7rem"
      name="category"
    ></q-icon>

    <q-card-section class="col">
      <div>
        {{ item.name }}
        <p>{{ item.description }}</p>
      </div>
      <div>NGN {{ item.price }}</div>
      <div class="row justify-end">
        <q-card-actions style="font-size: 1.5em">
          <q-btn class="q-mx-sm" flat @click="decreaseQty">-</q-btn>
          {{ qty }}
          <q-btn class="q-mx-sm" flat @click="increaseQty">+</q-btn>
          <q-btn color="primary" @click="handleAddClick">Add to cart</q-btn>
        </q-card-actions>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";

export default {
  name: "ItemCard",
  props: ["item"],
  setup(props, { emit }) {
    const qty = ref(3);
    const $q = useQuasar();

    const decreaseQty = () => {
      if (qty.value <= 0) {
        return;
      }
      qty.value--;
    };
    const increaseQty = () => {
      if (qty.value >= props.item.qty) {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "Maximum amount in stock reached",
        });
        return;
      }
      qty.value++;
    };
    const handleAddClick = () => {
      if (qty.value <= 0 || qty.value >= props.item.qty) {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "Problem adding to cart check the quantity",
        });
        return;
      }
      emit("add-to-cart", { item: props.item, order_qty: qty.value });
    };

    return {
      qty,
      decreaseQty,
      increaseQty,
      handleAddClick,
    };
  },
};
</script>

<style scoped></style>
