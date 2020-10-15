import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Load from "../components/Load";
import List from "../components/List";
import Verify from "../components/Verify";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      children: [
        {
          path: '/Load',
          name: 'Load',
          component: Load
        },
        {
          path: '/List',
          name: 'List',
          component: List
        },
        {
          path: '/Verify',
          name: 'Verify',
          component: Verify
        },
      ]
    }
  ]
})
