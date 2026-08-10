<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { siteConfig } from '../../config/site'
import BrandLogo from './BrandLogo.vue'

const visible = ref(true)
const loader = ref(null)

onMounted(() => {
  const started = performance.now()
  const close = () => {
    const remaining = Math.max(0, siteConfig.preloader.minimumDuration - (performance.now() - started))
    window.setTimeout(() => {
      gsap.to(loader.value, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        onComplete: () => { visible.value = false },
      })
    }, remaining)
  }
  document.readyState === 'complete' ? close() : window.addEventListener('load', close, { once: true })
})
</script>

<template>
  <div v-if="visible" ref="loader" class="preloader" role="status" aria-label="Loading Edyn Digital Hub">
    <div v-if="siteConfig.preloader.type === 'logo'" class="preloader-logo-wrap">
      <img :src="siteConfig.preloader.logoSrc" alt="Edyn Digital Hub" class="preloader-logo" />
      <span class="preloader-line"><i></i></span>
    </div>
    <div v-else class="preloader-text">
      <BrandLogo />
      <span class="preloader-line"><i></i></span>
    </div>
  </div>
</template>
