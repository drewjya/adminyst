<script setup lang="ts">
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const form = useForm({
  schema: z.object({
    nama: z.string().min(4, "Min 4 characters"),
    phoneNumber: z.string(),
    openHour: z.object({
      hours: z.number(),
      minutes: z.number(),
      seconds: z.number(),
    }),
    closeHour: z.object({
      hours: z.number(),
      minutes: z.number(),
      seconds: z.number(),
    }),
    alamat: z.string(),
    happyHour: z.object({
      publicHoliday: z.boolean(),
      detail: z.array(
        z.object({
          startDay: z.number(),
          endDay: z.number(),
          startTime: z.string(),
          endTime: z.string(),
        })
      ),
    }),
    file: z
      .custom<File>((val) => val instanceof File, "Please upload a file")
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Please choose .json format files only",
      }),
  }),
  initial: {
    happyHour: {
      publicholiday: false,
      details: [
        {
          startDay: undefined,
          endDay: undefined,
          starTime: undefined,
          endTime: undefined,
        },
      ],
    },
  },
  onSubmit: async (e, f) => {},
});

const addDetail = () => {
  form.state.happyHour.detail;
};
</script>

<template>
  <div class="max-w-[42rem] flex flex-col gap-2">
    <UFormGroup label="Nama" name="nama">
      <UInput placeholder="Insert nama cabang" v-model="form.state.nama" />
    </UFormGroup>
    <UFormGroup label="No Telp" name="phoneNumber">
      <UInput
        placeholder="Insert no telp cabang"
        v-model="form.state.phoneNumber"
      />
    </UFormGroup>
    <div class="flex gap-2">
      <UFormGroup label="Open Hour" class="w-full">
        <UInput type="time" />
      </UFormGroup>
      <UFormGroup label="Close Hour" class="w-full">
        <UInput type="time" />
      </UFormGroup>
    </div>
    <UFormGroup label="Alamat" name="alamat">
      <UInput placeholder="Insert alamat" v-model="form.state.alamat" />
    </UFormGroup>

    <p class="text-label mt-2 font-semibold">Happy Hour</p>
    <div class="flex flex-col gap-2">
      <UCheckbox
        label="Termasuk Tanggal Merah"
        v-model="form.state.happyHour.publicHoliday"
      />
      <div class="flex gap-3 w-full">
        <UFormGroup
          class="w-full"
          :ui="{
            label: {
              base: 'text-label font-semibold',
            },
          }"
          label="Start"
        >
          <div class="flex flex-col gap-2">
            <USelectMenu
              placeholder="Start"
              v-model="form.state.happyHour.detail[0].startDay"
            />
            <UInput type="time" />
          </div>
        </UFormGroup>
        <UFormGroup
          class="w-full"
          :ui="{
            label: {
              base: 'text-label font-semibold',
            },
          }"
          label="End"
        >
          <div class="flex flex-col gap-2">
            <USelectMenu
              placeholder="End"
              v-model="form.state.happyHour.detail[0].endDay"
            />
            <UInput type="time" />
          </div>
        </UFormGroup>
        <div class="flex items-center">
          <UButton icon="i-carbon:close" color="black" />
        </div>
      </div>
    </div>
    <div class="flex items-start">
      <UButton
        @click="addDetail"
        type="button"
        icon="i-material-symbols:add"
        color="black"
        label="Tambah Happy Hour"
      />
    </div>

    <UFormGroup label="Gambar" name="gambar">
      <UInput type="file" />
    </UFormGroup>
    <UButton color="black" label="Send" class="justify-center" type="submit" />
  </div>
</template>

<style scoped></style>
