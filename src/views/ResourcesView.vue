<script setup>
import { reactive, ref } from 'vue'
import { ArrowRight, BookOpen, Download, FileText, Lightbulb, Mail } from '@lucide/vue'
import PageHero from '../components/common/PageHero.vue'
import CallToAction from '../components/common/CallToAction.vue'
import { resourceArticles } from '../data/siteData'
import { usePageAnimations } from '../composables/usePageAnimations'
import { subscribeToNewsletter } from '../services/communications'

const root = ref(null)
const subscribed = ref(false)
const subscribing = ref(false)
const subscribeError = ref('')
const subscriber = reactive({ name: '', email: '' })
usePageAnimations(root)

async function subscribe() {
  subscribing.value = true
  subscribeError.value = ''
  try {
    await subscribeToNewsletter({ ...subscriber, source: 'resources' })
    subscribed.value = true
  } catch (error) {
    subscribeError.value = error.message || 'Unable to subscribe right now.'
  } finally {
    subscribing.value = false
  }
}
</script>

<template>
  <div ref="root">
    <PageHero eyebrow="Resources & insights" title="Practical ideas for" accent="meaningful growth." description="Explore useful guidance on branding, design, digital business, education, and responsible AI-powered creativity." />

    <section class="section featured-resource"><div class="container featured-resource-card" data-reveal><div class="resource-icon"><Lightbulb :size="38" /></div><div><p class="eyebrow">Featured insight</p><h2>Build a digital presence that works as one connected system.</h2><p>Your brand, content, website, and customer experience are stronger when they support the same clear goal.</p><a href="#articles" class="text-link">Explore the latest insights <ArrowRight :size="17" /></a></div></div></section>

    <section id="articles" class="section articles-section"><div class="container"><header class="section-heading" data-reveal><p class="eyebrow">From the journal</p><h2>Ideas you can put to work</h2><p>Clear, practical perspectives for creative and business growth.</p></header><div class="articles-grid"><article v-for="(article, index) in resourceArticles" :key="article.title" data-reveal><div class="article-art" :class="`article-${(index % 3) + 1}`"><FileText :size="34" /><span>{{ article.category }}</span></div><div class="article-copy"><p>{{ article.category }} · {{ article.readTime }}</p><h3>{{ article.title }}</h3><span>{{ article.excerpt }}</span><button type="button" aria-label="Article coming soon">Read article <ArrowRight :size="15" /></button></div></article></div></div></section>

    <section class="section downloads-section"><div class="container"><header class="section-heading" data-reveal><p class="eyebrow">Free resources</p><h2>Downloadable tools for your next step</h2></header><div class="downloads-grid"><article data-reveal><Download /><div><h3>Brand Clarity Checklist</h3><p>A quick guide for strengthening your brand foundation.</p></div><span>Coming soon</span></article><article data-reveal><Download /><div><h3>Content Planning Template</h3><p>Turn ideas into a simple, repeatable content rhythm.</p></div><span>Coming soon</span></article><article data-reveal><Download /><div><h3>Learning Resource Planner</h3><p>Organize objectives, activities, and learner outcomes.</p></div><span>Coming soon</span></article></div><RouterLink to="/publications" class="resource-publication-link" data-reveal><BookOpen :size="25" /><span><strong>Looking for Edyn books?</strong> Explore The Healthy You and upcoming publications.</span><ArrowRight :size="19" /></RouterLink></div></section>

    <section class="section resource-newsletter"><div class="container newsletter-card" data-reveal><Mail :size="35" /><div><h2>Useful ideas, delivered thoughtfully.</h2><p>Get new insights, learning resources, and practical tools from Edyn Digital Hub.</p></div><form v-if="!subscribed" @submit.prevent="subscribe"><input v-model.trim="subscriber.name" type="text" aria-label="Full name" placeholder="Your full name" minlength="2" required /><input v-model.trim="subscriber.email" type="email" aria-label="Email address" placeholder="Your email address" required /><button class="button button-yellow" :disabled="subscribing">{{ subscribing ? 'Subscribing…' : 'Subscribe' }}</button><small v-if="subscribeError">{{ subscribeError }}</small></form><strong v-else>Thank you—you're on the list.</strong></div></section>
    <CallToAction title="Need insight tailored to your business?" text="Book a conversation and let's turn your challenge into a practical strategy." />
  </div>
</template>
