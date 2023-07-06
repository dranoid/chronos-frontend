<template>
  <q-card>
    <q-card-section class="row justify-start">
      <div class="col-8 self-end">
        <q-input
          filled
          v-model="user.name"
          label="User's name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
        <q-input
          filled
          type="email"
          v-model="user.email"
          label="Your Email Address..."
          lazy-rules
          :rules="[(val) => !!val || 'Email is missing', isValidEmail]"
        />
        <q-select
          filled
          v-model="user.roles[0]"
          :options="['user', 'admin']"
          label="Select user roles"
        />
        <p>ID: {{ user._id }}</p>
      </div>
      <div class="col-4 self-start">
        <q-btn class="q-ma-md" @click="handleUpdate(user._id)">Update</q-btn>
        <q-btn class="q-ma-md" @click="handleDelete(user._id)">Delete</q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

export default {
  props: ["userObj"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const user = computed(() => props.userObj); // Apparently props aren't mutable

    async function handleUpdate(id) {
      const body = {
        name: user.value.name,
        email: user.value.email,
        phone: user.value.phone,
        roles: [user.value.roles[0]],
      };

      const res = await api.patch("/users/" + id, body);
      if (res && res.status == 200) {
        $q.notify({
          color: "green-5",
          textColor: "white",
          icon: "check",
          message: "User succesfully updated",
        });
      } else {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "There was a problem updating this user",
        });
      }
    }
    async function handleDelete(id) {
      const res = await api.delete("/users/" + id);
      if (res && res.status == 200) {
        $q.notify({
          color: "green-5",
          textColor: "white",
          icon: "check",
          message: "User succesfully deleted",
        });
        emit("refresh-users");
      } else {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "There was a problem deleting this user",
        });
      }
    }

    function isValidEmail(val) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid email";
    }

    return { user, isValidEmail, handleDelete, handleUpdate };
  },
};
</script>
