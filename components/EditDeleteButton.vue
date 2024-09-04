<script setup lang="ts">
const { edit, remove } = defineProps<{
  edit?: () => void;
  remove?: () => void;
}>();

const items = [
  [
    ...(edit
      ? [
          {
            label: "Edit",
            icon: "i-heroicons-pencil-square-20-solid",

            click: edit,
          },
        ]
      : []),

    ...(remove
      ? [
          {
            label: "Remove",
            icon: "i-heroicons-trash-20-solid",

            click: remove,
          },
        ]
      : []),
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
