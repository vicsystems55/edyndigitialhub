<script setup>
import { ref } from 'vue'
import { ArrowRight, BookOpen, Handshake, Lightbulb, ShieldCheck, Sparkles, TrendingUp, Trophy } from '@lucide/vue'
import PageHero from '../components/common/PageHero.vue'
import CallToAction from '../components/common/CallToAction.vue'
import { usePageAnimations } from '../composables/usePageAnimations'
import ceoImage from '../assets/images/ceo.png'

const root = ref(null)
usePageAnimations(root)

const values = [
  { title: 'Innovation', text: 'We combine creativity and technology to solve real-world challenges.', icon: Lightbulb },
  { title: 'Excellence', text: 'We bring professionalism, quality, and care to every detail.', icon: Trophy },
  { title: 'Integrity', text: 'We build trust through honest communication and reliable delivery.', icon: ShieldCheck },
  { title: 'Creativity', text: 'We shape original ideas and experiences that help brands stand out.', icon: Sparkles },
  { title: 'Growth', text: 'We focus on meaningful progress that can continue long after delivery.', icon: TrendingUp },
  { title: 'Learning', text: 'We believe knowledge helps people adapt, innovate, and succeed.', icon: BookOpen },
  { title: 'Partnership', text: 'We work alongside our clients with shared purpose and respect.', icon: Handshake },
]
</script>

<template>
  <div ref="root">
    <PageHero eyebrow="About Edyn" title="Creativity with purpose." accent="Growth by design." description="Edyn Digital Hub is a digital-first creative agency and educational technology brand helping businesses, educators, and entrepreneurs build a lasting digital presence." primary-label="Meet Our Services" primary-to="/services" />

    <section class="section story-section">
      <div class="container split-layout">
        <div data-reveal><p class="eyebrow">Our story</p><h2>More than a creative service. A trusted digital partner.</h2></div>
        <div class="prose" data-reveal><p>Founded by <strong>Princess Oluwatoyin Emmanuel</strong>, Edyn Digital Hub brings creativity, strategy, technology, and education together to turn ambitious ideas into useful solutions.</p><p>We believe every business deserves more than attractive design. It deserves a partner who understands the vision, asks thoughtful questions, and builds work that supports real goals.</p><p>From new brands and websites to educational resources and digital growth systems, our work is grounded in clarity, collaboration, and lasting value.</p></div>
      </div>
    </section>

    <section class="section vision-section">
      <div class="container vision-grid">
        <article data-reveal><span>01</span><p class="eyebrow">Our vision</p><h3>A leading African digital solutions and educational brand.</h3><p>We envision a future where businesses, educators, entrepreneurs, and learners can access creative digital tools that unlock growth and opportunity.</p></article>
        <article data-reveal><span>02</span><p class="eyebrow">Our mission</p><h3>Empower people through practical, scalable solutions.</h3><p>We deliver brand, content, design, education, and digital support that helps our clients communicate clearly, transform confidently, and grow sustainably.</p></article>
      </div>
    </section>

    <section class="section values-section">
      <div class="container">
        <header class="section-heading" data-reveal><p class="eyebrow">What guides us</p><h2>Our Core Values</h2><p>The principles behind every decision, relationship, and deliverable.</p></header>
        <div class="values-grid"><article v-for="value in values" :key="value.title" data-reveal><div class="icon-box"><component :is="value.icon" :size="23" /></div><h3>{{ value.title }}</h3><p>{{ value.text }}</p></article></div>
      </div>
    </section>

    <section class="section founder-section">
      <div class="container founder-grid">
        <div class="founder-visual" data-reveal><img :src="ceoImage" alt="Princess Oluwatoyin Emmanuel, Founder and Creative Director of Edyn Digital Hub" loading="lazy" /><span>Founder & Creative Director</span></div>
        <div data-reveal><p class="eyebrow">Meet the founder</p><h2>Princess Oluwatoyin Emmanuel</h2><p>Princess is a multidisciplinary digital professional, educational product developer, and author specializing in social media management, brand strategy, graphic design, UI/UX, and business consulting.</p><p>She founded Edyn Digital Hub to bridge creativity, education, and technology—helping people create meaningful digital experiences that strengthen brands and foster long-term success.</p><div class="founder-tags"><span>Strategic</span><span>Creative</span><span>Educational</span><span>Author</span></div><RouterLink to="/publications" class="text-link founder-publication-link">Explore her publications <ArrowRight :size="17" /></RouterLink></div>
      </div>
    </section>

    <CallToAction eyebrow="Why Edyn" title="Thoughtful strategy. Creative excellence. A partner invested in your growth." />
  </div>
</template>
