<script setup lang="ts">
import dayjs from "dayjs";
import type { SResponse } from "~/lib/app";
import type {
  VCabangDetail,
  VCabangTreatment,
  VOrder,
  VTherapist,
} from "~/lib/types";
import { currencyFormat, hari, titleCase } from "~/lib/utils";

const app = useApp();
const route = useRoute();
const { data, status } = useApiFetch(`/server/cabang/${route.params.id}`, {
  headers: app.bearer(),
  transform: (data: SResponse<VCabangDetail>) => {
    return data.data;
  },
});
const runtime = useRuntimeConfig();
const day = dayjs().format("YYYY-MM-DD");

const nextMonth = dayjs().add(1, "month").format("YYYY-MM-DD");

const url = computed(
  () =>
    `/server/order?start=${day}&end=${nextMonth}&cabangId=${route.params.id}&limit=7&status=`
);

type OrderReq = SResponse<{
  order: VOrder[];
  nextCursor: number | null;
}>;

type TreatmentReq = SResponse<VCabangTreatment[]>;
const {
  status: statusOrders,
  data: orders,
  error,
} = await useApiFetch(() => url.value, {
  headers: app.bearer(),
  transform: (val: OrderReq) => {
    return val.data;
  },
});

const { data: treatments, status: treatmentStatus } = useApiFetch(
  `/server/cabangtreatment?limit=7&cabangId=${route.params.id}`,
  {
    headers: app.bearer(),
    transform: (val: TreatmentReq) => {
      return val.data;
    },
  }
);

type TherapistReq = SResponse<{
  therapist: VTherapist[];
  nextCursor: number | null;
}>;

const {
  data: therapists,
  refresh,
  status: therapistStatus,
} = useApiFetch(`/server/therapist?limit=7&cabang=${route.params.id ?? ""}`, {
  headers: app.bearer(),
  transform: (val: TherapistReq) => {
    return val.data?.therapist ?? [];
  },
});
</script>

<template>
  <div
    v-if="status === 'pending'"
    class="flex justify-center items-center grow"
  >
    <LoadingSpinner />
  </div>
  <div v-else-if="data" class="flex flex-col gap-4 grow">
    <div class="flex justify-between items-center">
      <div>
        <p class="text-head_5 font-semibold">
          {{ data.nama }}
        </p>
      </div>
      <NuxtLink
        to="/cabang"
        class="px-2 py-1 hover:bg-slate-100 rounded-md font-bold underline"
        >Kembali</NuxtLink
      >
    </div>
    <div class="flex gap-2">
      <NuxtImg
        :src="runtime.public.imageUrl + data.picture?.path"
        class="h-[10.5rem] rounded-xl p-1 border"
        v-if="data.picture"
      />

      <div
        class="grid grid-cols-6 grid-rows-3 border rounded-xl p-2 divide-y-2 gap-2"
      >
        <div class="col-span-6 flex flex-col row-span-2 gap-2">
          <div>{{ data.openHour }} - {{ data.closeHour }}</div>
          <div>
            <p class="font-semibold">Happy Hour</p>
            <div v-if="data.happyHour" class="flex flex-col gap-1">
              <UBadge
                v-if="data.happyHour.publicHoliday"
                class="w-max"
                label="Libur Nasional"
                color="black"
              />

              <li v-for="hpp in data.happyHour.happyHourDetail">
                {{ hari[hpp.startDay] }} - {{ hari[hpp.endDay] }}
                <span class="pl-2">
                  ({{ hpp.startHour }} - {{ hpp.endHour }})
                </span>
              </li>
            </div>
          </div>
        </div>
        <div class="row-span-1 flex col-span-full font-semibold">
          <p>{{ data.alamat }}</p>
        </div>
      </div>
    </div>
    <div class="grow h-full w-full flex flex-col gap-3 pb-20">
      <OrderList
        :detail="true"
        :orders="orders?.order ?? []"
        :next-cursor="orders?.nextCursor ?? null"
        :status="statusOrders"
      />

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold text-label_lg">Treatment</p>
            <NuxtLink
              :to="`/cabang/${$route.params.id}/treatment`"
              class="p-2 py-0.5 hover:bg-gray-200 rounded underline"
            >
              Detail
            </NuxtLink>
          </div>
        </template>
        <div
          class="grid"
          :style="{
            gridTemplateColumns: 'repeat(4, auto)',
          }"
        >
          <div
            class="grid col-span-full grid-cols-subgrid bg-slate-300/80 p-2 font-semibold rounded-lg"
          >
            <div>Name</div>
            <div>Category</div>
            <div>Tag</div>
            <div>Harga</div>
          </div>
          <div
            v-if="treatmentStatus === 'pending'"
            class="h-40 grid place-items-center"
          >
            <LoadingSpinner />
          </div>
          <div
            v-else-if="(treatments ?? []).length === 0"
            class="h-40 grid place-items-center"
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
                <UBadge
                  color="yellow"
                  label="Optional"
                  v-if="i.treatment.category.optional"
                />
              </div>
              <div>{{ i.treatment.tags?.name }}</div>
              <div class="text-label_sm">
                <div>{{ currencyFormat(i.price) }}</div>
                <div v-if="i.treatment.category.happyHourPrice">
                  {{ currencyFormat(i.happyHourPrice) }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold text-label_lg">Therapist</p>
            <NuxtLink
              :to="`/cabang/${$route.params.id}/therapist`"
              class="p-2 py-0.5 hover:bg-gray-200 rounded underline"
            >
              Detail
            </NuxtLink>
          </div>
        </template>

        <div
          class="grid"
          :style="{
            gridTemplateColumns: 'repeat(6, auto)',
          }"
        >
          <div
            class="grid col-span-full grid-cols-subgrid bg-slate-300/80 p-2 font-semibold rounded-lg"
          >
            <div>No</div>
            <div>Name</div>
            <div>Gender</div>
            <div>Cabang</div>
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
            </div>
          </template>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped></style>
