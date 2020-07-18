<template>
    <section>
        <BasedataMenu :menuindex="1"></BasedataMenu>
        <el-card class="box-card pdb0">
            <el-form :model="ruleForm" ref="ruleForm" :inline="true" size="mini" label-width="65px"  class="ruleForm">
                <el-form-item label="当前状态">
                    <el-select v-model="ruleForm.status" placeholder="选择状态" :style="inputwidth">
                        <el-option :label="item.name" :value="item.id" v-for="(item,key) in statuslist" :key="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-bottom: 20px">
                    <el-button type="primary" @click="serchForm('ruleForm')" class="searchbtn">查询</el-button>
                    <el-button @click="resetForm('ruleForm')" class="resetbtn">重置选项</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="box-card pdb0" style="padding-bottom: 20px;">
            <div slot="header" class="clearfix cardsty" style="overflow: hidden;padding-top: 15px;">
                <el-button type="danger" class="cgreen" @click="creattype()" style="float:left;" icon="el-icon-plus" size="mini">创建</el-button>
                <el-select v-model="actiontype" style="float: right;width: 100px" placeholder="批量操作"  size="mini" @change="Allaction">
                    <el-option 
                        v-for="item in actionlist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <el-table
                    :data="tableData"
                    @select-all="selectAll"
                    @select="selectChange"
                    ref="multipleTables"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    border
                    @sort-change='sortChange'>
                <el-table-column
                    type="selection"
                    :selectable="selectable"
                    width="35">
                </el-table-column>
                <el-table-column label="类型名称">
                    <template slot-scope="scope">
                        <span class="displayBlock">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="费用类型" width="140">
                    <template slot-scope="scope">
                        <span :class="['displayBlock typecolor_'+item]" v-for="(item,key) in scope.row.order_type" :key="key">{{scope.row.order_type_enum[key]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="收付类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :class="['displayBlock moneycolor_'+item]" v-for="(item,key) in scope.row.pay_type" :key="key">{{scope.row.pay_type_enum[key]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span :class="['displayBlock', scope.row.status==1 ? 'Fgreen':'Fred']">{{scope.row.status_enum}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" show-overflow-tooltip prop="creat_date" sortable="custom">
                    <template slot-scope="scope">
                        <span class="displayBlock">{{scope.row.create_time || '默认'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="displayBlock">{{scope.row.create_user_name || '默认'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <a @click="Editdialog(scope.row)" style="float: left">编辑</a>
                        <a class="ared" v-if="!scope.row.is_default" @click="Deletedialog(scope.row)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
            <div style="color: #85939E;margin-top: 10px; font-size: 12px;">
                <span class="el-icon-warning" style="color: #85939E;"></span>
                <span>提示：无法禁用/禁用系统默认类型</span>
            </div>
        </el-card>

        <!-- 创建业务类型-->
        <el-dialog title="创建类型" :visible.sync="dialogtype" :close-on-click-modal="false" :before-close="Closecreattype" width="480px">
            <el-form  size="mini"  label-width="120px">
                <el-form-item label="类型名称" required>
                    <el-input v-model="typevalue.name" style="width:215px" maxlength='20' placeholder="类型名称"></el-input>
                </el-form-item>
                <el-form-item label="费用类型" required>
                    <el-checkbox-group v-model="typevalue.order_type"  @change="changeOrderCheck">
                        <el-checkbox label="1">海运</el-checkbox>
                        <el-checkbox label="2" style="margin-left: 10px;">陆运</el-checkbox>
                        <el-checkbox label="3" style="margin-left: 10px;">报关</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="收付类型" required>
                    <el-checkbox-group v-model="typevalue.pay_type"  @change="changePayCheck" style="line-height: 23px;">
                        <el-checkbox label="1">收款</el-checkbox>
                        <el-checkbox label="2" style="margin-left: 10px;">付款</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="状态" required>
                    <el-select v-model="typevalue.status" placeholder="选择状态" style="width:215px">
                        <el-option :label="item.name" :value="item.id" v-for="(item,key) in statuslist" :key="key"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer diagsavebtn">
                <el-button type="primary" @click="Creattype()">确 定</el-button>
                <el-button @click="Closecreattype()">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 编辑业务类型-->
        <el-dialog title="编辑类型" :visible.sync="dialogedit" :close-on-click-modal="false" :before-close="Closeedittype" width="480px">
            <el-form  size="mini"  label-width="120px">
                <el-form-item label="类型名称" required>
                    {{typevalue.is_default?typevalue.name:''}}
                    <el-input v-model="typevalue.name" style="width:215px" maxlength='20' placeholder="类型名称" v-if="!typevalue.is_default"></el-input>
                </el-form-item>
                <el-form-item label="费用类型" required>
                    <el-checkbox-group v-model="typevalue.order_type"  @change="changeOrderCheck">
                        <el-checkbox label="1">海运</el-checkbox>
                        <el-checkbox label="2" style="margin-left: 10px;">陆运</el-checkbox>
                        <el-checkbox label="3" style="margin-left: 10px;">报关</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="收付类型" required>
                    <el-checkbox-group v-model="typevalue.pay_type"  @change="changePayCheck">
                        <el-checkbox label="1">收款</el-checkbox>
                        <el-checkbox label="2" style="margin-left: 10px;">付款</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="状态" required>
                    {{typevalue.is_default?typevalue.status_enum:''}}
                    <el-select v-model="typevalue.status" placeholder="选择状态" style="width:215px" v-if="!typevalue.is_default">
                        <el-option :label="item.name" :value="item.id" v-for="(item,key) in statuslist" :key="key"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer diagsavebtn">
                <el-button type="primary" @click="Edittype()">确 定</el-button>
                <el-button @click="Closeedittype()">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import BasedataMenu from '@/components/BasedataMenu'
    export default {

        data() {
            return {
                ruleForm: {
                    status: 1,
                    sort: '',
                },
                searchValue: {
                    status: 1,
                    sort: '',
                },
                inputwidth: 'width: 135px;margin-right: 5px',
                actiontype: '',
                actionlist: [
                    { name: '启用',id:'1'},
                    { name: '禁用',id:'2'},
                    { name: '删除',id:'3'},
                ],
                unittype:[
                    { name: '全部',id:''},
                    { name: '海运',id:'1'},
                    { name: '陆运',id:'2'},
                    { name: '报关',id:'3'}
                ],
                statuslist: [
                    { name: '正常',id:1},
                    { name: '禁用',id:2}
                ],
                loading: false,
                tableData: [],
                formitemStyle:'20px',
                tableData: [],
                selectDataArrL: [],
                dialogtype: false,
                typevalue: {
                    name: '',
                    order_type: ['1', '2', '3'],
                    pay_type: ['1', '2'],
                    status: 1
                },
                dialogedit: false,
                checkalldata: [],
                datanum: 0
            }
        },
        components:{
            BasedataMenu
        },
        watch:{
            'typevalue':{
               handler(val, oldVal){
                    this.datanum++
                },
                deep:true 
            },
        },
        methods: {
            cellStyle({row,column,rowIndex,columnIndex}){
                return "text-align:center;"
            },
            rowStyle({row,rowIndex}){
                return "text-align:center;"
            },
            selectable(row,index){
                if(row.is_default){
                    return false;//禁用状态
                }else{
                    return true;//非禁用状态
                }
            },
            // 打开弹出框
            creattype(val){
                this.typevalue = {
                    name: '',
                    order_type: ['1', '2', '3'],
                    pay_type: ['1', '2'],
                    status: 1
                },
                this.dialogtype = true
                this.datanum = 0
            },
            // 关闭弹出框
            Closecreattype(){
                if(this.datanum>1){
                    this.$confirm('是否保存数据更改?', '保存确认', {
                        confirmButtonText: '保存',
                        cancelButtonText: '放弃',
                        closeOnClickModal: false
                        }).then(() => {
                            try {
                                this.Creattype()
                            } catch(e) {
                                return false
                            };
                        }).catch(() => {
                            this.dialogtype = false        
                        });
                } else {
                    this.dialogtype = false
                }
            },
            // 业务类型选择
            changeOrderCheck(val){
                this.typevalue.order_type = val
            },
            // 付款方式选择
            changePayCheck(val){
                this.typevalue.pay_type = val
            },
            //创建验证
            Creatyz(){
                let self = this
                Object.keys(self.typevalue).forEach((key) => {
                    if(self.typevalue[key].length<1){
                        if(key=='name'){
                            self.$message.error('请填写类型名称！');
                            throw Error()
                        }
                        if(key=='order_type'){
                            self.$message.error('请选择费用类型！');
                            throw Error()
                        }
                        if(key=='pay_type'){
                            self.$message.error('请选择收付类型！');
                            throw Error()
                        }
                    }
                })
            },
            // 创建类型
            Creattype(){
                let self = this
                try {
                    this.Creatyz()
                } catch(e) {
                    return false
                };
                let params = {
                    name: self.typevalue.name,
                    order_type: self.typevalue.order_type,
                    pay_type: self.typevalue.pay_type,
                    status: self.typevalue.status
                }
                this.$post(this.$getApi('PartnerTypeadd'),params).then((res) => {
                    if(res.error_code==0){
                        self.dialogtype = false
                        self.$message({
                            message: '提示：创建成功！',
                            type: 'success'
                        });
                        self.serchForm()
                    }
                })
            },
            // 关闭修改弹框提示
            Closeedittype(){
                if(this.datanum>1){
                    this.$confirm('是否保存数据更改?', '保存确认', {
                        confirmButtonText: '保存',
                        cancelButtonText: '放弃',
                        closeOnClickModal: false
                        }).then(() => {
                            try {
                                this.Edittype()
                            } catch(e) {
                                return false
                            };
                        }).catch(() => {
                            this.serchForm()
                            this.dialogedit = false        
                        });
                } else {
                    this.dialogedit = false
                }
            },
            // 编辑弹框
            Editdialog(val){
                this.typevalue = JSON.parse(JSON.stringify(val))
                let o = [], p = []
                this.typevalue.order_type.forEach((cal,key)=>{
                    o.push(cal.toString())
                })
                this.typevalue.pay_type.forEach((cal)=>{
                    p.push(cal.toString())
                })
                this.typevalue.order_type = o
                this.typevalue.pay_type = p
                this.dialogedit = true
                this.datanum = 0
            },
            // 修改类型
            Edittype(){
                let self = this
                try {
                    this.Creatyz()
                } catch(e) {
                    return false
                };
                let params = {
                    name: self.typevalue.name,
                    order_type: self.typevalue.order_type,
                    pay_type: self.typevalue.pay_type,
                    status: self.typevalue.status
                }
                this.$post(this.$getApi('PartnerTypeList')+'/'+this.typevalue.id,params).then((res) => {
                    if(res.error_code==0){
                        self.dialogedit = false
                        self.$message({
                            message: '提示：编辑成功！',
                            type: 'success'
                        });
                        self.serchForm()
                    }
                })
            },
            // 搜索
            serchForm(page) {
                let self = this
                let params = {
                }
                self.ruleForm.page = params.page
                let cs = ''
                for(let val in self.searchValue){
                    if(self.ruleForm[val] != ''){
                        params[val] = self.ruleForm[val]
                    }
                }
                for(let val in self.ruleForm){
                    if(self.ruleForm[val] != '' && self.ruleForm[val] != 'null' && self.ruleForm[val] != null){
                        cs = cs == '' ? val + '=' + self.ruleForm[val] : cs+ '&'+ val + '=' + self.ruleForm[val]
                    }
                }
                self.$router.push(self.$route.path + '?' + cs)

                this.PartnerList(params)
            },
            // 清空
            resetForm(formName) {
                this.ruleForm = {
                    status: 1,
                    sort: ''
                }
                this.serchForm()
            },
            // 列表
            PartnerList(params){
                let self = this
                if(params.status){
                    params.status = parseInt(params.status)
                }
                this.$fetch(this.$getApi('PartnerTypeList'),params).then((res) => {
                    self.tableData = res.data.list
                    self.total = res.data.total
                    self.page_size = res.data.page_size
                })
            },
            // 列表中筛选
            sortChange: function(column, prop, order) {
                if(column.prop=='creat_date'){
                    this.ruleForm.sort = column.order=='descending' ? 1:2
                }
                this.serchForm()
            },
            // 批量操作
            Allaction(val){
                let self = this
                let text = '启用'
                if(val=='1'){
                    text = '启用'
                } else if(val=='2') {
                    text = '禁用'
                } else if(val=='3') {
                    text = '删除'
                }
                if (this.checkalldata.length < 1) {
                    this.actiontype = ''
                    this.$alert('请至少选择一条记录！', text+'失败', {
                        confirmButtonText: '确定',
                        callback: action => {
                            
                        }
                    });
                    return
                }
                
                this.$confirm('确认' + text + '吗?', text+'确认', {
                    cancelButtonText: '放弃',
                    confirmButtonText: '确认',
                    closeOnClickModal: false
                    }).then(() => {
                        let params = {
                            id: [],
                            status: val
                        }
                        self.checkalldata.forEach((cal)=>{
                            params.id.push(cal.id)
                        })
                        self.$post(self.$getApi('PartnerTypebatch'),params).then((res) => {
                            if(res.error_code==0){
                                self.dialogedit = false
                                self.$message({
                                    message: '提示：'+text+'成功！',
                                    type: 'success'
                                });
                                self.serchForm()
                            }
                        })
                    }).catch(() => {
                        this.actiontype = ''      
                    });
                this.actiontype = ''
            },
            // 全选
            selectAll (arr) {

            },
            // 单独选择
            selectChange (arr,row) {

            },
            // 多选操作
            handleSelectionChange(val) {
                let self = this
                let valarr = []
                self.checkalldata = []
                val.forEach((item) => {
                    if(item.id > 4){
                        self.checkalldata.push(item)
                    }
                })
            },
            // 删除弹框
            Deletedialog(val){
                let self = this
                let params = {
                    id: [val.id],
                    status: 3
                }
                this.$confirm('此操作将删除，确认删除?', '确认删除', {
                    confirmButtonText: '确认',
                    cancelButtonText: '放弃',
                    closeOnClickModal: false
                    }).then(() => {
                        self.$post(this.$getApi('PartnerTypebatch'),params).then((res) => {
                            if(res.error_code==0){
                                self.$message({
                                    message: '提示：删除成功！',
                                    type: 'success'
                                });
                                self.serchForm()
                            }
                        })
                    }).catch(() => {
                              
                    });
            },
        },
        mounted() {
            let self = this
            let params = {}
            this.currentPage = this.$route.query.page?parseInt(this.$route.query.page):1
            // 处理地址栏参数赋值
            params.status = self.$route.query['status']
            this.PartnerList(params)
        },
    }

</script>
<style scoped lang="scss">
    .el-input.is-disabled .el-input__inner{
        text-align:center;
    }
    .box-card{
        margin-bottom:15px;
    }
    .ruleForm{
        margin-bottom:-20px;
    }
    .tabtrp{
        margin:0px;
        padding: 2px 0px;
    }
    .el-table__row{
        font-size: 12px;
    }
    .Fgreen{
        .el-button--text:focus, .el-button--text:hover{
            color:#2ED47A;
        }
    }
    .typecolor_1{
        height: 16px;
        line-height: 16px;
        padding: 0px 4px;
        background: #EFF6FF;
        border: 1px solid #109CF1;
        font-size: 12px;
        margin-right: 5px;
    }
    .typecolor_2{
        height: 16px;
        line-height: 16px;
        padding: 0px 4px;
        background: #E0F9EB;
        border: 1px solid #1DD397;
        font-size: 12px;
        margin-right: 5px;
    }
    .typecolor_3{
        height: 16px;
        line-height: 16px;
        padding: 0px 4px;
        background: #FFF0E0;
        border: 1px solid #FD9E32;
        font-size: 12px;
        margin-right: 5px;
    }
    .moneycolor_1{
        height: 16px;
        line-height: 16px;
        padding: 0px 4px;
        background: #1DD397;
        border: 1px solid #1DD397;
        font-size: 12px;
        color: #FFFFFF;
        margin-right: 5px;
    }
    .moneycolor_2{
        height: 16px;
        line-height: 16px;
        padding: 0px 4px;
        background: #109CF1;
        border: 1px solid #109CF1;
        font-size: 12px;
        color: #FFFFFF;
        margin-right: 5px;
    }
    .Fred{
        color: #FF6666;
    }
    .Fgreen{
        color: #1DD397;
    }
    a{
        cursor: pointer;
        &:hover{
            text-decoration: #409EFF underline;
        }
    }
    .el-tooltip__popper.is-light{
        border:none;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
    a{
        text-decoration: none;
        &:hover{

        }
    }
    .cgreen{
        background: #2ED47A;
        border: none;
    }
    .el-tabs__item{
        padding-left: 20px;
    }
    .el-button--danger{
        &:hover{
            background: #2ed47a;
        }
    }
    .el-autocomplete-suggestion{
        overflow: auto;
    }
    .addicon{
        color: #1DD397;
        font-size: 16px;
        padding: 0px;
        position: absolute;
        top: 6px;
    }
    .prbtn{
        float:left;
        padding: 6px 5px;
        background: #f5f7fa;
    }
    .ared{
        color: #FF6666;
        float: left;
        margin-left: 5px;
    }
</style>
<style>
    .cardsty .el-input--mini .el-input__inner{
        height: 26px;
        line-height: 26px;
    }
</style>
