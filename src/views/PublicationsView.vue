<script setup>
import { ref } from 'vue'
import { ArrowRight, Bell, BookOpen, Feather, Sparkles } from '@lucide/vue'
import PageHero from '../components/common/PageHero.vue'
import BookCover from '../components/common/BookCover.vue'
import CallToAction from '../components/common/CallToAction.vue'
import { usePageAnimations } from '../composables/usePageAnimations'

const root = ref(null)
usePageAnimations(root)

const upcomingBooks = [
  { label: 'Upcoming publication', number: '01', theme: 'Wellbeing' },
  { label: 'Upcoming publication', number: '02', theme: 'Learning' },
  { label: 'Upcoming publication', number: '03', theme: 'Growth' },
]
</script>

<template>
  <div ref="root" class="publications-page">
    <PageHero eyebrow="Edyn Books & Publications" title="Ideas worth sharing." accent="Books made to impact." description="Discover publications created to educate, inspire, and support meaningful personal and professional growth." primary-label="Discover The Health You" primary-to="/publications/the-health-you" />

    <section class="section publication-feature">
      <div class="container publication-feature-grid">
        <div class="featured-cover-wrap" data-reveal><div class="cover-orbit"></div><BookCover /></div>
        <div data-reveal><p class="eyebrow">Featured publication</p><h2>The Health You</h2><p class="publication-byline">By Princess Oluwatoyin Emmanuel</p><p class="publication-description">A publication from the founder of Edyn Digital Hub. The official synopsis, edition information, and purchasing details will be added here when they are confirmed.</p><div class="publication-meta"><span><BookOpen :size="18" /> Published work</span><span><Feather :size="18" /> Founder-authored</span></div><RouterLink to="/publications/the-health-you" class="button button-green">Explore the Book <ArrowRight :size="18" /></RouterLink></div>
      </div>
    </section>

    <section class="section publishing-purpose"><div class="container"><header class="section-heading" data-reveal><p class="eyebrow">Why we publish</p><h2>Knowledge can create lasting change</h2><p>Edyn publications extend our commitment to learning, creativity, wellbeing, and practical transformation beyond digital services.</p></header><div class="publishing-values"><article data-reveal><BookOpen /><h3>Educate</h3><p>Make useful knowledge easier to understand and apply.</p></article><article data-reveal><Sparkles /><h3>Inspire</h3><p>Encourage reflection, possibility, and purposeful action.</p></article><article data-reveal><Feather /><h3>Empower</h3><p>Give readers ideas and tools that support meaningful growth.</p></article></div></div></section>

    <section class="section upcoming-publications"><div class="container"><header class="section-heading" data-reveal><p class="eyebrow">Coming next</p><h2>More publications are taking shape</h2><p>New titles are currently being developed. Join our updates to be among the first to know.</p></header><div class="upcoming-books-grid"><article v-for="book in upcomingBooks" :key="book.number" data-reveal><span>{{ book.number }}</span><div class="upcoming-book-mark">E</div><p>{{ book.theme }}</p><h3>{{ book.label }}</h3><small>Title to be announced</small></article></div><div class="center-action" data-reveal><RouterLink to="/resources" class="button button-outline"><Bell :size="17" /> Follow Publication Updates</RouterLink></div></div></section>

    <CallToAction eyebrow="Publishing enquiries" title="Interested in a publication, partnership, or bulk order?" text="Contact Edyn Digital Hub for availability, publication updates, and collaboration enquiries." label="Make an Enquiry" />
  </div>
</template>
