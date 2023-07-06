<template>
  <q-page class="flex flex-center">
    <!-- content -->

    <div class="q-pa-md full-width" style="max-width: 400px">
      <q-card class="q-pa-md">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <h5 class="q-my-md text-center">Sign-Up</h5>
          <q-input
            filled
            v-model="name"
            label="Your name..."
            hint="Name and surname"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            filled
            v-model="phone"
            label="Your phone number"
            lazy-rules
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type your Phone number',
              isValidPhone,
            ]"
          />

          <q-input
            filled
            type="email"
            v-model="email"
            label="Your Email Address..."
            lazy-rules
            :rules="[(val) => !!val || 'Email is missing', isValidEmail]"
          />

          <q-input
            filled
            type="password"
            v-model="password"
            label="Your password..."
            :rules="[
              (val) => val.length >= 3 || 'Please use minimum 3 characters',
            ]"
          />

          <q-toggle v-model="accept" label="I accept the license and terms" />

          <div class="flex flex-center">
            <q-btn label="Submit" type="submit" color="primary" />
          </div>
          <div class="flex flex-center">
            You already have an account?
            <router-link :to="{ name: 'login' }">Login</router-link>
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { api } from "src/boot/axios";

export default {
  // name: 'PageName',
  setup(_, { emit }) {
    const $q = useQuasar();
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const accept = ref(false);
    const phone = ref(null);
    const router = useRouter();

    async function onSubmit() {
      if (!accept.value) {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "You need to accept the license and terms first",
        });
        return;
      }
      const body = {
        name: name.value,
        email: email.value,
        password: password.value,
        phone: phone.value,
      };

      try {
        const res = await api.post("/register", body);
        const data = res.data;

        $q.localStorage.set("access-token", data.access_token);
        emit("login-user", data.user);
      } catch (e) {
        if (e.response)
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: e.response.data.message,
          });
        return;
      }
      router.push("/");
      // this.$api
    }

    function isValidEmail(val) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid email";
    }

    function isValidPhone(val) {
      const phoneNumPattern = /^(\+\d{1,3}\s?)?\d{11}$/;

      return phoneNumPattern.test(val) || "Invalid Phone number";
    }

    return {
      name,
      email,
      password,
      accept,
      phone,
      onSubmit,
      isValidEmail,
      isValidPhone,
    };
  },
};
</script>
