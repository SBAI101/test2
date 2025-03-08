<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-medium text-gray-900">Documents</h2>
      <button
        @click="openFileDialog"
        class="text-sm text-blue-600 hover:text-blue-800"
      >
        Upload Document
      </button>
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        @change="handleFileUpload"
      />
    </div>

    <div v-if="documents.length === 0" class="text-center py-8 text-gray-500">
      No documents found
    </div>
    
    <ul v-else class="divide-y divide-gray-200">
      <li v-for="doc in documents" :key="doc.id" class="py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">{{ doc.file_name }}</p>
            <p class="text-sm text-gray-500">{{ doc.file_type }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <span
              class="px-2 py-1 text-xs rounded-full"
              :class="{
                'bg-green-100 text-green-800': doc.status === 'verified',
                'bg-yellow-100 text-yellow-800': doc.status === 'pending',
                'bg-red-100 text-red-800': doc.status === 'rejected'
              }"
            >
              {{ doc.status }}
            </span>
            <button @click="$emit('view', doc)" class="text-sm text-blue-600 hover:text-blue-800">
              View
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  documents: any[]
}>()

const emit = defineEmits<{
  upload: [File]
  view: [any]
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const openFileDialog = () => {
  fileInput.value?.click()
}

const handleFileUpload = (evt: Event) => {
  const file = (evt.target as HTMLInputElement).files?.[0]
  if (file) {
    emit('upload', file)
  }
}
</script>