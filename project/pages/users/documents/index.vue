<!-- pages/users/documents/index.vue -->
<template>
  <div>
    <UserManagementNav />
    
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">{{ $t('userManagement.documents.title') }}</h1>
        <p class="mt-2 text-sm text-gray-600">{{ $t('userManagement.documents.description') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-4 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="col-span-2">
            <label class="sr-only">{{ $t('userManagement.documents.filters.search') }}</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                v-model="filters.search"
                :placeholder="$t('userManagement.documents.filters.search')"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Type Filter -->
          <div>
            <label class="sr-only">{{ $t('userManagement.documents.filters.type') }}</label>
            <select
              v-model="filters.type"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">{{ $t('userManagement.documents.filters.type') }}</option>
              <option
                v-for="type in documentTypes"
                :key="type"
                :value="type"
              >
                {{ $t(`userManagement.documents.types.${type}`) }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="sr-only">{{ $t('userManagement.documents.filters.status') }}</label>
            <select
              v-model="filters.status"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">{{ $t('userManagement.documents.filters.status') }}</option>
              <option
                v-for="status in documentStatuses"
                :key="status"
                :value="status"
              >
                {{ $t(`userManagement.documents.status.${status}`) }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Document List -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="document in filteredDocuments" :key="document.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <DocumentIcon class="h-10 w-10 text-gray-300" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ document.file_name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatFileSize(document.file_size) }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ $t(`userManagement.documents.types.${document.file_type}`) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ document.client_name }}</div>
                <div class="text-sm text-gray-500">{{ document.client_email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': document.status === 'verified',
                    'bg-yellow-100 text-yellow-800': document.status === 'pending',
                    'bg-red-100 text-red-800': document.status === 'rejected',
                    'bg-gray-100 text-gray-800': document.status === 'expired'
                  }">
                  {{ $t(`userManagement.documents.status.${document.status}`) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(document.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewDocument(document)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                  <button
                    v-if="document.status === 'pending'"
                    @click="verifyDocument(document)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Verify
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  DocumentIcon
} from '@heroicons/vue/24/outline'
import { useDocuments } from '~/composables/useDocuments'
import UserManagementNav from '~/components/users/UserManagementNav.vue'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { documents, loading, error, fetchDocuments } = useDocuments()

const filters = ref({
  search: '',
  type: '',
  status: ''
})

const documentTypes = ['kyc', 'contract', 'id', 'proof', 'other']
const documentStatuses = ['pending', 'verified', 'rejected', 'expired']

onMounted(() => {
  fetchDocuments()
})

const filteredDocuments = computed(() => {
  if (loading.value) return []
  
  return documents.value.filter(document => {
    const matchesSearch = !filters.value.search || 
      document.file_name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      document.client_name.toLowerCase().includes(filters.value.search.toLowerCase())
    
    const matchesType = !filters.value.type || document.file_type === filters.value.type
    const matchesStatus = !filters.value.status || document.status === filters.value.status

    return matchesSearch && matchesType && matchesStatus
  })
})

const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const viewDocument = (document: any) => {
  // Implement document viewing logic
  console.log('View document:', document)
}

const verifyDocument = async (document: any) => {
  // Implement document verification logic
  console.log('Verify document:', document)
}
</script>