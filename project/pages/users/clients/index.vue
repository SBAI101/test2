<!-- pages/users/clients/index.vue -->
<template>
  <div>
    <UserManagementNav />
    
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">{{ $t('userManagement.clients.title') }}</h1>
        <p class="mt-2 text-sm text-gray-600">{{ $t('userManagement.clients.description') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-4 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="col-span-2">
            <label class="sr-only">{{ $t('userManagement.clients.filters.search') }}</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                v-model="filters.search"
                :placeholder="$t('userManagement.clients.filters.search')"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="sr-only">{{ $t('userManagement.clients.filters.status') }}</label>
            <select
              v-model="filters.status"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white"
            >
              <option value="">{{ $t('userManagement.clients.filters.status') }}</option>
              <option
                v-for="status in statuses"
                :key="status"
                :value="status"
              >
                {{ $t(`userManagement.clients.status.${status}`) }}
              </option>
            </select>
          </div>

          <!-- Type Filter -->
          <div>
            <label class="sr-only">{{ $t('userManagement.clients.filters.type') }}</label>
            <select
              v-model="filters.type"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white"
            >
              <option value="">{{ $t('userManagement.clients.filters.type') }}</option>
              <option value="physique">Personne Physique</option>
              <option value="moral">Personne Morale</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Client List -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Portfolio Manager
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in filteredClients" :key="client.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <UserCircleIcon class="h-10 w-10 text-gray-300" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ client.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ client.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ client.type }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': client.status === 'active',
                    'bg-yellow-100 text-yellow-800': client.status === 'pending',
                    'bg-red-100 text-red-800': client.status === 'suspended',
                    'bg-gray-100 text-gray-800': client.status === 'inactive'
                  }">
                  {{ $t(`userManagement.clients.status.${client.status}`) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ client.portfolioManager }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(client.updatedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="navigateTo(`/users/clients/${client.id}`)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    {{ $t('userManagement.clients.actions.view') }}
                  </button>
                  <button
                    @click="editClient(client)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    {{ $t('userManagement.clients.actions.edit') }}
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
  UserCircleIcon
} from '@heroicons/vue/24/outline'
import { useClients } from '~/composables/useClients'
import { useSupabaseClient } from '#imports'
import UserManagementNav from '~/components/users/UserManagementNav.vue'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const supabase = useSupabaseClient()
const clients = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const filters = ref({
  search: '',
  status: '',
  type: ''
})

const statuses = ['active', 'pending', 'suspended', 'inactive']

const filteredClients = computed(() => {
  if (loading.value) return []
  
  return clients.value.filter(client => {
    const matchesSearch = !filters.value.search || 
      client.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      client.email.toLowerCase().includes(filters.value.search.toLowerCase())
    
    const matchesStatus = !filters.value.status || client.status === filters.value.status
    const matchesType = !filters.value.type || client.type === filters.value.type

    return matchesSearch && matchesStatus && matchesType
  })
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const editClient = (client: any) => {
  // Implement edit logic
  console.log('Edit client:', client)
}

// Fetch clients implementation
const fetchClients = async () => {
  try {
    loading.value = true

    const { data: clientData, error: clientError } = await supabase
      .from('clients_with_user')
      .select(`
        id,
        person_type,
        full_name,
        email,
        status,
        updated_at,
        user_id
      `)
      .is('deleted_at', null)

    if (clientError) throw clientError
    
    // Map the returned data to our Client interface.
    clients.value = clientData.map((client: any) => ({
      id: client.id,
      name: client.full_name || 'Unknown',
      email: client.email || 'Unknown',
      type: client.person_type || 'physique',
      status: client.status || 'pending',
      portfolioManager: 'Unassigned',
      updatedAt: new Date(client.updated_at)
    }))

  } catch (e: any) {
    console.error('Error fetching clients:', e)
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// Fetch clients on mount
onMounted(() => {
  fetchClients()
})
</script>