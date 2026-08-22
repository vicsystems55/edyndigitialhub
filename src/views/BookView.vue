<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, CheckCircle2, CreditCard, HeartPulse, Lightbulb, LoaderCircle, LockKeyhole, Quote, ShieldCheck, Sparkles, Star, Target } from '@lucide/vue'
import BookCover from '../components/common/BookCover.vue'
import { usePageAnimations } from '../composables/usePageAnimations'
import ceoImage from '../assets/images/ceo.png'
import reviews from '../data/bookReviews.json'
import { trackMetaEvent } from '../services/metaPixel'

const root = ref(null)
const loadingBook = ref(true)
const checkoutLoading = ref(false)
const checkoutError = ref('')
const book = ref(null)
const paymentProvider = ref('paystack')
const buyer = reactive({ customerName: '', customerEmail: '' })
const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

usePageAnimations(root)

const formattedPrice = computed(() => {
  if (!book.value?.priceMinor) return 'Price being updated'
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: book.value.currency || 'NGN',
    maximumFractionDigits: 0,
  }).format(book.value.priceMinor / 100)
})
const selectedPayment = computed(() => {
  if (!book.value) return null
  const provider = book.value.paymentProviders?.[paymentProvider.value] || {}
  const priceMinor = paymentProvider.value === 'paystack'
    ? provider.priceMinor ?? book.value.priceMinor
    : provider.priceMinor ?? book.value.paypalPriceMinor
  return {
    ...provider,
    enabled: Boolean(priceMinor && book.value.canPurchase && provider.enabled !== false),
    priceMinor,
    currency: provider.currency || (paymentProvider.value === 'paypal' ? 'USD' : book.value.currency || 'NGN'),
  }
})
const checkoutPrice = computed(() => {
  const payment = selectedPayment.value
  if (!payment?.priceMinor) return formattedPrice.value
  return new Intl.NumberFormat(payment.currency === 'USD' ? 'en-US' : 'en-NG', { style: 'currency', currency: payment.currency, maximumFractionDigits: payment.currency === 'USD' ? 2 : 0 }).format(payment.priceMinor / 100)
})
function providerPrice(providerName) {
  const provider = book.value?.paymentProviders?.[providerName] || {}
  const priceMinor = providerName === 'paystack'
    ? provider.priceMinor ?? book.value?.priceMinor
    : provider.priceMinor ?? book.value?.paypalPriceMinor
  if (!priceMinor) return 'Unavailable'
  const currency = provider.currency || (providerName === 'paypal' ? 'USD' : book.value?.currency || 'NGN')
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(priceMinor / 100)
}
const canPurchase = computed(() => Boolean(book.value?.canPurchase && selectedPayment.value?.enabled))
const checkoutButtonLabel = computed(() => {
  if (checkoutLoading.value) return 'Opening secure checkout…'
  if (!selectedPayment.value?.priceMinor) return 'Set the selected payment price in admin'
  if (!book.value?.downloadsEnabled) return 'Ebook delivery is not ready'
  if (!book.value?.purchasesEnabled) return 'Enable purchases in admin'
  if (!selectedPayment.value?.enabled) return `${paymentProvider.value === 'paypal' ? 'PayPal' : 'Paystack'} is not available`
  return `Buy securely with ${paymentProvider.value === 'paypal' ? 'PayPal' : 'Paystack'} — ${checkoutPrice.value}`
})

async function loadBook() {
  try {
    const response = await fetch(`${apiUrl}/api/v1/publications/the-healthy-you`)
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error?.message || 'Unable to load purchasing details.')
    book.value = payload.data
    const viewPayment = payload.data.paymentProviders?.paystack
    const viewPriceMinor = viewPayment?.priceMinor ?? payload.data.priceMinor
    trackMetaEvent('ViewContent', {
      content_ids: ['the-healthy-you'],
      content_name: payload.data.title || 'The Healthy You',
      content_type: 'product',
      value: viewPriceMinor ? viewPriceMinor / 100 : undefined,
      currency: viewPayment?.currency || 'NGN',
    })
  } catch (error) {
    checkoutError.value = error.message || 'Unable to reach the store. Please try again shortly.'
  } finally {
    loadingBook.value = false
  }
}

