<script setup lang="ts">
import { watchIgnorable } from "@vueuse/core";
import type { SResponse } from "~/lib/app";
import { formatDate } from "~/lib/date";
import type { Gender } from "~/lib/enum";
import { OrderStatus } from "~/lib/enum";
import type { VOrder } from "~/lib/types";
import {
  currencyFormat,
  formatDateString,
  genderList,
  orderStatusList,
  percentageVal,
  titleCase,
  todayString,
  type Profit,
} from "~/lib/utils";

type Cur = number | undefined;
const cursors = ref<Cur[]>([undefined]);
const skip = ref("");
const therapist = ref("");
const user = ref("");
const email = ref("");
const initDate = new Date();
const phone = ref("");

type OrderReq = SResponse<{
  order: VOrder[];
  nextCursor: number | null;
}>;

const route = useRoute();
const router = useRouter();
const url = computed(
  () =>
    `/server/order?start=${route.query.start ?? ""}&end=${
      route.query.end ?? ""
    }&status=${route.query.status ?? ""}&therapist=${
      route.query.therapist ?? ""
    }&name=${route.query.name ?? ""}&email=${route.query.email ?? ""}&phone=${
      route.query.phone ?? ""
    }&gender=${route.query.gender ?? ""}&cursor=${
      route.query.cursor ?? ""
    }&no=${route.query.no ?? ""}`
);

const kodeNomor = ref("");
const date = ref() as Ref<{
  start: Date;
  end: Date;
}>;
const app = useApp();
const orderStatus = ref<OrderStatus | "">("");
const gender = ref<Gender | undefined>();
const listStatus = [...orderStatusList(), ""];

const { status, data, error } = await useApiFetch(() => url.value, {
  headers: app.bearer(),
  transform: (val: OrderReq) => {
    return val.data;
  },
});

const { data: income } = await useApiFetch(
  () =>
    `/server/order/income?date=${todayString()}&status=${
      route.query.status ?? ""
    }&cabangId=`,
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
  watcher.ignoreUpdates(() => {
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
    console.log(start, end);

    const startDate = start ? new Date(`${start}`) : undefined;
    const endDate = end ? new Date(`${end}`) : undefined;
    console.log(startDate, endDate);

    if (startDate && endDate) {
      date.value = {
        start: startDate,
        end: endDate,
      };
    } else {
      date.value = resetDate();
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
</script>

<template>
  <div
    class="flex flex-col gap-4 w-[calc(100svw-2rem)] md:w-[calc(100svw-4rem)]"
  >
    <main
      class="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
    >
      <div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
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
        <div class="flex flex-col gap-4">
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

          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">Orders</h3>
            </template>

            <section
              data-role="table-order-list"
              class="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-2"
            >
              <div
                data-role="table-order-header"
                class="sticky top-0 grid grid-cols-subgrid col-span-full font-semibold text-base bg-slate-200 p-2 rounded-md"
              >
                <div>Customer</div>
                <div>Therapist</div>
                <div>Cabang</div>
                <div class="hidden md:block">Status</div>
                <div>Bukti Bayar</div>
                <div>Tanggal</div>
              </div>
              <div
                v-if="status === 'pending'"
                class="col-span-full h-40 flex justify-center items-center"
              >
                <LoadingSpinner />
              </div>

              <div
                v-else-if="(data?.order ?? []).length === 0"
                class="col-span-full h-40 flex justify-center items-center"
              >
                <p class="text-sm">Belum Ada Order</p>
              </div>

              <template v-else>
                <button
                  @click="
                    () => {
                      $router.push(`/order/${i.id}`);
                    }
                  "
                  v-for="(i, index) in data?.order"
                  data-role="table-data-items"
                  class="col-span-full grid grid-cols-subgrid text-label font-medium hover:bg-slate-200 p-2 text-start"
                  :class="index % 2 === 0 ? '' : 'bg-slate-200/40'"
                >
                  <div class="flex flex-col items-start">
                    <div>{{ i.guestPhoneNumber }}</div>
                    <div class="flex items-center gap-2">
                      <p class="text-label_sm">
                        {{ titleCase(i.guestGender) }}
                      </p>
                      <VBadgeStatus
                        class="text-xs md:hidden"
                        :status="i.orderStatus"
                      />
                    </div>
                  </div>
                  <div class="text-start">
                    {{
                      i.therapist
                        ? `(${i.therapist?.no}) ${i.therapist.nama}`
                        : "Random"
                    }}
                  </div>
                  <div>{{ i.cabang.nama }}</div>
                  <div class="hidden md:block">
                    <VBadgeStatus class="text-xs" :status="i.orderStatus" />
                  </div>
                  <div>
                    <p>
                      {{ i.picture?.path ? "Sudah Upload" : "Belum Upload" }}
                    </p>
                  </div>
                  <div>
                    {{
                      formatDateString(
                        "DD MMM YYYY, HH:mm",
                        new Date(i.orderTime!).toString()
                      )
                    }}
                  </div>
                </button>
              </template>
            </section>

            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton
                  size="xs"
                  :disabled="status === 'pending' || cursors.length === 1"
                  @click="
                    () => {
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
                  variant="soft"
                  color="white"
                  icon="i-material-symbols:chevron-left"
                  class="hover:bg-primary/80 hover:text-primary-foreground"
                >
                </UButton>
                <UButton
                  size="xs"
                  color="white"
                  @click="
                    () => {
                      const next = `cursor=${data?.nextCursor}`;
                      if (cursors.length === 0) {
                        cursors = [undefined];
                      }

                      cursors = [...cursors, data?.nextCursor ?? undefined];
                      skip = next;
                    }
                  "
                  :disabled="data?.nextCursor === null || status === 'pending'"
                  variant="soft"
                  icon="i-material-symbols:chevron-right"
                  class="hover:bg-primary/80 hover:text-primary-foreground"
                >
                </UButton>
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
