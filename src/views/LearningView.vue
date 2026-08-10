<script setup>
import { ref } from 'vue'
import { ArrowRight, BookOpen, Brain, Download, GraduationCap, PencilRuler, School, Shapes } from '@lucide/vue'
import PageHero from '../components/common/PageHero.vue'
import CallToAction from '../components/common/CallToAction.vue'
import { usePageAnimations } from '../composables/usePageAnimations'

const root = ref(null)
usePageAnimations(root)

const products = [
  { title: 'Printable Worksheets', text: 'Clear, engaging practice resources designed around meaningful learning goals.', icon: PencilRuler },
  { title: 'Activity Books', text: 'Purposeful activities that make practice enjoyable, structured, and rewarding.', icon: BookOpen },
  { title: 'Curriculum Resources', text: 'Thoughtfully sequenced frameworks that support confident instruction and progress.', icon: GraduationCap },
  { title: 'Teacher Resources', text: 'Practical classroom tools that save preparation time and support effective teaching.', icon: School },
  { title: 'Fine Motor Activities', text: 'Hands-on resources that build coordination, control, and early writing readiness.', icon: Shapes },
  { title: 'Early Learning Systems', text: 'Foundational literacy and numeracy materials for growing young minds.', icon: Brain },
]
</script>

<template>
  <div ref="root" class="learning-page">
    <PageHero eyebrow="Edyn Learning" title="Curious minds." accent="Confident learners." description="A growing collection of thoughtful educational resources for children, teachers, parents, and schools." primary-label="Explore Learning Resources" primary-to="/contact" />

    <section class="section learning-intro"><div class="container split-layout"><div data-reveal><p class="eyebrow">Learning with purpose</p><h2>Educational products where creativity meets curriculum.</h2></div><div class="prose" data-reveal><p>Edyn Learning translates educational goals into clear, engaging resources that children enjoy using and adults feel confident teaching with.</p><p>Our current work focuses on early childhood and primary education, with materials designed to build foundational skills through purposeful practice.</p></div></div></section>

    <section class="section learning-products"><div class="container"><header class="section-heading" data-reveal><p class="eyebrow">What we create</p><h2>Resources for every learning environment</h2><p>Flexible materials for classrooms, home learning, and educational programs.</p></header><div class="learning-grid"><article v-for="product in products" :key="product.title" data-reveal><component :is="product.icon" :size="30" /><h3>{{ product.title }}</h3><p>{{ product.text }}</p><span>In development</span></article></div></div></section>

    <section class="section curriculum-section"><div class="container curriculum-card" data-reveal><div><p class="eyebrow">Curriculum development</p><h2>Structured from the first skill to confident mastery.</h2><p>We develop handwriting, alphabet, number, fine-motor, early-literacy, and teacher-support frameworks with clear progression and practical application.</p><RouterLink to="/contact" class="text-link">Discuss an education project <ArrowRight :size="17" /></RouterLink></div><div class="curriculum-visual"><span>Aa</span><span>123</span><span>ABC</span><span><Download :size="25" /></span></div></div></section>

    <section class="section learning-publications"><div class="container learning-publications-card" data-reveal><BookOpen :size="38" /><div><p class="eyebrow">Edyn Books & Publications</p><h2>Ideas and learning beyond the classroom.</h2><p>Discover <em>The Health You</em> and follow the growing collection of founder-authored and educational publications.</p></div><RouterLink to="/publications" class="button button-yellow">Explore Publications <ArrowRight :size="18" /></RouterLink></div></section>

    <section class="section learning-audience"><div class="container"><header class="section-heading" data-reveal><p class="eyebrow">Created for</p><h2>Supporting the whole learning community</h2></header><div class="audience-row"><span data-reveal>Young learners</span><span data-reveal>Parents</span><span data-reveal>Teachers</span><span data-reveal>Schools</span><span data-reveal>Educational programs</span></div></div></section>
    <CallToAction eyebrow="Build better learning" title="Have an educational product or curriculum idea?" text="Let's transform it into a structured, engaging resource that supports real learning." label="Create With Edyn Learning" />
  </div>
</template>
