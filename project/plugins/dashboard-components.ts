import { defineNuxtPlugin } from '#app'
import MetricCard from '~/components/dashboard/MetricCard.vue'
import QuickAction from '~/components/dashboard/QuickAction.vue'
import NotificationList from '~/components/dashboard/NotificationList.vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('MetricCard', MetricCard)
  nuxtApp.vueApp.component('QuickAction', QuickAction)
  nuxtApp.vueApp.component('NotificationList', NotificationList)
})