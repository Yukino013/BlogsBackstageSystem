import {createRouter, createWebHashHistory} from 'vue-router'
let routes = [
    {path:"/test",component:()=>import("../views/Test.vue")},
    {path:"/login",component:()=>import("../views/Login.vue")},
    {path:"/",component:()=>import("../views/HomePage.vue")},
    {path: "/detail", component: () => import("../views/Detail.vue") },
    {path:"/dashboard",component:()=>import("../views/dashboard/Dashboard.vue"),
    children:[
        {path:"/dashboard/category",component:()=>import("../views/dashboard/Category.vue")},
        {path:"/dashboard/article",component:()=>import("../views/dashboard/Article.vue")},
        {path:"/dashboard/person",component:()=>import("../views/dashboard/Person.vue")},
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(), // 指定路由模式，这里使用 hash 模式，也可以使用 history 模式。
    routes, // 定义路由表。
})

export {router,routes};