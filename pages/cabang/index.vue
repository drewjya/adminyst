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
      <ULink class="px-2 py-1 border border-black rounded-md" to="/cabang/add"
        >Add New Cabang</ULink
      >
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
      <div
        v-for="i in data?.cabang"
        class="grid grid-rows-[auto_5rem_5fr] space-y-2 divide-y border border-black/10 rounded-lg"
      >
        <div data-role="header" class="p-3 pb-0 gap-1 flex flex-col">
          <div class="flex justify-center bg-slate-100 rounded-t">
            <NuxtImg
              class="w-52"
              :src="'https://api.ystfamily.com/img/' + i.picture?.path"
            >
            </NuxtImg>
          </div>

          <div class="flex justify-between">
            <ULink
              :to="`/cabang/${i.id}`"
              class="font-medium text-label text-start flex flex-col items-start w-full hover:bg-gray-100 p-2 rounded-xl"
            >
              <div class="text-label_lg font-semibold">{{ i.nama }}</div>
              <div>{{ i.openHour }} - {{ i.closeHour }}</div>
            </ULink>
            <div class="rounded-lg">
              <EditDeleteButton
                :edit="() => $router.push(`/cabang/${i.id}/edit`)"
                :remove="() => {}"
                class="w-full rounded-xl"
              />
            </div>
          </div>
        </div>
        <div
          data-role="body"
          class="font-medium flex flex-col gap-1 items-start py-2 text-start justify-center px-3"
        >
          <div class="text-label">
            {{ i.alamat }}
          </div>

          <div class="text-label_sm">
            {{ i.phoneNumber }}
          </div>
        </div>
      </div>
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
