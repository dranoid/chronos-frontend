<template>
  <q-page padding>
    <h2>Your Dashboard</h2>
    <div class="row justify-around">
      <div class="text-center">
        <h1>{{ userNum }}</h1>
        <p>Registered users on Chronos Store</p>
      </div>
      <div class="text-center">
        <h1>{{ itemNum }}</h1>
        <p>Approved products on Chronos Store</p>
      </div>
    </div>

    <div class="users-crud">
      <div class="text-h5 q-mt-xl">Manage Users</div>
      <q-input
        class="q-mb-lg q-mt-sm"
        v-model="searchName"
        filled
        label="Search users"
        hint="Name or User Id"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-card>
        <div v-for="(user, index) in filteredUsers" :key="index">
          <q-card-section class="row justify-start">
            <div class="col-8 self-end">
              <q-input
                filled
                v-model="user.name"
                label="User's name"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              />
              <q-input
                filled
                type="email"
                v-model="user.email"
                label="Your Email Address..."
                lazy-rules
                :rules="[(val) => !!val || 'Email is missing', isValidEmail]"
              />
              <q-input
                filled
                v-model="user.roles[0]"
                label="This should be a select between admin and user"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              />
              <q-select
                filled
                v-model="user.roles[0]"
                :options="['user', 'admin']"
                label="Filled"
              />
              <p>ID: {{ user._id }}</p>
            </div>
            <div class="col-4 self-start">
              <q-btn class="q-ma-md">Update</q-btn>
              <q-btn class="q-ma-md">Delete</q-btn>
            </div>
          </q-card-section>
        </div>
      </q-card>
    </div>

    <div class="items-crud">
      <div class="text-h5 q-mt-xl">Manage Items</div>
      <q-input
        class="q-mb-lg q-mt-sm"
        v-model="searchItem"
        filled
        label="Search items"
        hint="Name, description or item Id"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-card class="q-pa-md">
        <div v-for="(item, index) in filteredItems" :key="index">
          <q-card-section class="row justify-start">
            <div class="col-8 self-end">
              <q-input
                filled
                v-model="item.name"
                label="Item's name"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              />
              <q-input
                filled
                v-model="item.description"
                label="Item's description"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              />
              <q-input
                filled
                v-model="item.qty"
                label="Item's quantity"
                type="number"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              />
              <q-input
                filled
                v-model="item.price"
                label="Item's price"
                type="number"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              />
              <p>ID: {{ item._id }}</p>
            </div>
            <div class="col-4 self-start">
              <q-btn class="q-ma-md">Update</q-btn>
              <q-btn class="q-ma-md">Delete</q-btn>
            </div>
          </q-card-section>
        </div>
        <div>
          <q-toggle v-model="expanded" label="Expanded" class="q-mb-md" />

          <q-expansion-item
            v-model="expanded"
            icon="perm_identity"
            label="Account settings"
            caption="John Doe"
          >
            <q-card>
              <q-card-section>
                This is where the add ite form will be Lorem ipsum dolor sit
                amet, consectetur adipisicing elit. Quidem, eius reprehenderit
                eos corrupti commodi magni quaerat ex numquam, dolorum officiis
                modi facere maiores architecto suscipit iste eveniet doloribus
                ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-btn>Add Item</q-btn>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { getUsers } from "src/composables/users";
import { getItems } from "src/composables/items";

export default {
  // name: 'PageName',
  setup() {
    const usersForMeta = ref([]);
    const itemsForMeta = ref([]);
    const searchName = ref("");
    const searchItem = ref("");

    const userNum = computed(() => {
      let num = usersForMeta.value.length;
      if (num < 10) {
        num = "0" + num;
      }
      return num;
    });
    const itemNum = computed(() => {
      let num = itemsForMeta.value.length;
      if (num < 10) {
        num = "0" + num;
      }
      return num;
    });

    const filteredUsers = computed(() => {
      const filt = usersForMeta.value.filter((user) => {
        return (
          user.name.toLowerCase().includes(searchName.value.toLowerCase()) ||
          user._id.toString().includes(searchName.value.toLowerCase())
        );
      });

      return filt;
    });
    const filteredItems = computed(() => {
      const filt = itemsForMeta.value.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchItem.value.toLowerCase()) ||
          item.description
            .toLowerCase()
            .includes(searchItem.value.toLowerCase()) ||
          item._id.toString().includes(searchItem.value.toLowerCase())
        );
      });

      return filt;
    });

    function isValidEmail(val) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid email";
    }
    async function fetchUserData() {
      usersForMeta.value = await getUsers();
      itemsForMeta.value = await getItems();
    }
    onMounted(() => {
      fetchUserData();
    });
    return {
      searchName,
      searchItem,
      filteredUsers,
      filteredItems,
      usersForMeta,
      itemsForMeta,
      userNum,
      itemNum,
      isValidEmail,
    };
  },
};
</script>
