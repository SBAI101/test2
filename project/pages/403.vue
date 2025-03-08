<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">403</h1>
      <p class="text-xl text-gray-600 mb-8">Access Denied</p>
      <p class="text-gray-500 mb-8">
        You don't have permission to access this page.
      </p>
      <NuxtLink
        to="/"
        class="text-blue-600 hover:text-blue-800 font-medium"
      >
        Return to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>