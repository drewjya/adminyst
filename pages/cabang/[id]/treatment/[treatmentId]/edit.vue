<script setup lang="ts">
import { z } from "zod";
import type { SResponse } from "~/lib/app";
import type { FormSubmitEvent, VCabangTreatment } from "~/lib/types";

const route = useRoute();

const schema = z.object({
  price: z.number(),
  happyHourPrice: z.number(),
});

type Schema = z.output<typeof schema>;

const state = reactive<{
  price: number;
  happyHourPrice: number;
}>({
  price: 0,
  happyHourPrice: 0,
});

const api = useApi();
const router = useRouter();
console.log(route.params);
const app = useApp();
const { data, status } = useApiFetch(
  `/server/cabangtreatment/${route.params.treatmentId}?cabang=${route.params.id}`,
  {
    headers: app.bearer(),
    transform: (val: SResponse<VCabangTreatment>) => {
      return val.data;
    },
  }
);

watch(data, (val) => {
  state.price = val?.price ?? 0;
  state.happyHourPrice = val?.happyHourPrice ?? 0;
});
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const data = event.data;
  api.call({
    url: "/server/cabangtreatment",
    method: "put",
    title: "Treatment Cabang",
    body: {
      ...data,
      treatmentId: +route.params.treatmentId,
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
          <p class="font-semibold text-label_lg">Edit Treatment Cabang</p>
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
        <div class="flex flex-col gap-2 border p-2 rounded w-full font-medium">
          <p class="text-label_lg font-bold">{{ data?.treatment.nama }}</p>
          <div class="text-label flex flex-col">
            <div class="font-semibold">Category</div>
            <div class="flex gap-2 text-label_sm items-center">
              <div>
                {{ data?.treatment.category.nama }}
              </div>
              <UBadge
                v-if="data?.treatment.category.happyHourPrice"
                label="Happy Hour"
                color="lime"
              />
              <UBadge
                v-if="data?.treatment.category.optional"
                label="Optional"
                color="yellow"
              />
            </div>
          </div>
          <div class="text-label flex flex-col">
            <div class="font-semibold">Tags</div>
            <p class="text-label_sm">{{ data?.treatment.tags?.name }}</p>
          </div>
        </div>
        <UFormGroup label="Price" name="price">
          <UInput v-model.number="state.price" type="number" />
        </UFormGroup>
        <UFormGroup
          label="Happy Hour Price"
          name="happyHourPrice"
          v-if="data?.treatment.category.happyHourPrice"
        >
          <UInput v-model.number="state.happyHourPrice" type="number" />
        </UFormGroup>
        <UButton color="black" type="submit">Submit</UButton>
      </UForm>
    </UCard>
  </div>
</template>

<style scoped></style>
