<script setup lang="ts">
import EditDeleteButton from "~/components/EditDeleteButton.vue";
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
const loadingCategory = ref(false);
const runtime = useRuntimeConfig().public.baseUrl;
async function searchCategory(query: string) {
  loadingCategory.value = true;
  try {
    const res: SResponse<{
      category: VCategory[];
    }> = await $fetch(`/server/category?limit=6&query=${query}`, {
      baseURL: runtime,
      headers: app.bearer(),
    });
    loadingCategory.value = false;
    return res.data?.category ?? <VCategory[]>[];
  } catch (error) {
    loadingCategory.value = false;
    return <VCategory[]>[];
  }
}
const loadingTag = ref(false);
async function searchTag(query: string) {
  loadingTag.value = true;
  try {
    const res: SResponse<{
      tags: VTags[];
    }> = await $fetch(`/server/tags?limit=6&query=${query}`, {
      baseURL: runtime,
      headers: app.bearer(),
    });
    loadingTag.value = false;
    return res.data?.tags ?? <VTags[]>[];
  } catch (error) {
    loadingTag.value = false;
    return <VTags[]>[];
  }
}
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
    <div class="flex gap-2 items-end">
      <div>
        <ULink
          variant="outline"
          size="xs"
          class="text-label_sm border p-2 rounded border-black font-semibold"
          >Add New Treatment</ULink
        >
      </div>
      <div class="max-w-[30rem]">
        <UFormGroup label="Category">
          <USelectMenu
            placeholder="Search Category"
            :loading="loadingCategory"
            :searchable="searchCategory"
            option-attribute="nama"
            by="id"
            v-model="selectedCategory"
          />
        </UFormGroup>
      </div>
      <div class="max-w-[30rem]">
        <UFormGroup label="Tags">
          <USelectMenu
            placeholder="Search Tags"
            :loading="loadingTag"
            :searchable="searchTag"
            option-attribute="name"
            by="id"
            v-model="selectedTags"
          />
        </UFormGroup>
      </div>
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
