<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Language Management</h1>
      <p class="mt-2 text-sm text-gray-600">Manage translations and language settings</p>
    </div>

    <!-- Language Status Overview -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Translation Status</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span class="text-sm font-medium text-gray-900">French</span>
          </div>
          <span class="text-sm text-gray-500">Primary Language</span>
        </div>
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span class="text-sm font-medium text-gray-900">English</span>
          </div>
          <span class="text-sm text-gray-500">{{ getCompletionPercentage() }}% Complete</span>
        </div>
      </div>
    </div>

    <!-- Translation Management -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">Content Translations</h2>
          <div class="flex items-center space-x-2">
            <select
              v-model="selectedContentType"
              class="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Content</option>
              <option value="static">Static Pages</option>
              <option value="footer">Footer Content</option>
              <option value="legal">Legal Documents</option>
            </select>
            <button
              @click="exportTranslations"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                French (FR)
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                English (EN)
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in filteredContent" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ item.key_name }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <div class="max-w-xs truncate">{{ item.fr_content }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <div class="max-w-xs truncate">{{ item.en_content }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(item)"
                >
                  {{ getStatusText(item) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editTranslation(item)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Translation Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Edit Translation</h3>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">French (FR)</label>
              <textarea
                v-model="editingItem.fr_content"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">English (EN)</label>
              <textarea
                v-model="editingItem.en_content"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="showEditModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="saveTranslation"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
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
const selectedContentType = ref('all')
const showEditModal = ref(false)
const loading = ref(true)
const editingItem = ref<any>(null)
const content = ref<any[]>([])
const stats = ref<any[]>([])

const fetchData = async () => {
  try {
    loading.value = true
    
    // Fetch translation stats
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_translation_stats')
    
    if (statsError) throw statsError
    stats.value = statsData || []

    // Fetch content
    const { data: contentData, error: contentError } = await supabase
      .rpc('get_all_seo_data', { p_language_code: 'fr' })
    
    if (contentError) throw contentError
    content.value = contentData || []
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const filteredContent = computed(() => {
  if (selectedContentType.value === 'all') return content.value
  return content.value.filter(item => item.content_type === selectedContentType.value)
})

const getCompletionPercentage = () => {
  if (!stats.value.length) return 0
  const totals = stats.value.reduce((acc, curr) => ({
    total: acc.total + curr.total_items,
    translated: acc.translated + curr.translated_items
  }), { total: 0, translated: 0 })
  return totals.total ? Math.round((totals.translated / totals.total) * 100) : 0
}

const getStatusClass = (item: any) => {
  if (!item.en_content) return 'bg-red-100 text-red-800'
  if (item.needs_review) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

const getStatusText = (item: any) => {
  if (!item.en_content) return 'Missing'
  if (item.needs_review) return 'Needs Review'
  return 'Complete'
}

const editTranslation = (item: any) => {
  editingItem.value = { ...item }
  showEditModal.value = true
}

const saveTranslation = async () => {
  try {
    const { error } = await supabase
      .from('static_content')
      .update({
        fr_content: editingItem.value.fr_content,
        en_content: editingItem.value.en_content,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingItem.value.id)

    if (error) throw error

    // Update local state
    const index = content.value.findIndex(item => item.id === editingItem.value.id)
    if (index !== -1) {
      content.value[index] = { ...content.value[index], ...editingItem.value }
    }

    showEditModal.value = false
  } catch (error) {
    console.error('Error saving translation:', error)
    alert('Error saving translation')
  }
}

const exportTranslations = () => {
  const data = filteredContent.value.map(item => ({
    key: item.key_name,
    fr: item.fr_content,
    en: item.en_content
  }))

  const csv = [
    ['Key', 'French (FR)', 'English (EN)'],
    ...data.map(row => [row.key, row.fr, row.en])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'translations.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

onMounted(() => {
  fetchData()
})
</script>