<template>
  <div class="w-full h-screen flex">
    <div
      class="w-full md:w-1/2 h-full flex flex-col items-center justify-center gap-6"
    >
      <h2 class="w-2/3 text-white text-4xl">Welcome!</h2>
      <input
        class="w-2/3 p-3 bg-white/10 rounded-lg"
        type="text"
        placeholder="Enter your email"
      />
      <div class="w-2/3 flex flex-col gap-1">
        <input
          class="w-full p-3 bg-white/10 rounded-lg"
          type="text"
          placeholder="Enter your password"
        />
        <p class="mx-2 text-gold underline cursor-pointer text-sm">
          Forgot your password?
        </p>
      </div>

      <button
        class="relative w-2/3 p-3 rounded-lg cursor-pointer border-2 border-yellow-400 font-medium text-white overflow-hidden"
      >
        Login
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

<script setup lang="ts"></script>

<style scoped></style>
