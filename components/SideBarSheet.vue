<script setup lang="ts">
const sidebar = useSidebar();
</script>

<template>
  <USlideover side="left">
    <div class="p-4 flex-1">
      <nav class="grid gap-1 text-sm font-medium">
        <p class="text-lg font-bold">YST Family</p>

        <NuxtLink
          v-for="i in sidebar.pages.value"
          :key="i.title"
          :href="i.link"
          class="hover:text-foreground py-2 rounded-md px-2 hover:bg-slate-300"
          :class="`${sidebar.current.value === i.link ? 'bg-slate-300' : ''}`"
        >
          {{ i.title }}
        </NuxtLink>
      </nav>
    </div>
  </USlideover>
</template>

<style scoped></style>
