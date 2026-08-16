<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { CheckCircle2, LoaderCircle, Mail, RefreshCw } from '@lucide/vue'
import { authorizedAdminFetch } from '../../composables/useAdminAuth'

const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const messages = ref([])
const selected = ref(null)
const pagination = ref({ page: 1, pages: 1, total: 0 })
const status = ref('ALL')
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const notes = ref('')

const selectedStatus = computed(() => selected.value?.status || '')

function formatDate(value) {
  return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

async function loadMessages(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const query = new URLSearchParams({ page: String(page), status: status.value })
    const response = await authorizedAdminFetch(`${apiUrl}/api/v1/admin/communications/messages?${query}`)
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error?.message || 'Unable to load messages.')
    messages.value = payload.data.messages
    pagination.value = payload.data.pagination
    if (selected.value) selected.value = messages.value.find((item) => item.id === selected.value.id) || null
  } catch (requestError) {
    error.value = requestError.message || 'Unable to load messages.'
  } finally {
    loading.value = false
  }
}

async function updateMessage(id, changes) {
  saving.value = true
  error.value = ''
  try {
    const response = await authorizedAdminFetch(`${apiUrl}/api/v1/admin/communications/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error?.message || 'Unable to update this message.')
    const updated = payload.data.message
    messages.value = messages.value.map((item) => item.id === id ? updated : item)
    selected.value = updated
    notes.value = updated.adminNotes || ''
    window.dispatchEvent(new Event('edyn-notifications-refresh'))
  } catch (requestError) {
    error.value = requestError.message || 'Unable to update this message.'
  } finally {
    saving.value = false
  }
}

function openMessage(message) {
  selected.value = message
  notes.value = message.adminNotes || ''
  if (message.status === 'UNREAD') updateMessage(message.id, { status: 'READ' })
}

watch(status, () => { selected.value = null; loadMessages(1) })
onMounted(() => loadMessages())
</script>

<template>
  <div class="messages-view">
    <header class="view-heading"><div><p>Client enquiries</p><h2>Contact Messages</h2><span>Read, organise and respond to enquiries received from the website.</span></div><button type="button" @click="loadMessages(pagination.page)"><RefreshCw :size="16" /> Refresh</button></header>
    <p v-if="error" class="admin-error">{{ error }}</p>
    <section class="messages-card">
      <div class="message-list">
        <header><strong>{{ pagination.total }} messages</strong><select v-model="status" aria-label="Filter messages"><option value="ALL">All</option><option value="UNREAD">Unread</option><option value="READ">Read</option><option value="RESOLVED">Resolved</option><option value="SPAM">Spam</option></select></header>
        <div v-if="loading" class="loading"><LoaderCircle class="spin" :size="24" /> Loading messages…</div>
        <template v-else>
          <button v-for="message in messages" :key="message.id" class="message-preview" :class="{ active: selected?.id === message.id, unread: message.status === 'UNREAD' }" type="button" @click="openMessage(message)">
            <span class="avatar">{{ message.name.charAt(0).toUpperCase() }}</span><span class="preview-copy"><strong>{{ message.name }}</strong><small>{{ message.service || 'General enquiry' }}</small><em>{{ message.message }}</em></span><time>{{ formatDate(message.createdAt) }}</time>
          </button>
          <p v-if="!messages.length" class="empty">No messages match this filter.</p>
        </template>
        <footer v-if="pagination.pages > 1"><button :disabled="pagination.page <= 1" @click="loadMessages(pagination.page - 1)">Previous</button><span>{{ pagination.page }} / {{ pagination.pages }}</span><button :disabled="pagination.page >= pagination.pages" @click="loadMessages(pagination.page + 1)">Next</button></footer>
      </div>
      <article v-if="selected" class="message-detail">
        <header><div><span class="avatar large">{{ selected.name.charAt(0).toUpperCase() }}</span><div><h3>{{ selected.name }}</h3><a :href="`mailto:${selected.email}`">{{ selected.email }}</a></div></div><span class="status-pill" :class="selectedStatus.toLowerCase()">{{ selectedStatus }}</span></header>
        <dl><div v-if="selected.business"><dt>Business</dt><dd>{{ selected.business }}</dd></div><div v-if="selected.service"><dt>Service</dt><dd>{{ selected.service }}</dd></div><div v-if="selected.budget"><dt>Budget</dt><dd>{{ selected.budget }}</dd></div><div><dt>Received</dt><dd>{{ formatDate(selected.createdAt) }}</dd></div></dl>
        <div class="message-body">{{ selected.message }}</div>
        <label>Private admin notes<textarea v-model="notes" rows="4" placeholder="Add a follow-up note…" /></label>
        <div class="detail-actions"><button :disabled="saving" @click="updateMessage(selected.id, { adminNotes: notes || null })">Save notes</button><a :href="`mailto:${selected.email}?subject=${encodeURIComponent(`Re: Your enquiry to Edyn Digital Hub`)}&body=${encodeURIComponent(`Hello ${selected.name},\n\n`)}`"><Mail :size="16" /> Reply by email</a><button v-if="selected.status !== 'RESOLVED'" class="resolve" :disabled="saving" @click="updateMessage(selected.id, { status: 'RESOLVED', adminNotes: notes || null })"><CheckCircle2 :size="16" /> Resolve</button><button v-if="selected.status === 'RESOLVED' || selected.status === 'SPAM'" class="secondary" :disabled="saving" @click="updateMessage(selected.id, { status: 'UNREAD' })">Reopen</button><button v-if="selected.status !== 'SPAM'" class="secondary" :disabled="saving" @click="updateMessage(selected.id, { status: 'SPAM' })">Mark spam</button></div>
      </article>
      <div v-else class="message-placeholder"><Mail :size="35" /><strong>Select a message</strong><span>Choose an enquiry to view its details and respond.</span></div>
    </section>
  </div>
</template>

<style scoped>
.view-heading{align-items:flex-end;display:flex;justify-content:space-between;margin-bottom:24px}.view-heading p{color:var(--green);font-size:.64rem;font-weight:800;letter-spacing:.11em;margin:0 0 6px;text-transform:uppercase}.view-heading h2{font:800 clamp(1.7rem,3vw,2.3rem) 'Manrope';letter-spacing:-.04em;margin:0 0 6px}.view-heading span{color:var(--muted);font-size:.82rem}.view-heading button,.detail-actions button,.detail-actions a,.message-list footer button{align-items:center;background:var(--green);border:0;border-radius:9px;color:#fff;cursor:pointer;display:inline-flex;font-size:.7rem;font-weight:800;gap:7px;padding:11px 15px}.messages-card{background:var(--card);border:1px solid var(--border);border-radius:16px;display:grid;grid-template-columns:minmax(290px,38%) 1fr;min-height:620px;overflow:hidden}.message-list{border-right:1px solid var(--border)}.message-list>header{align-items:center;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;padding:18px}.message-list>header strong{font:800 .85rem 'Manrope'}.message-list select{background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:.7rem;padding:8px}.message-preview{background:transparent;border:0;border-bottom:1px solid var(--border);color:var(--text);cursor:pointer;display:grid;gap:10px;grid-template-columns:38px 1fr auto;padding:15px;text-align:left;width:100%}.message-preview:hover,.message-preview.active{background:var(--surface-soft)}.message-preview.unread{box-shadow:inset 3px 0 var(--yellow)}.avatar{background:color-mix(in srgb,var(--green) 14%,var(--card));border-radius:50%;color:var(--green);display:grid;font-weight:800;height:38px;place-items:center;width:38px}.avatar.large{height:46px;width:46px}.preview-copy{min-width:0}.preview-copy strong,.preview-copy small,.preview-copy em{display:block}.preview-copy strong{font-size:.75rem}.preview-copy small{color:var(--green);font-size:.59rem;margin:3px 0}.preview-copy em{color:var(--muted);font-size:.64rem;font-style:normal;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.message-preview time{color:var(--muted);font-size:.5rem}.message-detail{padding:28px}.message-detail>header,.message-detail>header>div{align-items:center;display:flex}.message-detail>header{justify-content:space-between}.message-detail>header>div{gap:12px}.message-detail h3{font:800 1rem 'Manrope';margin:0}.message-detail header a{color:var(--green);font-size:.68rem}.status-pill{background:#f0f2f4;border-radius:999px;font-size:.57rem;font-weight:800;padding:6px 9px}.status-pill.unread{background:#fff1b8;color:#785900}.status-pill.resolved{background:#e1f3df;color:var(--green)}.status-pill.spam{background:#fff0f0;color:#b42318}.message-detail dl{display:flex;flex-wrap:wrap;gap:10px;margin:25px 0}.message-detail dl div{background:var(--surface-soft);border-radius:9px;min-width:130px;padding:10px 12px}.message-detail dt{color:var(--muted);font-size:.55rem;text-transform:uppercase}.message-detail dd{font-size:.69rem;font-weight:700;margin:3px 0 0}.message-body{border-left:3px solid var(--yellow);font-size:.8rem;line-height:1.8;margin:25px 0;padding:5px 0 5px 18px;white-space:pre-wrap}.message-detail label{color:var(--muted);display:block;font-size:.65rem;font-weight:700}.message-detail textarea{background:var(--surface);border:1px solid var(--border);border-radius:9px;color:var(--text);display:block;margin-top:7px;padding:11px;resize:vertical;width:100%}.detail-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.detail-actions .resolve{background:var(--fresh-green)}.detail-actions .secondary{background:var(--surface-soft);border:1px solid var(--border);color:var(--text)}.message-placeholder,.loading{align-items:center;color:var(--muted);display:flex;flex-direction:column;gap:8px;justify-content:center;min-height:300px}.message-placeholder strong{color:var(--text)}.message-placeholder span{font-size:.7rem}.empty{text-align:center;color:var(--muted);font-size:.7rem;padding:40px}.message-list footer{align-items:center;display:flex;gap:10px;justify-content:center;padding:15px}.message-list footer button{padding:7px 9px}.message-list footer button:disabled{opacity:.4}.message-list footer span{color:var(--muted);font-size:.6rem}.admin-error{background:#fff0f0;border-radius:8px;color:#b42318;font-size:.7rem;padding:10px}.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:820px){.messages-card{grid-template-columns:1fr}.message-list{border-bottom:1px solid var(--border);border-right:0}.message-placeholder{display:none}}@media(max-width:600px){.view-heading{align-items:flex-start;flex-direction:column;gap:14px}.view-heading button{justify-content:center;width:100%}.message-detail{padding:20px}.message-detail>header{align-items:flex-start;gap:10px}.detail-actions>*{justify-content:center;width:100%}}
</style>
