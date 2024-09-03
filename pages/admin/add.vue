<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import type { SResponse } from "~/lib/app";
import type { VCabang } from "~/lib/types";

const schema = z.object({
  email: z.string().email("invalid_email"),
  password: z.string().min(6, "Min 6 characters"),
  cabang: z.string().min(1, "Must select a branch"),
});

type Schema = z.output<typeof schema>;

const selectCabang = ref<VCabang>();

const state = ref<Schema>({
  email: "",
  password: "",
  cabang: "",
});
const app = useApp();
const runtime = useRuntimeConfig();

const loading = ref(false);
watch(selectCabang, (val) => {
  state.value = {
    ...state.value,
    cabang: `${val?.id ?? ""}`,
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
const notif = useNotif();
const loadingForm = ref(false);
const router = useRouter();
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loadingForm.value = true;
  try {
    const res = await $fetch<SResponse<any>>("/server/admin", {
      baseURL: runtime.public.baseUrl,
      method: "post",
      headers: app.bearer(),
      body: {
        cabangId: parseInt(event.data.cabang),

        email: event.data.email,
        password: event.data.password,
      },
    });
    if (res.data) {
      notif.success({
        title: "Success edit admin",
      });
    } else {
      notif.error({
        title: "Something Wrong",
        description: res.message,
      });
    }
    loadingForm.value = false;

    router.push("/admin");
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
  <div class="flex flex-col max-w-[42rem] w-full gap-5 font-medium">
    <h1 class="text-head_5 font-semibold">Add New Admin</h1>
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
      <UFormGroup label="Email" name="email">
        <UInput placeholder="Insert Email" v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput placeholder="Insert Password" v-model="state.password" />
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
