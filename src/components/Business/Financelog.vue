<template>
    <div>
        <el-dialog
            title="日志"
            :visible.sync="dialoglogall"
            width="785px"
            :append-to-body='true'
            class="flog"
            @close='closeDialog'>
            <div class="addBill">
                <el-card class="box-card" style="margin-bottom: 10px;">
                    <el-form :model="ruleForm" ref="ruleForm" :inline="true" size="mini" label-width="65px"  class="ruleForm">
                        <el-form-item label="操作时间" width="100">
                            <el-date-picker
                                v-model="ruleForm.starttime"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期"
                                :style="inputwidth">
                            </el-date-picker>
                            <span style="margin-right: 5px;">~</span>
                            <el-date-picker
                                v-model="ruleForm.endtime"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期"
                                :style="inputwidth">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="操作员">
                            <el-autocomplete
                                v-model="ruleForm.user"
                                :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                placeholder="操作员"
                                :style="inputwidth"
                                @select="handleSalesman"
                                popper-class="selectopt">
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item label="收付类型">
                            <el-select v-model="ruleForm.pay_type" placeholder="选择状态" :style="inputwidth">
                                <el-option :label="item.name" :value="item.id" v-for="(item,key) in paylist" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="margin-bottom: 20px">
                            <el-button type="primary" @click="serchForm()" class="searchbtn">查询</el-button>
                            <el-button @click="resetForm('ruleForm')" class="resetbtn">重置选项</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card class="box-card cardTable" style="margin-bottom: 30px;max-height:500px;overflow: auto;">
                    <el-table
                            border
                            :data="tabledata"
                            style="width: 100%"
                            ref="multipleTable"
                            class="Minitabletd"
                            tooltip-effect="dark">
                        <el-table-column label="操作时间">
                            <template slot-scope="scope">
                                <span class="displayBlock">{{scope.row.create_time}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作员">
                            <template slot-scope="scope">
                                <span class="displayBlock">{{scope.row.create_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="收付类型">
                            <template slot-scope="scope">
                                <span class="displayBlock">
                                    {{scope.row.pay_type_enum}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="费用项目">
                            <template slot-scope="scope">
                                <span class="displayBlock">{{scope.row.data_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="详情">
                            <template slot-scope="scope">
                                <span class="displayBlock" style="color: #109CF1;cursor:pointer" @click="Detail(scope.row)">查看</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型">
                            <template slot-scope="scope">
                                <span class="actionsave" style="background: #FFE8E8;border: 1px solid #FF6666;" v-if="scope.row.change_type==3">删除</span>
                                <span class="actionsave" style="background: #FFF0E0;border: 1px solid #FD9E32;" v-if="scope.row.change_type==2">修改</span>
                                <span class="actionsave" style="background: #E0F9EB;border: 1px solid #1DD397;" v-if="scope.row.change_type==1">新增</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="block" style="text-align:center;padding-top:20px;">
                        <el-pagination
                            background
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-size="page_size"
                            layout="total, prev, pager, next"
                            :total="total"
                            v-if="total!=0">
                        </el-pagination>
                    </div>
                </el-card>
            </div>
        </el-dialog>
        <Financelogdetail v-if="dialoglog" :obj="currow" @action="Opendialog"></Financelogdetail>
    </div>
</template>


<script>
    import Financelogdetail from '@/components/Business/Financelogdetail'
    export default {
        name:'Financelog',
        data(){
            return {
                dialoglogall: false,
                dialoglog: false,
                ruleForm: {
                    user: '',
                    user_id: '',
                    starttime: '',
                    endtime: '',
                    pay_type: '',
                    page: '',
                },
                searchValue: {
                    user_id: '',
                    starttime: '',
                    endtime: '',
                    pay_type: '',
                    page: '',
                },
                paylist: [
                    {name: '全部', id: ''},
                    {name: '应收', id: 1},
                    {name: '应付', id: 2}
                ],
                inputwidth: 'width: 135px;margin-right: 5px',
                tabledata: [],
                currentPage: 1,
                total:0,
                formitemStyle:'20px',
                page_size:20,
                currow: {}
            }
        },
        props:{
            obj: Object
        },
         components:{
            Financelogdetail
        },
        created(){
        },
        mounted(){
            this.dialoglogall = true
            this.LogList({})
        },
        methods:{
            // 日志列表
            LogList(params){
                let self = this
                params.order_id = this.obj.order_id
                this.$fetch(this.$getApi('ErpFinancialItemline'),params).then((res) => {
                    if(res.error_code == 0) {
                        self.tabledata = res.data.list
                        self.total = res.data.total
                        self.page_size = res.data.page_size
                    }
                })
            },
            handleCurrentChange(val,ty) {
                this.currentPage = val
                this.serchForm(val)
            },
             // 搜索
            serchForm(page) {
                let self = this
                let params = {
                    page:page?this.currentPage:1
                }
                self.ruleForm.page = params.page
                let cs = ''
                for(let val in self.searchValue){
                    if(self.ruleForm[val] != ''){
                        if(self.ruleForm.starttime!='' && self.ruleForm.endtime!=''){
                            params.operate_time = self.ruleForm.starttime + '~' + self.ruleForm.endtime
                        } else {
                            params[val] = self.ruleForm[val]
                        }
                    }
                }
                this.LogList(params)
            },
            // 清空
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.ruleForm = {
                    user: '',
                    user_id: '',
                    starttime: '',
                    endtime: '',
                    pay_type: '',
                    page: '',
                }
                this.serchForm()
            },
            closeDialog() {
                this.dialoglogall = false
                this.$emit('action',this.dialoglogall)
            },
            // 业务员列表
            Salesmanlist(queryString, cb, $this) {
                let self = this
                this.loading = true;
                let params = {}
                if(queryString!=''){
                    params.s = queryString
                }
                let result=[]
                this.$fetch(this.$getApi('EnterStaff'),params).then((res) => {
                    setTimeout(() => {
                        self.loading = false;
                        res.data.list.forEach((val,key,ary)=>{
                            val.value = val.name + '(' + val.mobile + ')'
                            val.key = key
                        })
                        result = res.data.list
                        cb(result);
                    }, 300);
                })
            },
            // 选中的业务员
            handleSalesman(item) {
                this.ruleForm.user = item.name
                this.ruleForm.user_id = item.id
            },
            Detail(val){
                this.currow = {
                    id: val.financial_item_id
                }
                this.dialoglog = true
                this.$emit('action',this.dialoglog)
            },
            Opendialog(val){
                this.dialoglog = val
            }
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