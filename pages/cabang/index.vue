<script setup lang="ts">
import type { SResponse } from "~/lib/app";
import type { VCabang } from "~/lib/types";

const skip = ref("");
type Cur = number | undefined;
const cursors = ref<Cur[]>([undefined]);
type CabangReq = SResponse<{
  cabang: VCabang[];
  nextCursor: number | null;
}>;
const app = useApp();
const { data, status } = await useApiFetch(
  () => `/server/cabang?limit=6&cursor=${skip.value}`,
  {
    headers: app.bearer(),
    transform: (val: CabangReq) => {
      return val.data;
    },
  }
);

const setCursor = (val: "prev" | "next") => {
  if (val === "next") {
    const next = `${data?.value?.nextCursor ?? ""}`;
    if (cursors.value.length === 0) {
      cursors.value = [undefined];
    }
    cursors.value = [...cursors.value, data?.value?.nextCursor ?? undefined];
    skip.value = next;
    return;
  }
  if (val === "prev") {
    let cur = cursors.value.pop();
    cur = cursors.value.pop();
    skip.value = `${cur ?? ""}`;
    if (cursors.value.length === 0 && cur === undefined) {
      cursors.value = [undefined];
    } else {
      cursors.value = [...cursors.value, cur];
    }
  }

  return;
};
</script>

<template>
  <div
    class="flex flex-col gap-2 w-[calc(100svw-2rem)] md:w-[calc(100svw-4rem)]"
  >
    <div class="flex items-center justify-between">
      <UButton variant="outline" size="sm">Add New Cabang</UButton>
    </div>
    <div
      class="h-48 bg-stone-200 rounded flex justify-center items-center"
      v-if="status === 'pending'"
    >
      <LoadingSpinner></LoadingSpinner>
    </div>
    <div
      class="h-48 bg-stone-200 rounded flex justify-center items-center flex-col"
      v-else-if="data?.cabang.length === 0"
    >
      <div class="font-medium">No Data</div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3">
      <UCard v-for="i in data?.cabang" class="flex flex-col justify-between">
        <template #header>
          <div class="flex justify-center bg-slate-100 rounded-t">
            <NuxtImg
              class="w-52"
              :src="'https://api.ystfamily.com/img/' + i.picture?.path"
            >
            </NuxtImg>
          </div>

          <div class="font-medium text-label">
            <div class="text-label_lg font-semibold">{{ i.nama }}</div>
            <div>{{ i.openHour }} - {{ i.closeHour }}</div>
          </div>
        </template>
        <div class="font-medium text-label">
          <div>
            {{ i.alamat }}
          </div>

          <div>
            {{ i.phoneNumber }}
          </div>
        </div>
        <template #footer>
          <div class="flex gap-2">
            <UButton class="bg-blue-700 hover:bg-blue-500" size="sm"
              >Edit</UButton
            >
            <UButton class="bg-red-700" size="sm">Hapus</UButton>
          </div>
        </template>
      </UCard>
    </div>
    <div class="flex gap-2 justify-end">
      <UButton
        v-if="data"
        color="black"
        size="sm"
        class="px-8"
        @click="() => setCursor('prev')"
        :disabled="cursors.length === 1"
        >Prev</UButton
      >
      <UButton
        v-if="data"
        size="sm"
        color="black"
        class="px-8"
        @click="() => setCursor('next')"
        :disabled="data?.nextCursor === undefined || data?.nextCursor === null"
        >Next</UButton
      >
    </div>
  </div>
</template>
