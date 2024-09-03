<script setup lang="ts">
import type { VAdmin } from "~/lib/types";

const { admin } = defineProps<{
  admin: VAdmin;
}>();

const email = ref("");
const password = ref("");
const runtime = useRuntimeConfig();


const emits = defineEmits<{
  edit: [email: string, password: string]
  remove: []

}>()

onMounted(() => {
  email.value = admin.email;
});
</script>

<template>
  <UCard class="text-label font-medium">
    <template #header>
      <div class="text-label_lg font-semibold">
        {{ admin.adminCabang.nama }}
      </div>
    </template>
    <div class="flex flex-col gap-1 w-full">
      <div class="flex items-center justify-center bg-slate-200/20">
        <NuxtImg
          v-if="admin.adminCabang.picture"
          :src="runtime.public.imageUrl + admin.adminCabang.picture.path"
          class="w-52"
        />
      </div>
      <div class="capitalize text-lg font-semibold">
        {{ admin.role.toLowerCase() }}
      </div>
      <UFormGroup label="Email">
        <UInput v-model="email" />
      </UFormGroup>
      <UFormGroup label="Password">
        <UInput v-model="password" />
      </UFormGroup>
    </div>

    <template #footer>
      <div class="flex gap-2 flex-wrap">
        <UButton
          @click="emits('edit', email, password)"
          label="Edit"
          class="w-full justify-center"
        />
        <UButton
          @click="emits('remove')"
          label="Delete"
          color="red"
          class="w-full justify-center"
        />
      </div>
    </template>
  </UCard>
</template>

<style scoped></style>
