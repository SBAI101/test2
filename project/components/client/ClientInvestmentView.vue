<template>
  <div v-if="profiles && profiles.length">
    <template v-for="(inv, index) in profiles" :key="index">
      <dl class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 border-b pb-2 last:border-b-0 last:pb-0">
        <div>
          <dt class="text-sm font-medium text-gray-500">Service</dt>
          <dd class="mt-1 text-sm text-gray-900 break-words whitespace-normal">
            {{ inv.related_service || 'Not provided' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Main Objective</dt>
          <dd class="mt-1 text-sm text-gray-900 break-words whitespace-normal">
            {{ inv.main_objective || 'Unnamed Profile' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Desired Return</dt>
          <dd class="mt-1 text-sm text-gray-900 break-words whitespace-normal">
            {{ inv.desired_return || 'Not provided' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Risk Appetite</dt>
          <dd class="mt-1 text-sm text-gray-900 break-words whitespace-normal">
            {{ inv.risk_appetite || 'Not provided' }}
          </dd>
        </div>
      </dl>
    </template>
  </div>
  <span v-else>Not provided</span>
</template>

<script setup lang="ts">
defineProps<{
  profiles: any[]
}>()
</script>
