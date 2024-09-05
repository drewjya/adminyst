<script setup lang="ts">
import type { AsyncDataRequestStatus } from "#app";
import type { VOrder } from "~/lib/types";
import { formatDateString, titleCase } from "~/lib/utils";

const {} = defineProps<{
  status: AsyncDataRequestStatus;
  orders: VOrder[];
  nextCursor: number | null;
  detail?: boolean
}>();
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold">Orders</h3>
        <NuxtLink v-if="detail"
          :to="`/cabang/${$route.params.id}/order`"
          class="p-2 py-0.5 hover:bg-gray-200 rounded underline"
        >
          Detail
        </NuxtLink>
      </div>
    </template>

    <section
      data-role="table-order-list"
      class="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-2"
    >
      <div
        data-role="table-order-header"
        class="sticky top-0 grid grid-cols-subgrid col-span-full font-semibold text-base bg-slate-200 p-2 rounded-md"
      >
        <div>Customer</div>
        <div>Therapist</div>
        <div>Cabang</div>
        <div class="hidden md:block">Status</div>
        <div>Bukti Bayar</div>
        <div>Tanggal</div>
      </div>
      <div
        v-if="status === 'pending'"
        class="col-span-full h-40 flex justify-center items-center"
      >
        <LoadingSpinner />
      </div>

      <div
        v-else-if="orders.length === 0"
        class="col-span-full h-40 flex justify-center items-center"
      >
        <p class="text-sm">Belum Ada Order</p>
      </div>

      <template v-else>
        <button
          @click="
            () => {
              $router.push(`/order/${i.id}`);
            }
          "
          v-for="(i, index) in orders"
          data-role="table-data-items"
          class="col-span-full grid grid-cols-subgrid text-label font-medium hover:bg-slate-200 p-2 text-start"
          :class="index % 2 === 0 ? '' : 'bg-slate-200/40'"
        >
          <div class="flex flex-col items-start">
            <div>{{ i.guestPhoneNumber }}</div>
            <div class="flex items-center gap-2">
              <p class="text-label_sm">
                {{ titleCase(i.guestGender) }}
              </p>
              <VBadgeStatus class="text-xs md:hidden" :status="i.orderStatus" />
            </div>
          </div>
          <div class="text-start">
            {{
              i.therapist
                ? `(${i.therapist?.no}) ${i.therapist.nama}`
                : "Random"
            }}
          </div>
          <div>{{ i.cabang.nama }}</div>
          <div class="hidden md:block">
            <VBadgeStatus class="text-xs" :status="i.orderStatus" />
          </div>
          <div>
            <p>
              {{ i.picture?.path ? "Sudah Upload" : "Belum Upload" }}
            </p>
          </div>
          <div>
            {{
              formatDateString(
                "DD MMM YYYY, HH:mm",
                new Date(i.orderTime!).toString()
              )
            }}
          </div>
        </button>
      </template>
    </section>

    <template #footer>
      <div class="flex justify-end gap-2">
        <!--  || cursors.length === 1" -->
        <UButton
          size="xs"
          :disabled="status === 'pending'"
          @click="
            () => {
              // let cur = cursors.pop();
              // cur = cursors.pop();
              // skip = `cursor=${cur ?? ''}`;
              // if (cursors.length === 0 && cur === undefined) {
              //   cursors = [undefined];
              // } else {
              //   cursors = [...cursors, cur];
              // }
            }
          "
          variant="soft"
          color="white"
          icon="i-material-symbols:chevron-left"
          class="hover:bg-primary/80 hover:text-primary-foreground"
        >
        </UButton>
        <UButton
          size="xs"
          color="white"
          @click="
            () => {
              // const next = `cursor=${data?.nextCursor}`;
              // if (cursors.length === 0) {
              //   cursors = [undefined];
              // }
              // cursors = [...cursors, data?.nextCursor ?? undefined];
              // skip = next;
            }
          "
          :disabled="nextCursor === null || status === 'pending'"
          variant="soft"
          icon="i-material-symbols:chevron-right"
          class="hover:bg-primary/80 hover:text-primary-foreground"
        >
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<style scoped></style>
