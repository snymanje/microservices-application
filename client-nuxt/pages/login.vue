<template>
  <div
    class="flex flex-wrap h-screen bg-white"
    style="font-family: 'Open Sans', sans-serif;"
  >
    <div class="w-full md:w-1/2">
      <div class="flex items-center justify-center h-full">
        <div class="w-full max-w-md px-4">
          <h1 class="font-bold text-4xl text-center text-black mb-6">
            Sign in to you account
          </h1>
          <p class="text-gray-800 text-md">Sign in with</p>
          <div class="flex justify-between mt-1">
            <button
              class="w-1/3 mr-2 rounded-md border-gray-400 border-solid border bg-white px-4 py-2"
            >
              Facebook
            </button>
            <button
              class="w-1/3 mr-2 rounded-md border-gray-400 border-solid border bg-white px-4 py-2"
              @click="googleLogin"
            >
              Google
            </button>
            <button
              class="w-1/3 rounded-md border-gray-400 border-solid border bg-white px-4 py-2"
            >
              Github
            </button>
          </div>
          <div class="flex items-center justify-between my-8">
            <div class="flex-1 border border-solid border-gray-400"></div>
            <div class="flex-1 px-2 font-semibold">
              Or continue with
            </div>
            <div class="flex-1 border border-solid border-gray-400"></div>
          </div>
          <form class="bg-white rounded pt-6 pb-8 mb-4">
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="email"
                >Email address</label
              >
              <input
                id="email"
                v-model="login.email"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
              />
            </div>
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="password"
                >Password</label
              >
              <input
                id="password"
                v-model="login.password"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
              />
              <!-- <p class="text-red-500 text-xs italic">Please choose a password.</p> -->
            </div>
            <div class="flex flex-col items-center">
              <button
                class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                @click="localLogin"
              >
                Sign In
              </button>
              <nuxt-link
                to="/forgotPassword"
                class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 mt-4"
                >Forgot Password?</nuxt-link
              >
            </div>
          </form>
          <p class="text-center text-gray-500 text-md">
            Don't have an account?
            <nuxt-link
              to="/signup"
              class="text-blue-500 hover:text-blue-800 font-semibold cursor-pointer"
              >Sign Up</nuxt-link
            >
          </p>
        </div>
      </div>
    </div>
    <div class="hidden md:block md:w-1/2">
      <div class="flex items-center justify-center">
        <img
          src="~/assets/images/architecture-buildings-business-city.jpg"
          alt="signup image"
          class="object-cover h-screen object-center"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      login: {
        email: 'jean.snyman6@gmail.com',
        password: '',
      },
    };
  },
  methods: {
    ...mapActions(['loggedIn']),
    ...mapGetters(['auth']),
    async localLogin() {
      try {
        await this.$axios.$post('/auth/login', {
          email: this.login.email,
          password: this.login.password,
        });
        const user = await this.$axios.$get('/user/getCurrentUser');
        await this.loggedIn(user);
        const authState = await this.auth();
        if (authState.loggedIn === true) {
          this.$router.push(authState.redirect.home);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async googleLogin() {
      try {
        const { wc } = await this.$gAuth.signIn();
        await this.$axios.$post('/auth/googleLogin', {
          access_token: wc.id_token,
        });
        const user = await this.$axios.$get('/user/getCurrentUser');
        await this.loggedIn(user);
        const authState = await this.auth();
        if (authState.loggedIn === true) {
          this.$router.push(authState.redirect.home);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
  },
};
</script>
