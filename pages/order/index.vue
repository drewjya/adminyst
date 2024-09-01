<script setup lang="ts">
import { formatDate } from "~/lib/date";
import type { Gender, OrderStatus } from "~/lib/enum";
import type { VOrder } from "~/lib/types";
import { orderStatusList } from "~/lib/utils";

type Cur = number | undefined;
const cursors = ref<Cur[]>([undefined]);
const skip = ref("");
const therapist = ref("");
const user = ref("");
const email = ref("");
const initDate = new Date();
const phone = ref("");

type OrderReq = {
  order: VOrder[];
  nextCursor: number | null;
};

const date = ref({
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
}) as Ref<{
  start: Date;
  end: Date;
}>;

const orderStatus = ref<OrderStatus | "">("");
const gender = ref<Gender | undefined>();
const listStatus = orderStatusList();
const { status, data } = await useApiFetch<OrderReq>(
  () =>
    `/server/order?start=${
      date.value.start ? formatDate(date.value.start!) : ""
    }&end=${date.value.end ? formatDate(date.value.end!) : ""}&status=${
      orderStatus.value
    }&therapist=${therapist.value}&name=${user.value}&email=${
      email.value
    }&phone=${phone.value}&gender=${gender.value ?? ""}&cursor=${skip.value}`,
  {
    headers: {
      Authorization: "Bearer test",
    },
  }
);
const route = useRoute();
const router = useRouter();
watch([gender, orderStatus, date, email, phone, skip], () => {
  router.replace({
    query: {
      ...route.query,
      start: `${date.value.start ?? ""}`,
      end: `${date.value.end ?? ""}`,
      status: `${orderStatus.value}`,
      therapist: `${therapist.value}`,
      name: `${user.value}`,
      email: `${email.value}`,
      phone: `${phone.value}`,
      gender: `${gender.value ?? ""}`,
      cursor: `${skip.value}`,
    },
  });
});

onMounted(() => {
  const {
    gender: genderVal,
    status,
    start,
    end,
    email: emailVal,
    phone: phoneVal,
    cursor,
    therapist: therapistVal,
    name,
  } = route.query;
  const startDate = start ? new Date(`${start}`) : undefined;
  const endDate = end ? new Date(`${end}`) : undefined;
  gender.value = genderVal ? (genderVal as Gender) : undefined;
  orderStatus.value = status ? (status as OrderStatus) || "" : "";
  if (startDate && endDate) {
    date.value = {
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
  }

  email.value = emailVal ? `${emailVal}` : "";
  phone.value = phoneVal ? `${phoneVal}` : "";
  skip.value = cursor ? `${cursor}` : "";
  therapist.value = therapistVal ? `${therapistVal}` : "";
  user.value = name ? `${name}` : "";
});
</script>

<template>
  <div>Page: order/index</div>
</template>

<style scoped></style>
