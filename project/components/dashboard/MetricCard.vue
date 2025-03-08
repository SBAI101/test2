<template>
  <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <component 
        :is="icon" 
        class="h-8 w-8 text-blue-500"
        aria-hidden="true"
      />
    </div>
    <div class="flex items-baseline">
      <p class="text-2xl font-semibold text-gray-900">
        {{ formattedValue }}
      </p>
      <p class="ml-2 text-sm font-medium" :class="trendColor">
        <span v-if="trend">{{ trend > 0 ? '+' : '' }}{{ trend }}%</span>
      </p>
    </div>
    <p class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: number
  trend?: number
  subtitle: string
  icon: any
  format?: 'number' | 'currency' | 'percentage'
}>()

const formattedValue = computed(() => {
  if (props.format === 'currency') {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(props.value)
  }
  if (props.format === 'percentage') {
    return `${props.value}%`
  }
  return new Intl.NumberFormat('fr-FR').format(props.value)
})

const trendColor = computed(() => {
  if (!props.trend) return 'text-gray-500'
  return props.trend > 0 ? 'text-green-600' : 'text-red-600'
})
</script>