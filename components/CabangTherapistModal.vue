<script setup lang="ts">
import type { SResponse } from "~/lib/app";
import type { VTherapist } from "~/lib/types";
import { genderList, titleCase } from "~/lib/utils";

const search = ref("");
const gender = ref();
const searchNo = ref();
const app = useApp();

const emit = defineEmits<{
  select: [id: number];
}>();

type TherapistReq = SResponse<{
  therapist: VTherapist[];
  nextCursor: number | null;
}>;

const url = computed(() => {
  return `/server/therapist?query=${search.value ?? ""}&gender=${
    gender.value ?? ""
  }&no=${searchNo.value ?? ""}&has_cabang=98jia&limit=10`;
});

const { data: therapists, status: therapistStatus } = useApiFetch(
  () => url.value,
  {
    headers: app.bearer(),
    transform: (val: TherapistReq) => {
      return val.data?.therapist ?? [];
    },
  }
);
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
          <UFormGroup label="Search No">
            <UInput v-model="searchNo" placeholder="Search No" class="w-full" />
          </UFormGroup>

          <UFormGroup label="Search Name">
            <UInput v-model="search" placeholder="Search Name" class="w-full" />
          </UFormGroup>
          <UFormGroup label="Gender">
            <VDropdown
              class="w-full"
              :show-label="false"
              :items="genderList()"
              v-model="gender"
              label="Select Gender"
              :display="(v) => titleCase(v)"
            ></VDropdown>
          </UFormGroup>
        </div>
        <div
          class="grid"
          :style="{
            gridTemplateColumns: 'repeat(3, auto)',
          }"
        >
          <div
            class="grid col-span-full grid-cols-subgrid bg-slate-300/80 p-2 font-semibold rounded-lg"
          >
            <div>No</div>
            <div>Name</div>
            <div>Gender</div>
          </div>
          <div
            v-if="therapistStatus === 'pending'"
            class="h-40 grid place-items-center"
          >
            <LoadingSpinner />
          </div>
          <div
            v-else-if="(therapists ?? []).length === 0"
            class="h-40 grid place-items-center"
          >
            <div>Belum Ada Treatment</div>
          </div>
          <template v-else>
            <button
              @click="emit('select', i.id)"
              class="grid col-span-full grid-cols-subgrid p-2 text-label font-medium"
              v-for="i in therapists"
            >
              <div>{{ i.no }}</div>

              <div>
                {{ i.nama }}
              </div>
              <div>{{ titleCase(i.gender) }}</div>
            </button>
          </template>
        </div>
      </UCard>
    </div>
  </UModal>
</template>

<style scoped></style>
