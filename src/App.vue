<script setup>
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import SiteHeader from './components/layout/SiteHeader.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import AppPreloader from './components/common/AppPreloader.vue'

const ready = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('edyn-theme')
  document.documentElement.classList.toggle('dark', saved === 'dark')
  ready.value = true
})
</script>

<template>
  <AppPreloader />
  <div v-if="ready" class="site-shell">
    <SiteHeader />
    <main>
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter />
  </div>
</template>
