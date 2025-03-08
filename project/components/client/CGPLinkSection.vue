<template>
  <div class="bg-white rounded-lg shadow p-6 mt-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-medium text-gray-900">CGP / CIF Information</h2>
      <!-- Edit button within the CGP section -->
      <button @click="openModal" class="px-3 py-1 bg-blue-600 text-white rounded text-sm">
        {{ currentCgp && currentCgp.full_name ? 'Change CGP' : 'Attach CGP' }}
      </button>
    </div>
    
    <!-- Display current CGP info if attached -->
    <div v-if="currentCgp && currentCgp.full_name">
      <p>
        <strong>Current CGP:</strong> {{ currentCgp.full_name }}
      </p>
      <p>
        <strong>Telephone:</strong> {{ currentCgp.telephone || 'Not available' }}
      </p>
    </div>
    <div v-else>
      <p>No CGP is currently attached.</p>
    </div>
    
    <!-- Modal for selecting a CGP -->
    <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded shadow-lg w-80">
        <h3 class="text-lg font-medium mb-4">Select a CGP</h3>
        <select v-model="selectedCgpId" class="w-full border border-gray-300 p-2 rounded">
          <option value="">-- Select CGP --</option>
          <option v-for="cgp in availableCgps" :key="cgp.id" :value="cgp.id">
            {{ cgp.full_name }} ({{ cgp.telephone || 'No phone' }})
          </option>
        </select>
        <div class="flex justify-end mt-4">
          <button @click="closeModal" class="mr-2 px-3 py-1 bg-gray-300 rounded">Cancel</button>
          <button @click="attachCgp" class="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSupabaseClient } from '#imports'

const props = defineProps<{
  clientId: string, // The client's ID for linking
  currentCgp: {     // Current CGP details (if available)
    full_name?: string,
    telephone?: string
  }
}>()

const emit = defineEmits<{
  'cgp-updated': [] // Emitted when the CGP link is updated
}>()

const modalOpen = ref(false)
const selectedCgpId = ref<string>('')

const availableCgps = ref<any[]>([])
const supabase = useSupabaseClient()

const openModal = async () => {
  modalOpen.value = true
  // Fetch only active (non-deleted) CGP/CIF rows.
  const { data, error } = await supabase
    .from('cgp_cif')
    .select('*')
    .is('deleted_at', null)
  if (error) {
    console.error('Error fetching available CGPs:', error)
    return
  }
  // Map the fetched rows into a simpler structure.
  availableCgps.value = await Promise.all(
    data.map(async (row: any) => {
      let full_name = 'Unknown CGP'
      let telephone = ''
      if (row.representant_id) {
        const { data: repData, error: repError } = await supabase
          .from('representant')
          .select('nom, prenom, email, telephone')
          .eq('id', row.representant_id)
          .single()
        if (!repError && repData) {
          full_name = repData.nom + ' ' + repData.prenom
          telephone = repData.telephone
        } else {
          console.error('Error fetching representative:', repError)
        }
      }
      return {
        id: row.id,
        full_name,
        telephone
      }
    })
  )
}

const closeModal = () => {
  modalOpen.value = false
  selectedCgpId.value = ''
}

const attachCgp = async () => {
  if (!selectedCgpId.value) {
    alert('Please select a CGP.')
    return
  }
  // Delete any existing link for this client.
  const { error: deleteError } = await supabase
    .from('cgp_clients')
    .delete()
    .eq('client_id', props.clientId)
  if (deleteError) {
    console.error('Error deleting old CGP link:', deleteError)
    alert('Error updating CGP link.')
    return
  }
  // Insert the new link.
  const { error: insertError } = await supabase
    .from('cgp_clients')
    .insert([{ cgp_id: selectedCgpId.value, client_id: props.clientId }])
  if (insertError) {
    console.error('Error inserting new CGP link:', insertError)
    alert('Error updating CGP link.')
    return
  }
  alert('CGP link updated successfully.')
  closeModal()
  emit('cgp-updated')
}
</script>
