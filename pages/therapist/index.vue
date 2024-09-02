<script setup lang="ts">



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
type TherapistReq = SResponse<{
  therapist: VTherapist[];
  nextCursor: number | null;
}>;
const app = useApp()
const { data, status } = await useApiFetch(
  () =>
    `/server/therapist?query=${searchName.value}&gender=${gender.value ?? ""}&no=${
      searchNo.value
    }&cabang=${searchCabang.value?.id ?? ""}&${skip.value ?? ""}`,
    {
    headers: app.bearer(),
    transform: (val: TherapistReq) => {
      return val.data;
    },
  }

);

const { data: cabang, status: cabangStatus } = await useLazyFetch<{
  cabang: VCabang[];
}>("/api/cabang");

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

watch(searchName, () => {
  if (!skip) {
    return;
  }

  skip.value = "";
  cursors.value = [undefined];
});

watch(searchNo, () => {
  if (!skip) {
    return;
  }

  skip.value = "";
  cursors.value = [undefined];
});

watch(searchCabang, () => {
  if (!skip) {
    return;
  }

  skip.value = "";
  cursors.value = [undefined];
});

watch(gender, () => {
  if (!skip) {
    return;
  }

  skip.value = "";
  cursors.value = [undefined];
});
</script>

<template>
  <div
    class="flex flex-col gap-2 w-[calc(100svw-2rem)] md:w-[calc(100svw-4rem)]"
  >
    <div class="flex items-center justify-between">
      <AppBreadCrumb />

      <Button variant="outline" size="sm">Add New Therapist</Button>
    </div>

    <div class="flex gap-3 items-center">
      <Input v-model="searchNo" placeholder="Search No" />
      <VDropdown
        :items="cabang?.cabang"
        :loading="cabangStatus === 'pending'"
        :display="(v) => v.nama"
        :show-label="false"
        label="Cabang"
        v-model="searchCabang"
      />
      <VDropdown
        :show-label="false"
        :items="genderList()"
        v-model="gender"
        label="Gender"
        :display="(v) => titleCase(v)"
      ></VDropdown>
    </div>
    <VTable

      placeholder="Search Name"
      @reset="
        () => {
          searchName = '';
          skip = '';
          gender = undefined;
          searchNo = '';
          searchCabang = undefined;
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
        <TableCell>
          <div class="flex justify-center">
            <Button
              v-if="!data.attendance?.checkIn"
              size="sm"
              variant="outline"
            >
              Check In
            </Button>
            <p v-else>
              {{ data.attendance?.checkIn?.toString() }}
            </p>
          </div>
        </TableCell>
        <TableCell>
          <div class="flex justify-center">
            <div v-if="!data.attendance?.checkIn" size="sm" variant="secondary">
              -
            </div>
            <Button
              v-else-if="!data.attendance?.checkOut"
              size="sm"
              variant="outline"
            >
              Check Out
            </Button>
            <p v-else>
              {{ data.attendance?.checkOut?.toString() }}
            </p>
          </div>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon class="h-4 w-4" />
                <span class="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-[160px]">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem> Delete </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </template>
    </VTable>
  </div>
</template>
