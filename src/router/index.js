import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { ensureAdminAuthenticated } from '../composables/useAdminAuth'
import { trackMetaPageView } from '../services/metaPixel'

const AboutView = () => import('../views/AboutView.vue')
const ServicesView = () => import('../views/ServicesView.vue')
const PortfolioView = () => import('../views/PortfolioView.vue')
const CaseStudyView = () => import('../views/CaseStudyView.vue')
const LearningView = () => import('../views/LearningView.vue')
const PublicationsView = () => import('../views/PublicationsView.vue')
const BookView = () => import('../views/BookView.vue')
const ResourcesView = () => import('../views/ResourcesView.vue')
const ContactView = () => import('../views/ContactView.vue')
const PaymentCallbackView = () => import('../views/PaymentCallbackView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')
const AdminLoginView = () => import('../views/admin/AdminLoginView.vue')
const AdminLayout = () => import('../components/admin/AdminLayout.vue')
const AdminDashboardView = () => import('../views/admin/AdminDashboardView.vue')
const AdminPublicationsView = () => import('../views/admin/AdminPublicationsView.vue')
const AdminSalesView = () => import('../views/admin/AdminSalesView.vue')
const AdminMessagesView = () => import('../views/admin/AdminMessagesView.vue')
const AdminNewsletterView = () => import('../views/admin/AdminNewsletterView.vue')
const AdminReviewsView = () => import('../views/admin/AdminReviewsView.vue')
const AdminSectionView = () => import('../views/admin/AdminSectionView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView, meta: { title: 'About' } },
    { path: '/services', name: 'services', component: ServicesView, meta: { title: 'Services' } },
    { path: '/portfolio', name: 'portfolio', component: PortfolioView, meta: { title: 'Portfolio' } },
    { path: '/portfolio/:slug', name: 'case-study', component: CaseStudyView, meta: { title: 'Case Study' } },
    { path: '/edyn-learning', name: 'learning', component: LearningView, meta: { title: 'Edyn Learning' } },
    { path: '/publications', name: 'publications', component: PublicationsView, meta: { title: 'Books & Publications' } },
    { path: '/publications/the-health-you', redirect: '/publications/the-healthy-you' },
    { path: '/publications/the-healthy-you', name: 'the-healthy-you', component: BookView, meta: { title: 'The Healthy You' } },
    { path: '/resources', name: 'resources', component: ResourcesView, meta: { title: 'Resources' } },
    { path: '/contact', name: 'contact', component: ContactView, meta: { title: 'Contact' } },
    { path: '/payment/callback', name: 'payment-callback', component: PaymentCallbackView, meta: { title: 'Payment Status' } },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView,
      meta: { title: 'Admin Login', admin: true, guestOnly: true },
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { admin: true, requiresAdminAuth: true },
      children: [
        { path: '', name: 'admin-dashboard', component: AdminDashboardView, meta: { title: 'Dashboard', admin: true, requiresAdminAuth: true } },
        { path: 'analytics', name: 'admin-analytics', component: AdminSectionView, meta: { title: 'Analytics & Views', admin: true, requiresAdminAuth: true, section: 'analytics', description: 'Monitor website traffic, page performance and visitor activity.' } },
        { path: 'sales', name: 'admin-sales', component: AdminSalesView, meta: { title: 'Sales & Orders', admin: true, requiresAdminAuth: true } },
        { path: 'publications', name: 'admin-publications', component: AdminPublicationsView, meta: { title: 'Publications', admin: true, requiresAdminAuth: true } },
        { path: 'messages', name: 'admin-messages', component: AdminMessagesView, meta: { title: 'Contact Messages', admin: true, requiresAdminAuth: true } },
        { path: 'newsletter', name: 'admin-newsletter', component: AdminNewsletterView, meta: { title: 'Newsletter', admin: true, requiresAdminAuth: true } },
        { path: 'reviews', name: 'admin-reviews', component: AdminReviewsView, meta: { title: 'Reader Reviews', admin: true, requiresAdminAuth: true } },
        { path: 'settings', name: 'admin-settings', component: AdminSectionView, meta: { title: 'Settings', admin: true, requiresAdminAuth: true, section: 'settings', description: 'Control site details, integrations and administrator preferences.' } },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { title: 'Page not found' } },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAdminAuth && !to.meta.guestOnly) return true
  const authenticated = await ensureAdminAuthenticated()

  if (to.meta.requiresAdminAuth && !authenticated) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && authenticated) {
    return { name: 'admin-dashboard' }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'Your Digital Partner'} | Edyn Digital Hub`
  if (!to.path.startsWith('/admin')) {
    trackMetaPageView()
    const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
    let sessionId = sessionStorage.getItem('edyn-visitor-session')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem('edyn-visitor-session', sessionId)
    }
    fetch(`${apiUrl}/api/v1/analytics/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: to.fullPath, sessionId, referrer: document.referrer || undefined }),
      keepalive: true,
    }).catch(() => undefined)
  }
})

export default router
