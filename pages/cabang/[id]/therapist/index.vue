<script setup lang="ts">
import { watchIgnorable } from "@vueuse/core";
import CabangTherapistModal from "~/components/CabangTherapistModal.vue";
import type { SResponse } from "~/lib/app";
import type { Gender } from "~/lib/enum";
import type { VTherapist } from "~/lib/types";
import { formatDateString, genderList, titleCase } from "~/lib/utils";

type TherapistReq = SResponse<{
  therapist: VTherapist[];
  nextCursor: number | null;
}>;

const route = useRoute();
const app = useApp();
const router = useRouter();

const skip = ref();
const searchName = ref("");
const gender = ref<Gender | undefined>();
const searchNo = ref("");

const ignore = watchIgnorable([skip, gender, searchName, searchNo], () => {
  router.replace({
    query: {
      ...route.query,
      query: `${searchName.value}`,
      gender: `${gender.value ?? ""}`,
      no: `${searchNo.value}`,
      cursor: `${skip.value}`,
    },
  });
});

onMounted(() => {
  ignore.ignoreUpdates(() => {
    skip.value = `${route.query.skip ?? ""}`;
    gender.value = route.query.gender
      ? (route.query.gender as Gender)
      : undefined;
    searchName.value = `${route.query.query ?? ""}`;
    searchNo.value = `${route.query.no ?? ""}`;
    // searchCabang.value = `${route.query.skip ??''}`
  });
});

const url = computed(() => {
  return `/server/therapist?query=${route.query.query ?? ""}&gender=${
    route.query.gender ?? ""
  }&no=${route.query.no ?? ""}&cabang=${route.params.id ?? ""}&cursor=${
    route.query.cursor ?? ""
  }&limit=10`;
});
const {
  data: therapists,
  refresh,
  status: therapistStatus,
} = useApiFetch(() => url.value, {
  headers: app.bearer(),
  transform: (val: TherapistReq) => {
    return (val.data?.therapist ?? []).map((e) => {
      return {
        ...e,
        attendance: e.attendance
          ? {
              ...e.attendance,
              checkIn: e.attendance.checkIn!
                ? new Date(`${e.attendance.checkIn}`)
                : undefined,
              checkOut: e.attendance.checkOut!
                ? new Date(`${e.attendance.checkOut}`)
                : undefined,
            }
          : undefined,
      };
    });
  },
});
const reset = () => {
  gender.value = undefined;
  searchName.value = "";
  searchNo.value = "";
};
const deleteS = useApi();
const deleteTherapist = (id: number) =>
  deleteS.call({
    url: `/server/cabangtherapist/${id}?cabang=${route.params.id}`,
    method: "delete",
    title: "Therapist Cabang",
    onSuccess: refresh,
  });

const checkIn = (id: number) =>
  deleteS.call({
    url: `/server/therapist/${id}/checkin?cabang=${route.params.id}`,
    method: "post",
    title: "Therapist Cabang",
    onSuccess: refresh,
  });

const checkout = (id: number) =>
  deleteS.call({
    url: `/server/therapist/${id}/checkout?cabang=${route.params.id}`,
    method: "post",
    title: "Therapist Cabang",
    onSuccess: refresh,
  });

const selectTherapist = (id: number) =>
  deleteS.call({
    url: `/server/cabangtherapist/${id}?cabang=${route.params.id}`,
    method: "post",
    title: "Therapist Cabang",
    onSuccess: () => {
      modal.close();
      refresh();
    },
  });

const modal = useModal();

const open = () => {
  modal.open(CabangTherapistModal, {
    onSelect: (id) => {
      selectTherapist(id);
    },
  });
};
</script>

<template>
  <div class="max-w-[42rem] flex flex-col gap-3">
    <div class="flex justify-end">
      <ULink
        class="border rounded px-2 py-0.5 border-black text-label_sm"
        size="sm"
        variant="outline"
        @click="$router.replace(`/cabang/${route.params.id}`)"
        >Kembali</ULink
      >
    </div>
    <UFormGroup label="Search No">
      <UInput v-model="searchNo" placeholder="Search No" class="w-full" />
    </UFormGroup>

    <UFormGroup label="Search Name">
      <UInput v-model="searchName" placeholder="Search Name" class="w-full" />
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
    <UButton
      label="Add Cabang Therapist"
      size="sm"
      color="black"
      @click="open"
    />
  </div>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <p class="font-semibold text-label_lg">Therapist</p>
        <UButton label="Reset" size="xs" color="black" @click="reset" />
      </div>
    </template>

    <div
      class="grid"
      :style="{
        gridTemplateColumns: `repeat(${
          (therapists ?? []).length === 0 ? '4' : '8'
        }, auto)`,
      }"
    >
      <div
        class="grid col-span-full grid-cols-subgrid bg-slate-300/80 p-2 font-semibold rounded-lg"
      >
        <div>No</div>
        <div>Name</div>
        <div>Gender</div>
        <div>Cabang</div>
        <div v-if="(therapists ?? []).length !== 0">Check In</div>
        <div v-if="(therapists ?? []).length !== 0">Check Out</div>
        <div v-if="(therapists ?? []).length !== 0">Action</div>
      </div>
      <div
        v-if="therapistStatus === 'pending'"
        class="h-40 grid place-items-center col-span-full"
      >
        <LoadingSpinner />
      </div>
      <div
        v-else-if="(therapists ?? []).length === 0"
        class="h-40 grid place-items-center col-span-full"
      >
        <div>Belum Ada Treatment</div>
      </div>
      <template v-else>
        <div
          class="grid col-span-full grid-cols-subgrid p-2 text-label font-medium"
          v-for="i in therapists"
        >
          <div>{{ i.no }}</div>

          <div>
            {{ i.nama }}
          </div>
          <div>{{ titleCase(i.gender) }}</div>
          <div>
            {{ i.cabang?.nama }}
          </div>
          <div class="flex justify-center items-center">
            <UButton
              v-if="!i.attendance?.checkIn"
              size="xs"
              color="black"
              class="text-black"
              variant="outline"
              @click="() => checkIn(i.id)"
              label="Check In"
            />

            <div v-else class="flex flex-col items-center">
              <p class="font-semibold">
                {{
                  formatDateString("HH:mm:ss", i.attendance.checkIn.toString())
                }}
              </p>
              <p class="text-label_sm">
                {{
                  formatDateString(
                    "DD-MM-YYYY",
                    i.attendance.checkIn.toString()
                  )
                }}
              </p>
            </div>
          </div>

          <div class="flex justify-center">
            <div v-if="!i.attendance?.checkIn" size="sm" variant="secondary">
              -
            </div>
            <UButton
              v-else-if="!i.attendance?.checkOut"
              label="Check Out"
              size="xs"
              color="black"
              class="text-black"
              @click="() => checkout(i.id)"
              variant="outline"
            />
            <div v-else class="flex flex-col items-center">
              <p class="font-semibold">
                {{
                  formatDateString("HH:mm:ss", i.attendance.checkOut.toString())
                }}
              </p>
              <p class="text-label_sm">
                {{
                  formatDateString(
                    "DD-MM-YYYY",
                    i.attendance.checkOut.toString()
                  )
                }}
              </p>
            </div>
          </div>
          <div>
            <EditDeleteButton :remove="() => deleteTherapist(i.id)" />
          </div>
        </div>
      </template>
    </div>
  </UCard>
</template>

<style scoped></style>
