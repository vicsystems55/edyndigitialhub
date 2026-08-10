<script setup>
import { reactive, ref } from 'vue'
import { ArrowRight, CheckCircle2, Clock3, Mail, MessageCircle } from '@lucide/vue'
import PageHero from '../components/common/PageHero.vue'
import { usePageAnimations } from '../composables/usePageAnimations'

const root = ref(null)
const sending = ref(false)
const sent = ref(false)
const error = ref('')
const form = reactive({ name: '', email: '', business: '', service: '', budget: '', message: '' })
usePageAnimations(root)

async function submitForm() {
  sending.value = true
  error.value = ''
  const body = new URLSearchParams({ 'form-name': 'project-enquiry', ...form })
  try {
    const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
    if (!response.ok) throw new Error('Submission failed')
    sent.value = true
  } catch {
    error.value = 'We could not send your enquiry. Please email us directly and we will be happy to help.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div ref="root">
    <PageHero eyebrow="Start a conversation" title="Tell us what you're" accent="ready to build." description="Share your goals, challenges, and ideas. We will listen carefully and help you identify the right next step." />
    <section class="section contact-section"><div class="container contact-grid">
      <aside data-reveal><p class="eyebrow">Let's connect</p><h2>A thoughtful project starts with a clear conversation.</h2><p>Whether you need a new brand, ongoing digital support, a website, or educational resources, tell us where you are and where you want to go.</p><div class="contact-methods"><a href="mailto:hello@edyndigitalhub.com"><Mail /><span><small>Email us</small>hello@edyndigitalhub.com</span></a><div><Clock3 /><span><small>Response time</small>Within 1–2 business days</span></div><div><MessageCircle /><span><small>Project approach</small>Collaborative and tailored</span></div></div></aside>
      <div class="contact-form-card" data-reveal>
        <div v-if="sent" class="form-success"><CheckCircle2 :size="56" /><h2>Thank you for reaching out.</h2><p>Your project enquiry has been received. We will be in touch soon.</p><RouterLink to="/" class="button button-green">Return home <ArrowRight :size="18" /></RouterLink></div>
        <form v-else name="project-enquiry" data-netlify="true" netlify-honeypot="bot-field" @submit.prevent="submitForm">
          <input type="hidden" name="form-name" value="project-enquiry" /><p class="hidden-field"><label>Do not fill this out: <input name="bot-field" /></label></p>
          <div class="form-row"><label>Full name<input v-model="form.name" name="name" type="text" placeholder="Your name" required /></label><label>Email address<input v-model="form.email" name="email" type="email" placeholder="you@example.com" required /></label></div>
          <div class="form-row"><label>Business or organization<input v-model="form.business" name="business" type="text" placeholder="Optional" /></label><label>Service needed<select v-model="form.service" name="service" required><option value="" disabled>Select a service</option><option>Social Media Management</option><option>Branding & Brand Strategy</option><option>Graphic Design</option><option>UI/UX Design</option><option>Website Solutions</option><option>Digital Marketing</option><option>Educational Product Development</option><option>Business & Digital Consulting</option></select></label></div>
          <label>Estimated budget<select v-model="form.budget" name="budget"><option value="">Prefer not to say</option><option>Under ₦250,000</option><option>₦250,000–₦500,000</option><option>₦500,000–₦1,000,000</option><option>Above ₦1,000,000</option></select></label>
          <label>Tell us about your project<textarea v-model="form.message" name="message" rows="6" placeholder="What are you hoping to achieve?" required></textarea></label>
          <p v-if="error" class="form-error">{{ error }}</p><button class="button button-green submit-button" :disabled="sending">{{ sending ? 'Sending…' : 'Start My Project' }} <ArrowRight v-if="!sending" :size="18" /></button>
        </form>
      </div>
    </div></section>
    <section class="section contact-note"><div class="container"><p class="eyebrow">Our promise</p><h2>We listen carefully, communicate clearly, and build with your long-term success in mind.</h2></div></section>
  </div>
</template>
