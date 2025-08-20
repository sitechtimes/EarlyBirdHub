<template>
  <div class="w-full h-screen flex">
    <div
      class="w-full md:w-1/2 h-full flex flex-col items-center justify-center gap-6"
    >
      <h2 class="w-2/3 text-white text-4xl">Welcome!</h2>
      <input
        v-model="email"
        class="w-2/3 p-3 bg-white/10 rounded-lg text-white"
        type="email"
        placeholder="Enter your email"
        required
      />
      <div class="w-2/3 flex flex-col gap-1">
        <input
          v-model="password"
          class="w-full p-3 bg-white/10 rounded-lg text-white"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>

      <button
        @click="handleLogin"
        :disabled="isLoading"
        class="relative w-2/3 p-3 rounded-lg cursor-pointer border-2 border-yellow-400 font-medium text-white overflow-hidden disabled:opacity-50"
      >
        {{ isLoading ? "Signing in..." : "Login" }}
      </button>
    </div>
    <div class="w-1/2 hidden md:inline rounded-3xl m-6 overflow-auto">
      <img
        class="w-full h-full object-cover"
        src="https://media.discordapp.net/attachments/1392863675022577816/1405027799437148251/raw.png?ex=689d559b&is=689c041b&hm=a4e6d189db596ca0d31ed613b3445d206e694073c44d24b3503bc913a0a3b304&=&format=webp&quality=lossless&width=1676&height=1118"
        alt=""
      />
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
