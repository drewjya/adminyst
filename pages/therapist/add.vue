<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import type { SResponse } from "~/lib/app";
import type { VCabang, VTags } from "~/lib/types";

const Genders = z.enum(["MALE", "FEMALE"]);

const schema = z.object({
  name: z.string().min(2, "Harap isi nama"),
  no: z.string().optional(),
  gender: Genders,
  cabang: z.number().optional(),
  tags: z.array(z.number()).min(1, "Harap pilih 1 skill tag"),
});

type Schema = z.output<typeof schema>;

const selectCabang = ref<VCabang>();
const numberVal = ref<number>();
const state = ref<Schema>({
  gender: "MALE",
  no: undefined,
  cabang: undefined,
  name: "",
  tags: [],
});

watch(numberVal, (val) => {
  if (val) {
    state.value.no = `${val}`;
  } else {
    state.value.no = undefined;
  }
});
const app = useApp();
const runtime = useRuntimeConfig();

const loading = ref(false);
watch(selectCabang, (val) => {
  state.value = {
    ...state.value,
    cabang: val?.id,
  };
});

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

const loadingTag = ref(false);
const selectedTags = ref<VTags[]>([]);
watch(selectedTags, (val) => {
  state.value.tags = val.map((e) => e.id);
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
const notif = useNotif();
const loadingForm = ref(false);
const router = useRouter();
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loadingForm.value = true;
  const data = event.data;
  try {
    const res = await $fetch<SResponse<any>>("/server/therapist", {
      baseURL: runtime.public.baseUrl,
      method: "post",
      headers: app.bearer(),
      body: {
        cabang: data.cabang,
        gender: data.gender,
        name: data.name,
        no: data.no,
        skillTags: data.tags,
      },
    });
    if (res.data) {
      notif.success({
        title: "Success create therapist",
      });
      router.push("/therapist");
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

const labelTags = computed(() => {
  const data = selectedTags.value.map((e) => e.name);
  if (data.length === 0) {
    return "Select Tag";
  }
  return data.join(", ");
});
</script>

<template>
  <div
    class="flex flex-col max-w-[42rem] w-full gap-5 font-medium justify-center"
  >
    <h1 class="text-head_5 font-semibold">Add New Therapist</h1>
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
        <USelect
          placeholder="Select Gender"
          v-model="state.gender"
          :options="['MALE', 'FEMALE']"
        />
      </UFormGroup>
      <UFormGroup label="Cabang" name="cabang">
        <div>
          <UInput v-model="state.cabang" type="hidden" />
          <USelectMenu
            v-model="selectCabang"
            :loading
            :searchable="search"
            placeholder="Select Cabang"
            option-attribute="nama"
            by="id"
          />
        </div>
      </UFormGroup>
      <UFormGroup label="Skill Tags" name="tags">
        <USelectMenu
          v-model="selectedTags"
          :loading="loadingTag"
          :searchable="searchTag"
          multiple
          placeholder="Select Tag"
          option-attribute="name"
          by="id"
        >
          <template #label>
            <p>{{ labelTags }}</p>
          </template>
        </USelectMenu>
      </UFormGroup>
      <UFormGroup label="Nomor Id" name="no">
        <UInput
          placeholder="Insert Nomor"
          type="number"
          v-model.number="numberVal"
        />
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
