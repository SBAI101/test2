<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">Financial Information</h2>
      <button class="text-sm text-blue-600 hover:text-blue-800" @click="isEditing = !isEditing">
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </button>
    </div>
    <div v-if="!isEditing">
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt class="text-sm font-medium text-gray-500">Annual Income</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ financialInfo?.annual_income ? formatCurrency(financialInfo.annual_income) : 'Not provided' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Income Source</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ incomeSourceName || 'Not provided' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Estimated Assets</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ financialInfo?.estimated_assets ? formatCurrency(financialInfo.estimated_assets) : 'Not provided' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Detailed Assets</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ financialInfo?.detailed_assets || 'Not provided' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Debts or Loans</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ financialInfo?.debts_or_loans ? 'Yes' : 'No' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Debt Details</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ financialInfo?.debt_details || 'Not provided' }}
          </dd>
        </div>
      </dl>
    </div>
    <div v-else>
      <form @submit.prevent="handleSave" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Annual Income -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Annual Income</label>
            <input
              type="number"
              v-model="editData.annual_income"
              class="mt-1 block w-full rounded-md border-gray-300"
              step="1000"
            >
          </div>

          <!-- Income Source -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Income Source</label>
            <select
              v-model="editData.income_source_id"
              class="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="">Select Income Source</option>
              <option
                v-for="source in incomeSources"
                :key="source.id"
                :value="source.id"
              >
                {{ source.name }}
              </option>
            </select>
          </div>

          <!-- Estimated Assets -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Estimated Assets</label>
            <input
              type="number"
              v-model="editData.estimated_assets"
              class="mt-1 block w-full rounded-md border-gray-300"
              step="1000"
            >
          </div>

          <!-- Detailed Assets -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Detailed Assets</label>
            <textarea
              v-model="editData.detailed_assets"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300"
            ></textarea>
          </div>

          <!-- Debts or Loans -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Debts or Loans</label>
            <select
              v-model="editData.debts_or_loans"
              class="mt-1 block w-full rounded-md border-gray-300"
            >
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </div>

          <!-- Debt Details -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Debt Details</label>
            <textarea
              v-model="editData.debt_details"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300"
              :disabled="!editData.debts_or_loans"
            ></textarea>
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

const props = defineProps<{
  financialInfo: any,
  incomeSources: any[]
}>()

const emit = defineEmits(['update'])
const supabase = useSupabaseClient()
const isEditing = ref(false)

const editData = ref({
  annual_income: 0,
  income_source_id: '',
  estimated_assets: 0,
  detailed_assets: '',
  debts_or_loans: false,
  debt_details: ''
})

// Initialize edit data when entering edit mode
watch(() => isEditing.value, (newVal) => {
  if (newVal) {
    editData.value = { ...props.financialInfo }
  }
})

const formatCurrency = (value: number | string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(value))
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const incomeSourceName = computed(() => {
  if (!props.financialInfo || !props.financialInfo.income_source_id) return null
  const source = props.incomeSources.find(src => src.id === props.financialInfo.income_source_id)
  return source ? source.name : props.financialInfo.income_source_id
})

const handleSave = async () => {
  try {
    const { error } = await supabase
      .from('financial_info')
      .upsert({
        client_id: props.financialInfo.client_id,
        ...editData.value
      })

    if (error) throw error
    
    isEditing.value = false
    emit('update')
  } catch (err) {
    console.error('Error saving financial info:', err)
  }
}
</script>
