<script setup lang="ts">
import { OrderStatus } from "@prisma/client";
import { titleCase } from "~/lib/utils";

const { status } = defineProps<{
  status: string;
}>();
</script>

<template>
  <Badge
    :class="
      status === OrderStatus.COMPLETE
        ? 'bg-green-200 hover:bg-green-200'
        : status === OrderStatus.CANCELLED
        ? 'bg-red-200 hover:bg-red-200'
        : status === OrderStatus.PENDING
        ? 'bg-gray-200 hover:bg-gray-200'
        : status === OrderStatus.CONFIRMED
        ? 'bg-blue-200 hover:bg-blue-200'
        : status === OrderStatus.ONGOING
        ? 'bg-yellow-200 hover:bg-yellow-200'
        : status === OrderStatus.RESCHEDULE
        ? 'bg-purple-200 hover:bg-purple-200'
        : 'bg-orange-200 hover:bg-orange-200'
    "
    class="text-black"
    >{{ titleCase(status) }}</Badge
  >
</template>

<style scoped></style>
