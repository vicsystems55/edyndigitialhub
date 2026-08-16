<script setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowUpRight, BookOpen, Eye, Mail, MessageSquare, ReceiptText, Users } from '@lucide/vue'
import { authorizedAdminFetch } from '../../composables/useAdminAuth'

const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const dashboard = ref(null)
const loading = ref(true)
const error = ref('')

function formatMoney(amountMinor, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format((amountMinor || 0) / 100)
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function initials(name, email) {
  return (name || email || 'E').split(/[\s@]/).filter(Boolean).map((word) => word[0]).slice(0, 2).join('').toUpperCase()
}

const stats = computed(() => {
  const summary = dashboard.value?.summary || {}
  return [
    { label: 'Website views', value: (summary.websiteViews || 0).toLocaleString(), note: 'Recorded page views', icon: Eye, tone: 'green' },
    { label: 'Book revenue', value: formatMoney(summary.bookRevenueMinor), note: `${summary.paidOrders || 0} paid orders`, icon: ReceiptText, tone: 'yellow' },
    { label: 'Unread enquiries', value: String(summary.unreadMessages || 0), note: 'Messages awaiting review', icon: MessageSquare, tone: 'lime' },
    { label: 'Subscribers', value: (summary.activeSubscribers || 0).toLocaleString(), note: 'Active newsletter contacts', icon: Users, tone: 'cream' },
  ]
})

const chartMaximum = computed(() => Math.max(1, ...(dashboard.value?.traffic || []).map((item) => item.views)))

async function loadDashboard() {
  loading.value = true
  error.value = ''
  try {
    const response = await authorizedAdminFetch(`${apiUrl}/api/v1/admin/dashboard/overview`)
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error?.message || 'Unable to load dashboard data.')
    dashboard.value = payload.data
  } catch (requestError) {
    error.value = requestError.message || 'Unable to load dashboard data.'
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<template>
  <div class="dashboard-view">
    <section class="dashboard-welcome">
      <div><p>{{ new Date().toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' }) }}</p><h2>Good to see you, Edyn.</h2><span>Here’s what is happening across your digital hub today.</span></div>
      <RouterLink to="/admin/publications" class="dashboard-primary-action"><BookOpen :size="18" /> Add publication</RouterLink>
    </section>
    <p v-if="loading" class="dashboard-notice">Loading live dashboard data…</p>
    <p v-else-if="error" class="dashboard-notice dashboard-notice--error">{{ error }} <button type="button" @click="loadDashboard">Try again</button></p>

    <section class="dashboard-stats" aria-label="Performance summary">
      <article v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :class="`stat-icon--${stat.tone}`"><component :is="stat.icon" :size="21" /></div>
        <p>{{ stat.label }}</p><strong>{{ stat.value }}</strong>
        <span>{{ stat.note }}</span>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="dashboard-card traffic-card">
        <header><div><p class="admin-kicker">Traffic overview</p><h3>Website performance</h3></div><span class="live-label">Last 7 days</span></header>
        <div class="traffic-total"><strong>{{ (dashboard?.summary.websiteViews || 0).toLocaleString() }}</strong><span>all recorded visits</span></div>
        <div class="live-chart" aria-label="Page views over the last seven days">
          <div v-for="point in dashboard?.traffic || []" :key="point.date" class="live-chart-column"><strong>{{ point.views }}</strong><span :style="{ height: `${Math.max(4, (point.views / chartMaximum) * 120)}px` }" /><small>{{ new Date(`${point.date}T00:00:00`).toLocaleDateString('en-NG', { weekday: 'short' }) }}</small></div>
        </div>
      </article>

      <article class="dashboard-card quick-card">
        <header><div><p class="admin-kicker">Publishing</p><h3>Library snapshot</h3></div></header>
        <div class="library-count"><BookOpen :size="27" /><div><strong>{{ dashboard?.library.total || 0 }}</strong><span>Publications</span></div></div>
        <ul><li><span>Published</span><strong>{{ dashboard?.library.published || 0 }}</strong></li><li><span>Coming soon</span><strong>{{ dashboard?.library.comingSoon || 0 }}</strong></li><li><span>Digital downloads</span><strong>{{ dashboard?.library.downloads || 0 }}</strong></li></ul>
        <div class="email-integration" :class="{ active: dashboard?.integrations.resend }"><span /><div><strong>Resend email</strong><small>{{ dashboard?.integrations.resend ? 'Configured and active' : 'Awaiting API key and sender' }}</small></div></div>
        <RouterLink to="/admin/publications">Manage publications <ArrowUpRight :size="16" /></RouterLink>
      </article>
    </section>

    <section class="dashboard-grid dashboard-grid--bottom">
      <article class="dashboard-card orders-card">
        <header><div><p class="admin-kicker">Commerce</p><h3>Recent book orders</h3></div><RouterLink to="/admin/sales">View all</RouterLink></header>
        <div class="admin-table-wrap"><table><thead><tr><th>Customer</th><th>Publication</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody><tr v-for="order in dashboard?.recentOrders || []" :key="order.id"><td><strong>{{ order.customerName || order.customerEmail }}</strong></td><td>{{ order.bookTitle }}</td><td>{{ formatMoney(order.amountMinor, order.currency) }}</td><td><span class="order-status" :class="{ pending: order.status !== 'PAID' }">{{ order.status }}</span></td><td>{{ formatDate(order.createdAt) }}</td></tr><tr v-if="!dashboard?.recentOrders.length"><td colspan="5">No orders yet.</td></tr></tbody></table></div>
      </article>

      <article class="dashboard-card messages-card">
        <header><div><p class="admin-kicker">Inbox</p><h3>Latest messages</h3></div><RouterLink to="/admin/messages">View all</RouterLink></header>
        <ul><li v-for="message in dashboard?.recentMessages || []" :key="message.id"><span class="message-avatar">{{ initials(message.name, message.email) }}</span><div><strong>{{ message.name }} <i v-if="message.status === 'UNREAD'" /></strong><p>{{ message.service || message.message }}</p></div><small>{{ formatDate(message.createdAt) }}</small></li></ul>
        <p v-if="!dashboard?.recentMessages.length" class="empty-copy">No contact messages yet.</p>
        <div class="inbox-summary"><Mail :size="16" /> {{ dashboard?.summary.unreadMessages || 0 }} unread messages need your attention</div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.dashboard-welcome { align-items: flex-end; display: flex; justify-content: space-between; margin-bottom: 27px; }.dashboard-welcome p { color: var(--green); font-size: .68rem; font-weight: 800; letter-spacing: .08em; margin: 0 0 7px; text-transform: uppercase; }.dashboard-welcome h2 { font: 800 clamp(1.7rem, 3vw, 2.35rem) 'Manrope'; letter-spacing: -.04em; margin: 0 0 5px; }.dashboard-welcome span { color: var(--muted); font-size: .84rem; }.dashboard-primary-action { align-items: center; background: var(--green); border-radius: 10px; color: white; display: flex; font-size: .78rem; font-weight: 700; gap: 8px; min-height: 43px; padding: 0 16px; }
.dashboard-notice{background:var(--card);border:1px solid var(--border);border-radius:10px;color:var(--muted);font-size:.72rem;margin:0 0 16px;padding:11px 14px}.dashboard-notice--error{background:#fff0f0;color:#b42318}.dashboard-notice button{background:none;border:0;color:inherit;cursor:pointer;font-weight:800;text-decoration:underline}.live-label{color:var(--muted);font-size:.62rem}.live-chart{align-items:end;border-bottom:1px solid var(--border);display:grid;gap:12px;grid-template-columns:repeat(7,1fr);height:175px;margin-top:15px;padding:0 8px}.live-chart-column{align-items:center;display:flex;flex-direction:column;height:100%;justify-content:flex-end}.live-chart-column>strong{color:var(--muted);font-size:.56rem;margin-bottom:4px}.live-chart-column>span{background:linear-gradient(180deg,var(--fresh-green),var(--green));border-radius:6px 6px 0 0;max-width:34px;min-height:4px;width:70%}.live-chart-column>small{color:var(--muted);font-size:.55rem;margin:6px 0}.email-integration{align-items:center;background:var(--surface-soft);border-radius:9px;display:flex;gap:9px;margin-top:14px;padding:10px}.email-integration>span{background:#d0d5dd;border-radius:50%;height:8px;width:8px}.email-integration.active>span{background:var(--fresh-green)}.email-integration strong,.email-integration small{display:block}.email-integration strong{font-size:.64rem}.email-integration small{color:var(--muted);font-size:.56rem;margin-top:2px}.empty-copy{color:var(--muted);font-size:.7rem;padding:18px 0;text-align:center}
.dashboard-stats { display: grid; gap: 16px; grid-template-columns: repeat(4,1fr); }.dashboard-stats article,.dashboard-card { background: var(--card); border: 1px solid var(--border); border-radius: 15px; box-shadow: 0 8px 24px rgba(23,52,28,.04); }.dashboard-stats article { display: grid; grid-template-columns: 42px 1fr auto; padding: 17px; }.stat-icon { align-items: center; border-radius: 10px; display: flex; height: 42px; justify-content: center; width: 42px; }.stat-icon--green { background:#e1f1de;color:var(--green) }.stat-icon--yellow { background:#fff3c0;color:#8b6900 }.stat-icon--lime { background:#ebf4d9;color:#477c15 }.stat-icon--cream { background:#f1ece1;color:#765e35 }.dashboard-stats button { background: none; border: 0; color: var(--muted); cursor: pointer; grid-column: 3; }.dashboard-stats p { color: var(--muted); font-size: .7rem; grid-column: 1/-1; margin: 15px 0 5px; }.dashboard-stats > article > strong { font: 800 1.45rem 'Manrope'; grid-column:1/-1; }.dashboard-stats article > span { align-items: center; color: var(--fresh-green); display:flex;font-size:.64rem;font-weight:800;gap:3px;grid-column:1/-1;margin-top:9px }.dashboard-stats article > span.down { color:#d14343 }.dashboard-stats article > span small { color:var(--muted);font-weight:500;margin-left:3px }
.dashboard-grid { display:grid;gap:16px;grid-template-columns:1.65fr .75fr;margin-top:16px }.dashboard-grid--bottom { grid-template-columns:1.4fr .8fr }.dashboard-card { min-width:0;padding:22px }.dashboard-card header { align-items:center;display:flex;justify-content:space-between;margin-bottom:20px }.admin-kicker { color:var(--green);font-size:.59rem;font-weight:800;letter-spacing:.11em;margin:0 0 4px;text-transform:uppercase }.dashboard-card h3 { font:700 1rem 'Manrope';margin:0 }.dashboard-card header select { background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:.67rem;padding:7px 9px }.dashboard-card header a { color:var(--green);font-size:.68rem;font-weight:800 }.traffic-total { align-items:baseline;display:flex;gap:7px }.traffic-total strong { font:800 1.65rem 'Manrope' }.traffic-total span { color:var(--muted);font-size:.7rem }.traffic-total small { background:#e4f4df;border-radius:999px;color:var(--green);font-size:.6rem;font-weight:800;margin-left:auto;padding:4px 7px }.chart-wrap { display:flex;height:190px;margin-top:12px }.chart-y { color:var(--muted);display:flex;flex-direction:column;font-size:.57rem;justify-content:space-between;padding-bottom:20px;width:28px }.chart-area { background:repeating-linear-gradient(to bottom,transparent 0,transparent 41px,var(--border) 42px);flex:1;position:relative }.chart-area svg { height:165px;width:100% }.chart-fill { fill:url(#chartFill) }.chart-line { fill:none;stroke:var(--fresh-green);stroke-linecap:round;stroke-width:3 }.chart-days { bottom:0;color:var(--muted);display:flex;font-size:.57rem;justify-content:space-between;left:0;position:absolute;right:0 }.library-count { align-items:center;background:var(--surface-soft);border-radius:12px;color:var(--green);display:flex;gap:14px;padding:15px }.library-count div strong,.library-count div span { display:block }.library-count strong { font:800 1.45rem 'Manrope' }.library-count span { color:var(--muted);font-size:.65rem }.quick-card ul { list-style:none;margin:15px 0;padding:0 }.quick-card li { border-bottom:1px solid var(--border);display:flex;font-size:.72rem;justify-content:space-between;padding:10px 2px }.quick-card li span { color:var(--muted) }.quick-card > a { align-items:center;color:var(--green);display:flex;font-size:.7rem;font-weight:800;gap:5px;margin-top:14px }
.admin-table-wrap { overflow-x:auto }.orders-card table { border-collapse:collapse;min-width:610px;width:100% }.orders-card th { color:var(--muted);font-size:.58rem;letter-spacing:.06em;padding:9px;text-align:left;text-transform:uppercase }.orders-card td { border-top:1px solid var(--border);color:var(--muted);font-size:.68rem;padding:12px 9px }.orders-card td strong { color:var(--text) }.order-status { background:#e2f3df;border-radius:999px;color:var(--green);font-size:.58rem;font-weight:800;padding:5px 8px }.order-status.pending { background:#fff2c2;color:#8a6700 }.messages-card > ul { list-style:none;margin:0;padding:0 }.messages-card li { align-items:center;border-top:1px solid var(--border);display:grid;gap:9px;grid-template-columns:auto 1fr auto;padding:12px 0 }.messages-card li:first-child { border-top:0 }.message-avatar { background:var(--surface-soft);border-radius:50%;color:var(--green);display:grid;font-size:.6rem;font-weight:800;height:34px;place-items:center;width:34px }.messages-card li strong { font-size:.7rem }.messages-card li strong i { background:var(--yellow);border-radius:50%;display:inline-block;height:6px;margin-left:3px;width:6px }.messages-card li p { color:var(--muted);font-size:.62rem;margin:3px 0 0 }.messages-card li small { color:var(--muted);font-size:.56rem }.inbox-summary { align-items:center;background:var(--surface-soft);border-radius:8px;color:var(--muted);display:flex;font-size:.62rem;gap:7px;margin-top:10px;padding:9px }
@media(max-width:1150px){.dashboard-stats{grid-template-columns:repeat(2,1fr)}.dashboard-grid,.dashboard-grid--bottom{grid-template-columns:1fr}}@media(max-width:600px){.dashboard-welcome{align-items:flex-start;flex-direction:column;gap:18px}.dashboard-primary-action{width:100%;justify-content:center}.dashboard-stats{grid-template-columns:1fr}.dashboard-card{padding:18px}}
</style>
