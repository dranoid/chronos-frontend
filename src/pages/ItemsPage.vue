<template>
  <q-page class="flex column items-center">
    <h4>Store</h4>
    <ItemCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @add-to-cart="
        (payload) => {
          $emit('add-to-cart', payload);
        }
      "
    ></ItemCard>
    <div v-if="!(items && items.length)">
      <p>There's nothing here right now, please come back later</p>
    </div>
  </q-page>
</template>

<script>
import { onMounted } from "vue";
import ItemCard from "../components/ItemCard.vue";
import { getItems } from "src/composables/items";

export default {
  // name: 'PageName',
  components: {
    ItemCard,
  },
  props: ["items"],
  setup(_, { emit }) {
    async function fetchData() {
      const items = await getItems();
      emit("get-item", items);
    }
    onMounted(() => {
      fetchData();
    });
  },
};
</script>
