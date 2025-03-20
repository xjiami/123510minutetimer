import { createRouter, createWebHistory } from 'vue-router'
import TimersView from '../views/TimersView.vue'
import TimerDetail from '../views/TimerDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/timers',
      name: 'timers',
      component: TimersView
    },
    {
      path: '/timers/:theme',
      name: 'timerTheme',
      component: TimerDetail,
      props: true
    },
    {
      path: '/timer/:type',
      name: 'timer',
      component: TimerDetail,
      props: true
    },
    {
      path: '/timer/:unit/:value',
      name: 'fixedTimer',
      component: TimerDetail,
      props: true
    },
    {
      path: '/pickers',
      name: 'pickers',
      component: () => import('../views/Pickers.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsPage.vue')
    },
    {
      path: '/education',
      name: 'education',
      component: () => import('../views/EducationPage.vue')
    },
    {
      path: '/multitask',
      name: 'multitask',
      component: () => import('../views/MultiTaskPage.vue')
    },
    {
      path: '/holidays',
      name: 'holidays',
      component: () => import('../views/HolidaysPage.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactPage.vue')
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsPage.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyPage.vue')
    }
  ]
})

export default router 