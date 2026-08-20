<script setup>
import { computed, onMounted, ref } from 'vue'
import { AlertCircle, ArrowRight, CheckCircle2, LoaderCircle } from '@lucide/vue'
import { useRoute } from 'vue-router'
import { trackMetaPurchaseOnce } from '../services/metaPixel'

const route = useRoute()
const state = ref('loading')
const order = ref(null)
const message = ref('Confirming your payment securely…')
const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const reference = computed(() => route.query.reference || route.query.trxref || '')
const provider = computed(() => route.query.provider === 'paypal' ? 'paypal' : 'paystack')
const paypalOrderId = computed(() => route.query.token || '')
const downloadUrl = computed(() => order.value?.downloadPath ? `${apiUrl}${order.value.downloadPath}` : '')

async function verifyPayment() {
  if (!reference.value) { state.value = 'error'; message.value = 'No payment reference was provided.'; return }
  state.value = 'loading'
  try {
    if (provider.value === 'paypal' && !paypalOrderId.value) throw new Error('No PayPal order reference was provided.')
    const response = provider.value === 'paypal'
      ? await fetch(`${apiUrl}/api/v1/payments/paypal/capture`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reference: reference.value, paypalOrderId: paypalOrderId.value }) })
      : await fetch(`${apiUrl}/api/v1/payments/verify/${encodeURIComponent(reference.value)}`)
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error?.message || 'We could not confirm this payment.')
    order.value = payload.data
    state.value = payload.data.status === 'PAID' ? 'success' : 'pending'
    message.value = state.value === 'success'
      ? (payload.data.downloadPath ? 'Your payment is confirmed. Your secure ebook download is ready.' : 'Your payment has been confirmed successfully.')
      : 'Your payment is still being processed. Please check again shortly.'
    if (state.value === 'success') {
      trackMetaPurchaseOnce(String(payload.data.reference || reference.value), {
        content_ids: [payload.data.book?.slug || 'the-healthy-you'],
        content_name: payload.data.book?.title || 'The Healthy You',
        content_type: 'product',
        value: Number(payload.data.amountMinor || 0) / 100,
        currency: payload.data.currency || 'NGN',
        num_items: 1,
      })
    }
  } catch (error) { state.value = 'error'; message.value = error.message || 'We could not confirm this payment.' }
}

onMounted(verifyPayment)
</script>

<template>
  <section class="payment-result-page">
    <div class="payment-result-card">
      <div class="payment-result-icon" :class="state"><LoaderCircle v-if="state === 'loading'" class="checkout-spinner" :size="34" /><CheckCircle2 v-else-if="state === 'success'" :size="38" /><AlertCircle v-else :size="38" /></div>
      <p class="eyebrow">Payment status</p>
      <h1>{{ state === 'success' ? 'Thank you for your order!' : state === 'loading' ? 'Confirming payment' : state === 'pending' ? 'Payment pending' : 'Unable to confirm payment' }}</h1>
      <p>{{ message }}</p>
      <div v-if="order" class="payment-order-summary"><span>Reference <strong>{{ order.reference }}</strong></span><span>Book <strong>{{ order.book.title }}</strong></span><span>Confirmation email <strong>{{ order.customerEmail }}</strong></span></div>
      <a v-if="state === 'success' && downloadUrl" :href="downloadUrl" class="button button-green">Download your ebook <ArrowRight :size="17" /></a>
      <RouterLink v-else-if="state === 'success'" to="/publications/the-healthy-you" class="button button-green">Return to the book <ArrowRight :size="17" /></RouterLink>
      <button v-else-if="state !== 'loading'" class="button button-green" type="button" @click="verifyPayment">Check again <ArrowRight :size="17" /></button>
      <RouterLink to="/contact" class="payment-help-link">Need help with your order? Contact us</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.payment-result-page { align-items:center; background:radial-gradient(circle at 20% 10%,rgba(255,196,0,.18),transparent 25%),var(--surface); display:flex; justify-content:center; min-height:100vh; padding:120px 20px 70px; }.payment-result-card { background:var(--card); border:1px solid var(--border); border-radius:24px; box-shadow:var(--shadow); max-width:590px; padding:48px; text-align:center; width:100%; }.payment-result-icon { align-items:center; background:color-mix(in srgb,var(--yellow) 18%,var(--card)); border-radius:50%; color:var(--gold); display:flex; height:75px; justify-content:center; margin:0 auto 23px; width:75px; }.payment-result-icon.success { background:color-mix(in srgb,var(--fresh-green) 14%,var(--card)); color:var(--green); }.payment-result-icon.error { background:#fff0f0; color:#b42318; }.payment-result-card h1 { font:800 clamp(2rem,5vw,3.1rem)/1.08 'Manrope'; letter-spacing:-.05em; margin:9px 0 13px; }.payment-result-card>p:not(.eyebrow) { color:var(--muted); line-height:1.7; }.payment-order-summary { background:var(--surface-soft); border-radius:12px; display:grid; gap:10px; margin:25px 0; padding:17px; text-align:left; }.payment-order-summary span { color:var(--muted); display:flex; font-size:.69rem; justify-content:space-between; }.payment-order-summary strong { color:var(--text); margin-left:15px; overflow-wrap:anywhere; }.payment-result-card .button { border:0; cursor:pointer; margin-top:8px; }.payment-help-link { color:var(--muted); display:block; font-size:.69rem; margin-top:22px; text-decoration:underline; }.checkout-spinner { animation:callback-spin .8s linear infinite; }@keyframes callback-spin{to{transform:rotate(360deg)}}@media(max-width:600px){.payment-result-card{padding:36px 22px}.payment-order-summary span{align-items:flex-start;flex-direction:column;gap:3px}.payment-order-summary strong{margin-left:0}}
</style>
