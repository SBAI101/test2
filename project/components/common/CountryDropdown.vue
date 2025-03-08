<template>
  <select 
    v-model="selected" 
    @change="emitSelected" 
    class="block w-full text-sm bg-white text-gray-900"
  >
    <option disabled value="">Select a country</option>
    <option 
      v-for="country in countries" 
      :key="country.id" 
      :value="country.id"
      :class="{
        'bg-green-50': getRiskLevel(country.risk_level?.name) === 'low',
        'bg-yellow-50': getRiskLevel(country.risk_level?.name) === 'medium',
        'bg-red-50': getRiskLevel(country.risk_level?.name) === 'high'
      }"
    >
      {{ country.country_name }}
      {{ country.risk_level ? `(${country.risk_level.name})` : '' }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSupabaseClient } from '#imports'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const getRiskLevel = (risk: string | undefined) => {
  if (!risk) return 'medium'
  const riskLower = risk.toLowerCase()
  if (riskLower.includes('faible')) return 'low'
  if (riskLower.includes('élevé')) return 'high'
  return 'medium'
}

const countries = ref<any[]>([])
const selected = ref(props.modelValue)
const supabase = useSupabaseClient()

const fetchCountries = async () => {
  const { data, error } = await supabase
    .from('countries')
    .select(`
      id,
      country_name,
      risk_level: risk_levels ( due_diligence_level, name )
    `)
    .order('due_diligence_level', { foreignTable: 'risk_levels' })
    .order('country_name', { ascending: true })
  
  if (error) {
    console.error('Error fetching countries:', error)
  } else {
    countries.value = data
  }
}

const emitSelected = () => {
  emit('update:modelValue', selected.value)
}

onMounted(() => {
  fetchCountries()
})

watch(() => props.modelValue, (newVal) => {
  selected.value = newVal
})
</script>