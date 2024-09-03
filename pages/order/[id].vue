<script setup lang="ts">
import type { SResponse } from "~/lib/app";
import type { VOrderDetail } from "~/lib/types";

const { id } = useRoute().params;

type OrderDetailReq = SResponse<{
  order: VOrderDetail | null;
}>;

const app = useApp();

const { status, data } = await useApiFetch(`/server/order/${id}`, {
  headers: app.bearer(),
  transform: (data: OrderDetailReq) => data.data,
});
</script>

<template>
  <OrderCard
    :state="{
      data: data?.order ?? undefined,
      loading: status === 'pending',
    }"
  />
</template>

<style scoped></style>
