<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">Family Situation</h2>
      <button
        class="text-sm text-blue-600 hover:text-blue-800"
        @click="isEditing = !isEditing"
      >
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </button>
    </div>

    <div v-if="!isEditing">
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt class="text-sm font-medium text-gray-500">Marital Status</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ normalizedSituation.marital_status || 'Not provided' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Number of Children</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ normalizedSituation.number_of_children ?? 0 }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Dependent Children</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ normalizedSituation.dependent_children ?? 0 }}
          </dd>
        </div>

        <template v-if="normalizedSituation.marriage_date">
          <div>
            <dt class="text-sm font-medium text-gray-500">Marriage Date</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDate(normalizedSituation.marriage_date) }}
            </dd>
          </div>
        </template>

        <template v-if="normalizedSituation.divorce_date">
          <div>
            <dt class="text-sm font-medium text-gray-500">Divorce Date</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDate(normalizedSituation.divorce_date) }}
            </dd>
          </div>
        </template>

        <template v-if="normalizedSituation.civil_solidarity_pact_contract">
          <div class="md:col-span-2">
            <dt class="text-sm font-medium text-gray-500">Civil Solidarity Pact</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <div>Contract: {{ normalizedSituation.civil_solidarity_pact_contract }}</div>
              <div>Date: {{ formatDate(normalizedSituation.civil_solidarity_pact_date) }}</div>
              <div>Regime: {{ normalizedSituation.civil_solidarity_pact_regime }}</div>
            </dd>
          </div>
        </template>
      </dl>
    </div>

    <div v-else>
      <form @submit.prevent="handleSave" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Marital Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Marital Status</label>
            <select v-model="editData.marital_status" class="mt-1 block w-full rounded-md border-gray-300">
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="civil_partnership">Civil Partnership</option>
            </select>
          </div>

          <!-- Number of Children -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Number of Children</label>
            <input
              type="number"
              v-model="editData.number_of_children"
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300"
            >
          </div>

          <!-- Dependent Children -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Dependent Children</label>
            <input
              type="number"
              v-model="editData.dependent_children"
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300"
            >
          </div>

          <!-- Marriage Date -->
          <div v-if="editData.marital_status === 'married'">
            <label class="block text-sm font-medium text-gray-700">Marriage Date</label>
            <input
              type="date"
              v-model="editData.marriage_date"
              class="mt-1 block w-full rounded-md border-gray-300"
            >
          </div>

          <!-- Divorce Date -->
          <div v-if="editData.marital_status === 'divorced'">
            <label class="block text-sm font-medium text-gray-700">Divorce Date</label>
            <input
              type="date"
              v-model="editData.divorce_date"
              class="mt-1 block w-full rounded-md border-gray-300"
            >
          </div>

          <!-- Civil Solidarity Pact -->
          <div v-if="editData.marital_status === 'civil_partnership'" class="md:col-span-2 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Civil Solidarity Pact Contract</label>
              <input
                type="text"
                v-model="editData.civil_solidarity_pact_contract"
                class="mt-1 block w-full rounded-md border-gray-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Civil Solidarity Pact Date</label>
              <input
                type="date"
                v-model="editData.civil_solidarity_pact_date"
                class="mt-1 block w-full rounded-md border-gray-300"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Civil Solidarity Pact Regime</label>
              <input
                type="text"
                v-model="editData.civil_solidarity_pact_regime"
                class="mt-1 block w-full rounded-md border-gray-300"
              >
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            @click="isEditing = false"
            class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSupabaseClient } from '#imports'

const props = defineProps<{ situation: any }>()
const emit = defineEmits(['update'])
const supabase = useSupabaseClient()
const isEditing = ref(false)

const editData = ref({
  marital_status: '',
  marriage_date: null,
  number_of_children: 0,
  dependent_children: 0,
  divorce_date: null,
  civil_solidarity_pact_contract: '',
  civil_solidarity_pact_date: null,
  civil_solidarity_pact_regime: ''
})

const normalizedSituation = computed(() => {
  if (Array.isArray(props.situation)) {
    return props.situation[0] || {}
  }
  return props.situation || {}
})

watch(() => isEditing.value, (newVal) => {
  if (newVal) {
    editData.value = { ...normalizedSituation.value }
  }
})

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR')
}

const handleSave = async () => {
  try {
    const { error } = await supabase
      .from('family_situations')
      .upsert({
        client_id: props.situation.client_id,
        ...editData.value
      })

    if (error) throw error
    
    isEditing.value = false
    emit('update')
  } catch (err) {
    console.error('Error saving family situation:', err)
  }
}
</script>
