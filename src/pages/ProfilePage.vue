<template>
  <q-page padding>
    <div class="text-h2">
      <q-icon name="person" size="xl" />
      {{ user.name }}
      <q-badge v-if="user.roles[0] == 'admin'" color="primary">Admin</q-badge>
    </div>
    <p class="">{{ user.email }}</p>
    <div class="flex flex-center">
      <h3 class="text-center">Order History</h3>
      <div style="width: 90%">
        <q-card>
          <div v-if="user.order.length == 0">
            <q-card-section>
              Nothing in your history yet. Check out the
              <router-link to="/" class="text-primary">store.</router-link>
            </q-card-section>
          </div>
          <div v-else>
            <div v-for="(order, index) in user.order" :key="index">
              <q-card-section clickable>
                Order Id: {{ order._id }}.
                <span class="text-italic text-grey" style="cursor: pointer"
                  >Click to see more info (A dialog box is meant to show up with
                  transaction details)</span
                >
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
export default {
  // name: 'PageName',
  props: ["user"],
};
</script>
