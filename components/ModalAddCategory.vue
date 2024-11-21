<script setup lang="ts"></script>

<template>
  <UModal>
    <UCard>
      <template #header>
        <p class="text-head_6 font-semibold">Add New Category</p>
      </template>
      <div class="flex flex-col gap-2">
        <UFormGroup label="Nama">
          <UInput placeholder="Nama" />
        </UFormGroup>
        <UFormGroup label="Opsional">
          <UCheckbox label="Opsional" />
        </UFormGroup>
        <UFormGroup label="Punya Happy Hour">
          <UCheckbox label="Bisa happy hour" />
        </UFormGroup>
        <UButton label="Kirim" size="xs" color="black" />
      </div>
    </UCard>
  </UModal>
</template>

<style scoped></style>
