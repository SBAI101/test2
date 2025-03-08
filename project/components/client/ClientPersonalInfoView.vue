<template>
  <dl class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- Row 1: Full Name, Civility, Email -->
    <div>
      <dt class="text-sm font-medium text-gray-500">Full Name</dt>
      <dd class="mt-1 text-sm text-gray-900 break-words whitespace-normal">
        {{ client?.name || 'Unknown' }}
      </dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500">Civility</dt>
      <dd class="mt-1 text-sm text-gray-900">
        {{ personalInfo?.civility || 'Not provided' }}
      </dd>
    </div>
    <div class="relative">
      <dt class="text-sm font-medium text-gray-500">Email</dt>
      <dd class="mt-1 text-sm break-words whitespace-normal">
        <span class="text-blue-600 hover:underline cursor-pointer" @click="$emit('toggle-email')">
          {{ client?.email || personalInfo?.email || 'Not provided' }}
        </span>
      </dd>
    </div>
    <!-- Row 2: Phone Number, Date of Birth, Place of Birth -->
    <div class="relative">
      <dt class="text-sm font-medium text-gray-500">Phone Number</dt>
      <dd class="mt-1 text-sm break-words whitespace-normal">
        <span class="text-blue-600 hover:underline cursor-pointer" @click="$emit('toggle-phone')">
          {{ personalInfo?.phone_number || 'Not provided' }}
        </span>
      </dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
      <dd class="mt-1 text-sm text-gray-900">
        {{ personalInfo?.date_of_birth ? formatDate(personalInfo.date_of_birth) : 'Not provided' }}
      </dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500">Place of Birth</dt>
      <dd class="mt-1 text-sm text-gray-900">
        {{ personalInfo?.place_of_birth || 'Not provided' }}
      </dd>
    </div>
    <!-- Row 3: Client's Personal Address, Location and Country -->
    <div>
      <dt class="text-sm font-medium text-gray-500">Address</dt>
      <dd class="mt-1 text-sm text-gray-900 break-words whitespace-pre-line">
        {{ personalInfo?.address || 'Not provided' }}
      </dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500">Location</dt>
      <dd class="mt-1 text-sm text-gray-900">
        {{ personalInfo?.postal_code || 'No postal code' }} {{ personalInfo?.city || 'No city' }}
      </dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500">Country</dt>
      <dd class="mt-1 text-sm text-gray-900">
        {{ personalInfo?.country_name || 'Not provided' }}
      </dd>
    </div>
    <!-- Row 4: Client Type and Shareable ID -->
    <div>
      <dt class="text-sm font-medium text-gray-500">Client Type</dt>
      <dd class="mt-1 text-sm text-gray-900">
        {{ client?.type || 'physique' }}
      </dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500">Shareable ID</dt>
      <dd class="mt-1 text-sm text-gray-900 font-mono">
        {{ client?.shareable_id || 'Not available' }}
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
const props = defineProps<{
  client: any,
  personalInfo: any
}>()

defineEmits<{
  'toggle-email': [],
  'toggle-phone': []
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}
</script>
