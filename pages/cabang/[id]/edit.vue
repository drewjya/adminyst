<script setup lang="ts">
import dayjs from "dayjs";
import { z } from "zod";
import type { SResponse } from "~/lib/app";
import {
  listDay,
  type FormSubmitEvent,
  type Optional,
  type VCabangDetail,
} from "~/lib/types";
import { stripZero } from "~/lib/utils";

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
  vip_room: z
    .object({
      ninety_minute: z.number(),
      one_twenty_minute: z.number(),
    })
    .optional(),
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
const state = reactive<Optional<Schema>>({
  alamat: "Jl something",
  closeHour: "10:00",
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
      startHour: "10:00",
      endHour: "14:00",
    },
  ],
  name: "Test",
  openHour: "22:00",
  phoneNumber: "628145081819",
  publicHoliday: false,
  file: undefined,
});
const route = useRoute();
const router = useRouter();
const app = useApp();
const runtime = useRuntimeConfig();
const { data } = useApiFetch(`/server/cabang/${route.params.id}`, {
  headers: app.bearer(),
  transform: (data: SResponse<VCabangDetail>) => {
    return data.data;
  },
});

const isVipRoom = ref(false);
const fileData = ref();
const imageUrl = ref();
const toDataUrl = (url: string) => {
  return fetch(url).then(async (response) => {
    const filenames = url.split(".");
    const fileName =
      filenames[filenames.length - 2] + filenames[filenames.length - 1];
    const contentType = response.headers.get("content-type");
    const blob = await response.blob();
    const file = new File([blob], fileName, {
      type: contentType ? contentType : undefined,
    });
    state.file = file;
  });
};
watchEffect(() => {
  const v = data.value;
  if (v) {
    state.name = v.nama;
    state.alamat = v.alamat;
    state.closeHour = stripZero(v.closeHour);
    state.openHour = stripZero(v.openHour);
    state.publicHoliday = v.happyHour?.publicHoliday;
    state.happyHour = v.happyHour?.happyHourDetail?.map((e) => {
      return {
        id: `${e.id}`,
        endDay: e.endDay,
        endHour: stripZero(e.endHour),
        startHour: stripZero(e.startHour),
        startDay: e.startDay,
      };
    });

    if (v.vipRoom) {
      isVipRoom.value = true;
      state.vip_room = {
        ninety_minute: v.vipRoom.ninety_minute ?? 0,
        one_twenty_minute: v.vipRoom.one_twenty_minute ?? 0,
      };
      console.log(state.vip_room);
    }

    if (v.picture) {
      imageUrl.value = runtime.public.imageUrl + v.picture?.path;
      toDataUrl(imageUrl.value);
    }
  }
});

watch(isVipRoom, (v) => {
  if (v && !state.vip_room) {
    state.vip_room = {
      ninety_minute: 0,
      one_twenty_minute: 0,
    };
  }
  if (!v) {
    state.vip_room = undefined;
  }
});

const loading = computed(() => api.loading.value);
const onSubmit = async (e: FormSubmitEvent<Schema>) => {
  const formData = new FormData();
  const data = e.data;

  formData.append("name", data.name);
  formData.append("phoneNumber", data.phoneNumber);
  formData.append("openHour", data.openHour + ":00");
  formData.append("closeHour", data.closeHour + ":00");
  formData.append("alamat", data.alamat);
  formData.append("publicHoliday", JSON.stringify(data.publicHoliday));

  data.happyHour.forEach((detail, index) => {
    formData.append(`detail[${index}][startDay]`, `${detail.startDay}`);
    formData.append(`detail[${index}][endDay]`, `${detail.endDay}`);
    formData.append(`detail[${index}][startHour]`, `${detail.startHour}:00`);
    formData.append(`detail[${index}][endHour]`, `${detail.endHour}:00`);
  });

  formData.append("file", data.file);

  if (data.vip_room) {
    formData.append(
      `vip_room[ninety_minute]`,
      `${data.vip_room.ninety_minute}`
    );
    formData.append(
      `vip_room[one_twenty_minute]`,
      `${data.vip_room.one_twenty_minute}`
    );
  }

  api.call({
    url: `/server/cabangassak/${route.params.id}`,
    method: "put",
    onSuccess: () => {
      router.go(-1);
    },
    title: "Cabang",
    body: formData,
  });
};

const addDetail = () => {
  if (!state.happyHour) {
    return;
  }
  state.happyHour.push({
    id: `${dayjs().format("YYYY-MM-DDTHH:mm:ssZ")}`,
    startDay: 1,
    endDay: 5,
    startHour: "",
    endHour: "",
  });
};

const removeDetail = (id: string) => {
  if (!state.happyHour) {
    return;
  }
  const find = state.happyHour.findIndex((e: any) => e.id === id);
  console.log(find);

  if (find !== -1) {
    const arr = [...state.happyHour];
    arr.splice(find, 1);
    state.happyHour = arr;
  }
};

const fileRef = ref<HTMLInputElement>();

const uploadImage = (e: FileList | null) => {
  if (!e || e.length === 0) return;

  state.file = e[0];
  imageUrl.value = URL.createObjectURL(e[0]);
};

const onClickFile = () => {
  fileRef.value?.click();
};
const erorr = ref();
</script>

<template>
  <div class="flex justify-end">
    <ULink
      class="border rounded px-2 py-0.5 border-black text-label_sm"
      size="sm"
      variant="outline"
      @click="$router.replace('/cabang')"
      >Kembali</ULink
    >
  </div>

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
    <!-- <UInput placeholder="Insert alamat" v-model="state.alamat" /> -->
    <p class="text-label mt-2 font-semibold">VIP Room</p>
    <UCheckbox label="Punya VIP Room" v-model="isVipRoom" />
    <div class="flex gap-2" v-if="state.vip_room">
      <UFormGroup label="90 Menit" name="vip_room.ninety_minute">
        <UInput v-model.number="state.vip_room!.ninety_minute" />
      </UFormGroup>
      <UFormGroup label="120 Menit" name="vip_room.one_twenty_minute">
        <UInput v-model.number="state.vip_room!.one_twenty_minute" />
      </UFormGroup>
    </div>

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
                v-model="state.happyHour[index]!.startDay"
                :options="listDay"
                value-attribute="id"
                option-attribute="name"
              />
              <UInput type="time" v-model="state.happyHour[index]!.startHour" />
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
                v-model="state.happyHour[index]!.endDay"
                :options="listDay"
                value-attribute="id"
                option-attribute="name"
              />
              <UInput type="time" v-model="state.happyHour[index]!.endHour" />
            </div>
          </UFormGroup>
          <div class="flex items-center">
            <UButton
              :disabled="state.happyHour.length <= 1"
              icon="i-carbon:close"
              color="black"
              type="button"
              @click="removeDetail(i!.id!)"
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
      <button
        class="h-fit min-h-72 max-h-96 w-full bg-gray-500/30 rounded-lg border-2 flex flex-col justify-center items-center m-auto p-4"
        @click.prevent="onClickFile"
        @dragover.prevent
        @dragenter.prevent
        @dragstart.prevent
        @drop.prevent="uploadImage($event.dataTransfer?.files ?? null)"
      >
        <img :src="imageUrl" v-if="imageUrl" class="h-72" />
        <div v-else>Click To Upload</div>
      </button>
      <input
        type="file"
        ref="fileRef"
        class="hidden"
        @change="uploadImage(($event.target as HTMLInputElement).files)"
      />
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
