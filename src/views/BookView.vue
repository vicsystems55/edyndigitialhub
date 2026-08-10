<script setup>
import { ref } from 'vue'
import { ArrowLeft, ArrowRight, BookOpen, Check, Mail } from '@lucide/vue'
import BookCover from '../components/common/BookCover.vue'
import CallToAction from '../components/common/CallToAction.vue'
import { usePageAnimations } from '../composables/usePageAnimations'
import ceoImage from '../assets/images/ceo.png'

const root = ref(null)
usePageAnimations(root)
</script>

<template>
  <div ref="root" class="book-page">
    <section class="book-hero">
      <div class="container book-hero-grid">
        <div class="book-hero-cover" data-page-hero><BookCover /></div>
        <div class="book-hero-copy" data-page-hero><RouterLink to="/publications" class="back-link"><ArrowLeft :size="17" /> All publications</RouterLink><p class="eyebrow">A book by Princess Oluwatoyin Emmanuel</p><h1>The <span>Health</span> You</h1><p>The official book description and edition details are being prepared. This page will become the central destination for previews, availability, and purchasing information.</p><div class="book-status"><span><Check :size="16" /> Founder-authored publication</span><span><BookOpen :size="16" /> Format details coming soon</span></div><RouterLink to="/contact" class="button button-yellow">Ask About Availability <ArrowRight :size="18" /></RouterLink></div>
      </div>
    </section>

    <section class="section book-overview"><div class="container book-content-grid"><aside data-reveal><p class="eyebrow">Publication details</p><dl><div><dt>Title</dt><dd>The Health You</dd></div><div><dt>Author</dt><dd>Princess Oluwatoyin Emmanuel</dd></div><div><dt>Publisher</dt><dd>To be confirmed</dd></div><div><dt>Formats</dt><dd>To be announced</dd></div><div><dt>Availability</dt><dd>Enquire for details</dd></div></dl></aside><div class="prose large" data-reveal><h2>About the book</h2><p>The official synopsis will appear here once the final publication copy has been supplied. This section is designed to explain the book's central message, the reader it serves, and the transformation it hopes to encourage.</p><h2>What readers can expect</h2><ul class="book-expectations"><li><Check /> Clear, thoughtfully presented ideas</li><li><Check /> Practical insights readers can reflect on</li><li><Check /> A purposeful perspective from the author</li></ul><p class="editorial-note">Publication language on this page is intentionally provisional until the final synopsis and edition information are approved.</p></div></div></section>

    <section class="section author-book-section"><div class="container author-book-grid"><div class="author-book-photo" data-reveal><img :src="ceoImage" alt="Princess Oluwatoyin Emmanuel" loading="lazy" /></div><div data-reveal><p class="eyebrow">About the author</p><h2>Princess Oluwatoyin Emmanuel</h2><p>Princess is the Founder and Creative Director of Edyn Digital Hub, a multidisciplinary digital professional, educational product developer, and author committed to creating resources that inform, empower, and inspire growth.</p><RouterLink to="/about" class="text-link">Meet the Founder <ArrowRight :size="17" /></RouterLink></div></div></section>

    <section class="section book-updates"><div class="container book-updates-card" data-reveal><Mail :size="34" /><div><p class="eyebrow">Book updates</p><h2>Want publication and availability updates?</h2><p>Join the Edyn resources list or contact us directly for information about <em>The Health You</em>.</p></div><RouterLink to="/resources" class="button button-yellow">Get Updates <ArrowRight :size="18" /></RouterLink></div></section>
    <CallToAction eyebrow="Publication enquiries" title="Interested in The Health You?" text="Contact us for current availability, purchasing information, partnerships, or bulk-order enquiries." label="Contact Edyn Digital Hub" />
  </div>
</template>
