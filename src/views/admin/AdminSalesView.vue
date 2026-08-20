<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { LoaderCircle, ReceiptText, RefreshCw } from '@lucide/vue'
import { authorizedAdminFetch } from '../../composables/useAdminAuth'

const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const orders = ref([])
const pagination = ref({ page: 1, pages: 1, total: 0 })
const status = ref('ALL')
const loading = ref(true)
const error = ref('')

const totalShown = computed(() => orders.value.reduce((sum, order) => order.status === 'PAID' ? sum + order.amountMinor : sum, 0))

function money(amount, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount / 100)
}

function date(value) {
  return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

async function loadOrders(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const query = new URLSearchParams({ page: String(page), status: status.value })
    const response = await authorizedAdminFetch(`${apiUrl}/api/v1/admin/dashboard/orders?${query}`)
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error?.message || 'Unable to load orders.')
    orders.value = payload.data.orders
    pagination.value = payload.data.pagination
  } catch (requestError) {
    error.value = requestError.message || 'Unable to load orders.'
  } finally {
    loading.value = false
  }
}

watch(status, () => loadOrders(1))
onMounted(() => loadOrders())
</script>

<template>
  <div class="sales-view">
    <header class="sales-heading"><div><p>Paystack commerce</p><h2>Sales & Orders</h2><span>Track payment status and ebook download fulfilment.</span></div><button type="button" @click="loadOrders(pagination.page)"><RefreshCw :size="16" /> Refresh</button></header>
    <section class="sales-summary"><article><ReceiptText :size="22" /><div><span>Orders in this view</span><strong>{{ pagination.total }}</strong></div></article><article><ReceiptText :size="22" /><div><span>Paid value shown</span><strong>{{ money(totalShown) }}</strong></div></article></section>
    <section class="sales-card">
      <header><div><h3>Order history</h3><span>Live data from the Edyn database</span></div><select v-model="status" aria-label="Filter orders by status"><option value="ALL">All statuses</option><option value="PAID">Paid</option><option value="PENDING">Pending</option><option value="FAILED">Failed</option><option value="CANCELLED">Cancelled</option><option value="REFUNDED">Refunded</option></select></header>
      <p v-if="error" class="sales-error">{{ error }}</p>
      <div v-if="loading" class="sales-loading"><LoaderCircle class="spin" :size="25" /> Loading orders…</div>
      <div v-else class="sales-table-wrap"><table><thead><tr><th>Customer</th><th>Reference</th><th>Provider</th><th>Publication</th><th>Amount</th><th>Status</th><th>Email</th><th>Downloads</th><th>Date</th></tr></thead><tbody><tr v-for="order in orders" :key="order.id"><td><strong>{{ order.customerName || 'Customer' }}</strong><small>{{ order.customerEmail }}</small></td><td>{{ order.reference }}</td><td><span class="provider-pill" :class="order.paymentProvider?.toLowerCase()">{{ order.paymentProvider || 'PAYSTACK' }}</span></td><td>{{ order.book.title }}</td><td>{{ money(order.amountMinor, order.currency) }}</td><td><span class="status-pill" :class="order.status.toLowerCase()">{{ order.status }}</span></td><td><span v-if="order.receiptEmailSentAt" class="email-state sent">Sent</span><span v-else-if="order.receiptEmailError" class="email-state failed" :title="order.receiptEmailError">Failed</span><span v-else class="email-state">Not sent</span></td><td>{{ order.downloadGrant ? `${order.downloadGrant.downloadCount}/${order.downloadGrant.maxDownloads}` : '—' }}</td><td>{{ date(order.createdAt) }}</td></tr><tr v-if="!orders.length"><td colspan="9" class="empty-cell">No orders match this filter.</td></tr></tbody></table></div>
      <footer v-if="pagination.pages > 1"><button :disabled="pagination.page <= 1" @click="loadOrders(pagination.page - 1)">Previous</button><span>Page {{ pagination.page }} of {{ pagination.pages }}</span><button :disabled="pagination.page >= pagination.pages" @click="loadOrders(pagination.page + 1)">Next</button></footer>
    </section>
  </div>
