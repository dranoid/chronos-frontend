<template>
  <q-expansion-item
    :v-model="false"
    icon="add"
    label="Add items"
    caption="List new items in the store"
    class="bordered-expansion-item"
  >
    <q-card>
      <q-card-section>
        <div class="">
          <q-input
            filled
            ref="nameEl"
            v-model="name"
            label="Item's name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <q-input
            filled
            ref="descriptionEl"
            v-model="description"
            label="Item's description"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <q-input
            filled
            ref="qtyEl"
            v-model="qty"
            label="Item's quantity"
            type="number"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <q-input
            filled
            ref="priceEl"
            v-model="price"
            label="Item's price"
            type="number"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <q-btn color="primary" @click="handleClick">Add Item</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import { ref, computed, watch } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
export default {
  setup(_, { emit }) {
    const $q = useQuasar();
    const expanded = ref(true);
    const name = ref("");
    const description = ref("");
    const price = ref("");
    const qty = ref("");

    const nameEl = ref("");
    const descriptionEl = ref("");
    const priceEl = ref("");
    const qtyEl = ref("");

    async function handleClick() {
      const body = {
        name: name.value,
        description: description.value,
        price: price.value,
        qty: qty.value,
      };

      const res = await api.post("/products", body);
      if (res && res.status == 201) {
        $q.notify({
          color: "green-5",
          textColor: "white",
          icon: "check",
          message: "Item succesfully added to the store",
        });

        // Clean up the form
        name.value = "";
        description.value = "";
        price.value = "";
        qty.value = "";

        emit("refresh-items");
      } else {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message:
            "There was a problem adding item to the store. Please try again",
        });
      }
    }

    watch(expanded, () => {
      nameEl.value.resetValidation();
      descriptionEl.value.resetValidation();
      priceEl.value.resetValidation();
      qtyEl.value.resetValidation();
    });
    const resetValidation = computed(() => {
      let exp = expanded.value;
      console.log(expanded.value, "hehehe");
      nameEl.value.resetValidation();
      descriptionEl.value.resetValidation();
      priceEl.value.resetValidation();
      qtyEl.value.resetValidation();
      return exp;
    });

    return {
      expanded,
      name,
      description,
      price,
      qty,
      nameEl,
      descriptionEl,
      priceEl,
      qtyEl,
      resetValidation,
      handleClick,
    };
  },
};
</script>

<style scoped>
.bordered-expansion-item {
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
