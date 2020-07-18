
export default {
    logtype:function(value){
        var type = {
            create:'创建',
            update:'修改',
            delete:'删除'
        }
        return type[value]
    },
    logdes:function(value,n){
        var arr = value.split('|')
        return arr[n]
    },
    //换单状态
    ordertransfer_status:function(value){
        let type = {
            0:'待上传开柜照片',
            1:'待上传开柜照片，已提交费用',
            9:'已上传开柜照片，待司机扫码',
            10:'司机扫码已完成',
            11:'已交还单据'
        }
        return type[value]
    },
    //箱状态
    boxstatus:function(value){
        let type = {
            100: '待制单',
            210: '已制单待分派',
            220: '已分派待提箱',
            230: '已提箱待出发',
            240: '已出发待到达',
            250: '已到达待装卸货',
            260: '已装卸货待落还箱',
            270: '已落还箱',
            300: '已中止',
            280: '已撤单',
        }
        return type[value]
    },

    //风控等级
    risk_status:function(value){
        let type = {
            1: '正常',
            2: '不正常'
        }
        return type[value]
    },
    //反馈人类型
    feed_type:function(value){
        let type = {
            0: '',
            1: '司机',
            2: '车队'
        }
        return type[value]
    },

    // 箱型
    type_enum:function(value){
        let type = {
            2001: '20GP'
        }
        return type[value]
    },

}
