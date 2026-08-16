<script setup>
import { reactive, ref } from 'vue'
import { ArrowRight } from '@lucide/vue'
import BrandLogo from '../common/BrandLogo.vue'
import { subscribeToNewsletter } from '../../services/communications'

const newsletter = reactive({ name: '', email: '' })
const subscribing = ref(false)
const subscribed = ref(false)
const subscribeError = ref('')

async function subscribe() {
  subscribing.value = true
  subscribeError.value = ''
  try {
    await subscribeToNewsletter({ ...newsletter, source: 'footer' })
    subscribed.value = true
  } catch (error) {
    subscribeError.value = error.message || 'Unable to subscribe right now.'
  } finally {
    subscribing.value = false
  }
}
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <BrandLogo />
        <p>Building brands. Empowering growth. Creating digital impact.</p>
        <div class="socials">
          <a href="#" aria-label="Instagram">IG</a>
          <a href="#" aria-label="LinkedIn">in</a>
          <a href="#" aria-label="YouTube">YT</a>
        </div>
      </div>
      <div><h3>Quick Links</h3><RouterLink to="/about">About Us</RouterLink><RouterLink to="/services">Services</RouterLink><RouterLink to="/portfolio">Portfolio</RouterLink><RouterLink to="/edyn-learning">Edyn Learning</RouterLink><RouterLink to="/contact">Contact</RouterLink></div>
      <div><h3>Our Services</h3><a href="#">Social Media</a><a href="#">Brand Strategy</a><a href="#">UI/UX Design</a><a href="#">Web Solutions</a></div>
      <div><h3>Resources</h3><RouterLink to="/resources">Articles</RouterLink><RouterLink to="/publications">Books & Publications</RouterLink><RouterLink to="/portfolio">Case Studies</RouterLink><RouterLink to="/resources">Free Resources</RouterLink><RouterLink to="/contact">Enquiries</RouterLink></div>
      <div class="newsletter"><h3>Stay Updated</h3><p>Subscribe for useful ideas, resources, and updates.</p><form v-if="!subscribed" @submit.prevent="subscribe"><input v-model.trim="newsletter.name" type="text" aria-label="Full name" placeholder="Full name" minlength="2" required /><div class="newsletter-email-row"><input v-model.trim="newsletter.email" type="email" aria-label="Email address" placeholder="Enter your email" required /><button :disabled="subscribing" aria-label="Subscribe"><ArrowRight :size="17" /></button></div><small v-if="subscribeError" class="newsletter-error">{{ subscribeError }}</small></form><strong v-else class="newsletter-success">Thank you—you're subscribed.</strong></div>
    </div>
    <div class="container footer-bottom"><span>© {{ new Date().getFullYear() }} Edyn Digital Hub. All rights reserved.</span><span><a href="#">Privacy Policy</a> · <a href="#">Terms & Conditions</a></span></div>
  </footer>
</template>
