<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowUpRight, Menu, X } from '@lucide/vue'
import { useRoute } from 'vue-router'
import BrandLogo from '../common/BrandLogo.vue'
import ThemeToggle from '../common/ThemeToggle.vue'

const open = ref(false)
const scrolled = ref(false)
const route = useRoute()
const links = [
  ['Home', '/'], ['About', '/about'], ['Services', '/services'],
  ['Portfolio', '/portfolio'], ['Edyn Learning', '/edyn-learning'],
  ['Publications', '/publications'], ['Contact', '/contact'],
]

const onScroll = () => { scrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
watch(() => route.fullPath, () => { open.value = false })
</script>

<template>
  <header class="site-header" :class="{ scrolled }">
    <div class="container header-inner">
      <BrandLogo />
      <nav class="desktop-nav" aria-label="Main navigation">
        <RouterLink v-for="([label, path]) in links" :key="path" :to="path">{{ label }}</RouterLink>
      </nav>
      <div class="header-actions">
        <ThemeToggle />
        <RouterLink to="/contact" class="button button-yellow header-cta">Let's Work Together <ArrowUpRight :size="17" /></RouterLink>
        <button class="menu-button" type="button" aria-label="Toggle menu" :aria-expanded="open" @click="open = !open">
          <X v-if="open" />
          <Menu v-else />
        </button>
      </div>
    </div>
    <Transition name="menu">
      <nav v-if="open" class="mobile-nav" aria-label="Mobile navigation">
        <RouterLink v-for="([label, path]) in links" :key="path" :to="path">{{ label }}</RouterLink>
        <RouterLink to="/contact" class="button button-yellow">Let's Work Together <ArrowUpRight :size="17" /></RouterLink>
      </nav>
    </Transition>
  </header>
</template>
