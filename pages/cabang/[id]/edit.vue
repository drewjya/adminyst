<script setup lang="ts">
import dayjs from "dayjs";
import { z } from "zod";
import type { FormSubmitEvent } from "~/lib/types";

const MAX_FILE_SIZE = 5000000;

const api = useApi();
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const schema = z.object({
  name: z.string().min(4, "Min 4 characters"),
  phoneNumber: z.string(),
  openHour: z.string(),
  closeHour: z.string(),
  alamat: z.string(),
  publicHoliday: z.boolean(),
  happyHour: z.array(
    z.object({
      id: z.string(),
      startDay: z.number(),
      endDay: z.number(),
      startHour: z.string(),
      endHour: z.string(),
    })
  ),
  file: z
    .custom<File>((val) => val instanceof File, "Please upload a file")
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please choose .json format files only",
    }),
});

type Schema = z.output<typeof schema>;

const state = reactive<any>({
  alamat: "Jl something",
  closeHour: "10:00:00",
  happyHour: <
    {
      id: string;
      startDay: number;
      endDay: number;
      startHour: string;
      endHour: string;
    }[]
  >[
    {
      id: `init`,
      startDay: 1,
      endDay: 5,
      startHour: "10:00:00",
      endHour: "14:00:00",
    },
  ],
  name: "Test",
  openHour: "22:00:00",
  phoneNumber: "628145081819",
  publicHoliday: false,
  file: undefined,
});
const loading = computed(() => api.loading.value);
const onSubmit = async (e: FormSubmitEvent<Schema>) => {
  const formData = new FormData();
  const data = e.data;

  formData.append("name", data.name);
  formData.append("phoneNumber", data.phoneNumber);
  formData.append("openHour", data.openHour);
  formData.append("closeHour", data.closeHour);
  formData.append("alamat", data.alamat);
  formData.append("publicHoliday", JSON.stringify(data.publicHoliday));

  data.happyHour.forEach((detail, index) => {
    formData.append(`detail[${index}][startDay]`, `${detail.startDay}`);
    formData.append(`detail[${index}][endDay]`, `${detail.endDay}`);
    formData.append(`detail[${index}][startHour]`, detail.startHour);
    formData.append(`detail[${index}][endHour]`, detail.endHour);
  });

  formData.append("file", data.file);

  api.call({
    url: "/server/cabang",
    method: "post",
    onSuccess: () => {
      useRouter().go(-1);
    },
    title: "Cabang",
    body: formData,
  });
};

const addDetail = () => {
  state.happyHour.push({
    id: `${dayjs().format("YYYY-MM-DDTHH:mm:ssZ")}`,
    startDay: 1,
    endDay: 5,
    startHour: "",
    endHour: "",
  });
};

const removeDetail = (id: string) => {
  const find = state.happyHour.findIndex((e: any) => e.id === id);
  console.log(find);

  if (find !== -1) {
    const arr = [...state.happyHour];
    arr.splice(find, 1);
    state.happyHour = arr;
  }
};

const uploadImage = (e: FileList) => {
  if (e.length === 0) return;

  state.file = e[0];
  // url.value = URL.createObjectURL(e[0]);
};
const erorr = ref();
</script>

<template>
  <UForm
    class="max-w-[42rem] flex flex-col gap-2"
    :schema
    :state
    @submit.prevent="onSubmit"
    @error="
      (e) => {
        erorr = e;
      }
    "
  >
    <UFormGroup label="Nama" name="name">
      <UInput placeholder="Insert nama cabang" v-model="state.name" />
    </UFormGroup>
    <UFormGroup label="No Telp" name="phoneNumber">
      <UInput placeholder="Insert no telp cabang" v-model="state.phoneNumber" />
    </UFormGroup>
    <div class="flex gap-2">
      <UFormGroup label="Open Hour" class="w-full" name="openHour">
        <UInput type="time" v-model="state.openHour" />
      </UFormGroup>
      <UFormGroup label="Close Hour" class="w-full" name="closeHour">
        <UInput type="time" v-model="state.closeHour" />
      </UFormGroup>
    </div>
    <UFormGroup label="Alamat" name="alamat">
      <UInput placeholder="Insert alamat" v-model="state.alamat" />
    </UFormGroup>

    <p class="text-label mt-2 font-semibold">Happy Hour</p>
    <div class="flex flex-col gap-2">
      <UCheckbox label="Termasuk Tanggal Merah" v-model="state.publicHoliday" />
      <div v-if="state.happyHour" class="flex flex-col gap-2">
        <div class="flex gap-3 w-full" v-for="(i, index) in state.happyHour">
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
                v-model="state.happyHour[index].startDay"
              />
              <UInput type="time" v-model="state.happyHour[index].startHour" />
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
                v-model="state.happyHour[index].endDay"
              />
              <UInput type="time" v-model="state.happyHour[index].endHour" />
            </div>
          </UFormGroup>
          <div class="flex items-center">
            <UButton
              :disabled="state.happyHour.length <= 1"
              icon="i-carbon:close"
              color="black"
              type="button"
              @click="removeDetail(i.id)"
            />
          </div>
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

    <UFormGroup label="Gambar" name="file">
      <UInput type="file" @change="uploadImage" />
    </UFormGroup>
    <p>{{ erorr }}</p>

    <UButton
      color="black"
      :loading
      label="Send"
      class="justify-center"
      type="submit"
    />
  </UForm>
</template>

<style scoped></style>
