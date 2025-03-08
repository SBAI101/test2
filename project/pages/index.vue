<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">{{ $t('navigation.dashboard') }}</h1>
    
    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        :title="$t('dashboard.metrics.totalClients')"
        :value="dashboardData.totalClients"
        :trend="2.5"
        :subtitle="$t('dashboard.metrics.lastMonth')"
        :icon="UsersIcon"
      />
      <MetricCard
        :title="$t('dashboard.metrics.fundsManaged')"
        :value="dashboardData.totalFundsManaged"
        :trend="5.2"
        :subtitle="$t('dashboard.metrics.lastMonth')"
        :icon="BanknotesIcon"
        format="currency"
      />
      <MetricCard
        :title="$t('dashboard.metrics.portfolioProfits')"
        :value="dashboardData.totalPortfolioProfits"
        :trend="-1.8"
        :subtitle="$t('dashboard.metrics.lastMonth')"
        :icon="ChartBarIcon"
        format="percentage"
      />
      <MetricCard
        :title="$t('dashboard.metrics.totalFees')"
        :value="dashboardData.totalFees"
        :trend="3.7"
        :subtitle="$t('dashboard.metrics.lastMonth')"
        :icon="CurrencyEuroIcon"
        format="currency"
      />
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <QuickAction
        :title="$t('dashboard.quickActions.pendingClients')"
        :description="$t('dashboard.quickActions.pendingClientsDesc')"
        :icon="UserPlusIcon"
        to="/pipeline"
        :count="3"
        type="warning"
      />
      <QuickAction
        :title="$t('dashboard.quickActions.complianceUpdates')"
        :description="$t('dashboard.quickActions.complianceUpdatesDesc')"
        :icon="ShieldCheckIcon"
        to="/compliance"
        :count="5"
        type="danger"
      />
      <QuickAction
        :title="$t('dashboard.quickActions.monthlyReports')"
        :description="$t('dashboard.quickActions.monthlyReportsDesc')"
        :icon="DocumentChartBarIcon"
        to="/reports"
        :count="12"
        type="success"
      />
    </div>

    <!-- Notifications -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <NotificationList />
      </div>
      <div>
        <!-- Additional widget space -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UsersIcon,
  BanknotesIcon,
  ChartBarIcon,
  CurrencyEuroIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  DocumentChartBarIcon
} from '@heroicons/vue/24/outline'
import MetricCard from '~/components/dashboard/MetricCard.vue'
import QuickAction from '~/components/dashboard/QuickAction.vue'
import NotificationList from '~/components/dashboard/NotificationList.vue'
import { useClientStats } from '~/composables/useClientStats'

definePageMeta({
  middleware: 'auth'
})

const { totalClients, loading } = useClientStats()

// This would come from your Supabase store/query in a real implementation
const dashboardData = ref({
  totalClients: computed(() => loading.value ? 0 : totalClients.value),
  totalFundsManaged: 12500000,
  totalPortfolioProfits: 8.5,
  totalFees: 450000
})
</script>