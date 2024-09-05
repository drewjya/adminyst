<script setup lang="ts" generic="T">
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-vue-next";
import type { KeyFunction, VTableColumn } from "~/lib/types";

const search = defineModel<string>("search");

const emit = defineEmits(["reset", "prev", "next"]);

withDefaults(
  defineProps<{
    data?: T[];
    type?: string;
    getKey: KeyFunction<T>;
    column: VTableColumn<T>[];
    extra?: number;
    loading?: boolean;
    placeholder?: string;
    prev?: boolean;
    next?: boolean;
  }>(),
  {
    data: () => [],
    loading: false,
    extra: 0,
    placeholder: "No data available",
    prev: false,
    next: false,
  }
);
</script>

<template>
  <div class="flex gap-5 pb-2">
    <UInput
      placeholder="Search"
      v-model="search"
      class="w-full max-w-[30rem]"
    />
    <UButton @click="emit('reset')" color="black" variant="outline" size="xs"
      >Reset</UButton
    >
  </div>

  <div
    class="grid grid-cols-3"
    :style="{
      gridTemplateColumns: `repeat(${
        column.length + (!loading && data.length !== 0 ? extra : 0)
      }, auto)`,
    }"
  >
    <div
      :data-role="`table-header-${type ?? Math.random()}`"
      class="sticky top-0 grid grid-cols-subgrid col-span-full font-semibold bg-slate-200 p-2 rounded-t-md text-label"
    >
      <template v-for="e in column">
        <UButton
          :label="e.label"
          icon="i-solar:sort-vertical-linear"
          v-if="e.sorting"
          variant="ghost"
          color="black"
          class="w-full gap-2"
        />
        <p v-else>{{ e.label }}</p>
      </template>
      <slot name="head" v-if="!loading && data.length !== 0"></slot>
    </div>
    <div
      class="col-span-full flex justify-center items-center h-40"
      v-if="loading"
    >
      <LoadingSpinner />
    </div>
    <div
      class="col-span-full flex justify-center items-center h-40"
      v-else-if="data.length === 0"
    >
      <p class="text-center">{{ placeholder }}</p>
    </div>
    <template v-else>
      <div
        :key="getKey(curr)"
        v-for="(curr, index) in data"
        class="col-span-full grid grid-cols-subgrid font-medium p-2"
        :class="index % 2 === 0 ? '' : 'bg-slate-200/50'"
      >
        <div
          v-for="col in column"
          class="w-full flex justify-start text-label_sm items-center"
        >
          {{ col.display ? col.display(curr) : (curr as any)[col.key] }}
        </div>
        <slot :data="curr"></slot>
      </div>
    </template>
  </div>

  <div class="flex justify-end gap-2">
    <Button
      :disabled="loading || !prev"
      @click="emit('prev')"
      size="sm"
      variant="secondary"
      class="hover:bg-primary/80 hover:text-primary-foreground"
    >
      <ChevronLeftIcon class="w-4 h-4" />
    </Button>
    <Button
      size="sm"
      @click="emit('next')"
      :disabled="loading || !next"
      variant="secondary"
      class="hover:bg-primary/80 hover:text-primary-foreground"
    >
      <ChevronRightIcon class="w-4 h-4" />
    </Button>
  </div>
</template>
