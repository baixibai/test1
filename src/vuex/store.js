import Vue from 'vue'
import Vuex from 'vuex'

import basedata from './Basedata'
import business from './Business'

Vue.use(Vuex)

// 创建 store 实例
export default new Vuex.Store({
    modules: {
        basedata,
        business
    }
})
