<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">Investment Profiles</h2>
      <button class="text-sm text-blue-600 hover:text-blue-800" @click="isEditing = !isEditing">
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </button>
    </div>
    <div v-if="!isEditing">
      <div v-if="normalizedProfiles.length > 0">
        <ul class="space-y-2">
          <li
            v-for="profile in normalizedProfiles"
            :key="profile.id"
            class="p-2 border rounded"
          >
            <div>
              <strong>Service:</strong> {{ profile.related_service }}
            </div>
            <div>
              <strong>Desired Return:</strong>
              {{ profile.desired_return || 'Not provided' }}
            </div>
            <!-- Add any additional fields as needed -->
          </li>
        </ul>
      </div>
      <div v-else class="text-sm text-gray-500">
        No investment profiles available.
      </div>
    </div>
    <!-- Optionally, add an editing form when isEditing is true -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Allow profiles to be undefined or null, then normalize to an array.
const props = defineProps<{ profiles?: any[] | null }>()
const isEditing = ref(false)

const normalizedProfiles = computed(() => {
  return props.profiles && Array.isArray(props.profiles)
    ? props.profiles
    : []
})
</script>
