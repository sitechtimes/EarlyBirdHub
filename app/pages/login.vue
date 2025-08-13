<template>
  <div class="w-full h-screen flex">
    <div class="w-1/2 h-full flex flex-col items-center justify-center gap-6">
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
    <div class="w-1/2 rounded-3xl m-6 overflow-auto">
      <img
        class="w-full h-full object-cover"
        src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-8b08-61f7-ab95-bf44ecfe14c7/raw?se=2025-08-13T01%3A04%3A04Z&sp=r&sv=2024-08-04&sr=b&scid=14f549a1-5739-5f19-aeb9-a6762107b4b6&skoid=f28c0102-4d9d-4950-baf0-4a8e5f6cf9d4&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-12T22%3A33%3A57Z&ske=2025-08-13T22%3A33%3A57Z&sks=b&skv=2024-08-04&sig=DvvGHT5rscKXft%2B6ivxweuBM0FaOsGuai71D6w9nYoM%3D"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
