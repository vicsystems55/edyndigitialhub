<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  ReceiptText,
  Settings,
  X,
} from '@lucide/vue'
import BrandLogo from '../common/BrandLogo.vue'
import ThemeToggle from '../common/ThemeToggle.vue'
import { authorizedAdminFetch, useAdminAuth } from '../../composables/useAdminAuth'

const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)
const accountOpen = ref(false)
const notificationsOpen = ref(false)
const notifications = ref({ unreadCount: 0, messages: [] })
let notificationTimer
const { profile, signOut } = useAdminAuth()
const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const navigation = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard },
  { label: 'Analytics & Views', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Sales & Orders', to: '/admin/sales', icon: ReceiptText },
  { label: 'Publications', to: '/admin/publications', icon: BookOpen },
  { label: 'Contact Messages', to: '/admin/messages', icon: MessageSquare },
  { label: 'Newsletter', to: '/admin/newsletter', icon: Mail },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

const pageTitle = computed(() => route.meta.title || 'Dashboard')
const initials = computed(() => (profile.value?.name || 'Edyn Admin').split(' ').map((word) => word[0]).slice(0, 2).join(''))

function logout() {
  signOut()
  router.replace('/admin/login')
}

function notificationDate(value) {
  return new Intl.DateTimeFormat('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

async function loadNotifications() {
  try {
    const response = await authorizedAdminFetch(`${apiUrl}/api/v1/admin/communications/notifications`)
    if (!response.ok) return
    const payload = await response.json()
    notifications.value = payload.data
  } catch { /* The next poll retries silently. */ }
}

function toggleNotifications() {
  notificationsOpen.value = !notificationsOpen.value
  accountOpen.value = false
  if (notificationsOpen.value) loadNotifications()
}

onMounted(() => {
  loadNotifications()
  notificationTimer = window.setInterval(loadNotifications, 60000)
  window.addEventListener('edyn-notifications-refresh', loadNotifications)
})

onUnmounted(() => {
  window.clearInterval(notificationTimer)
  window.removeEventListener('edyn-notifications-refresh', loadNotifications)
})
</script>

<template>
  <div class="admin-shell">
    <Transition name="admin-fade">
      <button v-if="sidebarOpen" class="admin-sidebar-backdrop" aria-label="Close navigation" @click="sidebarOpen = false" />
    </Transition>

    <aside class="admin-sidebar" :class="{ 'admin-sidebar--open': sidebarOpen }">
      <div class="admin-sidebar-brand">
        <BrandLogo />
        <button class="admin-sidebar-close" type="button" aria-label="Close navigation" @click="sidebarOpen = false"><X :size="20" /></button>
      </div>

      <div class="admin-workspace-label">Admin workspace</div>
      <nav class="admin-navigation" aria-label="Admin navigation">
        <RouterLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :class="{ active: item.to === '/admin' ? route.path === '/admin' : route.path.startsWith(item.to) }"
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" :size="19" />
          <span>{{ item.label }}</span>
          <small v-if="item.badge">{{ item.badge }}</small>
        </RouterLink>
      </nav>

      <div class="admin-sidebar-help">
        <BookOpen :size="21" />
        <strong>Need assistance?</strong>
        <p>Check the admin guide or contact your developer.</p>
      </div>

      <button class="admin-logout" type="button" @click="logout">
        <LogOut :size="18" /> Log out
      </button>
    </aside>

    <div class="admin-main-column">
      <header class="admin-topbar">
        <div class="admin-topbar-title">
          <button class="admin-mobile-menu" type="button" aria-label="Open navigation" @click="sidebarOpen = true"><Menu :size="21" /></button>
          <div>
            <span>Edyn Digital Hub</span>
            <h1>{{ pageTitle }}</h1>
          </div>
        </div>
        <div class="admin-topbar-actions">
          <ThemeToggle />
          <div class="admin-notification-wrap">
            <button class="admin-notifications" type="button" aria-label="Notifications" :aria-expanded="notificationsOpen" @click="toggleNotifications"><Bell :size="19" /><i v-if="notifications.unreadCount" /></button>
            <div v-if="notificationsOpen" class="admin-notification-menu">
              <header><strong>Notifications</strong><span>{{ notifications.unreadCount }} unread</span></header>
              <RouterLink v-for="message in notifications.messages" :key="message.id" to="/admin/messages" @click="notificationsOpen = false">
                <span>{{ message.name.charAt(0).toUpperCase() }}</span><div><strong>New enquiry from {{ message.name }}</strong><small>{{ message.service || message.email }}</small><time>{{ notificationDate(message.createdAt) }}</time></div>
              </RouterLink>
              <p v-if="!notifications.messages.length">You have no unread enquiries.</p>
              <RouterLink class="notification-all" to="/admin/messages" @click="notificationsOpen = false">View all messages</RouterLink>
            </div>
          </div>
          <div class="admin-account-wrap">
            <button class="admin-account" type="button" :aria-expanded="accountOpen" @click="accountOpen = !accountOpen">
              <span>{{ initials }}</span>
              <div><strong>{{ profile?.name || 'Edyn Admin' }}</strong><small>{{ profile?.role || 'Administrator' }}</small></div>
              <ChevronDown :size="15" />
            </button>
            <div v-if="accountOpen" class="admin-account-menu">
              <p>{{ profile?.email }}</p>
              <button type="button" @click="logout"><LogOut :size="16" /> Log out</button>
            </div>
          </div>
        </div>
      </header>

      <main class="admin-content">
        <RouterView v-slot="{ Component, route: childRoute }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="childRoute.fullPath" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-shell { background: var(--surface-soft); display: flex; min-height: 100vh; }
.admin-sidebar { background: var(--card); border-right: 1px solid var(--border); display: flex; flex-direction: column; min-height: 100vh; padding: 25px 18px; position: fixed; inset: 0 auto 0 0; width: 270px; z-index: 80; }
.admin-sidebar-brand { align-items: center; display: flex; justify-content: space-between; min-height: 54px; padding: 0 8px; }
.admin-sidebar-brand :deep(.brand-words strong) { font-size: 1.02rem; }
.admin-sidebar-brand :deep(.brand-image) { height: 39px; width: 39px; }
.admin-sidebar-close { display: none; }
.admin-workspace-label { color: var(--muted); font-size: .64rem; font-weight: 800; letter-spacing: .13em; margin: 36px 12px 12px; text-transform: uppercase; }
.admin-navigation { display: flex; flex-direction: column; gap: 5px; }
.admin-navigation a { align-items: center; border-radius: 11px; color: var(--muted); display: grid; font-size: .86rem; font-weight: 700; gap: 12px; grid-template-columns: 20px 1fr auto; padding: 12px 13px; transition: .2s ease; }
.admin-navigation a:hover { background: var(--surface-soft); color: var(--green); }
.admin-navigation a.active { background: color-mix(in srgb, var(--green) 11%, var(--card)); color: var(--green); }
.dark .admin-navigation a.active { color: #9ade75; }
.admin-navigation small { background: var(--yellow); border-radius: 999px; color: #263216; display: grid; font-size: .65rem; height: 20px; place-items: center; width: 20px; }
.admin-sidebar-help { background: linear-gradient(145deg, var(--green), var(--green-dark)); border-radius: 15px; color: white; margin-top: auto; padding: 18px; }
.admin-sidebar-help svg { color: var(--yellow); }
.admin-sidebar-help strong { display: block; font: 700 .85rem 'Manrope'; margin-top: 12px; }
.admin-sidebar-help p { color: #d4e4d6; font-size: .72rem; line-height: 1.5; margin: 5px 0 0; }
.admin-logout { align-items: center; background: transparent; border: 0; border-radius: 10px; color: #bd3838; cursor: pointer; display: flex; font-size: .82rem; font-weight: 700; gap: 10px; margin-top: 12px; padding: 11px 13px; }
.admin-main-column { margin-left: 270px; min-width: 0; width: calc(100% - 270px); }
.admin-topbar { align-items: center; background: color-mix(in srgb, var(--card) 92%, transparent); backdrop-filter: blur(15px); border-bottom: 1px solid var(--border); display: flex; height: 84px; justify-content: space-between; padding: 0 34px; position: sticky; top: 0; z-index: 50; }
.admin-topbar-title { align-items: center; display: flex; gap: 12px; }
.admin-topbar-title span { color: var(--muted); display: block; font-size: .67rem; margin-bottom: 2px; }
.admin-topbar-title h1 { font: 800 1.25rem 'Manrope'; margin: 0; }
.admin-mobile-menu { display: none; }
.admin-topbar-actions { align-items: center; display: flex; gap: 10px; }
.admin-notifications,.admin-mobile-menu,.admin-sidebar-close { align-items: center; background: var(--card); border: 1px solid var(--border); border-radius: 50%; color: var(--text); cursor: pointer; height: 42px; justify-content: center; position: relative; width: 42px; }
.admin-notification-wrap { position: relative; }.admin-notifications { display: flex; }
.admin-notifications i { background: var(--yellow); border: 2px solid var(--card); border-radius: 50%; height: 8px; position: absolute; right: 8px; top: 7px; width: 8px; }
.admin-notification-menu { background: var(--card); border: 1px solid var(--border); border-radius: 14px; box-shadow: var(--shadow); min-width: 330px; overflow: hidden; position: absolute; right: 0; top: 52px; z-index: 10; }.admin-notification-menu>header { align-items:center; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; padding:14px 15px; }.admin-notification-menu>header strong{font-size:.78rem}.admin-notification-menu>header span{color:var(--green);font-size:.6rem;font-weight:800}.admin-notification-menu>a:not(.notification-all){align-items:flex-start;border-bottom:1px solid var(--border);color:var(--text);display:flex;gap:10px;padding:12px 15px}.admin-notification-menu>a>span{background:color-mix(in srgb,var(--green) 14%,var(--card));border-radius:50%;color:var(--green);display:grid;flex:0 0 32px;font-size:.67rem;font-weight:800;height:32px;place-items:center}.admin-notification-menu a div{min-width:0}.admin-notification-menu a strong,.admin-notification-menu a small,.admin-notification-menu a time{display:block}.admin-notification-menu a strong{font-size:.67rem}.admin-notification-menu a small,.admin-notification-menu a time{color:var(--muted);font-size:.56rem;margin-top:3px}.admin-notification-menu>p{color:var(--muted);font-size:.67rem;margin:0;padding:28px 15px;text-align:center}.admin-notification-menu .notification-all{color:var(--green);display:block;font-size:.66rem;font-weight:800;padding:12px;text-align:center}
.admin-account-wrap { position: relative; }
.admin-account { align-items: center; background: transparent; border: 0; color: var(--text); cursor: pointer; display: flex; gap: 10px; padding: 3px; }
.admin-account > span { background: linear-gradient(135deg, var(--green), var(--fresh-green)); border-radius: 50%; color: white; display: grid; font-size: .72rem; font-weight: 800; height: 40px; place-items: center; width: 40px; }
.admin-account div { text-align: left; }
.admin-account strong,.admin-account small { display: block; }
.admin-account strong { font-size: .76rem; }
.admin-account small { color: var(--muted); font-size: .65rem; margin-top: 2px; }
.admin-account-menu { background: var(--card); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow); min-width: 220px; padding: 12px; position: absolute; right: 0; top: 55px; }
.admin-account-menu p { color: var(--muted); font-size: .7rem; margin: 2px 4px 10px; overflow: hidden; text-overflow: ellipsis; }
.admin-account-menu button { align-items: center; background: var(--surface-soft); border: 0; border-radius: 8px; color: #bd3838; cursor: pointer; display: flex; font-size: .75rem; font-weight: 700; gap: 8px; padding: 10px; width: 100%; }
.admin-content { padding: 32px 34px 55px; }
.admin-sidebar-backdrop { background: rgba(3, 20, 8, .55); border: 0; inset: 0; position: fixed; z-index: 70; }
.admin-fade-enter-active,.admin-fade-leave-active { transition: opacity .2s; }.admin-fade-enter-from,.admin-fade-leave-to { opacity: 0; }
@media (max-width: 980px) {
  .admin-sidebar { box-shadow: 20px 0 50px rgba(0,0,0,.18); transform: translateX(-105%); transition: transform .25s ease; }.admin-sidebar--open { transform: translateX(0); }.admin-sidebar-close,.admin-mobile-menu { display: inline-flex; }.admin-main-column { margin-left: 0; width: 100%; }
}
@media (max-width: 640px) {
  .admin-topbar { height: 74px; padding: 0 16px; }.admin-content { padding: 22px 16px 45px; }.admin-account div,.admin-account > svg { display: none; }.admin-topbar-title span { display: none; }.admin-topbar-title h1 { font-size: 1rem; }.admin-notification-menu{min-width:min(330px,calc(100vw - 32px));right:-52px}
}
</style>
