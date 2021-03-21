import { createWebHistory, createRouter } from 'vue-router'
import ArithmeticTasks from '@/components/ArithmeticTasks.vue'
import Fractions from '@/components/Fractions.vue'

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
        }
    ]
})

export default router;