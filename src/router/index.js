import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { isAdminAuthenticated } from '../composables/useAdminAuth'

const AboutView = () => import('../views/AboutView.vue')
const ServicesView = () => import('../views/ServicesView.vue')
const PortfolioView = () => import('../views/PortfolioView.vue')
const CaseStudyView = () => import('../views/CaseStudyView.vue')
const LearningView = () => import('../views/LearningView.vue')
const PublicationsView = () => import('../views/PublicationsView.vue')
const BookView = () => import('../views/BookView.vue')
const ResourcesView = () => import('../views/ResourcesView.vue')
const ContactView = () => import('../views/ContactView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')
const AdminLoginView = () => import('../views/admin/AdminLoginView.vue')
const AdminLayout = () => import('../components/admin/AdminLayout.vue')
const AdminDashboardView = () => import('../views/admin/AdminDashboardView.vue')
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
        { path: 'sales', name: 'admin-sales', component: AdminSectionView, meta: { title: 'Sales & Orders', admin: true, requiresAdminAuth: true, section: 'sales', description: 'Track Paystack payments, book orders and download fulfilment.' } },
        { path: 'publications', name: 'admin-publications', component: AdminSectionView, meta: { title: 'Publications', admin: true, requiresAdminAuth: true, section: 'publications', description: 'Manage books, pricing, availability and protected ebook files.' } },
        { path: 'messages', name: 'admin-messages', component: AdminSectionView, meta: { title: 'Contact Messages', admin: true, requiresAdminAuth: true, section: 'messages', description: 'Review and respond to enquiries submitted through the website.' } },
        { path: 'newsletter', name: 'admin-newsletter', component: AdminSectionView, meta: { title: 'Newsletter', admin: true, requiresAdminAuth: true, section: 'newsletter', description: 'Manage subscribers and export the mailing list.' } },
        { path: 'settings', name: 'admin-settings', component: AdminSectionView, meta: { title: 'Settings', admin: true, requiresAdminAuth: true, section: 'settings', description: 'Control site details, integrations and administrator preferences.' } },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { title: 'Page not found' } },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to) => {
  const authenticated = isAdminAuthenticated()

  if (to.meta.requiresAdminAuth && !authenticated) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && authenticated) {
    return { name: 'admin-dashboard' }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'Your Digital Partner'} | Edyn Digital Hub`
})

export default router
