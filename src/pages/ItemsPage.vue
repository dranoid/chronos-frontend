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
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import getItems from "../composables/items";
import ItemCard from "../components/ItemCard.vue";

export default {
  // name: 'PageName',
  components: {
    ItemCard,
  },
  setup() {
    const items = ref([]);

    async function fetchData() {
      items.value = await getItems();
    }

    onMounted(() => {
      fetchData();
    });
    return {
      items,
    };
  },
};
</script>
