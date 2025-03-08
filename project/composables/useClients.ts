import { ref, Ref } from 'vue'
import { useSupabaseClient, useToast } from '#imports'

interface Client {
  id: string
  name: string
  email: string
  type: string
  status: string
  portfolioManager: string
  updatedAt: Date
}

export const useClients = () => {
  const clients: Ref<Client[]> = ref([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  const toast = useToast()

  const fetchClients = async () => {
    const supabase = useSupabaseClient()
    try {
      loading.value = true
      
      // Query the view instead of the raw clients table.
      const { data: clientData, error: clientError } = await supabase
        .from('clients_with_user')
        .select(`
          id,
          person_type,
          onboarding_status:onboarding_status_id(status_name),
          email,
          full_name,
          updated_at
        `)
        .is('deleted_at', null)
        
      if (clientError) throw clientError
      
      // Map the returned data to our Client interface.
      clients.value = clientData.map((client: any) => ({
        id: client.id,
        name: client.full_name || 'Unknown',
        email: client.email || 'Unknown',
        type: client.person_type || 'physique',
        status: client.onboarding_status?.status_name || 'pending',
        portfolioManager: 'Unassigned', // Update this when you add the portfolio manager relationship
        updatedAt: new Date(client.updated_at)
      }))
    } catch (e: any) {
      console.error('Error fetching clients:', e)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const updateClient = async (clientId: string, data: Partial<Client>) => {
    const supabase = useSupabaseClient()
    try {
      loading.value = true
      
      // Use the RPC function to update client data
      const { error: updateError } = await supabase
        .rpc('update_client_data', {
          p_client_id: clientId,
          p_full_name: data.name,
          p_email: data.email,
          p_person_type: data.type
        })

      if (updateError) throw updateError

      // Refresh the client list
      await fetchClients()
      
      toast.success('Client updated successfully')
    } catch (e: any) {
      console.error('Error updating client:', e)
      error.value = e.message
      toast.error('Failed to update client')
    } finally {
      loading.value = false
    }
  }

  return {
    clients,
    loading,
    error,
    fetchClients,
    updateClient
  }
}
