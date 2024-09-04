<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { FormError } from "~/lib/types";


type FormErrorEvent = SubmitEvent & { errors: FormErrorWithId[] };
interface FormErrorWithId extends FormError {
  id: string;
}
const props = defineProps({
  form: {
    required: true,
    type: Object,
  },
});

const emit = defineEmits(["error", "update:modelValue"]);
const buttonRef = ref<HTMLButtonElement>();
onMounted(() => {
  // eslint-disable-next-line vue/no-mutating-props
  props.form.submit.value = () => {
    buttonRef.value!.click();
  };
});
async function onError(event: FormErrorEvent) {
  emit("error", event.errors);
}
</script>

<template>
  <UForm
    :ref="props.form.ref"
    :state="props.form.state"
    :schema="props.form.schema"
    :validate-on="['submit']"
    @keydown.enter="$event.preventDefault()"
    @submit="props.form.submitEvent"
    @error="onError"
  >
    <!-- hiddenbtn -->
    <button ref="buttonRef" type="submit" class="hidden" />
    <!-- hiddenbtn -->
    <slot />
  </UForm>
</template>

<style scoped></style>
