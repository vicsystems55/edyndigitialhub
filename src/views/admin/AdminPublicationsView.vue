<script setup>
import { computed, onMounted, ref } from 'vue'
import { BookOpen, CheckCircle2, FileUp, LoaderCircle, Save } from '@lucide/vue'
import { authorizedAdminFetch } from '../../composables/useAdminAuth'

const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const books = ref([])
const selectedSlug = ref('')
const price = ref('')
const currency = ref('NGN')
const paypalPrice = ref('')
const purchasesEnabled = ref(false)
const downloadsEnabled = ref(false)
const ebook = ref(null)
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const notice = ref('')
const error = ref('')

const selectedBook = computed(() => books.value.find((book) => book.slug === selectedSlug.value) || null)

function selectBook(book) {
  selectedSlug.value = book.slug
  price.value = book.priceMinor == null ? '' : (book.priceMinor / 100).toFixed(2)
  currency.value = book.currency || 'NGN'
  paypalPrice.value = book.paypalPriceMinor == null ? '' : (book.paypalPriceMinor / 100).toFixed(2)
  purchasesEnabled.value = Boolean(book.purchasesEnabled)
  downloadsEnabled.value = Boolean(book.downloadsEnabled)
  ebook.value = null
  notice.value = ''
  error.value = ''
}

