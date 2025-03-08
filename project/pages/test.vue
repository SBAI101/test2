<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Authentication Status -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Authentication Status</h2>
        <div class="space-y-2">
          <p class="text-sm">
            <span class="font-medium">Status:</span>
            <span 
              :class="authStore.user ? 'text-green-600' : 'text-red-600'"
              class="ml-2"
            >
              {{ authStore.user ? 'Authenticated' : 'Not Authenticated' }}
            </span>
          </p>
          <p v-if="authStore.user" class="text-sm">
            <span class="font-medium">User Email:</span>
            <span class="ml-2">{{ authStore.user.email }}</span>
          </p>
        </div>
      </div>

      <!-- User Roles -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">User Roles</h2>
        <div v-if="authStore.user" class="space-y-2">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium">Admin:</span>
            <span 
              :class="authStore.hasRole('admin') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ authStore.hasRole('admin') ? 'Yes' : 'No' }}
            </span>
          </div>
          <div class="text-sm">
            <span class="font-medium">All Roles:</span>
            <div class="mt-1 flex flex-wrap gap-2">
              <span
                v-for="role in authStore.roles"
                :key="role"
                class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
              >
                {{ role }}
              </span>
              <span v-if="!authStore.roles.length" class="text-gray-500 italic">
                No roles assigned
              </span>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500 italic">
          Please log in to view roles
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Actions</h2>
        <div class="space-x-4">
          <button
            v-if="!authStore.user"
            @click="navigateTo('/auth/login')"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Log In
          </button>
          <button
            v-else
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Log Out
          </button>
          <button
            @click="refreshRoles"
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
          >
            Refresh Roles
          </button>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const error = ref<string | null>(null)

const handleLogout = async () => {
  try {
    await authStore.signOut()
    navigateTo('/auth/login')
  } catch (e: any) {
    error.value = e.message
  }
}

const refreshRoles = async () => {
  try {
    await authStore.fetchRoles()
  } catch (e: any) {
    error.value = e.message
  }
}

// Load roles on mount if user is authenticated
onMounted(async () => {
  if (authStore.user && !authStore.roles.length) {
    await authStore.fetchRoles()
  }
})
</script>