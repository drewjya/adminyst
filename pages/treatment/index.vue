<script setup lang="ts">
import EditDeleteButton from "~/assets/components/EditDeleteButton.vue";
import type { SResponse } from "~/lib/app";
import type { VCategory, VTableColumn, VTags, VTreatment } from "~/lib/types";
type Cur = number | undefined;
const cursors = ref<Cur[]>([undefined]);
const skip = ref("");
const search = ref("");
type TreatmentReq = SResponse<{
  treatment: VTreatment[];
  nextCursor: number | null;
}>;
const selectedTags = ref<VTags | undefined>();

const selectedCategory = ref<VCategory | undefined>();
const app = useApp();
const { data, status } = await useApiFetch(
  () =>
    `/server/treatment?query=${search.value}&category=${
      selectedCategory.value?.id ?? ""
    }&tag=${selectedTags.value?.id ?? ""}&${skip.value ?? ""}`,

  {
    headers: app.bearer(),
    transform: (val: TreatmentReq) => {
      return val.data;
    },
  }
);

const { data: category, status: categoryStatus } = await useApiFetch<{
  category: VCategory[];
}>("/api/category");

const { data: tags, status: tagStatus } = await useApiFetch<{
  tags: VTags[];
}>("/api/tags");

const columns: VTableColumn<VTreatment>[] = [
  {
    class: "min-w-40",
    display: (data) => data.nama,
    key: "nama",
    label: "Nama",
  },
  {
    class: "w-20",
    display: (data) => data.category.nama,
    key: "category",
    label: "Category",
  },
  {
    class: "w-20",
    display: (data) => data.tags?.name ?? "",
    key: "tags",
    label: "Tags",
  },
];

watch(search, () => {
  if (!skip) {
    return;
  }

  skip.value = "";
  cursors.value = [undefined];
});
</script>

<template>
  <div
    class="flex flex-col gap-2 w-[calc(100svw-2rem)] md:w-[calc(100svw-4rem)]"
  >
    <div class="flex gap-2">
      <ULink
        variant="outline"
        size="xs"
        class="text-label_sm border px-2 rounded border-black font-semibold"
        >Add New Treatment</ULink
      >
      <VDropdown
        :items="category?.category"
        :loading="categoryStatus === 'pending'"
        :display="(v) => v.nama"
        label="Category"
        v-model="selectedCategory"
      />
      <VDropdown
        :items="tags?.tags"
        :loading="tagStatus === 'pending'"
        :display="(v) => v.name"
        label="Tags"
        v-model="selectedTags"
      />
    </div>
    <VTable
      @reset="
        () => {
          search = '';
          skip = '';
          cursors = [undefined];
          selectedCategory = undefined;
          selectedTags = undefined;
        }
      "
      @prev="
        () => {
          console.log(cursors);
          let cur = cursors.pop();
          cur = cursors.pop();
          skip = `cursor=${cur ?? ''}`;
          if (cursors.length === 0 && cur === undefined) {
            cursors = [undefined];
          } else {
            cursors = [...cursors, cur];
          }
        }
      "
      :prev="cursors.length !== 1"
      :next="data?.nextCursor !== undefined && data?.nextCursor !== null"
      @next="
        () => {
          const next = `cursor=${data?.nextCursor}`;
          if (cursors.length === 0) {
            cursors = [undefined];
          }

          cursors = [...cursors, data?.nextCursor ?? undefined];
          skip = next;
        }
      "
      :loading="status === 'pending'"
      :column="columns"
      :data="data?.treatment ?? undefined"
      :get-key="(data) => data.nama"
      :extra="1"
      v-model:search="search"
    >
      <template #head>
        <TableHead> Actions </TableHead>
      </template>

      <template #default="{ data }">
        <EditDeleteButton :edit="() => {}" :remove="() => {}" />
      </template>
    </VTable>
  </div>
</template>
