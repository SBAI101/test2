<template>
  <dl class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <dt class="text-sm font-medium text-gray-500">Tax ID</dt>
      <dd class="mt-1 text-sm text-gray-900 break-words whitespace-normal">
        {{ taxInfo?.tax_identification_number || 'Not provided' }}
      </dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500">IFI Subject</dt>
      <dd class="mt-1 text-sm text-gray-900">
        {{ taxInfo ? (taxInfo.is_ifi_subject ? 'Yes' : 'No') : 'Not provided' }}
      </dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500">US TIN</dt>
      <dd class="mt-1 text-sm text-gray-900 break-words whitespace-normal">
        {{ taxInfo?.us_tin || 'Not provided' }}
      </dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500">Tax Residence</dt>
      <dd class="mt-1 text-sm text-gray-900">
        {{ taxResidenceName || 'Not provided' }}
      </dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500">US Tax Links</dt>
      <dd class="mt-1 text-sm text-gray-900">
        {{ taxInfo?.us_tax_links ? 'Yes' : 'No' }}
      </dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500">Created At</dt>
      <dd class="mt-1 text-sm text-gray-900">
        {{ taxInfo?.created_at ? formatDate(taxInfo.created_at) : 'Not provided' }}
      </dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500">Updated At</dt>
      <dd class="mt-1 text-sm text-gray-900">
        {{ taxInfo?.updated_at ? formatDate(taxInfo.updated_at) : 'Not provided' }}
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  taxInfo: any,
  countries?: any[]
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const taxResidenceName = computed(() => {
  if (
    !props.taxInfo ||
    !props.taxInfo.tax_residence_id ||
    !props.countries ||
    !Array.isArray(props.countries)
  ) {
    return null
  }
  const country = props.countries.find(
    (c: any) => c.id === props.taxInfo.tax_residence_id
  )
  return country ? country.country_name : props.taxInfo.tax_residence_id
})
</script>
