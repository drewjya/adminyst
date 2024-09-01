<script setup lang="ts" generic="T">
import {
  ArrowUpDown,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-vue-next";
import type { KeyFunction, VTableColumn } from "~/lib/types";

const search = defineModel<string>("search");

const emit = defineEmits(["reset", "prev", "next"]);

withDefaults(
  defineProps<{
    data?: T[];
    
    getKey: KeyFunction<T>;
    column: VTableColumn<T>[];
    loading?: boolean;
    placeholder?: string;
    prev?: boolean;
    next?: boolean;
  }>(),
  {
    data: () => [],
    loading: false,
    placeholder: "No data available",
    prev: false,
    next: false,
  }
);
</script>

<template>
  <div class="flex gap-5">
    <Input placeholder="Search" class="border-[0.5px]" v-model="search" />
    <Button @click="emit('reset')">Reset</Button>
  </div>
  <ScrollArea class="w-full whitespace-nowrap rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-for="e in column" :class="e.class">
            <Button
              v-if="e.sorting"
              variant="ghost"
              class="w-full flex gap-2"
              @click="e.sorting()"
            >
              {{ e.label }}
              <ArrowUpDown class="w-4 h-4" />
            </Button>
            <div v-else>
              {{ e.label }}
            </div>
          </TableHead>
          <slot name="head" v-if="!loading && data.length !== 0"></slot>
        </TableRow>
      </TableHeader>
      <TableBody v-if="loading">
        <TableRow class="h-40">
          <td :colspan="column.length" class="text-center m-auto">
            <LoadingSpinner />
          </td>
        </TableRow>
      </TableBody>
      <TableBody v-else-if="data.length === 0">
        <TableRow class="h-40">
          <td :colspan="column.length" class="text-center">
            <p>{{ placeholder }}</p>
          </td>
        </TableRow>
      </TableBody>
      <TableBody v-else>
        <TableRow :key="getKey(curr)" v-for="curr in data">
          <TableCell v-for="e in column" class="font-medium px-4">{{
            e.display ? e.display(curr) : (curr as any)[e.key]
          }}</TableCell>
          <slot :data="curr"></slot>
        </TableRow>
      </TableBody>
    </Table>

    <ScrollBar orientation="horizontal" />
    <ScrollBar orientation="vertical" />
  </ScrollArea>

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
