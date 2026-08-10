<script setup>
import { ArrowRight } from '@lucide/vue'
import WaveDivider from './WaveDivider.vue'

defineProps({
  eyebrow: { type: String, default: 'Edyn Digital Hub' },
  title: { type: String, required: true },
  accent: { type: String, default: '' },
  description: { type: String, required: true },
  primaryLabel: { type: String, default: '' },
  primaryTo: { type: String, default: '/contact' },
})
</script>

<template>
  <section class="page-hero">
    <div class="page-hero-orb one"></div><div class="page-hero-orb two"></div>
    <div class="container page-hero-inner" data-page-hero>
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }} <span v-if="accent">{{ accent }}</span></h1>
      <p>{{ description }}</p>
      <RouterLink v-if="primaryLabel" :to="primaryTo" class="button button-green">{{ primaryLabel }} <ArrowRight :size="18" /></RouterLink>
    </div>
    <WaveDivider color="var(--background)" accent="var(--yellow)" :height="88" flip />
  </section>
</template>
