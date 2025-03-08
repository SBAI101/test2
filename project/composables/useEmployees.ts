import { ref, Ref } from 'vue'

interface Employee {
  id: string
  email: string
  full_name: string
  role: string
  status: string
  assigned_clients: number
  last_active: Date
}

export const useEmployees = () => {
  const employees: Ref<Employee[]> = ref([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchEmployees = async () => {
    const client = useSupabaseClient()
    try {
      loading.value = true
      
      // Get all employees (portfolio managers, CGP/CIF, etc.)
      const { data: employeeData, error: employeeError } = await client
        .from('profiles')
        .select(`
          profiles:id,
          email,
          full_name,
          portfolio_managers!left (
            id,
            specialization,
            certification_level,
            years_experience,
            max_clients
          ),
          cgp_cif!left (
            id,
            personne_morale_id,
            representant_id,
            groupement_id
          ),
          deleted_at
        `)
        .is('deleted_at', null)
        .or('portfolio_managers.id.neq.null,cgp_cif.id.neq.null')
        
      if (employeeError) throw employeeError
      
      // Transform the data
      employees.value = employeeData.map(employee => ({
        id: employee.id,
        email: employee.email,
        full_name: employee.full_name,
        role: employee.portfolio_managers ? 'Portfolio Manager' : 'CGP/CIF',
        status: 'active', // You might want to add a status field to your tables
        assigned_clients: 0, // This should be calculated from client relationships
        last_active: new Date() // This should come from auth.users last_sign_in_at
      }))

    } catch (e: any) {
      console.error('Error fetching employees:', e)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    employees,
    loading,
    error,
    fetchEmployees
  }
}