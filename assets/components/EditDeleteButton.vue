<script setup lang="ts">
const { edit, remove } = defineProps<{
  edit: () => void;
  remove: () => void;
}>();

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      shortcuts: ["E"],
      click: edit,
    },
    {
      label: "Remove",
      icon: "i-heroicons-trash-20-solid",
      shortcuts: ["⌘", "D"],
      click: remove,
    },
  ],
];
</script>

<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
    <UButton
      color="white"
      size="xs"
      variant="soft"
      icon="i-ph:dots-three-outline-vertical-fill"
    />
  </UDropdown>
</template>
