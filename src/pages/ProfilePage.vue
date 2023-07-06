<template>
  <q-page padding>
    <div class="text-h2">
      <q-icon name="person" size="xl" />
      {{ userComp.name }}
      <q-badge v-if="userComp.roles[0] == 'admin'" color="primary"
        >Admin</q-badge
      >
    </div>
    <p class="">{{ userComp.email }}</p>
    <div class="flex flex-center">
      <h3 class="text-center">Order History</h3>
      <div style="width: 90%">
        <q-card>
          <div v-if="userComp.order.length == 0">
            <q-card-section>
              Nothing in your history yet. Check out the
              <router-link to="/" class="text-primary">store.</router-link>
            </q-card-section>
          </div>
          <div v-else>
            <div v-for="(order, index) in orderList" :key="index">
              <q-card-section clickable>
                <q-expansion-item
                  expand-separator
                  icon="reorder"
                  :label="`Order Id: ${order._id}.`"
                  caption="Click to see more info"
                >
                  <q-card>
                    <div v-for="(orderItem, index) in order.list" :key="index">
                      <q-card-section>
                        Item: {{ orderItem.product.name }} -------- Quantity:
                        {{ orderItem.orderQuantity }} -------- Cost: NGN{{
                          orderItem.product.price * orderItem.orderQuantity
                        }}
                      </q-card-section>
                    </div>
                    <p>Total: NGN{{ total(order.list) }}</p>
                  </q-card>
                </q-expansion-item>
              </q-card-section>
              <q-separator inset></q-separator>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
export default {
  // name: 'PageName',
  props: ["user"],
  setup(props) {
    const $q = useQuasar();
    const orderList = ref([]);
    const userComp = computed(() => {
      // Check if layout data prop is available, otherwise fallback to local storage
      return props.user || $q.localStorage.getItem("user-details");
    });
    // const ordersComp=computed(()=>{

    // })

    async function getOrders() {
      const res = await api.get("users/me/order");
      orderList.value = res.data;
    }
    function total(orderListItem) {
      let amount = 0;
      const prices = orderListItem.map((item) => {
        return item.product.price * item.orderQuantity;
      });
      amount = prices.reduce((acc, curr) => {
        return acc + curr;
      });
      return amount;
    }

    onMounted(() => {
      getOrders();
    });

    return {
      userComp,
      orderList,
      total,
    };
  },
};
</script>
