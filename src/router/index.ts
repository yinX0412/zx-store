import Vue from 'vue';
import VueRouter, {NavigationGuardNext, RawLocation, Route, RouteConfig} from 'vue-router';
import AuthImp from '@/service/auth/AuthImp';

const originalPush: (location: RawLocation) => Promise<Route> = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location: RawLocation) {
    return originalPush.call(this, location).catch(err => err);
};
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/fs',
        redirect: '/fs/main',
        component: () => import('../views/fs/Index.vue'),
        children: [
            {
                path: '/fs/main',
                redirect: '/fs/main/home',
                component: () => import(/* chunkName:FsMain */'../views/fs/main/Index.vue'),
                children: [
                    {
                        path: '/fs/main/home',
                        name: 'mainIndex',
                        component: () => import(/* chunkName:FsMainHome */'../views/fs/main/HomePage.vue'),
                    },
                    {
                        path: '/fs/main/cart',
                        name: 'mainCart',
                        component: () => import(/* chunkName:FsMainCart */'../views/fs/main/Cart.vue'),
                    },
                    {
                        path: '/fs/main/me',
                        name: 'mainMe',
                        component: () => import(/* chunkName:FsMainMe */'../views/fs/main/me/Me.vue'),
                    },
                ]
            },
            {
                path: '/fs/redirectToGetAuthCode',
                component: () => import(/* chunkName:redirectToGetAuthCode */'../views/fs/content/Login.vue')
            },
            {
                path: '/fs/register',
                component: () => import(/* chunkName:register */'../views/fs/content/Register.vue')
            },
            {
                path: '/fs/goods/:id',
                component: () => import(/* chunkName:FsGoodsDetail */'../views/fs/content/Goods.vue')
            },
            {
                path: '/fs/order/list',
                component: () => import(/* chunkName:FsOrderList */'../views/fs/content/order/OrderList.vue')
            },
        ],
    },
    {
        path: '*',
        component: () => import(/* chunkName:404 */'../views/404.vue')
    },
    {
        path: '/',
        redirect: '/fs'
    },
    {
        path: '/bs/login',
        component: () => import(/* chunkName:BsLogin */'../views/bs/Login.vue'),
    },
    {
        path: '/bs',
        component: () => import(/* chunkName:BsIndex */'../views/bs/Index.vue'),
        redirect: '/bs/goods/list',
        children: [
            {
                path: '/bs/goods/list',
                component: () => import(/* chunkName:BsGoodsList */'../views/bs/goods/List.vue'),
            },
            {
                path: '/bs/order/list',
                component: () => import(/* chunkName:BsOrderList */'../views/bs/order/List.vue'),
            },
            {
                path: '/bs/series/list',
                component: () => import(/* chunkName:BsSeriesList */'../views/bs/series/List.vue'),
            },
            {
                path: '/bs/category/list',
                component: () => import(/* chunkName:BsCategoryList */'../views/bs/category/List.vue'),
            },
            {
                path: '/bs/series/create',
                component: () => import(/* chunkName:BsCreateSeries */'../views/bs/series/Create.vue'),
            },
            {
                path: '/bs/category/create',
                component: () => import(/* chunkName:BsCreateCategory */'../views/bs/category/Create.vue'),
            },
            {
                path: '/bs/goods/create',
                component: () => import(/* chunkName:BsCreateGoods */'../views/bs/goods/Create.vue'),
            },
            {
                path: '/bs/category/:id',
                component: () => import(/* chunkName:BsEditCategory */'../views/bs/category/Edit.vue'),
            },
            {
                path: '/bs/series/:id',
                component: () => import(/* chunkName:BsEditSeries */'../views/bs/series/Edit.vue'),
            },
            {
                path: '/bs/goods/:id',
                component: () => import(/* chunkName:BsEditGoods */'../views/bs/goods/Edit.vue'),
            },
        ],
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});
const auth = new AuthImp();
// router.beforeEach((to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
//     auth.getAccessToken()
//         .then((ak) => {
//             if (ak || window.location.pathname.includes('/bs/login')) {
//                 next();
//             } else {
//                 if (window.location.pathname.startsWith('/bs')) {
//                     // 前往后台授权
//                     router.push(`/bs/login?redirect=${window.location.pathname}`);
//                 }
//
//                 if (window.location.pathname.startsWith('/fs')) {
//                     // 前往前台授权
//                 }
//
//             }
//         })
//         .catch((error) => {
//             throw Error(error);
//         });
// });
export default router;
