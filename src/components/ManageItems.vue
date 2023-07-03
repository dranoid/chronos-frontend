<template>
  <q-card class="q-pa-md">
    <q-card-section class="row justify-start">
      <div class="col-8 self-end">
        <q-input
          filled
          v-model="item.name"
          label="Item's name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          filled
          v-model="item.description"
          label="Item's description"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          filled
          v-model="item.qty"
          label="Item's quantity"
          type="number"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          filled
          v-model="item.price"
          label="Item's price"
          type="number"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <p>ID: {{ item._id }}</p>
      </div>
      <div class="col-4 self-start">
        <q-btn class="q-ma-md" @click="handleUpdate(item._id)">Update</q-btn>
        <q-btn class="q-ma-md" @click="handleDelete(item._id)">Delete</q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { computed } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

export default {
  props: ["itemObj"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const item = computed(() => props.itemObj); // Apparently props aren't mutable

    async function handleUpdate(id) {
      const body = {
        name: item.value.name,
        description: item.value.description,
        qty: item.value.qty,
        price: item.value.price,
      };

      const res = await api.patch("/products/" + id, body);
      if (res && res.status == 200) {
        $q.notify({
          color: "green-5",
          textColor: "white",
          icon: "check",
          message: "Item succesfully updated",
        });
      } else {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "There was a problem updating this item",
        });
      }
    }
    async function handleDelete(id) {
      const res = await api.delete("/products/" + id);
      if (res && res.status == 200) {
        $q.notify({
          color: "green-5",
          textColor: "white",
          icon: "multiply",
          message: "Item succesfully deleted",
        });

        emit("refresh-items");
      } else {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "There was a problem deleting this item",
        });
      }
    }

    return { item, handleUpdate, handleDelete };
  },
};
</script>
