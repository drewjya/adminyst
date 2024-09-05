<script setup lang="ts">
import type { OrderStatus } from "~/lib/enum";
import type { State, VOrderDetail, VTherapist } from "~/lib/types";
import {
  currencyFormat,
  formatDateString,
  genOrderStatus,
  titleCase,
} from "~/lib/utils";

const { state } = defineProps<{
  state: State<VOrderDetail>;
}>();

// const value = ref<OrderStatus | undefined>()

const emit = defineEmits<{
  // <eventName>: <expected arguments>
  select: [value: OrderStatus, therapistId: number]; // named tuple syntax
}>();

const selectedTherapist = ref<VTherapist>();

const app = useApp();

const search = ref("");
const searchNo = ref("");

const url = computed(() => {
  return `/server/therapist?query=${search.value ?? ""}&gender=${
    state.data?.therapistGender ?? ""
  }&no=${searchNo.value ?? ""}&cabang=${app.user?.cabang}&limit=6`;
});

const searchName = useSearch();

const nameSearch = async (query: string) => {
  search.value = query;
  return searchName.search<
    {
      therapist: VTherapist[];
    },
    VTherapist[]
  >(url.value, {
    default: <VTherapist[]>[],
    transform: (val) => {
      return val?.therapist ?? [];
    },
  });
};

const noSearch = async (query: string) => {
  searchNo.value = query;
  return searchName.search<
    {
      therapist: VTherapist[];
    },
    VTherapist[]
  >(url.value, {
    default: <VTherapist[]>[],
    transform: (val) => {
      return val?.therapist ?? [];
    },
  });
};
const notif = useNotif();
const onClick = (e: OrderStatus) => {
  const therapistId = selectedTherapist.value?.id ?? state.data?.therapist?.id;
  if (therapistId) {
    emit("select", e, therapistId);
    return;
  }
  notif.error({
    title: "Something Wrong",
    description: "Mohon Isi Therapist",
  });
};
</script>

