<script setup>
import { ArrowDownRight, ArrowUpRight, BookOpen, Eye, Mail, MessageSquare, MoreHorizontal, ReceiptText, Users } from '@lucide/vue'

const stats = [
  { label: 'Website views', value: '12,480', change: '+18.2%', trend: 'up', icon: Eye, tone: 'green' },
  { label: 'Book sales', value: '₦248,500', change: '+12.5%', trend: 'up', icon: ReceiptText, tone: 'yellow' },
  { label: 'New enquiries', value: '24', change: '+8.4%', trend: 'up', icon: MessageSquare, tone: 'lime' },
  { label: 'Subscribers', value: '1,284', change: '-1.3%', trend: 'down', icon: Users, tone: 'cream' },
]

const orders = [
  { customer: 'Amaka E.', book: 'The Healthy You', amount: '₦7,500', status: 'Paid', date: 'Today, 10:24' },
  { customer: 'David O.', book: 'The Healthy You', amount: '₦7,500', status: 'Paid', date: 'Today, 08:16' },
  { customer: 'Tunde A.', book: 'The Healthy You', amount: '₦7,500', status: 'Pending', date: 'Yesterday' },
  { customer: 'Mariam K.', book: 'The Healthy You', amount: '₦7,500', status: 'Paid', date: 'Aug 8, 2026' },
]

const messages = [
  { initials: 'AE', name: 'Amaka Eze', subject: 'Brand strategy enquiry', time: '12 min ago', unread: true },
  { initials: 'DO', name: 'David Okoro', subject: 'Website redesign project', time: '2 hrs ago', unread: true },
  { initials: 'TA', name: 'Tunde A.', subject: 'School worksheet package', time: 'Yesterday', unread: false },
]
</script>

<template>
  <div class="dashboard-view">
    <section class="dashboard-welcome">
      <div><p>Monday, August 10</p><h2>Good to see you, Edyn.</h2><span>Here’s what is happening across your digital hub today.</span></div>
      <RouterLink to="/admin/publications" class="dashboard-primary-action"><BookOpen :size="18" /> Add publication</RouterLink>
    </section>

    <section class="dashboard-stats" aria-label="Performance summary">
      <article v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :class="`stat-icon--${stat.tone}`"><component :is="stat.icon" :size="21" /></div>
        <button type="button" aria-label="More options"><MoreHorizontal :size="18" /></button>
        <p>{{ stat.label }}</p><strong>{{ stat.value }}</strong>
        <span :class="stat.trend"><ArrowUpRight v-if="stat.trend === 'up'" :size="14" /><ArrowDownRight v-else :size="14" />{{ stat.change }} <small>vs last month</small></span>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="dashboard-card traffic-card">
        <header><div><p class="admin-kicker">Traffic overview</p><h3>Website performance</h3></div><select aria-label="Traffic period"><option>Last 7 days</option><option>Last 30 days</option></select></header>
        <div class="traffic-total"><strong>4,892</strong><span>total visits</span><small>+16.8%</small></div>
        <div class="chart-wrap" aria-label="Decorative traffic chart">
          <div class="chart-y"><span>1k</span><span>750</span><span>500</span><span>250</span><span>0</span></div>
          <div class="chart-area"><svg viewBox="0 0 700 190" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FAE2A" stop-opacity=".25"/><stop offset="1" stop-color="#3FAE2A" stop-opacity="0"/></linearGradient></defs><path class="chart-fill" d="M0 150 C60 145,70 95,130 112 S210 130,260 80 S340 45,390 75 S470 125,520 62 S610 30,700 42 L700 190 L0 190Z"/><path class="chart-line" d="M0 150 C60 145,70 95,130 112 S210 130,260 80 S340 45,390 75 S470 125,520 62 S610 30,700 42"/></svg><div class="chart-days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div>
        </div>
      </article>

      <article class="dashboard-card quick-card">
        <header><div><p class="admin-kicker">Publishing</p><h3>Library snapshot</h3></div></header>
        <div class="library-count"><BookOpen :size="27" /><div><strong>3</strong><span>Publications</span></div></div>
        <ul><li><span>Published</span><strong>1</strong></li><li><span>Coming soon</span><strong>2</strong></li><li><span>Digital downloads</span><strong>38</strong></li></ul>
        <RouterLink to="/admin/publications">Manage publications <ArrowUpRight :size="16" /></RouterLink>
      </article>
    </section>

    <section class="dashboard-grid dashboard-grid--bottom">
      <article class="dashboard-card orders-card">
        <header><div><p class="admin-kicker">Commerce</p><h3>Recent book orders</h3></div><RouterLink to="/admin/sales">View all</RouterLink></header>
        <div class="admin-table-wrap"><table><thead><tr><th>Customer</th><th>Publication</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody><tr v-for="order in orders" :key="`${order.customer}-${order.date}`"><td><strong>{{ order.customer }}</strong></td><td>{{ order.book }}</td><td>{{ order.amount }}</td><td><span class="order-status" :class="{ pending: order.status === 'Pending' }">{{ order.status }}</span></td><td>{{ order.date }}</td></tr></tbody></table></div>
      </article>

      <article class="dashboard-card messages-card">
        <header><div><p class="admin-kicker">Inbox</p><h3>Latest messages</h3></div><RouterLink to="/admin/messages">View all</RouterLink></header>
        <ul><li v-for="message in messages" :key="message.name"><span class="message-avatar">{{ message.initials }}</span><div><strong>{{ message.name }} <i v-if="message.unread" /></strong><p>{{ message.subject }}</p></div><small>{{ message.time }}</small></li></ul>
        <div class="inbox-summary"><Mail :size="16" /> 3 unread messages need your attention</div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.dashboard-welcome { align-items: flex-end; display: flex; justify-content: space-between; margin-bottom: 27px; }.dashboard-welcome p { color: var(--green); font-size: .68rem; font-weight: 800; letter-spacing: .08em; margin: 0 0 7px; text-transform: uppercase; }.dashboard-welcome h2 { font: 800 clamp(1.7rem, 3vw, 2.35rem) 'Manrope'; letter-spacing: -.04em; margin: 0 0 5px; }.dashboard-welcome span { color: var(--muted); font-size: .84rem; }.dashboard-primary-action { align-items: center; background: var(--green); border-radius: 10px; color: white; display: flex; font-size: .78rem; font-weight: 700; gap: 8px; min-height: 43px; padding: 0 16px; }
