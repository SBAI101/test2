import { ref, Ref } from 'vue'

interface Document {
  id: string
  file_name: string
  file_type: string
  file_size: number
  client_name: string
  client_email: string
  status: string
  created_at: Date
}

export const useDocuments = () => {
  const documents: Ref<Document[]> = ref([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchDocuments = async () => {
    const client = useSupabaseClient()
    try {
      loading.value = true
      
      const { data: documentData, error: documentError } = await client
        .from('regulatory_documents')
        .select(`
          id,
          file_name,
          file_type,
          file_size,
          status,
          verification_status,
          created_at,
          client:client_id (
            user:user_id (
              profile:profiles!inner (
                full_name,
                email
              )
            )
          )
        `)
        .order('created_at', { ascending: false })
        
      if (documentError) throw documentError
      
      // Transform the data
      documents.value = documentData.map(doc => ({
        id: doc.id,
        file_name: doc.file_name,
        file_type: doc.file_type,
        file_size: doc.file_size || 0,
        client_name: doc.client?.user?.profile?.full_name || 'Unknown',
        client_email: doc.client?.user?.profile?.email || 'Unknown',
        status: doc.verification_status || 'pending',
        created_at: new Date(doc.created_at)
      }))

    } catch (e: any) {
      console.error('Error fetching documents:', e)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    documents,
    loading,
    error,
    fetchDocuments
  }
}