<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const returnRoute = ref<string>(route.query?.returnRoute as string);
</script>
<template>
  <div class="pb-16">
    <div class="layout-header mb-12">
      <div></div>
      <router-link :to="returnRoute ? { name: returnRoute } : { name: 'home' }">
        <BalIcon name="x" size="lg" />
      </router-link>
    </div>

    <router-view :key="$route.path" />
  </div>
</template>

<style scoped>
.layout-header {
  @apply h-16;
  @apply px-4 lg:px-6;
  @apply flex items-center justify-between;
}
</style>
