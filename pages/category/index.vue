<script setup lang="ts">
import ModalAddCategory from "~/components/ModalAddCategory.vue";
import ModalEditCategory from "~/components/ModalEditCategory.vue";
import type { SResponse } from "~/lib/app";
import type { VCategory } from "~/lib/types";

const app = useApp();

const query = ref("");
const { data, status, refresh } = await useApiFetch(
  () => `/server/category?limit=10&query=${query.value}`,

  {
    headers: app.bearer(),
    transform: (
      val: SResponse<{
        category: VCategory[];
      }>
    ) => {
      return val.data?.category;
    },
  }
);
const modal = useModal();

const addNew = () => {
  modal.open(ModalAddCategory, {});
};
const editModal = (category: VCategory) => {
  console.log(category);

  modal.open(ModalEditCategory, {
    category: category,
  });
};
</script>

<template>
  <div class="flex justify-between items-center">
    <p class="font-bold text-head_5">Category</p>
    <div class="flex justify-end gap-2">
      <UButton label="Add Category" size="xs" color="black" @click="addNew" />
      <ULink
        class="border rounded px-2 py-0.5 border-black text-label_sm"
        size="sm"
        variant="outline"
        @click="$router.replace('/treatment')"
        >Kembali</ULink
      >
    </div>
  </div>
  <div class="grid grid-cols-5 space-x-1">
    <div
      class="grid col-span-full grid-cols-subgrid bg-gray-200 p-2 rounded text-label_sm font-semibold"
    >
      <div>No</div>
      <div>Nama</div>
      <div>Optional</div>
      <div>Happy Hour</div>
      <div>Action</div>
    </div>
    <div
      class="grid col-span-full p-2 grid-cols-subgrid text-label_sm"
      v-for="(i, index) in data"
      :class="index % 2 === 1 ? 'bg-gray-100/100' : ''"
    >
      <div>{{ i.id }}</div>
      <div>{{ i.nama }}</div>
      <div>{{ i.optional ? "Ya" : "Tidak" }}</div>
      <div>{{ i.happyHourPrice ? "Bisa" : "Tidak" }}</div>
      <div>
        <EditDeleteButton :remove="() => {}" :edit="() => editModal(i)" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
