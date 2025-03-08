<template>
  <div>
    <!-- Loader -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen mt-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg mt-4">
      {{ error }}
    </div>

    <!-- Main Content -->
    <div v-else class="mt-4 space-y-6">
      <ClientHeader
        :name="client?.name"
        :status="client?.status"
        @delete="handleDeleteClient"
      />

      <!-- Main Grid: Left (2 columns) & Right (1 column) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column (spanning 2 columns) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Access Logs Section -->
          <AccessLogsSection :access-logs="accessLogs" />

          <!-- Personal Information Section -->
          <PersonalInfoSection
            :client="client"
            :personal-info="personalInfo"
            @save="savePersonalInfo"
          />

          <!-- Family Situation Section -->
          <FamilySituationSection :situation="familySituation" />

          <!-- User Preferences Section -->
          <UserPreferencesSection :preferences="userPreferences" />

          <!-- Tax Information Section -->
          <TaxInfoSection :tax-info="taxInfo" :countries="countries" />

          <!-- Financial Information Section -->
          <FinancialInfoSection :financial-info="financialInfo" :income-sources="incomeSources" />

          <!-- CGP/CIF Information Section with Nested CGP Link -->
          <div class="bg-white rounded-lg shadow p-6">
            <CGPInfoSection :cgp-info="client?.cgpInfo" />
            <CGPLinkSection
              :clientId="client?.id"
              :currentCgp="client?.cgpInfo?.representative"
              @cgp-updated="fetchClientData"
            />
          </div>

     

          <InvestmentSection
            :profiles="investmentProfiles"
            @save="saveInvestmentProfiles"
            @remove="handleDeleteInvestmentProfile"
          />

          <DocumentSection
            :documents="documents"
            @upload="handleFileUpload"
            @view="handleViewDocument"
          />
        </div>

        <!-- Right Column -->
        <AccountOverview
          :created-at="client?.updatedAt"
          :updated-at="client?.updatedAt"
          :approved-at="client?.approved_at"
          :status="client?.status"
          :activities="activities"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabaseClient } from '#imports'

// Import components
import ClientHeader from '~/components/client/ClientHeader.vue'
import PersonalInfoSection from '~/components/client/PersonalInfoSection.vue'
import TaxInfoSection from '~/components/client/TaxInfoSection.vue'
import FinancialInfoSection from '~/components/client/FinancialInfoSection.vue'
import InvestmentSection from '~/components/client/InvestmentSection.vue'
import DocumentSection from '~/components/client/DocumentSection.vue'
import AccessLogsSection from '~/components/client/AccessLogsSection.vue'
import FamilySituationSection from '~/components/client/FamilySituationSection.vue'
import UserPreferencesSection from '~/components/client/UserPreferencesSection.vue'
import AccountOverview from '~/components/client/AccountOverview.vue'
import CGPInfoSection from '~/components/client/CGPInfoSection.vue'
import CGPLinkSection from '~/components/client/CGPLinkSection.vue'

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()

