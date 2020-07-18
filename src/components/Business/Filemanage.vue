<template>
    <div>
        <el-dialog
            title="文件管理"
            :visible.sync="dialogfile"
            width="785px"
            :append-to-body='true'
            class="filemange"
            @close='closeDialog'
            style="padding-bottom: 50px;">
            <div style="width: 100%;float: right;padding-bottom: 10px;">
                <el-button  @click="Deletefile()" style="float:right;margin-left: 5px;height: 22px;line-height:22px;padding: 0px 12px;" size="mini">删除</el-button>
                <el-button type="primary" class="cgreen" @click="Openupload()" style="float:right;margin-left: 5px;height: 22px;line-height:22px;padding: 0px 12px;" size="mini">上传文件</el-button>
            </div>
            <el-table
                    border
                    :data="tabledata"
                    style="width: 100%"
                    ref="multipleTable"
                    tooltip-effect="dark"
                    class="Minitabletd"
                    @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="35">
                </el-table-column>
                <el-table-column label="上传时间" width="100">
                    <template slot-scope="scope">
                        <span class="displayBlock">{{scope.row.create_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="上传人">
                    <template slot-scope="scope">
                        <span class="displayBlock">{{scope.row.create_user_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="业务类型">
                    <template slot-scope="scope">
                        <span class="displayBlock">
                            {{scope.row.order_type_enum}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="文件名">
                    <template slot-scope="scope">
                        <span class="displayBlock" style="color: #109CF1;cursor:pointer" @click="Detail(scope.row)">查看</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <span class="displayBlock">{{scope.row.remark || '无'}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="上传文件" :visible.sync="dialoglog" :close-on-click-modal="false" width="480px">
            <el-form  size="mini"  label-width="120px">
                <el-form-item label="业务类型" required>
                    <el-radio-group v-model="typevalue.order_type">
                        <el-radio :label="1">海运</el-radio>
                        <el-radio :label="2" style="margin-left: 10px;">陆运</el-radio>
                        <el-radio :label="3" style="margin-left: 10px;">报关</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文件名" required style="margin-bottom:10px;">
                    <p v-if="typevalue.file_url" style="padding: 0px;margin: 0px;">{{typevalue.file_url}}</p>
                    <el-upload
                        class="avatar-uploader"
                        :action="$getApi('Commonupload')"
                        :show-file-list="false"
                        :on-success="(item) => handleAvatarSuccess(item, typevalue.file_url)">
                        <el-button size="mini" type="primary" icon="el-icon-upload" style="padding: 5px 7px;">{{typevalue.file_url ? '重新上传' : '上传文件'}}</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        placeholder="备注"
                        style="width:215px"
                        v-model="typevalue.remark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer diagsavebtn">
                <el-button type="primary" @click="Fileadd()">确 定</el-button>
                <el-button @click="Closecreattype()">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    export default {
        name:'Filemanage',
        data(){
            return {
                dialogfile: false,
                dialoglog: false,
                ywlist: [
                    {name: '海运', id: 1},
                    {name: '陆运', id: 2},
                    {name: '报关', id: 3}
                ],
                inputwidth: 'width: 135px;margin-right: 5px',
                tabledata: [],
                formitemStyle:'20px',
                currow: {},
                typevalue: {
                    order_id: '',
                    order_type: 1,
                    file_url: '',
                    remark: ''
                },
                checktable: []
            }
        },
        props:{
            obj: Object
        },
        created(){
        },
        mounted(){
            this.dialogfile = true
            this.LogList({})
        },
        methods:{
            // 文件列表
            LogList(params){
                let self = this
                this.$fetch(this.$getApi('ErpOrderfile')+'/'+this.obj.order_id).then((res) => {
                    if(res.error_code == 0) {
                        self.tabledata = res.data
                    }
                })
            },
            closeDialog() {
                this.dialoglogall = false
                this.$emit('action',this.dialogfile)
            },
            Detail(val){
                location.href = val.file_url
            },
            Openupload(val){
                this.dialoglog = true
            },
            handleAvatarSuccess(item, index) {
                let self = this
                if (item.error_code === 0) {
                    self.typevalue.file_url = item.data[0]
                    this.$message({
                        message: '上传成功！',
                        type: 'success'
                    });
                } else {
                    self.$message({
                        type: 'error',
                        message: '上传失败!'
                    });
                }
            },
            Closecreattype(){
                this.dialoglog = false
            },
            Fileadd(){
                let self = this
                let params = this.typevalue
                params.order_id = this.obj.order_id
                if(!this.typevalue.file_url){
                    self.$message({
                        type: 'error',
                        message: '请上传文件!'
                    });
                    return
                }
                this.$post(this.$getApi('ErpOrderfileAdd'),params).then((res) => {
                    if(res.error_code == 0) {
                        self.$message({
                            type: 'success',
                            message: '提交成功!'
                        });
                        self.dialoglog = false
                        self.LogList()
                    }
                })
            },
            handleSelectionChange(val) {
                this.checktable = val;
            },
            Deletefile(){
                let self = this
                let params = {
                    file_id: []
                }
                if(this.checktable.length<1){
                    self.$message({
                        type: 'error',
                        message: '请至少选中一项!'
                    });
                    return
                } else {
                    this.checktable.forEach((val) => {
                        params.file_id.push(val.id)
                    });
                }
                this.$post(this.$getApi('ErpOrderfileBatch'),params).then((res) => {
                    if(res.error_code == 0) {
                        self.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        self.LogList()
                    }
                })
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
}
.cgreen{
    background: #2ED47A;
    border: none;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 178px;
    text-align: center;
}
</style>
<style>
.filemange .el-dialog__body{
    padding: 15px;
    padding-bottom: 50px;
}
</style>