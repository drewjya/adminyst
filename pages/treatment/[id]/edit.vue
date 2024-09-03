<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import type { SResponse } from "~/lib/app";
import type { VCategory, VTags, VTreatment } from "~/lib/types";

const schema = z.object({
  name: z.string().min(2, "Harap isi nama"),
  category: z.number({ message: "Harap isi category" }),
  tag: z.number({ message: "Harap isi tag" }),
  durasi: z.number({ message: "Harap isi durasi" }),
});

type Schema = z.output<typeof schema>;

const state = reactive<{
  name: string;
  category?: number;
  tag?: number;
  durasi: number;
}>({
  name: "",
  category: undefined,
  tag: undefined,
  durasi: 30,
});

const app = useApp();
const runtime = useRuntimeConfig();

const loadingTag = ref(false);
const selectedTags = ref<VTags>();
const loadingCategory = ref(false);
const selectedCategory = ref<VCategory>();
const route = useRoute();
const url = computed(() => `/server/treatment/${route.params.id}`);

const { status, data, error } = await useApiFetch(() => url.value, {
  headers: app.bearer(),
  transform: (val: SResponse<VTreatment>) => {
    return val.data;
  },
});

watchEffect(() => {
  const curr = data.value;
  if (curr) {
    state.name = curr.nama;
    state.durasi = curr.durasi;
    selectedTags.value = curr.tags ?? undefined;
    selectedCategory.value = curr.category;
  }
});
watch(selectedTags, (val) => {
  state.tag = val?.id;
});
async function searchTag(query: string) {
  loadingTag.value = true;
  try {
    const res: SResponse<{
      tags: VTags[];
    }> = await $fetch(`/server/tags?limit=6&query=${query}`, {
      baseURL: runtime.public.baseUrl,
      headers: app.bearer(),
    });
    loadingTag.value = false;
    return res.data?.tags ?? <VTags[]>[];
  } catch (error) {
    loadingTag.value = false;
    return <VTags[]>[];
  }
}
watch(selectedCategory, (val) => {
  state.category = val?.id;
});
async function searchCategory(query: string) {
  loadingTag.value = true;
  try {
    const res: SResponse<{
      category: VCategory[];
    }> = await $fetch(`/server/category?limit=6&query=${query}`, {
      baseURL: runtime.public.baseUrl,
      headers: app.bearer(),
    });
    loadingTag.value = false;
    return res.data?.category ?? <VCategory[]>[];
  } catch (error) {
    loadingTag.value = false;
    return <VCategory[]>[];
  }
}
const notif = useNotif();
const loadingForm = ref(false);
const router = useRouter();
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loadingForm.value = true;
  const data = event.data;
  try {
    const res = await $fetch<SResponse<any>>(
      `/server/treatment/${route.params.id}`,
      {
        baseURL: runtime.public.baseUrl,
        method: "put",
        headers: app.bearer(),
        body: data,
      }
    );
    if (res.data) {
      notif.success({
        title: "Success create treatment",
      });
      router.push("/treatment");
    } else {
      notif.error({
        title: "Something Wrong",
        description: res.message,
      });
    }
    loadingForm.value = false;
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
    loadingForm.value = false;
  }
};
</script>

<template>
  <div
    class="flex flex-col max-w-[42rem] w-full gap-5 font-medium justify-center"
  >
    <h1 class="text-head_5 font-semibold">Edit Treatment</h1>
    <UForm
      :state
      :schema
      class="flex flex-col gap-2"
      @submit="onSubmit"
      @error="
        (e) => {
          console.log(e, state);
        }
      "
    >
      <UFormGroup label="Name" name="name">
        <UInput placeholder="Insert Name" v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="Gender" name="gender">
        <UInput
          placeholder="Insert Durasi"
          type="number"
          v-model.number="state.durasi"
        />
      </UFormGroup>
      <UFormGroup label="Category" name="category">
        <div>
          <UInput v-model.number="state.category" type="hidden" />
          <USelectMenu
            v-model="selectedCategory"
            :loading="loadingCategory"
            :searchable="searchCategory"
            placeholder="Select Category"
            option-attribute="nama"
            by="id"
          />
        </div>
      </UFormGroup>
      <UFormGroup label="Tags" name="tag">
        <USelectMenu
          v-model="selectedTags"
          :loading="loadingTag"
          :searchable="searchTag"
          placeholder="Select Tag"
          option-attribute="name"
          by="id"
        >
        </USelectMenu>
      </UFormGroup>

      <UButton
        color="black"
        label="Send"
        class="justify-center"
        type="submit"
      />
    </UForm>
  </div>
</template>

<style scoped></style>
