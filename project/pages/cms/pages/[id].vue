<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-gray-900">Edit Page</h1>
        <div class="flex items-center space-x-4">
          <select
            v-model="currentLanguage"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="fr">French</option>
            <option value="en">English</option>
          </select>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            @click="savePage"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Page Content Editor -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Page Title</label>
          <input
            v-model="pageData.title"
            type="text"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            v-model="pageData.content"
            rows="10"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <!-- SEO Section -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Meta Title</label>
              <input
                v-model="pageData.meta_title"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Meta Description</label>
              <textarea
                v-model="pageData.meta_description"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="border-t pt-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Page Status</h3>
              <p class="text-sm text-gray-500">Control the visibility of this page</p>
            </div>
            <select
              v-model="pageData.status"
              class="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseClient } from '#imports'

const route = useRoute()
const supabase = useSupabaseClient()

const currentLanguage = ref('fr')
const pageData = ref({
  title: '',
  content: '',
  meta_title: '',
  meta_description: '',
  status: 'draft'
})

const fetchPageData = async () => {
  try {
    const { data, error } = await supabase
      .from('static_content')
      .select(`
        *,
        seo:seo_id (
          meta_title,
          meta_description
        )
      `)
      .eq('id', route.params.id)
      .eq('language_code', currentLanguage.value)
      .single()

    if (error) throw error

    if (data) {
      pageData.value = {
        title: data.title || '',
        content: data.content || '',
        meta_title: data.seo?.meta_title || '',
        meta_description: data.seo?.meta_description || '',
        status: data.status || 'draft'
      }
    }
  } catch (error) {
    console.error('Error fetching page:', error)
  }
}

const savePage = async () => {
  try {
    // First update or create SEO metadata
    const { data: seoData, error: seoError } = await supabase
      .from('seo_metadata')
      .upsert({
        page_id: route.params.id,
        page_type: 'static',
        meta_title: pageData.value.meta_title,
        meta_description: pageData.value.meta_description,
        language_code: currentLanguage.value
      })
      .select()
      .single()

    if (seoError) throw seoError

    // Then update the page content
    const { error: pageError } = await supabase
      .from('static_content')
      .upsert({
        id: route.params.id,
        title: pageData.value.title,
        content: pageData.value.content,
        language_code: currentLanguage.value,
        seo_id: seoData.id,
        status: pageData.value.status
      })

    if (pageError) throw pageError

    // Show success message
    alert('Page saved successfully')
  } catch (error) {
    console.error('Error saving page:', error)
    alert('Error saving page')
  }
}

// Watch for language changes
watch(currentLanguage, () => {
  fetchPageData()
})

// Initial fetch
onMounted(() => {
  fetchPageData()
})
</script>