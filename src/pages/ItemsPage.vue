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
import ItemCard from "../components/ItemCard.vue";

export default {
  // name: 'PageName',
  components: {
    ItemCard,
  },
  props: ["items"],
};
</script>
