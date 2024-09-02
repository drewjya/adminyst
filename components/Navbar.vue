<script setup lang="ts">
import { Menu, Package2 } from "lucide-vue-next";
import SideBarSheet from "./SideBarSheet.vue";

const sidebar = useSidebar();
const sheet = useSlideover();

const openSheet = () => {
  sheet.open(SideBarSheet, {});
};

const route = useRoute();
watch(
  () => route.path,
  () => {
    sheet.close();
  }
);
</script>

<template>
  <header
    class="sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 z-50"
  >
    <nav
      class="hidden flex-col gap-6 text-lg font-medium lg:flex lg:flex-row lg:items-center lg:text-sm lg:gap-6"
    >
      <NuxtLink
        href="/"
        class="flex justify-start w-max items-center gap-2 text-lg font-semibold"
      >
        <Package2 class="h-6 w-6" />
        <p>YST Family</p>
      </NuxtLink>
      <NuxtLink
        v-for="i in sidebar.pages.value"
        :key="i.title"
        :href="i.link"
        :class="`transition-colors hover:text-foreground ${
          sidebar.current.value === i.link
            ? `text-foreground border-b-2 border-foreground`
            : `text-muted-foreground`
        }`"
      >
        {{ i.title }}
      </NuxtLink>
    </nav>

    <button class="shrink-0 lg:hidden" @click="openSheet">
      <Menu class="h-5 w-5" />
    </button>

    <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <!-- <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" class="rounded-full">
            <CircleUser class="h-5 w-5" />
            <span class="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> -->
    </div>
  </header>
</template>
