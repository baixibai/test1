<template>
    <div class="fyinfocomp">
        <el-row :gutter="12">
            <el-col :span="12">
                <el-card shadow="never" style="padding-bottom: 13px;">
                    <el-form size="mini" label-width="80px">
                        <el-form-item label="应收总计" style="margin-bottom: 0px">
                            <span v-if="moneyinfo.in.length>0" v-for="(item, key) in moneyinfo.in" :key="key" style="margin-right: 5px;">{{item.number+'('+item.exchange_rate_code+')'}}</span>
                        </el-form-item>
                        <el-form-item label="应付总计" style="margin-bottom: 0px">
                            <span v-if="moneyinfo.out.length>0" v-for="(item, key) in moneyinfo.out" :key="key" style="margin-right: 5px;">{{item.number+'('+item.exchange_rate_code+')'}}</span>
                        </el-form-item>
                        <el-form-item label="毛利" style="margin-bottom: 0px">
                            <span v-if="moneyinfo.profit.length>0" v-for="(item, key) in moneyinfo.profit" :key="key" style="margin-right: 5px;">{{item.number+'('+item.exchange_rate_code+')'}}</span>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="never">
                    <el-table
                        class="fystatus"
                        :data="tableinfototal"
                        border
                        style="width: 100%">
                        <el-table-column label="账单状态" style="background: #EFF6FF">
                            <template slot-scope="scope">
                                <span class="defspan">{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="海运">
                            <template slot-scope="scope">
                                <span class="defspan" :style="scope.row.shipping.status==12?'color:#1DD397':''">{{scope.row.shipping.status_enum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="陆运">
                            <template slot-scope="scope">
                                <span class="defspan" :style="scope.row.transport.status==12?'color:#1DD397':''">{{scope.row.transport.status_enum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="报关">
                            <template slot-scope="scope">
                                <span class="defspan" :style="scope.row.customs_broker.status==12?'color:#1DD397':''">{{scope.row.customs_broker.status_enum}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-radio-group v-model="fyForm.order_type"  size="mini" @change="tabfychange" style="margin-top: 10px;">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button :label="1">海运</el-radio-button>
            <el-radio-button :label="2">陆运</el-radio-button>
            <el-radio-button :label="3">报关</el-radio-button>
        </el-radio-group>
        <el-card class="box-card" style="margin-top: 10px;">
            <div slot="header" class="clearfix cardsty" style="overflow: hidden;padding-top: 10px;">
                <span style="font-size: 12px;line-height: 22px;">收入费用</span>
                <el-cascader
                    style="float: right;width: 90px;height: 28px;"
                    size="mini"
                    v-model="actiontype"
                    expand-trigger="hover"
                    placeholder="批量操作"
                    :options="actionoptions"
                    @change="Allaction">
                </el-cascader>
                <el-button type="primary" class="cgreen" @click="Addinlist('in')" style="float:right;margin-right: 5px;" size="mini">添加</el-button>
            </div>
            <el-form :inline="true" size="mini" label-width="75px" style="max-height: 400px;overflow:auto">
                <el-table
                        :data="tablefyin"
                        ref="multipleTables"
                        tooltip-effect="dark"
                        style="width: 100%"
                        class="Minitabletd"
                        @selection-change="handleSelectionfyChange"
                        border>
                    <el-table-column
                        type="selection"
                        width="35">
                    </el-table-column>
                    <el-table-column label="业务类型" width="80">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.order_type_enum}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-select v-model="scope.row.order_type" placeholder="请选择" :disabled="fyForm.order_type>0">
                                        <el-option
                                        v-for="(item, key) in drivertypelist"
                                        :key="key"
                                        :label="item.name"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="费用项目">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.data_name}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-autocomplete
                                        v-model="scope.row.data_name"
                                        :fetch-suggestions="((item,cb)=>{FinancialList(item, cb, this)})"
                                        placeholder="费用项目"
                                        @select="((item)=>{handleData(item, scope.row)})"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="收款类型" width="80">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.type_enum}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                正常
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结算单位">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.unit_name}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-autocomplete
                                        v-model="scope.row.unit_name"
                                        :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this, 'in')})"
                                        placeholder="结算单位"
                                        @select="((item)=>{handleUnit(item, scope.row)})"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="单价">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.monovalent}} {{scope.row.exchange_rate_code}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-input v-model="scope.row.monovalent" maxlength='20' placeholder="单价" @keyup.native="changePrice($event,scope.row,'monovalent')"></el-input>
                                    <el-select v-model="scope.row.exchange_rate_id" @change="Changeechange(scope.row)">
                                        <el-option
                                            v-for="(item, key) in scope.row.exchange_rate"
                                            :key="key"
                                            :label="item.code"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" width="60">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.quantity}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-input v-model="scope.row.quantity" maxlength='20' placeholder="数量" @keyup.native="changePrice($event,scope.row,'quantity')"></el-input>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="计费单位">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.quantity_unit}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-autocomplete
                                        v-model="scope.row.quantity_unit"
                                        :fetch-suggestions="((item,cb)=>{Quantityunitlist(item, cb, this, 'in')})"
                                        placeholder="计费单位"
                                        @select="((item)=>{handleQuantityUnit(item, scope.row)})"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="应收金额">
                        <template slot-scope="scope">
                            <span class="defspan">{{scope.row.total_price}} {{scope.row.exchange_rate_code}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="账单状态" width="80">
                        <template slot-scope="scope">
                            <span class="defspan">{{scope.row.status_enum}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="发票" width="80">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.invoice_status_enum}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-select v-model="scope.row.invoice_status">
                                        <el-option
                                            v-for="(item,key) in invoice_status"
                                            :key="key"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{row,$index}">
                            <span style="color: #109CF1;cursor: pointer" @click="EditFy(row)" v-if="!row.isedit && row.status<10">编辑</span>
                            <span style="color: #85939E;cursor: pointer" @click="Show(row, 'in')" v-if="!row.isedit">查看日志</span>
                            <span class="actionsave" style="background: #1DD397" @click="SaveFy(row, 'in')" v-if="row.isedit">保存</span>
                            <span style="color: #222222; cursor: pointer" @click="delFy(row, $index, 'in')" v-if="row.isedit">取消</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </el-card>
         <el-card class="box-card" style="margin-top: 10px;">
            <div slot="header" class="clearfix cardsty" style="overflow: hidden;padding-top: 10px;">
                <span style="font-size: 12px;line-height: 22px;">支出费用</span>
                <el-cascader
                    style="float: right;width: 90px;height: 28px;"
                    size="mini"
                    v-model="actiontype"
                    expand-trigger="hover"
                    placeholder="批量操作"
                    :options="actionout"
                    @change="Allaction">
                </el-cascader>
                <el-button type="primary" class="cgreen" @click="Addinlist('out')" style="float:right;margin-right: 5px;" size="mini">添加</el-button>
            </div>
            <el-form :inline="true" size="mini" label-width="75px" style="max-height: 400px;overflow:auto">
                <el-table
                        :data="tablefyout"
                        ref="multipleTables"
                        tooltip-effect="dark"
                        style="width: 100%"
                        class="Minitabletd"
                        @selection-change="handleSelectionfyChange"
                        border>
                    <el-table-column
                        type="selection"
                        width="35">
                    </el-table-column>
                    <el-table-column label="业务类型" width="80">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.order_type_enum}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-select v-model="scope.row.order_type" placeholder="请选择" :disabled="fyForm.order_type>0">
                                        <el-option
                                        v-for="(item, key) in drivertypelist"
                                        :key="key"
                                        :label="item.name"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="费用项目">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.data_name}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-autocomplete
                                        v-model="scope.row.data_name"
                                        :fetch-suggestions="((item,cb)=>{FinancialList(item, cb, this)})"
                                        placeholder="费用项目"
                                        @select="((item)=>{handleData(item, scope.row)})"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="付款类型" width="80">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.type_enum}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-select v-model="scope.row.type" placeholder="请选择">
                                        <el-option
                                        v-for="(item, key) in typelist"
                                        :key="key"
                                        :label="item.name"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结算单位">
                        <template slot-scope="scope">
                            <p class="defspan" style="width: 100%" v-if="!scope.row.isedit">{{scope.row.unit_name}}</p>
                            <p class="defspan" style="width: 100%" v-if="!scope.row.isedit && scope.row.type==2">(真实){{scope.row.real_name}}</p>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-autocomplete
                                        v-model="scope.row.unit_name"
                                        :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this, 'out')})"
                                        placeholder="结算单位"
                                        @select="((item)=>{handleUnit(item, scope.row)})"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                </el-form-item>
                                <el-form-item v-if="scope.row.type==2">
                                    <el-autocomplete
                                        v-model="scope.row.real_name"
                                        :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this, 'out')})"
                                        placeholder="结算单位(真实)"
                                        @select="((item)=>{handlerealUnit(item, scope.row)})"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="单价">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.monovalent}} {{scope.row.exchange_rate_code}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-input v-model="scope.row.monovalent" maxlength='20' placeholder="单价" @keyup.native="changePrice($event,scope.row,'monovalent')"></el-input>
                                    <el-select v-model="scope.row.exchange_rate_id"  @change="Changeechange(scope.row)">
                                        <el-option
                                            v-for="(item, key) in scope.row.exchange_rate"
                                            :key="key"
                                            :label="item.code"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" width="60">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.quantity}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-input v-model="scope.row.quantity" maxlength='20' placeholder="数量" @keyup.native="changePrice($event,scope.row,'quantity')"></el-input>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="计费单位">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.quantity_unit}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-autocomplete
                                        v-model="scope.row.quantity_unit"
                                        :fetch-suggestions="((item,cb)=>{Quantityunitlist(item, cb, this, 'out')})"
                                        placeholder="计费单位"
                                        @select="((item)=>{handleQuantityUnit(item, scope.row)})"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="应收金额">
                        <template slot-scope="scope">
                            <span class="defspan">{{scope.row.total_price}} {{scope.row.exchange_rate_code}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="账单状态" width="80">
                        <template slot-scope="scope">
                            <span class="defspan">{{scope.row.status_enum}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="发票" width="80">
                        <template slot-scope="scope">
                            <span class="defspan" v-if="!scope.row.isedit">{{scope.row.invoice_status_enum}}</span>
                            <span class="defspan" v-if="scope.row.isedit">
                                <el-form-item>
                                    <el-select v-model="scope.row.invoice_status">
                                        <el-option
                                            v-for="(item,key) in invoice_status"
                                            :key="key"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{row,$index}">
                            <span style="color: #109CF1;cursor: pointer" @click="EditFy(row)" v-if="!row.isedit && row.status<10">编辑</span>
                            <span style="color: #85939E;cursor: pointer" @click="Show(row, 'out')" v-if="!row.isedit">查看日志</span>
                            <span class="actionsave" style="background: #1DD397" @click="SaveFy(row, 'out')" v-if="row.isedit">保存</span>
                            <span style="color: #222222; cursor: pointer" @click="delFy(row, $index, 'out')" v-if="row.isedit">取消</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </el-card>
        <Financelogdetail v-if="dialoglog" :obj="currow" @action="Opendialog"></Financelogdetail>
    </div>
</template>

<script>
    import Fincelog from '@/components/Business/Financelog'
    import Financelogdetail from '@/components/Business/Financelogdetail'
    export default {
        name:'Financeinfo',
        data() {
            return {
                fyForm: {
                    order_type: 0
                },
                order_id:'',
                dialoglog: false,
                moneyinfo: {
                    in:[],
                    out: [],
                    profit: []
                },
                tableinfototal: [{
                    name: '收入费用',
                    shipping: {status: 0, status_enum: "" ,temp_invoice_status: 0, temp_invoice_status_enum: ""},
                    transport: {status: 0, status_enum: "" ,temp_invoice_status: 0, temp_invoice_status_enum: ""},
                    customs_broker: {status: 0, status_enum: "" ,temp_invoice_status: 0, temp_invoice_status_enum: ""},
                }, {
                    name: '支出费用',
                    shipping: {status: 0, status_enum: "" ,temp_invoice_status: 0, temp_invoice_status_enum: ""},
                    transport: {status: 0, status_enum: "" ,temp_invoice_status: 0, temp_invoice_status_enum: ""},
                    customs_broker: {status: 0, status_enum: "" ,temp_invoice_status: 0, temp_invoice_status_enum: ""},
                }],
                tablefyin: [],
                tablefyout: [],
                checkallfy: [],
                status:{
                    1: '记账中',
                    5: '待对账',
                    10: '已对账',
                    15: '已核销',
                    20: '已取消'
                },
                status:{
                    1: '记账中',
                    5: '待对账',
                    10: '已对账',
                    15: '已核销',
                    20: '已取消'
                },
                invoice_status:[
                    { name: '有票',id: 1},
                    { name: '无票',id: 2},
                ],
                drivertypelist:[
                    { name: '海运',id: 1},
                    { name: '陆运',id: 2},
                    { name: '报关',id: 3}
                ],
                typelist: [
                    { name: '正常', id: 1 },
                    { name: '垫付', id: 2 }
                ],
                exchangelist:[],
                actionoptions: [{
                    value: 1,
                    label: '状态修改',
                    children: [{
                        value: 3,
                        label: '提交'
                    }, {
                        value: 4,
                        label: '取消提交'
                    }]
                }, {
                    value: 5,
                    label: '发票',
                    children: [{
                        value: 1,
                        label: '有票'
                    }, {
                        value: 2,
                        label: '无票'
                    }]
                }, {
                    value: 6,
                    label: '复制'
                }, {
                    value: 8,
                    label: '删除'
                }],
                actionout: [{
                    value: 1,
                    label: '状态修改',
                    children: [{
                        value: 3,
                        label: '提交'
                    }, {
                        value: 4,
                        label: '取消提交'
                    }]
                }, {
                    value: 5,
                    label: '发票',
                    children: [{
                        value: 1,
                        label: '有票'
                    }, {
                        value: 2,
                        label: '无票'
                    }]
                }, {
                    value: 7,
                    label: '支转收'
                },{
                    value: 6,
                    label: '复制'
                }, {
                    value: 8,
                    label: '删除'
                }],
                actiontype: [],
                currow: {}
            }
        },
        props:{
            orderid: Number
        },
        components:{
            Fincelog,
            Financelogdetail
        },
        mounted(){
            this.order_id = this.orderid
            this.Fyaction()
            // this.ExchangeList()
        },
        methods: {
            handleCurrentChange(val,ty) {
                this.currentPage = val
                this.serchForm(val)
            },
            tabfychange(val){
                this.financialDatalist(val)
            },
            handleSelectionfyChange(val) {
                this.checkallfy = val;
            },
            // 费用项目列表
            FinancialList(queryString, cb, $this) {
                let self = this
                this.loading = true;
                let params = {}
                if(queryString!=''){
                    params.name = queryString
                }
                let result=[]
                this.$fetch(this.$getApi('FinancialList'),params).then((res) => {
                    setTimeout(() => {
                        self.loading = false;
                        res.data.list.forEach((val,key,ary)=>{
                            val.value = val.name
                            val.key = key
                        })
                        if(res.data.length<1){
                            result = [{none: true}]
                        } else {
                            result = res.data.list
                        }
                        cb(result);
                    }, 300);
                })
            },
            // 选中费用项目
            handleData(item, row) {
                this.$set(row, 'data_id', item.id)
                this.$set(row, 'exchange_rate', item.exchange_rate)
                if(item.exchange_rate.length>0){
                    this.$set(row, 'exchange_rate_id', item.exchange_rate[0].id)
                    this.$set(row, 'exchange_rate_code', item.exchange_rate[0].code)
                }
            },
            Changeechange(val){
                val.exchange_rate.forEach((ic)=>{
                    if(ic.id == val.exchange_rate_id){
                        val.exchange_rate_code = ic.code
                    }
                })
            },
            // 合作单位列表
            Partnerunitlist(queryString, cb, $this, type) {
                let self = this
                this.loading = true;
                let params = {}
                if(queryString!=''){
                    params.name = queryString
                }
                if(type && type == 'in'){
                    params.pay_type = 1
                }
                if(type && type == 'out'){
                    params.pay_type = 2
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
                            result = [{none: true}]
                        } else {
                            result = res.data
                        }
                        cb(result);
                    }, 300);
                })
            },
            // 选中合作单位
            handleUnit(item, row) {
                this.$set(row, 'unit_id', item.id)
            },
            handlerealUnit(item, row) {
                this.$set(row, 'real_id', item.id)
            },
            // 业务员列表
            Quantityunitlist(queryString, cb, $this) {
                let self = this
                this.loading = true;
                let params = {}
                if(queryString!=''){
                    params.s = queryString
                }
                let result=[]
                this.$fetch(this.$getApi('Quantityunit'),params).then((res) => {
                    setTimeout(() => {
                        self.loading = false;
                        let newdata = []
                        res.data.forEach((val,key,ary)=>{
                            newdata.push({id: val, value: val, key: key})
                        })
                        if(res.data.length<1){
                            result = [{id:'', value: ''}]
                        } else {
                            result = newdata
                        }
                        cb(result);
                    }, 300);
                })
            },
            handleQuantityUnit(item, row) {
                this.$set(row, 'quantity_unit', item.id)
            },
            // 汇率列表
            ExchangeList() {
                let self = this
                this.loading = true;
                let params = {}
                let result=[]
                this.$fetch(this.$getApi('CurrencyType'),params).then((res) => {
                    res.data.forEach((val,key,ary)=>{
                        this.exchangelist.push(val)
                    })
                })
            },
            // 费用列表
            financialDatalist(order_type){
                let self = this
                let params = {
                    order_id: this.orderid
                }
                order_type = this.fyForm.order_type
                if(order_type && order_type>0){
                    params.order_type = order_type
                }
                this.$fetch(this.$getApi('ErpFinancialData'),params).then((res) => {
                    if(res.error_code == 0) {
                        self.tablefyin = res.data.in
                        self.tablefyout = res.data.out
                    }
                })
            },
            // 切换到费用信息要执行的
            Fyaction(){
                this.financialDatalist()
                this.FyInfo()
            },
            // 费用信息
            FyInfo(){
                let self = this
                let params = {
                    order_id: this.orderid
                }
                this.$fetch(this.$getApi('ErpFinancialInfo'),params).then((res) => {
                    self.moneyinfo = res.data.price
                    self.tableinfototal[0].shipping = res.data.status.in_shipping
                    self.tableinfototal[0].transport = res.data.status.in_transport
                    self.tableinfototal[0].customs_broker = res.data.status.in_customs_broker
                    self.tableinfototal[1].shipping = res.data.status.out_shipping
                    self.tableinfototal[1].transport = res.data.status.out_transport
                    self.tableinfototal[1].customs_broker = res.data.status.out_customs_broker
                })
            },
            EditFy(row){
                this.$set(row,'isedit',true)
            },
            Creatyz(params){
                let self = this
                Object.keys(params).forEach((key) => {
                    if(params[key].length<1 && key!='status'){
                        self.$message.error('请完善信息！');
                        throw Error()
                    }
                })
            },
            // 批量操作
            Allaction(val){
                let self = this
                if (this.checkallfy.length < 1) {
                    this.actiontype = []
                    this.$alert('请至少选择一条记录！', '操作失败', {
                        confirmButtonText: '确定',
                        callback: action => {
                            
                        }
                    });
                    return
                }
                this.$confirm('确认进行此操作吗?', '操作确认', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确认',
                    closeOnClickModal: false
                    }).then(() => {
                        let params = {
                            id: []
                        }
                        self.checkallfy.forEach((cal)=>{
                            params.id.push(cal.id)
                        })
                        if(val[0] == 5){
                            params.operate_type = val[0]
                            params.invoice_status = val[1]
                        } else if(val[0] == 1){
                            params.operate_type = val[1]
                            params.invoice_status = 1
                        } else {
                            params.operate_type = val[0]
                            params.invoice_status = 1
                        }
                        self.$post(self.$getApi('ErpFinancialDataBatch'),params).then((res) => {
                            if(res.error_code==0){
                                self.$message({
                                    message: '提示：操作成功！',
                                    type: 'success'
                                });
                                self.Fyaction()
                            }
                        })
                    }).catch(() => {
                            
                    });
                this.actiontype = []
            },
            // 添加一行
            Addinlist(type){
                let self = this
                let defvalue = {
                    order_id: this.orderid,
                    order_type:this.fyForm.order_type>0?this.fyForm.order_type:'',
                    data_id: '',
                    pay_type: type=='in'?1:2,
                    type: 1,
                    unit_name:'',
                    unit_id: '',
                    monovalent: '',
                    quantity: '',
                    status: 1,
                    invoice_status: 1,
                    total_price: 0,
                    exchange_rate_id: '',
                    data_name: '',
                    exchange_rate: [],
                    isedit: true,
                    isadd: true
                }
                if(type == 'out'){
                    defvalue.real_id = ''
                    defvalue.real_name = ''
                    self.tablefyout.push(defvalue)
                } else {
                    self.tablefyin.push(defvalue)
                }
                
                
            },
            SaveFy(val, type){
                let self = this
                let params = {
                    order_type: val.order_type,
                    data_id: val.data_id,
                    pay_type: type=='in'?1:2,
                    type: val.type,
                    unit_id: val.unit_id,
                    monovalent: val.monovalent,
                    quantity: val.quantity,
                    status: val.status,
                    invoice_status: val.invoice_status,
                    exchange_rate_id: val.exchange_rate_id,
                    quantity_unit: val.quantity_unit
                }
                try {
                    this.Creatyz(params)
                } catch(e) {
                    return false
                };
                if(val.quantity<1){
                    self.$message.error('数量需大于0！');
                }
                if(val.isadd){
                    params.order_id = this.orderid,
                    self.$post(self.$getApi('ErpFinancialDataAdd'), params).then((res) => {
                        if(res.error_code==0){
                            self.$message({
                                message: '提示：保存成功！',
                                type: 'success'
                            });
                            this.Fyaction()
                        } else {
                            this.Fyaction()
                        }
                    })
                } else {
                    self.$post(self.$getApi('ErpFinancialItem')+'/'+ val.id, params).then((res) => {
                        if(res.error_code==0){
                            self.$message({
                                message: '提示：保存成功！',
                                type: 'success'
                            });
                            this.Fyaction()
                        } else {
                            this.Fyaction()
                        }
                    })
                }
                this.$set(val, 'isedit', false)
            },
            delFy(row, i,type){
                if(type=='in'){
                    if(row.isadd){
                        this.tablefyin.splice(i, 1);
                    } else {
                        this.$set(row, 'isedit', false)
                    }
                }
                if(type=='out'){
                    if(row.isadd){
                        this.tablefyout.splice(i, 1);
                    } else {
                        this.$set(row, 'isedit', false)
                    }
                }
                
            },
            Show(val, type){
                this.dialoglog = false
                this.currow = {
                    order_id: this.orderid,
                    pay_type: type=='in'?1:2,
                    id: val.id
                }
                this.dialoglog = true
            },
            Opendialog(val){
                this.dialoglog = val
            },
            // 正整数
            changeInt(e,val,type){
                var value = e.target.value
                if(value.length==1){
                    val[type]=value.replace(/[^(\-?)\d+]/ig,'')
                }else{
                    val[type]=value.substring(0,1)+value.substring(1,value.length).replace(/[^\d+]/ig,'');
                }
            },
            changeNum(e,val,type){
                let value = e.target.value
                if(value.length==1){
                    val[type]=value.replace(/[^(\-?)\d+]/ig,'')
                }else{
                    val[type]=value.substring(0,1)+value.substring(1,value.length).replace(/[^\d+]/ig,'');
                }
                if(val.monovalent>0){
                    val.total_price = Math.round(val.monovalent * val[type] * 100) / 100
                    val.exchange_rate.forEach((ic)=>{
                        if(ic.id == val.exchange_rate_id){
                            val.exchange_rate_code = ic.code
                        }
                    })
                }
            },
            changePrice(e,val,type){
                let value = e.target.value
                val[type] = value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符   
                val[type] = value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
                val[type]=  value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
                val[type] = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数   
                if(val[type].indexOf(".")< 0 && val[type] !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
                    val[type]= parseFloat(val[type]);  
                } 
                if(val.quantity>0){
                    val.total_price = Math.round(val.monovalent * val.quantity * 100) / 100
                    val.exchange_rate.forEach((ic)=>{
                        if(ic.id == val.exchange_rate_id){
                            val.exchange_rate_code = ic.code
                        }
                    })
                } 
            }
        },
    }

</script>
<style scoped lang="scss">
.defspan{
    margin: 0px;
    margin-right: 5px;
    padding: 0px;
}
.cgreen{
    background: #2ED47A;
    border: none;
}
.actionsave{
    padding:0px 5px;
    color: #ffffff;
    font-size: 12px;
    border-radius: 2px;
    margin-right: 5px;
    cursor: pointer;
    line-height: normal;
}
</style>
<style>
.fystatus .el-table__row td:first-child{
    background: #EFF6FF;
}
.fyinfocomp .el-table .cell{
    padding-left: 5px;
    padding-right: 5px;
}
.fyinfocomp .el-form-item--mini.el-form-item{
    margin-bottom: 0px;
    margin-right: 0px;
}
</style>
