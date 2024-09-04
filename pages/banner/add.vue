<script lang="ts" setup>
import { z } from "zod";

const runtime = useRuntimeConfig();
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const router = useRouter();

const formD = useForm({
  schema: z.object({
    file: z
      .custom<File>((val) => val instanceof File, "Please upload a file")
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Please choose image format files only",
      }),
  }),

  onSubmit: async (event, d) => {
    const formData = new FormData();
    formData.append("file", event.data.file);
    const data = await $fetch("/server/banner", {
      method: "POST",
      body: formData,
      baseURL: runtime.public.baseUrl,
      headers: app.bearer(),
    });
    router.go(-1);
  },
  onError: async (event, d) => {},
});
const formMulti = useForm({
  schema: z.object({
    images: z.array(
      z.object({
        file: z
          .custom<File>((val) => val instanceof File, "Please upload a file")
          .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Please choose image format files only",
          }),
      })
    ),
  }),
  initial: {
    images: [],
  },
  onSubmit: async (event, d) => {
    for (const iterator of event.data.images) {
      const formData = new FormData();
      formData.append("file", iterator.file);
      const data = await $fetch("/server/banner", {
        method: "POST",
        body: formData,
        baseURL: runtime.public.baseUrl,
        headers: app.bearer(),
      });
    }
    router.go(-1);
  },
  onError: async (event, d) => {},
});

const url = ref();
const urls = ref(<string[]>[]);

const app = useApp();
const pageSelected = ref();
const uploadImage = (e: FileList) => {
  if (e.length === 0) return;

  formD.state.file = e[0];
  url.value = URL.createObjectURL(e[0]);
};
const uploadImages = (e: FileList) => {
  if (e.length === 0) return;

  formMulti.state.images[formMulti.state.images.length] = {
    file: e[0],
  };
  urls.value = [...urls.value, URL.createObjectURL(e[0])];
};

const isMultiple = ref(false);

const removeImage = (index: number) => {
  formMulti.state.images.splice(index, 1);
  urls.value.splice(index, 1);
};
</script>

<template>
  <UCheckbox
    label="Multiple"
    help="Please check this box"
    v-model="isMultiple"
  />

  <VForm :form="formD" class="flex flex-col gap-4" v-if="!isMultiple">
    <UFormGroup label="Image" name="file">
      <img
        v-if="url"
        :src="url"
        alt="image"
        class="h-auto w-[40%] mb-2 rounded-md border"
      />

      <UInput type="file" @change="uploadImage" />
    </UFormGroup>

    <u-button
      @click="formD.submit.value"
      type="button"
      class="dark:bg-blue-600 bg-blue-900 text-white p-2 rounded hover:bg-blue-600 dark:hover:bg-blue-900 flex justify-center items-center text-base font-bold dark:text-white"
      >Submit</u-button
    >
  </VForm>
  <VForm :form="formMulti" class="flex flex-col gap-4" v-else>
    <UFormGroup label="Images" name="images">
      <div class="flex w-full overflow-auto">
        <button v-for="(url, index) in urls" @click="removeImage(index)">
          <img :src="url" alt="image" class="w-[40%] mb-2 rounded-md border" />
        </button>
      </div>

      <UInput type="file" @change="uploadImages" />
    </UFormGroup>
    <u-button
      @click="formMulti.submit.value"
      type="button"
      class="dark:bg-blue-600 bg-blue-900 text-white p-2 rounded hover:bg-blue-600 dark:hover:bg-blue-900 flex justify-center items-center text-base font-bold dark:text-white"
      >Submit</u-button
    >
  </VForm>
</template>

<style scoped></style>
