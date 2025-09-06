<template>
  <input
    v-model="model"
    :type="inputType"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :required="required"
    class="bg-zinc-900 p-2 rounded border border-gold"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  inputType: string;
  placeholder?: string;
  maxlength?: number;
  required?: boolean;
}>();

const model = defineModel<string>();
</script>
