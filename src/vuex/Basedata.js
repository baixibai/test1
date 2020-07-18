
const basepdata = {
    state: {
        partnerarr: [],
        financialarr: [],
        currencyarr: [],
        shiparr: [],
        shipinfoarr: [],
        portarr: [],
        addressarr: [],
    },
    getters:{
        partnerarr: state => state.partnerarr,
        financialarr: state => state.financialarr,
        currencyarr: state => state.currencyarr,
        shiparr: state => state.shiparr,
        shipinfoarr: state => state.shipinfoarr,
        portarr: state => state.portarr,
        addressarr: state => state.addressarr,
    },
    // 同步
    mutations: {
        SET_Partner : (state, payload) => {
            state.partnerarr = Array.from(new Set(payload))
        },
        SET_Financial : (state, payload) => {
            state.financialarr = Array.from(new Set(payload))
        },
        SET_Currency : (state, payload) => {
            state.currencyarr = Array.from(new Set(payload))
        },
        SET_Ship : (state, payload) => {
            state.shiparr = Array.from(new Set(payload))
        },
        SET_Shipinfo : (state, payload) => {
            state.shipinfoarr = Array.from(new Set(payload))
        },
        SET_Port : (state, payload) => {
            state.portarr = Array.from(new Set(payload))
        },
        SET_Address : (state, payload) => {
            state.addressarr = Array.from(new Set(payload))
        },
    },
    // 异步方式
    actions: {
        SET_Partner_FUN : (state, payload) => {
            state.commit('SET_Partner', payload)
        },
        SET_Financial_FUN : (state, payload) => {
            state.commit('SET_Financial', payload)
        },
        SET_Currency_FUN : (state, payload) => {
            state.commit('SET_Currency', payload)
        },
        SET_Ship_FUN : (state, payload) => {
            state.commit('SET_Ship', payload)
        },
        SET_Shipinfo_FUN : (state, payload) => {
            state.commit('SET_Shipinfo', payload)
        },
        SET_Port_FUN : (state, payload) => {
            state.commit('SET_Port', payload)
        },
        SET_Address_FUN : (state, payload) => {
            state.commit('SET_Address', payload)
        },
    }
}

export default basepdata;
