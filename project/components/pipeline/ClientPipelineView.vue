<template>
  <div class="flex gap-6 overflow-x-auto pb-4">
    <!-- Pipeline Columns -->
    <div 
      v-for="stage in pipelineStages" 
      :key="stage"
      class="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4 min-h-[200px]"
      @dragover.prevent
      @dragenter.prevent
      @drop="handleDrop($event, stage)"
    >
      <!-- Column Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-900">{{ formatStageTitle(stage) }}</h3>
        <span class="text-xs text-gray-500">
          {{ clientsByStage[stage]?.length || 0 }} clients
        </span>
      </div>

      <!-- Client Cards -->
      <div class="space-y-3">
        <div
          v-for="client in clientsByStage[stage]"
          :key="client.id"
          draggable="true"
          @dragstart="handleDragStart($event, client)"
          class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex justify-between items-start mb-2">
            <h4 class="text-sm font-medium text-gray-900">{{ client.name || client.email }}</h4>
            <span 
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(client.status)"
            >
              {{ client.status }}
            </span>
          </div>
          
          <div class="text-xs text-gray-500 mb-3">
            <div>{{ client.email }}</div>
            <div>Type: {{ client.type }}</div>
          </div>

          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center text-gray-500">
              <CalendarIcon class="h-4 w-4 mr-1" />
              {{ formatDate(client.created_at) }}
            </div>
            <div class="flex space-x-2">
              <button 
                @click="$emit('view', client)"
                class="text-blue-600 hover:text-blue-800"
              >
                View
              </button>
              <button 
                @click="$emit('edit', client)"
                class="text-gray-600 hover:text-gray-800"
              >
                Edit
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
  clients: any[]
}>()

const emit = defineEmits<{
  view: [client: any]
  edit: [client: any]
  'update:clients': [clients: any[]]
}>()

// Pipeline stages based on the pipeline_stage enum
const pipelineStages = ['signup', 'questionnaire', 'standby', 'approved', 'rejected']

const clientsByStage = computed(() => {
  return props.clients.reduce((acc, client) => {
    const stage = client.current_stage || 'signup'
    if (!acc[stage]) acc[stage] = []
    acc[stage].push(client)
    return acc
  }, {} as Record<string, any[]>)
})

const formatStageTitle = (stage: string) => {
  return stage.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'standby':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const handleDragStart = (event: DragEvent, client: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify(client))
    event.dataTransfer.effectAllowed = 'move'
    const el = event.target as HTMLElement
    el.style.opacity = '0.5'
    
    el.addEventListener('dragend', () => {
      el.style.opacity = ''
    }, { once: true })
  }
}

const handleDrop = async (event: DragEvent, newStage: string) => {
  if (!event.dataTransfer) return
  
  const clientData = JSON.parse(event.dataTransfer.getData('text/plain'))
  if (clientData.current_stage === newStage) return

  const dropZone = event.currentTarget as HTMLElement
  dropZone.style.backgroundColor = ''

  try {
    // Update client stage in database
    const { data, error } = await supabase
      .from('pipeline')
      .update({ current_stage: newStage })
      .eq('client_id', clientData.id)
      .select()
      .single()

    if (error) throw error

    event.dataTransfer.clearData()

    // Update local clients array
    const updatedClients = props.clients.map(client => 
      client.id === clientData.id ? { ...client, current_stage: newStage } : client
    )
    emit('update:clients', updatedClients)

    // Create pipeline event
    await supabase.from('pipeline_events').insert({
      client_id: clientData.id,
      event_type: 'stage_change',
      from_stage: clientData.current_stage,
      to_stage: newStage
    })

  } catch (e) {
    console.error('Error updating client stage:', e)
    dropZone.classList.remove('drag-over')
  }
}

const formatDate = (date: string) => {
  if (!date) return 'No date'
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