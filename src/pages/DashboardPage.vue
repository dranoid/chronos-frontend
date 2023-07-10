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

      <div v-for="(user, index) in filteredUsers" :key="index">
        <ManageUsers
          :userObj="user"
          @refresh-users="handleRefreshUsers"
        ></ManageUsers>
      </div>
      <div class="row justify-end q-my-md">
        <q-pagination
          v-model="selectedUserPage"
          :max="usersPageData.totalPages || 1"
          @update:model-value="loadUserPageData"
          direction-links
          flat
          color="grey"
          active-color="primary"
        />
      </div>
    </div>

    <div class="items-crud">
      <div class="text-h5 q-mt-xl">Manage Items</div>

      <div class="q-my-lg">
        <AddItem @refresh-items="handleRefreshItems"></AddItem>
      </div>
      <q-input
        class="q-mb-lg q-mt-sm"
        v-model="searchItem"
        filled
        label="Search items"
        hint="Name, description or item Id"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <div v-for="(item, index) in filteredItems" :key="index">
        <ManageItems
          :itemObj="item"
          @refresh-items="handleRefreshItems"
        ></ManageItems>
      </div>
      <div class="row justify-end q-my-md">
        <q-pagination
          v-model="selectedItemsPage"
          :max="itemsPageData.totalPages || 1"
          @update:model-value="loadItemsPageData"
          direction-links
          flat
          color="grey"
          active-color="primary"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { getUsers } from "src/composables/users";
import { getItems } from "src/composables/items";
import ManageItems from "src/components/ManageItems.vue";
import ManageUsers from "src/components/ManageUsers.vue";
import AddItem from "src/components/AddItem.vue";

// TODO (Add pagination and figure out how to update roles and Add patch and delete routes to backend)

export default {
  // name: 'PageName',
  components: {
    ManageItems,
    ManageUsers,
    AddItem,
  },
  setup() {
    const usersForMeta = ref([]);
    const usersPageData = ref({});
    const itemsForMeta = ref([]);
    const itemsPageData = ref({});
    const searchName = ref("");
    const searchItem = ref("");
    const selectedUserPage = ref(1);
    const selectedItemsPage = ref(1);
    const userPageLimit = 5;
    const itemPageLimit = 2;

    const userNum = computed(() => {
      let num = usersPageData.value.totalItems || 0;
      if (num < 10) {
        num = "0" + num;
      }
      return num;
    });
    const itemNum = computed(() => {
      let num = itemsPageData.value.totalItems || 0;
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

    async function handleRefreshItems() {
      performItemOp();
    }

    async function handleRefreshUsers() {
      performUserOp();
    }
    async function performUserOp() {
      const userData = await getUsers(selectedUserPage.value, userPageLimit);
      usersForMeta.value = userData.users;
      usersPageData.value = {
        totalItems: userData.totalItems,
        totalPages: userData.totalPages,
        currentPage: userData.currentPage,
        limit: userData.limit,
      };
    }
    async function performItemOp() {
      const itemsData = await getItems(selectedItemsPage.value, itemPageLimit);
      itemsForMeta.value = itemsData.items;
      itemsPageData.value = {
        totalItems: itemsData.totalItems,
        totalPages: itemsData.totalPages,
        currentPage: itemsData.currentPage,
        limit: itemsData.limit,
      };
    }
    async function fetchData() {
      performUserOp();
      performItemOp();
    }
    async function loadUserPageData() {
      performUserOp();
    }
    async function loadItemsPageData() {
      performItemOp();
    }
    onMounted(() => {
      fetchData();
    });
    return {
      searchName,
      searchItem,
      filteredUsers,
      filteredItems,
      usersForMeta,
      usersPageData,
      itemsForMeta,
      itemsPageData,
      userNum,
      itemNum,
      selectedUserPage,
      selectedItemsPage,
      handleRefreshItems,
      handleRefreshUsers,
      loadUserPageData,
      loadItemsPageData,
    };
  },
};
</script>
