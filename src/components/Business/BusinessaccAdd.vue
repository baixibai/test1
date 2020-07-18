<template>
    <section>
        <!-- 创建-->
        <el-dialog title="选择业务类型" class="diagcreatywd" :visible.sync="dialogtype" :close-on-click-modal="false">
            <el-form  size="mini"  label-width="120px">
                <el-form-item label="进出口" required>
                    <el-radio-group v-model="typevalue.import_type" @change="checktype">
                        <el-radio :label="1">出口</el-radio>
                        <el-radio :label="2" style="margin-left: 10px;">进口</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="费用类型" required>
                    <el-checkbox-group v-model="typevalue.order_type"  @change="changeOrderCheck">
                        <el-checkbox label="1">海运</el-checkbox>
                        <el-checkbox label="2" style="margin-left: 10px;">陆运</el-checkbox>
                        <el-checkbox label="3" style="margin-left: 10px;">报关</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <p class="tip">* 进出口选择后将无法修改</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer diagsavebtn">
                <el-button type="primary" @click="Creattype2()">确 定</el-button>
                <el-button @click="dialogtype = false">取 消</el-button>
            </div>
        </el-dialog>
        <Financelog v-if="dialoglogall" :obj="currow" @action="Opendialogall"></Financelog>
        <!-- 创建2-->
        <el-dialog :title="typevalue.id?'编辑业务单':'创建业务单'" class="diaimport" id="diaimport" :visible.sync="dialogtype2" :close-on-click-modal="false"  :before-close="Closeedittype">
            <el-card shadow="never" class="card1">
                <el-tabs v-model="dialogtab" @tab-click="handleClick" class="tabdialog2">
                    <el-tab-pane label="业务信息" name="1"></el-tab-pane>
                    <el-tab-pane label="费用信息" name="2" v-if="dialogtext=='edit'"></el-tab-pane>
                </el-tabs>
                <div style="display: inline-block;float: right;margin-top: 5px;">
                    <el-button type="primary" class="cgreen" v-if="dialogtab=='1'"  @click="Creattype('add')" style="float:right;margin-left: 5px;height: 22px;line-height:22px;padding: 0px 12px;" size="mini">保存</el-button>
                    <el-button v-if="dialogtab=='2'"  @click="Openlog()" style="float:right;margin-left: 5px;height: 22px;line-height:22px;padding: 0px 12px;" size="mini">日志</el-button>
                    <!-- <el-select v-model="actiontype" style="float: right;width: 100px" placeholder="操作"  size="mini" @change="Allaction">
                        <el-option 
                            v-for="item in actionlist"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select> -->
                </div>
            </el-card>
            <div style="padding: 15px;" v-if="dialogtab=='1'">
                <el-card class="cjywdtwo">
                    <el-form :inline="true" size="mini" label-width="75px">
                        <div style="display: inline-block;width: 310px;float:left;">
                            <el-form-item label="业务单号">
                                <span style="width: 215px;float: left;">{{typevalue.code || '-'}}</span>
                            </el-form-item>
                            <el-form-item label="委托单位" required>
                                <el-autocomplete
                                    v-model="typevalue.partner_name"
                                    :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                    placeholder="委托单位"
                                    style="width:216px"
                                    @select="handlepartner"
                                    popper-class="selectopt">
                                </el-autocomplete>
                            </el-form-item>
                            <el-form-item label="付款单位" required>
                                <el-autocomplete
                                    v-model="typevalue.unit_name"
                                    :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                    placeholder="付款单位"
                                    style="width:216px"
                                    @select="handleunit"
                                    :title="typevalue.unit_name"
                                    popper-class="selectopt">
                                </el-autocomplete>
                            </el-form-item>
                            <el-form-item label="提单号" required>
                                <el-input v-model="typevalue.bl_no" style="width:216px" maxlength='20' placeholder="提单号"></el-input>
                            </el-form-item>
                            <el-form-item label="合同号">
                                <el-input v-model="typevalue.contract_no" style="width:216px" maxlength='20' placeholder="合同号"></el-input>
                            </el-form-item>
                            <el-form-item label="业务员" style="margin-bottom: 0px;">
                                <el-autocomplete
                                    v-model="typevalue.salesman_user"
                                    :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                    placeholder="业务员"
                                    style="width:75px"
                                    @select="handleSalesman"
                                    :title="typevalue.salesman_user"
                                    popper-class="selectopt">
                                </el-autocomplete>
                                <el-form-item label="操作员" label-width="60px">
                                    <el-autocomplete
                                        v-model="typevalue.operator_user"
                                        :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                        placeholder="操作员"
                                        style="width:76px"
                                        @select="handleOperator"
                                        :title="typevalue.operator_user"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                </el-form-item>
                            </el-form-item>
                            <el-form-item label="联系方式">
                                <el-autocomplete
                                    v-model="typevalue.partner_contact_name"
                                    :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                    placeholder="联系人"
                                    style="width:106px"
                                    @select="handlecontact"
                                    :title="typevalue.partner_contact_name"
                                    popper-class="selectopt">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect" v-if="!item.none">
                                            <li v-if="item.key<1" class="tr"><span style="width:40%">联系人</span><span style="width:60%">联系电话</span></li>
                                            <li class="td" v-for="(cal,key) in item.contact" :key="key"><span style="width:40%">{{cal.name}}</span><span style="width:60%">{{cal.mobile}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                                <el-autocomplete
                                    v-model="typevalue.partner_contact_mobile"
                                    :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                    placeholder="联系电话"
                                    style="width:106px"
                                    @select="handlecontact"
                                    :title="typevalue.partner_contact_mobile"
                                    popper-class="selectopt s2">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:40%">联系人</span><span style="width:60%">联系电话</span></li>
                                            <li class="td" v-for="(cal,key) in item.contact" :key="key"><span style="width:40%">{{cal.name}}</span><span style="width:60%">{{cal.mobile}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                        </div>
                        <div style="display: inline-block;width: 310px;float:left;">
                            <el-form-item label="船公司">
                                <el-autocomplete
                                    v-model="typevalue.ship_company_code"
                                    :fetch-suggestions="((item,cb)=>{Shipcompanylist(item, cb, this)})"
                                    placeholder="代码"
                                    style="width:69px"
                                    @select="handleshipcompany"
                                    :title="typevalue.ship_company_code"
                                    popper-class="selectopt">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                                <el-autocomplete
                                    v-model="typevalue.ship_company_eng_name"
                                    :fetch-suggestions="((item,cb)=>{Shipcompanylist(item, cb, this)})"
                                    placeholder="英文名称"
                                    style="width:69px"
                                    @select="handleshipcompany"
                                    :title="typevalue.ship_company_eng_name"
                                    popper-class="selectopt s2">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                                <el-autocomplete
                                    v-model="typevalue.ship_company_chn_name"
                                    :fetch-suggestions="((item,cb)=>{Shipcompanylist(item, cb, this)})"
                                    placeholder="中文名称"
                                    style="width:70px"
                                    @select="handleshipcompany"
                                    :title="typevalue.ship_company_chn_name"
                                    popper-class="selectopt s3">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                            <el-form-item label="船名">
                                <el-autocomplete
                                    v-model="typevalue.ship_eng_name"
                                    :fetch-suggestions="((item,cb)=>{Shiplist(item, cb, this)})"
                                    placeholder="英文名称"
                                    style="width:106px"
                                    @select="handleship"
                                    :title="typevalue.ship_eng_name"
                                    popper-class="selectopt">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:50%">英文名称</span><span style="width:50%">中文名称</span></li>
                                            <li class="td"><span style="width:50%">{{item.eng_name}}</span><span style="width:50%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                                <el-autocomplete
                                    v-model="typevalue.ship_chn_name"
                                    :fetch-suggestions="((item,cb)=>{Shiplist(item, cb, this)})"
                                    placeholder="中文名称"
                                    style="width:106px"
                                    @select="handleship"
                                    :title="typevalue.ship_chn_name"
                                    popper-class="selectopt ts2">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:50%">英文名称</span><span style="width:50%">中文名称</span></li>
                                            <li class="td"><span style="width:50%">{{item.eng_name}}</span><span style="width:50%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                            <el-form-item label="航次">
                                <el-input v-model="typevalue.ship_voyage" style="width:215px" maxlength='10' placeholder="航次"></el-input>
                            </el-form-item>
                            <el-form-item label="起运港">
                                <el-autocomplete
                                    v-model="typevalue.pol_code"
                                    :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                    placeholder="代码"
                                    style="width:69px"
                                    @select="handlePol"
                                    :title="typevalue.pol_code"
                                    popper-class="selectopt">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                                <el-autocomplete
                                    v-model="typevalue.pol_eng_name"
                                    :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                    placeholder="英文名称"
                                    style="width:69px"
                                    @select="handlePol"
                                    :title="typevalue.pol_eng_name"
                                    popper-class="selectopt s2">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                                <el-autocomplete
                                    v-model="typevalue.pol_chn_name"
                                    :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                    placeholder="中文名称"
                                    style="width:70px"
                                    @select="handlePol"
                                    :title="typevalue.pol_chn_name"
                                    popper-class="selectopt s3">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                            <el-form-item label="目的港">
                                <el-autocomplete
                                    v-model="typevalue.pod_code"
                                    :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                    placeholder="代码"
                                    style="width:69px"
                                    @select="handlePod"
                                    :title="typevalue.pod_code"
                                    popper-class="selectopt">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                                <el-autocomplete
                                    v-model="typevalue.pod_eng_name"
                                    :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                    placeholder="英文名称"
                                    style="width:69px"
                                    @select="handlePod"
                                    :title="typevalue.pod_eng_name"
                                    popper-class="selectopt s2">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                                <el-autocomplete
                                    v-model="typevalue.pod_chn_name"
                                    :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                    placeholder="中文名称"
                                    style="width:70px"
                                    @select="handlePod"
                                    :title="typevalue.pod_chn_name"
                                    popper-class="selectopt s3">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                            <el-form-item label="中转港">
                                <el-autocomplete
                                    v-model="typevalue.pot_code"
                                    :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                    placeholder="代码"
                                    style="width:69px"
                                    @select="handlePot"
                                    :title="typevalue.pot_code"
                                    popper-class="selectopt">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                                <el-autocomplete
                                    v-model="typevalue.pot_eng_name"
                                    :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                    placeholder="英文名称"
                                    style="width:69px"
                                    @select="handlePot"
                                    :title="typevalue.pot_eng_name"
                                    popper-class="selectopt s2">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                                <el-autocomplete
                                    v-model="typevalue.pot_chn_name"
                                    :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                    placeholder="中文名称"
                                    style="width:70px"
                                    @select="handlePot"
                                    :title="typevalue.pot_chn_name"
                                    popper-class="selectopt s3">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                        </div>
                        <div style="display: inline-block;width: 310px;float:left;">
                            <el-form-item label="货物名称">
                                <el-autocomplete
                                    v-model="typevalue.product_eng_name"
                                    :fetch-suggestions="((item,cb)=>{Productlist(item, cb, this)})"
                                    placeholder="英文代码"
                                    style="width:106px"
                                    @select="handleproduct"
                                    :title="typevalue.product_eng_name"
                                    popper-class="selectopt">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect" v-if="!item.none">
                                            <li v-if="item.key<1" class="tr"><span style="width:50%">英文名称</span><span style="width:50%">中文名称</span></li>
                                            <li class="td"><span style="width:50%">{{item.product_eng_name}}</span><span style="width:50%">{{item.product_chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                                <el-autocomplete
                                    v-model="typevalue.product_chn_name"
                                    :fetch-suggestions="((item,cb)=>{Productlist(item, cb, this)})"
                                    placeholder="中文品名"
                                    style="width:106px"
                                    @select="handleproduct"
                                    :title="typevalue.product_chn_name"
                                    popper-class="selectopt ts2">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:50%">英文名称</span><span style="width:50%">中文名称</span></li>
                                            <li class="td"><span style="width:50%">{{item.product_eng_name}}</span><span style="width:50%">{{item.product_chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                            <el-form-item label="箱量" class="xxselect">
                                <div style="float: left;width:216px;">
                                    <span v-for="(val,key) in typevalue.box" :key="key" :style="key%2 != 0 ? 'margin-right:0px;' : 'margin-right:4px;'">
                                        <el-select v-model="val.box_size_type" placeholder="箱型" style="width:72px">
                                            <el-option
                                                v-for="item in boxsizelist"
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <el-input class="xxinput" v-model="val.count" style="width:30px" maxlength='20' placeholder="0"></el-input>
                                    </span>
                                </div>
                            </el-form-item>
                            <el-form-item label="件数">
                                <el-input v-model="typevalue.pieces" style="width:69px" maxlength='20' placeholder="件数"></el-input>
                                <el-input v-model="typevalue.pieces_eng_desc" style="width:69px" maxlength='20' placeholder="英文名称"></el-input>
                                <el-input v-model="typevalue.pieces_desc" style="width:69px" maxlength='20' placeholder="中文名称"></el-input>
                                
                                <!-- <el-autocomplete
                                    v-model="typevalue.pieces_eng_desc"
                                    :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this,'js')})"
                                    placeholder="英文名称"
                                    style="width:69px"
                                    @select="handlePot"
                                    :title="typevalue.pot_eng_name"
                                    popper-class="selectopt">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete> -->
                                <!-- <el-autocomplete
                                    v-model="typevalue.pieces_desc"
                                    :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this, 'js')})"
                                    placeholder="中文名称"
                                    style="width:70px"
                                    @select="handlePot"
                                    :title="typevalue.pot_chn_name"
                                    popper-class="selectopt s2">
                                    <template slot-scope="{ item }">
                                        <ul class="tableselect">
                                            <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                            <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                        </ul>
                                    </template>
                                </el-autocomplete> -->
                            </el-form-item>
                            <el-form-item label="重量/体积">
                                <el-input v-model="typevalue.weight" type="text" style="width:106px" maxlength='20' placeholder="重量">
                                    <i slot="suffix" class="icontext">KG</i>
                                </el-input>
                                <el-input v-model="typevalue.volume" type="text" style="width:106px" maxlength='20' placeholder="体积">
                                    <i slot="suffix" class="icontext">CMB</i>
                                </el-input>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-card>
                <div style="width: 100%;margin: 10px 0px;" class="cjywdtab">
                    <el-radio-group v-model="tabordertype" size="mini" @change="tabchange">
                        <el-radio-button label="2"
                            v-for="item in this.typevalue.order_type"
                            :key="item"
                            :label="item">
                            {{item==1?'海运':item==2?'陆运':'报关'}}
                        </el-radio-button>
                    </el-radio-group>
                    <!-- <el-button style="float: right; padding:0px 12px;line-height: 20px;" size="mini">删除</el-button>
                    <el-select v-model="actiontype" style="float: right;width: 100px;margin-right: 2px;" placeholder="批量操作"  size="mini" @change="Allaction">
                        <el-option 
                            v-for="item in actionlist"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select> -->
                </div>
                <!-- 海运 -->
                <el-row :gutter="12" class="infocard"  v-if="tabordertype==1">
                    <el-col :span="8">
                        <el-card shadow="never">
                            <div slot="header" class="clearfix">
                                <span>业务信息</span>
                            </div>
                            <div>
                                <el-form :inline="true" size="mini" label-width="75px">
                                    <el-form-item label="托运类型" class="isedit">
                                        <el-select v-model="typevalue.shipping.check_type" placeholder="托运类型" style="width:205px;">
                                            <el-option
                                                v-for="item in checktypelist"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="报关方式" v-if="typevalue.import_type==2">
                                        <el-select v-model="typevalue.shipping.custom_clearence_type" placeholder="报关方式" style="width:205px">
                                            <el-option
                                                v-for="item in clearencetypelist"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="运输条款">
                                        <el-select v-model="typevalue.shipping.transport_clause" placeholder="运输条款" style="width:205px">
                                            <el-option
                                                v-for="item in transportclaulist"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="付款方式">
                                        <el-select v-model="typevalue.shipping.pay_way" placeholder="付款方式" style="width:205px">
                                            <el-option
                                                v-for="item in paywaylist"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="付款地点" v-if="typevalue.import_type==1">
                                        <el-autocomplete
                                            v-model="typevalue.shipping.pay_site"
                                            :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                            placeholder="付款地点"
                                            style="width:205px"
                                            @select="handlePaysite"
                                            :title="typevalue.shipping.pay_site"
                                            popper-class="selectopt">
                                        </el-autocomplete>
                                    </el-form-item>
                                    <el-form-item label="附加条款" v-if="typevalue.import_type==1">
                                        <el-input v-model="typevalue.shipping.codicil" style="width:205px" placeholder="附加条款"></el-input>
                                    </el-form-item>
                                    <el-form-item label="出单方式" v-if="typevalue.import_type==1">
                                        <el-select v-model="typevalue.shipping.issue_type" placeholder="出单方式" style="width:205px">
                                            <el-option
                                                v-for="item in issuetypelist"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="目的港">
                                        <el-autocomplete
                                            v-model="typevalue.shipping.placeod_code"
                                            :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                            placeholder="代码"
                                            style="width:64px"
                                            @select="handlePlaceod"
                                            :title="typevalue.shipping.placeod_code"
                                            popper-class="selectopt">
                                            <template slot-scope="{ item }">
                                                <ul class="tableselect">
                                                    <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                                    <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                                </ul>
                                            </template>
                                        </el-autocomplete>
                                        <el-autocomplete
                                            v-model="typevalue.shipping.placeod_eng_name"
                                            :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                            placeholder="英文名称"
                                            style="width:64px"
                                            @select="handlePlaceod"
                                            :title="typevalue.shipping.placeod_eng_name"
                                            popper-class="selectopt s2">
                                            <template slot-scope="{ item }">
                                                <ul class="tableselect">
                                                    <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                                    <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                                </ul>
                                            </template>
                                        </el-autocomplete>
                                        <el-autocomplete
                                            v-model="typevalue.shipping.placeod_chn_name"
                                            :fetch-suggestions="((item,cb)=>{Portlist(item, cb, this)})"
                                            placeholder="中文名称"
                                            style="width:70px"
                                            @select="handlePlaceod"
                                            :title="typevalue.shipping.placeod_chn_name"
                                            popper-class="selectopt s3">
                                            <template slot-scope="{ item }">
                                                <ul class="tableselect">
                                                    <li v-if="item.key<1" class="tr"><span style="width:25%">代码</span><span style="width:40%">英文名称</span><span style="width:35%">中文名称</span></li>
                                                    <li class="td"><span style="width:25%">{{item.code}}</span><span style="width:40%">{{item.eng_name}}</span><span style="width:35%">{{item.chn_name}}</span></li>
                                                </ul>
                                            </template>
                                        </el-autocomplete>
                                    </el-form-item>
                                    <el-form-item label="停靠码头">
                                        <el-autocomplete
                                            v-model="typevalue.shipping.port_berth_code"
                                            :fetch-suggestions="((item,cb)=>{Portberthlist(item, cb, this)})"
                                            placeholder="代码"
                                            style="width:101px"
                                            @select="handlePortberth"
                                            :title="typevalue.shipping.port_berth_code"
                                            popper-class="selectopt">
                                            <template slot-scope="{ item }">
                                                <ul class="tableselect">
                                                    <li v-if="item.key<1" class="tr"><span style="width:50%">代码</span><span style="width:50%">名称</span></li>
                                                    <li class="td"><span style="width:50%">{{item.port_berth_code}}</span><span style="width:50%">{{item.port_berth_name}}</span></li>
                                                </ul>
                                            </template>
                                        </el-autocomplete>
                                        <el-autocomplete
                                            v-model="typevalue.shipping.port_berth_name"
                                            :fetch-suggestions="((item,cb)=>{Portberthlist(item, cb, this)})"
                                            placeholder="名称"
                                            style="width:101px"
                                            @select="handlePortberth"
                                            :title="typevalue.shipping.port_berth_name"
                                            popper-class="selectopt ts2">
                                            <template slot-scope="{ item }">
                                                <ul class="tableselect">
                                                    <li v-if="item.key<1" class="tr"><span style="width:50%">代码</span><span style="width:50%">名称</span></li>
                                                    <li class="td"><span style="width:50%">{{item.port_berth_code}}</span><span style="width:50%">{{item.port_berth_name}}</span></li>
                                                </ul>
                                            </template>
                                        </el-autocomplete>
                                    </el-form-item>
                                    <el-form-item label="HS CODE" v-if="typevalue.import_type==1">
                                        <el-input v-model="typevalue.shipping.hs_code" style="width:205px" placeholder="HS CODE"></el-input>
                                    </el-form-item>
                                    <el-form-item label="换单代理" v-if="typevalue.import_type==2">
                                        <el-input v-model="typevalue.shipping.d_o_claim_agent" style="width:205px" placeholder="换单代理"></el-input>
                                    </el-form-item>
                                    <el-form-item label="货物类型" style="margin-bottom: 0px;" v-if="typevalue.import_type==1">
                                        <el-select v-model="typevalue.shipping.product_type" placeholder="出单方式" style="width:100px">
                                            <el-option
                                                v-for="item in producttypelist"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                        <el-select v-model="typevalue.shipping.product_type2" placeholder="请选择" style="width:101px">
                                            <el-option
                                                v-for="item in producttype2list"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                        <el-card shadow="never" style="margin-top: 10px;padding-bottom: 25px">
                            <el-form :inline="true" size="mini" label-width="75px">
                                <el-form-item label="单证" style="margin-bottom: 0px;">
                                    <el-autocomplete
                                        v-model="typevalue.shipping.document"
                                        :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                        placeholder="单证"
                                        :style="typevalue.import_type==2?'width:70px':'width:205px'"
                                        @select="handleDocument"
                                        :title="typevalue.shipping.document"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                    <el-form-item label="换单" label-width="60px" v-if="typevalue.import_type==2">
                                        <el-autocomplete
                                            v-model="typevalue.shipping.d_o_claim"
                                            :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                            placeholder="换单"
                                            style="width:70px"
                                            @select="handleClaim"
                                            :title="typevalue.shipping.d_o_claim"
                                            popper-class="selectopt">
                                        </el-autocomplete>
                                    </el-form-item>
                                </el-form-item>
                                <el-form-item label="客服" style="margin-bottom: 0px;">
                                    <el-autocomplete
                                        v-model="typevalue.shipping.service"
                                        :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                        placeholder="客服"
                                        style="width:70px"
                                        @select="handleService"
                                        :title="typevalue.shipping.service"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                    <el-form-item label="商务" label-width="60px">
                                        <el-autocomplete
                                            v-model="typevalue.shipping.business"
                                            :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                            placeholder="商务"
                                            style="width:70px"
                                            @select="handleBusiness"
                                            :title="typevalue.shipping.business"
                                            popper-class="selectopt">
                                        </el-autocomplete>
                                    </el-form-item>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="never" class="serverinfo">
                            <div slot="header" class="clearfix">
                                <span>服务信息</span>
                            </div>
                            <div>
                                <el-checkbox-group 
                                    v-model="typevalue.shipping.service_type" @change="changeServerCheck">
                                    <el-checkbox v-for="item in serverlist" :label="item.id" :key="item.id" :disabled="item.isdisabled">{{item.name}}</el-checkbox>
                                </el-checkbox-group>
                                <div style="padding:10px 0px 0px;border-top:1px solid #D0D6DA;margin-top:5px;">
                                    <el-form :inline="true" size="mini" label-width="65px">
                                        <el-form-item label="舱单发送" v-if="typevalue.import_type==1">
                                            <el-select v-model="typevalue.shipping.bos_send_status" placeholder="舱单发送" style="width:70px">
                                                <el-option
                                                    v-for="item in bossendlist"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="提单确认" v-if="typevalue.import_type==1">
                                            <el-select v-model="typevalue.shipping.bol_confirm_status" placeholder="提单确认" style="width:70px">
                                                <el-option
                                                    v-for="item in bolconfirmlist"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="放单确认" v-if="typevalue.import_type==1">
                                            <el-select v-model="typevalue.shipping.assign_confirm_status" placeholder="放单确认" style="width:70px">
                                                <el-option
                                                    v-for="item in assignconfirmlist"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="业务制单">
                                            <el-select v-model="typevalue.shipping.single_system_status" placeholder="业务制单" style="width:70px">
                                                <el-option
                                                    v-for="item in asinglesystemlist"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </el-card>
                        <el-card shadow="never" style="margin-top: 10px">
                            <el-form :inline="true" size="mini" label-width="75px">
                                <el-form-item label="提单备注" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="提单备注"
                                        style="width:205px"
                                        v-model="typevalue.shipping.bol_remark">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="委托备注" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="委托备注"
                                        style="width:205px"
                                        v-model="typevalue.shipping.entrust_remark">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="发货人" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="发货人"
                                        style="width:205px"
                                        v-model="typevalue.shipping.consignor">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="never">
                            <div slot="header" class="clearfix">
                                <span>日期信息</span>
                            </div>
                            <div>
                                <el-form :inline="true" size="mini" label-width="75px">
                                    <el-form-item label="接单日期" required>
                                        <el-date-picker
                                            v-model="typevalue.shipping.accept_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="海外提货" v-if="typevalue.import_type==2">
                                        <el-date-picker
                                            v-model="typevalue.shipping.open_port_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="换单日期" v-if="typevalue.import_type==2">
                                        <el-date-picker
                                            v-model="typevalue.shipping.d_o_claim_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="放行日期" v-if="typevalue.import_type==2">
                                        <el-date-picker
                                            v-model="typevalue.shipping.custom_clearence_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="预配船期" v-if="typevalue.import_type==1">
                                        <el-date-picker
                                            v-model="typevalue.shipping.sailing_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="离港日期" v-if="typevalue.import_type==1">
                                        <el-date-picker
                                            v-model="typevalue.shipping.open_port_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                        <el-card shadow="never" style="margin-top: 10px;padding-bottom: 55px;">
                            <el-form :inline="true" size="mini" label-width="75px">
                                <el-form-item label="发货人" style="margin-bottom: 5px;" v-if="typevalue.import_type==1">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="发货人"
                                        style="width:205px"
                                        v-model="typevalue.shipping.consignor">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="收货人" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="收货人"
                                        style="width:205px"
                                        v-model="typevalue.shipping.consignee">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="通知人" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="通知人"
                                        style="width:205px"
                                        v-model="typevalue.shipping.noticer">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="唛头" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="唛头"
                                        style="width:205px"
                                        v-model="typevalue.shipping.shipping_mark">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
                <!-- 陆运 -->
                <el-row :gutter="12" class="infocard"  v-if="tabordertype==2">
                    <el-col :span="8">
                        <el-card shadow="never">
                            <div slot="header" class="clearfix">
                                <span>业务信息</span>
                            </div>
                            <div>
                                <el-form :inline="true" size="mini" label-width="75px">
                                    <el-form-item label="报关方式" v-if="typevalue.import_type==2">
                                        <el-select v-model="typevalue.transport.custom_clearence_type" placeholder="报关方式" style="width:205px">
                                            <el-option
                                                v-for="item in clearencetypelist"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="收款单位" required>
                                        <el-autocomplete
                                            v-model="typevalue.transport.collection_unit_code"
                                            :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                            placeholder="代码"
                                            style="width:101px"
                                            @select="handleCollectionunit"
                                            :title="typevalue.transport.collection_unit_code"
                                            popper-class="selectopt">
                                            <template slot-scope="{ item }">
                                                <ul class="tableselect">
                                                    <li v-if="item.key<1" class="tr"><span style="width:50%">代码</span><span style="width:50%">名称</span></li>
                                                    <li class="td"><span style="width:50%">{{item.code}}</span><span style="width:50%">{{item.name}}</span></li>
                                                </ul>
                                            </template>
                                        </el-autocomplete>
                                        <el-autocomplete
                                            v-model="typevalue.transport.collection_unit_name"
                                            :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                            placeholder="名称"
                                            style="width:101px"
                                            @select="handleCollectionunit"
                                            :title="typevalue.transport.collection_unit_name"
                                            popper-class="selectopt ts2">
                                            <template slot-scope="{ item }">
                                                <ul class="tableselect">
                                                    <li v-if="item.key<1" class="tr"><span style="width:50%">代码</span><span style="width:50%">名称</span></li>
                                                    <li class="td"><span style="width:50%">{{item.code}}</span><span style="width:50%">{{item.name}}</span></li>
                                                </ul>
                                            </template>
                                        </el-autocomplete>
                                    </el-form-item>
                                    <el-form-item label="船公司代理" v-if="typevalue.import_type==2">
                                        <el-autocomplete
                                            v-model="typevalue.transport.ship_company_agent_code"
                                            :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                            placeholder="代码"
                                            style="width:101px"
                                            @select="handleShipcompanyagent"
                                            :title="typevalue.transport.ship_company_agent_code"
                                            popper-class="selectopt">
                                            <template slot-scope="{ item }">
                                                <ul class="tableselect">
                                                    <li v-if="item.key<1" class="tr"><span style="width:50%">代码</span><span style="width:50%">名称</span></li>
                                                    <li class="td"><span style="width:50%">{{item.code}}</span><span style="width:50%">{{item.name}}</span></li>
                                                </ul>
                                            </template>
                                        </el-autocomplete>
                                        <el-autocomplete
                                            v-model="typevalue.transport.ship_company_agent_name"
                                            :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                            placeholder="名称"
                                            style="width:101px"
                                            @select="handleShipcompanyagent"
                                            :title="typevalue.transport.ship_company_agent_name"
                                            popper-class="selectopt ts2">
                                            <template slot-scope="{ item }">
                                                <ul class="tableselect">
                                                    <li v-if="item.key<1" class="tr"><span style="width:50%">代码</span><span style="width:50%">名称</span></li>
                                                    <li class="td"><span style="width:50%">{{item.code}}</span><span style="width:50%">{{item.name}}</span></li>
                                                </ul>
                                            </template>
                                        </el-autocomplete>
                                    </el-form-item>
                                    <!-- <el-form-item label="提箱堆场" v-if="typevalue.import_type==2">
                                        <el-input v-model="typevalue.transport.tixiang_yard" style="width:205px" placeholder="换单代理"></el-input>
                                    </el-form-item>
                                    <el-form-item label="落箱堆场" v-if="typevalue.import_type==2">
                                        <el-input v-model="typevalue.transport.back_yard" style="width:205px" placeholder="换单代理"></el-input>
                                    </el-form-item> -->
                                    <el-form-item label="提箱堆场" >
                                        <el-autocomplete
                                            v-model="typevalue.transport.tixiang_yard"
                                            :fetch-suggestions="((item,cb)=>{Yardlist(item, cb, this, 'tx')})"
                                            placeholder="提箱堆场"
                                            style="width:205px"
                                            @select="handleTyard"
                                            :title="typevalue.transport.tixiang_yard"
                                            popper-class="selectopt">
                                        </el-autocomplete>
                                    </el-form-item>
                                    <el-form-item label="落箱堆场">
                                        <el-autocomplete
                                            v-model="typevalue.transport.back_yard"
                                            :fetch-suggestions="((item,cb)=>{Yardlist(item, cb, this, 'lx')})"
                                            placeholder="落箱堆场"
                                            style="width:205px"
                                            @select="handleLyard"
                                            :title="typevalue.transport.back_yard"
                                            popper-class="selectopt">
                                        </el-autocomplete>
                                    </el-form-item>
                                    <el-form-item label="门店地址">
                                        <el-cascader
                                            v-model="typevalue.transport.address"
                                            :options="addresslist"
                                            @active-item-change="handleAddress"
                                            :props="props"
                                            clearable
                                            placeholder="区划信息" style="width: 205px"></el-cascader>
                                    </el-form-item>
                                    <el-form-item label=" ">
                                        <el-input v-model="typevalue.transport.addr_detail" style="width:205px" maxlength='20' placeholder="详细地址"></el-input>
                                    </el-form-item>
                                    <el-form-item label="联系方式">
                                        <el-autocomplete
                                            v-model="typevalue.transport.contact_name"
                                            :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                            placeholder="联系人"
                                            style="width:100px"
                                            @select="handleTracontact"
                                            :title="typevalue.transport.contact_name"
                                            popper-class="selectopt">
                                            <template slot-scope="{ item }">
                                                <ul class="tableselect" v-if="!item.none">
                                                    <li v-if="item.key<1" class="tr"><span style="width:40%">联系人</span><span style="width:60%">联系电话</span></li>
                                                    <li class="td" v-for="(cal,key) in item.contact" :key="key"><span style="width:40%">{{cal.name}}</span><span style="width:60%">{{cal.mobile}}</span></li>
                                                </ul>
                                            </template>
                                        </el-autocomplete>
                                        <el-autocomplete
                                            v-model="typevalue.transport.contact_mobile"
                                            :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                            placeholder="联系电话"
                                            style="width:100px"
                                            @select="handleTracontact"
                                            :title="typevalue.transport.contact_mobile"
                                            popper-class="selectopt s2">
                                            <template slot-scope="{ item }">
                                                <ul class="tableselect">
                                                    <li v-if="item.key<1" class="tr"><span style="width:40%">联系人</span><span style="width:60%">联系电话</span></li>
                                                    <li class="td" v-for="(cal,key) in item.contact" :key="key"><span style="width:40%">{{cal.name}}</span><span style="width:60%">{{cal.mobile}}</span></li>
                                                </ul>
                                            </template>
                                        </el-autocomplete>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                        <el-card shadow="never" style="margin-top: 10px;padding-bottom: 25px"  v-if="typevalue.import_type==1">
                            <el-form :inline="true" size="mini" label-width="75px">
                                <el-form-item label="单证" style="margin-bottom: 0px;">
                                    <el-autocomplete
                                        v-model="typevalue.transport.document"
                                        :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                        placeholder="单证"
                                        style="width:205px"
                                        @select="handleDocument"
                                        :title="typevalue.shipping.document"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                </el-form-item>
                                <el-form-item label="客服" style="margin-bottom: 0px;">
                                    <el-autocomplete
                                        v-model="typevalue.transport.service"
                                        :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                        placeholder="客服"
                                        style="width:70px"
                                        @select="handleService"
                                        :title="typevalue.transport.service"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                    <el-form-item label="商务" label-width="60px">
                                        <el-autocomplete
                                            v-model="typevalue.transport.business"
                                            :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                            placeholder="商务"
                                            style="width:70px"
                                            @select="handleBusiness"
                                            :title="typevalue.transport.business"
                                            popper-class="selectopt">
                                        </el-autocomplete>
                                    </el-form-item>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="never" class="serverinfo">
                            <div slot="header" class="clearfix">
                                <span>服务信息</span>
                            </div>
                            <div>
                                <el-checkbox-group 
                                    v-model="typevalue.transport.service_type" @change="changeServerCheck">
                                    <el-checkbox v-for="item in serverlist" :label="item.id" :key="item.id" :disabled="item.isdisabled">{{item.name}}</el-checkbox>
                                </el-checkbox-group>
                                <div style="padding:10px 0px 0px;border-top:1px solid #D0D6DA;margin-top:5px;">
                                    <el-form :inline="true" size="mini" label-width="65px">
                                        <el-form-item label="业务制单">
                                            <el-select v-model="typevalue.transport.single_system_status" placeholder="业务制单" style="width:70px">
                                                <el-option
                                                    v-for="item in asinglesystemlist"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </el-card>
                        <el-card shadow="never" style="margin-top: 10px;padding-bottom: 25px"  v-if="typevalue.import_type==2">
                            <el-form :inline="true" size="mini" label-width="75px">
                                <el-form-item label="单证" style="margin-bottom: 0px;">
                                    <el-autocomplete
                                        v-model="typevalue.shipping.document"
                                        :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                        placeholder="单证"
                                        style="width:205px"
                                        @select="handleDocument"
                                        :title="typevalue.transport.document"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                </el-form-item>
                                <el-form-item label="客服" style="margin-bottom: 0px;">
                                    <el-autocomplete
                                        v-model="typevalue.transport.service"
                                        :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                        placeholder="客服"
                                        style="width:70px"
                                        @select="handleService"
                                        :title="typevalue.transport.service"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                    <el-form-item label="商务" label-width="60px">
                                        <el-autocomplete
                                            v-model="typevalue.transport.business"
                                            :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                            placeholder="商务"
                                            style="width:70px"
                                            @select="handleBusiness"
                                            :title="typevalue.transport.business"
                                            popper-class="selectopt">
                                        </el-autocomplete>
                                    </el-form-item>
                                </el-form-item>
                            </el-form>
                        </el-card>
                        <el-card shadow="never" style="margin-top: 10px" v-if="typevalue.import_type==1">
                            <el-form :inline="true" size="mini" label-width="75px">
                                <el-form-item label="发货人" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="发货人"
                                        style="width:205px"
                                        v-model="typevalue.transport.consignor">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="收货人" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="收货人"
                                        style="width:205px"
                                        v-model="typevalue.transport.consignee">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="never">
                            <div slot="header" class="clearfix">
                                <span>日期信息</span>
                            </div>
                            <div>
                                <el-form :inline="true" size="mini" label-width="75px">
                                    <el-form-item label="接单日期" required="">
                                        <el-date-picker
                                            v-model="typevalue.transport.accept_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="一次换单" v-if="typevalue.import_type==2">
                                        <el-date-picker
                                            v-model="typevalue.transport.d_o_claim1_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="二次换单" v-if="typevalue.import_type==2">
                                        <el-date-picker
                                            v-model="typevalue.transport.d_o_claim2_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="报检日期" v-if="typevalue.import_type==2">
                                        <el-date-picker
                                            v-model="typevalue.transport.inspect_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="报关日期" v-if="typevalue.import_type==2">
                                        <el-date-picker
                                            v-model="typevalue.transport.custom_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="放行日期" v-if="typevalue.import_type==2">
                                        <el-date-picker
                                            v-model="typevalue.transport.cleared_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="离港日期" v-if="typevalue.import_type==1">
                                        <el-date-picker
                                            v-model="typevalue.transport.open_port_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="产装时间" v-if="typevalue.import_type==1">
                                        <el-date-picker
                                            v-model="typevalue.transport.product_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                        <el-card shadow="never" style="margin-top: 10px;padding-bottom: 55px;" v-if="typevalue.import_type==1">
                            <el-form :inline="true" size="mini" label-width="75px">
                                <el-form-item label="通知人" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="通知人"
                                        style="width:205px"
                                        v-model="typevalue.shipping.noticer">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="唛头" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="唛头"
                                        style="width:205px"
                                        v-model="typevalue.shipping.shipping_mark">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
                <!-- 报关 -->
                <el-row :gutter="12" class="infocard"  v-if="tabordertype==3">
                    <el-col :span="8">
                        <el-card shadow="never">
                            <div slot="header" class="clearfix">
                                <span>业务信息</span>
                            </div>
                            <div>
                                <el-form :inline="true" size="mini" label-width="75px">
                                    <el-form-item label="业务进程">
                                        <el-select v-model="typevalue.customs_broker.business_process" placeholder="业务进程" style="width:205px;">
                                            <el-option
                                                v-for="item in checktypelist"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="操作类型">
                                        <el-select v-model="typevalue.customs_broker.operate_type" placeholder="操作类型" style="width:205px;">
                                            <el-option
                                                v-for="item in operatetypelist"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="代理报关行" v-if="typevalue.import_type==1">
                                        <el-autocomplete
                                            v-model="typevalue.customs_broker.proxy_customs_broker"
                                            :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                            placeholder="订舱代理"
                                            style="width:205px"
                                            @select="handleProxybroker"
                                            :title="typevalue.customs_broker.proxy_customs_broker"
                                            popper-class="selectopt">
                                        </el-autocomplete>
                                    </el-form-item>
                                    <el-form-item label="报关方式" v-if="typevalue.import_type==2">
                                        <el-select v-model="typevalue.customs_broker.custom_clearence_type" placeholder="报关方式" style="width:205px">
                                            <el-option
                                                v-for="item in clearencetypelist"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="运输条款">
                                        <el-select v-model="typevalue.customs_broker.transport_clause" placeholder="运输条款" style="width:205px">
                                            <el-option
                                                v-for="item in transportclaulist"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="付款方式">
                                        <el-select v-model="typevalue.customs_broker.pay_way" placeholder="付款方式" style="width:205px">
                                            <el-option
                                                v-for="item in paywaylist"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="关区">
                                        <el-input v-model="typevalue.customs_broker.district" style="width:205px" maxlength="20" placeholder="关区"></el-input>
                                    </el-form-item>
                                    <el-form-item label="经营单位">
                                        <el-autocomplete
                                            v-model="typevalue.customs_broker.manage_unit"
                                            :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                            placeholder="经营单位"
                                            style="width:205px"
                                            @select="handleManageunit"
                                            :title="typevalue.customs_broker.manage_unit"
                                            popper-class="selectopt">
                                        </el-autocomplete>
                                    </el-form-item>
                                    <el-form-item label="许可证号" v-if="typevalue.import_type==1">
                                        <el-input v-model="typevalue.customs_broker.license_no" style="width:205px" maxlength="20" placeholder="许可证号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="产地证号" v-if="typevalue.import_type==1">
                                        <el-input v-model="typevalue.customs_broker.co_no" style="width:205px" maxlength="20" placeholder="产地证号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="手册号" v-if="typevalue.import_type==1">
                                        <el-input v-model="typevalue.customs_broker.handbook_no" style="width:205px" maxlength="20" placeholder="手册号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="通关单号" v-if="typevalue.import_type==1">
                                        <el-input v-model="typevalue.customs_broker.customs_access_no" style="width:205px" maxlength="20" placeholder="通关单号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="贸易方式" v-if="typevalue.import_type==1">
                                        <el-input v-model="typevalue.customs_broker.trade_way" style="width:205px" maxlength="20" placeholder="贸易方式"></el-input>
                                    </el-form-item>
                                    <el-form-item label="成交方式" v-if="typevalue.import_type==1">
                                        <el-input v-model="typevalue.customs_broker.deal_way" style="width:205px" maxlength="20" placeholder="成交方式"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="never" class="serverinfo">
                            <div slot="header" class="clearfix">
                                <span>服务信息</span>
                            </div>
                            <div>
                                <el-checkbox-group 
                                    v-model="typevalue.shipping.service_type" @change="changeServerCheck">
                                    <el-checkbox v-for="item in serverlist" :label="item.id" :key="item.id" :disabled="item.isdisabled">{{item.name}}</el-checkbox>
                                </el-checkbox-group>
                                <div style="padding:10px 0px 0px;border-top:1px solid #D0D6DA;margin-top:5px;">
                                    <el-form :inline="true" size="mini" label-width="65px">
                                        <el-form-item label="业务制单">
                                            <el-select v-model="typevalue.customs_broker.single_system_status" placeholder="业务制单" style="width:70px">
                                                <el-option
                                                    v-for="item in asinglesystemlist"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="海关检验" v-if="typevalue.import_type==1">
                                            <el-select v-model="typevalue.customs_broker.customes_inspect_status" placeholder="海关检验" style="width:70px">
                                                <el-option
                                                    v-for="item in customesinspeclist"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </el-card>
                        <el-card shadow="never" style="margin-top: 10px">
                            <el-form :inline="true" size="mini" label-width="75px">
                                <el-form-item label="发货人" style="margin-bottom: 5px;" v-if="typevalue.import_type==1">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="发货人"
                                        style="width:205px"
                                        v-model="typevalue.customs_broker.consignor">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="收货人" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="收货人"
                                        style="width:205px"
                                        v-model="typevalue.customs_broker.consignee">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="通知人" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="通知人"
                                        style="width:205px"
                                        v-model="typevalue.customs_broker.noticer">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="唛头" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="唛头"
                                        style="width:205px"
                                        v-model="typevalue.customs_broker.shipping_mark">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="never">
                            <div slot="header" class="clearfix">
                                <span>日期信息</span>
                            </div>
                            <div>
                                <el-form :inline="true" size="mini" label-width="75px">
                                    <el-form-item label="接单日期" required>
                                        <el-date-picker
                                            v-model="typevalue.customs_broker.accept_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="一次换单日期" v-if="typevalue.import_type==2">
                                        <el-date-picker
                                            v-model="typevalue.customs_broker.d_o_claim1_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="二次换单日期" v-if="typevalue.import_type==2">
                                        <el-date-picker
                                            v-model="typevalue.customs_broker.d_o_claim2_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="集港时间" v-if="typevalue.import_type==1">
                                        <el-date-picker
                                            v-model="typevalue.customs_broker.container_gate_in_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="离港日期" v-if="typevalue.import_type==1">
                                        <el-date-picker
                                            v-model="typevalue.customs_broker.open_port_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="报检日期" v-if="typevalue.import_type==2">
                                        <el-date-picker
                                            v-model="typevalue.customs_broker.inspect_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="报关日期">
                                        <el-date-picker
                                            v-model="typevalue.customs_broker.custom_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="放行日期" v-if="typevalue.import_type==2">
                                        <el-date-picker
                                            v-model="typevalue.customs_broker.cleared_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="海关退单" v-if="typevalue.import_type==1">
                                        <el-date-picker
                                            v-model="typevalue.customs_broker.customs_chargeback_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="退客户日期">
                                        <el-date-picker
                                            v-model="typevalue.customs_broker.customer_return_time	"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="清关日期">
                                        <el-date-picker
                                            v-model="typevalue.customs_broker.custom_clearence_time"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择日期"
                                            style="width:205px">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                        <el-card shadow="never" style="margin-top: 10px;">
                            <el-form :inline="true" size="mini" label-width="75px">
                                <el-form-item label="查验备注" style="margin-bottom: 5px;">
                                    <el-input
                                        type="textarea"
                                        :autosize="{ minRows: 2, maxRows: 2}"
                                        placeholder="查验备注"
                                        style="width:205px"
                                        v-model="typevalue.customs_broker.inspection_remark">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>
                        <el-card shadow="never" style="margin-top: 10px;">
                            <el-form :inline="true" size="mini" label-width="75px">
                                <el-form-item label="报关员" style="margin-bottom: 0px;">
                                    <el-autocomplete
                                        v-model="typevalue.customs_broker.custom_declarator"
                                        :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                        placeholder="报关员"
                                        style="width:205px"
                                        @select="handleService"
                                        :title="typevalue.customs_broker.custom_declarator"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                </el-form-item>
                                <el-form-item label="签收人" style="margin-bottom: 0px;">
                                    <el-autocomplete
                                        v-model="typevalue.customs_broker.signer"
                                        :fetch-suggestions="((item,cb)=>{Salesmanlist(item, cb, this)})"
                                        placeholder="签收人"
                                        style="width:205px"
                                        @select="handleService"
                                        :title="typevalue.customs_broker.signer"
                                        popper-class="selectopt">
                                    </el-autocomplete>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card class="box-card boxinput" style="margin-top: 10px;" v-if="dialogtext=='edit'">
                    <div slot="header" class="clearfix cardsty" style="overflow: hidden;padding-top: 10px;">
                        <span style="font-size: 12px;line-height: 22px;">箱信息列表</span>
                        <el-button style="float: right; padding:6px 12px;" size="mini">删除</el-button>
                        <el-button type="primary" class="cgreen" @click="Boxaddlist()" style="float:right;margin-right: 5px;" icon="el-icon-plus" size="mini">添加箱信息</el-button>
                    </div>
                    <el-form :inline="true" size="mini" label-width="75px">
                        <el-table
                                :data="tableBox"
                                @select-all="selectboxAll"
                                @select="selectboxChange"
                                ref="multipleTables"
                                tooltip-effect="dark"
                                style="width: 100%"
                                @selection-change="handleSelectionboxChange"
                                border>
                            <el-table-column
                                type="selection"
                                width="35">
                            </el-table-column>
                            <el-table-column label="箱号/封号">
                                <template slot-scope="scope">
                                    <span class="displayBlock" v-if="!scope.row.isedit">{{scope.row.box_code}}</span>
                                    <span class="displayBlock" v-if="!scope.row.isedit">{{scope.row.box_ensupe}}</span>
                                    <span class="displayBlock" v-if="scope.row.isedit">
                                        <el-form-item style="margin-bottom: 0px;">
                                            <el-input v-model="scope.row.box_code" maxlength='20' placeholder="箱号"></el-input>
                                        </el-form-item>
                                    </span>
                                    <span class="displayBlock" v-if="scope.row.isedit">
                                        <el-form-item style="margin-bottom: 0px;">
                                            <el-input v-model="scope.row.box_ensupe" maxlength='20' placeholder="封号"></el-input>
                                        </el-form-item>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="箱型/重量">
                                <template slot-scope="scope">
                                    <span class="displayBlock" v-if="!scope.row.isedit">{{scope.row.box_size_type}}</span>
                                    <span class="displayBlock" v-if="!scope.row.isedit">{{scope.row.weight}}</span>
                                    <span class="displayBlock" v-if="scope.row.isedit">
                                        <el-form-item style="margin-bottom: 0px;">
                                            <el-select v-model="scope.row.box_size_type" placeholder="箱型" style="width:72px">
                                                <el-option
                                                    v-for="item in boxsizelist"
                                                    :key="item.value"
                                                    :label="item.name"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </span>
                                    <span class="displayBlock" v-if="scope.row.isedit">
                                        <el-form-item style="margin-bottom: 0px;">
                                            <el-input v-model="scope.row.weight" type="text" maxlength='20' placeholder="重量">
                                                <i slot="suffix" class="icontext">KG</i>
                                            </el-input>
                                        </el-form-item>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="件数/尺寸">
                                <template slot-scope="scope">
                                    <span class="displayBlock" v-if="!scope.row.isedit">{{scope.row.pieces}}{{scope.row.pieces_desc}}</span>
                                    <span class="displayBlock" v-if="!scope.row.isedit">{{scope.row.weight}}CMB</span>
                                     <span class="displayBlock" v-if="scope.row.isedit">
                                        <el-form-item style="margin-bottom: 0px;">
                                            <el-input v-model="scope.row.pieces" type="text" maxlength='20' placeholder="重量">
                                                <i slot="suffix" class="icontext">{{typevalue.pieces_desc}}</i>
                                            </el-input>
                                        </el-form-item>
                                    </span>
                                    <span class="displayBlock" v-if="scope.row.isedit">
                                        <el-form-item style="margin-bottom: 0px;">
                                            <el-input v-model="scope.row.volume" type="text" maxlength='20' placeholder="体积">
                                                <i slot="suffix" class="icontext">CBM</i>
                                            </el-input>
                                        </el-form-item>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="门店地址">
                                <template slot-scope="scope">
                                    <span class="displayBlock" v-if="!scope.row.isedit">{{scope.row.addr_detail}}</span>
                                    <span class="displayBlock" v-if="scope.row.isedit">
                                        <el-form-item style="margin-bottom: 0px;">
                                            <el-cascader
                                                v-model="scope.row.address"
                                                :options="addresslist"
                                                @active-item-change="handleAddress"
                                                :props="props"
                                                clearable
                                                placeholder="区划地址"></el-cascader>
                                        </el-form-item>
                                    </span>
                                    <span class="displayBlock" v-if="scope.row.isedit">
                                        <el-form-item style="margin-bottom: 0px;">
                                            <el-input v-model="scope.row.addr_detail" maxlength='200' placeholder="详细地址"></el-input>
                                        </el-form-item>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="联系方式">
                                <template slot-scope="scope">
                                    <span class="displayBlock" v-if="!scope.row.isedit">{{scope.row.contact_name}}</span>
                                    <span class="displayBlock" v-if="!scope.row.isedit">{{scope.row.contact_mobile}}</span>
                                    <span class="displayBlock" v-if="scope.row.isedit">
                                        <el-form-item style="margin-bottom: 0px;">
                                            <el-autocomplete
                                                v-model="scope.row.contact_name"
                                                :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                                placeholder="联系人"
                                                @select="((item)=>{handleboxcontact(item)})"
                                                :title="scope.row.contact_name"
                                                popper-class="selectopt">
                                                <template slot-scope="{ item }">
                                                    <ul class="tableselect" v-if="!item.none">
                                                        <li v-if="item.key<1" class="tr"><span style="width:40%">联系人</span><span style="width:60%">联系电话</span></li>
                                                        <li class="td" v-for="(cal,key) in item.contact" :key="key"><span style="width:40%">{{cal.name}}</span><span style="width:60%">{{cal.mobile}}</span></li>
                                                    </ul>
                                                </template>
                                            </el-autocomplete>
                                        </el-form-item>
                                        <el-form-item style="margin-bottom: 0px;">
                                            <el-autocomplete
                                                v-model="scope.row.contact_mobile"
                                                :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                                placeholder="联系电话"
                                                @select="((item)=>{handleboxcontact(item)})"
                                                :title="scope.row.contact_mobile"
                                                popper-class="selectopt s2">
                                                <template slot-scope="{ item }">
                                                    <ul class="tableselect">
                                                        <li v-if="item.key<1" class="tr"><span style="width:40%">联系人</span><span style="width:60%">联系电话</span></li>
                                                        <li class="td" v-for="(cal,key) in item.contact" :key="key"><span style="width:40%">{{cal.name}}</span><span style="width:60%">{{cal.mobile}}</span></li>
                                                    </ul>
                                                </template>
                                            </el-autocomplete>
                                        </el-form-item>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="产装时间">
                                <template slot-scope="scope">
                                    <span class="displayBlock" v-if="!scope.row.isedit">{{scope.row.product_time}}</span>
                                    <span class="displayBlock" v-if="scope.row.isedit">
                                        <el-form-item style="margin-bottom: 0px;">
                                            <el-date-picker
                                                v-model="scope.row.product_time"
                                                type="datetime"
                                                format="yyyy-MM-dd HH-mm-ss"
                                                placeholder="产装时间">
                                            </el-date-picker>
                                        </el-form-item>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="承运车队">
                                <template slot-scope="scope">
                                    <span class="displayBlock" v-if="!scope.row.isedit">{{scope.row.convoy_parnter_id}}</span>
                                    <span class="displayBlock" v-if="scope.row.isedit">
                                        <el-form-item>
                                            <el-autocomplete
                                                v-model="scope.row.convoy_parnter"
                                                :fetch-suggestions="((item,cb)=>{Partnerunitlist(item, cb, this)})"
                                                placeholder="车队"
                                                @select="handleboxpartner"
                                                popper-class="selectopt">
                                            </el-autocomplete>
                                        </el-form-item>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="派车备注">
                                <template slot-scope="scope">
                                    <span class="displayBlock" v-if="!scope.row.isedit">{{scope.row.remark_str1}}</span>
                                    <span class="displayBlock" v-if="scope.row.isedit">
                                        <el-form-item style="margin-bottom: 0px;">
                                            <el-input v-model="scope.row.remark_str1" maxlength='200' placeholder="派车备注"></el-input>
                                        </el-form-item>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="{row,$index}">
                                    <span class="actionsave" style="background: #1DD397" @click="AddBox(row)" v-if="row.isedit">保存</span>
                                    <span class="actionsave" style="background: #FF6666" @click="delBox($index)" v-if="row.isedit">删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form>
                </el-card>
            </div>

            <div style="padding: 15px;" v-if="dialogtab=='2' && dialogtext=='edit'" >
                <Financeinfo :orderid="typevalue.id"></Financeinfo>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import BusinessMenu from '@/components/BusinessMenu'
    import Financeinfo from '@/components/Business/Financeinfo'
    import Financelog from '@/components/Business/Financelog'
    export default {

        data() {
            return {
                tabindex: 0,
                dialogtext: 'add',
                inputwidth: 'width: 135px;margin-right: 5px',
                diaginput: 'width: 215px;margin-right: 5px',
                typedatearr: [
                    {id: '', startdate: '', enddate: ''}
                ],
                statustypelist: [
                    {id: '1', name: '制单状态'}
                ],
                typestatusarr: [
                    {id: '', status_id: ''}
                ],
                statustypelist: [
                    {id: '1', name: '制单状态'}
                ],
                actionoptions: [{
                    value: 1,
                    label: '海运',
                    children: [{
                        value: 1,
                        label: '业务制单',
                        children: [
                            {
                                value: 2,
                                label: '完成'
                            },
                            {
                                value: 1,
                                label: '取消'
                            },
                        ]
                    },{
                        value: 2,
                        label: '舱单发送',
                        children: [
                            {
                                value: 2,
                                label: '完成'
                            },
                            {
                                value: 1,
                                label: '取消'
                            },
                        ]
                    }, {
                        value: 3,
                        label: '提单确认',
                        children: [
                            {
                                value: 2,
                                label: '完成'
                            },
                            {
                                value: 1,
                                label: '取消'
                            },
                        ]
                    }, {
                        value: 4,
                        label: '放单确认',
                        children: [
                            {
                                value: 2,
                                label: '完成'
                            },
                            {
                                value: 1,
                                label: '取消'
                            },
                        ]
                    }]
                }, {
                    value: 2,
                    label: '陆运',
                    children: [{
                        value: 1,
                        label: '业务制单',
                        children: [
                            {
                                value: 2,
                                label: '完成'
                            },
                            {
                                value: 1,
                                label: '取消'
                            },
                        ]
                    }]
                }, {
                    value: 3,
                    label: '报关',
                    children: [{
                        value: 1,
                        label: '业务制单',
                        children: [
                            {
                                value: 2,
                                label: '完成'
                            },
                            {
                                value: 1,
                                label: '取消'
                            },
                        ]
                    }]
                }],
                statuschooselist:  [
                    {id: 0, name: '全部'},
                    {id: 1, name: '未完成'},
                    {id: 2, name: '已完成'},
                ],
                typedatelist: [
                    {id: '1', name: '接单日期'},
                    {id: '2', name: '离港日期'},
                ],
                drivertypelist:[
                    { name: '海运',id: '1'},
                    { name: '陆运',id: '2'},
                    { name: '报关',id: '3'}
                ],
                actionlist: [
                    { name: '启用',id:'1'},
                    { name: '禁用',id:'2'},
                    { name: '删除',id:'3'},
                ],
                unittype:[
                    { name: '全部',id:''},
                    { name: '海运',id: 1},
                    { name: '陆运',id: 2},
                    { name: '报关',id: 3}
                ],
                statuslist: [
                    { name: '正常',id:'1'},
                    { name: '禁用',id:'2'}
                ],
                serverlist: [
                    { name: '提货服务',id: 1},
                    { name: '报关服务',id: 2},
                    { name: '海运服务',id: 3},
                    { name: '换单服务',id: 4},
                    { name: '押箱服务',id: 5},
                    { name: '清关服务',id: 6},
                    { name: '送货服务',id: 7},
                    { name: '仓库服务',id: 8},
                    { name: '保险服务',id: 9},
                    { name: '订舱服务',id: 10},
                    { name: '内装服务',id: 11},
                    { name: '陆运服务',id: 12},
                    { name: '报检服务',id: 13},
                ],
                checktypelist: [
                    { name: 'FCL',id: 1},
                    { name: 'LCL',id: 2},
                    { name: 'BULK',id: 3},
                    { name: 'BERAK BULK',id: 4}
                ],
                clearencetypelist: [
                    { name: '清关',id: 1},
                    { name: '转关',id: 2},
                    { name: '仅换单',id: 3},
                    { name: '快递进口',id: 4},
                    { name: '机场快线',id: 5},
                    { name: '属地报关',id: 6},
                    { name: '一体化',id: 7},
                ],
                paywaylist: [
                    { name: 'FREIGHT PREPAID',id: 1},
                    { name: 'FREIGHT COLLECT',id: 2},
                    { name: 'PART PREPAID',id: 3},
                    { name: 'PART COLLEC',id: 4},
                    { name: 'AS ARRANGED',id: 5},
                    { name: 'PAYABLE AT',id: 6},
                    { name: 'PREPAID AT',id: 7},
                    { name: 'COLLECT AT',id: 8},
                    { name: 'PAYABLE AT DESTINATION',id: 9},
                    { name: 'LINER',id: 10},
                    { name: 'FIO',id: 11}, 
                    { name: 'FILO',id: 12},
                    { name: 'OTHER',id: 13},
                ],
                issuetypelist:[
                    { name: '正本',id: 1},
                    { name: '电放',id :2},
                    { name: 'SWB',id: 3},
                    { name: '目的港放单',id: 4}
                ],
                producttypelist: [
                    { name: '普通',id: 1},
                    { name: '危险',id: 2},
                    { name: '冷冻',id: 3}
                ],
                producttype2list: [
                    { name: '高代平',id: 1},
                    { name: '冷代干',id: 2},
                    { name: 'SOC',id: 3}
                ],
                bossendlist: [
                    { name: '未发送',id: 1},
                    { name: '已发送',id: 2}
                ],
                bolconfirmlist: [
                    { name: '未完成',id: 1},
                    { name: '已完成',id: 2}
                ],
                assignconfirmlist: [
                    { name: '未完成',id: 1},
                    { name: '已完成',id: 2}
                ],
                asinglesystemlist: [
                    { name: '未完成',id: 1},
                    { name: '已完成',id: 2}
                ],
                operatetypelist: [
                    { name: '海运FCL',id: 1},
                    { name: '海运LCL',id: 2},
                    { name: '海运BULK',id: 3},
                    { name: '空运',id: 4}
                ],
                transportclaulist: [
                    { name: 'CY/CY',id: 1},
                    { name: 'CY/CFS',id: 2},
                    { name: 'CY/DOOR',id: 3},
                    { name: 'CY/FO',id: 4},
                    { name: 'CY/HOOK',id: 5},
                    { name: 'CY/LO',id: 6},
                    { name: 'CY/TACKLE',id: 7},
                    { name: 'CY-RAMP',id: 8},
                    { name: 'CFS/CY',id: 9},
                    { name: 'CFS/CFS',id: 10},
                    { name: 'CFS/DOOR',id: 11},
                    { name: 'CFS/DDU',id: 12},
                    { name: 'CFS/DDP',id: 13},
                    { name: 'CFS/FO',id: 14},
                    { name: 'DOOR/CY',id: 15},
                    { name: 'DOOR/CFS',id: 16},
                    { name: 'DOOR/DOOR',id: 17},
                ],
                customesinspeclist: [
                    { name: '未完成',id: 1},
                    { name: '已完成',id: 2}
                ],
                loading: false,
                currentPage: 1,
                total:0,
                page_size:20,
                tableData: [],
                selectDataArrL: [],
                checkalldata: [],
                tableBox: [],
                selectBoxArrL: [],
                checkallbox: [],
                dialogtype: false,
                dialogtype2: false,
                actiontype: [],
                typevalue: {
                    code: '',
                    import_type: 1,
                    order_type: [],
                    partner_name: '',
                    unit_name: '',
                    partner_id: '',
                    unit_id: '',
                    bl_no: '',
                    contract_no: '',
                    ship_voyage: '',
                    partner_contact_name: '',
                    partner_contact_mobile: '',
                    salesman_user: '',
                    salesman_user_id: 0,
                    operator_user: global.userinfo.name,
                    operator_user_id: global.userinfo.id || 0,
                    ship_company_code: '',
                    ship_company_eng_name:'',
                    ship_company_chn_name:'',
                    ship_eng_name:'',
                    ship_chn_name:'',
                    product_eng_name:'',
                    product_chn_name:'',
                    pol_code: '',
                    pol_chn_name: '',
                    pol_eng_name: '',
                    pod_code: '',
                    pod_chn_name: '',
                    pod_eng_name: '',
                    pot_code: '',
                    pot_chn_name: '',
                    pot_eng_name: '',
                    box: [
                        {box_size_type: '', count: ''},
                        {box_size_type: '', count: ''},
                        {box_size_type: '', count: ''},
                        {box_size_type: '', count: ''},
                    ],
                    pieces: '',
                    pieces_desc: '',
                    pieces_eng_desc: '',
                    weight: '',
                    volume: '',
                    shipping: {
                        check_type: 1,
                        custom_clearence_type: 1,
                        booking_agent: '',
                        transport_clause: 1,
                        pay_way: 1,
                        pay_site: '',
                        codicil: '',
                        issue_type: 1,
                        placeod_code: '',
                        placeod_chn_name: '',
                        placeod_eng_name: '',
                        port_berth_name: '',
                        port_berth_code: '',
                        d_o_claim_agent: '',
                        hs_code: '',
                        product_type: 1,
                        product_type2: 1,
                        service_type: [],
                        bos_send_status: 1,
                        bol_confirm_status: 1,
                        assign_confirm_status: 1,
                        single_system_status: 1,
                        bol_remark: '',
                        entrust_remark: '',
                        sailing_time: '',
                        overseas_pick_goods_time: '',
                        accept_time: '',
                        open_port_time: '',
                        d_o_claim_time: '',
                        custom_clearence_time: '',
                        document: '',
                        d_o_claim: '',
                        service: '',
                        business: '',
                        consignor: '',
                        consignee: '',
                        noticer: '',
                        shipping_mark: ''
                    },
                    transport: {
                        custom_clearence_type: 1,
                        collection_unit_code: '',
                        collection_unit_name: '',
                        ship_company_agent_code: '',
                        ship_company_agent_name: '',
                        tixiang_yard: '',
                        back_yard: '',
                        addr_add3_id: 0,
                        addr_add4_id: 0,
                        addr_detail: '',
                        contact_name: '',
                        contact_mobile: '',
                        service_type: [],
                        single_system_status: 1,
                        consignor: '',
                        consignee: '',
                        accept_time: '',
                        open_port_time: '',
                        product_time: '',
                        d_o_claim1_time: '',
                        d_o_claim2_time: '',
                        inspect_time: '',
                        custom_time: '',
                        cleared_time: '',
                        noticer: '',
                        shipping_mark: '',
                        document: '',
                        service: '',
                        business: '',
                        address:[]
                    },
                    customs_broker: {
                        business_process: '',
                        operate_type: 1,
                        custom_clearence_type: 1,
                        proxy_customs_broker: '',
                        transport_clause: 1,
                        pay_way: 1,
                        district: '',
                        manage_unit: '',
                        license_no: '',
                        co_no: '',
                        handbook_no: '',
                        customs_access_no: '',
                        trade_way: '',
                        free_form_no: '',
                        deal_way: '',
                        service_type: [],
                        single_system_status: 1,
                        customes_inspect_status: 1,
                        consignor: '',
                        consignee: '',
                        noticer: '',
                        shipping_mark: '',
                        accept_time: '',
                        container_gate_in_time: '',
                        open_port_time: '',
                        custom_clearence_time: '',
                        custom_time: '',
                        customs_chargeback_time: '',
                        customer_return_time: '',
                        cleared_time: '',
                        inspect_time: '',
                        d_o_claim1_time: '',
                        d_o_claim2_time: '',
                        custom_declarator: '',
                        signer: '',
                        inspection_remark: ''
                    }
                },
                dialogtab: '1',
                shipoptions: [],
                curdriver: {},
                boxsizelist: [],
                tabordertype: 1,
                typevaluedefault: {},
                addresslist: [],
                props: {
                    value: 'value',
                    children: 'children'
                },
                currow: {},
                dialoglogall: false
            }
        },
        components:{
            BusinessMenu,
            Financeinfo,
            Financelog
        },
        watch:{
            // tab切换和服务联动
            'typevalue.shipping.service_type':{
                handler(val, oldVal){
                    if(val.indexOf(2)<0 && this.typevalue.order_type.indexOf(3)>0){
                        this.typevalue.order_type.splice(this.typevalue.order_type.indexOf(3), 1);
                    } else if(val.indexOf(2)>0 && this.typevalue.order_type.indexOf(3)<0){
                        this.typevalue.order_type.push(3);
                    }
                    if(val.indexOf(3)<0 && this.typevalue.order_type.indexOf(1)>0){
                        this.typevalue.order_type.splice(this.typevalue.order_type.indexOf(1), 1);
                    } else if(val.indexOf(3)>0 && this.typevalue.order_type.indexOf(1)<0){
                        this.typevalue.order_type.push(1);
                    }
                    if(val.indexOf(12)<0 && this.typevalue.order_type.indexOf(2)>0){
                        this.typevalue.order_type.splice(this.typevalue.order_type.indexOf(2), 1);
                    } else if(val.indexOf(12)>0 && this.typevalue.order_type.indexOf(2)<0){
                        this.typevalue.order_type.push(2);
                    }
                },
                deep:true
            },
            'typevalue.shipping.transport_clause':{
                handler(val, oldVal){
                    this.typevalue.customs_broker.transport_clause = val
                },
                deep:true
            },
            'typevalue.customs_broker.transport_clause':{
                handler(val, oldVal){
                    this.typevalue.shipping.transport_clause = val
                },
                deep:true
            },
            'typevalue.shipping.pay_way':{
                handler(val, oldVal){
                    this.typevalue.customs_broker.pay_way = val
                },
                deep:true
            },
            'typevalue.customs_broker.pay_way':{
                handler(val, oldVal){
                    this.typevalue.shipping.pay_way = val
                },
                deep:true
            },
            'typevalue.shipping.accept_time':{
                handler(val, oldVal){
                    this.typevalue.transport.accept_time = val
                    this.typevalue.customs_broker.accept_time = val
                },
                deep:true
            },
            'typevalue.transport.accept_time':{
                handler(val, oldVal){
                    this.typevalue.shipping.accept_time = val
                    this.typevalue.customs_broker.accept_time = val
                },
                deep:true
            },
            'typevalue.shipping.custom_clearence_type':{
                handler(val, oldVal){
                    this.typevalue.transport.custom_clearence_type = val
                    this.typevalue.customs_broker.custom_clearence_type = val
                },
                deep:true
            },
            'typevalue.transport.custom_clearence_type':{
                handler(val, oldVal){
                    this.typevalue.shipping.custom_clearence_type = val
                    this.typevalue.customs_broker.custom_clearence_type = val
                },
                deep:true
            },
            'typevalue.customs_broker.custom_clearence_type':{
                handler(val, oldVal){
                    this.typevalue.transport.custom_clearence_type = val
                    this.typevalue.shipping.custom_clearence_type = val
                },
                deep:true
            },
            tabordertype(val, oldVal){
                this.Serverconf(val)
            }
        },
        methods: {
            //日志
            Openlog(val, type){
                this.currow = {
                    order_id: this.curorderid
                }
                this.dialoglogall = true
            },
            //日志
            Opendialogall(val){
                this.dialoglogall = val
            },
            cellStyle({row,column,rowIndex,columnIndex}){
                return "text-align:center;"
            },
            rowStyle({row,rowIndex}){
                return "text-align:center;"
            },
            handleCurrentChange(val,ty) {
                this.currentPage = val
                this.serchForm(val)
            },
            curvalue(value){
                console.log(value)
            },
            // 添加日期搜索项
            adddate(){
                let date = {
                    id: '', startdate: '', enddate: ''
                }
                if(this.typedatearr.length<this.typedatelist.length) {
                    this.typedatearr.push(date)
                }
            },
            // 业务类型选择
            changeCheckorder(val){
                this.ruleForm.order_type = val
            },
            // 选择日期
            changeDate(val){
                this.typedatelist.forEach((item)=>{
                    if(item.id==val){
                        item.disabled = true
                    } else {
                        item.disabled = false
                    }
                })
            },
            // 业务员列表
            BoxsizeType(queryString, cb, $this) {
                let self = this
                let result = []
                this.$fetch(this.$getApi('BoxsizeType'),{type:1,is_open45: 1}).then((res) => {
                    if(res.data.box_type){
                        Object.keys(res.data.box_size).forEach((key) => {
                            Object.keys(res.data.box_type).forEach((key2) => {
                                let k = key2>9?key2:'0'+key2
                                let val = res.data.box_size[key] + k
                                result.push({value: parseInt(val), name: res.data.box_size[key]+res.data.box_type[key2]})
                            })
                        }) 
                    }
                    self.boxsizelist = result
                })
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
                this.typevalue.salesman_user = item.name
                this.typevalue.salesman_user_id = item.id
            },
            // 选中的操作员
            handleOperator(item) {
                this.typevalue.operator_user = item.name
                this.typevalue.operator_user_id = item.id
            },
            // 选中的单证
            handleDocument(item) {
                this.typevalue.shipping.document = item.name
                this.typevalue.transport.document = item.name
            },
            // 选中的换单
            handleClaim(item) {
                this.typevalue.shipping.d_o_claim = item.name
            },
            // 选中的客服
            handleService(item) {
                this.typevalue.shipping.service = item.name
                this.typevalue.transport.service = item.name
            },
            // 选中的商务
            handleBusiness(item) {
                this.typevalue.shipping.business = item.name
                this.typevalue.transport.business = item.name
            },
            // 船公司列表
            Shipcompanylist(queryString, cb, $this) {
                let self = this
                this.loading = true;
                let params = {}
                if(queryString!=''){
                    params.name = queryString
                }
                let result=[]
                this.$fetch(this.$getApi('ShipcompanySearch'),params).then((res) => {
                    setTimeout(() => {
                        self.loading = false;
                        res.data.forEach((val,key,ary)=>{
                            val.value = val.chn_name + '(' + val.eng_name + ')'
                            val.key = key
                        })
                        result = res.data
                        cb(result);
                    }, 300);
                })
            },
            // 选中的船公司
            handleshipcompany(item) {
                this.typevalue.ship_company_code = item.code
                this.typevalue.ship_company_chn_name = item.chn_name
                this.typevalue.ship_company_eng_name = item.eng_name
            },
            // 选中的船公司代理
            handleShipcompanyagent(item) {
                this.typevalue.transport.ship_company_agent_code = item.code
                this.typevalue.transport.ship_company_agent_name = item.chn_name
            },
            // 搜索停靠码头
            Portberthlist(queryString, cb, $this) {
                let self = this
                this.loading = true;
                let params = {}
                if(queryString!=''){
                    params.name = queryString
                }
                let result=[]
                this.$fetch(this.$getApi('PortberthSearch'),params).then((res) => {
                    setTimeout(() => {
                        self.loading = false;
                        res.data.forEach((val,key,ary)=>{
                            val.value = val.port_berth_name + '(' + val.port_berth_code + ')'
                            val.key = key
                        })
                        result = res.data
                        cb(result);
                    }, 300);
                })
            },
            // 选中的码头
            handlePortberth(item) {
                this.typevalue.shipping.port_berth_code = item.port_berth_code
                this.typevalue.shipping.port_berth_name = item.port_berth_name
            },
            // 堆场列表
            Yardlist(queryString, cb, $this, type) {
                let self = this
                this.loading = true;
                let params = {}
                if(queryString!=''){
                    params.name = queryString
                }
                let result=[]
                this.$fetch(this.$getApi('YardSearch'),params).then((res) => {
                    setTimeout(() => {
                        self.loading = false;
                        res.data.forEach((val,key,ary)=>{
                            if(type == 'tx') {
                                val.value = val.tixiang_yard
                            }
                            if(type == 'lx') {
                                val.value = val.back_yard
                            }
                            val.key = key
                        })
                        result = res.data
                        cb(result);
                    }, 300);
                })
            },
            // 选中的提箱堆场
            handleTyard(item) {
                this.typevalue.transport.tixiang_yard = item.tixiang_yard
            },
            // 选中的落箱堆场
            handleLyard(item) {
                this.typevalue.transport.back_yard = item.back_yard
            },
            // 船列表
            Shiplist(queryString, cb, $this) {
                let self = this
                this.loading = true;
                let params = {}
                if(queryString!=''){
                    params.name = queryString
                }
                let result=[]
                this.$fetch(this.$getApi('ShipSearch'),params).then((res) => {
                    setTimeout(() => {
                        self.loading = false;
                        res.data.forEach((val,key,ary)=>{
                            val.value = val.chn_name + '(' + val.eng_name + ')'
                            val.key = key
                        })
                        result = res.data
                        cb(result);
                    }, 300);
                })
            },
            // 选中的船
            handleship(item) {
                this.typevalue.ship_chn_name= item.chn_name
                this.typevalue.ship_eng_name = item.eng_name
            },
            // 货物名称列表
            Productlist(queryString, cb, $this) {
                let self = this
                this.loading = true;
                let params = {}
                if(queryString!=''){
                    params.s = queryString
                }
                let result=[]
                this.$fetch(this.$getApi('ProductSearch'),params).then((res) => {
                    setTimeout(() => {
                        self.loading = false;
                        res.data.forEach((val,key,ary)=>{
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
            // 船公司列表
            Portlist(queryString, cb, $this, type) {
                let self = this
                this.loading = true;
                let params = {}
                if(queryString!=''){
                    params.name = queryString
                }
                let result=[]
                this.$fetch(this.$getApi('PortSearch'),params).then((res) => {
                    setTimeout(() => {
                        self.loading = false;
                        res.data.forEach((val,key,ary)=>{
                            val.value = val.chn_name + '(' + val.eng_name + ')'
                            val.key = key
                        })
                        result = res.data
                        cb(result);
                    }, 300);
                })
            },
            // 选中的起运港
            handlePol(item) {
                this.typevalue.pol_code = item.code
                this.typevalue.pol_chn_name = item.chn_name
                this.typevalue.pol_eng_name = item.eng_name
            },
            // 选中的目的港
            handlePod(item) {
                this.typevalue.pod_code = item.code
                this.typevalue.pod_chn_name = item.chn_name
                this.typevalue.pod_eng_name = item.eng_name
            },
            // 选中的中转港
            handlePot(item) {
                this.typevalue.pot_code = item.code
                this.typevalue.pot_chn_name = item.chn_name
                this.typevalue.pot_eng_name = item.eng_name
            },
            // 选中的目的地
            handlePlaceod(item) {
                this.typevalue.shipping.placeod_code = item.code
                this.typevalue.shipping.placeod_chn_name = item.chn_name
                this.typevalue.shipping.placeod_eng_name = item.eng_name
            },
            // 选中的付款地点
            handlePaysite(item) {
                this.typevalue.shipping.pay_site = item.chn_name
            },
            // 选中的货物名称
            handleproduct(item) {
                this.typevalue.product_chn_name = item.product_chn_name
                this.typevalue.product_eng_name = item.product_eng_name
            },
            // 合作单位列表
            Partnerunitlist(queryString, cb, $this) {
                let self = this
                this.loading = true;
                let params = {}
                if(queryString!=''){
                    params.name = queryString
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
            // 选中合作伙伴
            handlepartner(item) {
                this.typevalue.partner_id = item.id
                this.typevalue.partner_name = item.name
                this.typevalue.unit_id = item.id
                this.typevalue.unit_name = item.name
                this.typevalue.partner_contact_name = item.contact[0].name
                this.typevalue.partner_contact_mobile = item.contact[0].mobile
            },
            handleboxpartner(item) {
                this.tableBox[this.tableBox.length-1].convoy_parnter_id = item.id
                this.tableBox[this.tableBox.length-1].convoy_parnter = item.name
            },
            // 选中结算单位
            handleunit(item) {
                this.typevalue.unit_id = item.id
                this.typevalue.unit_name = item.name
            },
            // 选中订舱代理
            handleBookagent(item) {
                this.typevalue.shipping.booking_agent = item.name
            },
            // 选中代理报关行
            handleProxybroker(item) {
                this.typevalue.customs_broker.proxy_customs_broker = item.name
            },
            // 选中经营单位
            handleManageunit(item) {
                this.typevalue.customs_broker.manage_unit = item.name
            },
            // 选中收款单位
            handleCollectionunit(item) {
                this.typevalue.transport.collection_unit_code = item.code
                this.typevalue.transport.collection_unit_name = item.name
            },
            // 选中联系人
            handlecontact(item) {
                this.typevalue.partner_contact_name = item.contact[0].name
                this.typevalue.partner_contact_mobile = item.contact[0].mobile
            },
            handleboxcontact(item){
                this.tableBox[this.tableBox.length-1].contact_name = item.contact[0].name
                this.tableBox[this.tableBox.length-1].contact_mobile = item.contact[0].mobile
            },
            // 选中联系人
            handleTracontact(item) {
                this.typevalue.transport.contact_name = item.contact[0].name
                this.typevalue.transport.contact_mobile = item.contact[0].mobile
            },
            // 服务类型选中
            changeServerCheck(val){
                let self = this
                this.typevalue.shipping.service_type = []
                val.map(train=>{
                    this.typevalue.shipping.service_type.push(train)
                })
                this.typevalue.shipping.service_type = [...new Set(this.typevalue.shipping.service_type)];
                val.forEach((cal)=>{
                    if(cal=='2' && self.typevalue.order_type.indexOf(3)<0){
                        self.typevalue.order_type.push(3)
                    }
                    if(cal=='3' && self.typevalue.order_type.indexOf(1)<0){
                        self.typevalue.order_type.push(1)
                    }
                    if(cal=='12' && self.typevalue.order_type.indexOf(2)<0){
                        self.typevalue.order_type.push(2)
                    }
                })
                let newarr = []
                self.typevalue.order_type.forEach((cal,key)=>{
                    newarr.push(parseInt(cal))
                })
                self.typevalue.order_type = this.$Base.uniqarr(newarr.sort())
            },
            // 服务配置
            Serverconf(val){
                // 海运进出口
                if(val==1 && this.typevalue.import_type==1){
                    let arr = [
                        { name: '报关服务',id: 2},
                        { name: '押箱服务',id: 5},
                        { name: '保险服务',id: 9},
                        { name: '订舱服务',id: 10},
                        { name: '内装服务',id: 11},
                        { name: '陆运服务',id: 12},
                        { name: '报检服务',id: 13},
                    ]
                    arr.forEach((item)=>{
                        this.serverlist.forEach((cal)=>{
                            if(item.id==cal.id){
                                item.isdisabled = cal.isdisabled
                            }
                        })
                    })
                    this.serverlist = arr
                }
                if(val==1 && this.typevalue.import_type==2){
                    let arr = [
                        { name: '提货服务',id: 1},
                        { name: '报关服务',id: 2},
                        { name: '换单服务',id: 4},
                        { name: '押箱服务',id: 5},
                        { name: '清关服务',id: 6},
                        { name: '送货服务',id: 7},
                        { name: '仓库服务',id: 8},
                        { name: '保险服务',id: 9},
                        { name: '陆运服务',id: 12},
                    ]
                    arr.forEach((item)=>{
                        this.serverlist.forEach((cal)=>{
                            if(item.id==cal.id){
                                item.isdisabled = cal.isdisabled
                            }
                        })
                    })
                    this.serverlist = arr
                }
                // 陆运进出口
                if(val==2 && this.typevalue.import_type==1){
                    let arr = [
                        { name: '报关服务',id: 2},
                        { name: '押箱服务',id: 5},
                        { name: '报检服务',id: 13},
                    ]
                    arr.forEach((item)=>{
                        this.serverlist.forEach((cal)=>{
                            if(item.id==cal.id){
                                item.isdisabled = cal.isdisabled
                            }
                        })
                    })
                    this.serverlist = arr
                }
                if(val==2 && this.typevalue.import_type==2){
                    let arr = [
                        { name: '报关服务',id: 2},
                        { name: '押箱服务',id: 5},
                        { name: '报检服务',id: 13},
                    ]
                    arr.forEach((item)=>{
                        this.serverlist.forEach((cal)=>{
                            if(item.id==cal.id){
                                item.isdisabled = cal.isdisabled
                            }
                        })
                    })
                    this.serverlist = arr
                }
                // 报关进出口
                if(val==3 && this.typevalue.import_type==1){
                    let arr = [
                        { name: '陆运服务',id: 12},
                        { name: '报检服务',id: 13},
                    ]
                    arr.forEach((item)=>{
                        this.serverlist.forEach((cal)=>{
                            if(item.id==cal.id){
                                item.isdisabled = cal.isdisabled
                            }
                        })
                    })
                    this.serverlist = arr
                }
                if(val==3 && this.typevalue.import_type==2){
                    let arr = [
                        { name: '陆运服务',id: 12},
                        { name: '报检服务',id: 13},
                    ]
                    arr.forEach((item)=>{
                        this.serverlist.forEach((cal)=>{
                            if(item.id==cal.id){
                                item.isdisabled = cal.isdisabled
                            }
                        })
                    })
                    this.serverlist = arr
                }
            },
            // 地址区划信息
            handleAddress(value){
                let self = this
                let id = ''
                if(value && value.length==1){
                    id = value[0]
                }else if(value && value.length==2){
                    id = value[1]
                }else if(value && value.length==3){
                    id = value[2]
                } else {
                    return
                }
                self.$fetch(self.$getApi('CommonAddress')+'/'+id).then((res) => {
		    		let { error_code, error_msg, data } = res
					if(error_code==0){
                        if(value.length==1) {
                            self.addresslist.forEach((s,i)=>{
                                if(s.value==id){
                                    data.data.forEach((city)=>{
                                        self.addresslist[i].children.push({label: city.name, value: city.id, children: []})
                                    })
                                }
                            })
                        }
						if(value.length==2) {
                            self.addresslist.forEach((s,i)=>{
                                if(s.value==value[0]){
                                    self.addresslist[i].children.forEach((s1,c)=>{
                                        if(value[1]==s1.value){
                                            data.data.forEach((area,k)=>{
                                                self.addresslist[i].children[c].children.push({label: area.name, value: area.id, children: []})
                                            })
                                        }
                                    })
                                }
                            })
                        }
                        if(value.length==3) {
                            self.addresslist.forEach((s,i)=>{
                                if(s.value==value[0]){
                                    self.addresslist[i].children.forEach((s1,c)=>{
                                        if(value[1]==s1.value){
                                            self.addresslist[i].children[c].children.forEach((s2,b)=>{
                                                if(value[2]==s2.value){
                                                    data.data.forEach((area,k)=>{
                                                        self.addresslist[i].children[c].children[b].children.push({label: area.name, value: area.id})
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            },
            getDistrictList(type,id){
		    	let self = this
                let params = {}
                self.$fetch(self.$getApi('CommonAddress')).then((res) => {
		    		let { error_code, error_msg, data } = res
					if(error_code==0){
                        data.data.forEach((val)=>{
                            if(val.p_id==0){
                                self.addresslist.push({label: val.name, value: val.id, children: []})
                            }
                        })
                    }
                })
            },
            // 刷新
            Refresh(){
                this.serchForm()
            },
            // 打开弹出框
            Creatdialog(val){
                this.dialogtype = true
                this.dialogtext = 'add'
                this.typevalue = JSON.parse(JSON.stringify(this.typevaluedefault))
                this.typevalue.order_type = []
                this.typevalue.box = [
                    {box_size_type: '', count: ''},
                    {box_size_type: '', count: ''},
                    {box_size_type: '', count: ''},
                    {box_size_type: '', count: ''},
                ]
            },
            // 关闭弹出框
            Closecreattype(type){
                this.$confirm('是否保存数据更改?', '保存确认', {
                    confirmButtonText: '保存',
                    cancelButtonText: '取消',
                    closeOnClickModal: false
                }).then(() => {
                    try {
                        this.Creattype(this.dialogtext)
                    } catch(e) {
                        return false
                    };
                }).catch(() => {
                    this.dialogtype = false        
                    this.dialogedit = false        
                });
            },
            // 业务类型选择
            changeOrderCheck(val){
                this.typevalue.order_type = val
            },
            // 添加联系方式
            addcontact(){
                let obj = {
                    name:'',
                    mobile:''
                }
                this.typevalue.contact.push(obj)
            },
            // 删除联系方式
            delcontact(i){
                this.typevalue.contact.splice(i, 1);
            },
            // 添加发票
            addinvoice(){
                let obj = {
                    title:''
                }
                this.typevalue.invoice_title.push(obj)
            },
            // 删除发票
            delinvoice(i){
                this.typevalue.invoice_title.splice(i, 1);
            },
            // 结算类型选择
            Choosepayment(val){
                if(val=='1'){
                    this.isyuejie = true
                    this.typevalue.payment_day = {
                        month_pay_month: '',
                        month_pay_day: '',
                        cash_pay_day: 0
                    }
                } else {
                    this.isyuejie = false
                    this.typevalue.payment_day = {
                        month_pay_month: 0,
                        month_pay_day: 0,
                        cash_pay_day: ''
                    }
                }
            },
            // 业务类型选择
            changeCheck(val){
                this.typevalue.order_type = val
            },
            checktype(val){
                this.typevalue.import_type = val
            },
            handleClick(val){
                this.dialogtab = val.paneName
            },
            //创建验证
            Creatyz(n){
                let self = this
                Object.keys(self.typevalue).forEach((key) => {
                    if(self.typevalue[key].length<1){
                        if(key=='order_type' && n==1){
                            self.$message.error('请选择费用类型！');
                            throw Error()
                        }
                        if(key=='partner_id' && n==2){
                            self.$message.error('请选择委托单位！');
                            throw Error()
                        }
                        if(key=='unit_id' && n==2){
                            self.$message.error('请选择付款单位！');
                            throw Error()
                        }
                        if(key=='bl_no' && n==2){
                            self.$message.error('请输入提单号！');
                            throw Error()
                        }
                        if(key=='ship_company_code' && n==2){
                            self.$message.error('请选择船公司信息！');
                            throw Error()
                        }
                    }
                    if(key=='box' && n==2){
                        self.typevalue[key].forEach((vl)=>{
                            if(vl.box_size_type.length<1 || vl.count.length<1){
                                self.$message.error('请完善箱量信息！');
                                throw Error()
                            }
                        })
                    }
                })
            },
            // 创建 第二个弹框
            Creattype2(type){
                this.dialogtext = 'add'
                this.dialogtab = '1'
                let self = this
                try {
                    this.Creatyz(1)
                } catch(e) {
                    return false
                };
                self.dialogtype2 = true
                
                this.Twoaction()
                
            },
            // 第二个弹窗打开时需调用的
            Twoaction(){
                let self = this
                this.BoxsizeType()
                this.tabordertype = this.typevalue.order_type[0]
                this.typevalue.order_type.forEach((val)=>{
                    if(val==1){
                        self.typevalue.shipping.service_type.push(3)
                    } else if(val==2){
                        self.typevalue.shipping.service_type.push(3,12)
                    } else if(val==3){
                        self.typevalue.shipping.service_type.push(2,12)
                    }
                    self.serverlist.forEach((item,key)=>{
                        if(val == item.id){
                            self.$set(self.serverlist[key],'isdisabled',true)
                        } else {
                            self.$set(self.serverlist[key],'isdisabled',false)
                        }
                    })
                })
                Array.from(new Set(self.typevalue.shipping.service_type))
                this.Serverconf(this.tabordertype)
            },
            // 切换tab
            tabchange(val){
                let self = this
                let list = self.serverlist
                this.typevalue.transport.service_type = []
                if(this.tabordertype==2){
                    this.typevalue.shipping.service_type.forEach((item)=>{
                        this.serverlist.forEach((cal)=>{
                            if(item==cal.id){
                                this.typevalue.transport.service_type.push(item)
                            }
                        })
                    })
                }
                if(this.tabordertype==3){
                    this.typevalue.shipping.service_type.forEach((item)=>{
                        this.serverlist.forEach((cal)=>{
                            if(item==cal.id){
                                this.typevalue.customs_broker.service_type.push(item)
                            }
                        })
                    })
                }
                // if(val==1){
                //     list.forEach((item,key)=>{
                //         if(item.id == 3){
                //             self.$set(self.serverlist[key],'isdisabled',true)
                //         } else {
                //             self.$set(self.serverlist[key],'isdisabled',false)
                //         }
                //     })
                //     if(self.typevalue.shipping.service_type.indexOf(3)<0){
                //         self.typevalue.shipping.service_type.push(3)
                //     }
                // } else if(val==2){
                //     list.forEach((item,key)=>{
                //         if(item.id == 3 || item.id == 12){
                //             self.$set(self.serverlist[key],'isdisabled',true)
                //         } else {
                //             self.$set(self.serverlist[key],'isdisabled',false)
                //         }
                //     })
                //     if(self.typevalue.shipping.service_type.indexOf(3)<0){
                //         self.typevalue.shipping.service_type.push(3)
                //     } else if(self.typevalue.shipping.service_type.indexOf(12)<0){
                //         self.typevalue.shipping.service_type.push(12)
                //     }
                // } else if(val==3){
                //     list.forEach((item,key)=>{
                //         if(item.id == 2 || item.id == 3){
                //             self.$set(self.serverlist[key],'isdisabled',true)
                //         } else {
                //             self.$set(self.serverlist[key],'isdisabled',false)
                //         }
                //     })
                //     if(self.typevalue.shipping.service_type.indexOf(2)<0){
                //         self.typevalue.shipping.service_type.push(2)
                //     } else if(self.typevalue.shipping.service_type.indexOf(3)<0){
                //         self.typevalue.shipping.service_type.push(3)
                //     }
                // }
            },
            // 创建类型
            Creattype(type){
                type = this.typevalue.id > 0 ? 'edit' : 'add'
                let self = this
                try {
                    this.Creatyz(2)
                } catch(e) {
                    return false
                };
                let params = this.typevalue
                // self.typevalue.invoice_title.forEach((val)=>{
                //     params.invoice_title.push(val.title)
                // })
                
                if(type == 'add') {
                    this.$post(this.$getApi('ErpOrderAdd'),params).then((res) => {
                        if(res.error_code==0){
                            self.dialogtype = false
                            self.dialogtype2 = false
                            self.$message({
                                message: '提示：创建成功！',
                                type: 'success'
                            });
                            self.serchForm()
                        }
                    })
                } else if (type == 'edit') {
                    this.$post(this.$getApi('ErpOrder')+'/'+this.typevalue.id,params).then((res) => {
                        if(res.error_code==0){
                            self.dialogtype = false
                            self.dialogtype2 = false
                            self.$message({
                                message: '提示：编辑成功！',
                                type: 'success'
                            });
                            self.serchForm()
                        }
                    })
                }
                
            },
            // 关闭修改弹框提示
            Closeedittype(){
                this.$confirm('是否保存数据更改?', '保存确认', {
                    confirmButtonText: '保存',
                    cancelButtonText: '取消',
                    closeOnClickModal: false
                    }).then(() => {
                        try {
                            this.Creattype()
                        } catch(e) {
                            return false
                        };
                    }).catch(() => {
                        this.serchForm()
                        this.dialogtype = false        
                        this.dialogtype2 = false        
                    });
            },
            // 编辑弹框
            Editdialog(val){
                let self = this
                this.dialogtext = 'edit'
                // this.Twoaction()
                this.BoxsizeType()
                this.Serverconf(this.tabordertype)
                this.getDistrictList()
                this.BoxList(val)
                self.typevalue.order_type = []
                self.$fetch(self.$getApi('ErpOrder')+'/'+val.id).then((res) => {
		    		let { error_code, error_msg, data } = res
					if(error_code==0){
                        Object.keys(self.typevalue).forEach((c)=>{
                            if(data[c]){
                                self.typevalue[c] = data[c]
                                if(data[c].transport_clause>0){
                                    self.typevalue[c].transport_clause = parseInt(data[c].transport_clause)
                                }
                            } else if(c='id') {
                                self.typevalue[c] = data[c]
                            }
                            if(c=='shipping'){
                                self.typevalue.order_type.push(1)
                            }
                            if(c=='transport'){
                                self.typevalue.order_type.push(2)
                            }
                            if(c=='customs_broker'){
                                self.typevalue.order_type.push(3)
                            }
                        })
                    }
                })
                this.dialogtype2 = true
            },
            // 列表
            PartnerType(){
                let self = this
                this.$fetch(this.$getApi('PartnerTypeList')).then((res) => {
                    self.partnerTypelist = res.data.list
                    self.total = res.data.total
                    self.page_size = res.data.page_size
                })
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
                        params[val] = self.ruleForm[val]
                    }
                }
                
                for(let val in self.ruleForm){
                    if(val == 'order_type' && self.ruleForm[val].length > 0) {
                        self.ruleForm[val].forEach((item)=>{
                            cs = cs == '' ? val + '[]=' + item : cs+ '&'+ val + '[]=' + item
                        })
                        
                    }else if(self.ruleForm[val] != '' && self.ruleForm[val] != 'null' && self.ruleForm[val] != null){
                        cs = cs == '' ? val + '=' + self.ruleForm[val] : cs+ '&'+ val + '=' + self.ruleForm[val]
                    }
                }
                this.typedatearr.forEach((val)=>{
                    if(val.id==1 && val.startdate!= '' && val.enddate != ''){
                        params.accept_time = val.startdate + '~' + val.enddate
                    }
                    if(val.id==2 && val.startdate!= '' && val.enddate != ''){
                        params.open_port_time = val.startdate + '~' + val.enddate
                    }
                })
                this.typestatusarr.forEach((val)=>{
                    if(val.id==1){
                        params.single_system_status = val.status_id
                    }
                })
                self.$router.push(self.$route.path + '?' + cs)

                this.PartnerList(params)
            },
            // 清空
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.ruleForm = {
                    order_type: [],
                    page: ''
                }
                this.typedatearr = [
                    {id: '', startdate: '', enddate: ''}
                ]
                this.typestatusarr = [
                    {id: '', status_id: ''}
                ]
                this.serchForm()
            },
            // 列表
            PartnerList(params){
                let self = this
                this.$fetch(this.$getApi('ErpOrder'),params).then((res) => {
                    self.tableData = res.data.list
                　　　if (this.selectDataArrL.length > 0) {
                　　　　this.$nextTick(function () {
                　　　　　　this.selectDataArrL.forEach(item => {
                　　　　　　　　this.tableData.forEach(listitem => {
                　　　　　　　　　　if (item.id == listitem.id) {
                　　　　　　　　　　　　this.$refs.multipleTables.toggleRowSelection(listitem, true)
                　　　　　　　　　　}
                　　　　　　　　})
                　　　　　　})
                　　　　})
                　　　}
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
                let text = '完成'
                if(val.length>2){
                    if(val[2]==1){
                        text = '取消'
                    } else if(val[2]==2) {
                        text = '完成'
                    } else if(val[2]==3) {
                        text = '删除'
                    }
                } else {
                    return
                }
                if (this.checkalldata.length < 1) {
                    this.actiontype = []
                    this.$alert('请至少选择一条记录！', text+'失败', {
                        confirmButtonText: '确定',
                        callback: action => {
                            
                        }
                    });
                    return
                }
                this.$confirm('确认' + text + '吗?', text+'确认', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确认',
                    closeOnClickModal: false
                    }).then(() => {
                        let params = {
                            id: [],
                            order_type: val[0],
                            field_type: val[1],
                            status: val[2]
                        }
                        self.checkalldata.forEach((cal)=>{
                            params.id.push(cal.id)
                        })
                        self.$post(self.$getApi('ErpOrderBatch'),params).then((res) => {
                            if(res.error_code==0){
                                self.dialogedit = false
                                self.$message({
                                    message: '提示：'+text+'成功！',
                                    type: 'success'
                                });
                                self.clearSelection()
                                self.serchForm()
                            }
                        })
                    }).catch(() => {
                            
                    });
                this.actiontype = []
            },
            //取消所选
            clearSelection () {
                this.tableData.forEach(listitem => {
                    if (listitem.id != 0) {
                        this.$refs.multipleTables.toggleRowSelection(listitem, false)
                    }
                })
                this.$store.state.business.accountarr = []
                this.checkalldata = []
                this.selectDataArrL = []
            },
            // 全选
            selectAll (arr) {
            　　// 判断全选选中数据是否为空
                if (arr.length > 0) {
                    if (this.selectDataArrL.length > 0) {
                        arr.map(item => {
　　                        let isHaveItem = this.selectDataArrL.findIndex(s => (s.id == item.id))
                            if (isHaveItem == -1) {
                                this.selectDataArrL.push(item)
                            }
                        })
                    } else {
                        this.selectDataArrL = this.selectDataArrL.concat(arr)
                    }
                } else {
                    this.tableData.forEach(ms => {
                        this.selectDataArrL.map(item => {
                            if (ms.id == item.id) {
                                this.selectDataArrL = this.selectDataArrL.filter(items => items.id!= ms.id)
                            }
                        })
            　　　　})
                }
            },
            // 单独选择
            selectChange (arr,row) {
            　　// 判断选中数据中是否包含当前的row
            　　let isHaveItem = this.selectDataArrL.find(item => item.id== row.id)
            　　if (isHaveItem) {
            　　　　this.selectDataArrL = this.selectDataArrL.filter(item => item.id != isHaveItem.id)
            　　} else {
            　　　　this.selectDataArrL.push(row)
            　　}
            },
            // 多选操作
            handleSelectionChange(val) {
                let self = this
                let checkobj = {}, checkarr = this.$store.state.business.accountarr
                checkobj[this.currentPage] = val
                if (checkarr.length > 0) {
                    checkarr.forEach((item, i) => {
                        if(Object.keys(item) == this.currentPage) {
                            checkarr[i]= checkobj
                        } else {
                            checkarr.push(checkobj)
                        }
                    })
                } else {
                    checkarr.push(checkobj)
                }
                let valarr = []
                this.$store.dispatch('SET_Account_FUN', checkarr)
                valarr = this.$store.state.business.accountarr
                let curval = []
                valarr.forEach((v) => {
                    if(v[Object.keys(v)[0]].length > 0){
                        v[Object.keys(v)[0]].forEach((c)=>{
                            curval.push(c)
                        })
                    }
                })
                this.checkalldata = curval
            },
            // 全选
            selectboxAll (arr) {
            　　// 判断全选选中数据是否为空
                if (arr.length > 0) {
                    if (this.selectBoxArrL.length > 0) {
                        arr.map(item => {
　　                        let isHaveItem = this.selectBoxArrL.findIndex(s => (s.id == item.id))
                            if (isHaveItem == -1) {
                                this.selectBoxArrL.push(item)
                            }
                        })
                    } else {
                        this.selectBoxArrL = this.selectBoxArrL.concat(arr)
                    }
                } else {
                    this.tableBox.forEach(ms => {
                        this.selectBoxArrL.map(item => {
                            if (ms.id == item.id) {
                                this.selectBoxArrL = this.selectBoxArrL.filter(items => items.id!= ms.id)
                            }
                        })
            　　　　})
                }
            },
            // 单独选择
            selectboxChange (arr,row) {
            　　// 判断选中数据中是否包含当前的row
            　　let isHaveItem = this.selectBoxArrL.find(item => item.id== row.id)
            　　if (isHaveItem) {
            　　　　this.selectBoxArrL = this.selectBoxArrL.filter(item => item.id != isHaveItem.id)
            　　} else {
            　　　　this.selectBoxArrL.push(row)
            　　}
            },
            // 多选操作
            handleSelectionboxChange(val) {
                let self = this
                let checkobj = {}, checkarr = this.$store.state.business.boxarr
                checkobj[this.currentPage] = val
                if (checkarr.length > 0) {
                    checkarr.forEach((item, i) => {
                        if(Object.keys(item) == this.currentPage) {
                            checkarr[i]= checkobj
                        } else {
                            checkarr.push(checkobj)
                        }
                    })
                } else {
                    checkarr.push(checkobj)
                }
                let valarr = []
                this.$store.dispatch('SET_Box_FUN', checkarr)
                valarr = this.$store.state.business.boxarr
                let curval = []
                valarr.forEach((v) => {
                    if(v[Object.keys(v)[0]].length > 0){
                        v[Object.keys(v)[0]].forEach((c)=>{
                            curval.push(c)
                        })
                    }
                })
                this.checkallbox = curval
            },
            BoxList(val){
                let self = this
                let params = {
                    order_id: val.id
                }
                this.curorderid = val.id
                this.$fetch(this.$getApi('BoxList'),params).then((res) => {
                    self.tableBox = res.data
                　　　if (this.selectBoxArrL.length > 0) {
                　　　　this.$nextTick(function () {
                　　　　　　this.selectBoxArrL.forEach(item => {
                　　　　　　　　this.tableBox.forEach(listitem => {
                　　　　　　　　　　if (item.id == listitem.id) {
                　　　　　　　　　　　　this.$refs.multipleTables.toggleRowSelection(listitem, true)
                　　　　　　　　　　}
                　　　　　　　　})
                　　　　　　})
                　　　　})
                　　　}
                })
            },
            Boxaddlist(){
                let self = this
                let defvalue = {
                    order_id: this.curorderid,
                    box_code: '',
                    box_ensupe: '',
                    box_size_type: '',
                    weight: '',
                    pieces: this.typevalue.pieces,
                    pieces_desc: this.typevalue.pieces_desc,
                    volume: '',
                    addr_add3_id: '',
                    addr_add4_id: '',
                    addr_detail: '',
                    contact_name: '',
                    contact_mobile: '',
                    product_time: '',
                    convoy_parnter_id: '',
                    remark_str1: '',
                    address: [],
                    isedit: true
                }
                self.tableBox.push(defvalue)
                
            },
            AddBox(val){
                let params = val
                let self = this
                params.addr_add3_id = val.address[2]
                params.addr_add4_id = val.address[3]
                try {
                    Object.keys(params).forEach((key) => {
                        if(params[key].length<1){
                            if(key!='pieces_desc' || key!="isedit"){
                                self.$message.error('有未填写项');
                                throw Error()
                            }
                        }
                    })
                } catch(e) {
                    return false
                };
                self.$post(self.$getApi('BoxAdd'),params).then((res) => {
                    if(res.error_code==0){
                        self.$message({
                            message: '提示：'+text+'成功！',
                            type: 'success'
                        });
                    }
                })
            },
            delBox(i){
                this.tableBox.splice(i, 1);
            },
        },
        mounted() {
            let self = this
            let params = {}
            this.currentPage = this.$route.query.page?parseInt(this.$route.query.page):1
            // 处理地址栏参数赋值
            for(let val in self.ruleForm){
                if(self.$route.query[val] && self.$route.query[val]!='' && self.$route.query[val]!='null'){
                    if(val=='date_scope'){
                        self.ruleForm[val] = self.$route.query[val].split(',')
                    }else{
                        self.ruleForm[val] = self.$route.query[val]
                    }
                }
            }
            // 搜索项赋值
            for(let val in self.searchValue){
                if(self.$route.query[val] && self.$route.query[val]!='' && self.$route.query[val]!='null'){
                    if(val=='date_scope'){
                        self.ruleForm[val] = self.$route.query[val].split(',')
                        params[val] = self.$route.query[val].split(',')[0]+'~'+self.$route.query[val].split(',')[1]
                    }else{
                        params[val] = self.$route.query[val]
                    }

                }
            }
            // this.dialogtype2= true
            // this.Twoaction()

            this.tabindex = this.ruleForm.import_type == 2 ? 1 : 0
            this.serchForm(this.currentPage)
            this.typevaluedefault = this.typevalue
            if(this.ruleForm.import_type==2){
                this.actionoptions = [{
                    value: 1,
                    label: '海运',
                    children: [{
                        value: 1,
                        label: '业务制单',
                        children: [
                            {
                                value: 2,
                                label: '完成'
                            },
                            {
                                value: 1,
                                label: '取消'
                            },
                        ]
                    }]
                }, {
                    value: 2,
                    label: '陆运',
                    children: [{
                        value: 1,
                        label: '业务制单',
                        children: [
                            {
                                value: 2,
                                label: '完成'
                            },
                            {
                                value: 1,
                                label: '取消'
                            },
                        ]
                    }]
                }, {
                    value: 3,
                    label: '报关',
                    children: [{
                        value: 1,
                        label: '业务制单',
                        children: [
                            {
                                value: 2,
                                label: '完成'
                            },
                            {
                                value: 1,
                                label: '取消'
                            },
                        ]
                    }]
                }]
            }
            
        },
    }

</script>
<style scoped lang="scss">
    .rightbox{
        width:100%;
        text-align:right;
        margin-bottom:10px;
    }
    .w300{
        width:300px;
    }
    .el-input.is-disabled .el-input__inner{
        text-align:center;
    }
    .box-card{
        margin-bottom:15px;
    }
    .cardtable{
        border-radius:0px;
    }
    .ruleForm{
        margin-bottom:-20px;
    }
    .tabtrp{
        margin:0px;
        padding: 0px;
        line-height: 14px;
    }
    .el-table__row{
        font-size: 12px;
    }
    .Fgreen{
        .el-button--text:focus, .el-button--text:hover{
            color:#2ED47A;
        }
    }
    .tagyellow{
        padding: 2px 8px;
        background: #FD9E32;
        font-size: 12px;
        border-radius: 4px;
        color: #fff;
        margin-right: 8px;
        font-weight: bold;
        line-height: 16px;
    }
    .tagblue{
        padding: 2px 8px;
        background: rgba(64,158,255,.1);
        font-size: 12px;
        border-radius: 4px;
        color: #4C545E;
        margin-right: 8px;
        border:1px solid #109CF1;
        font-weight: bold;
        line-height: 16px;
    }
    .taggreen{
        padding: 2px 8px;
        background: #2ED47A;
        font-size: 12px;
        border-radius: 4px;
        color: #fff;
        margin-right: 8px;
        font-weight: bold;
        line-height: 16px;
    }
    .tagred{
        padding: 2px 3px;
        background: #FFA3A3;
        font-size: 14px;
        border-radius: 4px;
        color: #fff;
        margin-right: 2px;
        float: left;
        line-height: 16px;
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
    .tip{
        padding: 0px;
        margin: 0px;
        font-size: 12px;
        color: #85939E;
        line-height: 16px;
    }
    .cgreen{
        background: #2ED47A;
        border: none;
    }
    .actionsave{
        padding:0px 2px;
        color: #ffffff;
        font-size: 12px;
        border-radius: 2px;
        float: left;
        margin-right: 5px;
        cursor: pointer;
    }
    .defhsbat{
        background: #F8F8F8;
        border: 1px solid #D0D6DA;
        padding: 0px 2px;
    }
    .tableselect{
        width: 212px;
        list-style: none;
        padding: 0px;
        margin-left: -19px;
        li{
            list-style: none;
            width: 100%;
            padding: 0px;
        }
        .tr{
            background: #EFF6FF;
            border: 1px solid #D0D6DA;
            span{
                font-weight: bold;
                width: 33.33%;
                float: left;
                padding-left: 5px;
                border-right: 1px solid #D0D6DA;
                box-sizing: border-box;
                &:last-child{
                    border: none;
                }
            }
        }
        .td{
            span{
                width: 33.33%;
                float: left;
                padding-left: 5px;
                box-sizing: border-box;
                overflow: hidden;
                &:last-child{
                    border: none;
                }
            }
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
    .displayBlock{
        margin-right: 5px;
    }
</style>
<style>
    .cardsty .el-input--mini .el-input__inner{
        height: 26px;
        line-height: 26px;
    }
    .card1 .el-input--mini .el-input__icon{
        line-height: 22px;
    }
    .diaimport .el-dialog{
        min-width: 1000px;
        max-width: 1800px;
    }
    .tabdialog2 {
        max-width: 200px;
        display: inline-block;
    }
    
    .diaimport .el-tabs__nav-wrap::after{
        height: 0px;
    }
    .diaimport .el-dialog__body{
        background: #e6ebf0;
    }
    .diaimport .el-dialog__body{
        padding: 0px;
    }
    .diaimport .card1 .el-card__body{
        padding: 0px 15px;
    }
    .diaimport .card1 .el-tabs__header{
        margin: 0 0 1px;
        margin-bottom: -5px;
    }
    .diaimport .card1 .el-card{
        border-radius: 0px;
    }
    .selectopt .el-scrollbar{
       width: 216px;
       box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
       border-radius: 2px;
       border: 1px solid #e4e7ed;
    }
    .selectopt{
       overflow: unset;
       border:none;
       box-shadow:none;
       border-radius:0px;
    }
    .selectopt .el-scrollbar{
        background: #ffffff;
    }
    .selectopt.s2 .el-scrollbar{
        margin-left: -72px;
    }
    .selectopt.s3 .el-scrollbar{
        margin-left: -144px;
    }
    .selectopt.ts2 .el-scrollbar{
        margin-left: -105px;
    }
    .cjywdtwo .el-input--suffix .el-input__inner{
        padding-right: 10px;
    }
    .xxselect .el-input--suffix .el-input__inner{
        padding-right: 20px;
    }
    .xxinput .el-input__inner{
        padding: 0px 2px;
    }
    .cjywdtwo .el-form-item--mini.el-form-item{
        margin-bottom: 0px;
    }
    .cjywdtwo{
        padding-bottom: 10px;
    }
    .cjywdtwo .icontext{
        font-style: normal;
        margin-right: 5px;
    }
    .cjywdtab .el-radio-button:first-child .el-radio-button__inner{
        border-radius: 2px 0 0 2px;
    }
    .cjywdtab .el-radio-button:last-child .el-radio-button__inner{
        border-radius: 2px 0 0 2px;
    }
    .cjywdtab .el-radio-button--mini .el-radio-button__inner{
        padding: 0px 25px;
        height: 22px;
        line-height: 22px;
    }
    .cjywdtab .el-input__suffix{
        top: 3px;
    }
    .boxinput .el-input__suffix{
        right: 3px;
    }
    .infocard .el-card__header{
        padding: 0px;
        line-height: 28px;
        background: #EFF6FF;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
    }
    .infocard .el-form-item--mini.el-form-item{
        margin: 0px;
    }
    .infocard .serverinfo .el-checkbox{
        width: 93px;
        margin-bottom: 5px;
        margin-left: 0px;
    }
    .infocard .isedit .el-input--mini .el-input__inner{
        background: #EFF6FF;
    }
    .infocard .el-input--suffix .el-input__inner{
        padding-right: 20px;
    }
</style>
