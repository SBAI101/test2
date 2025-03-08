import { ref, Ref } from 'vue'
import { useSupabaseClient } from '#imports'

interface Analytics {
  userGrowth: number
  clientRetention: number
  documentCompletion: number
  complianceRate: number
}

interface AnalyticsFilters {
  period: string
  type: string
  segment: string
}

export const useAnalytics = () => {
  const analytics = ref<Analytics>({
    userGrowth: 0,
    clientRetention: 0,
    documentCompletion: 0,
    complianceRate: 0
  })
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchAnalytics = async (filters?: AnalyticsFilters) => {
    const supabase = useSupabaseClient()
    try {
      loading.value = true

      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null)

      // Get new users in the last period
      const periodStart = new Date()
      periodStart.setDate(periodStart.getDate() - 30) // Default to 30 days

      const { count: newUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .filter('deleted_at', 'is', null)
        .filter('created_at', 'gte', periodStart.toISOString())

      // Get document completion rate
      const { count: totalDocuments } = await supabase
        .from('regulatory_documents')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null)

      const { count: verifiedDocuments } = await supabase
        .from('regulatory_documents')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'verified')
        .is('deleted_at', null)

      // Calculate metrics
      analytics.value = {
        userGrowth: totalUsers ? (newUsers / totalUsers) * 100 : 0,
        clientRetention: 95, // This would need to be calculated based on actual client retention data
        documentCompletion: totalDocuments ? (verifiedDocuments / totalDocuments) * 100 : 0,
        complianceRate: 98 // This would need to be calculated based on actual compliance data
      }

    } catch (e: any) {
      console.error('Error fetching analytics:', e)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    analytics,
    loading,
    error,
    fetchAnalytics
  }
}