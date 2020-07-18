<template>
    <div>
        <el-dialog
            title="进转出匹配"
            :visible.sync="dialogmatch"
            width="900px"
            :append-to-body='true'
            class="mapdialogmatch"
            @close='closeDialog'>
            <div>
                <el-card class="box-card mapcardcur" style="margin-bottom: 10px;padding-bottom: 10px">
                    <el-form ref="ruleForm" size="mini" label-width="65px" style="width: 49%;float: left;">
                        <el-form-item label="进出口">
                            <span class="typecolor_2">{{matchdata.import_type==1?'出口':'进口'}}</span>
                        </el-form-item>
                        <el-form-item label="业务单号">
                            <span class="ahref" style="color: #409eff;cursor: pointer" @click="Editdialog(matchdata)">{{matchdata.order_info.code}}</span>
                        </el-form-item>
                        <el-form-item label="提单号">
                            <span>{{matchdata.order_info.bl_no}}</span>
                        </el-form-item>
                        <el-form-item label="箱号">
                            <span>{{matchdata.box_code}}</span>
                        </el-form-item>
                        <el-form-item label="条款">
                            <span>{{matchdata.extra_info.transport_clause}}</span>
                        </el-form-item>
                        <el-form-item label="承运车队">
                            {{matchdata.carrier_remark || '-'}}<span class="ahref" style="color: #409eff;cursor: pointer" @click="Openonepd(matchdata)" v-if="matchdata.carrier_id==0">派单</span>
                            <span class="ahref" style="color: #409eff;cursor: pointer" @click="Canclepd(matchdata)" v-if="matchdata.carrier_id>0">撤销派单</span>
                        </el-form-item>
                         <el-form-item label="匹配策略">
                            <span style="height: 18px;line-height: 18px;" :class="['clcolor_'+matchdata.dispatch_strategy]">{{dispatch_strategylist[matchdata.dispatch_strategy]}}</span>
                            <span>{{dispatch_statuslist[matchdata.dispatch_status]}}</span>
                            <span v-if="matchdata.dispatch_status==3">({{matchdata.dispatch_remark}})</span>
                        </el-form-item>
                    </el-form>
                    <el-form ref="ruleForm" size="mini" label-width="65px" style="width: 49%;float: left;">
                        <el-form-item label="箱型">
                            <span style="color: #FF6666">{{matchdata.size_type}}</span>
                        </el-form-item>
                        <el-form-item label="货物">
                            <span>{{matchdata.extra_info.product_eng_name}}</span>
                            <span v-if="matchdata.extra_info.product_chn_name">({{matchdata.extra_info.product_chn_name}})</span>
                        </el-form-item>
                        <el-form-item label="卸货地址">
                            <span v-for="(item, index) in matchdata.address_district" :key="index">{{item}}</span>
                        </el-form-item>
                        <el-form-item label="详细地址">
                            <span style="line-height: 18px;padding-top: 5px;">{{matchdata.address_detail}}</span>
                            <span style="color: #409eff;cursor: pointer;" @click="creatmap(curdata,matchdata)">查看</span>
                        </el-form-item>
                        <el-form-item label="卸货时间">
                            <span>{{matchdata.product_time}} ({{matchdata.contact.name}} {{matchdata.contact.mobile}})</span>
                        </el-form-item>
                        <el-form-item label="派车备注">
                            <span style="line-height: 1.5;padding-top: 5px;">{{matchdata.carrier_remark}}</span>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card class="box-card mapcard">
                    <div class="mapbox" id="allmap">
                    </div>
                    <div class="matchbox" v-if="curdata && curdata.length>0  && !dialogdetail && matchdata.dispatch_status!=3">
                        <el-button type="primary" @click="Matchclick()" size="mini" class="actionbtn" style="background: #1DD397;">匹配最优</el-button>
                        <el-button type="primary" @click="dialogbat=true" class="actionbtn" size="mini" style="background: #FF6666;">标记匹配失败</el-button>
                    </div>
                    <div class="wlbox" v-if="curdata && curdata.length>0 && !dialogdetail">
                        <div class="timelist">
                            <ul class="rangetime">
                                <li v-for="(item,i) in curdata" :class="(item.box_info.carrier_id>0 || item.box_info.dispatch_box_id>0)?'match':item.status>1?'ismatch':''" @mouseenter="creatmaphover(curdata,item.box_info,i,'hover')">
                                    <div class="title-r">
                                        <div class="dianbox" @click="creatmap(curdata,item.box_info,i)"><span class="defpoint"><img :src="pointimg" /><font>{{i+1}}</font></span></div>
                                        <div class="dianbox" @click="creatmap(curdata,item.box_info,i)" v-show="item.box_info.carrier_id>0 || item.box_info.dispatch_box_id>0"><span class="defpoint"><img :src="pointimghs" /><font>{{i+1}}</font></span></div>
                                        <span  @click="Detailbox(item,i)">
                                            <p class="name-t" :style="item.box_info.product_time?'color:#222222':'color:rgb(253, 158, 50)'">{{item.box_info.product_time || '未录入时间'}}<span class="weight">{{item.box_info.size_type}}</span></p>
                                            <p class="content-t">{{item.box_info.address_full}}</p>
                                            <p class="content-t">{{item.box_info.contact.name}} {{item.box_info.contact.mobile}}</p>
                                            <p class="content-t"><span class="textborder" v-if="item.box_info.extra_info.transport_clause">{{item.box_info.extra_info.transport_clause}}</span><span style="color:#85939E;margin-left: 5px;" v-if="item.box_info.extra_info.product_eng_name">{{item.box_info.extra_info.product_eng_name}}</span><span style="color:#85939E" v-if="item.box_info.extra_info.product_chn_name">({{item.box_info.extra_info.product_chn_name}})</span></p>
                                            <p class="content-t"><span class="typecolor_1" style="padding: 0px">距离</span>{{item.distance_txt}} <span class="typecolor_1" style="padding: 0px">耗时</span>{{item.duration_txt}}</p>
                                            <span class="flag" v-if="item.box_info.dispatch_status==4">已变更</span>
                                            <span class="flag" v-if="item.box_info.dispatch_status==3">失败</span>
                                            <span class="flag" v-if="item.box_info.dispatch_box_id>0">已匹配</span>
                                            <span class="flag" v-if="item.box_info.carrier_id>0">已派单</span>
                                            <p class="content-t" style="color: #85939E;max-height: 55px;overflow: hidden">{{item.box_info.carrier_remark}}</p>
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="detailbox" v-if="dialogdetail">
                        <div class="back" @click="Closedetail()">
                            <i class="el-icon-arrow-left"></i>
                            返回列表
                        </div>
                        <div class="conbox">
                            <div class="headblue">
                                <p class="title">{{detailcur.address_detail || '-'}}<span class="weight">{{detailcur.size_type}}</span></p>
                                <p class="content-t"><span v-for="(item,index) in detailcur.address_district" :key="index">{{item}}</span></p>
                            </div>
                            <div class="botwhite">
                                <el-form ref="ruleForm" size="mini" label-width="65px">
                                    <el-form-item label="匹配方案" v-if="detailcur.product_time">
                                       <span>{{detailcur.count}}条</span>
                                        <span style="color: #409eff;cursor: pointer" v-if="detailcur.count>0" @click="Showall(detailcur)">查看</span>
                                    </el-form-item>
                                    <el-form-item label="装货时间">
                                        <span>{{detailcur.product_time || '未录入时间'}}</span>
                                    </el-form-item>
                                    <el-form-item label="联系方式">
                                        <span>{{detailcur.contact.name}} {{detailcur.contact.mobile}}</span>
                                    </el-form-item>
                                    <el-form-item label="业务单号">
                                        <span style="color: #409eff;cursor: pointer" @click="Editdialog(detailcur)">{{detailcur.order_info.code}}</span>
                                    </el-form-item>
                                    <el-form-item label="提单号">
                                        <span>{{detailcur.order_info.bl_no}}</span>
                                    </el-form-item>
                                    <el-form-item label="箱号">
                                        <span>{{detailcur.box_code}}</span>
                                    </el-form-item>
                                    <el-form-item label="条款" v-if="detailcur.extra_info.transport_clause">
                                        <span>{{detailcur.extra_info.transport_clause}}</span>
                                    </el-form-item>
                                    <el-form-item label="货物" v-if="detailcur.extra_info.product_chn_name || detailcur.extra_info.product_eng_name">
                                        <span>{{detailcur.extra_info.product_eng_name}}</span>
                                        <span v-if="detailcur.extra_info.product_chn_name">({{detailcur.extra_info.product_chn_name}})</span>
                                    </el-form-item>
                                    <el-form-item label="派车备注">
                                        <span>{{detailcur.carrier_remark}}</span>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="bottombtn">
                                <el-button type="primary" size="mini" class="actionbtn" style="background: #1DD397;" v-if="detailcur.dispatch_box_id<1 && detailcur.carrier_id==0 && detailcur.dispatch_status<3" @click="MatchclickMatching(detailcur)">匹配</el-button>
                                <el-button size="mini" style="margin-left: 0px;height: 26px" @click="Closedetail()">返回</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="detailbox" v-if="box_dispatch.id>0 && !dialogdetail">
                        <div class="conbox">
                            <div class="headblue">
                                <p class="title">{{box_dispatch.address_detail}}<span class="weight">{{box_dispatch.size_type}}</span></p>
                                <p class="content-t">{{box_dispatch.address_full}}</p>
                                <!-- <p class="content-t">25.2km | 1h20m</p> -->
                            </div>
                            <div class="botwhite">
                                <el-form ref="ruleForm" size="mini" label-width="65px">
                                    <el-form-item label="装货时间">
                                        <span>{{box_dispatch.product_time || '未录入时间'}}</span>
                                    </el-form-item>
                                    <el-form-item label="联系方式">
                                        <span>{{box_dispatch.contact.name}} {{box_dispatch.contact.mobile}}</span>
                                    </el-form-item>
                                    <el-form-item label="业务单号">
                                        <span style="color: #409eff;cursor: pointer" @click="Editdialog(box_dispatch)">{{box_dispatch.order_info.code}}</span>
                                    </el-form-item>
                                    <el-form-item label="提单号">
                                        <span>{{box_dispatch.order_info.bl_no}}</span>
                                    </el-form-item>
                                    <el-form-item label="箱号">
                                        <span>{{box_dispatch.box_code}}</span>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="bottombtn">
                                <el-button type="primary" size="mini" class="actionbtn" @click="Canclematch()" style="background: #FF6666;">取消匹配</el-button>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
        </el-dialog>
        <!-- 创建-->
        <el-dialog title="标记匹配失败" :visible.sync="dialogbat" :close-on-click-modal="false" width="400px">
            <el-form  size="mini"  label-width="120px">
                <el-form-item label="失败原因" required>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 4}"
                        placeholder="请输入匹配失败原因"
                        style="width:225px"
                        v-model="reason">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer diagsavebtn">
                <el-button type="primary" @click="Batfail()">确 定</el-button>
                <el-button @click="dialogbat = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import BMap from 'BMap'
    export default {
        name:'Financelog',
        data(){
            return {
                dialogmatch: false,
                loading: false,
		        tableData: [],
		        curdata: [],
                tabPosition:'wl',
                dialogImgstatus: false,
                dialogImageUrl:'',
                addstatus:'已出发',
                isuptime:false,
                uptimedata:{},
                dialogImgstatus:false,
                dialogbat:false,
                dialogImageUrl:'',
                typeList: [],
                currow: {},
                pointimg: require('@/assets/img/Path.svg'),
                pointimgblue: require('@/assets/img/Pathblue.svg'),
                pointimghs: require('@/assets/img/Pathhs.svg'),
                makerport: require('@/assets/img/makerport.svg'),
                reason: '',
                matchdata:{
                    extra_info: {},
                    order_info: {},
                    address_district: [],
                    contact: {},
                    location: {
                        location: {}
                    }
                },
                dispatch_statuslist: {
                    0: '待匹配',
                    1: '待确认',
                    2: '已确认',
                    3: '匹配失败',
                    4: '已变更'
                },
                dispatch_strategylist: {
                    0: '待匹配',
                    1: '无策略',
                    2: '进转出',
                    3: '匹配失败'
                },
                box_dispatch: {
                    order_info: {},
                    address_district: [],
                    contact: {},
                    location: {
                        location: {}
                    }
                },
                dialogdetail: false,
                detailcur: {
                    order_info: {},
                    extra_info: {},
                    address_district: [],
                    contact: {},
                    location: {
                        location: {}
                    }
                },
                checkalldata: [],
                mapnew:'',
                curmarker: {},
                zindex: 0,
            }
        },
        props:{
            obj: Object
        },
        created(){
        },
        mounted(){
            this.dialogmatch = true
            this.MatchList()
            
        },
        methods:{
            handleCurrentChange(val,ty) {
                this.currentPage = val
                this.serchForm(val)
            },
            closeDialog() {
                this.dialogmatch = false
                this.$emit('action',this.dialogmatch, true)
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
            },
            Openonepd(val){
                val.box_id = val.id
                this.$emit('action2', true, val)
                // this.$emit('editaction', true, this.matchdata)
            },
             // 编辑弹框
            Editdialog(val){
                this.$emit('editaction', true, val)
            },
            // 匹配最优
            Matchclick(val){
                let self = this
                let param = {
                    box_from_id: self.curdata[0].box_from,
                    box_to_id: self.curdata[0].box_to,
                }
                let i = -1
                self.curdata.forEach((cal, u)=>{
                    if(cal.box_info.dispatch_box_id==0 && cal.box_info.carrier_id==0 && cal.box_info.dispatch_status < 3){
                        if(i==-1){
                            i = u
                        }
                    }
                })
                param = {
                    box_from_id: self.curdata[i].box_from,
                    box_to_id: self.curdata[i].box_to,
                }
                this.$confirm('确认进行匹配?', '匹配确认', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确认',
                    closeOnClickModal: false
                    }).then(() => {
                        self.$post(self.$getApi('DispatchMatchzybox'),param).then((res) => {
                            if(res.error_code==0){
                                self.$message({
                                    message: '匹配成功！',
                                    type: 'success'
                                });
                                self.MatchList()
                            }
                            
                        })
                    }).catch(() => {
                            
                    });
            },
            // 点击匹配
            MatchclickMatching(val){
                let self = this
                let i = -1
                self.curdata.forEach((cal, u)=>{
                    if(cal.box_info.dispatch_box_id==0 && cal.box_info.carrier_id==0 && cal.box_info.dispatch_status < 3 && val.id === cal.box_info.id){
                        i = u
                    }
                })
                let param = {
                    box_from_id: self.curdata[i].box_from,
                    box_to_id: self.curdata[i].box_to,
                }
                this.$confirm('确认进行匹配?', '匹配确认', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确认',
                    closeOnClickModal: false
                    }).then(() => {
                        self.$post(self.$getApi('DispatchMatchzybox'),param).then((res) => {
                            if(res.error_code==0){
                                self.$message({
                                    message: '匹配成功！',
                                    type: 'success'
                                });
                                self.MatchList()
                            }
                            
                        })
                    }).catch(() => {
                            
                    });
            },
            // 当前匹配
            Matchcurclick(val){
                let self = this
                let param = {
                    box_from_id: self.detailcur.id,
                    box_to_id: self.matchdata.id,
                }
                this.$post(this.$getApi('DispatchMatchzybox'),param).then((res) => {
                    if(res.error_code==0){
                        self.$message({
                            message: '匹配成功！',
                            type: 'success'
                        });
                        self.dialogdetail = false
                        self.MatchList()
                    }
                    
                })
            },
            Batfail(){
                let self = this
                let param = {
                    message: this.reason
                }
                if(!this.reason){
                    self.$message({
                        message: '请输入失败原因！',
                        type: 'error'
                    });
                    return
                }
                this.$post(this.$getApi('DispatchMatchfail')+'/'+this.matchdata.id, param).then((res) => {
                    if(res.error_code==0){
                        self.$message({
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.dialogbat = false
                        this.MatchList()
                    }
                    
                })
            },
            // 列表
            PartnerList(){
                let self = this
                this.$fetch(this.$getApi('DispatchMatchbox')+'/'+this.obj.box_id).then((res) => {
                    Object.keys(res.data.location).forEach((val)=>{
                        if(val=='precise'){
                            res.data.location.isprecise = res.data.location.precise?'是':'否'
                        }
                    })
                    self.matchdata = res.data
                })
            },
            // 查看
            Showall(val){
                this.obj.box_id = val.id
                this.dialogdetail = false
                this.MatchList()
            },
            // 撤销派单
            Canclepd(val){
                let self = this
                let text = '完成'
                this.actiontype = ''
                text = '撤销派单'
                self.checkalldata = [val]
                this.$confirm('确认' + text + '吗?', text+'确认', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确认',
                    closeOnClickModal: false
                    }).then(() => {
                        let params = {
                            box_id: [],
                            operate_type: 2
                        }
                        self.checkalldata.forEach((cal)=>{
                            params.box_id.push(cal.id)
                        })
                        self.$post(self.$getApi('ErpBoxBatch'),params).then((res) => {
                            if(res.error_code==0){
                                self.$message({
                                    message: '提示：'+text+'成功！',
                                    type: 'success'
                                });
                                this.MatchList()
                            }
                        })
                    }).catch(() => {
                            
                    });
                this.actiontype = ''
            },
             // 开始匹配
            MatchList(){
                let self = this
                this.curdata = []
                this.matchdata = {
                    extra_info: {},
                    order_info: {},
                    address_district: [],
                    contact: {},
                    location: {
                        location: {}
                    }
                }
                this.box_dispatch = {
                    order_info: {},
                    address_district: [],
                    contact: {},
                    location: {
                        location: {}
                    }
                }
                this.$fetch(this.$getApi('DispatchMatchstrategy')+'/'+this.obj.box_id).then((res) => {
                    Object.keys(res.data.box.location).forEach((val)=>{
                        if(val=='precise'){
                            res.data.box.location.isprecise = res.data.box.location.precise?'是':'否'
                        }
                    })
                    self.$set(self, 'matchdata', res.data.box)
                    if(res.data.strategy) {
                        res.data.strategy.forEach((val)=>{
                            val.box_info.location.isprecise = val.box_info.location.precise?'是':'否'
                        })
                        self.$set(self, 'curdata', res.data.strategy)
                    }
                    self.$set(self, 'box_dispatch', res.data.box_dispatch)
                    self.dialogdetail = false
                    setTimeout(() => {
                        this.creatmap(self.curdata)
                    }, 500);
                })
            },
            //匹配详情
            Detailbox(value,i){
                let self = this
                this.dialogdetail = true
                let id = ''
                if(this.matchdata.import_type==2){
                    id = value.box_to
                } else {
                    id = value.box_from
                }
                this.$fetch(this.$getApi('DispatchMatchstrategy')+'/'+id).then((res) => {
                    res.data.box.count = res.data.strategy.length
                    this.detailcur = res.data.box
                    self.creatmap(self.curdata,value.box_info,i)
                })
            },
            // 返回
            Closedetail(){
                this.dialogdetail = false
                this.MatchList()
            },
            // 取消匹配
            Canclematch(){
                let self = this
                let param = {
                    box_from_id: self.box_dispatch.id,
                    box_to_id: self.box_dispatch.dispatch_box_id
                }
                this.$post(this.$getApi('DispatchMatchdisbox'),param).then((res) => {
                    if(res.error_code==0){
                        self.$message({
                            message: '取消成功！',
                            type: 'success'
                        });
                        this.MatchList()
                    }
                    
                })
            },
            creatmaphover(mapdata,pointval,crtypr){
                let self = this
                var map = this.mapnew
                this.zindex = this.zindex + 1
                var curmarker = {}
                map.clearOverlays();
                // 港口
                var addtbox = new BMap.Point(117.750373,39.051912);
                var tboxIcon = new BMap.Icon(require('@/assets/img/makerport.svg'), new BMap.Size(33,51));
                var markertbox = new BMap.Marker(addtbox, {icon: tboxIcon})
                map.addOverlay(markertbox)

                // 进口
                let imgl = self.matchdata.import_type==1 ?require('@/assets/img/makerout.svg'):require('@/assets/img/makerin.svg')
                var addlbox = new BMap.Point(self.matchdata.location.location.lng,self.matchdata.location.location.lat);
                var lboxIcon = new BMap.Icon(imgl, new BMap.Size(33,51));
                var markerlbox = new BMap.Marker(addlbox, {icon: lboxIcon})
                map.addOverlay(markerlbox)

                // 进口
                if(self.box_dispatch.id>0){
                    let imgls = self.box_dispatch.import_type==1 ?require('@/assets/img/makerout.svg'):require('@/assets/img/makerin.svg')
                    var addlsbox = new BMap.Point(self.box_dispatch.location.location.lng,self.box_dispatch.location.location.lat);
                    var lsboxIcon = new BMap.Icon(imgls, new BMap.Size(33,51));
                    var markerlsbox = new BMap.Marker(addlsbox, {icon: lsboxIcon})
                    map.addOverlay(markerlsbox)
                }
                Object.keys(self.curmarker).forEach((val,i)=>{
                    var curimg = self.pointimgblue
                    var img = self.pointimg
                    var addzh = new BMap.Point(self.curmarker[i].point.lng, self.curmarker[i].point.lat);
                    
                    if(crtypr==i){
                        var zhIcon = new BMap.Icon(require('@/assets/img/Pathblue.svg'), new BMap.Size(44,38));
                        var label = new BMap.Label(i+1,{offset:new BMap.Size(20,-10)});
                        curmarker[i] = new BMap.Marker(addzh, {icon: zhIcon, setTop:true})
                        self.curmarker[i] = curmarker[i]
                        map.addOverlay(curmarker[i])
                        self.curmarker[crtypr].setZIndex(this.zindex);
                        label.setStyle({
                            color : "#ffffff",
                            fontSize : "12px",
                            height : "20px",
                            lineHeight : "20px",
                            width: "20px",
                            textAlign: "center",
                            background: "none",
                            marginLeft: "-21px",
                            marginTop: "10px",
                            border: "none",
                            fontFamily:"微软雅黑"
                        });
                        curmarker[i].setLabel(label);
                    } else {
                        var zhIcon = new BMap.Icon(require('@/assets/img/Path.svg'), new BMap.Size(44,38));
                        var label = new BMap.Label(i+1,{offset:new BMap.Size(20,-10)});
                        curmarker[i] = new BMap.Marker(addzh, {icon: zhIcon, setTop:true})
                        self.curmarker[i] = curmarker[i]
                        map.addOverlay(curmarker[i])
                        // self.curmarker[i].setZIndex(this.zindex);
                        label.setStyle({
                            color : "#ffffff",
                            fontSize : "12px",
                            height : "20px",
                            lineHeight : "20px",
                            width: "20px",
                            textAlign: "center",
                            background: "none",
                            marginLeft: "-21px",
                            marginTop: "10px",
                            border: "none",
                            fontFamily:"微软雅黑"
                        });
                        curmarker[i].setLabel(label);
                    }
                })
                
                map.panTo(new BMap.Point(pointval.location.location.lng, pointval.location.location.lat));
            },
            creatmap(mapdata,pointval,crtypr,action){
                let self = this
                this.curmarker = {}
                let start = {}
                let tbox = {}, lbox = {}, uptime = {}, gc = {}, zh = {}
                var map = new BMap.Map("allmap");
                this.mapnew = map
                let newarr = [],wayarr=[],pointArray=[]
                let isfr = true,istbox = true, islbox = true, istime = true, isgc = true, iszh = true
                if(mapdata.lengtn<1){
                    mapdata = [
                        {box_info: self.box_dispatch}
                    ]
                }
                mapdata.forEach((res,i)=>{
                    if(res.box_info.location.location.lat>0 && res.box_info.location.location.lng>0){
                        newarr.push({lat:res.box_info.location.location.lat,lng:res.box_info.location.location.lng})
                    }
                })

                 // 港口
                var addtbox = new BMap.Point(117.750373,39.051912);
                var tboxIcon = new BMap.Icon(require('@/assets/img/makerport.svg'), new BMap.Size(33,51));
                var markertbox = new BMap.Marker(addtbox, {icon: tboxIcon})
                map.addOverlay(markertbox)
                wayarr.push(addtbox)

                // 进口
                let imgl = self.matchdata.import_type==1 ?require('@/assets/img/makerout.svg'):require('@/assets/img/makerin.svg')
                var addlbox = new BMap.Point(self.matchdata.location.location.lng,self.matchdata.location.location.lat);
                var lboxIcon = new BMap.Icon(imgl, new BMap.Size(33,51));
                var markerlbox = new BMap.Marker(addlbox, {icon: lboxIcon})
                map.addOverlay(markerlbox)
                wayarr.push(addlbox)

                // 进口
                if(self.box_dispatch.id>0){
                    let imgls = self.box_dispatch.import_type==1 ?require('@/assets/img/makerout.svg'):require('@/assets/img/makerin.svg')
                    var addlsbox = new BMap.Point(self.box_dispatch.location.location.lng,self.box_dispatch.location.location.lat);
                    var lsboxIcon = new BMap.Icon(imgls, new BMap.Size(33,51));
                    var markerlsbox = new BMap.Marker(addlsbox, {icon: lsboxIcon})
                    map.addOverlay(markerlsbox)
                    wayarr.push(addlsbox)
                }

                newarr.forEach((res,i)=>{
                    wayarr.push(new BMap.Point(res.lng,res.lat))
                })

                if(newarr.length>0){
                    
                    if(pointval){
                        if(pointval.location.location.lng>0 && pointval.location.location.lat>0){
                            if(action && action=='hover'){
                                // map.panTo(new SuperMap.LonLat(pointval.location.location.lng, pointval.location.location.lat));
                                map.centerAndZoom(new BMap.Point(pointval.location.location.lng, pointval.location.location.lat), 10);
                                map.disableScrollWheelZoom();
                            } else {
                                var point = new BMap.Point(pointval.location.location.lng, pointval.location.location.lat);
                                var sContent ="<div style='width: 220px'><p style='font-size: 12px;margin-bottom: -5px'>地址名称："+pointval.address_full+"</p><p style='font-size: 12px;margin-bottom: -5px'>地址类型："+pointval.location.level+"</p><p style='font-size: 12px;margin-bottom: -5px'>精准打点："+pointval.location.isprecise+"</p><p style='font-size: 12px;margin-bottom: -5px'>绝对精度："+pointval.location.confidence+"</p><p style='font-size: 12px;margin-bottom: -5px'>解析程度："+pointval.location.comprehension+"</p><div>";
                                map.centerAndZoom(new BMap.Point(pointval.location.location.lng, pointval.location.location.lat), 12);
                                var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
                                map.openInfoWindow(infoWindow,point); //开启信息窗口
                            }
                        }else{
                            map.centerAndZoom(new BMap.Point(116.400244,39.92556), 12);
                        }
                    }else{
                        if(newarr[0].lng>0 && newarr[0].lat>0){
                            map.centerAndZoom(new BMap.Point(newarr[0].lng,newarr[0].lat), 9);
                        } else {
                            map.centerAndZoom(new BMap.Point(116.400244,39.92556), 9);
                        }
                        map.setViewport(wayarr)
                    }

                    map.enableScrollWheelZoom();

                    
                    
                    var curmarker = {}
                    newarr.forEach((val, i)=>{
                        var curimg = self.pointimg
                        if(crtypr && crtypr == i){
                            if(pointval.carrier_id>0 || pointval.dispatch_box_id>0){
                                curimg = self.pointimghs
                            }
                        }
                        var addzh = new BMap.Point(val.lng,val.lat);
                        var zhIcon = new BMap.Icon(curimg, new BMap.Size(44,38));
                        curmarker[i] = new BMap.Marker(addzh, {icon: zhIcon, setTop:true})
                        self.curmarker[i] = curmarker[i]

                        
                        map.addOverlay(curmarker[i])
                        // map.setTop(true)
                        var label = new BMap.Label(i+1,{offset:new BMap.Size(20,-10)});
                        label.setStyle({
                            color : "#ffffff",
                            fontSize : "12px",
                            height : "20px",
                            lineHeight : "20px",
                            width: "20px",
                            textAlign: "center",
                            background: "none",
                            marginLeft: "-21px",
                            marginTop: "10px",
                            border: "none",
                            fontFamily:"微软雅黑"
                        });
                        curmarker[i].setLabel(label);
                    })
                    this.zindex = this.zindex + 1
                    if(crtypr){
                        curmarker[crtypr].setTop('true');
                    }
                    
                    
                    


                    // map.setViewport(wayarr);//让所有点在视野范围内
                   

                    // var polyline = new BMap.Polyline(wayarr, {
                    //     strokeColor:"#0db359",
                    //     fillColor:"red",
                    //     strokeWeight:8,
                    //     strokeOpacity:0.8,
                    //     fillOpacity: 0.8,
                    //     strokeStyle:"solid" //dashed
                    // });
                    // map.addOverlay(polyline);
                    map.disableScrollWheelZoom();



                    // var polyline =new BMap.Polyline(pois, {
                    //     enableEditing: false,//是否启用线编辑，默认为false
                    //     enableClicking: true,//是否响应点击事件，默认为true
                    //     icons:[icons],
                    //     strokeWeight:'8',//折线的宽度，以像素为单位
                    //     strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
                    //     strokeColor:"#18a45b" //折线颜色
                    // });
                }else{
                    map.setViewport(wayarr)
                    // map.centerAndZoom(new BMap.Point(116.400244,39.92556), 12);
                }
                var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL});
                map.addControl(top_right_navigation);

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
.typecolor_4{
    height: 16px;
    line-height: 16px;
    padding: 0px 4px;
    background: #FFE8E8;
    border: 1px solid #FF6666;
    font-size: 12px;
    margin-right: 5px;
}
.clcolor_0{
    background: #F8F8F8;
    border: 1px solid #D0D6DA;
    padding: 0px 2px;
}
.clcolor_1{
    background: #F8F8F8;
    border: 1px solid #D0D6DA;
    padding: 0px 2px;
}
.clcolor_2{
    background: #EFF6FF;
    border: 1px solid #109CF1;
    padding: 0px 2px;
}
.clcolor_3{
    background: #FFE8E8;
    border: 1px solid #FF6666;
    padding: 0px 2px;
}
span{
    display: inline-block;
}
.mapbox{
    width: 100%;
    float: left;
    padding-bottom: 40px;
    position: relative;
    height: 500px;
}
.mapcard{
    position: relative;
}
.wlbox{
    position: absolute;
    overflow: hidden;
    top: 0px;
    left: 0px;
    padding: 10px;
    box-sizing:border-box;
    z-index: 99;
    .timelist{
        width: 240px;
        padding:0px;
        box-shadow: 0px 0px 4px #CCCCCC;
        border-radius: 4px;
        background: #ffffff;
        box-sizing:border-box;
        float: left;
        max-height: 480px;
        overflow-y: auto;
    }
}
.textborder {
    height: 16px;
    line-height: 16px;
    text-align: center;
    border: 1px solid #85939E;
    color: #85939E;
    font-size:12px;
    padding: 0px 3px;;
}
.rangetime{
    width: 100%;
    list-style: none;
    padding: 0px;
    margin: 0px;
    li{
        width: 100%;
        float: left;
        padding-top: 10px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        .flag {
            position: absolute;    /*绝对定位*/
            height: 25px;
            line-height: 25px;
            text-align: center;
            width: 120px;
            background-color: #D0D6DA;
            color: #85939E;
            font-size:12px;
            transform: rotate(-45deg);
            right: -65px;
            bottom: 8px;
        }
        &.ismatch{
            background: #F8F8F8;
        }
        &:hover{
            background: #EFF6FF;
        }
        &.match{
            background: #FFE8E8;
        }
        
        p{
            margin: 0px;
            padding: 0px;
        }
        .title-l{
            width: 70px;
            float: left;
            font-size: 12px;
            .date{
                text-align: right;
                color: #4C545E;
                width: 100%;
                margin-top: -6px;
            }
            .minu{
                width: 100%;
                text-align: right;
                color: #85939E;
            }
        }
        .title-r{
            width: 190px;
            float: left;
            text-align: left;
            font-size: 12px;
            position: relative;
            padding-left: 15px;
            margin-left: 25px;
            padding-bottom: 10px;
            padding-top: 10px;
            color: #222222;
            .dianbox{
                width: 9px;
                line-height: 9px;
                width: 9px;
                text-align: center;
                background: #ffffff;
                position: absolute;
                top: 7px;
                left: -4px;
                cursor: pointer;
            }
            .ydian{
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: #C4C4C4;
                display: inline-block;
            }
            .lines{
                position: absolute;
                width: 1px;
                background: #D0D6DA;
                height: 100%;
                left: 0px;
                top: 9px;
            }
            .name-t{
                width: 100%;
                color: #222222;
                float: left;
                margin-top: -6px;
                font-weight: bold;
                .weight{
                    height: 16px;
                    line-height: 15px;
                    padding: 0px 5px;
                    border: 1px solid #109CF1;
                    color: #109CF1;
                    text-align: center;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    float: right;
                }
            }
            .content-t{
                margin-top: 5px;
                width: 100%;
                color: #222222;
                float: left;
                line-height: 18px;
                font-size: 12px;

            }
            .defpoint{
                width: 23px;
                height: 23px;
                border-radius: 50%;
                line-height: 18px;
                text-align: center;
                color: #ffffff;
                position: absolute;
                z-index: 2;
                font-weight: bold;
                left: -8px;
                top: -3px;
                img{
                    position: absolute;
                    z-index: 3;
                    font-weight: bold;
                    left: 0px;
                    top: -3px;
                }
                font{
                    z-index: 4;
                    color: #ffffff;
                    position: relative;
                    width: 20px;
                    float: left;
                }
            }
        }
    }
}
.matchbox{
    position: absolute;
    padding: 7px 10px;
    overflow: hidden;
    top: 10px;
    right: 10px;
    box-sizing:border-box;
    z-index: 99;
    background: #ffffff;
    border-radius: 4px;
}
.actionbtn{
    color: #ffffff;
    border: none;
    margin-left: 0px;
}
div{
    box-sizing:border-box;
}
.detailbox{
    position: absolute;
    width: 260px;
    overflow: hidden;
    top: 10px;
    left: 10px;
    box-sizing:border-box;
    z-index: 99;
    box-shadow: 0px 0px 6px 3px rgba(0,0,0,0.3);
    .back{
        width: 100%;
        padding: 10px;
        color: #109CF1;
        margin-bottom: 10px;
        border-radius: 4px;
        overflow: hidden;
        background: #ffffff;
        cursor: pointer;
        i{
            font-weight: bold;
        }
    }
    .conbox{
        width: 100%;
        overflow: hidden;
        border-radius: 4px;
        .headblue{
            background: #109CF1;
            padding: 15px;
            p{
                padding: 0;
                margin: 0;
            }
            .title{
                color: #ffffff;
                font-size: 14px;
                font-weight: bold;
                line-height: 18px;
                .weight{
                    height: 16px;
                    line-height: 15px;
                    padding: 0px 5px;
                    border: 1px solid #ffffff;
                    color: #ffffff;
                    text-align: center;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    float: right;
                }
            }
            .content-t{
                color: #ffffff;
                margin-top: 5px;
                width: 100%;
                line-height: 18px;
                font-size: 12px;
            }
        }
        .botwhite{
            background: #ffffff;
            padding: 15px;
        }
        .bottombtn{
           background: #ffffff;
           text-align: right;
           padding: 10px; 
           border-top:1px solid #D0D6DA;
        }
    }
}
p{
    padding: 0px;
    margin: 0px;
}
</style>
<style>
.mapcard .el-card__body{
    padding: 0px;
}
.botwhite .el-form-item--mini.el-form-item{
    margin-bottom: 0px;
}
.mapcardcur .el-form-item--mini.el-form-item{
    margin-bottom: 0px;
}
.mapdialogmatch .el-dialog__body{
    padding: 20px 10px 10px 10px;
}
</style>