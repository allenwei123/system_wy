import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store';
import basis from './modules/basis';
import jobmangement from './modules/jobmangement'
import unioncenter from './modules/unioncenter'
import warehousemangement from './modules/warehouse'
import sysmanagement from './modules/sysmanagement'
import { Message } from 'element-ui';
// import warehousemangement from './modules/mountingsmanger'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      name: 'index',
      path: '/index',
      redirect: 'home',
      component: () => import('@/page/home/_res'),
      children:[
        //主页
        {
          name:'home',
          path:'/home',
          component:() => import('@/page/home/home'),
        },
        ...basis,...jobmangement,...unioncenter,...warehousemangement,...sysmanagement
      ]
    },
    { path: '/auth/login', name: 'login', component: (resolve) => require(["@/page/auth/login"], resolve) },
    ]
})
router.beforeEach((to, from, next) => {
  //判断是否登录且非跳转登录模块
  if (!store.getters.token && to.name !== 'login') {
    store.commit('UPDATE_BEFORE_ROUTERPATH',to.path);
    console.log(to.path);
    console.log('进入登录模块');
    next({name:'login'});
    return false;
  }

  if(to.path === '/home/eportsrMangement'){
    Message.error('该模块暂未开放');
    next(false);
    return false;
  }
  //判断有无权限对象
  //获取权限
  //检查模块权限 无权限则跳转主页
  store.dispatch('updateDirect',to.path);
  next();
})
export default router;

