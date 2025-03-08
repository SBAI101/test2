<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">{{ $t('navigation.clientPipeline') }}</h1>
          <p class="mt-2 text-sm text-gray-600">Manage client onboarding process</p>
        </div>
        
        <!-- Pipeline Type Toggle -->
        <div class="flex items-center space-x-4">
          <button
            @click="currentPipeline = 'client'"
            class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="currentPipeline === 'client' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
          >
            <UserGroupIcon class="h-5 w-5 inline-block mr-1" />
            Client Pipeline
          </button>
          <button
            @click="currentPipeline = 'cgp'"
            class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="currentPipeline === 'cgp' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
          >
            <BriefcaseIcon class="h-5 w-5 inline-block mr-1" />
            CGP/CIF Pipeline
          </button>
          <button
            @click="currentPipeline = 'regroupement'"
            class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="currentPipeline === 'regroupement' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
          >
            <BuildingOfficeIcon class="h-5 w-5 inline-block mr-1" />
            Regroupement Pipeline
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-4 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="col-span-2">
            <label class="sr-only">Search</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                v-model="filters.search"
                type="text"
                placeholder="Search by name or email..."
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
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <!-- Type Filter -->
          <div>
            <select
              v-model="filters.type"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white text-gray-900"
            >
              <option value="">All Types</option>
              <option value="physique">Personne Physique</option>
              <option value="morale">Personne Morale</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Pipeline Views -->
    <ClientPipelineView
      v-if="currentPipeline === 'client'"
      :clients="filteredClients"
      @view="viewClient"
      @edit="editClient"
      @update:clients="handleClientsUpdate"
    />
    <CGPPipelineView
      v-else-if="currentPipeline === 'cgp'"
      :cgps="filteredCGPs"
      @view="viewCGP"
      @edit="editCGP"
      @update:cgps="handleCGPsUpdate"
    />
    <RegroupementPipelineView
      v-else
      :regroupements="filteredRegroupements"
      @view="viewRegroupement"
      @edit="editRegroupement"
      @update:regroupements="handleRegroupementsUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  MagnifyingGlassIcon,
  UserGroupIcon,
  BriefcaseIcon,
  BuildingOfficeIcon
} from '@heroicons/vue/24/outline'
import { useSupabaseClient } from '#imports'
import ClientPipelineView from '~/components/pipeline/ClientPipelineView.vue'
import CGPPipelineView from '~/components/pipeline/CGPPipelineView.vue'
import RegroupementPipelineView from '~/components/pipeline/RegroupementPipelineView.vue'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const currentPipeline = ref('client')

const clients = ref<any[]>([])
const cgps = ref<any[]>([])
const regroupements = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const filters = ref({
  search: '',
  status: '',
  type: ''
})

// Fetch data based on pipeline type
const fetchData = async () => {
  try {
    loading.value = true

    if (currentPipeline.value === 'client') {
      const { data: clientData, error: clientError } = await supabase
        .from('clients_with_user')
        .select(`
          *,
          pipeline:pipeline!left(
            current_stage
          )
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (clientError) throw clientError
      clients.value = clientData || []
    } else if (currentPipeline.value === 'cgp') {
      const { data: cgpData, error: cgpError } = await supabase
        .from('cgp_cif')
        .select(`
          *,
          representative:representant_id (
            id,
            nom,
            prenom,
            email,
            telephone
          ),
          personne_morale:personne_morale_id (
            id,
            adresse,
            code_postal,
            ville,
            pays:pays_id (
              country_name
            )
          )
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (cgpError) throw cgpError
      cgps.value = cgpData || []
    } else if (currentPipeline.value === 'regroupement') {
      const { data: regroupementData, error: regroupementError } = await supabase
        .from('regroupement')
        .select(`
          *,
          cgp_count:regroupement_cgp(count)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (regroupementError) throw regroupementError
      
      // Get pipeline stages for regroupements
      const { data: pipelineData, error: pipelineError } = await supabase
        .from('pipeline')
        .select('*')
        .in('regroupement_id', regroupementData.map(r => r.id))
        .is('deleted_at', null)

      if (pipelineError) throw pipelineError

      // Merge pipeline data with regroupements
      regroupements.value = regroupementData.map(regroupement => ({
        ...regroupement,
        current_stage: pipelineData?.find(p => p.regroupement_id === regroupement.id)?.current_stage || 'request_received'
      })) || []
    }
    
  } catch (e: any) {
    console.error('Error fetching pipeline data:', e)
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// Filtered lists
const filteredClients = computed(() => {
  return clients.value.filter(client => {
    const matchesSearch = !filters.value.search ||
      client.full_name?.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      client.email?.toLowerCase().includes(filters.value.search.toLowerCase())

    const matchesStatus = !filters.value.status || client.status === filters.value.status
    const matchesType = !filters.value.type || client.type === filters.value.type

    return matchesSearch && matchesStatus && matchesType
  })
})

const filteredCGPs = computed(() => {
  return cgps.value.filter(cgp => {
    const matchesSearch = !filters.value.search ||
      cgp.representative?.nom?.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      cgp.representative?.prenom?.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      cgp.representative?.email?.toLowerCase().includes(filters.value.search.toLowerCase())

    const matchesStatus = !filters.value.status || cgp.status === filters.value.status
    const matchesType = !filters.value.type || cgp.type === filters.value.type

    return matchesSearch && matchesStatus && matchesType
  })
})

const filteredRegroupements = computed(() => {
  return regroupements.value.filter(regroupement => {
    const matchesSearch = !filters.value.search ||
      regroupement.name?.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      regroupement.description?.toLowerCase().includes(filters.value.search.toLowerCase())

    const matchesStatus = !filters.value.status || regroupement.status === filters.value.status
    const matchesType = !filters.value.type || regroupement.type === filters.value.type

    return matchesSearch && matchesStatus && matchesType
  })
})

// Event handlers
const viewClient = (client: any) => {
  navigateTo(`/users/clients/${client.id}`)
}

const editClient = (client: any) => {
  navigateTo(`/users/clients/${client.id}/edit`)
}

const handleClientsUpdate = (updatedClients: any[]) => {
  clients.value = updatedClients
}

const viewCGP = (cgp: any) => {
  navigateTo(`/users/cgp/${cgp.id}`)
}

const editCGP = (cgp: any) => {
  navigateTo(`/users/cgp/${cgp.id}/edit`)
}

const handleCGPsUpdate = (updatedCGPs: any[]) => {
  cgps.value = updatedCGPs
}

const viewRegroupement = (regroupement: any) => {
  navigateTo(`/users/regroupement/${regroupement.id}`)
}

const editRegroupement = (regroupement: any) => {
  navigateTo(`/users/regroupement/${regroupement.id}/edit`)
}

const handleRegroupementsUpdate = (updatedRegroupements: any[]) => {
  regroupements.value = updatedRegroupements
}

// Watch for pipeline changes to fetch appropriate data
watch(currentPipeline, () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>