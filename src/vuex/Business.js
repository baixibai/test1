
const business = {
    state: {
        accountarr: [],
        boxarr: [],
        fyarr: [],
    },
    getters:{
        accountarr: state => state.accountarr,
        boxarr: state => state.boxarr,
        fyarr: state => state.fyarr,
    },
    // 同步
    mutations: {
        SET_Account : (state, payload) => {
            state.accountarr = Array.from(new Set(payload))
        },
        SET_Box : (state, payload) => {
            state.boxarr = Array.from(new Set(payload))
        },
        SET_Fy : (state, payload) => {
            state.fyarr = Array.from(new Set(payload))
        },
    },
    // 异步方式
    actions: {
        SET_Account_FUN : (state, payload) => {
            state.commit('SET_Account', payload)
        },
        SET_Box_FUN : (state, payload) => {
            state.commit('SET_Box', payload)
        },
        SET_Fy_FUN : (state, payload) => {
            state.commit('SET_Fy', payload)
        }
    }
}

export default business;
