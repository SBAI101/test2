<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Team Management</h1>
          <p class="mt-2 text-sm text-gray-600">Manage team member profiles and information</p>
        </div>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Add Team Member
        </button>
      </div>
    </div>

    <!-- Team Members Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="member in teamMembers" :key="member.id" class="bg-white shadow rounded-lg overflow-hidden">
        <div class="relative h-48">
          <img
            :src="member.photo_url"
            :alt="member.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-2 right-2">
            <button
              @click="editMember(member)"
              class="p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <PencilIcon class="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div class="p-4">
          <h3 class="text-lg font-medium text-gray-900">{{ member.name }}</h3>
          <p class="text-sm text-gray-500">{{ member.role }}</p>
          
          <div class="mt-4 space-y-2">
            <div class="flex items-center text-sm">
              <EnvelopeIcon class="h-4 w-4 text-gray-400 mr-2" />
              {{ member.email }}
            </div>
            <div class="flex items-center text-sm">
              <UserIcon class="h-4 w-4 text-gray-400 mr-2" />
              {{ member.department }}
            </div>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <div class="flex items-center">
              <span class="text-xs text-gray-500">Display Order:</span>
              <input
                v-model="member.display_order"
                type="number"
                min="0"
                class="ml-2 w-16 text-sm border border-gray-300 rounded p-1"
                @change="updateDisplayOrder(member)"
              />
            </div>
            <button
              @click="deleteMember(member)"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingMember" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingMember ? 'Edit Team Member' : 'Add Team Member' }}
          </h3>
        </div>

        <form @submit.prevent="saveMember" class="p-6">
          <div class="space-y-4">
            <!-- Photo Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Photo</label>
              <div class="mt-1 flex items-center">
                <div class="h-32 w-32 relative">
                  <img
                    v-if="previewImage || (editingMember && editingMember.photo_url)"
                    :src="previewImage || editingMember?.photo_url"
                    class="h-full w-full object-cover rounded"
                  />
                  <div
                    v-else
                    class="h-full w-full bg-gray-100 rounded flex items-center justify-center"
                  >
                    <PhotoIcon class="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  ref="fileInput"
                  @change="handlePhotoUpload"
                />
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="ml-4 px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                >
                  Change Photo
                </button>
              </div>
            </div>

            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input
                v-model="memberForm.name"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Role</label>
              <input
                v-model="memberForm.role"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="memberForm.email"
                type="email"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Department</label>
              <input
                v-model="memberForm.department"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Bio -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                v-model="memberForm.bio"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {{ editingMember ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PencilIcon,
  EnvelopeIcon,
  UserIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'
import { useSupabaseClient } from '#imports'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()

const showAddModal = ref(false)
const editingMember = ref<any>(null)
const previewImage = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const teamMembers = ref<any[]>([])

const memberForm = ref({
  name: '',
  role: '',
  email: '',
  department: '',
  bio: '',
  photo_url: '',
  display_order: 0
})

const fetchTeamMembers = async () => {
  try {
    const { data, error } = await supabase
      .from('website_team')
      .select('*')
      .is('deleted_at', null)
      .order('display_order', { ascending: true })

    if (error) throw error
    teamMembers.value = data || []
  } catch (error) {
    console.error('Error fetching team members:', error)
  }
}

const handlePhotoUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // Create preview
  previewImage.value = URL.createObjectURL(file)

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `team-photos/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    memberForm.value.photo_url = publicUrl
  } catch (error) {
    console.error('Error uploading photo:', error)
    alert('Error uploading photo')
  }
}

const updateDisplayOrder = async (member: any) => {
  try {
    const { error } = await supabase
      .from('website_team')
      .update({ display_order: member.display_order })
      .eq('id', member.id)

    if (error) throw error
  } catch (error) {
    console.error('Error updating display order:', error)
    alert('Error updating display order')
  }
}

const editMember = (member: any) => {
  editingMember.value = member
  memberForm.value = { ...member }
  showAddModal.value = true
}

const deleteMember = async (member: any) => {
  if (!confirm('Are you sure you want to delete this team member?')) return

  try {
    const { error } = await supabase
      .from('website_team')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', member.id)

    if (error) throw error
    await fetchTeamMembers()
  } catch (error) {
    console.error('Error deleting team member:', error)
    alert('Error deleting team member')
  }
}

const saveMember = async () => {
  try {
    const data = {
      ...memberForm.value,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }

    if (editingMember.value) {
      const { error } = await supabase
        .from('website_team')
        .update(data)
        .eq('id', editingMember.value.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('website_team')
        .insert([data])

      if (error) throw error
    }

    await fetchTeamMembers()
    closeModal()
  } catch (error) {
    console.error('Error saving team member:', error)
    alert('Error saving team member')
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingMember.value = null
  previewImage.value = null
  memberForm.value = {
    name: '',
    role: '',
    email: '',
    department: '',
    bio: '',
    photo_url: '',
    display_order: 0
  }
}

onMounted(() => {
  fetchTeamMembers()
})
</script>