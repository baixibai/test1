<template>
        <el-dialog
            title="日志"
            :visible.sync="dialoglog"
            width="685px"
            :append-to-body='true'
            class="flog"
            @close='closeDialog'>
            <div class="addBill">
                <el-card class="box-card cardTable" style="margin-bottom: 50px;max-height:500px;overflow: auto;">
                    <el-table
                            border
                            :data="tabledata"
                            style="width: 100%"
                            ref="multipleTable"
                            class="Minitabletd"
                            tooltip-effect="dark">
                        <el-table-column label="操作时间" width="100">
                            <template slot-scope="scope">
                                <span class="displayBlock">{{scope.row.create_time}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作员">
                            <template slot-scope="scope">
                                <span class="displayBlock">{{scope.row.create_user_name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="修改内容">
                            <template slot-scope="scope">
                                <span class="displayBlock">
                                    {{scope.row.column_name}}
                                </span>
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
</template>


<script>
    export default {
        name:'Financelogdetail',
        data(){
            return {
                dialoglog: false,
                ruleForm: {
                    page: '',
                },
                inputwidth: 'width: 135px;margin-right: 5px',
                tabledata: [],
                currentPage: 1,
                total:0,
                formitemStyle:'20px',
                page_size:20,
            }
        },
        props:{
            obj: Object
        },
        created(){
        },
        mounted(){
            this.dialoglog = true
            this.LogList({})
        },
        methods:{
            // 日志列表
            LogList(params){
                let self = this
                params.id = this.obj.id
                this.$fetch(this.$getApi('ErpFinancialItemlinedetail'),params).then((res) => {
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
                this.LogList(params)
            },
            closeDialog() {
                this.dialoglog = false
                this.$emit('action',this.dialoglog)
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