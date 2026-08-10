<script setup>
import { computed, ref } from 'vue'
import { ArrowRight } from '@lucide/vue'
import PageHero from '../components/common/PageHero.vue'
import CallToAction from '../components/common/CallToAction.vue'
import { projects } from '../data/siteData'
import { usePageAnimations } from '../composables/usePageAnimations'

const root = ref(null)
const active = ref('All')
const filters = ['All', 'Branding', 'Social Media', 'Graphic Design', 'UI/UX', 'Websites', 'Educational', 'Corporate Documents']
const filteredProjects = computed(() => active.value === 'All' ? projects : projects.filter((project) => project.category === active.value))
usePageAnimations(root)
</script>

<template>
  <div ref="root">
    <PageHero eyebrow="Selected work" title="Purposeful design." accent="Meaningful impact." description="Explore branding, content, websites, digital experiences, and educational products shaped through thoughtful problem-solving." primary-label="Start Your Project" />
    <section class="section portfolio-page">
      <div class="container">
        <div class="filter-bar" data-reveal role="group" aria-label="Filter portfolio"><button v-for="filter in filters" :key="filter" :class="{ active: active === filter }" type="button" @click="active = filter">{{ filter }}</button></div>
        <TransitionGroup name="projects" tag="div" class="portfolio-full-grid">
          <RouterLink v-for="project in filteredProjects" :key="project.slug" :to="`/portfolio/${project.slug}`" class="portfolio-item">
            <div class="project-art" :class="project.className"><span class="project-monogram">E</span><span class="project-lines"></span><span class="view-project">View case study <ArrowRight :size="16" /></span></div>
            <div class="portfolio-copy"><p>{{ project.category }}</p><h2>{{ project.title }}</h2><span>{{ project.summary }}</span></div>
          </RouterLink>
        </TransitionGroup>
        <div v-if="!filteredProjects.length" class="empty-state">More work in this category is coming soon.</div>
      </div>
    </section>
    <CallToAction eyebrow="Have a project in mind?" title="Your project could be our next meaningful collaboration." />
  </div>
</template>
