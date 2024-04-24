import { createRouter, createWebHistory } from "vue-router"

let routes = [
  {
    path: '/',
    redirect: 'login',
    // name: 'home',
    // component: () => import('../view/dashboard/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../view/login/index.vue')
  },
  {
    path: '/three',
    name: 'three',
    component: () => import('../view/modules/three/index.vue')
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('../view/modules/arcgis/index.vue')
  },
  // {
  //   // 配置404页面
  //   path: '/:catchAll(.*)',
  //   name: '404',
  //   component: () => import(''),
  // }
]

// 路由
const router = createRouter({
  history: createWebHistory(),
  routes
})

//导出
export default router;