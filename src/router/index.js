import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import InfoView from '../views/InfoView.vue'
import UploadedView from '../views/UploadedView.vue'
import ViewerView from '../views/ViewerView.vue'
import UploadView from '../views/UploadView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import SearchView from '../views/SearchView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/info',
    name: 'info',
    component: InfoView
  },
  {
    path: '/uploaded',
    name: 'uploaded',
    component: UploadedView
  },
  {
    path: '/viewer/:id',
    name: 'viewer',
    component: ViewerView
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadView
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesView
  },
  {
    path: '/search/:searchTerm',
    name: 'search',
    component: SearchView
  }
]

const router = new VueRouter({
  routes
})

export default router
