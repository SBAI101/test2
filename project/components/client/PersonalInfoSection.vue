<template>
  <div class="bg-white rounded-lg shadow p-6 relative">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">Personal Info</h2>
      <button
        class="text-sm text-blue-600 hover:text-blue-800"
        @click="toggleEdit"
      >
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </button>
    </div>
    
    <!-- Show view mode when not editing -->
    <ClientPersonalInfoView
      v-if="!isEditing"
      :client="client"
      :personal-info="personalInfo"
      @toggle-email="$emit('toggle-email')"
      @toggle-phone="$emit('toggle-phone')"
    />
    
    <!-- Show edit form when editing -->
    <ClientPersonalInfoEdit
      v-else
      v-model="editData"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ClientPersonalInfoView from '~/components/client/ClientPersonalInfoView.vue'
import ClientPersonalInfoEdit from '~/components/client/ClientPersonalInfoEdit.vue'

const props = defineProps<{
  client: any,
  personalInfo: any
}>()

const emit = defineEmits<{
  save: [any]
  'toggle-email': []
  'toggle-phone': []
}>()

const isEditing = ref(false)
const editData = ref<any>({})

// Function to reinitialize editData from props
const initializeEditData = () => {
  editData.value = {
    ...props.client,
    ...props.personalInfo,
    full_name: props.client?.full_name || props.personalInfo?.full_name || ''
  }
}

const toggleEdit = () => {
  // When switching to edit mode, reinitialize the edit data
  if (!isEditing.value) {
    initializeEditData()
  }
  isEditing.value = !isEditing.value
}

const handleSave = () => {
  emit('save', editData.value)
  isEditing.value = false
}

// Watch for changes in props; if not editing, update editData automatically
watch(
  () => [props.client, props.personalInfo],
  ([newClient, newPersonalInfo]) => {
    if (!isEditing.value) {
      initializeEditData()
    }
  },
  { immediate: true }
)
</script>
