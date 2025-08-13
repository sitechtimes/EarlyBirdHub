<template>
  <div class="min-h-screen bg-black text-gold flex items-center justify-center">
    <div class="bg-zinc-900 p-8 rounded-xl border border-gold w-full max-w-md">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gold mb-2">Early Bird Hub</h1>
        <h2 class="text-xl text-gray-300">Login</h2>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gold mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full bg-black border border-gold p-3 rounded focus:outline-none focus:border-yellow-400"
            required
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gold mb-1"
          >
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full bg-black border border-gold p-3 rounded focus:outline-none focus:border-yellow-400"
            required
          />
        </div>

        <div
          v-if="error"
          class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded"
        >
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gold text-black font-bold py-3 px-4 rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isLoading ? "Signing in..." : "Sign In" }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-400">
        <p>Use the credentials provided to access your dashboard</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Redirect authenticated users
definePageMeta({
  middleware: "guest",
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
  console.log("User role:", authStore.userRole);

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

// Watch for authentication state changes
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      redirectBasedOnRole();
    }
  }
);
</script>
