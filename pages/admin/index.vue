<script setup lang="ts">
import type { SResponse } from "~/lib/app";
import type { VAdmin } from "~/lib/types";

const app = useApp();
const { data, status, refresh } = useApiFetch("/server/admin", {
  headers: app.bearer(),
  transform: (
    data: SResponse<{
      admins: VAdmin[];
    }>
  ) => data.data?.admins ?? [],
});

const loading = ref(false);
const notif = useNotif();
const runtime = useRuntimeConfig();
const editForm = async (
  email: string,
  password: string,
  id: number,
  cabangId: number
) => {
  loading.value = true;
  try {
    const res = await $fetch<SResponse<any>>("/server/admin", {
      baseURL: runtime.public.baseUrl,
      method: "put",
      headers: app.bearer(),
      body: {
        adminId: id,
        cabangId: cabangId,
        email: email,
        password: password,
      },
    });
    if (res.data) {
      notif.success({
        title: "Success edit admin",
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
const deleteForm = async (id: number, cabangId: number) => {
  loading.value = true;
  try {
    const res = await $fetch<SResponse<any>>(`/server/admin/${id}`, {
      baseURL: runtime.public.baseUrl,
      method: "DELETE",
      headers: app.bearer(),
      body: {
        cabangId: cabangId,
      },
    });
    if (res.data) {
      notif.success({
        title: "Success delete admin",
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
  <ULink class="p-2 rounded ring-1 text-black text-center" to="/admin/add"
    >Add New Admin</ULink
  >
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
  <div v-else class="grid md:grid-cols-2 gap-3">
    <AdminCard
      v-for="i in data"
      :admin="i"
      @remove="() => deleteForm(i.id, i.adminCabang.id)"
      @edit="
        (email, password) => editForm(email, password, i.id, i.adminCabang.id)
      "
    />
  </div>
</template>

<style scoped></style>
