<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Footer Management</h1>
      <p class="mt-2 text-sm text-gray-600">Manage footer content and legal documents</p>
    </div>

    <!-- Language Toggle -->
    <div class="mb-6">
      <select
        v-model="currentLanguage"
        class="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="fr">French</option>
        <option value="en">English</option>
      </select>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Footer Content Section -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Footer Content</h2>
        <div class="space-y-4">
          <!-- Company Info -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Company Information</label>
            <textarea
              v-model="footerContent.company_info"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          <!-- Contact Info -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Information</label>
            <textarea
              v-model="footerContent.contact_info"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          <!-- Social Links -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <input
                  v-model="footerContent.social_links.linkedin"
                  type="url"
                  placeholder="LinkedIn URL"
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div class="flex items-center space-x-2">
                <input
                  v-model="footerContent.social_links.twitter"
                  type="url"
                  placeholder="Twitter URL"
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          @click="saveFooterContent"
          class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Save Footer Content
        </button>
      </div>

      <!-- Legal Documents Section -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Legal Documents</h2>
        <div class="space-y-4">
          <div v-for="doc in legalDocuments" :key="doc.id" class="border-b pb-4 last:border-b-0">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-gray-900">{{ doc.title }}</h3>
              <span class="text-xs text-gray-500">{{ currentLanguage.toUpperCase() }}</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <div class="flex-grow">
                <input
                  type="file"
                  @change="(e) => handleFileUpload(e, doc.id)"
                  accept=".pdf"
                  class="hidden"
                  :id="'file-' + doc.id"
                />
                <label
                  :for="'file-' + doc.id"
                  class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  {{ doc.file_url ? 'Replace PDF' : 'Upload PDF' }}
                </label>
              </div>
              <a
                v-if="doc.file_url"
                :href="doc.file_url"
                target="_blank"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                View Current
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseClient } from '#imports'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const currentLanguage = ref('fr')

const footerContent = ref({
  company_info: '',
  contact_info: '',
  social_links: {
    linkedin: '',
    twitter: ''
  }
})

const legalDocuments = ref([
  { id: 'der', title: 'DER Document', file_url: null },
  { id: 'dic', title: 'DIC Document', file_url: null },
  { id: 'risk', title: 'Risk Disclosure', file_url: null }
])

const fetchFooterContent = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_footer_content', { p_language_code: currentLanguage.value })

    if (error) throw error

    if (data && data.length > 0) {
      // Find company info and contact info entries
      const companyInfo = data.find(item => item.type === 'company_info')
      const contactInfo = data.find(item => item.type === 'contact_info')
      const socialLinks = data.find(item => item.type === 'social_links')

      footerContent.value = {
        company_info: companyInfo?.content || '',
        contact_info: contactInfo?.content || '',
        social_links: socialLinks ? JSON.parse(socialLinks.content || '{}') : { linkedin: '', twitter: '' }
      }
    }
  } catch (error) {
    console.error('Error fetching footer content:', error)
  }
}

const saveFooterContent = async () => {
  try {
    const { error } = await supabase
      .from('footer_content').upsert([
        {
          type: 'company_info',
          title: 'Company Information',
          content: footerContent.value.company_info,
          language_code: currentLanguage.value
        },
        {
          type: 'contact_info',
          title: 'Contact Information',
          content: footerContent.value.contact_info,
          language_code: currentLanguage.value
        },
        {
          type: 'social_links',
          title: 'Social Media Links',
          content: JSON.stringify(footerContent.value.social_links),
          language_code: currentLanguage.value
        }
      ])

    if (error) throw error
    alert('Footer content saved successfully')
  } catch (error) {
    console.error('Error saving footer content:', error)
    alert('Error saving footer content')
  }
}

const handleFileUpload = async (event: Event, docId: string) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    // Upload file to Supabase Storage
    const filePath = `legal-docs/${docId}/${currentLanguage.value}/${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Update document record
    const { error: updateError } = await supabase
      .from('website_policies')
      .upsert({
        policy_name: docId,
        file_url: filePath,
        language_code: currentLanguage.value
      })

    if (updateError) throw updateError

    // Update local state
    const docIndex = legalDocuments.value.findIndex(doc => doc.id === docId)
    if (docIndex !== -1) {
      legalDocuments.value[docIndex].file_url = filePath
    }

    alert('Document uploaded successfully')
  } catch (error) {
    console.error('Error uploading document:', error)
    alert('Error uploading document')
  }
}

// Watch for language changes
watch(currentLanguage, () => {
  fetchFooterContent()
})

// Initial fetch
onMounted(() => {
  fetchFooterContent()
})
</script>