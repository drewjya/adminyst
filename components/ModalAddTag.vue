<script setup lang="ts"></script>

<template>
  <UModal>
    <UCard>
      <template #header>
        <p class="text-head_6 font-semibold">Add New Tag</p>
      </template>
      <div class="flex flex-col gap-2">
        <UFormGroup label="Name">
          <UInput placeholder="Name" />
        </UFormGroup>
        <UButton label="Kirim" size="xs" color="black" />
      </div>
    </UCard>
  </UModal>
</template>

<style scoped></style>
