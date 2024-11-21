<script setup lang="ts">
import ModalAddTag from "~/components/ModalAddTag.vue";
import ModalEditTag from "~/components/ModalEditTag.vue";
import type { SResponse } from "~/lib/app";
import type { VTags } from "~/lib/types";

const app = useApp();

const query = ref("");
const { data, status, refresh } = await useApiFetch(
  () => `/server/tags?limit=10&query=${query.value}`,

  {
    headers: app.bearer(),
    transform: (
      val: SResponse<{
        tags: VTags[];
      }>
    ) => {
      return val.data?.tags;
    },
  }
);

const modal = useModal();

const addNew = () => {
  modal.open(ModalAddTag, {});
};

const editModal = (tag:VTags) => {
  modal.open(ModalEditTag, {});
};


</script>

<template>
  <div class="flex justify-between items-center">
    <p class="font-bold text-head_5">Tags</p>
    <UButton label="Add Tags" size="xs" color="black" @click="addNew" />
  </div>
  <div class="grid grid-cols-3 space-x-1">
    <div class="grid col-span-full grid-cols-subgrid bg-gray-200 p-2 rounded">
      <div>No</div>
      <div>Name</div>
      <div>Action</div>
    </div>
    <div
      class="grid col-span-full p-2 grid-cols-subgrid"
      v-for="(i, index) in data"
      :class="index % 2 === 1 ? 'bg-gray-100/100' : ''"
    >
      <div>{{ i.id }}</div>
      <div>{{ i.name }}</div>
      <div><EditDeleteButton :remove="() => {}" :edit="() => editModal(i)" /></div>
    </div>
  </div>
</template>

<style scoped></style>
