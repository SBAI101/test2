<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ $t('settings.title') }}</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">{{ $t('settings.profile') }}</h2>
        <p class="text-gray-600">Manage your profile settings.</p>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">{{ $t('settings.security') }}</h2>
        <p class="text-gray-600">Manage your security settings.</p>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">{{ $t('settings.notifications') }}</h2>
        <p class="text-gray-600">Manage your notification preferences.</p>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">{{ $t('settings.system') }}</h2>
        <p class="text-gray-600">Manage system settings.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>