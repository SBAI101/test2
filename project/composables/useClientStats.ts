import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'

export const useClientStats = () => {
  const totalClients = ref(0)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchTotalClients = async () => {
    const supabase = useSupabaseClient()
    try {
      loading.value = true
      // Call the RPC function to get the total clients count.
      const { data, error: countError } = await supabase
        .rpc('get_total_clients')
        
      if (countError) throw countError
      
      totalClients.value = data || 0
    } catch (e: any) {
      console.error('Error fetching client count:', e)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchTotalClients()
  })

  return {
    totalClients,
    loading,
    error,
    fetchTotalClients
  }
}
