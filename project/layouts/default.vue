<template>
  <div class="min-h-screen bg-gray-50">
    <ClientOnly>
      <LayoutSidebar v-if="user" />
    </ClientOnly>
    
    <div :class="{ 'ml-64': user }">
      <!-- Top Navigation -->
      <header v-if="user" class="sticky top-0 z-30 bg-white border-b border-gray-200">
        <nav class="mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div class="flex h-16 items-center justify-between">
            <div class="flex items-center">
              <h2 class="text-xl font-bold text-gray-900">
                {{ pageTitle }}
              </h2>
            </div>
            <div class="flex items-center space-x-4">
              <ClientOnly>
                <div v-if="user" class="flex items-center space-x-4">
                  <span class="text-sm text-gray-500">{{ user.email }}</span>
                  <button 
                    @click="handleLogout" 
                    class="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </ClientOnly>
            </div>
          </div>
        </nav>
      </header>

      <!-- Main Content -->
      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <slot />
      </main>

      <!-- Astavest Icon Logo in bottom right -->
      <div class="fixed bottom-4 right-4 opacity-50 hover:opacity-100 transition-opacity duration-200">
        <img 
          src="/astavest-icon.png" 
          alt="Astavest Icon" 
          class="h-12 w-12 object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const user = useSupabaseUser()
const client = useSupabaseClient()

// Compute page title based on route
const pageTitle = computed(() => {
  const path = route.path.split('/')[1] || 'dashboard'
  return path.charAt(0).toUpperCase() + path.slice(1)
})

const handleLogout = async () => {
  try {
    await client.auth.signOut()
    navigateTo('/auth/login')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}
</script>