.dashboard-stats { display: grid; gap: 16px; grid-template-columns: repeat(4,1fr); }.dashboard-stats article,.dashboard-card { background: var(--card); border: 1px solid var(--border); border-radius: 15px; box-shadow: 0 8px 24px rgba(23,52,28,.04); }.dashboard-stats article { display: grid; grid-template-columns: 42px 1fr auto; padding: 17px; }.stat-icon { align-items: center; border-radius: 10px; display: flex; height: 42px; justify-content: center; width: 42px; }.stat-icon--green { background:#e1f1de;color:var(--green) }.stat-icon--yellow { background:#fff3c0;color:#8b6900 }.stat-icon--lime { background:#ebf4d9;color:#477c15 }.stat-icon--cream { background:#f1ece1;color:#765e35 }.dashboard-stats button { background: none; border: 0; color: var(--muted); cursor: pointer; grid-column: 3; }.dashboard-stats p { color: var(--muted); font-size: .7rem; grid-column: 1/-1; margin: 15px 0 5px; }.dashboard-stats > article > strong { font: 800 1.45rem 'Manrope'; grid-column:1/-1; }.dashboard-stats article > span { align-items: center; color: var(--fresh-green); display:flex;font-size:.64rem;font-weight:800;gap:3px;grid-column:1/-1;margin-top:9px }.dashboard-stats article > span.down { color:#d14343 }.dashboard-stats article > span small { color:var(--muted);font-weight:500;margin-left:3px }
.dashboard-grid { display:grid;gap:16px;grid-template-columns:1.65fr .75fr;margin-top:16px }.dashboard-grid--bottom { grid-template-columns:1.4fr .8fr }.dashboard-card { min-width:0;padding:22px }.dashboard-card header { align-items:center;display:flex;justify-content:space-between;margin-bottom:20px }.admin-kicker { color:var(--green);font-size:.59rem;font-weight:800;letter-spacing:.11em;margin:0 0 4px;text-transform:uppercase }.dashboard-card h3 { font:700 1rem 'Manrope';margin:0 }.dashboard-card header select { background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:.67rem;padding:7px 9px }.dashboard-card header a { color:var(--green);font-size:.68rem;font-weight:800 }.traffic-total { align-items:baseline;display:flex;gap:7px }.traffic-total strong { font:800 1.65rem 'Manrope' }.traffic-total span { color:var(--muted);font-size:.7rem }.traffic-total small { background:#e4f4df;border-radius:999px;color:var(--green);font-size:.6rem;font-weight:800;margin-left:auto;padding:4px 7px }.chart-wrap { display:flex;height:190px;margin-top:12px }.chart-y { color:var(--muted);display:flex;flex-direction:column;font-size:.57rem;justify-content:space-between;padding-bottom:20px;width:28px }.chart-area { background:repeating-linear-gradient(to bottom,transparent 0,transparent 41px,var(--border) 42px);flex:1;position:relative }.chart-area svg { height:165px;width:100% }.chart-fill { fill:url(#chartFill) }.chart-line { fill:none;stroke:var(--fresh-green);stroke-linecap:round;stroke-width:3 }.chart-days { bottom:0;color:var(--muted);display:flex;font-size:.57rem;justify-content:space-between;left:0;position:absolute;right:0 }.library-count { align-items:center;background:var(--surface-soft);border-radius:12px;color:var(--green);display:flex;gap:14px;padding:15px }.library-count div strong,.library-count div span { display:block }.library-count strong { font:800 1.45rem 'Manrope' }.library-count span { color:var(--muted);font-size:.65rem }.quick-card ul { list-style:none;margin:15px 0;padding:0 }.quick-card li { border-bottom:1px solid var(--border);display:flex;font-size:.72rem;justify-content:space-between;padding:10px 2px }.quick-card li span { color:var(--muted) }.quick-card > a { align-items:center;color:var(--green);display:flex;font-size:.7rem;font-weight:800;gap:5px;margin-top:14px }
.admin-table-wrap { overflow-x:auto }.orders-card table { border-collapse:collapse;min-width:610px;width:100% }.orders-card th { color:var(--muted);font-size:.58rem;letter-spacing:.06em;padding:9px;text-align:left;text-transform:uppercase }.orders-card td { border-top:1px solid var(--border);color:var(--muted);font-size:.68rem;padding:12px 9px }.orders-card td strong { color:var(--text) }.order-status { background:#e2f3df;border-radius:999px;color:var(--green);font-size:.58rem;font-weight:800;padding:5px 8px }.order-status.pending { background:#fff2c2;color:#8a6700 }.messages-card > ul { list-style:none;margin:0;padding:0 }.messages-card li { align-items:center;border-top:1px solid var(--border);display:grid;gap:9px;grid-template-columns:auto 1fr auto;padding:12px 0 }.messages-card li:first-child { border-top:0 }.message-avatar { background:var(--surface-soft);border-radius:50%;color:var(--green);display:grid;font-size:.6rem;font-weight:800;height:34px;place-items:center;width:34px }.messages-card li strong { font-size:.7rem }.messages-card li strong i { background:var(--yellow);border-radius:50%;display:inline-block;height:6px;margin-left:3px;width:6px }.messages-card li p { color:var(--muted);font-size:.62rem;margin:3px 0 0 }.messages-card li small { color:var(--muted);font-size:.56rem }.inbox-summary { align-items:center;background:var(--surface-soft);border-radius:8px;color:var(--muted);display:flex;font-size:.62rem;gap:7px;margin-top:10px;padding:9px }
@media(max-width:1150px){.dashboard-stats{grid-template-columns:repeat(2,1fr)}.dashboard-grid,.dashboard-grid--bottom{grid-template-columns:1fr}}@media(max-width:600px){.dashboard-welcome{align-items:flex-start;flex-direction:column;gap:18px}.dashboard-primary-action{width:100%;justify-content:center}.dashboard-stats{grid-template-columns:1fr}.dashboard-card{padding:18px}}
</style>
