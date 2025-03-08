<template>
  <client-only>
    <div>
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">{{ $t('navigation.taskManagement') }}</h1>
        <p class="mt-2 text-sm text-gray-600">Manage and track team tasks efficiently</p>
        
        <!-- View Toggle -->
        <div class="mt-4 flex items-center space-x-4">
          <button
            @click="currentView = 'list'"
            class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="currentView === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
          >
            <ListBulletIcon class="h-5 w-5 inline-block mr-1" />
            List View
          </button>
          <button
            @click="currentView = 'status-pipeline'"
            class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="currentView === 'status-pipeline' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
          >
            <ViewColumnsIcon class="h-5 w-5 inline-block mr-1" />
            Status Pipeline
          </button>
          <button
            @click="currentView = 'priority-pipeline'"
            class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="currentView === 'priority-pipeline' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
          >
            <AdjustmentsHorizontalIcon class="h-5 w-5 inline-block mr-1" />
            Priority Pipeline
          </button>
          <button
            @click="currentView = 'calendar'"
            class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="currentView === 'calendar' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
          >
            <CalendarIcon class="h-5 w-5 inline-block mr-1" />
            Calendar View
          </button>
        </div>
      </div>

      <!-- Task Creation Button -->
      <div class="mb-6">
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon class="h-5 w-5 inline-block mr-2" />
          Create New Task
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-4 border-b border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="col-span-2">
              <label class="sr-only">Search Tasks</label>
              <div class="relative">
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  v-model="filters.search"
                  type="text"
                  placeholder="Search tasks..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Status Filter -->
            <div>
              <select
                v-model="filters.status"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white text-gray-900"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <!-- Priority Filter -->
            <div>
              <select
                v-model="filters.priority"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white text-gray-900"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Views -->
      <TaskListView
        v-if="currentView === 'list'"
        :tasks="filteredTasks"
        @edit="editTask"
        @delete="deleteTask"
      />
      <TaskPipelineView
        v-else-if="currentView === 'status-pipeline'"
        :tasks="filteredTasks"
        @update:tasks="handleTasksUpdate"
        @edit="editTask"
        @delete="deleteTask"
      />
      <TaskPriorityPipelineView
        v-else-if="currentView === 'priority-pipeline'"
        :tasks="filteredTasks"
        @update:tasks="handleTasksUpdate"
        @edit="editTask"
        @delete="deleteTask"
      />
      <TaskCalendarView
        v-else-if="currentView === 'calendar'"
        :tasks="filteredTasks"
        @edit="editTask"
        @delete="deleteTask"
      />

      <!-- Create/Edit Task Modal -->
      <TaskModal
        v-if="showCreateModal"
        :task="selectedTask"
        @close="closeModal"
        @save="saveTask"
      />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { MagnifyingGlassIcon, PlusIcon, ListBulletIcon, ViewColumnsIcon, AdjustmentsHorizontalIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import TaskModal from '~/components/tasks/TaskModal.vue'
import TaskListView from '~/components/tasks/TaskListView.vue'
import TaskPipelineView from '~/components/tasks/TaskPipelineView.vue'
import TaskPriorityPipelineView from '~/components/tasks/TaskPriorityPipelineView.vue'
import TaskCalendarView from '~/components/tasks/TaskCalendarView.vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: 'auth' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const authStore = useAuthStore()

const currentView = ref('list')
const tasks = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showCreateModal = ref(false)
const selectedTask = ref<any>(null)

const filters = ref({
  search: '',
  status: '',
  priority: ''
})

const fetchTasks = async () => {
  try {
    loading.value = true
    
    // First check if we have an authenticated user
    if (!user.value) {
      throw new Error('Not authenticated')
    }
    
    // Use the RPC function to get tasks
    const { data, error: fetchError } = await supabase
      .from('tasks_with_users')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (fetchError) throw fetchError
    tasks.value = data || []
  } catch (e: any) {
    console.error('Error fetching tasks:', e)
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchesSearch = !filters.value.search ||
      task.title?.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      (task.description?.toLowerCase() || '').includes(filters.value.search.toLowerCase())

    const matchesStatus = !filters.value.status || task.status === filters.value.status
    const matchesPriority = !filters.value.priority || task.priority === filters.value.priority

    return matchesSearch && matchesStatus && matchesPriority
  })
})

const formatDate = (date: string) => {
  if (!date) return 'No due date'
  return new Date(date).toLocaleDateString('fr-FR')
}

const openCreateModal = () => {
  selectedTask.value = null
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  selectedTask.value = null
}

const saveTask = async (taskData: any) => {
  try {
    if (!user.value) throw new Error('Not authenticated')

    if (taskData.id) {
      // Update existing task
      const { error } = await supabase.rpc('update_task', {
        p_task_id: taskData.id,
        p_title: taskData.title,
        p_description: taskData.description,
        p_priority: taskData.priority,
        p_status: taskData.status,
        p_due_date: taskData.due_date,
        p_assigned_to: taskData.assigned_to,
        p_task_type: taskData.task_type,
        p_start_date: taskData.start_date,
        p_finished_date: taskData.finished_date
      })
      if (error) throw error
    } else {
      // Create new task
      const { error } = await supabase.rpc('create_task', {
        p_title: taskData.title,
        p_created_by: user.value.id,
        p_description: taskData.description,
        p_priority: taskData.priority,
        p_status: taskData.status,
        p_due_date: taskData.due_date,
        p_assigned_to: taskData.assigned_to,
        p_task_type: taskData.task_type,
        p_start_date: taskData.start_date,
        p_finished_date: taskData.finished_date
      })
      if (error) throw error
    }

    await fetchTasks()
    showCreateModal.value = false
  } catch (e: any) {
    console.error('Error saving task:', e)
    error.value = e.message
  }
}


const editTask = (task: any) => {
  selectedTask.value = { ...task }
  showCreateModal.value = true
}

const deleteTask = async (task: any) => {
  if (!confirm('Are you sure you want to delete this task?')) return
  try {
    const { error } = await supabase
      .rpc('delete_task', { p_task_id: task.task_id || task.id })

    if (error) throw error

    await fetchTasks()
  } catch (e: any) {
    console.error('Error deleting task:', e)
    error.value = e.message
  }
}

const handleTasksUpdate = (updatedTasks: any[]) => {
  tasks.value = updatedTasks
}

onMounted(async () => {
  // Load roles first
  if (!authStore.roles.length) {
    await authStore.fetchRoles()
  }
  fetchTasks()
})
</script>