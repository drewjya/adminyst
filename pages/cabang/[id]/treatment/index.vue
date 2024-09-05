<script setup lang="ts">
import { watchIgnorable } from "@vueuse/core";
import type { SResponse } from "~/lib/app";
import type { VCabangTreatment, VCategory, VTags } from "~/lib/types";
import { currencyFormat } from "~/lib/utils";

const app = useApp();
const route = useRoute();
const router = useRouter();

type Cur = number | undefined;
const cursors = ref<Cur[]>([undefined]);
const skip = ref("");
const search = ref("");
const selectedTags = ref<VTags | undefined>();
const selectedCategory = ref<VCategory | undefined>();
type TreatmentReq = SResponse<VCabangTreatment[]>;
const url = computed(
  () =>
    `/server/cabangtreatment?limit=10&cabangId=${route.params.id}&query=${
      route.query.search ?? ""
    }&category=${selectedCategory.value?.id ?? ""}&tag=${
      selectedTags.value?.id ?? ""
    }`
);
const ignore = watchIgnorable([search], () => {
  router.replace({
    query: {
      ...route.query,
      search: search.value,
    },
  });
});

onMounted(() => {
  ignore.ignoreUpdates(() => {
    search.value = `${route.query.query ?? ""}`;
  });
});

const { data: treatments, status: treatmentStatus } = useApiFetch(
  () => url.value,
  {
    headers: app.bearer(),
    transform: (val: TreatmentReq) => {
      return val.data;
    },
  }
);

const searchApi = useSearch();
const searchCategory = async (query: string) =>
  searchApi.search<
    {
      category: VCategory[];
    },
    VCategory[]
  >(`/server/category?limit=6&query=${query}`, {
    default: <VCategory[]>[],
    transform: (val) => {
      return val?.category ?? [];
    },
  });
const searchTagAPi = useSearch();

const searchTags = async (query: string) =>
  searchTagAPi.search<
    {
      tags: VTags[];
    },
    VTags[]
  >(`server/tags?limit=6&query=${query}`, {
    default: <VTags[]>[],
    transform: (val) => {
      return val?.tags ?? [];
    },
  });

const reset = () => {
  selectedTags.value = undefined;
  search.value = "";
  selectedCategory.value = undefined;
};
</script>

<template>
  <div class="max-w-[30rem]">
    <UFormGroup label="Category">
      <USelectMenu
        placeholder="Search Category"
        :loading="searchApi.loading.value"
        :searchable="searchCategory"
        option-attribute="nama"
        by="id"
        v-model="selectedCategory"
      />
    </UFormGroup>
    <UFormGroup label="Tags">
      <USelectMenu
        placeholder="Search Tags"
        :loading="searchTagAPi.loading.value"
        :searchable="searchTags"
        option-attribute="name"
        by="id"
        v-model="selectedTags"
      />
    </UFormGroup>
    <UFormGroup label="Name">
      <UInput v-model="search" placeholder="Search Name" />
    </UFormGroup>
  </div>

  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <p class="font-semibold text-label_lg">Treatment</p>
        <UButton label="Reset" size="xs" color="black" @click="reset" />
      </div>
    </template>
    <div
      class="grid"
      :style="{
        gridTemplateColumns: `repeat(${
          (treatments ?? []).length === 0 ? '4' : '5'
        }, auto)`,
      }"
    >
      <div
        class="grid col-span-full grid-cols-subgrid bg-slate-300/80 p-2 font-semibold rounded-lg"
      >
        <div>Name</div>
        <div>Category</div>
        <div>Tag</div>
        <div>Harga</div>
        <div v-if="(treatments ?? []).length !== 0">Action</div>
      </div>
      <div
        v-if="treatmentStatus === 'pending'"
        class="h-40 grid place-items-center col-span-full"
      >
        <LoadingSpinner />
      </div>
      <div
        v-else-if="(treatments ?? []).length === 0"
        class="h-40 grid place-items-center col-span-full"
      >
        <div>Belum Ada Treatment</div>
      </div>
      <template v-else>
        <div
          class="grid col-span-full grid-cols-subgrid p-2 text-label font-medium"
          v-for="i in treatments"
        >
          <div>{{ i.treatment.nama }}</div>

          <div>
            <div>
              {{ i.treatment.category.nama }}
            </div>
            <div class="flex items-center gap-3">
              <UBadge
                color="yellow"
                label="Optional"
                v-if="i.treatment.category.optional"
              />

              <UBadge
                color="lime"
                label="Happy Hour"
                v-if="i.treatment.category.happyHourPrice"
              />
            </div>
          </div>
          <div>{{ i.treatment.tags?.name }}</div>
          <div class="text-label_sm">
            <div>{{ currencyFormat(i.price) }}</div>
            <UBadge v-if="i.treatment.category.happyHourPrice" color="lime">
              {{ currencyFormat(i.happyHourPrice) }}
            </UBadge>
          </div>
          <div>
            <EditDeleteButton :edit="() => {}" :remove="() => {}" />
          </div>
        </div>
      </template>
    </div>
  </UCard>
</template>

<style scoped></style>
