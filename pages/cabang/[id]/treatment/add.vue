<script setup lang="ts">
import { z } from "zod";
import type { SResponse } from "~/lib/app";
import type {
  FormSubmitEvent,
  VCategory,
  VTags,
  VTherapist,
  VTreatment,
} from "~/lib/types";

const search = ref("");

const selectedTags = ref<VTags | undefined>();

const selectedCategory = ref<VCategory | undefined>();

const selectedTreamtner = ref<VTreatment | undefined>();

const route = useRoute();

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

const casting = ({
  data,
  transform,
}: {
  data: any;
  transform: (curr: VTreatment) => string;
}) => {
  return transform(data as VTreatment);
};

const schema = z.object({
  price: z.number(),
  happyHourPrice: z.number(),

  treatmentId: z.number(),
});

type Schema = z.output<typeof schema>;

const state = reactive<{
  price: number;
  happyHourPrice: number;
  treatmentId: number | undefined;
}>({
  price: 0,
  happyHourPrice: 0,

  treatmentId: undefined,
});

watch(selectedTreamtner, (val) => {
  state.treatmentId = val?.id;
});
const api = useApi();
const router = useRouter();
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const data = event.data;
  api.call({
    url: "/server/cabangtreatment",
    method: "post",
    title: "Treatment Cabang",
    body: {
      ...data,
      cabangId: +route.params.id,
    },
    onSuccess: () => {
      router.push(`/cabang/${route.params.id}/treatment`);
    },
  });
};
</script>

<template>
  <div class="p-4 rounded-md">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <p class="font-semibold text-label_lg">Tambah Treatment Cabang</p>
          <NuxtLink
            :to="`/cabang/${$route.params.id}/treatment`"
            class="px-2 py-1 hover:bg-slate-100 rounded-md font-bold underline"
            >Kembali</NuxtLink
          >
        </div>
      </template>

      <UForm
        :schema
        :state
        class="max-w-[42rem] flex flex-col gap-3 pb-3"
        @submit.prevent="onSubmit"
        @error="
          (e) => {
            console.log(e);
          }
        "
      >
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
        <UFormGroup label="Choose Treatment" name="treatmentId">
          <USelectMenu
            placeholder="Search treatment"
            :loading="treatmentSearch.loading.value"
            :debounce="500"
            searchable-lazy
            clear-search-on-close
            :searchable="searchTreatment"
            by="id"
            v-model="selectedTreamtner"
          >
            <template #option="{ option }">
              <p>
                {{
                  casting({
                    data: option,
                    transform: (v) =>
                      `${v.nama} (${v.category.nama}) (${v.tags?.name})`,
                  })
                }}
              </p>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup label="Price" name="price">
          <UInput v-model.number="state.price" type="number" />
        </UFormGroup>
        <UFormGroup
          label="Happy Hour Price"
          name="happyHourPrice"
          v-if="selectedCategory?.happyHourPrice"
        >
          <UInput v-model.number="state.happyHourPrice" type="number" />
        </UFormGroup>
        <UButton color="black" type="submit">Submit</UButton>
      </UForm>
    </UCard>
  </div>
</template>

<style scoped></style>
