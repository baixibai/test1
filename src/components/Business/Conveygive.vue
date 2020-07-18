<template>
        <el-dialog
            title="批量派单"
            :visible.sync="dialoglog"
            width="480px"
            :append-to-body='true'
            class="flog"
            @close='closeDialog'>
            <el-form  size="mini"  label-width="120px">
                <el-form-item label="车队名称" required>
                    <el-autocomplete
                        v-model="chedui.convoy_parnter_name"
                        :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this, 'cd')})"
                        placeholder="搜索并选择车队"
                        @select="((item)=>{handlediachedui(item, chedui)})"
                        style="width:215px"
                        popper-class="selectopt">
                        <template slot-scope="{ item }" v-if="item.id==''">
                            <ul class="tableselect">
                                <li class="td" style="text-align:center;" :disabled="true">未找到车队</li>
                            </ul>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item label="派单备注">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        placeholder="请输入派单备注"
                        style="width:215px"
                        v-model="chedui.remark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer diagsavebtn">
                <el-button type="primary" @click="Cheduisubmit()">确 定</el-button>
                <el-button @click="dialoglog=false">取 消</el-button>
            </div>
        </el-dialog>
</template>


<script>
    export default {
        name:'Conveygive',
        data(){
            return {
                dialoglog: false,
                ruleForm: {
                    page: '',
                },
                inputwidth: 'width: 135px;margin-right: 5px',
                chedui: {
                    remark: '',
                    convoy_parnter_id: '',
                    convoy_parnter_name: ''
                },
                formitemStyle:'20px',
                page_size:20,
                checkalldata: []
            }
        },
        props:{
            obj: Array
        },
        created(){
        },
        mounted(){
            this.dialoglog = true
            console.log(this.obj)
            this.checkalldata = this.obj
        },
        methods:{
            // 合作单位列表
            Partnerunitlist(queryString, cb, $this, type) {
                let self = this
                this.loading = true;
                let params = {}
                if(queryString!=''){
                    params.name = queryString
                }
                // if(type && type=='bgh'){
                //     params.partner_type = '报关行'
                // }else if(type && type=='kh'){
                //     params.partner_type = '客户'
                // }else if(type && type=='cd'){
                //     params.partner_type = '车队'
                // }else if(type && type=='wtr' && this.typevalue.partner_id){
                // }else if(type && type=='cgsdl'){
                //     params.partner_type = '船公司代理'
                // }else 
                if(type && type=='wtr' && this.typevalue.partner_id){
                    if(queryString==''){
                        params.name = this.typevalue.partner_name
                    } else {
                        params.name = queryString
                    }
                }
                let result=[]
                this.$fetch(this.$getApi('PartnerSearch'),params).then((res) => {
                    setTimeout(() => {
                        self.loading = false;
                        res.data.forEach((val,key,ary)=>{
                            val.value = val.name + '(' + val.code + ')'
                            val.key = key
                        })
                        if(res.data.length<1){
                            result = [{id: '', value: ''}]
                        } else {
                            result = res.data
                        }
                        cb(result);
                    }, 300);
                })
            },
            handlediachedui(item, row) {
                if(!item.id)return
                this.$set(row, 'convoy_parnter_id', item.id)
                this.$set(row, 'convoy_parnter_name', item.name)
            },
            closeDialog() {
                this.dialoglog = false
                this.$emit('action',this.dialoglog)
            },
            Cheduisubmit(){
                let self = this
                let params = {
                    box_id: [],
                    operate_type: 1,
                    remark_str1: self.chedui.remark
                }
                if(!self.chedui.convoy_parnter_id){
                    self.$message({
                        type: 'error',
                        message: '请选择承运车队 !'
                    });
                    return
                }
                params.convoy_parnter_id = self.chedui.convoy_parnter_id
                self.checkalldata.forEach((cal)=>{
                    params.box_id.push(cal.box_id)
                })
                self.$post(self.$getApi('ErpBoxBatch'),params).then((res) => {
                    if(res.error_code==0){
                        self.dialoglog = false
                        self.$message({
                            message: '提示：分配成功！',
                            type: 'success'
                        });
                        self.$emit('action',this.dialoglog, true)
                    }
                })
            },
        }
}
</script>
<style scoped lang="scss">
.actionsave{
    padding:0px 4px;
    color: #222222;
    font-size: 12px;
    line-height: normal;
    float: left;
}
</style>
<style>
.flog .el-dialog__body{
    padding: 15px;
}
</style>