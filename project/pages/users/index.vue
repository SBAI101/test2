<template>
  <div>
    <UserManagementNav />

    <!-- Section Tabs -->
    <div class="mb-8">
      <div class="mb-4">
        <h1 class="text-2xl font-semibold text-gray-900">
          Role & Permission Management
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          Manage roles, permissions, and their relationships
        </p>
      </div>

      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in ['roles', 'permissions', 'assignments']"
            :key="tab"
            @click="currentTab = tab"
            class="py-4 px-1 border-b-2 font-medium text-sm"
            :class="[
              currentTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Roles Tab -->
    <div
      v-if="currentTab === 'roles'"
      class="bg-white shadow rounded-lg overflow-hidden mb-6"
    >
      <div
        class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
      >
        <h2 class="text-lg font-medium text-gray-900">Roles Overview</h2>
        <button
          @click="showRoleModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Add New Role
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="role in roles" :key="role.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ role.name }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500">{{ role.description }}</div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="editRole(role)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Edit
                </button>
                <button
                  v-if="role.name !== 'admin'"
                  @click="deleteRole(role)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Permissions Tab -->
    <div
      v-if="currentTab === 'permissions'"
      class="bg-white shadow rounded-lg overflow-hidden mb-6"
    >
      <div
        class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
      >
        <h2 class="text-lg font-medium text-gray-900">Permissions Overview</h2>
        <button
          @click="showPermissionModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Add New Permission
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Permission Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="permission in permissions" :key="permission.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ permission.permission_name }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500">
                  {{ permission.description }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="editPermission(permission)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="deletePermission(permission)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Assignments Tab -->
    <div
      v-if="currentTab === 'assignments'"
      class="bg-white shadow rounded-lg overflow-hidden mb-6"
    >
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">
          Role-Permission Assignments
        </h2>
      </div>

      <div class="p-6">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700"
            >Select Role</label
          >
          <select
            v-model="selectedRoleId"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Choose a role</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

        <div v-if="selectedRoleId" class="space-y-4">
          <div class="border rounded-md p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Assign Permissions
            </h3>
            <div class="space-y-2">
              <label
                v-for="permission in permissions"
                :key="permission.id"
                class="flex items-center space-x-3"
              >
                <input
                  type="checkbox"
                  :value="permission.id"
                  v-model="selectedPermissions"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="text-sm text-gray-900">{{
                  permission.permission_name
                }}</span>
              </label>
            </div>
            <div class="mt-4">
              <button
                @click="saveAssignments"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Save Assignments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showRoleModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingRole ? 'Edit Role' : 'Create New Role' }}
          </h3>
        </div>

        <form @submit.prevent="handleSaveRole" class="p-6">
          <div class="space-y-4">
            <!-- Role Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Role Name</label
              >
              <input
                v-model="roleForm.name"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <textarea
                v-model="roleForm.description"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {{ editingRole ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Permission Modal -->
    <div
      v-if="showPermissionModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{
              editingPermission ? 'Edit Permission' : 'Create New Permission'
            }}
          </h3>
        </div>

        <form @submit.prevent="handleSavePermission" class="p-6">
          <div class="space-y-4">
            <!-- Permission Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Permission Name</label
              >
              <input
                v-model="permissionForm.name"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <textarea
                v-model="permissionForm.description"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="closePermissionModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {{ editingPermission ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import UserManagementNav from '~/components/users/UserManagementNav.vue'

definePageMeta({
middleware: ['auth', 'admin']
})

const supabase = useSupabaseClient()
const roles = ref<any[]>([])
const showRoleModal = ref(false)
const showPermissionModal = ref(false)
const editingRole = ref<any>(null)
const editingPermission = ref<any>(null)
const currentTab = ref('roles')
const selectedRoleId = ref('')
const selectedPermissions = ref<string[]>([])
const permissions = ref<any[]>([])
const editingPermission = ref<any>(null)
const currentTab = ref('roles')
const selectedRoleId = ref('')
const selectedPermissions = ref<string[]>([])

const roleForm = ref({
name: '',
description: ''
})

  roles.value = rolesData
} catch (error) {
  console.error('Error fetching roles:', error)
}
}

const fetchPermissions = async () => {
try {
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .is('deleted_at', null)
    .order('permission_name')

  if (error) throw error
  permissions.value = data
} catch (error) {
  console.error('Error fetching permissions:', error)
}
}
      .insert({

  await fetchRoles()
  closeModal()
  closeRoleModal()
} catch (error) {
  console.error('Error saving role:', error)
  alert('Error saving role. Please try again.')
}
}

