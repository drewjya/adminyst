<script setup lang="ts">
import type { SResponse } from "~/lib/app";
import type { VCategory, VTags, VTherapist, VTreatment } from "~/lib/types";

const search = ref("");

const selectedTags = ref<VTags | undefined>();

const selectedCategory = ref<VCategory | undefined>();

const selectedTreamtner = ref<VTreatment | undefined>();

const route = useRoute();
const emit = defineEmits<{
  select: [id: number];
}>();

type TherapistReq = SResponse<{
  therapist: VTherapist[];
  nextCursor: number | null;
}>;

const categorySearch = useSearch();

const searchCategory = async (query: string) =>
  categorySearch.search<
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

const tagsSearch = useSearch();

const searchTags = async (query: string) =>
  tagsSearch.search<
    {
      tags: VTags[];
    },
    VTags[]
  >(`/server/tags?limit=6&query=${query}`, {
    default: <VTags[]>[],
    transform: (val) => {
      return val?.tags ?? [];
    },
  });

const treatmentSearch = useSearch();

const searchTreatment = async (query: string) => {
  return treatmentSearch.search<
    {
      treatment: VTreatment[];
    },
    VTreatment[]
  >(
    `/server/treatment?query=${query}&category=${
      selectedCategory.value?.id ?? ""
    }&tag=${selectedTags.value?.id ?? ""}&cabang=${route.params.id}&limit=8`,
    {
      default: <VTreatment[]>[],
      transform: (val) => {
        return val?.treatment ?? [];
      },
    }
  );
};
</script>

<template>
  <UModal>
    <div class="p-4 rounded-md">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold text-label_lg">Pilih Therapist</p>
          </div>
        </template>

        <div class="max-w-[42rem] flex flex-col gap-3 pb-3">
          <UFormGroup label="Search Name">
            <UInput v-model="search" placeholder="Search Name" class="w-full" />
          </UFormGroup>

          <UFormGroup label="Category">
            <USelectMenu
              placeholder="Search Category"
              :loading="categorySearch.loading.value"
              :searchable="searchCategory"
              option-attribute="nama"
              by="id"
              v-model="selectedCategory"
            />
          </UFormGroup>

          <UFormGroup label="Tags">
            <USelectMenu
              placeholder="Search Tags"
              :loading="tagsSearch.loading.value"
              :searchable="searchTags"
              option-attribute="name"
              by="id"
              v-model="selectedTags"
            />
          </UFormGroup>
          <UFormGroup label="Choose Treatment">
            <USelectMenu
              placeholder="Search treatment"
              :loading="treatmentSearch.loading.value"
              :searchable="searchTreatment"
              by="id"
              v-model="selectedTreamtner"
            >
              <template #option="{ option }">
                <p>{{ (option as VTreatment).nama }}</p>
              </template>
            </USelectMenu>
          </UFormGroup>
        </div>
      </UCard>
    </div>
  </UModal>
</template>

<style scoped></style>
