import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
    { path: '/publications/the-health-you', name: 'the-health-you', component: BookView, meta: { title: 'The Health You' } },
    { path: '/resources', name: 'resources', component: ResourcesView, meta: { title: 'Resources' } },
    { path: '/contact', name: 'contact', component: ContactView, meta: { title: 'Contact' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { title: 'Page not found' } },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'Your Digital Partner'} | Edyn Digital Hub`
})

export default router
