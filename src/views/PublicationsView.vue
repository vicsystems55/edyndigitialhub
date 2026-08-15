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
  { title: 'The Confident You', number: '02', theme: 'Personal Growth', accent: 'confident' },
  { title: 'The Wealthy You', number: '03', theme: 'Wealth & Growth', accent: 'wealthy' },
]
</script>

<template>
  <div ref="root" class="publications-page">
    <PageHero eyebrow="Welcome to the Edyn Library" title="Books for a better," accent="more empowered you." description="Explore a growing library of thoughtful publications created to support wellbeing, confidence, personal growth, and meaningful transformation." primary-label="Read Our Latest Book" primary-to="/publications/the-healthy-you" />

    <section class="library-intro"><div class="container library-intro-row" data-reveal><div><span>01</span><strong>Published title</strong></div><div><span>02</span><strong>Books coming soon</strong></div><p>A growing collection by Princess Oluwatoyin Emmanuel and Edyn Digital Hub.</p></div></section>

    <section class="section publication-feature">
      <div class="container publication-feature-grid">
        <div class="featured-cover-wrap" data-reveal><div class="cover-orbit"></div><BookCover /></div>
        <div data-reveal><p class="eyebrow">Latest from the library</p><span class="latest-release-badge">Available now</span><h2>The Healthy You</h2><p class="publication-byline">By Princess Oluwatoyin Emmanuel</p><p class="publication-description">A practical guide created to inspire healthier choices, sustainable personal growth, and a more confident approach to wellbeing.</p><div class="publication-meta"><span><BookOpen :size="18" /> Latest title</span><span><Feather :size="18" /> Founder-authored</span></div><RouterLink to="/publications/the-healthy-you" class="button button-green">View Details & Buy <ArrowRight :size="18" /></RouterLink></div>
      </div>
    </section>

    <section class="section publishing-purpose"><div class="container"><header class="section-heading" data-reveal><p class="eyebrow">The heart of our library</p><h2>Knowledge can create lasting change</h2><p>The Edyn Library extends our commitment to learning, wellbeing, creativity, and practical transformation beyond digital services.</p></header><div class="publishing-values"><article data-reveal><BookOpen /><h3>Learn</h3><p>Discover useful ideas presented with clarity and purpose.</p></article><article data-reveal><Sparkles /><h3>Become</h3><p>Reflect on new possibilities for your life and personal journey.</p></article><article data-reveal><Feather /><h3>Grow</h3><p>Turn meaningful insight into informed and purposeful action.</p></article></div></div></section>

    <section id="library" class="section upcoming-publications"><div class="container"><header class="section-heading" data-reveal><p class="eyebrow">Coming to the library</p><h2>Your next reads are taking shape</h2><p>Two new titles are currently being developed as part of the growing “You” collection.</p></header><div class="upcoming-books-grid"><article v-for="book in upcomingBooks" :key="book.number" :class="`upcoming-book--${book.accent}`" data-reveal><span>{{ book.number }}</span><div class="upcoming-book-mark">E</div><p>{{ book.theme }}</p><h3>{{ book.title }}</h3><small>Coming soon</small><div class="book-spine-title">{{ book.title }}</div></article></div><div class="center-action" data-reveal><RouterLink to="/resources" class="button button-outline"><Bell :size="17" /> Get Library Updates</RouterLink></div></div></section>

    <CallToAction eyebrow="Library enquiries" title="Interested in a book, partnership, or bulk order?" text="Contact Edyn Digital Hub for book availability, library updates, and publication enquiries." label="Make an Enquiry" />
  </div>
</template>
