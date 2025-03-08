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
          {{ cgpsByStage[stage]?.length || 0 }} CGP/CIF
        </span>
      </div>

      <!-- CGP Cards -->
      <div class="space-y-3">
        <div
          v-for="cgp in cgpsByStage[stage]"
          :key="cgp.id"
          draggable="true"
          @dragstart="handleDragStart($event, cgp)"
          class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex justify-between items-start mb-2">
            <h4 class="text-sm font-medium text-gray-900">
              {{ cgp.representative?.nom }} {{ cgp.representative?.prenom }}
            </h4>
            <span 
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(cgp.status)"
            >
              {{ cgp.status }}
            </span>
          </div>
          
          <div class="text-xs text-gray-500 mb-3">
            <div>{{ cgp.representative?.email }}</div>
            <div>{{ cgp.personne_morale?.adresse }}</div>
          </div>

          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center text-gray-500">
              <CalendarIcon class="h-4 w-4 mr-1" />
              {{ formatDate(cgp.created_at) }}
            </div>
            <div class="flex space-x-2">
              <button 
                @click="$emit('view', cgp)"
                class="text-blue-600 hover:text-blue-800"
              >
                View
              </button>
              <button 
                @click="$emit('edit', cgp)"
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
  cgps: any[]
}>()

const emit = defineEmits<{
  view: [cgp: any]
  edit: [cgp: any]
  'update:cgps': [cgps: any[]]
}>()

// Pipeline stages for CGP/CIF
const pipelineStages = ['application_received', 'compliance_review', 'onboarding', 'active']

const cgpsByStage = computed(() => {
  return props.cgps.reduce((acc, cgp) => {
    const stage = cgp.current_stage || 'application_received'
    if (!acc[stage]) acc[stage] = []
    acc[stage].push(cgp)
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
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const handleDragStart = (event: DragEvent, cgp: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify(cgp))
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
  
  const cgpData = JSON.parse(event.dataTransfer.getData('text/plain'))
  if (cgpData.current_stage === newStage) return

  const dropZone = event.currentTarget as HTMLElement
  dropZone.style.backgroundColor = ''

  try {
    // Update CGP stage in database
    const { data, error } = await supabase
      .from('cgp_cif')
      .update({ current_stage: newStage })
      .eq('id', cgpData.id)
      .select()
      .single()

    if (error) throw error

    event.dataTransfer.clearData()

    // Update local CGPs array
    const updatedCGPs = props.cgps.map(cgp => 
      cgp.id === cgpData.id ? { ...cgp, current_stage: newStage } : cgp
    )
    emit('update:cgps', updatedCGPs)

    // Create pipeline event
    await supabase.from('pipeline_events').insert({
      cgp_id: cgpData.id,
      event_type: 'stage_change',
      from_stage: cgpData.current_stage,
      to_stage: newStage
    })

  } catch (e) {
    console.error('Error updating CGP stage:', e)
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