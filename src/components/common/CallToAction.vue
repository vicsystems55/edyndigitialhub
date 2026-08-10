<script setup>
import { ArrowRight } from '@lucide/vue'
defineProps({
  eyebrow: { type: String, default: 'Ready when you are' },
  title: { type: String, default: "Let's build something meaningful." },
  text: { type: String, default: 'Tell us what you are working on and we will help shape the right solution.' },
  label: { type: String, default: "Let's Work Together" },
})
</script>

<template>
  <section class="section shared-cta">
    <div class="container cta-card" data-reveal>
      <div><p class="eyebrow">{{ eyebrow }}</p><h2>{{ title }}</h2><p>{{ text }}</p></div>
      <RouterLink to="/contact" class="button button-green">{{ label }} <ArrowRight :size="18" /></RouterLink>
    </div>
  </section>
</template>
