<script lang="ts" setup>
import type { SResponse } from "~/lib/app";
import type { VBanner } from "~/lib/types";

const app = useApp();
const runtime = useRuntimeConfig();

const loading = ref(false);
const notif = useNotif();
const { data: banner, refresh } = useApiFetch("/server/banner", {
  transform: (
    data: SResponse<{
      banner: VBanner[];
    }>
  ) => data.data?.banner ?? [],
});
const deleteForm = async (id: number) => {
  loading.value = true;
  try {
    const res = await $fetch<SResponse<any>>(`/server/banner/${id}`, {
      baseURL: runtime.public.baseUrl,
      method: "DELETE",
      headers: app.bearer(),
    });
    if (res.data) {
      notif.success({
        title: "Success delete banner",
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
  <!-- <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
    <UCard x-chunk="dashboard-01-chunk-0">
      <template
        #header
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle class="text-sm font-medium"> Total Revenue </CardTitle>
        <DollarSign class="h-4 w-4 text-muted-foreground" />
      </template>
      <CardContent>
        <div class="text-2xl font-bold">$45,231.89</div>
        <p class="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </UCard>
    <UCard x-chunk="dashboard-01-chunk-1">
      <template
        #header
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle class="text-sm font-medium"> Subscriptions </CardTitle>
        <Users class="h-4 w-4 text-muted-foreground" />
      </template>
      <CardContent>
        <div class="text-2xl font-bold">+2350</div>
        <p class="text-xs text-muted-foreground">+180.1% from last month</p>
      </CardContent>
    </UCard>
    <UCard x-chunk="dashboard-01-chunk-2">
      <template
        #header
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle class="text-sm font-medium">Sales</CardTitle>
        <CreditCard class="h-4 w-4 text-muted-foreground" />
      </template>
      <CardContent>
        <div class="text-2xl font-bold">+12,234</div>
        <p class="text-xs text-muted-foreground">+19% from last month</p>
      </CardContent>
    </UCard>
    <UCard x-chunk="dashboard-01-chunk-3">
      <template
        #header
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle class="text-sm font-medium">Active Now</CardTitle>
        <Activity class="h-4 w-4 text-muted-foreground" />
      </template>
      <CardContent>
        <div class="text-2xl font-bold">+573</div>
        <p class="text-xs text-muted-foreground">+201 since last hour</p>
      </CardContent>
    </UCard>
  </div> -->

  <div
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-2 auto-rows-auto"
  >
    <template v-if="banner">
      <div
        class="rounded-md overflow-clip object-cover bg-gray-100 p-2 relative flex items-start justify-end group"
        v-for="item in banner"
      >
        <NuxtImg
          :src="runtime.public.imageUrl + item.path"
          class="w-full rounded"
          draggable="false"
        />
        <EditDeleteButton
          :remove="() => deleteForm(item.id)"
          class="absolute bg-white/30 group-hover:bg-white/70 rounded-xl"
        />
      </div>
    </template>
    <ULink
      class="h-full w-full bg-gray-100 flex flex-col items-center justify-center text-label font-semibold py-9"
      to="/banner/add"
    >
      <UIcon name="i-material-symbols:add" color="black" />
      <div>Add Banner</div>
    </ULink>
  </div>
  <div></div>
</template>
