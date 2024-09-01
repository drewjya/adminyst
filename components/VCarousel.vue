<script setup lang="ts" generic="T">
import { type CarouselApi } from "@/components/ui/carousel";
import { watchOnce } from "@vueuse/core";
// import Autoplay from "embla-carousel-autoplay";
import { ref } from "vue";

const { urls } = defineProps<{
  urls: T[];
}>();

const emblaMainApi = ref<CarouselApi>();
const emblaThumbnailApi = ref<CarouselApi>();
const selectedIndex = ref(0);

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return;
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap();

  emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap());
}

watchOnce(emblaMainApi, (emblaMainApi) => {
  if (!emblaMainApi) return;

  onSelect();
  emblaMainApi.on("select", onSelect);
  emblaMainApi.on("reInit", onSelect);
});
</script>

<template>
  <div class="w-full sm:w-auto">
    <Carousel
      class="relative w-full max-w-[50vw] mx-auto"
      :opts="{ loop: true }"
      @init-api="(val) => (emblaMainApi = val)"
    >
      <CarouselContent>
        <CarouselItem v-for="(item, index) in urls" :key="index">
          <Card class="p-1">
            <slot :item="item"></slot>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    <!-- <Carousel
      class="relative w-full max-w-[80vw]"
      :opts="{ loop: true }"
      @init-api="(val) => (emblaThumbnailApi = val)"
    >
      <CarouselContent class="flex gap-1 ml-0">
        <CarouselItem
          v-for="(item, index) in urls"
          :key="index"
          class="pl-0 basis-1/4 cursor-pointer"
          @click="onThumbClick(index)"
        >
          <div :class="index === selectedIndex ? '' : 'opacity-50'">
            <Card class="p-1">
              <NuxtImg :src="item" class="w-full rounded-lg" />
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel> -->
  </div>
</template>
