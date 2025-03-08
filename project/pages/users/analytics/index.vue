<!-- pages/users/analytics/index.vue -->
<template>
  <div>
    <UserManagementNav />
    
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">{{ $t('userManagement.analytics.title') }}</h1>
        <p class="mt-2 text-sm text-gray-600">{{ $t('userManagement.analytics.description') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="p-4 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Period Filter -->
          <div>
            <label class="sr-only">{{ $t('userManagement.analytics.filters.period') }}</label>
            <select
              v-model="filters.period"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>

          <!-- Type Filter -->
          <div>
            <label class="sr-only">{{ $t('userManagement.analytics.filters.type') }}</label>
            <select
              v-model="filters.type"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Users</option>
              <option value="clients">Clients Only</option>
              <option value="employees">Employees Only</option>
            </select>
          </div>

          <!-- Segment Filter -->
          <div>
            <label class="sr-only">{{ $t('userManagement.analytics.filters.segment') }}</label>
            <select
              v-model="filters.segment"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Segments</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        :title="$t('userManagement.analytics.metrics.userGrowth')"
        :value="analytics.userGrowth"
        :trend="2.5"
        :subtitle="$t('dashboard.metrics.lastMonth')"
        :icon="UsersIcon"
        format="percentage"
      />
      <MetricCard
        :title="$t('userManagement.analytics.metrics.clientRetention')"
        :value="analytics.clientRetention"
        :trend="1.8"
        :subtitle="$t('dashboard.metrics.lastMonth')"
        :icon="UserGroupIcon"
        format="percentage"
      />
      <MetricCard
        :title="$t('userManagement.analytics.metrics.documentCompletion')"
        :value="analytics.documentCompletion"
        :trend="-0.5"
        :subtitle="$t('dashboard.metrics.lastMonth')"
        :icon="DocumentCheckIcon"
        format="percentage"
      />
      <MetricCard
        :title="$t('userManagement.analytics.metrics.complianceRate')"
        :value="analytics.complianceRate"
        :trend="0.8"
        :subtitle="$t('dashboard.metrics.lastMonth')"
        :icon="ShieldCheckIcon"
        format="percentage"
      />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- User Growth Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">User Growth Over Time</h3>
        <div class="h-64">
          <!-- Chart component will go here -->
          <div class="flex items-center justify-center h-full text-gray-500">
            Chart component loading...
          </div>
        </div>
      </div>

      <!-- User Distribution Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">User Distribution</h3>
        <div class="h-64">
          <!-- Chart component will go here -->
          <div class="flex items-center justify-center h-full text-gray-500">
            Chart component loading...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UsersIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
import MetricCard from '~/components/dashboard/MetricCard.vue'
import UserManagementNav from '~/components/users/UserManagementNav.vue'
import { useAnalytics } from '~/composables/useAnalytics'

definePageMeta({
  middleware: 'auth'
})

const filters = ref({
  period: '30d',
  type: 'all',
  segment: 'all'
})

const { analytics, loading, error, fetchAnalytics } = useAnalytics()

onMounted(() => {
  fetchAnalytics()
})

watch(filters, () => {
  fetchAnalytics(filters.value)
})
</script>