<template>
  <div>
    <button 
      @click="addProfile"
      class="mb-4 px-3 py-1 bg-green-600 text-white rounded text-sm"
    >
      Add Profile
    </button>

    <div v-for="(inv, idx) in modelValue" :key="idx" class="mb-4">
      <dl class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="text-sm font-medium text-gray-500">Service</label>
          <select v-model="inv.related_service" class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white">
            <option value="mandat_de_gestion">Mandat de Gestion</option>
            <!-- Add more options if needed in the future -->
          </select>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">Main Objective</label>
          <input
            v-model="inv.main_objective"
            type="text"
            class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">Desired Return</label>
          <input
            v-model="inv.desired_return"
            type="text"
            class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">Risk Appetite</label>
          <input
            v-model="inv.risk_appetite"
            type="text"
            class="mt-1 block w-full border border-gray-300 rounded p-1 text-sm bg-white"
          />
        </div>
      </dl>
      <button 
        v-if="modelValue.length > 1"
        @click="removeProfile(idx)"
        class="mt-2 px-2 py-1 bg-red-600 text-white rounded text-sm"
      >
        Remove
      </button>
    </div>
    <button @click="$emit('save')" class="bg-blue-600 text-white px-3 py-1 mt-2 rounded text-sm">
      Save
    </button>
  </div>
</template>

<script setup lang="ts">
import { InvestmentProfile } from './types'

const props = defineProps<{
  modelValue: Partial<InvestmentProfile>[]
}>()

const emit = defineEmits<{
  'update:modelValue': [any[]]
  'save': []
  'remove': [string]  // emits profile id when deleting an existing profile
}>()

const addProfile = () => {
  const newProfile: Partial<InvestmentProfile> = {
    related_service: 'mandat_de_gestion',
    main_objective: '',
    desired_return: '',
    risk_appetite: 'moderate',
    investment_horizon: '',
    acceptable_loss: '',
    crypto_risks_acceptance: false
  }
  emit('update:modelValue', [...props.modelValue, newProfile])
}

const removeProfile = (index: number) => {
  const profiles = [...props.modelValue]
  const removed = profiles.splice(index, 1)[0]
  emit('update:modelValue', profiles)
  if (removed.id) {
    emit('remove', removed.id)
  }
}
</script>