</template>

<style scoped>
.sales-heading{align-items:flex-end;display:flex;justify-content:space-between;margin-bottom:24px}.sales-heading p{color:var(--green);font-size:.64rem;font-weight:800;letter-spacing:.11em;margin:0 0 6px;text-transform:uppercase}.sales-heading h2{font:800 clamp(1.7rem,3vw,2.3rem) 'Manrope';letter-spacing:-.04em;margin:0 0 6px}.sales-heading span{color:var(--muted);font-size:.82rem}.sales-heading button,.sales-card footer button{align-items:center;background:var(--green);border:0;border-radius:9px;color:#fff;cursor:pointer;display:flex;font-size:.7rem;font-weight:800;gap:7px;padding:11px 15px}.sales-summary{display:grid;gap:14px;grid-template-columns:repeat(2,minmax(0,260px));margin-bottom:16px}.sales-summary article{align-items:center;background:var(--card);border:1px solid var(--border);border-radius:13px;color:var(--green);display:flex;gap:13px;padding:17px}.sales-summary span,.sales-summary strong{display:block}.sales-summary span{color:var(--muted);font-size:.61rem}.sales-summary strong{color:var(--text);font:800 1.25rem 'Manrope';margin-top:3px}.sales-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px}.sales-card>header{align-items:center;display:flex;justify-content:space-between;margin-bottom:18px}.sales-card h3{font:800 1rem 'Manrope';margin:0 0 3px}.sales-card header span{color:var(--muted);font-size:.62rem}.sales-card select{background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:8px 10px}.sales-table-wrap{overflow-x:auto}.sales-card table{border-collapse:collapse;min-width:920px;width:100%}.sales-card th{color:var(--muted);font-size:.57rem;letter-spacing:.06em;padding:10px 8px;text-align:left;text-transform:uppercase}.sales-card td{border-top:1px solid var(--border);color:var(--muted);font-size:.65rem;padding:12px 8px}.sales-card td strong,.sales-card td small{display:block}.sales-card td strong{color:var(--text)}.sales-card td small{font-size:.57rem;margin-top:3px}.status-pill{background:#f2f4f7;border-radius:999px;font-size:.55rem;font-weight:800;padding:5px 8px}.status-pill.paid{background:#e2f3df;color:var(--green)}.status-pill.pending{background:#fff2c2;color:#8a6700}.status-pill.failed,.status-pill.cancelled{background:#fff0f0;color:#b42318}.sales-loading{align-items:center;color:var(--muted);display:flex;gap:9px;justify-content:center;min-height:230px}.sales-error{background:#fff0f0;border-radius:8px;color:#b42318;font-size:.7rem;padding:10px}.empty-cell{text-align:center}.sales-card footer{align-items:center;display:flex;gap:12px;justify-content:flex-end;margin-top:17px}.sales-card footer button{padding:8px 11px}.sales-card footer button:disabled{opacity:.45}.sales-card footer span{color:var(--muted);font-size:.62rem}.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:650px){.sales-heading{align-items:flex-start;flex-direction:column;gap:16px}.sales-heading button{justify-content:center;width:100%}.sales-summary{grid-template-columns:1fr}.sales-card{padding:17px}.sales-card>header{align-items:flex-start;flex-direction:column;gap:12px}.sales-card select{width:100%}}
.email-state{color:var(--muted);font-size:.58rem;font-weight:800}.email-state.sent{color:var(--green)}.email-state.failed{color:#b42318}
.provider-pill{background:#e1f3df;border-radius:999px;color:var(--green);font-size:.54rem;font-weight:800;padding:5px 8px}.provider-pill.paypal{background:#e5f3ff;color:#0068a8}
</style>
