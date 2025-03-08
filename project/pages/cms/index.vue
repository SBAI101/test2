<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">{{ $t('navigation.cmsManagement') }}</h1>
      <p class="mt-2 text-sm text-gray-600">Manage website content, pages, and multilingual translations</p>
    </div>

    <!-- Content Management Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Static Pages -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Static Pages</h2>
        <ul class="space-y-3">
          <li v-for="page in staticPages" :key="page.id" class="flex items-center justify-between">
            <NuxtLink 
              :to="`/cms/pages/${page.id}`"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              {{ page.title }}
            </NuxtLink>
            <span 
              class="text-xs px-2 py-1 rounded-full"
              :class="getStatusClass(page.status)"
            >
              {{ page.status }}
            </span>
          </li>
        </ul>
        <button 
          @click="navigateTo('/cms/pages/new')"
          class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Add New Page
        </button>
      </div>

      <!-- Footer Content -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Footer & Legal</h2>
        <ul class="space-y-3">
          <li v-for="doc in legalDocs" :key="doc.id" class="flex items-center justify-between">
            <span class="text-sm text-gray-600">{{ doc.title }}</span>
            <div class="flex items-center space-x-2">
              <span class="text-xs text-gray-500">{{ doc.language }}</span>
              <button 
                @click="editLegalDoc(doc)"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>
          </li>
        </ul>
        <button 
          @click="navigateTo('/cms/footer')"
          class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Manage Footer Content
        </button>
      </div>

      <!-- Team Management -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Team Members</h2>
        <ul class="space-y-3">
          <li v-for="member in teamMembers" :key="member.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <img 
                :src="member.photo_url" 
                :alt="member.name"
                class="h-8 w-8 rounded-full object-cover"
              />
              <span class="ml-2 text-sm text-gray-600">{{ member.name }}</span>
            </div>
            <button 
              @click="editTeamMember(member)"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </li>
        </ul>
        <button 
          @click="navigateTo('/cms/team')"
          class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Manage Team
        </button>
      </div>
    </div>

    <!-- Additional Management Sections -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <!-- SEO Management -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">SEO Management</h2>
        <p class="text-sm text-gray-600 mb-4">
          Manage meta titles, descriptions, and keywords for better search visibility.
        </p>
        <button 
          @click="navigateTo('/cms/seo')"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Manage SEO Settings
        </button>
      </div>

      <!-- Language Management -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Language Management</h2>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600">French</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600">English</span>
            </div>
          </div>
        </div>
        <button 
          @click="navigateTo('/cms/translations')"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Manage Translations
        </button>
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

// Sample data - replace with actual data from Supabase
const staticPages = ref([
  { id: 'about', title: 'About Astavest', status: 'published' },
  { id: 'professionals', title: 'Professionals', status: 'published' },
  { id: 'code-of-conduct', title: 'Code of Conduct', status: 'draft' }
])

const legalDocs = ref([
  { id: 'der', title: 'DER Document', language: 'FR' },
  { id: 'der-en', title: 'DER Document', language: 'EN' },
  { id: 'dic', title: 'DIC Document', language: 'FR' },
  { id: 'dic-en', title: 'DIC Document', language: 'EN' }
])

const teamMembers = ref([
  { 
    id: 1, 
    name: 'John Doe', 
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'CEO'
  }
])

const getStatusClass = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const editLegalDoc = (doc: any) => {
  navigateTo(`/cms/legal/${doc.id}`)
}

const editTeamMember = (member: any) => {
  navigateTo(`/cms/team/${member.id}`)
}
</script>