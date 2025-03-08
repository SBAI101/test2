<template>
  <form @submit.prevent="handleSave">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Tax Identification Number -->
      <div>
        <label class="text-sm font-medium text-gray-500">Tax ID</label>
        <input
          v-model="localValue.tax_identification_number"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        />
      </div>

      <!-- IFI Subject -->
      <div>
        <label class="text-sm font-medium text-gray-500">IFI Subject</label>
        <select
          v-model="localValue.is_ifi_subject"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        >
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>

      <!-- US TIN -->
      <div>
        <label class="text-sm font-medium text-gray-500">US TIN</label>
        <input
          v-model="localValue.us_tin"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        />
      </div>

      <!-- Tax Residence -->
      <div class="md:col-span-3">
        <label class="text-sm font-medium text-gray-500">Tax Residence</label>
        <select
          v-model="localValue.tax_residence_id"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        >
          <option disabled value="">Select a country</option>
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
        <label class="text-sm font-medium text-gray-500">US Tax Links</label>
        <select
          v-model="localValue.us_tax_links"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        >
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>

      <!-- Display validation errors -->
      <div
        v-for="(error, field) in errors"
        :key="field"
        class="text-red-600 text-sm mt-1 md:col-span-3"
      >
        {{ error }}
      </div>
    </div>
    <div class="mt-4">
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
        Save
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { TaxInfo, validateTaxId, validateUsTin, ERROR_MESSAGES } from './types'

const props = defineProps<{
  modelValue: Partial<TaxInfo>,
  countries: any[]
}>()

const emit = defineEmits<{
  'update:modelValue': [Partial<TaxInfo>],
  'save': []
}>()

const errors = ref<Partial<Record<keyof TaxInfo, string>>>({})

// Create a local copy for editing.
const localValue = ref({ ...props.modelValue })

// When the external modelValue changes, update the local copy.
watch(() => props.modelValue, (newVal) => {
  localValue.value = { ...newVal }
})

const validate = (): boolean => {
  errors.value = {}
  let isValid = true

  if (
    !localValue.value.tax_identification_number ||
    !validateTaxId(localValue.value.tax_identification_number)
  ) {
    errors.value.tax_identification_number = ERROR_MESSAGES.INVALID_TAX_ID
    isValid = false
  }

  if (localValue.value.us_tin && !validateUsTin(localValue.value.us_tin)) {
    errors.value.us_tin = ERROR_MESSAGES.INVALID_US_TIN
    isValid = false
  }

  return isValid
}

const handleSave = () => {
  if (validate()) {
    emit('update:modelValue', localValue.value)
    emit('save')
  }
}
</script>
