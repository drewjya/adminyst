<script setup lang="ts" generic="T">
const { items, display, label } = withDefaults(
  defineProps<{
    items: T[] | undefined;
    loading?: boolean;
    label: string;
    showLabel?: boolean;
    display: (value: T) => string;
  }>(),
  {
    showLabel: true,
    loading: false,
  }
);

const selected = defineModel<T>();

const open = ref(false);

const datas = computed(() => {
  return [
    (items ?? []).map((e) => {
      return {
        label: display(e),
        click: () => {
          selected.value = e;
        },
      };
    }),
  ];
});
</script>

<template>
  <UDropdown :items="datas">
    <UButton
      variant="outline"
      size="sm"
      icon="i-radix-icons:caret-sort"
      role="combobox"
      color="black"
      :aria-expanded="open"
      class="h-7 gap-1 rounded-md px-3"
      :label="selected ? display(selected) : label"
    />
  </UDropdown>
</template>

<style scoped></style>
