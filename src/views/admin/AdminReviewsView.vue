<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { CheckCircle2, Clock3, LoaderCircle, RefreshCw, Star, UserRound, XCircle } from '@lucide/vue'
import { authorizedAdminFetch } from '../../composables/useAdminAuth'

const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const reviews = ref([])
const status = ref('PENDING')
const loading = ref(true)
const updatingId = ref('')
const error = ref('')
const pending = ref(0)
const pagination = ref({ page: 1, pages: 1, total: 0 })

const heading = computed(() => status.value === 'PENDING' ? 'Reviews awaiting approval' : `${status.value.toLowerCase()} reviews`)

async function loadReviews(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const query = new URLSearchParams({ status: status.value, page: String(page) })
    const response = await authorizedAdminFetch(`${apiUrl}/api/v1/admin/reviews?${query}`)
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error?.message || 'Unable to load reviews.')
    reviews.value = payload.data.reviews
    pending.value = payload.data.pending
    pagination.value = payload.data.pagination
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    loading.value = false
  }
}

async function moderate(review, nextStatus) {
  updatingId.value = review.id
  error.value = ''
  try {
    const response = await authorizedAdminFetch(`${apiUrl}/api/v1/admin/reviews/${review.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error?.message || 'Unable to update this review.')
    await loadReviews(pagination.value.page)
    window.dispatchEvent(new CustomEvent('edyn-notifications-refresh'))
  } catch (requestError) {
    error.value = requestError.message
  } finally {
    updatingId.value = ''
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

watch(status, () => loadReviews(1))
onMounted(() => loadReviews())
</script>

<template>
  <div class="reviews-admin-view">
    <header class="reviews-heading"><div><p>Reader feedback</p><h2>Review moderation</h2><span>Approve reader reviews before they appear on the book page.</span></div><button type="button" :disabled="loading" @click="loadReviews(pagination.page)"><RefreshCw :class="{ spin: loading }" :size="17" /> Refresh</button></header>
    <section class="review-summary"><article><Clock3 :size="21" /><div><span>Awaiting approval</span><strong>{{ pending }}</strong></div></article><article><Star :size="21" /><div><span>Current filter</span><strong>{{ pagination.total }}</strong></div></article></section>
    <div class="review-filter"><div><strong>{{ heading }}</strong><span>Newest submissions appear first.</span></div><select v-model="status" aria-label="Filter reviews"><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option><option value="ALL">All reviews</option></select></div>
    <p v-if="error" class="admin-review-error">{{ error }}</p>
    <div v-if="loading" class="review-loading"><LoaderCircle class="spin" :size="27" /> Loading reviews…</div>
    <div v-else class="review-list">
      <article v-for="review in reviews" :key="review.id" class="moderation-card">
        <header><div class="reviewer-avatar"><UserRound :size="19" /></div><div><strong>{{ review.fullName }}</strong><span>{{ review.anonymous ? 'Displays anonymously' : 'Displays full name' }} · {{ review.book.title }}</span></div><small :class="review.status.toLowerCase()">{{ review.status }}</small></header>
        <div class="moderation-stars" :aria-label="`${review.rating} out of 5 stars`"><Star v-for="star in 5" :key="star" :size="16" :fill="star <= review.rating ? 'currentColor' : 'none'" /></div>
        <h3>{{ review.title }}</h3><blockquote>“{{ review.review }}”</blockquote><time>{{ formatDate(review.createdAt) }}</time>
        <footer>
          <button v-if="review.status !== 'APPROVED'" class="approve" type="button" :disabled="updatingId === review.id" @click="moderate(review, 'APPROVED')"><LoaderCircle v-if="updatingId === review.id" class="spin" :size="16" /><CheckCircle2 v-else :size="16" /> Approve</button>
          <button v-if="review.status !== 'REJECTED'" class="reject" type="button" :disabled="updatingId === review.id" @click="moderate(review, 'REJECTED')"><XCircle :size="16" /> Reject</button>
          <button v-if="review.status !== 'PENDING'" class="pending" type="button" :disabled="updatingId === review.id" @click="moderate(review, 'PENDING')"><Clock3 :size="16" /> Return to pending</button>
        </footer>
      </article>
      <div v-if="!reviews.length" class="review-empty"><CheckCircle2 :size="32" /><strong>No reviews in this category</strong><span>New reader submissions will appear here.</span></div>
    </div>
    <footer v-if="pagination.pages > 1" class="review-pagination"><button :disabled="pagination.page <= 1" @click="loadReviews(pagination.page - 1)">Previous</button><span>Page {{ pagination.page }} of {{ pagination.pages }}</span><button :disabled="pagination.page >= pagination.pages" @click="loadReviews(pagination.page + 1)">Next</button></footer>
  </div>
</template>

<style scoped>
.reviews-heading{align-items:flex-end;display:flex;justify-content:space-between;margin-bottom:22px}.reviews-heading p{color:var(--green);font-size:.64rem;font-weight:800;letter-spacing:.11em;margin:0 0 6px;text-transform:uppercase}.reviews-heading h2{font:800 clamp(1.7rem,3vw,2.3rem) 'Manrope';letter-spacing:-.04em;margin:0 0 6px}.reviews-heading span{color:var(--muted);font-size:.82rem}.reviews-heading button,.review-pagination button{align-items:center;background:var(--green);border:0;border-radius:9px;color:#fff;cursor:pointer;display:flex;font-size:.7rem;font-weight:800;gap:7px;padding:11px 15px}.reviews-heading button:disabled,.review-pagination button:disabled{cursor:not-allowed;opacity:.5}.review-summary{display:grid;gap:13px;grid-template-columns:repeat(2,minmax(0,250px));margin-bottom:16px}.review-summary article{align-items:center;background:var(--card);border:1px solid var(--border);border-radius:13px;color:var(--green);display:flex;gap:12px;padding:16px}.review-summary span,.review-summary strong{display:block}.review-summary span{color:var(--muted);font-size:.61rem}.review-summary strong{color:var(--text);font:800 1.2rem 'Manrope';margin-top:2px}.review-filter{align-items:center;background:var(--card);border:1px solid var(--border);border-radius:14px;display:flex;justify-content:space-between;margin-bottom:14px;padding:16px 18px}.review-filter strong,.review-filter span{display:block}.review-filter strong{font:.8rem 'Manrope';font-weight:800}.review-filter span{color:var(--muted);font-size:.59rem;margin-top:3px}.review-filter select{background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:9px}.review-list{display:grid;gap:14px;grid-template-columns:repeat(2,minmax(0,1fr))}.moderation-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px}.moderation-card>header{align-items:center;display:grid;gap:10px;grid-template-columns:auto 1fr auto}.reviewer-avatar{background:var(--surface-soft);border-radius:50%;color:var(--green);display:grid;height:40px;place-items:center;width:40px}.moderation-card header strong,.moderation-card header span{display:block}.moderation-card header strong{font-size:.73rem}.moderation-card header span{color:var(--muted);font-size:.57rem;margin-top:3px}.moderation-card header small{border-radius:999px;font-size:.52rem;font-weight:900;padding:5px 8px}.moderation-card header small.pending{background:#fff2c2;color:#806000}.moderation-card header small.approved{background:#e2f3df;color:var(--green)}.moderation-card header small.rejected{background:#fff0f0;color:#b42318}.moderation-stars{color:var(--gold);display:flex;gap:2px;margin-top:17px}.moderation-card h3{font:800 .95rem 'Manrope';margin:12px 0 7px}.moderation-card blockquote{color:var(--muted);font-size:.72rem;line-height:1.7;margin:0}.moderation-card time{color:var(--muted);display:block;font-size:.54rem;margin-top:13px}.moderation-card footer{border-top:1px solid var(--border);display:flex;flex-wrap:wrap;gap:7px;margin-top:16px;padding-top:14px}.moderation-card footer button{align-items:center;border:0;border-radius:8px;cursor:pointer;display:flex;font-size:.62rem;font-weight:800;gap:5px;padding:9px 11px}.moderation-card footer .approve{background:var(--green);color:#fff}.moderation-card footer .reject{background:#fff0f0;color:#b42318}.moderation-card footer .pending{background:var(--surface-soft);color:var(--text)}.review-loading,.review-empty{align-items:center;background:var(--card);border:1px solid var(--border);border-radius:15px;color:var(--muted);display:flex;gap:9px;grid-column:1/-1;justify-content:center;min-height:240px}.review-empty{flex-direction:column}.review-empty strong{color:var(--text)}.review-empty span{font-size:.65rem}.admin-review-error{background:#fff0f0;border-radius:9px;color:#b42318;font-size:.7rem;padding:11px}.review-pagination{align-items:center;display:flex;gap:12px;justify-content:flex-end;margin-top:17px}.review-pagination span{color:var(--muted);font-size:.62rem}.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:820px){.review-list{grid-template-columns:1fr}}@media(max-width:600px){.reviews-heading{align-items:flex-start;flex-direction:column;gap:14px}.reviews-heading button{justify-content:center;width:100%}.review-summary{grid-template-columns:1fr}.review-filter{align-items:flex-start;flex-direction:column;gap:12px}.review-filter select{width:100%}.moderation-card{padding:17px}}
</style>
