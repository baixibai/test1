let base = '';
const Api_Path = {
    // 报价中心
    requestLogin: "/g/price/auth",                      //登陆接口
    Aclmenu: "/api/user/acl/menu",                       // 菜单权限

    //基础数据
    BasedataPartnerList: '/api/erpresource/partner',                    // 合作单位--列表
    
}

export default {
    getApi(name) {
        if (Api_Path[name])
            return base + Api_Path[name]
        return ""
    }
}



