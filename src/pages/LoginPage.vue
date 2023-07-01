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
      // setup () {
      //   const $q = useQuasar()

      //   $q.localStorage.set(key, value)
      //   const value = $q.localStorage.getItem(key)

      //   $q.sessionStorage.set(key, value)
      //   const otherValue = $q.sessionStorage.getItem(key)
      // }
      // axios.post('url', {"body":data}, {
      //     headers: {
      //     'Content-Type': 'application/json'
      //     }
      //   }
      // )
      // axios.get('https://api.example.com/some-endpoint')
      //   .then(response => {
      //     // Read the access token from the response headers or body
      //     const accessToken = response.headers['authorization']; // Assuming the access token is in the 'Authorization' header

      //     // Use the access token as needed
      //     console.log(accessToken);
      //     // ... do something with the access token
      //   })
      //   .catch(error => {
      //     // Handle error
      //     console.error(error);
      //   });

      // try {
      //   $q.localStorage.set(key, value)
      // } catch (e) {
      //   // data wasn't successfully saved due to
      //   // a Web Storage API error
      // }

      let user;
      const body = {
        email: email,
        password: pwd,
      };

      try {
        const res = await api.post("http://localhost:3000/login", body);
        const data = res.data;

        $q.localStorage.set("access-token", data.access_token);
        user = data.user;

        console.log(data.access_token);
        console.log(data, "login");
      } catch (e) {
        console.log(e);
        return;
      }

      // const res = await axios.get("http://localhost:3000/users");
      // const userList = res.data;
      // const user = userList.find((user) => {
      //   return user.email == email && user.password == pwd;
      // });
      // console.log(user, "user");
      // console.log("Bearer eadb3.4j5kl$r".split("Bearer ")[1]);
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
