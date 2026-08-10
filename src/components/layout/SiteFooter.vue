<script setup>
import { ArrowRight } from '@lucide/vue'
import BrandLogo from '../common/BrandLogo.vue'
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
      <div class="newsletter"><h3>Stay Updated</h3><p>Subscribe for useful ideas, resources, and updates.</p><form @submit.prevent><input type="email" aria-label="Email address" placeholder="Enter your email" required /><button aria-label="Subscribe"><ArrowRight :size="17" /></button></form></div>
    </div>
    <div class="container footer-bottom"><span>© {{ new Date().getFullYear() }} Edyn Digital Hub. All rights reserved.</span><span><a href="#">Privacy Policy</a> · <a href="#">Terms & Conditions</a></span></div>
  </footer>
</template>
