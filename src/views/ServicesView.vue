<script setup>
import { ref } from 'vue'
import { ArrowRight, Check } from '@lucide/vue'
import PageHero from '../components/common/PageHero.vue'
import CallToAction from '../components/common/CallToAction.vue'
import { services } from '../data/siteData'
import { usePageAnimations } from '../composables/usePageAnimations'

const root = ref(null)
usePageAnimations(root)

const details = [
  ['Social Media Management', 'Build a consistent, valuable presence with strategy-led content and thoughtful community support.', ['Social media strategy', 'Content calendars', 'Content creation', 'Caption writing', 'Community management', 'Performance reporting']],
  ['Branding & Brand Strategy', 'Create a distinctive brand foundation that communicates who you are and why you matter.', ['Brand positioning', 'Brand messaging', 'Visual identity', 'Identity systems', 'Brand guidelines', 'Brand audits']],
  ['Graphic Design', 'Turn ideas and information into polished visual communication that earns attention and trust.', ['Marketing materials', 'Social graphics', 'Pitch decks', 'Company profiles', 'Presentations', 'Digital flyers']],
  ['UI/UX Design', 'Shape intuitive digital experiences around real user goals, needs, and journeys.', ['User research', 'Wireframes', 'Landing pages', 'Mobile interfaces', 'Website interfaces', 'Design systems']],
  ['Website Solutions', 'Launch a responsive, purposeful website that positions your brand and guides visitors to action.', ['Website planning', 'Business websites', 'Portfolio websites', 'Landing pages', 'User journeys', 'Responsive implementation']],
  ['Digital Marketing', 'Connect content, campaigns, and audience insights with a clear plan for visibility and growth.', ['Digital strategy', 'Content marketing', 'Campaign planning', 'Audience growth', 'Marketing consultation', 'Performance direction']],
  ['Educational Product Development', 'Create engaging, curriculum-aligned resources for learners, teachers, parents, and schools.', ['Worksheets', 'Activity books', 'Curriculum planning', 'Fine-motor resources', 'Teacher materials', 'Learning templates']],
  ['Business & Digital Consulting', 'Clarify your next move and build practical systems that support sustainable business growth.', ['Digital audits', 'Growth planning', 'Content systems', 'Brand support', 'Process design', 'Strategic consultation']],
]
</script>

<template>
  <div ref="root">
    <PageHero eyebrow="Our services" title="Creative solutions." accent="Real results." description="From branding and digital marketing to websites and education, we deliver end-to-end solutions designed around your goals." primary-label="Start a Project" />

    <section class="section service-index">
      <div class="container">
        <header class="section-heading" data-reveal><p class="eyebrow">Explore our expertise</p><h2>Everything your next stage needs</h2><p>Choose a focused service or combine capabilities into a tailored solution.</p></header>
        <nav class="service-jump-grid" aria-label="Service sections"><a v-for="(service, index) in services" :key="service.title" :href="`#service-${index + 1}`" data-reveal><component :is="service.icon" :size="21" /><span>{{ service.title }}</span><ArrowRight :size="16" /></a></nav>
      </div>
    </section>

    <section class="service-details">
      <article v-for="(service, index) in details" :id="`service-${index + 1}`" :key="service[0]" class="service-detail section">
        <div class="container service-detail-grid">
          <div class="service-number" data-reveal><span>{{ String(index + 1).padStart(2, '0') }}</span><component :is="services[index].icon" :size="48" /></div>
          <div data-reveal><p class="eyebrow">Service {{ String(index + 1).padStart(2, '0') }}</p><h2>{{ service[0] }}</h2><p class="service-intro">{{ service[1] }}</p><ul class="deliverable-list"><li v-for="item in service[2]" :key="item"><Check :size="17" /> {{ item }}</li></ul><RouterLink to="/contact" class="text-link">Discuss this service <ArrowRight :size="17" /></RouterLink></div>
        </div>
      </article>
    </section>

    <CallToAction title="Not sure which service fits? Let's shape the right solution together." text="Share your goals and challenges. We will recommend a practical path forward without overcomplicating the process." />
  </div>
</template>
