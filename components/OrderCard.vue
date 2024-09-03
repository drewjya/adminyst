<script setup lang="ts">
import type { OrderStatus } from "~/lib/enum";
import type { State, VOrderDetail } from "~/lib/types";
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
  select: [value: OrderStatus]; // named tuple syntax
}>();
// watch(value, (val) => {
//   if (val) {

//     emit('update', val)
//   }
// })
</script>

<template>
  <UCard v-if="state.loading || state.data">
    <template #header>
      <div
        class="flex flex-row justify-between items-start bg-muted/50 font-medium sticky top-0"
      >
        <div class="grid gap-0.5">
          <div class="group flex items-center gap-1 text-label_lg font-bold">
            <Skeleton
              v-if="state.loading"
              class="h-5 w-52 rounded-md"
            ></Skeleton>

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
          <Skeleton v-if="state.loading" class="w-64 h-4"></Skeleton>
          <h3 v-else-if="state.data" class="text-label">
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
        <Skeleton class="w-20 h-4" v-if="state.loading"></Skeleton>
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
                    click: () => emit('select', e),
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
            <Skeleton class="h-4 w-32"></Skeleton>
            <Skeleton class="h-4 w-20"></Skeleton>
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
            <Skeleton v-if="state.loading" class="w-24 h-4"></Skeleton>
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
          <div v-if="state.loading">
            <Skeleton class="h-4 w-20"></Skeleton>
            <Skeleton class="h-4 w-20"></Skeleton>
          </div>
          <address
            class="grid gap-0.5 not-italic text-muted-foreground"
            v-else-if="state.data"
          >
            <span>
              {{
                state.data.therapist
                  ? `${titleCase(titleCase(state.data.therapist.nama))} (${
                      state.data.therapist.no
                    })`
                  : "Random"
              }}
            </span>
            <span>{{ titleCase(state.data.therapistGender) }}</span>
          </address>
        </div>
      </div>
      <UDivider class="my-4" />
      <div class="grid gap-3">
        <div class="font-semibold">Customer Information</div>
        <dl class="grid gap-3" v-if="state.loading">
          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">Gender Customer</dt>
            <Skeleton class="w-11 h-4"></Skeleton>
          </div>

          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">No WA Customer</dt>
            <Skeleton class="w-24 h-4"></Skeleton>
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
            <Skeleton class="w-11 h-4"></Skeleton>
          </div>

          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">No WA User</dt>
            <Skeleton class="w-24 h-4"></Skeleton>
          </div>

          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">Email User</dt>
            <Skeleton class="w-24 h-4"></Skeleton>
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
          <Skeleton class="w-screen h-40"></Skeleton>
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
