<template>
  <q-page class="flex flex-center">
    <!-- content -->

    <div class="q-pa-md full-width" style="max-width: 400px">
      <q-card class="q-pa-md">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <h5 class="q-my-md text-center">Login</h5>

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

          <div class="flex flex-center">
            <q-btn label="Login" type="submit" color="primary" />
          </div>
          <div class="flex flex-center">
            You don't have an account?
            <router-link :to="{ name: 'register' }">Sign Up</router-link>
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

export default {
  // name: 'PageName',
  setup(_, { emit }) {
    const router = useRouter();
    const $q = useQuasar();
    const email = ref("");
    const password = ref("");

    const login = async (email, pwd) => {
      let user;
      const body = {
        email: email,
        password: pwd,
      };

      try {
        const res = await api.post("/login", body);
        const data = res.data;

        $q.localStorage.set("access-token", data.access_token);
        user = data.user;
      } catch (e) {
        return;
      }

      return user;
    };

    const onSubmit = async () => {
      const user = await login(email.value, password.value);
      if (!user) {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "Incorrect email or password",
        });
        return;
      }
      emit("login-user", user);
      router.push("/");
    };

    const isValidEmail = (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid email";
    };

    return {
      email,
      password,
      onSubmit,
      isValidEmail,
    };
  },
  methods: {},
};
</script>
