<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { BarChart3, BookOpen, Mail, MessageSquare, Plus, ReceiptText, Settings, Users } from '@lucide/vue'

const route = useRoute()
const sectionData = {
  analytics: { icon: BarChart3, action: 'Export report', label: 'Analytics tools are ready for API data', detail: 'Connect the page-view endpoints to populate traffic sources, popular pages, visitor trends and campaign performance.' },
  sales: { icon: ReceiptText, action: 'Export orders', label: 'Sales management is ready for Paystack data', detail: 'Completed and pending orders will appear here when the Paystack webhook and orders API are connected.' },
  publications: { icon: BookOpen, action: 'Add publication', label: 'Your publication manager is ready', detail: 'Create and update books, prices, cover images, publication status and secure ebook download URLs.' },
  messages: { icon: MessageSquare, action: 'Mark all read', label: 'Contact inbox is ready', detail: 'Website enquiries will appear here after the contact form is connected to the backend messages endpoint.' },
  newsletter: { icon: Users, action: 'Export subscribers', label: 'Newsletter management is ready', detail: 'Manage subscriptions, consent status, imports and CSV exports from this workspace.' },
  settings: { icon: Settings, action: 'Save settings', label: 'Site settings are ready to configure', detail: 'Manage business information, notification preferences, Paystack status and administrator account settings.' },
}
const content = computed(() => sectionData[route.meta.section] || sectionData.analytics)
</script>

<template>
  <div class="admin-section-view">
    <header class="section-view-heading"><div><p class="admin-section-kicker">Management</p><h2>{{ route.meta.title }}</h2><span>{{ route.meta.description }}</span></div><button type="button"><Plus v-if="route.meta.section === 'publications'" :size="17" />{{ content.action }}</button></header>
    <section class="section-empty-state">
      <div class="section-empty-icon"><component :is="content.icon" :size="32" /></div>
      <h3>{{ content.label }}</h3><p>{{ content.detail }}</p>
      <div class="integration-status"><span /><strong>Frontend workspace complete</strong><small>Backend API integration is the next step</small></div>
    </section>
  </div>
</template>

<style scoped>
.section-view-heading{align-items:flex-end;display:flex;justify-content:space-between;margin-bottom:27px}.admin-section-kicker{color:var(--green);font-size:.65rem;font-weight:800;letter-spacing:.11em;margin:0 0 6px;text-transform:uppercase}.section-view-heading h2{font:800 clamp(1.7rem,3vw,2.3rem) 'Manrope';letter-spacing:-.04em;margin:0 0 6px}.section-view-heading span{color:var(--muted);display:block;font-size:.82rem;max-width:620px}.section-view-heading button{align-items:center;background:var(--green);border:0;border-radius:10px;color:white;cursor:pointer;display:flex;font-size:.75rem;font-weight:700;gap:7px;min-height:43px;padding:0 16px}.section-empty-state{align-items:center;background:var(--card);border:1px solid var(--border);border-radius:18px;display:flex;flex-direction:column;justify-content:center;min-height:480px;padding:45px;text-align:center}.section-empty-icon{align-items:center;background:color-mix(in srgb,var(--green) 11%,var(--card));border-radius:17px;color:var(--green);display:flex;height:70px;justify-content:center;width:70px}.section-empty-state h3{font:800 1.35rem 'Manrope';margin:22px 0 9px}.section-empty-state>p{color:var(--muted);font-size:.82rem;line-height:1.7;margin:0;max-width:570px}.integration-status{background:var(--surface-soft);border-radius:11px;display:grid;gap:3px;grid-template-columns:auto 1fr;margin-top:26px;padding:13px 16px;text-align:left}.integration-status>span{background:var(--fresh-green);border-radius:50%;grid-row:1/3;height:9px;margin-right:8px;margin-top:4px;width:9px}.integration-status strong{font-size:.69rem}.integration-status small{color:var(--muted);font-size:.61rem}@media(max-width:650px){.section-view-heading{align-items:flex-start;flex-direction:column;gap:18px}.section-view-heading button{justify-content:center;width:100%}.section-empty-state{min-height:400px;padding:30px 20px}}
</style>
