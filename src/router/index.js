import Vue from 'vue'
import Router from 'vue-router'
import index from "../App.vue"
import content from '../components/Content.vue'
import lottery from '../components/RecordLottery.vue'
import bet from "../components/RecordBet.vue"

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
        {
            path:'／',
            component: content,
            redirect: '/content/lottery',
            children:[
                {
                    path: 'lottery',
                    component: lottery
                },
                {
                    path: 'bet',
                    component: bet
                }
            ]
        }
    // {
    // 	path: '/',
    // 	redirect: '/lottery'
    // },
    // {
    // 	path: '/lottery',
    //     name: 'lottery',
    // 	component: lottery
    // },
    // {
    // 	path: '/bet',
    //     name: 'bet',
    // 	component: bet
    // },
  ]
});
export default router;
