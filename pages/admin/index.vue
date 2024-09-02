<script setup lang="ts">
import type { SResponse } from "~/lib/app";
import type { VAdmin } from "~/lib/types";

const app = useApp();
const { data, status } = useApiFetch("/server/admin", {
  headers: app.bearer(),
  transform: (
    data: SResponse<{
      admins: VAdmin[];
    }>
  ) => data.data?.admins ?? [],
});

const runtime = useRuntimeConfig();

const emails = ref<string[]>([]);
const passwords = ref<string[]>([]);

watch(data, (val) => {
  if (val) {
    const datas = val.map((e) => {
      return e.email;
    });
    emails.value = datas;
    passwords.value = datas.map((e) => "");
  } else {
    emails.value = [];
    passwords.value = [];
  }
});
</script>

<template>
  <ULink class="p-2 rounded ring-1 text-black">Add New Admin</ULink>
  <div
    v-if="status === 'pending'"
    class="flex justify-center items-center h-20"
  >
    <LoadingSpinner />
  </div>
  <div
    v-else-if="(data ?? []).length === 0"
    class="flex justify-center items-center h-20"
  >
    <p>Belum Ada Admin</p>
  </div>
  <div v-else class="grid md:grid-cols-2 gap-3 p-4">
    <UCard v-for="(i, index) in data" class="text-label font-medium">
      <template #header>
        <div class="text-label_lg font-semibold">
          {{ i.adminCabang.nama }}
        </div>
      </template>
      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-center bg-slate-200/20">
          <NuxtImg
            v-if="i.adminCabang.picture"
            :src="runtime.public.imageUrl + i.adminCabang.picture.path"
            class="w-52"
          />
        </div>
        <div class="capitalize text-lg font-semibold">
          {{ i.role.toLowerCase() }}
        </div>
        <UFormGroup label="Email">
          <UInput v-model="emails[index]" />
        </UFormGroup>
        <UFormGroup label="Password">
          <UInput v-model="passwords[index]" />
        </UFormGroup>
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>
