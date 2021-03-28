import { createWebHistory, createRouter } from 'vue-router'
import ArithmeticTasks from '@/components/ArithmeticTasks.vue'
import Fractions from '@/components/Fractions.vue'
import CompareFractions from '@/components/CompareFractions.vue'

const history = createWebHistory();
const router = createRouter({
    history,
    routes: [
        {
            path: '/',
            component: ArithmeticTasks
        },
        {
            path: '/brok',
            component: Fractions
        } ,       
        {
            path: '/brok2',
            component: CompareFractions
        }
    ]
})

export default router;