<template>
  <UCard v-if="state.loading || state.data">
    <template #header>
      <div
        class="flex flex-row justify-between items-start bg-muted/50 font-medium sticky top-0"
      >
        <div class="grid gap-0.5">
          <div class="group flex items-center gap-1 text-label_lg font-bold">
            <USkeleton
              v-if="state.loading"
              class="h-5 w-52 rounded-md"
            ></USkeleton>

            <div v-else-if="state.data">{{ state.data.orderId }}</div>
            <UButton
              v-if="state.data"
              icon="i-material-symbols:content-copy"
              variant="soft"
              size="xs"
              color="black"
              class="hover:bg-black/10"
            />
          </div>
          <USkeleton v-if="state.loading" class="w-64 h-4"></USkeleton>
          <h3
            v-else-if="state.data"
            class="text-label_lg bg-green-500 text-center text-white font-bold"
          >
            {{
              formatDateString(
                "DD MMM YYYY, HH:mm",
                new Date(state.data.orderTime!).toString()
              )
            }}
          </h3>
        </div>
        <div class="flex items-center">
          <ULink
            class="border rounded px-2 py-0.5 border-black text-label_sm"
            size="sm"
            variant="outline"
            @click="$router.go(-1)"
            >Kembali</ULink
          >
        </div>
      </div>
    </template>

    <div class="p-2 text-sm">
      <div class="flex flex-col gap-3 pb-5">
        <div class="font-semibold">Order Status</div>
        <USkeleton class="w-20 h-4" v-if="state.loading"></USkeleton>
        <div v-else-if="state.data" class="flex justify-between">
          <VBadgeStatus :status="state.data.orderStatus" />

          <div
            class="ml-auto flex items-center gap-1"
            v-if="
              state.data &&
              state.data.orderStatus !== 'COMPLETE' &&
              state.data.orderStatus !== 'CANCELLED'
            "
          >
            <UDropdown
              :items="[
                genOrderStatus(
                  state.data.orderStatus,
                  state.data.picture !== null &&
                    state.data.picture !== undefined
                ).map((e) => {
                  return {
                    label: titleCase(e),
                    click: () => onClick(e),
                  };
                }),
              ]"
            >
              <UButton
                label="Update Status"
                size="xs"
                color="black"
                variant="outline"
              />
            </UDropdown>
          </div>
        </div>
        <UDivider />
      </div>
      <div class="grid gap-3">
        <div class="font-semibold">Order Details</div>
        <ul class="grid gap-3" v-if="state.loading">
          <li class="flex items-center justify-between" v-for="i in 3">
            <USkeleton class="h-4 w-32"></USkeleton>
            <USkeleton class="h-4 w-20"></USkeleton>
          </li>
        </ul>
        <ul class="grid gap-3" v-else-if="state.data">
          <li
            class="flex items-center justify-between"
            v-for="i in state.data.orderDetails"
          >
            <span class="text-muted-foreground">{{ i.nama }}</span>
            <span>{{ currencyFormat(i.price) }}</span>
          </li>
        </ul>
        <UDivider />
        <ul class="grid gap-3" v-if="state.data">
          <li class="flex items-center justify-between font-semibold">
            <span class="text-muted-foreground">Total</span>
            <USkeleton v-if="state.loading" class="w-24 h-4"></USkeleton>
            <span v-else-if="state.data">{{
              currencyFormat(state.data.totalPrice)
            }}</span>
          </li>
        </ul>
      </div>
      <UDivider class="my-4" />
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-3">
          <div class="font-semibold">Therapist Information</div>
          <div v-if="state.loading" class="flex flex-col gap-2">
            <USkeleton class="h-4 w-20"></USkeleton>
            <USkeleton class="h-4 w-20"></USkeleton>
          </div>

          <address
            v-else-if="state.data"
            class="grow w-full gap-0.5 not-italic text-muted-foreground"
          >
            <div>
              {{
                state.data.therapist
                  ? `${titleCase(titleCase(state.data.therapist.nama))} (${
                      state.data.therapist.no
                    })`
                  : "Random"
              }}
            </div>
            <div>{{ titleCase(state.data.therapistGender) }}</div>
          </address>
        </div>
      </div>
      <UDivider class="my-4" />
      <div class="grid grid-cols-1 gap-3 max-w-[40rem]">
        <div class="flex justify-between items-center">
          <div class="font-semibold">Change Or Chose Therapist</div>
        </div>
        <USelectMenu
          v-model="selectedTherapist"
          :loading="searchName.loading.value"
          :searchable="nameSearch"
          by="id"
        >
          <template #label>
            {{
              selectedTherapist
                ? `${selectedTherapist.nama} (${selectedTherapist.no})`
                : "Pilih Therapist"
            }}
          </template>

          <template #option="{ option }">
            <p>{{ (option as VTherapist).nama }}</p>
          </template>
        </USelectMenu>
        <USelectMenu
          class="w-full"
          v-model="selectedTherapist"
          :searchable="noSearch"
          :loading="searchName.loading.value"
          by="id"
        >
          <template #label>
            {{
              selectedTherapist
                ? `${selectedTherapist.nama} (${selectedTherapist.no})`
                : "Pilih Therapist"
            }}
          </template>

          <template #option="{ option }">
            <p>{{ (option as VTherapist).nama }}</p>
          </template>
        </USelectMenu>
      </div>
      <UDivider class="my-4" />
      <div class="grid gap-3">
        <div class="font-semibold">Customer Information</div>
        <dl class="grid gap-3" v-if="state.loading">
          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">Gender Customer</dt>
            <USkeleton class="w-11 h-4"></USkeleton>
          </div>

          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">No WA Customer</dt>
            <USkeleton class="w-24 h-4"></USkeleton>
          </div>
        </dl>
        <dl class="grid gap-3" v-else-if="state.data">
          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">Gender Customer</dt>
            <dd>{{ titleCase(state.data.guestGender) }}</dd>
          </div>

          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">No WA Customer</dt>
            <dd>
              <a href="tel:">{{ state.data.guestPhoneNumber }}</a>
            </dd>
          </div>
        </dl>
      </div>
      <UDivider class="my-4" />
      <div class="grid gap-3">
        <div class="font-semibold">Account Information</div>
        <dl class="grid gap-3" v-if="state.loading">
          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">Nama User</dt>
            <USkeleton class="w-11 h-4"></USkeleton>
          </div>

          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">No WA User</dt>
            <USkeleton class="w-24 h-4"></USkeleton>
          </div>

          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">Email User</dt>
            <USkeleton class="w-24 h-4"></USkeleton>
          </div>
        </dl>
        <dl class="grid gap-3" v-else-if="state.data">
          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">Nama User</dt>
            <dd>
              {{
                `${titleCase(state.data.user.name)} ( ${titleCase(
                  state.data.user.gender ?? "-"
                )} )`
              }}
            </dd>
          </div>

          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">No WA User</dt>
            <dd>
              {{
                state.data.user.phoneNumber.length === 0
                  ? "-"
                  : state.data.user.phoneNumber
              }}
            </dd>
          </div>
          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">Email User</dt>
            <dd>
              {{ state.data.user.email }}
            </dd>
          </div>
        </dl>
      </div>
      <UDivider class="my-4" />
      <div class="grid gap-3">
        <div class="font-semibold">Bukti Pembayaran</div>
        <dl class="grid gap-3" v-if="state.loading">
          <USkeleton class="w-screen h-40"></USkeleton>
        </dl>
        <div
          class="rounded border bg-slate-100 flex justify-center min-h-40 items-center"
          v-else-if="state.data"
        >
          <Dialog>
            <DialogTrigger as-child>
              <NuxtImg
                class="w-[20rem]"
                v-if="state.data.picture"
                :alt="state.data.picture.path"
                :src="
                  'https://api.ystfamily.com/img/' + state.data.picture.path
                "
              ></NuxtImg>
            </DialogTrigger>
            <DialogContent class="flex justify-center bg-slate-100">
              <NuxtImg
                class="max-h-[80vh] min-h-[70vh]"
                v-if="state.data.picture"
                :alt="state.data.picture.path"
                :src="
                  'https://api.ystfamily.com/img/' + state.data.picture.path
                "
              ></NuxtImg>
            </DialogContent>
          </Dialog>
          <div v-if="!state.data.picture">
            <p>Belum Ada Bukti Pembayaran</p>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
