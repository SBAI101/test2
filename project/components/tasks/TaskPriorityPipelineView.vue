<template>
  <div class="flex gap-6 overflow-x-auto pb-4">
    <!-- Pipeline Columns -->
    <div 
      v-for="priority in ['low', 'medium', 'high']" 
      :key="priority"
      class="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4 min-h-[200px]"
      @dragover.prevent
      @dragenter.prevent
      @drop="handleDrop($event, priority)"
    >
      <!-- Column Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 
          class="text-sm font-medium capitalize"
          :class="{
            'text-green-700': priority === 'low',
            'text-yellow-700': priority === 'medium',
            'text-red-700': priority === 'high'
          }"
        >
          {{ priority }}
        </h3>
        <span class="text-xs text-gray-500">
          {{ tasksByPriority[priority]?.length || 0 }} tasks
        </span>
      </div>

      <!-- Task Cards -->
      <div class="space-y-3">
        <div
          v-for="task in tasksByPriority[priority]"
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
                'bg-gray-100 text-gray-800': task.status === 'pending',
                'bg-blue-100 text-blue-800': task.status === 'in_progress',
                'bg-green-100 text-green-800': task.status === 'completed'
              }"
            >
              {{ task.status }}
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

const tasksByPriority = computed(() => {
  return props.tasks.reduce((acc, task) => {
    const priority = task.priority || 'medium'
    if (!acc[priority]) acc[priority] = []
    acc[priority].push(task)
    return acc
  }, {} as Record<string, any[]>)
})

const handleDragStart = (event: DragEvent, task: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify(task))
    event.dataTransfer.effectAllowed = 'move'
    const el = event.target as HTMLElement
    el.style.opacity = '0.5'
    
    el.addEventListener('dragend', () => {
      el.style.opacity = ''
    }, { once: true })
  }
}

const handleDrop = async (event: DragEvent, newPriority: string) => {
  if (!event.dataTransfer) return
  
  const taskData = JSON.parse(event.dataTransfer.getData('text/plain'))
  if (taskData.priority === newPriority) return

  const dropZone = event.currentTarget as HTMLElement
  dropZone.style.backgroundColor = ''

  try {
    // Update task priority in database
    const { data, error } = await supabase
      .rpc('update_task', {
        p_task_id: taskData.id,
        p_title: taskData.title,
        p_description: taskData.description,
        p_priority: newPriority,
        p_status: taskData.status,
        p_due_date: taskData.due_date,
        p_assigned_to: taskData.assigned_to,
        p_task_type: taskData.task_type,
        p_start_date: taskData.start_date,
        p_finished_date: taskData.finished_date
      })

    if (error) throw error

    event.dataTransfer.clearData()

    const updatedTasks = props.tasks.map(task => 
      task.id === taskData.id ? { ...task, priority: newPriority } : task
    )
    emit('update:tasks', updatedTasks)
  } catch (e) {
    console.error('Error updating task priority:', e)
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

.bg-gray-50 {
  transition: all 0.2s ease;
}

.bg-gray-50:hover {
  background-color: #e5e7eb;
  box-shadow: inset 0 0 0 2px #d1d5db;
}

.bg-gray-50.drag-over {
  background-color: #dbeafe;
  box-shadow: inset 0 0 0 2px #3b82f6;
}
</style>