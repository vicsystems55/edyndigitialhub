<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import SiteHeader from './components/layout/SiteHeader.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import AppPreloader from './components/common/AppPreloader.vue'

const ready = ref(false)
const route = useRoute()
const isAdminRoute = computed(() => route.meta.admin === true)

onMounted(() => {
  const saved = localStorage.getItem('edyn-theme')
  document.documentElement.classList.toggle('dark', saved === 'dark')
  ready.value = true
})
</script>

<template>
  <AppPreloader v-if="route.name !== 'the-healthy-you'" />
  <div v-if="ready" :class="isAdminRoute ? 'admin-app-shell' : 'site-shell'">
    <SiteHeader v-if="!isAdminRoute" />
    <main :class="{ 'admin-app-main': isAdminRoute }">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter v-if="!isAdminRoute" />
  </div>
</template>
