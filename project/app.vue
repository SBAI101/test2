<script setup lang="ts">
const supabase = useSupabaseClient()
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen bg-gray-50">
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>