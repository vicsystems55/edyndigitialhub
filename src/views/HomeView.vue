<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Check, Play, Sparkles } from '@lucide/vue'
import { process, projects, services } from '../data/siteData'
import WaveDivider from '../components/common/WaveDivider.vue'
import ceoImage from '../assets/images/ceo.png'
import BookCover from '../components/common/BookCover.vue'

gsap.registerPlugin(ScrollTrigger)
const root = ref(null)
let context

onMounted(async () => {
  await nextTick()
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return
  context = gsap.context(() => {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-copy > *', { y: 34, opacity: 0, duration: 0.75, stagger: 0.1 })
      .from('.hero-visual', { x: 45, opacity: 0, duration: 0.9 }, '-=0.65')
      .from('.floating-stat', { scale: 0.75, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.45')

    gsap.utils.toArray('[data-reveal]').forEach((element) => {
      gsap.from(element, {
        y: 40, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      })
    })
    gsap.to('.parallax-orb', {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    })
  }, root.value)
})

onBeforeUnmount(() => context?.revert())
</script>

<template>
  <div ref="root">
    <section class="hero">
      <div class="hero-grid container">
        <div class="hero-copy">
          <p class="eyebrow">Welcome to Edyn Digital Hub</p>
          <h1>Building Brands.<br />Empowering Growth.<br /><span>Creating Digital Impact.</span></h1>
          <p class="hero-lead">We help businesses, educators, and entrepreneurs build powerful brands, grow their online presence, and create measurable impact through creative, strategic, and digital solutions.</p>
          <div class="hero-buttons">
            <RouterLink to="/services" class="button button-green">Explore Our Services <ArrowRight :size="18" /></RouterLink>
            <RouterLink to="/portfolio" class="button button-outline"><span class="play"><Play :size="13" fill="currentColor" /></span> View Our Work</RouterLink>
          </div>
          <div class="trust-line"><span class="avatar-stack"><i>PE</i><i>EA</i><i>DO</i></span><strong>Creative partners for growing brands</strong></div>
        </div>
        <div class="hero-visual" aria-label="Edyn Digital Hub creative workspace illustration">
          <div class="parallax-orb"></div>
          <div class="spark spark-one"><Sparkles /></div><div class="spark spark-two"><Sparkles /></div>
          <div class="hero-portrait-frame"><img :src="ceoImage" alt="Princess Oluwatoyin Emmanuel, Founder and Creative Director of Edyn Digital Hub" fetchpriority="high" /></div>
          <div class="floating-stat stat-one"><span>50+</span><small>Projects delivered</small></div>
          <div class="floating-stat stat-two"><span>3+</span><small>Years experience</small></div>
          <div class="floating-stat stat-three"><span>20+</span><small>Industries served</small></div>
        </div>
      </div>
    </section>

    <section class="section services-section">
      <WaveDivider position="top" color="var(--surface)" accent="var(--yellow)" :height="78" flip />
      <div class="container">
        <header class="section-heading" data-reveal><p class="eyebrow">What we do</p><h2>Creative Solutions That Drive Growth</h2><p>From branding to digital marketing, design to education, we deliver purposeful solutions tailored to your goals.</p></header>
        <div class="services-grid">
          <article v-for="(service, index) in services" :key="service.title" class="service-card" data-reveal>
            <div class="icon-box" :class="{ yellow: index % 2 }"><component :is="service.icon" :size="25" /></div>
            <h3>{{ service.title }}</h3><p>{{ service.text }}</p>
            <RouterLink to="/services" :aria-label="`Learn more about ${service.title}`">Learn more <ArrowRight :size="16" /></RouterLink>
          </article>
        </div>
      </div>
    </section>

    <section class="section portfolio-section">
      <div class="container">
        <header class="section-heading" data-reveal><p class="eyebrow">Our portfolio</p><h2>Featured Projects</h2><p>A selection of work across branding, digital marketing, design, websites, and education.</p></header>
        <div class="project-grid">
          <RouterLink v-for="project in projects.slice(0, 4)" :key="project.title" :to="`/portfolio/${project.slug}`" class="project-card" data-reveal>
            <div class="project-art" :class="project.className"><span class="project-monogram">E</span><span class="project-lines"></span></div>
            <div class="project-info"><div><h3>{{ project.title }}</h3><p>{{ project.category }}</p></div><span class="round-arrow"><ArrowRight :size="17" /></span></div>
          </RouterLink>
        </div>
        <div class="center-action" data-reveal><RouterLink to="/portfolio" class="button button-outline">View Full Portfolio <ArrowRight :size="18" /></RouterLink></div>
      </div>
    </section>

    <section class="section home-publication">
      <div class="container home-publication-card" data-reveal>
        <div class="home-book-cover"><BookCover compact /></div>
        <div><p class="eyebrow">Featured publication</p><h2>The Health You</h2><p>A founder-authored publication from Princess Oluwatoyin Emmanuel. Discover the book and follow upcoming titles from Edyn Books & Publications.</p><RouterLink to="/publications/the-health-you" class="button button-yellow">Discover the Book <ArrowRight :size="18" /></RouterLink></div>
      </div>
    </section>

    <section class="section process-section curved-top">
      <div class="container">
        <header class="section-heading" data-reveal><p class="eyebrow">Our process</p><h2>How We Work</h2><p>A simple, proven process that keeps every project strategic, creative, and results-driven.</p></header>
        <div class="process-grid">
          <article v-for="(step, index) in process" :key="step.title" class="process-card" data-reveal>
            <div class="process-icon" :class="{ yellow: index % 2 }"><component :is="step.icon" :size="25" /></div>
            <span>{{ step.number }}</span><h3>{{ step.title }}</h3><p>{{ step.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="why-section">
      <WaveDivider position="top" color="var(--background)" accent="var(--lime)" :height="76" />
      <div class="container" data-reveal>
        <p class="eyebrow light">Why partner with us</p><h2>Strategy meets creativity—and creates momentum.</h2>
        <div class="benefits"><span><Check /> Strategic thinking</span><span><Check /> Creative excellence</span><span><Check /> User-centered</span><span><Check /> Growth focused</span></div>
      </div>
      <WaveDivider color="var(--surface)" accent="var(--yellow)" :height="76" flip />
    </section>

    <section class="section final-cta">
      <div class="container cta-card" data-reveal>
        <div><p class="eyebrow">Your digital partner</p><h2>Let's Build Something<br /><span>Great Together.</span></h2><p>Whether you are launching a new business, strengthening your brand, or creating educational resources, we are ready to help.</p></div>
        <RouterLink to="/contact" class="button button-green">Let's Work Together <ArrowRight :size="18" /></RouterLink>
      </div>
    </section>
  </div>
</template>
