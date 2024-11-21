<script setup lang="ts">
import { z } from "zod";
import type { VCategory } from "~/lib/types";

const { category } = defineProps<{
  category: VCategory;
}>();

const schema = z.object({
  nama: z.string(),
  optional: z.boolean(),
  happyHourPrice: z.boolean(),
});

type State = z.output<typeof schema>;

const state = ref<State>();

onMounted(() => {
  state.value = {
    nama: category.nama,
    optional: category.optional,
    happyHourPrice: category.happyHourPrice,
  };
});
</script>

<template>
  <UModal>
    <UCard>
      <template #header>
        <p class="text-head_6 font-semibold">Edit Category</p>
      </template>
      <UForm :schema :state class="flex flex-col gap-2" v-if="state">
        <UFormGroup label="Nama">
          <UInput placeholder="Nama" v-model="state.nama" />
        </UFormGroup>
        <UFormGroup label="Opsional">
          <UCheckbox label="Opsional" v-model="state.optional" />
        </UFormGroup>
        <UFormGroup label="Punya Happy Hour">
          <UCheckbox label="Bisa happy hour" v-model="state.happyHourPrice" />
        </UFormGroup>
        <UButton label="Kirim" size="xs" color="black" />
      </UForm>
    </UCard>
  </UModal>
</template>

<style scoped></style>
