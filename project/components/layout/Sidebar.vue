<script setup lang="ts">
import {
  HomeIcon,
  QueueListIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  EnvelopeIcon,
  CircleStackIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  BellIcon,
  Cog6ToothIcon as SettingsIcon
} from '@heroicons/vue/24/outline'
import LanguageFlag from '~/components/common/LanguageFlag.vue'

const { t } = useI18n()
const route = useRoute()
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const user = useSupabaseUser()

const currentLocale = ref(locale.value)

const navigationItems = [
  { key: 'dashboard', path: '/', icon: HomeIcon },
  { key: 'clientPipeline', path: '/pipeline', icon: QueueListIcon },
  { key: 'userManagement', path: '/users', icon: UsersIcon },
  { key: 'taskManagement', path: '/tasks', icon: ClipboardDocumentListIcon },
  { key: 'communicationsManagement', path: '/communications', icon: EnvelopeIcon },
  { key: 'dataManagement', path: '/data', icon: CircleStackIcon },
  { key: 'reportsAnalytics', path: '/reports', icon: ChartBarIcon },
  { key: 'cmsManagement', path: '/cms', icon: DocumentTextIcon },
  { key: 'compliance', path: '/compliance', icon: ShieldCheckIcon },
  { key: 'errorManagement', path: '/errors', icon: ExclamationTriangleIcon },
  { key: 'notifications', path: '/notifications', icon: BellIcon }
]

const switchLanguage = () => {
  const path = switchLocalePath(currentLocale.value)
  if (path) navigateTo(path)
}
</script>

<template>
  <aside v-if="user" class="fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg border-r border-gray-200">
    <div class="flex h-16 items-center justify-center border-b bg-white px-4">
      <NuxtLink to="/" class="flex items-center">
        <img 
          src="/astavest-logo.png" 
          alt="Astavest" 
          class="h-8 w-auto object-contain max-w-[180px]"
          loading="eager"
          decoding="async"
        />
      </NuxtLink>
    </div>
    
    <nav class="flex h-[calc(100vh-4rem)] flex-col justify-between overflow-y-auto p-4 bg-white">
      <ul class="space-y-1">
        <!-- Main Navigation -->
        <li v-for="item in navigationItems" :key="item.path">
          <NuxtLink
            :to="localePath(item.path)"
            class="flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 group"
            :class="{
              'bg-blue-50 text-blue-700': route.path === item.path,
              'text-gray-700 hover:bg-gray-100': route.path !== item.path
            }"
          >
            <component 
              :is="item.icon" 
              class="h-5 w-5 mr-3 transition-colors duration-200" 
              :class="{
                'text-blue-700': route.path === item.path,
                'text-gray-400 group-hover:text-gray-500': route.path !== item.path
              }"
            />
            <span class="font-medium">{{ $t(`navigation.${item.key}`) }}</span>
          </NuxtLink>
        </li>
      </ul>

      <!-- Bottom Section -->
      <ul class="space-y-1 border-t pt-4">
        <!-- Language Selector -->
        <li>
          <div class="flex items-center px-3 py-2 text-sm rounded-lg">
            <LanguageFlag :locale="currentLocale" />
            <select
              v-model="currentLocale"
              @change="switchLanguage"
              class="bg-transparent font-medium text-gray-700 appearance-none cursor-pointer focus:outline-none"
            >
              <option value="en" class="flex items-center">
                {{ $t('languages.en') }}
              </option>
              <option value="fr" class="flex items-center">
                {{ $t('languages.fr') }}
              </option>
            </select>
          </div>
        </li>

        <!-- Settings -->
        <li>
          <NuxtLink
            :to="localePath('/settings')"
            class="flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 group"
            :class="{
              'bg-blue-50 text-blue-700': route.path.startsWith('/settings'),
              'text-gray-700 hover:bg-gray-100': !route.path.startsWith('/settings')
            }"
          >
            <SettingsIcon 
              class="h-5 w-5 mr-3 transition-colors duration-200" 
              :class="{
                'text-blue-700': route.path.startsWith('/settings'),
                'text-gray-400 group-hover:text-gray-500': !route.path.startsWith('/settings')
              }"
            />
            <span class="ml-3">{{ $t('settings.title') }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
select {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>