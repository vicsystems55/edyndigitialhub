<script setup>
import { onMounted, ref, watch } from 'vue'
import { Download, LoaderCircle, RefreshCw, Users } from '@lucide/vue'
import { authorizedAdminFetch } from '../../composables/useAdminAuth'

const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const subscribers = ref([])
const pagination = ref({ page: 1, pages: 1, total: 0 })
const active = ref(0)
const status = ref('ALL')
const loading = ref(true)
const exporting = ref(false)
const error = ref('')

function formatDate(value) {
  return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

async function loadSubscribers(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const query = new URLSearchParams({ page: String(page), status: status.value })
    const response = await authorizedAdminFetch(`${apiUrl}/api/v1/admin/communications/subscribers?${query}`)
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error?.message || 'Unable to load subscribers.')
    subscribers.value = payload.data.subscribers
    pagination.value = payload.data.pagination
    active.value = payload.data.active
  } catch (requestError) {
    error.value = requestError.message || 'Unable to load subscribers.'
  } finally {
    loading.value = false
  }
}

async function changeStatus(subscriber, nextStatus) {
  error.value = ''
  const response = await authorizedAdminFetch(`${apiUrl}/api/v1/admin/communications/subscribers/${subscriber.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: nextStatus }) })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) { error.value = payload.error?.message || 'Unable to update subscriber.'; return }
  subscribers.value = subscribers.value.map((item) => item.id === subscriber.id ? payload.data.subscriber : item)
  await loadSubscribers(pagination.value.page)
}

async function exportCsv() {
  exporting.value = true
  error.value = ''
  try {
    const response = await authorizedAdminFetch(`${apiUrl}/api/v1/admin/communications/subscribers-export.csv`)
    if (!response.ok) throw new Error('Unable to export subscribers.')
    const url = URL.createObjectURL(await response.blob())
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'edyn-newsletter-subscribers.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  } catch (requestError) { error.value = requestError.message || 'Unable to export subscribers.' } finally { exporting.value = false }
}

watch(status, () => loadSubscribers(1))
onMounted(() => loadSubscribers())
</script>

<template>
  <div class="newsletter-view">
    <header class="view-heading"><div><p>Audience</p><h2>Newsletter Subscribers</h2><span>Manage consent status and export your mailing list.</span></div><div class="heading-actions"><button class="secondary" type="button" @click="loadSubscribers(pagination.page)"><RefreshCw :size="16" /> Refresh</button><button type="button" :disabled="exporting" @click="exportCsv"><Download :size="16" /> {{ exporting ? 'Exporting…' : 'Export CSV' }}</button></div></header>
    <section class="summary"><article><Users :size="22" /><div><span>Active subscribers</span><strong>{{ active.toLocaleString() }}</strong></div></article><article><Users :size="22" /><div><span>Records in this view</span><strong>{{ pagination.total.toLocaleString() }}</strong></div></article></section>
    <p v-if="error" class="admin-error">{{ error }}</p>
    <section class="subscriber-card">
      <header><div><h3>Subscriber directory</h3><span>Full names and email addresses collected with each subscription</span></div><select v-model="status"><option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="UNSUBSCRIBED">Unsubscribed</option><option value="BOUNCED">Bounced</option></select></header>
      <div v-if="loading" class="loading"><LoaderCircle class="spin" :size="24" /> Loading subscribers…</div>
      <div v-else class="table-wrap"><table><thead><tr><th>Subscriber</th><th>Source</th><th>Subscribed</th><th>Status</th><th>Manage</th></tr></thead><tbody><tr v-for="subscriber in subscribers" :key="subscriber.id"><td><strong>{{ subscriber.name || 'Name not supplied' }}</strong><small>{{ subscriber.email }}</small></td><td>{{ subscriber.source || 'Website' }}</td><td>{{ formatDate(subscriber.subscribedAt) }}</td><td><span class="status-pill" :class="subscriber.status.toLowerCase()">{{ subscriber.status }}</span></td><td><select :value="subscriber.status" aria-label="Update subscription status" @change="changeStatus(subscriber, $event.target.value)"><option value="ACTIVE">Active</option><option value="UNSUBSCRIBED">Unsubscribed</option><option value="BOUNCED">Bounced</option></select></td></tr><tr v-if="!subscribers.length"><td colspan="5" class="empty">No subscribers match this filter.</td></tr></tbody></table></div>
      <footer v-if="pagination.pages > 1"><button :disabled="pagination.page <= 1" @click="loadSubscribers(pagination.page - 1)">Previous</button><span>Page {{ pagination.page }} of {{ pagination.pages }}</span><button :disabled="pagination.page >= pagination.pages" @click="loadSubscribers(pagination.page + 1)">Next</button></footer>
    </section>
  </div>
</template>

<style scoped>
.view-heading{align-items:flex-end;display:flex;justify-content:space-between;margin-bottom:24px}.view-heading p{color:var(--green);font-size:.64rem;font-weight:800;letter-spacing:.11em;margin:0 0 6px;text-transform:uppercase}.view-heading h2{font:800 clamp(1.7rem,3vw,2.3rem) 'Manrope';letter-spacing:-.04em;margin:0 0 6px}.view-heading span{color:var(--muted);font-size:.82rem}.heading-actions{display:flex;gap:8px}.heading-actions button,.subscriber-card footer button{align-items:center;background:var(--green);border:1px solid var(--green);border-radius:9px;color:#fff;cursor:pointer;display:flex;font-size:.7rem;font-weight:800;gap:7px;padding:11px 15px}.heading-actions .secondary{background:var(--card);border-color:var(--border);color:var(--text)}.summary{display:grid;gap:14px;grid-template-columns:repeat(2,minmax(0,260px));margin-bottom:16px}.summary article{align-items:center;background:var(--card);border:1px solid var(--border);border-radius:13px;color:var(--green);display:flex;gap:13px;padding:17px}.summary span,.summary strong{display:block}.summary span{color:var(--muted);font-size:.61rem}.summary strong{color:var(--text);font:800 1.25rem 'Manrope';margin-top:3px}.subscriber-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px}.subscriber-card>header{align-items:center;display:flex;justify-content:space-between;margin-bottom:18px}.subscriber-card h3{font:800 1rem 'Manrope';margin:0 0 3px}.subscriber-card header span{color:var(--muted);font-size:.62rem}.subscriber-card select{background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:8px}.table-wrap{overflow-x:auto}.subscriber-card table{border-collapse:collapse;min-width:720px;width:100%}.subscriber-card th{color:var(--muted);font-size:.57rem;letter-spacing:.06em;padding:10px 8px;text-align:left;text-transform:uppercase}.subscriber-card td{border-top:1px solid var(--border);color:var(--muted);font-size:.65rem;padding:12px 8px}.subscriber-card td strong,.subscriber-card td small{display:block}.subscriber-card td strong{color:var(--text)}.subscriber-card td small{font-size:.59rem;margin-top:3px}.status-pill{background:#f0f2f4;border-radius:999px;font-size:.55rem;font-weight:800;padding:5px 8px}.status-pill.active{background:#e1f3df;color:var(--green)}.status-pill.unsubscribed,.status-pill.bounced{background:#fff0f0;color:#b42318}.loading{align-items:center;color:var(--muted);display:flex;gap:8px;justify-content:center;min-height:220px}.empty{text-align:center}.subscriber-card footer{align-items:center;display:flex;gap:12px;justify-content:flex-end;margin-top:17px}.subscriber-card footer button{padding:8px 11px}.subscriber-card footer button:disabled{opacity:.4}.subscriber-card footer span{color:var(--muted);font-size:.62rem}.admin-error{background:#fff0f0;border-radius:8px;color:#b42318;font-size:.7rem;padding:10px}.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:650px){.view-heading{align-items:flex-start;flex-direction:column;gap:15px}.heading-actions{width:100%}.heading-actions button{justify-content:center;width:50%}.summary{grid-template-columns:1fr}.subscriber-card{padding:16px}.subscriber-card>header{align-items:flex-start;flex-direction:column;gap:12px}.subscriber-card>header select{width:100%}}
</style>