async function request(path, options = {}) {
  const response = await authorizedAdminFetch(`${apiUrl}/api/v1${path}`, {
    ...options,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error?.message || payload.message || 'The request could not be completed.')
  return payload.data
}

async function loadBooks(preferredSlug = selectedSlug.value) {
  loading.value = true
  error.value = ''
  try {
    const data = await request('/admin/publications')
    books.value = data.books
    const book = books.value.find((item) => item.slug === preferredSlug) || books.value[0]
    if (book) selectBook(book)
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    loading.value = false
  }
}

async function saveSettings() {
  if (!selectedBook.value) return
  saving.value = true
  notice.value = ''
  error.value = ''
  try {
    const amount = price.value === '' ? null : Math.round(Number(price.value) * 100)
    const paypalAmount = paypalPrice.value === '' ? null : Math.round(Number(paypalPrice.value) * 100)
    if (amount !== null && (!Number.isFinite(amount) || amount <= 0)) throw new Error('Enter a valid price greater than zero.')
    if (paypalAmount !== null && (!Number.isFinite(paypalAmount) || paypalAmount <= 0)) throw new Error('Enter a valid PayPal USD price greater than zero.')
    await request(`/admin/publications/${encodeURIComponent(selectedSlug.value)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceMinor: amount, currency: currency.value, paypalPriceMinor: paypalAmount, purchasesEnabled: purchasesEnabled.value, downloadsEnabled: downloadsEnabled.value }),
    })
    await loadBooks(selectedSlug.value)
    notice.value = 'Publication settings saved.'
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    saving.value = false
  }
}

function chooseFile(event) {
  const selected = event.target.files?.[0] || null
  error.value = ''
  if (selected && selected.size > 10 * 1024 * 1024) {
    ebook.value = null
    event.target.value = ''
    error.value = 'The ebook is too large for the current Cloudinary plan. Maximum upload size is 10 MB.'
    return
  }
  ebook.value = selected
}

async function uploadEbook() {
  if (!selectedBook.value || !ebook.value) return
  uploading.value = true
  notice.value = ''
  error.value = ''
  try {
    const form = new FormData()
    form.append('ebook', ebook.value)
    await request(`/admin/publications/${encodeURIComponent(selectedSlug.value)}/ebook`, { method: 'POST', body: form })
    await loadBooks(selectedSlug.value)
    notice.value = 'The protected ebook was uploaded successfully.'
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    uploading.value = false
  }
}

function formatBytes(bytes) {
  if (!bytes) return 'Unknown size'
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

onMounted(loadBooks)
</script>

<template>
  <div class="publication-manager">
    <header class="manager-heading">
      <div><p>Library management</p><h2>Publications</h2><span>Manage pricing, sales availability and protected ebook files.</span></div>
    </header>

    <div v-if="loading" class="manager-state"><LoaderCircle class="spin" :size="30" /> Loading publications…</div>
    <div v-else-if="!books.length" class="manager-state"><BookOpen :size="34" /> No publications have been created yet.</div>
    <template v-else>
      <div class="publication-tabs" role="tablist">
        <button v-for="book in books" :key="book.id" type="button" :class="{ active: book.slug === selectedSlug }" @click="selectBook(book)">
          <span>{{ book.title }}</span><small>{{ book.status.replace('_', ' ') }}</small>
        </button>
      </div>

      <p v-if="notice" class="manager-alert success"><CheckCircle2 :size="17" />{{ notice }}</p>
      <p v-if="error" class="manager-alert error">{{ error }}</p>

      <section v-if="selectedBook" class="manager-grid">
        <article class="manager-card">
          <div class="card-heading"><div><p>Sales settings</p><h3>{{ selectedBook.title }}</h3></div><span>{{ selectedBook.currency }}</span></div>
          <label>Price
            <div class="price-input"><span>₦</span><input v-model="price" inputmode="decimal" placeholder="0.00" /></div>
          </label>
          <label>Currency<select v-model="currency"><option value="NGN">NGN — Nigerian Naira</option><option value="USD">USD — US Dollar</option></select></label>
          <label>PayPal price (USD)
            <div class="price-input"><span>$</span><input v-model="paypalPrice" inputmode="decimal" placeholder="0.00" /></div>
            <small class="field-help">Set separately because PayPal branded checkout does not process NGN.</small>
          </label>
          <label class="toggle-row"><span><strong>Enable purchases</strong><small>Allow customers to pay for this publication.</small></span><input v-model="purchasesEnabled" type="checkbox" /></label>
          <label class="toggle-row"><span><strong>Enable downloads</strong><small>Issue protected links after verified payment.</small></span><input v-model="downloadsEnabled" type="checkbox" /></label>
          <button class="admin-action" type="button" :disabled="saving" @click="saveSettings"><LoaderCircle v-if="saving" class="spin" :size="17" /><Save v-else :size="17" />{{ saving ? 'Saving…' : 'Save settings' }}</button>
        </article>

        <article class="manager-card upload-card">
          <div class="card-heading"><div><p>Secure delivery</p><h3>Ebook file</h3></div><FileUp :size="22" /></div>
          <div v-if="selectedBook.ebookAssetId" class="current-file"><CheckCircle2 :size="21" /><div><strong>{{ selectedBook.ebookOriginalName || 'Protected ebook.pdf' }}</strong><span>{{ formatBytes(selectedBook.ebookBytes) }} · Cloudinary authenticated asset</span><small v-if="selectedBook.ebookUploadedAt">Uploaded {{ new Date(selectedBook.ebookUploadedAt).toLocaleString() }}</small></div></div>
          <div v-else class="current-file empty"><BookOpen :size="21" /><div><strong>No ebook uploaded</strong><span>Upload the sale-ready PDF before enabling purchases.</span></div></div>
          <label class="file-picker"><FileUp :size="25" /><strong>{{ ebook ? ebook.name : 'Choose the ebook PDF' }}</strong><span>PDF only · maximum 10 MB on Cloudinary Free · protected signed upload</span><input type="file" accept="application/pdf,.pdf" @change="chooseFile" /></label>
          <button class="admin-action secondary" type="button" :disabled="!ebook || uploading" @click="uploadEbook"><LoaderCircle v-if="uploading" class="spin" :size="17" /><FileUp v-else :size="17" />{{ uploading ? 'Uploading…' : selectedBook.ebookAssetId ? 'Replace ebook' : 'Upload ebook' }}</button>
          <p class="security-note">The PDF is never exposed as a permanent public URL. Paid orders receive a limited-use grant that redirects to a short-lived signed download.</p>
        </article>
      </section>
    </template>
  </div>
</template>

<style scoped>
.manager-heading{margin-bottom:25px}.manager-heading p,.card-heading p{color:var(--green);font-size:.64rem;font-weight:800;letter-spacing:.11em;margin:0 0 6px;text-transform:uppercase}.manager-heading h2{font:800 clamp(1.7rem,3vw,2.3rem) 'Manrope';letter-spacing:-.04em;margin:0 0 6px}.manager-heading span{color:var(--muted);font-size:.82rem}.manager-state{align-items:center;background:var(--card);border:1px solid var(--border);border-radius:17px;color:var(--muted);display:flex;gap:11px;justify-content:center;min-height:320px}.publication-tabs{display:flex;gap:9px;margin-bottom:17px;overflow-x:auto;padding-bottom:3px}.publication-tabs button{background:var(--card);border:1px solid var(--border);border-radius:11px;color:var(--text);cursor:pointer;display:flex;flex:0 0 auto;flex-direction:column;gap:3px;min-width:160px;padding:12px 15px;text-align:left}.publication-tabs button.active{border-color:var(--green);box-shadow:inset 0 0 0 1px var(--green)}.publication-tabs span{font-size:.73rem;font-weight:800}.publication-tabs small{color:var(--muted);font-size:.57rem;text-transform:capitalize}.manager-alert{align-items:center;border-radius:9px;display:flex;font-size:.7rem;gap:7px;margin:0 0 14px;padding:10px 13px}.manager-alert.success{background:#e4f4df;color:var(--green)}.manager-alert.error{background:#fff0f0;color:#b42318}.manager-grid{display:grid;gap:17px;grid-template-columns:1fr 1fr}.manager-card{background:var(--card);border:1px solid var(--border);border-radius:17px;padding:23px}.card-heading{align-items:center;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;margin-bottom:20px;padding-bottom:16px}.card-heading h3{font:800 1.15rem 'Manrope';margin:0}.card-heading>span{background:var(--surface-soft);border-radius:999px;color:var(--green);font-size:.61rem;font-weight:800;padding:6px 9px}.manager-card>label:not(.toggle-row):not(.file-picker){color:var(--muted);display:block;font-size:.65rem;font-weight:700;margin-bottom:15px}.manager-card input,.manager-card select{background:var(--surface);border:1px solid var(--border);border-radius:9px;color:var(--text);font:inherit;outline:none;padding:11px;width:100%}.manager-card select{margin-top:7px}.price-input{align-items:center;display:flex;margin-top:7px;position:relative}.price-input span{color:var(--muted);left:12px;position:absolute}.price-input input{padding-left:30px}.toggle-row{align-items:center;border-top:1px solid var(--border);display:flex;gap:15px;justify-content:space-between;padding:15px 0}.toggle-row span strong,.toggle-row span small{display:block}.toggle-row strong{font-size:.72rem}.toggle-row small{color:var(--muted);font-size:.61rem;margin-top:3px}.toggle-row input{accent-color:var(--green);height:18px;width:18px}.admin-action{align-items:center;background:var(--green);border:0;border-radius:9px;color:white;cursor:pointer;display:flex;font-size:.7rem;font-weight:800;gap:7px;justify-content:center;margin-top:14px;min-height:42px;padding:0 15px;width:100%}.admin-action.secondary{background:var(--yellow);color:#111}.admin-action:disabled{cursor:not-allowed;opacity:.55}.current-file{align-items:flex-start;background:var(--surface-soft);border-radius:11px;color:var(--green);display:flex;gap:11px;margin-bottom:16px;padding:14px}.current-file.empty{color:var(--muted)}.current-file div strong,.current-file div span,.current-file div small{display:block}.current-file strong{color:var(--text);font-size:.69rem;overflow-wrap:anywhere}.current-file span,.current-file small{color:var(--muted);font-size:.59rem;margin-top:4px}.file-picker{align-items:center;border:1px dashed var(--green);border-radius:12px;color:var(--green);cursor:pointer;display:flex;flex-direction:column;padding:25px 15px;text-align:center}.file-picker strong{color:var(--text);font-size:.72rem;margin-top:8px;overflow-wrap:anywhere}.file-picker span{color:var(--muted);font-size:.59rem;margin-top:4px}.file-picker input{display:none}.security-note{color:var(--muted);font-size:.59rem;line-height:1.65;margin:14px 0 0}.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:850px){.manager-grid{grid-template-columns:1fr}}@media(max-width:520px){.manager-card{padding:18px}}
.field-help{color:var(--muted);display:block;font-size:.57rem;font-weight:500;line-height:1.5;margin-top:6px}
</style>
