<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from '@lucide/vue'
import BrandLogo from '../../components/common/BrandLogo.vue'
import ThemeToggle from '../../components/common/ThemeToggle.vue'
import { useAdminAuth } from '../../composables/useAdminAuth'

const route = useRoute()
const router = useRouter()
const { signIn } = useAdminAuth()
const form = reactive({ email: '', password: '', remember: true })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const demoMode = computed(() => import.meta.env.DEV && import.meta.env.VITE_ADMIN_DEMO_MODE === 'true')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await signIn(form)
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/admin')
      ? route.query.redirect
      : '/admin'
    await router.replace(redirect)
  } catch (err) {
    error.value = err.message || 'Unable to sign in.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="admin-login-page">
    <div class="login-brand-bar">
      <BrandLogo />
      <ThemeToggle />
    </div>

    <section class="login-panel">
      <div class="login-card">
        <div class="login-icon"><LockKeyhole :size="25" /></div>
        <p class="eyebrow">Secure workspace</p>
        <h1>Welcome back</h1>
        <p class="login-lead">Sign in to manage Edyn Digital Hub’s content, sales and audience activity.</p>

        <div v-if="demoMode" class="demo-notice">
          Development preview is active. Use any valid email and a password with at least 6 characters.
        </div>

        <form @submit.prevent="submit">
          <label>
            <span>Email address</span>
            <div class="login-input"><Mail :size="18" /><input v-model.trim="form.email" type="email" autocomplete="email" placeholder="admin@edyndigitalhub.com" required /></div>
          </label>
          <label>
            <span>Password</span>
            <div class="login-input"><LockKeyhole :size="18" /><input v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Enter your password" minlength="6" required /><button type="button" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" :size="17" /><Eye v-else :size="17" /></button></div>
          </label>
          <div class="login-options"><label><input v-model="form.remember" type="checkbox" /> Keep me signed in</label><button type="button">Forgot password?</button></div>
          <p v-if="error" class="login-error">{{ error }}</p>
          <button class="login-submit" type="submit" :disabled="loading">{{ loading ? 'Signing in…' : 'Sign in to dashboard' }} <ArrowRight v-if="!loading" :size="18" /></button>
        </form>
        <RouterLink to="/" class="back-to-site">← Return to website</RouterLink>
      </div>
    </section>
    <aside class="login-story">
      <div class="login-story-content">
        <span>EDYN DIGITAL HUB</span>
        <blockquote>“Building brands. Empowering growth. Creating digital impact.”</blockquote>
        <p>Your central workspace for purposeful digital growth.</p>
      </div>
      <div class="login-orb login-orb-one" /><div class="login-orb login-orb-two" />
    </aside>
  </div>
</template>

<style scoped>
.admin-login-page { background: var(--background); display: grid; grid-template-columns: 1.05fr .95fr; min-height: 100vh; position: relative; }
.login-brand-bar { align-items: center; display: flex; justify-content: space-between; left: 0; padding: 28px 42px; position: absolute; right: 50%; top: 0; z-index: 3; }
.login-panel { align-items: center; display: flex; justify-content: center; padding: 125px 35px 55px; }
.login-card { max-width: 455px; width: 100%; }
.login-icon { align-items: center; background: color-mix(in srgb, var(--green) 12%, var(--card)); border-radius: 14px; color: var(--green); display: flex; height: 52px; justify-content: center; margin-bottom: 23px; width: 52px; }
.login-card h1 { font: 800 clamp(2.3rem, 5vw, 3.5rem)/1 'Manrope'; letter-spacing: -.05em; margin: 9px 0 14px; }
.login-lead { color: var(--muted); line-height: 1.65; margin: 0 0 28px; }
.demo-notice { background: color-mix(in srgb, var(--yellow) 18%, var(--card)); border: 1px solid color-mix(in srgb, var(--yellow) 45%, var(--border)); border-radius: 10px; color: var(--text-soft); font-size: .72rem; line-height: 1.5; margin-bottom: 20px; padding: 11px 13px; }
.login-card form > label { display: block; margin-bottom: 18px; }.login-card label > span { display: block; font-size: .76rem; font-weight: 700; margin-bottom: 8px; }
.login-input { align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 11px; color: var(--muted); display: flex; min-height: 50px; padding: 0 14px; transition: .2s; }
.login-input:focus-within { border-color: var(--fresh-green); box-shadow: 0 0 0 3px rgba(63,174,42,.1); }
.login-input input { background: transparent; border: 0; color: var(--text); flex: 1; min-width: 0; outline: 0; padding: 0 11px; }.login-input button { background: transparent; border: 0; color: var(--muted); cursor: pointer; display: flex; padding: 5px; }
.login-options { align-items: center; display: flex; font-size: .72rem; justify-content: space-between; margin: 4px 0 22px; }.login-options label { align-items: center; display: flex; gap: 7px; }.login-options input { accent-color: var(--green); }.login-options button { background: transparent; border: 0; color: var(--green); cursor: pointer; font-size: inherit; font-weight: 700; }
.login-error { background: #fff0f0; border-radius: 8px; color: #b42318; font-size: .76rem; padding: 10px 12px; }
.login-submit { align-items: center; background: linear-gradient(135deg, var(--green), var(--green-dark)); border: 0; border-radius: 11px; color: white; cursor: pointer; display: flex; font-weight: 700; gap: 9px; justify-content: center; min-height: 51px; width: 100%; }.login-submit:disabled { cursor: wait; opacity: .7; }
.back-to-site { color: var(--muted); display: block; font-size: .75rem; margin-top: 24px; text-align: center; }
.login-story { align-items: flex-end; background: linear-gradient(145deg, var(--deep-green), var(--green)); color: white; display: flex; margin: 14px; overflow: hidden; padding: 70px; position: relative; border-radius: 26px; }
.login-story::before { background-image: radial-gradient(rgba(255,196,0,.5) 1.2px, transparent 1.2px); background-size: 24px 24px; content: ''; inset: 0; opacity: .2; position: absolute; }
.login-story-content { max-width: 530px; position: relative; z-index: 2; }.login-story-content > span { color: var(--yellow); font-size: .68rem; font-weight: 800; letter-spacing: .17em; }.login-story blockquote { font: 800 clamp(2.4rem, 4.3vw, 4.6rem)/1.08 'Manrope'; letter-spacing: -.055em; margin: 18px 0 23px; }.login-story p { color: #d3e5d6; }
.login-orb { background: var(--yellow); border-radius: 45% 55% 65% 35%; opacity: .16; position: absolute; }.login-orb-one { height: 390px; right: -150px; top: -110px; transform: rotate(20deg); width: 390px; }.login-orb-two { bottom: 20%; height: 160px; left: -80px; width: 160px; }
@media (max-width: 900px) { .admin-login-page { grid-template-columns: 1fr; }.login-story { display: none; }.login-brand-bar { padding: 22px 25px; right: 0; }.login-panel { padding-inline: 24px; } }
</style>
