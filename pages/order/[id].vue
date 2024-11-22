<script setup lang="ts">
import type { SResponse } from "~/lib/app";
import type { OrderStatus } from "~/lib/enum";
import type { VOrderDetail } from "~/lib/types";

const { id } = useRoute().params;

type OrderDetailReq = SResponse<{
  order: VOrderDetail | null;
}>;

const app = useApp();

const therapist = ref<number>();

const { status, data, refresh } = await useApiFetch(`/server/order/${id}`, {
  headers: app.bearer(),
  transform: (data: OrderDetailReq) => data.data,
});
const runtime = useRuntimeConfig();
const loading = ref(false);
const notif = useNotif();
const updateStatus = async (
  status: OrderStatus,
  therapistId: number,
  orderDate: string,
  orderTime: string
) => {
  loading.value = true;
  try {
    const res = await $fetch<SResponse<any>>(`/server/order/${id}/status`, {
      baseURL: runtime.public.baseUrl,
      method: "put",
      body: {
        therapistId: therapistId,
        status: status,
        orderDate: orderDate,
        orderTime: orderTime,
      },
      headers: app.bearer(),
    });
    if (res.data) {
      notif.success({
        title: "Success update order",
      });
    } else {
      notif.error({
        title: "Something Wrong",
        description: res.message,
      });
    }
    loading.value = false;

    refresh();
  } catch (error: any) {
    if (error.data) {
      const data: SResponse<any> = error.data;
      notif.error({
        title: "Something Wrong",
        description: data.message,
      });
    } else {
      notif.error({
        title: "Something Wrong",
        description: "Try again later",
      });
    }
    loading.value = false;
  }
};
</script>

<template>
  <OrderCard
    :state="{
      data: data?.order ?? undefined,
      loading: status === 'pending',
    }"
    @select="updateStatus"
  />
</template>

<style scoped></style>
