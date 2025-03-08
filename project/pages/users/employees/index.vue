<!-- pages/users/employees/index.vue -->
<template>
  <div>
    <UserManagementNav />

    <div>
      <h1 class="text-2xl font-semibold text-gray-900">{{ $t('userManagement.employees.title') }}</h1>
      <p class="mt-2 text-sm text-gray-600">{{ $t('userManagement.employees.description') }}</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-4 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="col-span-2">
            <label class="sr-only">{{ $t('userManagement.employees.filters.search') }}</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                v-model="filters.search"
                :placeholder="$t('userManagement.employees.filters.search')"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Role Filter -->
          <div>
            <label class="sr-only">{{ $t('userManagement.employees.filters.role') }}</label>
            <select
              v-model="filters.role"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">{{ $t('userManagement.employees.filters.role') }}</option>
              <option
                v-for="role in roles"
                :key="role"
                :value="role"
              >
                {{ $t(`userManagement.employees.roles.${role}`) }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="sr-only">{{ $t('userManagement.employees.filters.status') }}</label>
            <select
              v-model="filters.status"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">{{ $t('userManagement.employees.filters.status') }}</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Employee List -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Clients
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="employee in filteredEmployees" :key="employee.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <UserCircleIcon class="h-10 w-10 text-gray-300" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ employee.full_name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ employee.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ employee.role }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': employee.status === 'active',
                    'bg-gray-100 text-gray-800': employee.status === 'inactive'
                  }">
                  {{ employee.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ employee.assigned_clients }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(employee.last_active) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewEmployee(employee)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    {{ $t('userManagement.employees.actions.view') }}
                  </button>
                  <button
                    @click="editEmployee(employee)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    {{ $t('userManagement.employees.actions.edit') }}
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
import { useEmployees } from '~/composables/useEmployees'
import UserManagementNav from '~/components/users/UserManagementNav.vue'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { employees, loading, error, fetchEmployees } = useEmployees()

const filters = ref({
  search: '',
  role: '',
  status: ''
})

const roles = ['admin', 'manager', 'advisor', 'support']

onMounted(() => {
  fetchEmployees()
})

const filteredEmployees = computed(() => {
  if (loading.value) return []
  
  return employees.value.filter(employee => {
    const matchesSearch = !filters.value.search || 
      employee.full_name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      employee.email.toLowerCase().includes(filters.value.search.toLowerCase())
    
    const matchesRole = !filters.value.role || employee.role === filters.value.role
    const matchesStatus = !filters.value.status || employee.status === filters.value.status

    return matchesSearch && matchesRole && matchesStatus
  })
})

const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

const viewEmployee = (employee: any) => {
  navigateTo(`/users/employees/${employee.id}`)
}

const editEmployee = (employee: any) => {
  navigateTo(`/users/employees/${employee.id}/edit`)
}
</script>