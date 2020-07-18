import Vue from 'vue'
import Router from 'vue-router'

const NotFound = resolve => require(['@/views/404.vue'], resolve)
const Home = resolve => require(['@/views/Home.vue'], resolve)
const BasedataPartner = resolve => require(['@/views/Basedata/BasedataPartner.vue'], resolve)
const BasedataTypeset = resolve => require(['@/views/Basedata/BasedataTypeset.vue'], resolve)
const BasedataAddress = resolve => require(['@/views/Basedata/BasedataAddress.vue'], resolve)

Vue.use(Router)

export const fixedRouter = [
    // {
    //     path: '/',
    //     component: Home,
    //     redirect: "/404",
    //     name: '箱信',
    //     iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: '/404', component: NotFound, name: '未找到页面'}
    //     ]
    // },
    {
        path: '/',
        component: Home,
        redirect: "/basedata/partner/unit",
        name: '基础数据',
        iconCls: 'fa fa-id-card-o',//图标样式class
        children: [
            { path: '/basedata/partner/unit', component: BasedataPartner, name: '合作单位'},
            { path: '/basedata/partner/type', component: BasedataTypeset, name: '合作单位'},
            { path: '/basedata/address', component: BasedataAddress, name: '地址管理'},
        ]
    }
];

export default new Router({
    routes: fixedRouter,
    // mode:'history' 去掉#
})
