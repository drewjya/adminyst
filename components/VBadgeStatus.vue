<script setup lang="ts">
import { OrderStatus } from "~/lib/enum";
import { titleCase } from "~/lib/utils";

const { status } = defineProps<{
  status: OrderStatus | "";
}>();

const classVal =
  status === OrderStatus.COMPLETE
    ? "bg-green-200 hover:bg-green-200"
    : status === OrderStatus.CANCELLED
    ? "bg-red-200 hover:bg-red-200"
    : status === OrderStatus.PENDING
    ? "bg-gray-200 hover:bg-gray-200"
    : status === OrderStatus.CONFIRMED
    ? "bg-blue-200 hover:bg-blue-200"
    : status === OrderStatus.ONGOING
    ? "bg-yellow-200 hover:bg-yellow-200"
    : status === OrderStatus.RESCHEDULE
    ? "bg-purple-200 hover:bg-purple-200"
    : "bg-orange-200 hover:bg-orange-200";
</script>

<template>
  <UBadge :class="classVal" class="text-black" :label="titleCase(status)" />
</template>

<style scoped></style>
