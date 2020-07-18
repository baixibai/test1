<template>
    <div>
        <el-dialog
            title="日志"
            :visible.sync="dialoglogywall"
            width="785px"
            :append-to-body='true'
            class="flog"
            @close='closeDialog'>
            <div class="addBill">
                <el-card class="box-card" style="margin-bottom: 10px;">
                    <el-form :model="ruleForm" ref="ruleForm" :inline="true" size="mini" label-width="65px"  class="ruleForm">
                        <el-form-item label="操作时间">
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
                        <el-form-item label="业务类型">
                            <el-select v-model="ruleForm.order_type" placeholder="业务类型" :style="inputwidth">
                                <el-option :label="item.name" :value="item.id" v-for="(item,key) in paylist" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="箱号">
                            <el-autocomplete
                                v-model="ruleForm.box"
                                :fetch-suggestions="((item,cb)=>{BoxList(item, cb, this)})"
                                placeholder="箱子"
                                :style="inputwidth"
                                @select="handleBox"
                                popper-class="selectopt">
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item style="margin-bottom: 20px">
                            <el-button type="primary" @click="serchForm()" class="searchbtn">查询</el-button>
                            <el-button @click="resetForm('ruleForm')" class="resetbtn">重置选项</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card class="box-card cardTable" style="margin-bottom: 60px;height: 500px;overflow:auto;">
                    <el-table
                            border
                            :data="tabledata"
                            style="width: 100%"
                            ref="multipleTable"
                            class="Minitabletd"
                            tooltip-effect="dark">
                        <el-table-column label="操作时间" width="100">
                            <template slot-scope="scope">
                                <span class="displayBlock">{{scope.row.operate_time}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作员">
                            <template slot-scope="scope">
                                <span class="displayBlock">{{scope.row.user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="业务类型">
                            <template slot-scope="scope">
                                <span class="displayBlock">
                                    {{scope.row.order_type_enum}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="箱号">
                            <template slot-scope="scope">
                                <span class="displayBlock">{{scope.row.box_code}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="修改内容">
                            <template slot-scope="scope">
                                <span class="displayBlock">{{scope.row.column_name_enum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="原值">
                            <template slot-scope="scope">
                                <span class="displayBlock">{{scope.row.before_value_enum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="新值">
                            <template slot-scope="scope">
                                <span class="displayBlock">{{scope.row.value_enum}}</span>
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
    </div>
</template>


<script>
    export default {
        name:'Financeywlog',
        data(){
            return {
                dialoglogywall: false,
                ruleForm: {
                    user: '',
                    user_id: '',
                    starttime: '',
                    endtime: '',
                    order_type: '',
                    box:'',
                    box_id: '',
                    page: '',
                },
                searchValue: {
                    user_id: '',
                    starttime: '',
                    endtime: '',
                    order_type: '',
                    box_id: '',
                    page: '',
                },
                paylist: [
                    {name: '全部', id: ''},
                    {name: '海运', id: 1},
                    {name: '陆运', id: 2},
                    {name: '报关', id: 3}
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
        created(){
        },
        mounted(){
            this.dialoglogywall = true
            this.LogList({})
        },
        methods:{
            // 日志列表
            LogList(params){
                let self = this
                this.$fetch(this.$getApi('ErpOrder')+'/'+this.obj.order_id+'/line',params).then((res) => {
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
                    order_type: '',
                    box:'',
                    box_id: '',
                    page: '',
                }
                this.serchForm()
            },
            closeDialog() {
                this.dialoglogywall = false
                this.$emit('action',this.dialoglogywall)
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
            // 箱子列表
            BoxList(queryString, cb, $this) {
                let self = this
                this.loading = true;
                let params = {
                    order_id: this.obj.order_id
                }
                if(queryString!=''){
                    params.s = queryString
                }
                let result=[]
                this.$fetch(this.$getApi('BoxSearch'),params).then((res) => {
                    setTimeout(() => {
                        self.loading = false;
                        res.data.forEach((val,key,ary)=>{
                            val.value = val.code
                            val.key = key
                        })
                        result = res.data
                        cb(result);
                    }, 300);
                })
            },
            // 选中的箱子
            handleBox(item) {
                this.ruleForm.box = item.box_ensupe
                this.ruleForm.box_id = item.box_id
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