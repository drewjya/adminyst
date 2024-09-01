<script setup lang="ts" generic="T">
import { CaretSortIcon } from "@radix-icons/vue";
import { cn } from "~/lib/utils";

const { items, display, label } = withDefaults(
  defineProps<{
    items: T[] | undefined;
    loading?: boolean;
    label: string;
    showLabel?: boolean;
    display: (value: T) => string;
  }>(),
  {
    showLabel: true,
    loading: false,
  }
);

const selected = defineModel<T>();

const open = ref(false);
</script>

<template>
  <div class="flex flex-col gap-2">
    <p class="text-sm font-medium" v-if="showLabel && selected">{{ label }}</p>
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          size="xs"
          role="combobox"
          :aria-expanded="open"
          class="justify-between"
        >
          {{ selected ? display(selected) : label }}
          <CaretSortIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="p-0">
        <Command>
          <CommandInput class="h-9" :placeholder="`Search ${label}...`" />
          <CommandEmpty>No {{ label }} found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                v-for="item in items ?? []"
                :key="display(item)"
                :value="display(item)"
                :class="selected === item ? 'bg-slate-300' : ''"
                @select="
                  (ev) => {
                    selected = item;
                    open = false;
                  }
                "
              >
                {{ display(item) }}
                <CheckIcon
                  :class="
                    cn(
                      'ml-auto h-4 w-4',
                      selected === item ? 'opacity-100' : 'opacity-0'
                    )
                  "
                />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>

<style scoped></style>
