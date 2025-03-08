<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-medium text-gray-900">{{ $t('dashboard.notifications.title') }}</h2>
    </div>
    <div class="divide-y divide-gray-200">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="p-4 hover:bg-gray-50 transition-colors duration-200"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <component 
              :is="getNotificationIcon(notification.category)"
              class="h-5 w-5"
              :class="getNotificationColor(notification.category)"
            />
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-900">
              {{ notification.title }}
            </p>
            <p class="mt-1 text-sm text-gray-500">
              {{ notification.message }}
            </p>
            <div class="mt-2 text-xs text-gray-400">
              {{ formatDate(notification.created_at) }}
            </div>
          </div>
          <div class="ml-4 flex-shrink-0">
            <div 
              v-if="!notification.is_read"
              class="h-2 w-2 bg-blue-600 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <NuxtLink 
        to="/notifications"
        class="text-sm font-medium text-blue-600 hover:text-blue-500"
      >
        {{ $t('dashboard.notifications.viewAll') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BellIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'

// This would come from your Supabase store/query in a real implementation
const notifications = ref([
  {
    id: 1,
    title: 'Nouveau client en attente',
    message: 'Un nouveau client attend la validation de son dossier',
    category: 'client',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 2,
    title: 'Mise à jour de conformité requise',
    message: 'La révision trimestrielle de conformité est due pour 3 clients',
    category: 'compliance',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: 3,
    title: 'Nouveau rapport disponible',
    message: 'Le rapport mensuel de performance est prêt',
    category: 'portfolio',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
])

const getNotificationIcon = (category: string) => {
  switch (category) {
    case 'client': return UserGroupIcon
    case 'compliance': return ShieldCheckIcon
    case 'portfolio': return BanknotesIcon
    case 'system': return BellIcon
    case 'error': return ExclamationTriangleIcon
    default: return DocumentTextIcon
  }
}

const getNotificationColor = (category: string) => {
  switch (category) {
    case 'client': return 'text-blue-500'
    case 'compliance': return 'text-green-500'
    case 'portfolio': return 'text-orange-500'
    case 'system': return 'text-purple-500'
    case 'error': return 'text-red-500'
    default: return 'text-gray-500'
  }
}

const formatDate = (date: Date) => {
  return new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })
    .format(
      -Math.round((Date.now() - date.getTime()) / (1000 * 60)),
      'minute'
    )
}
</script>