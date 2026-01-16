<template>
  <div class="w-full h-screen flex">
    <form
      class="w-full lg:w-1/3 h-full flex flex-col items-center justify-center gap-6"
      @submit.prevent="handleLogin"
    >
      <h2 class="w-2/3 text-white text-4xl">Welcome!</h2>
      <input
        v-model="email"
        class="w-2/3 p-3 bg-white/10 rounded-lg text-white"
        type="email"
        placeholder="Enter your email"
        required
      />
      <input
        v-model="password"
        class="w-2/3 p-3 bg-white/10 rounded-lg text-white"
        type="password"
        placeholder="Enter your password"
        required
      />

      <button
        type="submit"
        :disabled="isLoading"
        class="relative w-2/3 p-3 rounded-lg cursor-pointer border-2 border-yellow-400 font-medium text-white overflow-hidden disabled:opacity-50"
      >
        {{ isLoading ? "Signing in..." : "Login" }}
      </button>
      <p class="text-error font-bold w-2/3 text-left" v-if="error">
        {{ error }}
      </p>
    </form>
    <div class="w-2/3 hidden lg:inline rounded-3xl m-6 overflow-auto">
      <img class="w-full h-full object-cover" src="/earlybirdbg.png" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Redirect authenticated users
definePageMeta({
  middleware: "guest",
});

useHead({
  title: "Login",
});

const authStore = useAuthStore();
const router = useRouter();

// State
const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

// Check if user is already authenticated and redirect accordingly
onMounted(() => {
  if (authStore.user) {
    redirectBasedOnRole();
  }
});

// Handle login
async function handleLogin() {
  if (isLoading.value) return;

  error.value = "";
  isLoading.value = true;

  try {
    await authStore.signIn(email.value, password.value);

    // Wait a moment for user data to be available
    await nextTick();

    // Redirect based on user role
    redirectBasedOnRole();
  } catch (err: any) {
    console.error("Login error:", err);
    error.value =
      err.message || "Failed to sign in. Please check your credentials.";
  } finally {
    isLoading.value = false;
  }
}

// Redirect user based on their email/role
function redirectBasedOnRole() {
  if (!authStore.user?.email) {
    console.log("No user email available yet");
    return;
  }

  console.log("Redirecting user with email:", authStore.user.email);

  if (authStore.isAdmin) {
    console.log("Redirecting to admin dashboard");
    navigateTo("/admin");
  } else if (authStore.isStaff) {
    console.log("Redirecting to staff dashboard");
    navigateTo("/dailymanagement");
  } else {
    console.log("User role not recognized, redirecting to home");
    navigateTo("/");
  }
}
</script>
