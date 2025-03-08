<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">SEO Management</h1>
      <p class="mt-2 text-sm text-gray-600">Manage meta titles, descriptions, and keywords for better search visibility</p>
    </div>

    <!-- Language Selector -->
    <div class="mb-6">
      <select
        v-model="currentLanguage"
        class="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="fr">French</option>
        <option value="en">English</option>
      </select>
    </div>

    <!-- SEO Content Grid -->
    <div class="grid grid-cols-1 gap-6">
      <div v-for="page in pages" :key="page.id" class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900">{{ page.title }}</h2>
          <span :class="['text-sm px-2 py-1 rounded', getStatusClass(page)]">{{ page.type }}</span>
        </div>

        <div class="space-y-4">
          <!-- Meta Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Meta Title</label>
            <input
              v-model="page.meta_title"
              type="text"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @change="updateSEO(page)"
            />
            <p class="mt-1 text-xs text-gray-500">
              {{ page.meta_title?.length || 0 }}/60 characters
            </p>
          </div>

          <!-- Meta Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Meta Description</label>
            <textarea
              v-model="page.meta_description"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @change="updateSEO(page)"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">
              {{ page.meta_description?.length || 0 }}/160 characters
            </p>
          </div>

          <!-- Meta Keywords -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Meta Keywords</label>
            <input
              v-model="page.meta_keywords"
              type="text"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @change="updateSEO(page)"
            />
            <p class="mt-1 text-xs text-gray-500">Separate keywords with commas</p>
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
const pages = ref<any[]>([])
const loading = ref(true)

const fetchSEOData = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .rpc('get_all_seo_data', { p_language_code: currentLanguage.value })

    if (error) throw error
    pages.value = data || []
  } catch (error) {
    console.error('Error fetching SEO data:', error)
  } finally {
    loading.value = false
  }
}

const updateSEO = async (page: any) => {
  try {
    const { error } = await supabase
      .from('seo_metadata')
      .upsert({
        id: page.id,
        page_id: page.page_id,
        page_type: page.page_type,
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        meta_keywords: page.meta_keywords,
        language_code: currentLanguage.value
      })

    if (error) throw error
  } catch (error) {
    console.error('Error updating SEO:', error)
    alert('Error updating SEO data')
  }
}

const getStatusClass = (page: any) => {
  switch (page.translation_status) {
    case 'missing':
      return 'bg-red-100 text-red-800'
    case 'needs_review':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-green-100 text-green-800'
  }
}

watch(currentLanguage, () => {
  fetchSEOData()
})

onMounted(() => {
  fetchSEOData()
})
</script>