const handleSavePermission = async () => {
try {
  if (editingPermission.value) {
    const { error } = await supabase
      .from('permissions')
      .update({
        permission_name: permissionForm.value.name,
        description: permissionForm.value.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingPermission.value.id)

    if (error) throw error
  } else {
    const { error } = await supabase
      .from('permissions')
      .insert({
        permission_name: permissionForm.value.name,
        description: permissionForm.value.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) throw error
  }

  await fetchPermissions()
  closePermissionModal()
} catch (error) {
  console.error('Error saving permission:', error)
}
}

const saveAssignments = async () => {
try {
  // First delete existing assignments for this role
  const { error: deleteError } = await supabase
    .delete()
    .eq('role_id', selectedRoleId.value)

  if (deleteError) throw deleteError

  // Then insert new assignments
  if (selectedPermissions.value.length > 0) {
    const { error: insertError } = await supabase
      .from('role_permissions')
      .insert(
        selectedPermissions.value.map(permissionId => ({
          role_id: selectedRoleId.value,
          permission_id: permissionId,
          created_at: new Date().toISOString()
        }))
      )

    if (insertError) throw insertError
  }

  // Refresh data
  await fetchRoles()
  alert('Permissions assigned successfully')
} catch (error) {
  console.error('Error saving assignments:', error)
  alert('Error saving assignments')
}
}

const handleSavePermission = async () => {
try {
  if (editingPermission.value) {
    const { error } = await supabase
      .from('permissions')
      .update({
        permission_name: permissionForm.value.name,
        description: permissionForm.value.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingPermission.value.id)

    if (error) throw error
  } else {
    const { error } = await supabase
      .from('permissions')
      .insert({
        permission_name: permissionForm.value.name,
        description: permissionForm.value.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) throw error
  }

  await fetchPermissions()
  closePermissionModal()
} catch (error) {
  console.error('Error saving permission:', error)
}
}

const saveAssignments = async () => {
try {
  // First delete existing assignments for this role
  const { error: deleteError } = await supabase
    .from('role_permissions')
    .delete()
    .eq('role_id', selectedRoleId.value)

  if (deleteError) throw deleteError

  // Then insert new assignments
  if (selectedPermissions.value.length > 0) {
    const { error: insertError } = await supabase
      .from('role_permissions')
      .insert(
        selectedPermissions.value.map(permissionId => ({
          role_id: selectedRoleId.value,
          permission_id: permissionId,
          created_at: new Date().toISOString()
        }))
      )

    if (insertError) throw insertError
  }

  // Refresh data
  await fetchRoles()
  alert('Permissions assigned successfully')
} catch (error) {
  console.error('Error saving assignments:', error)
  alert('Error saving assignments')
}
}

const editRole = (role: any) => {
editingRole.value = role
roleForm.value = {
  name: role.name || '',
  description: role.description
}
showRoleModal.value = true
}

const editPermission = (permission: any) => {
editingPermission.value = permission
permissionForm.value = {
  name: permission.permission_name,
  description: permission.description
}
showPermissionModal.value = true
}

const editPermission = (permission: any) => {
editingPermission.value = permission
permissionForm.value = {
  name: permission.permission_name,
  description: permission.description
}
showPermissionModal.value = true
}

const deleteRole = async (role: any) => {
if (!confirm(`Are you sure you want to delete the role "${role.name}"?`)) return

try {
  const { error } = await supabase
    .from('roles')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', role.id)

  if (error) throw error
  await fetchRoles()
} catch (error) {
  console.error('Error deleting role:', error)
}
}

const deletePermission = async (permission: any) => {
if (!confirm(`Are you sure you want to delete this permission?`)) return

try {
  const { error } = await supabase
    .from('permissions')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', permission.id)

  if (error) throw error
  await fetchPermissions()
} catch (error) {
  console.error('Error deleting permission:', error)
}
}

const deletePermission = async (permission: any) => {
if (!confirm(`Are you sure you want to delete this permission?`)) return

try {
  const { error } = await supabase
    .from('permissions')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', permission.id)

  if (error) throw error
  await fetchPermissions()
} catch (error) {
  console.error('Error deleting permission:', error)
}
}

const deletePermission = async (permission: any) => {
if (!confirm(`Are you sure you want to delete this permission?`)) return

try {
  const { error } = await supabase
    .from('permissions')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', permission.id)

  if (error) throw error
  await fetchPermissions()
} catch (error) {
  console.error('Error deleting permission:', error)
}
}

const closeRoleModal = () => {
showRoleModal.value = false
editingRole.value = null
roleForm.value = {
  name: '',
  description: ''
}
}

const closePermissionModal = () => {
showPermissionModal.value = false
editingPermission.value = null
permissionForm.value = {
  name: '',
  description: ''
}
}

watch(selectedRoleId, async (newId) => {
if (newId) {
  // Fetch current permissions for this role
  const { data, error } = await supabase
    .select('permission_id')
    .eq('role_id', newId)

  if (!error && data) {
    selectedPermissions.value = data.map(rp => rp.permission_id)
  }
} else {
  selectedPermissions.value = []
}
})

onMounted(() => {
fetchRoles()
fetchPermissions()
})
</script>
