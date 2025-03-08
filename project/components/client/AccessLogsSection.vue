<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Access Information</h2>
    
    <dl class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <dt class="text-sm font-medium text-gray-500">Last Access</dt>
        <dd class="mt-1 text-sm text-gray-900">
          {{ accessLogs?.access_time ? formatDate(accessLogs.access_time) : 'Never logged in' }}
        </dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500">IP Address</dt>
        <dd class="mt-1 text-sm text-gray-900">
          {{ accessLogs?.ip_address || 'N/A' }}
        </dd>
      </div>
      <div>
        <dt class="text-sm font-medium text-gray-500">Device Type</dt>
        <dd class="mt-1 text-sm text-gray-900">
          {{ accessLogs?.device_type || 'N/A' }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  accessLogs: any
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('fr-FR')
}
</script>