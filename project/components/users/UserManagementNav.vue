<template>
  <nav class="mb-8">
    <ul class="flex space-x-4 border-b border-gray-200">
      <li v-for="tab in tabs" :key="tab.path">
        <NuxtLink
          :to="localePath(tab.path)"
          class="inline-flex items-center px-4 py-2 -mb-px text-sm font-medium transition-colors duration-200"
          :class="[
            route.path.startsWith(tab.path)
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
          ]"
        >
          <component :is="tab.icon" class="w-5 h-5 mr-2" />
          {{ $t(tab.title) }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import {
  UserIcon,
  BriefcaseIcon,
  DocumentDuplicateIcon,
  KeyIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

const tabs = [
  { 
    path: '/users/clients',
    icon: UserIcon,
    title: 'userManagement.tabs.clients'
  },
  { 
    path: '/users/employees',
    icon: BriefcaseIcon,
    title: 'userManagement.tabs.employees'
  },
  { 
    path: '/users/documents',
    icon: DocumentDuplicateIcon,
    title: 'userManagement.tabs.documents'
  },
  { 
    path: '/users/roles',
    icon: KeyIcon,
    title: 'navigation.roleManagement'
  },
  { 
    path: '/users/analytics',
    icon: ChartBarIcon,
    title: 'userManagement.tabs.analytics'
  }
]
</script>