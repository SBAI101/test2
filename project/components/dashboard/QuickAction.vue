<template>
  <NuxtLink 
    :to="to"
    class="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
  >
    <div class="flex-shrink-0 p-3 rounded-lg" :class="bgColor">
      <component 
        :is="icon" 
        class="h-6 w-6"
        :class="iconColor"
        aria-hidden="true"
      />
    </div>
    <div class="ml-4">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <p class="text-sm text-gray-500">{{ description }}</p>
    </div>
    <div class="ml-auto">
      <span 
        v-if="count !== undefined" 
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="countClass"
      >
        {{ count }}
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  icon: any
  to: string
  count?: number
  type?: 'default' | 'warning' | 'danger' | 'success'
}>()

const bgColor = computed(() => {
  switch (props.type) {
    case 'warning': return 'bg-orange-100'
    case 'danger': return 'bg-red-100'
    case 'success': return 'bg-green-100'
    default: return 'bg-blue-100'
  }
})

const iconColor = computed(() => {
  switch (props.type) {
    case 'warning': return 'text-orange-600'
    case 'danger': return 'text-red-600'
    case 'success': return 'text-green-600'
    default: return 'text-blue-600'
  }
})

const countClass = computed(() => {
  switch (props.type) {
    case 'warning': return 'bg-orange-100 text-orange-800'
    case 'danger': return 'bg-red-100 text-red-800'
    case 'success': return 'bg-green-100 text-green-800'
    default: return 'bg-blue-100 text-blue-800'
  }
})
</script>