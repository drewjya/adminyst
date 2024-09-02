<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { z } from "zod";

definePageMeta({
  layout: "auth",
});

const secure = ref(true);

const schema = z.object({
  email: z.string().email("invalid_email"),
  password: z.string().min(6, "Min 6 characters"),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  email: "",
  password: "",
});
const app = useApp();
const runtime = useRuntimeConfig();
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  await app.login(event.data);
};
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    @submit="onSubmit"
    class="flex flex-col gap-4 max-w-[20rem] md:max-w-[24rem] p-4 bg-white w-full rounded-lg"
  >
    <h3 class="text-2xl font-semibold text-center">Login</h3>
    <div class="flex flex-col gap-2">
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <div class="flex ring-1 shadow-sm ring-gray-300 pl-2 rounded-md">
          <input
            :type="secure ? 'password' : 'text'"
            class="w-full !outline-none"
            v-model="state.password"
          />
          <UButton
            @click="secure = !secure"
            size="sm"
            :icon="
              secure ? 'i-radix-icons:eye-closed' : 'i-radix-icons:eye-open'
            "
            color="white"
            class="hover:bg-red-100"
            variant="soft"
          />
        </div>
      </UFormGroup>
    </div>

    <UButton
      label="Submit"
      type="submit"
      class="justify-center"
      color="black"
    />
    <!-- <button
      class="p-0.5 text-md font-medium px-5 rounded-md bg-slate-300"
      type="submit"
    >
      Submit
    </button> -->
  </UForm>
</template>

<style scoped></style>
