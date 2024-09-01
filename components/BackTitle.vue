<script setup lang="ts">
defineProps<{
  label: string;
}>();
const pop = () => {
  useRouter().go(-1);
};
</script>

<template>
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">{{ label }}</h1>

    <Button variant="outline" size="sm" @click="pop">Kembali</Button>
  </div>
</template>

<style scoped></style>
