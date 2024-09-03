<script setup lang="ts">
import { watchIgnorable } from "@vueuse/core";
import type { SResponse } from "~/lib/app";
import type { Gender } from "~/lib/enum";
import type { VCabang, VTableColumn, VTherapist } from "~/lib/types";
import { genderList, titleCase } from "~/lib/utils";
type Cur = number | undefined;
const cursors = ref<Cur[]>([undefined]);
const skip = ref("");
const searchName = ref("");
const gender = ref<Gender | undefined>();
const searchNo = ref("");
const searchCabang = ref<VCabang | undefined>();
const loading = ref(false);
const selectedCabang = ref<VCabang>();
type TherapistReq = SResponse<{
  therapist: VTherapist[];
  nextCursor: number | null;
}>;
const app = useApp();

const route = useRoute();
const router = useRouter();
const ignore = watchIgnorable(
  [skip, gender, searchName, searchNo, selectedCabang],
  () => {
    router.replace({
      query: {
        ...route.query,
        query: `${searchName.value}`,
        gender: `${gender.value ?? ""}`,
        no: `${searchNo.value}`,
        cabang: `${selectedCabang.value?.id ?? ""}`,
        cursor: `${skip.value}`,
      },
    });
  }
);

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
  }&no=${route.query.no ?? ""}&cabang=${route.query.cabang ?? ""}&cursor=${
    route.query.cursor ?? ""
  }`;
});

const { data, refresh, status } = await useApiFetch(() => url.value, {
  headers: app.bearer(),
  transform: (val: TherapistReq) => {
    return val.data;
  },
});

const runtime = useRuntimeConfig();
async function search(query: string) {
  loading.value = true;
  try {
    const res: SResponse<{
      cabang: VCabang[];
      nextCursor: number | null;
    }> = await $fetch(`/server/cabang?limit=6&query=${query}`, {
      baseURL: runtime.public.baseUrl,
      headers: app.bearer(),
    });
    loading.value = false;
    return res.data?.cabang ?? <VCabang[]>[];
  } catch (error) {
    return <VCabang[]>[];
  }
}

const columns: VTableColumn<VTherapist>[] = [
  {
    class: "min-w-20",
    display: (data) => data.no ?? "-",
    key: "no",
    label: "No",
  },
  {
    class: "w-32",
    display: (data) => data.nama,
    key: "nama",
    label: "Nama",
  },
  {
    class: "w-32",

    key: "gender",
    label: "Gender",
  },
  {
    class: "w-20",
    display: (data) => data.cabang?.nama ?? "-",
    key: "cabang",
    label: "Cabang",
  },
];

const notif = useNotif();

const deleteForm = async (id: number) => {
  loading.value = true;
  try {
    const res = await $fetch<SResponse<any>>(`/server/therapist/${id}`, {
      baseURL: runtime.public.baseUrl,
      method: "DELETE",
      headers: app.bearer(),
    });
    if (res.data) {
      notif.success({
        title: "Success delete therapist",
      });
    } else {
      notif.error({
        title: "Something Wrong",
        description: res.message,
      });
    }
    loading.value = false;

    refresh();
  } catch (error: any) {
    if (error.data) {
      const data: SResponse<any> = error.data;
      notif.error({
        title: "Something Wrong",
        description: data.message,
      });
    } else {
      notif.error({
        title: "Something Wrong",
        description: "Try again later",
      });
    }
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="flex flex-col gap-2 w-[calc(100svw-2rem)] md:w-[calc(100svw-4rem)]"
  >
    <div class="flex items-center justify-end">
      <ULink
        variant="outline"
        size="xs"
        to="/therapist/add"
        class="text-label_sm border px-2 py-1.5 rounded border-black font-semibold"
        >Add New Therapist</ULink
      >
    </div>

    <div>
      <VDropdown
        :show-label="false"
        :items="genderList()"
        v-model="gender"
        label="Gender"
        :display="(v) => titleCase(v)"
      ></VDropdown>
    </div>

    <div class="max-w-[30rem]">
      <UFormGroup label="Cabang">
        <USelectMenu
          placeholder="Search Cabang"
          :loading
          :searchable="search"
          option-attribute="nama"
          by="id"
          v-model="selectedCabang"
        />
      </UFormGroup>
    </div>
    <UFormGroup label="Search No">
      <UInput
        v-model="searchNo"
        placeholder="Search No"
        class="w-full max-w-[30rem]"
      />
    </UFormGroup>

    <VTable
      placeholder="Belum Ada Terapis"
      @reset="
        () => {
          searchName = '';
          skip = '';
          gender = undefined;
          searchNo = '';
          selectedCabang = undefined;
          cursors = [undefined];
        }
      "
      @prev="
        () => {
          console.log(cursors);
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
      :prev="cursors.length !== 1"
      :next="data?.nextCursor !== undefined && data?.nextCursor !== null"
      @next="
        () => {
          const next = `cursor=${data?.nextCursor}`;
          if (cursors.length === 0) {
            cursors = [undefined];
          }

          cursors = [...cursors, data?.nextCursor ?? undefined];
          skip = next;
        }
      "
      :extra="3"
      :loading="status === 'pending'"
      :column="columns"
      :data="data?.therapist ?? undefined"
      :get-key="(data) => data.nama"
      v-model:search="searchName"
    >
      <template #head>
        <TableHead> Check In </TableHead>
        <TableHead> Check Out </TableHead>
        <TableHead> Actions </TableHead>
      </template>

      <template #default="{ data }">
        <div class="flex justify-center items-center">
          <UButton
            v-if="!data.attendance?.checkIn"
            size="xs"
            color="black"
            class="text-black"
            variant="outline"
            label="Check In"
          />

          <p v-else>
            {{ data.attendance?.checkIn?.toString() }}
          </p>
        </div>

        <div class="flex justify-center">
          <div v-if="!data.attendance?.checkIn" size="sm" variant="secondary">
            -
          </div>
          <UButton
            v-else-if="!data.attendance?.checkOut"
            label="Check Out"
            size="xs"
            color="black"
            class="text-black"
            variant="outline"
          />
          <p v-else>
            {{ data.attendance?.checkOut?.toString() }}
          </p>
        </div>

        <div>
          <EditDeleteButton
            :edit="() => {}"
            :remove="() => deleteForm(data.id)"
          />
        </div>
      </template>
    </VTable>
  </div>
</template>
