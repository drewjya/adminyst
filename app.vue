<script setup lang="ts">
import { Toaster } from "./components/ui/toast";
</script>

<template>
  <NuxtLayout>
    <NuxtPage> </NuxtPage>
    <Toaster :duration="1000"></Toaster>
  </NuxtLayout>
</template>
