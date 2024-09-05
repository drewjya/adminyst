<script setup lang="ts">
import { watchIgnorable } from "@vueuse/core";
import type { SResponse } from "~/lib/app";
import { formatDate } from "~/lib/date";
import type { Gender, OrderStatus } from "~/lib/enum";
import type { VOrder } from "~/lib/types";
import {
  currencyFormat,
  genderList,
  orderStatusList,
  percentageVal,
  titleCase,
  todayString,
  type Profit,
} from "~/lib/utils";
const app = useApp();
const route = useRoute();
const router = useRouter();
type Cur = number | undefined;
const cursors = ref<Cur[]>([undefined]);
const skip = ref("");
const therapist = ref("");
const user = ref("");
const email = ref("");
const initDate = new Date();
const phone = ref("");
const kodeNomor = ref("");
const date = ref() as Ref<{
  start: Date;
  end: Date;
}>;
const orderStatus = ref<OrderStatus | "">("");
const gender = ref<Gender | undefined>();

const listStatus = [...orderStatusList(), ""];

const watcher = watchIgnorable(
  [gender, orderStatus, date, email, phone, skip, kodeNomor, user, therapist],
  () => {
    router.replace({
      query: {
        ...route.query,
        start: `${formatDate(date.value.start)}`,
        end: `${formatDate(date.value.end)}`,
        status: `${orderStatus.value}`,
        therapist: `${therapist.value}`,
        name: `${user.value}`,
        email: `${email.value}`,
        phone: `${phone.value}`,
        no: `${kodeNomor.value}`,
        gender: `${gender.value ?? ""}`,
        cursor: `${skip.value}`,
      },
    });
  }
);

const resetDate = () => {
  return {
    start: new Date(
      initDate.getFullYear(),
      initDate.getMonth(),
      initDate.getDate()
    ),
    end: new Date(
      initDate.getFullYear(),
      initDate.getMonth() + 1,
      initDate.getDate()
    ),
  };
};

onMounted(() => {
  const {
    gender: genderVal,
    status,
    start,
    end,
    email: emailVal,
    phone: phoneVal,
    cursor,
    no,
    therapist: therapistVal,
    name,
  } = route.query;
  const startDate = start ? new Date(`${start}`) : undefined;
  const endDate = end ? new Date(`${end}`) : undefined;

  if (!(startDate && endDate)) {
    date.value = resetDate();
  }
  watcher.ignoreUpdates(() => {
    console.log(start, end);

    console.log(startDate, endDate);

    if (startDate && endDate) {
      date.value = {
        start: startDate,
        end: endDate,
      };
    }
    gender.value = genderVal ? (genderVal as Gender) : undefined;
    orderStatus.value = status ? (status as OrderStatus) || "" : "";

    kodeNomor.value = no ? `${no}` : "";

    email.value = emailVal ? `${emailVal}` : "";
    phone.value = phoneVal ? `${phoneVal}` : "";
    skip.value = cursor ? `${cursor}` : "";
    therapist.value = therapistVal ? `${therapistVal}` : "";
    user.value = name ? `${name}` : "";
  });
});

const url = computed(
  () =>
    `/server/order?start=${route.query.start ?? ""}&end=${
      route.query.end ?? ""
    }&cabangId=${route.params.id}&status=${
      route.query.status ?? ""
    }&therapist=${route.query.therapist ?? ""}&name=${
      route.query.name ?? ""
    }&email=${route.query.email ?? ""}&phone=${
      route.query.phone ?? ""
    }&gender=${route.query.gender ?? ""}&cursor=${
      route.query.cursor ?? ""
    }&no=${route.query.no ?? ""}`
);

type OrderReq = SResponse<{
  order: VOrder[];
  nextCursor: number | null;
}>;

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
const { data: income } = await useApiFetch(
  () =>
    `/server/order/income?date=${todayString()}&status=${
      route.query.status ?? ""
    }&cabangId=${route.params.id}`,
  {
    headers: app.bearer(),
    transform: (
      val: SResponse<{
        monthly: Profit;
        weekly: Profit;
      }>
    ) => {
      return val.data;
    },
  }
);
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-2">
    <UCard>
      <template #header class="pb-2">
        <h1>This Week</h1>
        <p class="text-4xl" v-if="income">
          {{ currencyFormat(income.weekly.now) }}
        </p>
        <div class="text-xs text-muted-foreground" v-if="income">
          {{ percentageVal(income.weekly, "week") }}
        </div>
      </template>
    </UCard>

    <UCard>
      <template #header class="pb-2">
        <h1>This Month</h1>
        <p class="text-4xl" v-if="income">
          {{ currencyFormat(income.monthly.now) }}
        </p>
        <div class="text-xs text-muted-foreground" v-if="income">
          {{ percentageVal(income.monthly, "month") }}
        </div>
      </template>
    </UCard>
  </div>
  <div
    class="flex items-center gap-2 flex-wrap md:flex-nowrap md:justify-between"
  >
    <DateRangePicker v-model="date" />
    <div class="flex gap-2 items-center">
      <VDropdown
        :show-label="false"
        :items="genderList()"
        v-model="gender"
        label="Gender"
        :display="(v) => titleCase(v)"
      />
      <VDropdown
        label="Order Status"
        v-model="orderStatus"
        :show-label="false"
        :display="(v) => titleCase(v === '' ? 'All' : v)"
        :items="listStatus"
      />

      <UButton
        variant="outline"
        color="black"
        @click="
          () => {
            orderStatus = '';
            date = resetDate();
            gender = undefined;
            therapist = '';
          }
        "
        icon="i-material-symbols-light:close-rounded"
        size="sm"
        class="h-7 gap-1 rounded-md px-3"
        label="Reset"
      >
      </UButton>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
    <UInput
      v-model="therapist"
      placeholder="Search Nama Therapist"
      class="max-w-[30rem]"
    />
    <UInput
      v-model="kodeNomor"
      placeholder="Search No Therapist"
      class="max-w-[30rem]"
    />
    <UInput
      v-model="user"
      placeholder="Search Nama User"
      class="max-w-[30rem]"
    />
    <UInput
      v-model="email"
      placeholder="Search Email User"
      class="max-w-[30rem]"
    />
    <UInput
      v-model="phone"
      placeholder="Search No Telp User"
      class="max-w-[30rem]"
    />
  </div>
  <OrderList
    :orders="orders?.order ?? []"
    :next-cursor="orders?.nextCursor ?? null"
    :status="statusOrders"
  />
</template>

<style scoped></style>
