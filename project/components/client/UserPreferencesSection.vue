<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">User Preferences</h2>
      <button
        class="text-sm text-blue-600 hover:text-blue-800"
        @click="isEditing = !isEditing"
      >
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </button>
    </div>

    <div v-if="!isEditing">
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Communication Preferences -->
        <div>
          <dt class="text-sm font-medium text-gray-500">Communication Preferences</dt>
          <dd class="mt-1 text-sm text-gray-900">
            <ul v-if="communicationPrefsArray.length > 0">
              <li v-for="(item, index) in communicationPrefsArray" :key="index">
                {{ item.key }}: {{ item.value }}
              </li>
            </ul>
            <span v-else>Not set</span>
          </dd>
        </div>

        <!-- Notification Preferences -->
        <div>
          <dt class="text-sm font-medium text-gray-500">Notification Preferences</dt>
          <dd class="mt-1 text-sm text-gray-900">
            <ul v-if="notificationPrefsArray.length > 0">
              <li v-for="(item, index) in notificationPrefsArray" :key="index">
                {{ item.key }}: {{ item.value }}
              </li>
            </ul>
            <span v-else>Not set</span>
          </dd>
        </div>

        <!-- Notification Frequency -->
        <div>
          <dt class="text-sm font-medium text-gray-500">Notification Frequency</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ preferences?.notification_frequency || 'Not set' }}
          </dd>
        </div>

        <!-- Email Types -->
        <div>
          <dt class="text-sm font-medium text-gray-500">Email Types</dt>
          <dd class="mt-1 text-sm text-gray-900">
            <ul v-if="emailTypesArray.length > 0">
              <li v-for="(item, index) in emailTypesArray" :key="index">
                {{ item }}
              </li>
            </ul>
            <span v-else>Not set</span>
          </dd>
        </div>

        <!-- Language Preference -->
        <div>
          <dt class="text-sm font-medium text-gray-500">Language Preference</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ preferences?.language_preference === 'fr' ? 'French' : 'English' }}
          </dd>
        </div>
      </dl>
    </div>

    <div v-else>
      <form @submit.prevent="handleSave" class="space-y-4">
        <!-- Communication Preferences -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Communication Preferences</label>
          <div class="mt-2 space-y-2">
            <label class="flex items-center">
              <input type="checkbox" v-model="editData.communication_preferences.email" class="mr-2">
              Email
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="editData.communication_preferences.sms" class="mr-2">
              SMS
            </label>
          </div>
        </div>

        <!-- Notification Frequency -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Notification Frequency</label>
          <select v-model="editData.notification_frequency" class="mt-1 block w-full rounded-md border-gray-300">
            <option value="immediate">Immediate</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <!-- Language Preference -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Language</label>
          <select v-model="editData.language_preference" class="mt-1 block w-full rounded-md border-gray-300">
            <option value="fr">French</option>
            <option value="en">English</option>
          </select>
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
  preferences: any
}>()

const emit = defineEmits(['update'])
const supabase = useSupabaseClient()
const isEditing = ref(false)
const editData = ref({
  communication_preferences: {},
  notification_preferences: {},
  notification_frequency: 'immediate',
  email_types: {},
  language_preference: 'fr'
})

// Initialize edit data when entering edit mode
watch(() => isEditing.value, (newVal) => {
  if (newVal) {
    editData.value = { ...props.preferences }
  }
})

const handleSave = async () => {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .update(editData.value)
      .eq('user_id', props.preferences.user_id)

    if (error) throw error
    
    isEditing.value = false
    emit('update')
  } catch (err) {
    console.error('Error saving preferences:', err)
  }
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const communicationPrefsArray = computed(() => {
  const prefs = props.preferences?.communication_preferences
  if (!prefs) return []
  let obj = typeof prefs === 'string' ? JSON.parse(prefs) : prefs
  return Object.entries(obj).map(([key, value]) => ({
    key: capitalize(key),
    value: value ? 'Yes' : 'No'
  }))
})

const notificationPrefsArray = computed(() => {
  const prefs = props.preferences?.notification_preferences
  if (!prefs) return []
  let obj = typeof prefs === 'string' ? JSON.parse(prefs) : prefs
  return Object.entries(obj).map(([key, value]) => ({
    key: capitalize(key),
    value: value ? 'Yes' : 'No'
  }))
})

const emailTypesArray = computed(() => {
  const types = props.preferences?.email_types
  if (!types) return []
  let obj = typeof types === 'string' ? JSON.parse(types) : types
  return Object.entries(obj)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => capitalize(key))
})
</script>