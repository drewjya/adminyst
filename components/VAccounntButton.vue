<script setup lang="ts">
const user = useApp();

const items = ref([
  [
    {
      label: "",
      slot: "account",
      disabled: true,
    },
  ],

  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: () => user.logout(),
    },
  ],
]);

watchEffect(() => {
  if (user.user) {
    items.value = [
      [
        {
          label: `${user.user.email}`,
          slot: "account",
          disabled: true,
        },
      ],

      [
        {
          label: "Sign out",
          icon: "i-heroicons-arrow-left-on-rectangle",
          click: () => user.logout(),
        },
      ],
    ];
  }
});
</script>

<template>
  <UDropdown
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ placement: 'left' }"
  >
    <UBadge :label="user.user?.name" color="black" />

    <template #account="{ item }">
      <div class="text-left">
        <p>Signed in as</p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <UIcon
        :name="item.icon"
        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
      />
    </template>
  </UDropdown>
</template>
