<template>
  <div class="flex gap-6 overflow-x-auto pb-4">
    <!-- Pipeline Columns -->
    <div 
      v-for="status in ['pending', 'in_progress', 'completed']" 
      :key="status"
      class="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4 min-h-[200px]"
      @dragover.prevent
      @dragenter.prevent
      @drop="handleDrop($event, status)"
    >
      <!-- Column Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-900 capitalize">{{ status.replace('_', ' ') }}</h3>
        <span class="text-xs text-gray-500">
          {{ tasksByStatus[status]?.length || 0 }} tasks
        </span>
      </div>

      <!-- Task Cards -->
      <div class="space-y-3">
        <div
          v-for="task in tasksByStatus[status]"
          :key="task.id"
          draggable="true"
          @dragstart="handleDragStart($event, task)"
          class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex justify-between items-start mb-2">
            <h4 class="text-sm font-medium text-gray-900">{{ task.title }}</h4>
            <span 
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="{
                'bg-red-100 text-red-800': task.priority === 'high',
                'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                'bg-green-100 text-green-800': task.priority === 'low'
              }"
            >
              {{ task.priority }}
            </span>
          </div>
          
          <p class="text-xs text-gray-500 mb-3 line-clamp-2">
            {{ task.description }}
          </p>

          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center text-gray-500">
              <CalendarIcon class="h-4 w-4 mr-1" />
              {{ formatDate(task.due_date) }}
            </div>
            <div class="flex space-x-2">
              <button 
                @click="$emit('edit', task)"
                class="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button 
                @click="$emit('delete', task)"
                class="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSupabaseClient } from '#imports'
import { CalendarIcon } from '@heroicons/vue/24/outline'

const supabase = useSupabaseClient()

const props = defineProps<{
  tasks: any[]
}>()

const emit = defineEmits<{
  edit: [task: any]
  delete: [task: any]
  'update:tasks': [tasks: any[]]
}>()

const tasksByStatus = computed(() => {
  return props.tasks.reduce((acc, task) => {
    const status = task.status || 'pending'
    if (!acc[status]) acc[status] = []
    acc[status].push(task)
    return acc
  }, {} as Record<string, any[]>)
})

const handleDragStart = (event: DragEvent, task: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify(task))
    event.dataTransfer.effectAllowed = 'move'
    // Add some opacity to the dragged element
    const el = event.target as HTMLElement
    el.style.opacity = '0.5'
    
    // Add dragend listener to reset opacity
    el.addEventListener('dragend', () => {
      el.style.opacity = ''
    }, { once: true })
  }
}

const handleDrop = async (event: DragEvent, newStatus: string) => {
  if (!event.dataTransfer) return
  
  const taskData = JSON.parse(event.dataTransfer.getData('text/plain'))
  if (taskData.status === newStatus) return

  const dropZone = event.currentTarget as HTMLElement
  dropZone.style.backgroundColor = ''

  // Add drag-over class for visual feedback
  dropZone.classList.add('drag-over')

  try {
    // Update task status in database
    const { data, error } = await supabase
      .rpc('update_task_status', {
        p_task_id: taskData.id,
        p_status: newStatus
      })

    if (error) throw error

    // Clear the dataTransfer
    event.dataTransfer.clearData()

    // Update local tasks array
    const updatedTasks = props.tasks.map(task => 
      task.id === taskData.id ? { ...task, status: newStatus } : task
    )
    emit('update:tasks', updatedTasks)
  } catch (e) {
    console.error('Error updating task status:', e)
    // Remove drag-over class
    dropZone.classList.remove('drag-over')
  }
}

const formatDate = (date: string) => {
  if (!date) return 'No due date'
  return new Date(date).toLocaleDateString('fr-FR')
}
</script>

<style scoped>
[draggable="true"] {
  cursor: grab;
}

[draggable="true"]:active {
  cursor: grabbing;
}

[draggable="true"]:hover {
  opacity: 0.9;
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

/* Add visual feedback for drop zones */
.bg-gray-50 {
  transition: all 0.2s ease;
}

.bg-gray-50:hover {
  background-color: #e5e7eb;
  box-shadow: inset 0 0 0 2px #d1d5db;
}

/* Add drag over effect */
.bg-gray-50.drag-over {
  background-color: #dbeafe;
  box-shadow: inset 0 0 0 2px #3b82f6;
}
</style>