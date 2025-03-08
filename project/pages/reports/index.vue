<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ $t('navigation.reportsAnalytics') }}</h1>
    <div class="bg-white shadow rounded-lg p-6">
      <p class="text-gray-600">Reports and analytics interface.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>