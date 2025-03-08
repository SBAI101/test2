<template>
  <div class="space-y-6">
    <!-- Account Overview -->
    <div class="bg-white rounded-lg shadow p-4">
      <h2 class="text-lg font-medium text-gray-900 mb-2">Account Overview</h2>
      <dl class="space-y-2 text-sm">
        <div>
          <dt class="text-gray-500">Account Created</dt>
          <dd class="text-gray-900">{{ formatDate(createdAt) }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Last Updated</dt>
          <dd class="text-gray-900">{{ formatDate(updatedAt) }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Status</dt>
          <dd class="text-gray-900">{{ status }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">Approved At</dt>
          <dd class="text-gray-900">{{ approvedAt ? formatDate(approvedAt) : 'Not approved' }}</dd>
        </div>
      </dl>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow p-4">
      <h2 class="text-lg font-medium text-gray-900 mb-2">Recent Activity</h2>
      <div v-if="activities.length === 0" class="text-center py-4 text-sm text-gray-500">
        No recent activity
      </div>
      <ul v-else class="space-y-2">
        <li v-for="activity in activities" :key="activity.id" class="flex space-x-3 text-sm">
          <div class="flex-shrink-0">
            <div class="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
              <component :is="getActivityIcon(activity.activity_type)" class="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div>
            <p class="text-gray-900">{{ activity.description }}</p>
            <p class="text-gray-500">{{ formatDate(activity.timestamp) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DocumentIcon,
  UserIcon,
  CurrencyEuroIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  createdAt: Date
  updatedAt: Date
  approvedAt?: Date
  status: string
  activities: any[]
}>()

const formatDate = (date: Date | string) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'document': return DocumentIcon
    case 'profile': return UserIcon
    case 'transaction': return CurrencyEuroIcon
    default: return ShieldCheckIcon
  }
}
</script>