// Data containers
const client = ref<any>(null)
const documents = ref<any[]>([])
const activities = ref<any[]>([])
const taxInfo = ref<any>(null)
const financialInfo = ref<any>(null)
const investmentProfiles = ref<any[]>([])
const incomeSources = ref<any[]>([])
const countries = ref<any[]>([])
const personalInfo = ref<any>(null)
const accessLogs = ref<any>(null)
const familySituation = ref<any>(null)
const userPreferences = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchClientData = async () => {
  try {
    // First check if client exists
    const { data: clientData, error: clientError } = await supabase
      .from('clients_with_user')
      .select('*')
      .eq('id', route.params.id)
      .single();

    if (clientError || !clientData) {
      throw new Error('Client not found or you do not have permission to view this client')
    }

    
    // Get CGP info if exists
    let cgpInfo = null
    if (clientData.cgp_cif_id) {
      const { data: cgpData, error: cgpError } = await supabase
        .from('cgp_cif')
        .select(`
          id,
          representant:representant_id!left(
            id, 
            nom,
            prenom,
            email,
            telephone
          ),
          personne_morale:personne_morale_id!left(
            id,
            adresse,
            code_postal,
            ville,
            pays:pays_id!left(country_name)
          )
        `)
        .eq('id', clientData.cgp_cif_id)
        .single()
      
      if (!cgpError && cgpData) {
        cgpInfo = {
          representative: cgpData.representant,
          legalEntity: cgpData.personne_morale
        }
      }
    }

    // Get personal info
    const { data: personalData, error: personalError } = await supabase
      .from('personal_info')
      .select('*, nationality:nationality_id(country_name), country:country_id(country_name)')
      .eq('client_id', clientData.id)
      .maybeSingle()
    if (personalError) {
      throw personalError
    }

    client.value = {
      id: clientData.id,
      user_id: clientData.user_id, 
      name: clientData.full_name || clientData.email || 'Unknown',
      email: clientData.email || 'Unknown',
      type: clientData.person_type || 'physique',
      status: clientData.status || 'pending',
      approved_at: clientData.approved_at ? new Date(clientData.approved_at) : null,
      updatedAt: new Date(clientData.updated_at),
      country_name: personalData?.country_name || 'Not provided',
      cgpInfo: cgpInfo
    }

    // 2. Fetch the CGP link from cgp_clients.
    const { data: cgpLink, error: cgpLinkError } = await supabase
      .from('cgp_clients')
      .select('cgp_id')
      .eq('client_id', clientData.id)
      .maybeSingle();
    if (cgpLink && cgpLink.cgp_id) {
      const { data: cgpData, error: cgpError } = await supabase
        .from('cgp_cif')
        .select('representant_id, personne_morale_id')
        .eq('id', cgpLink.cgp_id)
        .single();
      if (!cgpError && cgpData) {
        // Fetch representative details.
        const { data: repData, error: repError } = await supabase
          .from('representant')
          .select('nom, prenom, email, telephone')
          .eq('id', cgpData.representant_id)
          .single();
        // Fetch legal entity details.
        const { data: pmData, error: pmError } = await supabase
          .from('personne_morale')
          .select('adresse, code_postal, ville, pays_id')
          .eq('id', cgpData.personne_morale_id)
          .maybeSingle();
        if (!repError && repData) {
          client.value.cgpInfo.representative = {
            nom: repData.nom,
            prenom: repData.prenom,
            email: repData.email,
            telephone: repData.telephone,
            full_name: repData.nom + ' ' + repData.prenom
          };
        }
        if (!pmError && pmData) {
          let country = "Not provided";
          if (pmData.pays_id) {
            const { data: countryData, error: countryError } = await supabase
              .from('countries')
              .select('country_name')
              .eq('id', pmData.pays_id)
              .maybeSingle();
            if (!countryError && countryData && countryData.country_name) {
              country = countryData.country_name;
            }
          }
          client.value.cgpInfo.legalEntity = {
            address: pmData.adresse || "Not provided",
            postalCode: pmData.code_postal || "Not provided",
            city: pmData.ville || "Not provided",
            country
          };
        }
      }
    }

    // 3. Fetch Documents.
    const { data: documentData, error: documentError } = await supabase
      .from('regulatory_documents')
      .select('*')
      .eq('client_id', route.params.id)
      .is('deleted_at', null)
    if (documentError) throw documentError
    documents.value = documentData

    // 4. Fetch Recent Activities.
    const { data: activityData, error: activityError } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', clientData.user_id)
      .order('timestamp', { ascending: false })
      .limit(5)
    if (activityError) throw activityError
    activities.value = activityData

    // 5. Fetch Tax Info.
    const { data: taxData, error: taxError } = await supabase
      .from('tax_info')
      .select('*')
      .eq('client_id', route.params.id)
      .maybeSingle()
    if (taxError) throw taxError
    taxInfo.value = taxData

    // If we have tax info with a residence ID, fetch the country name
    if (taxInfo.value?.tax_residence_id) {
      const { data: countryData, error: countryError } = await supabase
        .from('countries') 
        .select('country_name') 
        .eq('id', taxInfo.value.tax_residence_id) 
        .maybeSingle()
      if (!countryError && countryData?.country_name) {
        taxInfo.value.tax_residence_name = countryData.country_name 
      } else {
        taxInfo.value.tax_residence_name = 'Not provided'
      }
    }

   // 6. Fetch Financial Info.
const { data: finData, error: finError } = await supabase
  .from('financial_info')
  .select('*')
  .eq('client_id', route.params.id)
  .maybeSingle();
if (finError) throw finError;
financialInfo.value = finData || null;

    // 7. Fetch Income Sources.
    const { data: incomeSourcesData, error: incomeSourcesError } = await supabase
      .from('income_sources')
      .select('id, name')
      .order('name', { ascending: true })
    if (incomeSourcesError) throw incomeSourcesError
    incomeSources.value = incomeSourcesData

    // 8. Fetch Countries.
    const { data: countriesData, error: countriesError } = await supabase
      .from('countries')
      .select('id, country_name')
      .order('country_name', { ascending: true })
    if (countriesError) throw countriesError
    countries.value = countriesData

    // 9. Fetch Personal Info.
    personalInfo.value = personalData || {
      client_id: clientData.id,
      civility: 'monsieur',
      email: clientData.email,
      phone_number: null,
      address: null,
      postal_code: null,
      city: null,
      country_id: null
    }

    // 10. Fetch Access Logs.
    const { data: logsData, error: logsError } = await supabase
      .from('user_access_logs')
      .select(`
        access_time,
        ip_address,
        device_type
      `)
      .eq('user_id', clientData.user_id)
      .order('access_time', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (logsError) throw logsError
    accessLogs.value = logsData

    // 11. Fetch Investment Profiles.
const { data: investmentData, error: investmentError } = await supabase
  .from('investment_profiles')
  .select('*')
  .eq('client_id', clientData.id)
  .is('deleted_at', null);
if (investmentError) throw investmentError;
investmentProfiles.value = investmentData || [];

    // 12. Fetch Family Situation
    const { data: familyData, error: familyError } = await supabase
      .from('family_situations')
      .select('*')
      .eq('client_id', clientData.id)
      .maybeSingle()
    if (familyError) throw familyError
    familySituation.value = familyData

    // 13. Fetch User Preferences.
    const { data: prefsData, error: prefsError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', clientData.user_id)
      .maybeSingle()
    if (prefsError) throw prefsError
    userPreferences.value = prefsData || {
      communication_preferences: {},
      notification_preferences: {},
      notification_frequency: 'immediate',
      email_types: {},
      language_preference: 'fr'
    }

  } catch (e: any) {
    console.error('Error fetching client data:', e)
    error.value = e.message === 'Client not found' ? 
      'Client not found. The client may have been deleted or you may not have permission to view it.' : 
      'Error loading client data. Please try again later.'
  } finally {
    loading.value = false
  }
}

const savePersonalInfo = async (data: any) => {
  try {
    const { error: updateError } = await supabase.rpc('update_client_data', {
      p_client_id: client.value.id,
      p_email: data.email,
      p_full_name: data.full_name,
      p_person_type: data.type
    })
    if (updateError) throw updateError
    await fetchClientData()
  } catch (e: any) {
    console.error('Error updating personal info:', e)
    error.value = e.message
  }
}

const saveTaxInfo = async (data: any) => {
  try {
    const { error: taxError } = await supabase
      .from('tax_info')
      .upsert({
        client_id: client.value.id,
        ...data
      })
    if (taxError) throw taxError
    await fetchClientData()
  } catch (e: any) {
    console.error('Error updating tax info:', e)
    error.value = e.message
  }
}

const saveInvestmentProfiles = async (profiles: any[]) => {
  try {
    for (const profile of profiles) {
      profile.related_service = profile.related_service || 'mandat_de_gestion'
      if (!profile.id) {
        const { data: existingProfiles, error: fetchError } = await supabase
          .from('investment_profiles')
          .select('id')
          .eq('user_id', client.value.user_id)
          .eq('related_service', profile.related_service)
          .is('deleted_at', null)
        if (fetchError) throw fetchError
        if (existingProfiles && existingProfiles.length > 0) {
          const confirmMsg = window.confirm(
            "An investment profile for this service already exists. Saving this new profile will soft-delete the existing profile. Do you want to continue?"
          )
          if (!confirmMsg) continue
        }
        const { error: softDeleteError } = await supabase
          .from('investment_profiles')
          .update({ deleted_at: new Date().toISOString() })
          .eq('user_id', client.value.user_id)
          .eq('related_service', profile.related_service)
          .is('deleted_at', null)
        if (softDeleteError) throw softDeleteError
      } else {
        const { error: softDeleteError } = await supabase
          .from('investment_profiles')
          .update({ deleted_at: new Date().toISOString() })
          .neq('id', profile.id)
          .eq('user_id', client.value.user_id)
          .eq('related_service', profile.related_service)
          .is('deleted_at', null)
        if (softDeleteError) throw softDeleteError
      }
      const { error: profileError } = await supabase
        .from('investment_profiles')
        .upsert({
          id: profile.id || undefined,
          client_id: client.value.id,
          related_service: profile.related_service,
          ...profile
        })
      if (profileError) throw profileError
    }
    await fetchClientData()
  } catch (e: any) {
    console.error('Error updating investment profiles:', e)
    error.value = e.message
  }
}

const handleDeleteInvestmentProfile = async (profileId: string) => {
  try {
    const { error } = await supabase
      .from('investment_profiles')
      .delete()
      .eq('id', profileId)
    if (error) throw error
    await fetchClientData()
  } catch (e: any) {
    console.error('Error deleting investment profile:', e)
    error.value = e.message
  }
}

const handleDeleteClient = async () => {
  try {
    const { error: deleteError } = await supabase
      .from('clients')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', client.value.id)
    if (deleteError) throw deleteError
    await router.push('/users/clients')
  } catch (e: any) {
    console.error('Error deleting client:', e)
    error.value = e.message
  }
}

const handleFileUpload = async (file: File) => {
  try {
    const filePath = `client-${client.value.id}/${file.name}`
    
    // First check if file already exists
    const { data: existingFile } = await supabase.storage
      .from('documents')
      .list(`client-${client.value.id}`)

    if (existingFile?.some(f => f.name === file.name)) {
      if (!confirm('A file with this name already exists. Do you want to replace it?')) {
        return
      }
    }

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)
    if (uploadError) throw uploadError

    const { error: docError } = await supabase
      .from('regulatory_documents')
      .insert({
        client_id: client.value.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_path: filePath,
        status: 'pending',
        uploaded_by: (await supabase.auth.getUser()).data.user?.id
      })
    if (docError) throw docError
    await fetchClientData()
  } catch (e: any) {
    console.error('Error uploading document:', e)
    error.value = e.message
  }
}

const handleViewDocument = (doc: any) => {
  console.log('View document:', doc)
}

onMounted(() => {
  fetchClientData()
})
</script>