<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-medium text-gray-900 mb-4">CGP / CIF Information</h2>
    <!-- Representative Information -->
    <div class="mb-4">
      <h3 class="text-md font-semibold">Representative Details</h3>
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt class="text-sm font-medium text-gray-500">Name</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ cgpInfo?.representative?.nom || 'Not available' }}
            {{ cgpInfo?.representative?.prenom || '' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Email</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ cgpInfo?.representative?.email || 'Not available' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Telephone</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ cgpInfo?.representative?.telephone || 'Not available' }}
          </dd>
        </div>
      </dl>
    </div>
    <!-- Legal Entity Information -->
    <div>
      <h3 class="text-md font-semibold">Legal Entity</h3>
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt class="text-sm font-medium text-gray-500">Address</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ cgpInfo?.legalEntity?.adresse || 'Not provided' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Postal Code</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ cgpInfo?.legalEntity?.postalCode || 'Not provided' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">City</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ cgpInfo?.legalEntity?.city || 'Not provided' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Country</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ cgpInfo?.legalEntity?.country || 'Not provided' }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  cgpInfo: any
}>()
</script>
