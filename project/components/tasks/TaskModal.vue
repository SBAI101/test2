<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ task ? 'Edit Task' : 'Create New Task' }}
        </h3>
      </div>

      <form id="taskForm" @submit.prevent="handleSubmit" class="p-6 overflow-y-auto">
        <div class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
            ></textarea>
          </div>

          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Priority</label>
            <select
              v-model="formData.priority"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="formData.status"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <!-- Due Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              v-model="formData.due_date"
              type="date"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
            />
          </div>

          <!-- Assigned To -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Assign To</label>
            <select
              v-model="formData.assigned_to"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
            >
              <option value="">Unassigned</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.full_name || user.email }}
              </option>
            </select>
          </div>

          <!-- Recurrence -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Recurrence</label>
            <select
              v-model="formData.recurrence_pattern"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
            >
              <option value="">No recurrence</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <!-- Task Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Task Type</label>
            <input
              v-model="formData.task_type"
              type="text"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
            />
          </div>

          <!-- Start Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              v-model="formData.start_date"
              type="date"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
            />
          </div>

          <!-- Finished Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Finished Date</label>
            <input
              v-model="formData.finished_date"
              type="date"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
            />
          </div>
        </div>

      </form>
      
      <div class="px-6 py-4 border-t border-gray-200 mt-auto">
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ task ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSupabaseClient } from '#imports'
const user = useSupabaseUser()

const props = defineProps<{
  task?: {
    id?: string;
    title: string;
    description?: string;
    priority?: string;
    progress_percentage?: number
  }
}>()

const emit = defineEmits<{
  close: [],
  save: [any]
}>()

const supabase = useSupabaseClient()
const users = ref<any[]>([])

const formData = ref({
  id: '',
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  due_date: '',
  assigned_to: '',
  recurrence_pattern: '',
  progress_percentage: 0,
  task_type: '',
  start_date: '',
  finished_date: ''
})

watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.value = {
      ...formData.value,
      ...newTask,
      id: newTask.id // Ensure ID is preserved for updates
    }
  } else {
    // Reset form for new task
    formData.value = {
      id: '',
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      due_date: '',
      assigned_to: '',
      recurrence_pattern: '',
      progress_percentage: 0,
      task_type: '',
      start_date: '',
      finished_date: ''
    }
  }
}, { immediate: true })

const fetchUsers = async () => {
  try {
    if (!user.value) throw new Error('Not authenticated')

    // Get all users from profiles
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name
      `)
      .is('deleted_at', null)
      .order('full_name')
    
    if (error) throw error
    
    // Add current user at the top of the list
    users.value = [
      {
        id: user.value.id,
        email: user.value.email,
        full_name: data.find(p => p.id === user.value.id)?.full_name || user.value.email
      },
      ...data.filter(p => p.id !== user.value.id)
    ]
  } catch (e) {
    console.error('Error fetching users:', e)
  }
}

const handleSubmit = () => {
  emit('save', {
    ...formData.value,
    id: props.task?.id // Include ID only if editing
  })
}

onMounted(() => {
  fetchUsers()
})
</script>