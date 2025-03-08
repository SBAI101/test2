<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ name || 'Client Profile' }}
      </h1>
      <!-- Advanced Options Dropdown -->
      <div class="relative">
        <button
          @click="toggleAdvancedDropdown"
          class="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Advanced
        </button>
        <transition name="fade">
          <div
            v-if="showAdvancedDropdown"
            class="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow z-10"
          >
            <button
              class="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 text-red-600"
              @click="handleDelete"
            >
              Delete Client
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Client Status Badge -->
    <div class="flex items-center space-x-2 mt-4">
      <span
        class="px-3 py-1 text-sm rounded-full"
        :class="{
          'bg-green-100 text-green-800': status === 'completed',
          'bg-yellow-100 text-yellow-800': status === 'pending',
          'bg-red-100 text-red-800': status === 'rejected',
          'bg-blue-100 text-blue-800': status === 'in_progress'
        }"
      >
        {{ status }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  status: string
}>()

const emit = defineEmits<{
  delete: []
}>()

const showAdvancedDropdown = ref(false)

const toggleAdvancedDropdown = () => {
  showAdvancedDropdown.value = !showAdvancedDropdown.value
}

const handleDelete = () => {
  showAdvancedDropdown.value = false
  if (confirm('Are you sure you want to delete this client?')) {
    emit('delete')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>