async function beginCheckout() {
  checkoutError.value = ''
  checkoutLoading.value = true
  try {
    const response = await fetch(`${apiUrl}/api/v1/payments/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookSlug: 'the-healthy-you', paymentProvider: paymentProvider.value, ...buyer }),
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error?.message || 'Checkout could not be started.')
    if (!payload.data?.authorizationUrl) throw new Error('The payment provider did not return a checkout link.')
    trackMetaEvent('InitiateCheckout', {
      content_ids: ['the-healthy-you'],
      content_name: book.value?.title || 'The Healthy You',
      content_type: 'product',
      value: selectedPayment.value?.priceMinor ? selectedPayment.value.priceMinor / 100 : undefined,
      currency: selectedPayment.value?.currency || 'NGN',
      num_items: 1,
    })
    await new Promise((resolve) => window.setTimeout(resolve, 150))
    window.location.assign(payload.data.authorizationUrl)
  } catch (error) {
    checkoutError.value = error.message || 'Checkout could not be started. Please try again.'
    checkoutLoading.value = false
  }
}

onMounted(loadBook)
</script>

<template>
  <div ref="root" class="book-page book-sales-page">
    <section class="book-sales-hero">
      <div class="container book-sales-grid">
        <div class="book-sales-visual" data-page-hero>
          <RouterLink to="/publications" class="back-link"><ArrowLeft :size="17" /> Edyn Library</RouterLink>
          <div class="sales-cover-wrap"><div class="sales-cover-orbit" /><BookCover /></div>
          <div class="sales-trust-row"><span><ShieldCheck :size="16" /> Secure payment</span><span><BadgeCheck :size="16" /> Author-approved edition</span></div>
        </div>

        <div class="book-sales-copy" data-page-hero>
          <p class="eyebrow">Your healthier life starts here</p>
          <div class="book-available-badge"><span /> Now available</div>
          <h1>Get your copy of <em>The Healthy You</em> today.</h1>
          <p class="book-sales-subtitle">Simple, realistic guidance for healthier habits, greater confidence, and lasting progress.</p>
          <ul class="hero-book-benefits"><li><CheckCircle2 /> Simple steps you can use every day</li><li><CheckCircle2 /> Sustainable habits—not quick fixes</li><li><CheckCircle2 /> Instant ebook access after payment</li></ul>

          <div id="buy-book" class="book-checkout-card">
            <div class="checkout-heading"><div><span>Get your copy now</span><strong v-if="!loadingBook">{{ checkoutPrice }}</strong><strong v-else class="price-loading">Loading price…</strong></div><CreditCard :size="27" /></div>
            <div class="payment-options" aria-label="Choose a payment method">
              <button type="button" class="payment-method" :class="{ selected: paymentProvider === 'paystack' }" :disabled="!book?.priceMinor" @click="paymentProvider = 'paystack'">
                <span class="payment-method-mark paystack-mark" aria-hidden="true"><svg viewBox="0 0 36 36"><rect x="5" y="6" width="26" height="5" rx="2"/><rect x="5" y="13" width="26" height="5" rx="2"/><rect x="5" y="20" width="19" height="5" rx="2"/><rect x="5" y="27" width="11" height="4" rx="2"/></svg></span><div><strong>For Nigerian payments</strong><small>Paystack · Card, bank transfer and supported local methods</small></div><span class="payment-active"><i /> {{ providerPrice('paystack') }} NGN</span>
              </button>
              <button v-if="book?.paymentProviders?.paypal?.enabled" type="button" class="payment-method paypal" :class="{ selected: paymentProvider === 'paypal' }" @click="paymentProvider = 'paypal'">
                <span class="payment-method-mark paypal-mark" aria-hidden="true"><span>Pay</span><b>Pal</b></span><div><strong>For international payments</strong><small>PayPal · Pay securely in US dollars</small></div><span class="payment-active"><i /> {{ providerPrice('paypal') }} USD</span>
              </button>
            </div>
            <form @submit.prevent="beginCheckout">
              <label><span>Your name</span><input v-model.trim="buyer.customerName" type="text" autocomplete="name" placeholder="Enter your full name" minlength="2" required /></label>
              <label><span>Email address</span><input v-model.trim="buyer.customerEmail" type="email" autocomplete="email" placeholder="you@example.com" required /></label>
              <button class="checkout-button" type="submit" :disabled="loadingBook || checkoutLoading || !canPurchase"><LoaderCircle v-if="checkoutLoading" class="checkout-spinner" :size="18" /><LockKeyhole v-else :size="17" />{{ checkoutButtonLabel }}<ArrowRight v-if="canPurchase && !checkoutLoading" :size="18" /></button>
            </form>
            <div class="accepted-payments" aria-label="Accepted secure payment methods">
              <span>Secure payments accepted</span>
              <div class="payment-brand-row">
                <span class="card-brand visa" aria-label="Visa">VISA</span>
                <span class="card-brand mastercard" aria-label="Mastercard"><i /><b /></span>
                <span class="card-brand verve" aria-label="Verve">Verve</span>
                <span class="card-brand transfer" aria-label="Bank transfer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18L12 3 3 9Zm2 2v7m4-7v7m6-7v7m4-7v7M3 21h18"/></svg><small>Transfer</small></span>
                <span v-if="book?.paymentProviders?.paypal?.enabled" class="card-brand paypal-wordmark" aria-label="PayPal"><i>Pay</i><b>Pal</b></span>
              </div>
            </div>
            <p v-if="checkoutError" class="checkout-error">{{ checkoutError }}</p>
            <div class="checkout-assurance"><ShieldCheck :size="15" /><span>Payment is securely processed by {{ paymentProvider === 'paypal' ? 'PayPal' : 'Paystack' }}. Your payment details never pass through our website.</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section book-reader-section"><div class="container"><header class="section-heading" data-reveal><p class="eyebrow">Is this book for you?</p><h2>A thoughtful companion for your wellbeing journey</h2><p>Created for readers who are ready to make intentional choices, understand themselves better, and build a healthier relationship with everyday living.</p></header><div class="reader-cards"><article data-reveal><HeartPulse /><h3>You want healthier habits</h3><p>You are looking for practical encouragement that helps positive choices feel realistic and sustainable.</p></article><article data-reveal><Target /><h3>You need a clearer path</h3><p>You want to move beyond quick fixes and approach your goals with purpose, patience, and direction.</p></article><article data-reveal><Sparkles /><h3>You are ready for change</h3><p>You believe a more confident and empowered version of yourself is possible—and you are ready to begin.</p></article></div></div></section>

    <section class="section book-reviews-section">
      <div class="container"><header class="section-heading" data-reveal><p class="eyebrow">Reader experiences</p><h2>What readers are saying</h2><p>Honest reflections from readers taking practical steps towards healthier, more intentional living.</p></header></div>
      <div class="reviews-marquee" aria-label="Reader reviews">
        <div class="reviews-marquee-track">
          <div v-for="group in 2" :key="group" class="reviews-marquee-group" :aria-hidden="group === 2">
            <article v-for="review in reviews" :key="`${group}-${review.title}`" class="review-card">
              <div class="review-card-top"><Quote :size="26" /><div v-if="review.rating" class="review-stars" :aria-label="`${review.rating} out of 5 stars`"><Star v-for="star in review.rating" :key="star" :size="14" fill="currentColor" /></div><span v-else><BadgeCheck :size="14" /> Verified reader</span></div>
              <h3>“{{ review.title }}”</h3><blockquote>“{{ review.quote }}”</blockquote><footer>— {{ review.author }}</footer>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section book-inside-section"><div class="container book-inside-grid"><div data-reveal><p class="eyebrow">Inside the book</p><h2>More than information—a guide towards intentional living</h2><p>The Healthy You brings wellbeing into a personal, approachable conversation. It encourages readers to reflect, make informed choices, and pursue progress that can last.</p><div class="inside-highlight"><Lightbulb :size="24" /><div><strong>Read. Reflect. Apply.</strong><span>Use the ideas as a starting point for practical personal action.</span></div></div></div><div class="book-learning-list" data-reveal><p>What you’ll take away</p><ul><li><span>01</span><div><strong>A healthier perspective</strong><small>Look at wellbeing as a whole-person journey rather than a temporary goal.</small></div></li><li><span>02</span><div><strong>Practical personal insight</strong><small>Reflect on the patterns and choices shaping your everyday health.</small></div></li><li><span>03</span><div><strong>Motivation to move forward</strong><small>Build confidence to take meaningful, sustainable steps.</small></div></li></ul></div></div></section>

    <section class="section author-book-section"><div class="container author-book-grid"><div class="author-book-photo" data-reveal><img :src="ceoImage" alt="Princess Oluwatoyin Emmanuel" loading="lazy" /></div><div data-reveal><p class="eyebrow">Meet the author</p><h2>Princess Oluwatoyin Emmanuel</h2><p>Princess is the Founder and Creative Director of Edyn Digital Hub, a multidisciplinary digital professional, educational product developer, and author committed to creating resources that inform, empower, and inspire meaningful growth.</p><blockquote>“The journey to a healthier you begins with understanding, intentional choices, and the courage to keep growing.”</blockquote><RouterLink to="/about" class="text-link">Meet the Founder <ArrowRight :size="17" /></RouterLink></div></div></section>

    <section class="section purchase-final-section"><div class="container purchase-final-card" data-reveal><div><p class="eyebrow light">Begin your journey</p><h2>Your healthier chapter can start today.</h2><p>Get your copy of <em>The Healthy You</em> through our secure checkout.</p></div><a href="#buy-book" class="button button-yellow">Get The Healthy You <ArrowRight :size="18" /></a></div></section>
    <a href="#buy-book" class="mobile-buy-bar"><BookOpen :size="17" /><span>Get the book</span><strong>{{ checkoutPrice }}</strong></a>
  </div>
</template>

<style scoped>
.book-sales-hero { background: radial-gradient(circle at 8% 15%, rgba(255,196,0,.18),transparent 24%),var(--surface); overflow:hidden; padding:135px 0 90px; position:relative; }
.book-sales-hero::after { background-image:radial-gradient(var(--gold) 1.1px,transparent 1.1px); background-size:21px 21px; content:''; height:280px; opacity:.22; position:absolute; right:-75px; top:120px; width:280px; }
.book-sales-grid { align-items:center; display:grid; gap:85px; grid-template-columns:.78fr 1.22fr; position:relative; z-index:2; }
.book-sales-visual .back-link { align-items:center; color:var(--muted); display:flex; font-size:.76rem; font-weight:700; gap:7px; margin-bottom:25px; }
.sales-cover-wrap { display:flex; justify-content:center; padding:20px; position:relative; }
.sales-cover-orbit { background:linear-gradient(145deg,var(--yellow),#ffdc56); border-radius:46% 54% 60% 40%/48% 40% 60% 52%; height:390px; left:50%; opacity:.8; position:absolute; top:50%; transform:translate(-50%,-50%) rotate(-8deg); width:390px; }
.sales-cover-wrap :deep(.book-cover) { max-width:315px; position:relative; z-index:2; }
.sales-trust-row { color:var(--muted); display:flex; flex-wrap:wrap; font-size:.66rem; gap:16px; justify-content:center; margin-top:25px; }.sales-trust-row span { align-items:center; display:flex; gap:5px; }.sales-trust-row svg { color:var(--green); }
.book-available-badge { align-items:center; background:color-mix(in srgb,var(--green) 10%,var(--card)); border-radius:999px; color:var(--green); display:inline-flex; font-size:.66rem; font-weight:800; gap:7px; margin-top:18px; padding:7px 11px; text-transform:uppercase; }.book-available-badge span { background:var(--fresh-green); border-radius:50%; height:7px; width:7px; }
.book-sales-copy h1 { font:800 clamp(3rem,5.4vw,5.25rem)/.98 'Manrope'; letter-spacing:-.065em; margin:15px 0 21px; max-width:760px; }.book-sales-copy h1 em { color:var(--green); font-style:normal; }
.book-sales-subtitle { color:var(--muted); font-size:.98rem; line-height:1.75; max-width:690px; }
.hero-book-benefits { display:grid; gap:9px; list-style:none; margin:23px 0 28px; padding:0; }.hero-book-benefits li { align-items:center; color:var(--text-soft); display:flex; font-size:.79rem; gap:9px; }.hero-book-benefits svg { color:var(--fresh-green); flex-shrink:0; height:18px; }
.book-checkout-card { background:var(--card); border:1px solid var(--border); border-radius:20px; box-shadow:0 20px 55px rgba(15,50,22,.1); max-width:670px; padding:25px; }
.checkout-heading { align-items:center; border-bottom:1px solid var(--border); color:var(--green); display:flex; justify-content:space-between; margin-bottom:18px; padding-bottom:16px; }.checkout-heading span,.checkout-heading strong { display:block; }.checkout-heading span { color:var(--muted); font-size:.66rem; font-weight:700; margin-bottom:3px; text-transform:uppercase; }.checkout-heading strong { color:var(--text); font:800 1.55rem 'Manrope'; }.checkout-heading .price-loading { color:var(--muted); font-size:1rem; }
.payment-method { align-items:center;background:color-mix(in srgb,var(--green) 7%,var(--card));border:1px solid color-mix(in srgb,var(--green) 28%,var(--border));border-radius:11px;display:grid;gap:10px;grid-template-columns:auto 1fr auto;margin-bottom:17px;padding:12px; }.payment-method-mark { align-items:center;background:var(--green);border-radius:8px;color:white;display:flex;font:800 .9rem 'Manrope';height:34px;justify-content:center;width:34px; }.payment-method strong,.payment-method small{display:block}.payment-method strong{font-size:.72rem}.payment-method small{color:var(--muted);font-size:.58rem;margin-top:3px}.payment-active{align-items:center;background:color-mix(in srgb,var(--fresh-green) 13%,var(--card));border-radius:999px;color:var(--green);display:flex;font-size:.58rem;font-weight:800;gap:5px;padding:6px 8px}.payment-active i{background:var(--fresh-green);border-radius:50%;height:6px;width:6px}
.payment-options{display:grid;gap:8px;margin-bottom:17px}.payment-options .payment-method{color:var(--text);cursor:pointer;margin-bottom:0;text-align:left;width:100%}.payment-options .payment-method.selected{border-color:var(--green);box-shadow:0 0 0 2px color-mix(in srgb,var(--green) 13%,transparent)}.payment-options .payment-method:disabled{cursor:not-allowed;opacity:.48}.payment-method.paypal .payment-method-mark{background:#0070ba;font-size:.66rem}.payment-method.paypal.selected{border-color:#0070ba}
.payment-method-mark.paystack-mark{background:#fff;border:1px solid #dce8eb}.paystack-mark svg{height:27px;width:27px}.paystack-mark rect{fill:#08a5db}.payment-method.paypal .payment-method-mark.paypal-mark{background:#fff;border:1px solid #dce3eb;color:#003087;font-size:.54rem;font-style:italic;letter-spacing:-.05em;width:45px}.paypal-mark b{color:#009cde}.paypal-mark span,.paypal-mark b{font-weight:900}
.book-checkout-card form { display:grid; gap:12px; grid-template-columns:repeat(2,1fr); }.book-checkout-card label>span { display:block; font-size:.66rem; font-weight:700; margin:0 0 6px 2px; }.book-checkout-card input { background:var(--surface); border:1px solid var(--border); border-radius:10px; color:var(--text); min-height:47px; outline:0; padding:0 13px; width:100%; }.book-checkout-card input:focus { border-color:var(--fresh-green); box-shadow:0 0 0 3px rgba(63,174,42,.1); }
.checkout-button { align-items:center; background:linear-gradient(135deg,var(--green),var(--green-dark)); border:0; border-radius:10px; color:white; cursor:pointer; display:flex; font-size:.76rem; font-weight:800; gap:8px; grid-column:1/-1; justify-content:center; min-height:50px; margin-top:2px; }.checkout-button:disabled { cursor:not-allowed; opacity:.58; }.checkout-spinner { animation:checkout-spin .8s linear infinite; }
.accepted-payments{align-items:center;border-top:1px solid var(--border);display:flex;gap:12px;justify-content:space-between;margin-top:14px;padding-top:12px}.accepted-payments>span{color:var(--muted);font-size:.57rem;font-weight:700}.payment-brand-row{align-items:center;display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}.card-brand{align-items:center;background:#fff;border:1px solid #e1e5e8;border-radius:5px;box-shadow:0 2px 5px rgba(17,24,39,.04);display:inline-flex;height:25px;justify-content:center;min-width:39px;padding:0 6px}.card-brand.visa{color:#1434cb;font:italic 900 .67rem Arial;letter-spacing:-.05em}.card-brand.mastercard{min-width:40px;position:relative}.card-brand.mastercard i,.card-brand.mastercard b{border-radius:50%;display:block;height:14px;position:absolute;width:14px}.card-brand.mastercard i{background:#eb001b;left:9px}.card-brand.mastercard b{background:#f79e1b;right:9px;opacity:.9}.card-brand.verve{color:#089447;font:800 .62rem Arial}.card-brand.transfer{color:#30404d;gap:3px;min-width:62px}.card-brand.transfer svg{fill:none;height:14px;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.8;width:14px}.card-brand.transfer small{font-size:.48rem;font-weight:700}.card-brand.paypal-wordmark{color:#003087;font:italic 900 .56rem Arial;letter-spacing:-.04em}.card-brand.paypal-wordmark i{font-style:inherit}.card-brand.paypal-wordmark b{color:#009cde}
.checkout-error { background:#fff0f0; border-radius:8px; color:#b42318; font-size:.7rem; margin:12px 0 0; padding:9px 11px; }.checkout-assurance { align-items:flex-start; color:var(--muted); display:flex; font-size:.62rem; gap:7px; line-height:1.5; margin-top:13px; }.checkout-assurance svg { color:var(--green); flex-shrink:0; }
.book-reader-section { background:var(--background); }.reader-cards { display:grid; gap:20px; grid-template-columns:repeat(3,1fr); }.reader-cards article { background:var(--card); border:1px solid var(--border); border-radius:19px; padding:32px; }.reader-cards svg { color:var(--green); height:32px; width:32px; }.reader-cards h3 { font:700 1.15rem 'Manrope'; margin:20px 0 9px; }.reader-cards p { color:var(--muted); font-size:.83rem; line-height:1.7; margin:0; }
.book-reviews-section { background:var(--surface); overflow:hidden; }.book-reviews-section .section-heading { margin-bottom:42px; }.reviews-marquee { display:flex; mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent); overflow:hidden; width:100%; }.reviews-marquee-track { animation:reviews-scroll 52s linear infinite; display:flex; width:max-content; }.reviews-marquee:hover .reviews-marquee-track,.reviews-marquee:focus-within .reviews-marquee-track { animation-play-state:paused; }.reviews-marquee-group { display:flex; gap:18px; padding-right:18px; }.review-card { background:var(--card); border:1px solid var(--border); border-radius:20px; box-shadow:0 15px 40px rgba(15,50,22,.06); display:flex; flex:0 0 clamp(290px,31vw,390px); flex-direction:column; min-height:295px; padding:27px; }.review-card-top { align-items:center; color:var(--green); display:flex; justify-content:space-between; }.review-card-top>span { align-items:center; background:color-mix(in srgb,var(--green) 9%,var(--card)); border-radius:999px; display:flex; font-size:.57rem; font-weight:800; gap:5px; padding:6px 8px; text-transform:uppercase; }.review-stars { color:var(--gold); display:flex; gap:2px; }.review-card h3 { font:700 1.06rem/1.4 'Manrope'; margin:23px 0 10px; }.review-card blockquote { color:var(--muted); font-size:.8rem; line-height:1.75; margin:0; }.review-card footer { color:var(--green); font-size:.7rem; font-weight:800; margin-top:auto; padding-top:20px; }.dark .review-stars { color:var(--yellow); }
.book-inside-section { background:var(--surface-soft); }.book-inside-grid { align-items:center; display:grid; gap:95px; grid-template-columns:1fr 1fr; }.book-inside-grid h2 { font:800 clamp(2.2rem,4vw,3.6rem)/1.08 'Manrope'; letter-spacing:-.05em; margin:10px 0 18px; }.book-inside-grid>div:first-child>p:last-of-type { color:var(--muted); line-height:1.8; }.inside-highlight { align-items:center; background:var(--card); border-left:3px solid var(--yellow); border-radius:10px; display:flex; gap:14px; margin-top:25px; padding:17px; }.inside-highlight svg { color:var(--green); flex-shrink:0; }.inside-highlight strong,.inside-highlight span { display:block; }.inside-highlight strong { font-size:.8rem; }.inside-highlight span { color:var(--muted); font-size:.69rem; margin-top:3px; }
.book-learning-list { background:var(--card); border:1px solid var(--border); border-radius:22px; box-shadow:var(--shadow); padding:32px; }.book-learning-list>p { color:var(--green); font-size:.66rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }.book-learning-list ul { list-style:none; margin:20px 0 0; padding:0; }.book-learning-list li { border-top:1px solid var(--border); display:grid; gap:16px; grid-template-columns:auto 1fr; padding:18px 0; }.book-learning-list li>span { color:var(--gold); font:800 1.1rem 'Manrope'; }.book-learning-list strong,.book-learning-list small { display:block; }.book-learning-list strong { font-size:.84rem; }.book-learning-list small { color:var(--muted); line-height:1.55; margin-top:5px; }
.author-book-section blockquote { border-left:3px solid var(--yellow); color:var(--text-soft); font:600 1rem/1.65 'Manrope'; margin:25px 0; padding:4px 0 4px 18px; }
.purchase-final-section { background:var(--background); padding-bottom:120px; }.purchase-final-card { align-items:center; background:linear-gradient(135deg,var(--deep-green),var(--green)); border-radius:28px; color:white; display:flex; justify-content:space-between; overflow:hidden; padding:52px 60px; position:relative; }.purchase-final-card::after { background:var(--yellow); border-radius:50%; content:''; height:250px; opacity:.13; position:absolute; right:-80px; top:-120px; width:250px; }.purchase-final-card h2 { font:800 clamp(2rem,4vw,3.4rem)/1.1 'Manrope'; letter-spacing:-.045em; margin:10px 0; }.purchase-final-card p:last-child { color:#d6e5d7; margin:0; }.purchase-final-card .button { flex-shrink:0; position:relative; z-index:2; }
.mobile-buy-bar { display:none; }
@keyframes checkout-spin { to { transform:rotate(360deg); } }
@keyframes reviews-scroll { to { transform:translateX(-50%); } }
@media(max-width:900px){.book-sales-grid,.book-inside-grid{gap:55px;grid-template-columns:1fr}.book-sales-visual{margin:auto;max-width:520px;width:100%}.book-sales-copy{text-align:left}.reader-cards{grid-template-columns:1fr}.purchase-final-card{align-items:flex-start;flex-direction:column;gap:25px;padding:42px 35px}.book-sales-copy h1{font-size:clamp(3rem,11vw,5rem)}}
@media(max-width:620px){.book-sales-hero{padding:118px 0 65px}.sales-cover-orbit{height:300px;width:300px}.sales-cover-wrap :deep(.book-cover){max-width:250px}.book-checkout-card{padding:19px}.book-checkout-card form{grid-template-columns:1fr}.book-checkout-card form>*{grid-column:1}.book-inside-grid{gap:38px}.reader-cards article,.book-learning-list{padding:25px}.purchase-final-card{padding:36px 24px}.purchase-final-card .button{width:100%}.purchase-final-section{padding-bottom:105px}.mobile-buy-bar{align-items:center;background:var(--yellow);bottom:12px;border-radius:999px;box-shadow:0 12px 35px rgba(0,0,0,.22);color:var(--deep-green);display:flex;font-size:.72rem;font-weight:800;gap:8px;justify-content:center;left:16px;min-height:53px;padding:0 18px;position:fixed;right:16px;z-index:45}.mobile-buy-bar strong{margin-left:auto}.sales-trust-row{justify-content:flex-start}}
@media(max-width:460px){.payment-method{grid-template-columns:auto 1fr}.payment-active{grid-column:2;justify-self:start}.accepted-payments{align-items:flex-start;flex-direction:column}.payment-brand-row{justify-content:flex-start}}
@media(prefers-reduced-motion:reduce){.reviews-marquee{mask-image:none;overflow-x:auto;padding:0 14px}.reviews-marquee-track{animation:none}.reviews-marquee-group:nth-child(2){display:none}}
</style>
