<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">Tax Information</h2>
      <button
        class="text-sm text-blue-600 hover:text-blue-800"
        @click="isEditing = !isEditing"
      >
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </button>
    </div>

    <!-- View Mode -->
    <div v-if="!isEditing">
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt class="text-sm font-medium text-gray-500">Tax Identification Number</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ taxInfo?.tax_identification_number || 'Not provided' }}
          </dd>
        </div>

        <div>
          <dt class="text-sm font-medium text-gray-500">IFI Subject</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ taxInfo?.is_ifi_subject ? 'Yes' : 'No' }}
          </dd>
        </div>

        <div>
          <dt class="text-sm font-medium text-gray-500">Tax Residence</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ taxInfo?.tax_residence_name || 'Not provided' }}
          </dd>
        </div>

        <div>
          <dt class="text-sm font-medium text-gray-500">US Tax Links</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ taxInfo?.us_tax_links ? 'Yes' : 'No' }}
          </dd>
        </div>

        <div v-if="taxInfo?.us_tax_links">
          <dt class="text-sm font-medium text-gray-500">US TIN</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ taxInfo?.us_tin || 'Not provided' }}
          </dd>
        </div>
      </dl>
    </div>

    <!-- Edit Mode -->
    <form v-else @submit.prevent="handleSave" class="space-y-4">
      <!-- Tax ID -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Tax Identification Number</label>
        <input
          v-model="editData.tax_identification_number"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <!-- IFI Subject -->
      <div>
        <label class="block text-sm font-medium text-gray-700">IFI Subject</label>
        <select
          v-model="editData.is_ifi_subject"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>

      <!-- Tax Residence -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Tax Residence</label>
        <select
          v-model="editData.tax_residence_id"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select a country</option>
          <option
            v-for="country in countries"
            :key="country.id"
            :value="country.id"
          >
            {{ country.country_name }}
          </option>
        </select>
      </div>

      <!-- US Tax Links -->
      <div>
        <label class="block text-sm font-medium text-gray-700">US Tax Links</label>
        <select
          v-model="editData.us_tax_links"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>

      <!-- US TIN (only shown if US Tax Links is true) -->
      <div v-if="editData.us_tax_links">
        <label class="block text-sm font-medium text-gray-700">US TIN</label>
        <input
          v-model="editData.us_tin"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <!-- Error Display -->
      <div v-if="error" class="text-red-600 text-sm">
        {{ error }}
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="isEditing = false"
          class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSupabaseClient } from '#imports'

const props = defineProps<{
  taxInfo: any
  countries: any[]
}>()

const emit = defineEmits(['update'])
const supabase = useSupabaseClient()

const isEditing = ref(false)
const error = ref('')

const editData = ref({
  tax_identification_number: '',
  is_ifi_subject: false,
  tax_residence_id: '',
  us_tax_links: false,
  us_tin: ''
})

// Initialize edit data when entering edit mode
watch(() => isEditing.value, (newVal) => {
  if (newVal) {
    editData.value = { ...props.taxInfo }
  }
})

const handleSave = async () => {
  try {
    error.value = ''

    // Validate tax identification number
    if (!editData.value.tax_identification_number) {
      error.value = 'Tax identification number is required'
      return
    }

    // If US tax links is true, validate US TIN
    if (editData.value.us_tax_links && !editData.value.us_tin) {
      error.value = 'US TIN is required when US tax links is enabled'
      return
    }

    const { error: updateError } = await supabase
      .from('tax_info')
      .upsert({
        client_id: props.taxInfo.client_id,
        tax_identification_number: editData.value.tax_identification_number,
        is_ifi_subject: editData.value.is_ifi_subject,
        tax_residence_id: editData.value.tax_residence_id || null,
        us_tax_links: editData.value.us_tax_links,
        us_tin: editData.value.us_tax_links ? editData.value.us_tin : null
      })

    if (updateError) throw updateError

    isEditing.value = false
    emit('update')
  } catch (e: any) {
    console.error('Error updating tax info:', e)
    error.value = e.message
  }
}
</script>