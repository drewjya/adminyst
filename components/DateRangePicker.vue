<script setup lang="ts">
import { format, isSameDay, sub } from "date-fns";

const range = defineModel<{
  start: Date;
  end: Date;
}>();
const labelRange = computed(() => {
  const val = range.value;
  if (val) {
    return `${format(val.start, "dd MMM yyyy")} - ${format(
      val.end,
      "dd MMM yyyy"
    )}`;
  }
  return "";
});
const ranges = [
  { label: "Next 7 days", duration: { days: -7 } },
  { label: "Next 14 days", duration: { days: -14 } },
  { label: "Next 30 days", duration: { days: -30 } },
  { label: "Next 3 months", duration: { months: -3 } },
  { label: "Next 6 months", duration: { months: -6 } },
  { label: "Next year", duration: { years: -1 } },
  { label: "Last 7 days", duration: { days: 7 } },
  { label: "Last 14 days", duration: { days: 14 } },
];

function isRangeSelected(duration: Duration) {
  if (range.value) {
    return (
      isSameDay(range.value.start, sub(new Date(), duration)) &&
      isSameDay(range.value.end, new Date())
    );
  }
  return false;
}

function selectRange(duration: Duration) {
  range.value = { start: sub(new Date(), duration), end: new Date() };
}
</script>

<template>
  <UPopover>
    <UButton
      icon="i-radix-icons:calendar"
      :label="labelRange"
      color="black"
      size="sm"
      class="h-7 gap-1 rounded-md px-3"
      variant="outline"
    />
    <template #panel="{ close }">
      <div
        class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800"
      >
        <div class="hidden sm:flex flex-col py-4">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="gray"
            variant="ghost"
            class="rounded-none px-6"
            :class="[
              isRangeSelected(range.duration)
                ? 'bg-gray-100 dark:bg-gray-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            ]"
            truncate
            @click="selectRange(range.duration)"
          />
        </div>

        <DatePicker v-model="range" @close="close" />
      </div>
    </template>
  </UPopover>
</template>

<style scoped></style>
