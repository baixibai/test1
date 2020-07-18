
const dispatch = {
    state: {
        boxarr: []
    },
    getters:{
        boxarr: state => state.boxarr,
    },
    // 同步
    mutations: {
        SET_BOXID : (state, payload) => {
            state.boxarr = Array.from(new Set(payload))
        }
    },
    // 异步方式
    actions: {
        SET_BOXID_FUN : (state, payload) => {
            state.commit('SET_BOXID', payload)
        }
    }
}

export default dispatch;
