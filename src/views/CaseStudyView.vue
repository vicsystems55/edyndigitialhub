<script setup>
import { computed, ref } from 'vue'
import { ArrowLeft, ArrowRight, Check } from '@lucide/vue'
import { useRoute } from 'vue-router'
import CallToAction from '../components/common/CallToAction.vue'
import { projects } from '../data/siteData'
import { usePageAnimations } from '../composables/usePageAnimations'

const root = ref(null)
const route = useRoute()
const project = computed(() => projects.find((item) => item.slug === route.params.slug) || projects[0])
usePageAnimations(root)
</script>

<template>
  <div ref="root" class="case-study">
    <section class="case-hero"><div class="container" data-page-hero><RouterLink to="/portfolio" class="back-link"><ArrowLeft :size="17" /> Portfolio</RouterLink><p class="eyebrow">{{ project.category }} · Case study</p><h1>{{ project.title }}</h1><p>{{ project.summary }}</p><div class="case-services"><span v-for="item in project.services" :key="item">{{ item }}</span></div></div></section>
    <section class="section"><div class="container case-art-large project-art" :class="project.className" data-reveal><span class="project-monogram">E</span><span class="project-lines"></span></div></section>
    <section class="section case-content"><div class="container case-content-grid"><aside data-reveal><p class="eyebrow">Project focus</p><ul><li v-for="item in project.services" :key="item"><Check :size="16" />{{ item }}</li></ul></aside><div class="prose large" data-reveal><h2>The challenge</h2><p>The project needed a clear and flexible creative direction capable of communicating value, building trust, and supporting growth across multiple touchpoints.</p><h2>Our approach</h2><p>We began by clarifying the audience, objectives, and message. From there, we developed a focused visual and content system, refined the key interactions, and organized every deliverable for consistent real-world use.</p><h2>The outcome</h2><p>A polished, practical system designed to help the brand communicate confidently and scale its presence. Verified performance results will be added as this case study develops.</p><RouterLink to="/contact" class="text-link">Plan a similar project <ArrowRight :size="17" /></RouterLink></div></div></section>
    <CallToAction title="Ready to create your own success story?" />
  </div>
</template>
