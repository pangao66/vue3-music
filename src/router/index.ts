import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: () => import('@/views/recommend/recommend.vue'),
      // children: [
      //   {
      //     path: ':id',
      //     component: Album
      //   }
      // ]
    },
    {
      path: '/singer',
      component: () => import('@/views/singer/singer.vue'),
      children: [
        {
          path: ':mid',
          component: ()=>import('@/views/singer-detail/singer-detail.vue')
        }
      ]
    },
    {
      path: '/top-list',
      component: () => import('@/views/top-list/top-list.vue'),
      // children: [
      //   {
      //     path: ':id',
      //     component: TopDetail
      //   }
      // ]
    },
    {
      path: '/search',
      component: () => import('@/views/search/search.vue'),
      // children: [
      //   {
      //     path: ':id',
      //     component: SingerDetail
      //   }
      // ]
    },
    {
      path: '/user',
      component:()=>import('@/views/user-center/user-center.vue')
    }
  ]
})

export default router
