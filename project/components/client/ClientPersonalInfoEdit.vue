<template>
  <form @submit.prevent="handleSave">
    <dl class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Personal Info Fields -->
      <div>
        <label class="text-sm font-medium text-gray-500">Full Name</label>
        <input
          v-model="modelValue.full_name"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        />
      </div>
      <div>
        <label class="text-sm font-medium text-gray-500">Civility</label>
        <input
          v-model="modelValue.civility"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        />
      </div>
      <div>
        <label class="text-sm font-medium text-gray-500">Email</label>
        <input
          v-model="modelValue.email"
          type="email"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        />
      </div>
      <div>
        <label class="text-sm font-medium text-gray-500">Phone Number</label>
        <input
          v-model="modelValue.phone_number"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        />
      </div>
      <div>
        <label class="text-sm font-medium text-gray-500">Date of Birth</label>
        <input
          v-model="modelValue.date_of_birth"
          type="date"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        />
      </div>
      <div>
        <label class="text-sm font-medium text-gray-500">Place of Birth</label>
        <input
          v-model="modelValue.place_of_birth"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        />
      </div>
      <!-- Client's Personal Address -->
      <div class="md:col-span-2">
        <label class="text-sm font-medium text-gray-500">Address</label>
        <input
          v-model="modelValue.address"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        />
      </div>
      <div>
        <label class="text-sm font-medium text-gray-500">Postal Code</label>
        <input
          v-model="modelValue.postal_code"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        />
      </div>
      <div>
        <label class="text-sm font-medium text-gray-500">City</label>
        <input
          v-model="modelValue.city"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        />
      </div>
      <div>
        <label class="text-sm font-medium text-gray-500">Country</label>
        <CountryDropdown 
          v-model="modelValue.country_id" 
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        />
      </div>
      <!-- Client Type -->
      <div>
        <label class="text-sm font-medium text-gray-500">Client Type</label>
        <select
          v-model="modelValue.type"
          class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
        >
          <option value="physique">Physique</option>
          <option value="morale">Morale</option>
        </select>
      </div>
      <!-- Error display -->
      <div v-for="(error, field) in errors" :key="field" class="text-red-600 text-sm mt-1">
        {{ error }}
      </div>
    </dl>
    <div class="mt-4">
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
        Save
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { validateEmail, validatePhone, validatePostalCode, ERROR_MESSAGES } from './types'
import CountryDropdown from '~/components/common/CountryDropdown.vue'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits<{
  'update:modelValue': [any],
  'save': []
}>()

const errors = ref<Record<string, string>>({})

const validate = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!props.modelValue.email || !validateEmail(props.modelValue.email)) {
    errors.value.email = ERROR_MESSAGES.INVALID_EMAIL
    isValid = false
  }

  if (!props.modelValue.phone_number || !validatePhone(props.modelValue.phone_number)) {
    errors.value.phone_number = ERROR_MESSAGES.INVALID_PHONE
    isValid = false
  }

  if (props.modelValue.postal_code && !validatePostalCode(props.modelValue.postal_code)) {
    errors.value.postal_code = ERROR_MESSAGES.INVALID_POSTAL_CODE
    isValid = false
  }

  return isValid
}

const handleSave = () => {
  if (validate()) {
    emit('save', props.modelValue)
  }
}
</script>