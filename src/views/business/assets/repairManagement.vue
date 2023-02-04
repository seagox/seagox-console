<template>
    <div class="container">
        <div class="searchView">
            <el-form :model="searchForm" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="报修状态">
                            <el-select v-model="searchForm.status" clearable>
                                <el-option
                                    v-for="item in statuses"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="资产名称">
                            <el-input v-model="searchForm.keyWord" clearable placeholder="请输入关键字"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        @click.native="handleSearch"
                        style="margin-left: 15px">
                        查询
                    </el-button>
                </el-row>
            </el-form>
        </div>
        <div class="table">
            <!--列表-->
            <el-table :data="tableData" border highlight-current-row stripe>
                <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                <el-table-column prop="createTime" label="报修时间" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="assetsName" label="资产名称" align="center"></el-table-column>
                <el-table-column prop="address" label="报修地点" align="center"></el-table-column>
                <el-table-column prop="reportPerson" label="报修人" align="center"></el-table-column>
                <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" :formatter="statusFormatter"></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showDialog(scope.row.id)">详情</el-button>
                        <el-button type="text" size="small" @click="confirmSubmit(scope.row.id)" v-if="scope.row.status === 1">确认</el-button>
                        <el-button type="text" size="small" @click="showPDDialog(scope.row.id)" v-if="scope.row.status === 2">派单</el-button>
                        <el-button type="text" size="small" @click="showWCDialog(scope.row.id)" v-if="scope.row.status === 3">完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :current-page.sync="pageNo"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="详情" width="750px" :visible.sync="showVisible" :close-on-click-modal="false">
            <el-form :model="formData"  label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="报修时间">
                            <el-input v-model="formData.createTime" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-input v-model="formData.status" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="资产名称">
                            <el-input v-model="formData.assetsName" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报修地点">
                            <el-input v-model="formData.address" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报修人">
                            <el-input v-model="formData.reportPerson" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话">
                            <el-input v-model="formData.phone" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="报修详情">
                            <el-input type="textarea" :rows="2" v-model="formData.detail" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="拍照">
                            <el-image
                                style="width: 100px; height: 100px"
                                v-for="(item, index) of formData.images"
                                :key="index"
                                :src="item.url"
                                :preview-src-list="getPreviewImgList(index, 1)">
                            </el-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="formData.status === '派单' || formData.status === '已完成'">
                    <el-col :span="12">
                        <el-form-item label="派工时间">
                            <el-input v-model="formData.pdTime" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="formData.status === '派单' || formData.status === '已完成'">
                    <el-col :span="12">
                        <el-form-item label="维修人">
                            <el-input v-model="formData.repairer" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="完成时限">
                            <el-input v-model="formData.completionDeadline" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="派工类型">
                            <el-input v-model="formData.pdType" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="金额">
                            <el-input v-model="formData.amount" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="formData.status === '已完成'">
                    <el-col :span="12">
                        <el-form-item label="完工时间">
                            <el-input v-model="formData.completionTime" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="完成拍照">
                            <el-image
                                style="width: 100px; height: 100px"
                                v-for="(item, index) of formData.completionImages"
                                :key="index"
                                :src="item.url"
                                :preview-src-list="getPreviewImgList(index, 2)">
                            </el-image>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible">
            <img :src="dialogImageUrl" alt="" width="100%"/>
        </el-dialog>
        <el-dialog title="派单" width="750px" :visible.sync="showPDVisible" :close-on-click-modal="false">
            <el-form  ref="pDFormData" :model="pDFormData" :rules="pdRules"  label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="派工时间" prop="pdTime">
                            <el-date-picker
                                v-model="pDFormData.pdTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择派工时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="维修人" prop="repairer">
                            <el-input v-model="pDFormData.repairer" placeholder="请输入维修人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="完成时限" prop="completionDeadline">
                            <el-date-picker
                                v-model="pDFormData.completionDeadline"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择完成时限">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="派工类型" prop="pdType">
                            <el-select v-model="pDFormData.pdType" @change="selectPDTypeChange">
                                <el-option
                                    v-for="item in pdtypes"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="金额">
                            <el-input type="number" v-model="pDFormData.amount" :disabled="pDFormData.pdType !== 1"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="form-footer">
                <el-button type="primary" @click="pdSubmit(pDFormData.id)">派单</el-button>
            </div>
        </el-dialog>
        <el-dialog title="完成" width="750px" :visible.sync="showWCVisible" :close-on-click-modal="false">
            <el-form  ref="wCFormData" :model="wCFormData" :rules="wcRules"  label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="完工时间" prop="completionTime">
                            <el-date-picker
                                v-model="wCFormData.completionTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择完工时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="拍照" prop="completionImages">
                            <el-upload
                                :action="action"
                                :file-list="wCFormData.completionImages"
                                :headers="headers"
                                :before-upload="beforeUpload"
                                :on-success="handleUploadSuccess"
                                list-type="picture-card">
                                <i slot="default" class="el-icon-plus"></i>
                                <div slot="file" slot-scope="{file}">
                                    <img
                                        :src="file.url"
                                        alt="" class="el-upload-list__item-thumbnail"
                                    >
                                    <span class="el-upload-list__item-actions">
                                        <span
                                            class="el-upload-list__item-preview"
                                            @click="handlePictureCardPreview(file)"
                                        >
                                            <i class="el-icon-zoom-in"></i>
                                        </span>
                                        <span
                                            class="el-upload-list__item-delete"
                                            @click="handleRemove(file)"
                                        >
                                        <i class="el-icon-delete"></i>
                                        </span>
                                    </span>
                                </div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="form-footer">
                <el-button type="primary" @click="wcSubmit(wCFormData.id)">完成</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            _databaseId: null,
            pageNo: 1,
            total: 0,
            tableData: [],
            searchForm: {
                status: null,
                keyWord: null,
            },
            statuses: [
                {key: 1, value: "报修中"},
                {key: 2, value: "确认"},
                {key: 3, value: "派单"},
                {key: 4, value: "已完成"}
            ],
            pdtypes: [
                {key: 1, value: "有偿"},
                {key: 2, value: "无偿"}
            ],
            showVisible: false,
            showPDVisible: false,
            showWCVisible: false,
            formData: {},
            pDFormData: {},
            wCFormData: {},
            dialogImageUrl: '',
            dialogVisible: false,
            pdRules: {
                pdTime: [{required: true, message: '请选择派工时间', trigger: 'change'}],
                repairer: [{required: true, message: '请数据维修人', trigger: 'blur'}],
                completionDeadline: [{required: true, message: '请选择完成期限', trigger: 'change'}],
                pdType: [{required: true, message: '请选择判断类型', trigger: 'change'}]
            },
            wcRules: {
                completionTime: [{required: true, message: '请选择完工时间', trigger: 'change'}]
            },
            imagesShowList: [],
            completionImagesShowList: []
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.queryByPage()
    },
    methods: {
        queryByPage() {
            let that = this
            let params = {
                status: this.searchForm.status,
                name: this.searchForm.keyWord,
                _databaseId: this._databaseId
            }
            that.$axios.post('cloud/authority/queryRepairList', params).then(res => {
                if (res.data.code == 200) {
                    that.tableData = res.data.data
                } else {
                    that.$message.error('查询失败！')
                }
            })
        },
        handleCurrentChange() {
            this.queryByPage()
        },
        //查询按钮
        handleSearch() {
            this.pageNo = 1
            this.queryByPage()
        },
        showDialog(id) {
            this.formData = {}
            let that = this
            let params = {
                id: id,
                _databaseId: this._databaseId
            }
            that.$axios.post('cloud/authority/getRepairById', params).then(res => {
                if (res.data.code == 200) {
                    this.formData = res.data.data
                    if (this.formData.images){
                        this.formData.images = JSON.parse(this.formData.images)
                        for (let i = 0; i < this.formData.images.length; i++) {
                            this.imagesShowList.push(this.formData.images[i].url)
                        }
                    }else {
                        this.formData.images = []
                    }
                    if (this.formData.completionImages){
                        this.formData.completionImages = JSON.parse(this.formData.completionImages)
                        for (let i = 0; i < this.formData.completionImages.length; i++) {
                            this.completionImagesShowList.push(this.formData.completionImages[i].url)
                        }
                    }else {
                        this.formData.completionImages = []
                    }
                    if (this.formData.status === 1) {
                        this.formData.status = '报修中'
                    } else if (this.formData.status === 2) {
                        this.formData.status = '确认'
                    } else if (this.formData.status === 3) {
                        this.formData.status = '派单'
                    } else {
                        this.formData.status = '已完成'
                    }
                    if (this.formData.pdType === 1) {
                        this.formData.pdType = '有偿'
                    } else {
                        this.formData.pdType = '无偿'
                    }
                    this.showVisible = true
                } else {
                    that.$message.error('查询失败！')
                }
            })
        },
        confirmSubmit(id){
            let that = this
            this.$confirm('是否确认报修？', '提示', {type: 'warning'}).then(() => {
                let params = {
                    id: id,
                    _databaseId: this._databaseId,
                    flag: 'confirm'
                }
                that.$axios.post('cloud/authority/updateRepairById', params).then(res => {
                    if (res.data.code == 200) {
                        that.$message.success('确认成功')
                        this.queryByPage()
                    } else {
                        that.$message.error('操作失败！')
                    }
                })
            })
        },
        pdSubmit(id){
            let that = this
            let params = {
                id: id,
                _databaseId: this._databaseId,
                flag: 'pd',
                pdTime: this.pDFormData.pdTime,
                repairer: this.pDFormData.repairer,
                completionDeadline: this.pDFormData.completionDeadline,
                pdType: this.pDFormData.pdType,
                amount: this.pDFormData.amount
            }
            this.$refs.pDFormData.validate((valid) => {
                if (valid) {
                    that.$axios.post('cloud/authority/updateRepairById', params).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('派单成功')
                            this.queryByPage()
                            this.showPDVisible = false
                        } else {
                            that.$message.error('操作失败！')
                        }
                    })
                }
            })
        },
        wcSubmit(id){
            let that = this
            let params = {
                id: id,
                _databaseId: this._databaseId,
                flag: 'wc',
                completionTime: this.wCFormData.completionTime,
                completionImages: JSON.stringify(this.wCFormData.completionImages)
            }
            this.$refs.wCFormData.validate((valid) => {
                if (valid) {
                    that.$axios.post('cloud/authority/updateRepairById', params).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('操作成功')
                            this.queryByPage()
                            this.showWCVisible = false
                        } else {
                            that.$message.error('操作失败！')
                        }
                    })
                }
            })
        },
        showPDDialog(id){
            this.pDFormData = {
                id : id,
                pdType: 1
            }
            this.showPDVisible = true
        },
        showWCDialog(id){
            this.wCFormData = {
                id : id,
                completionImages: []
            }
            this.showWCVisible = true
        },
        selectPDTypeChange(){
            if (this.pDFormData.pdType === 2){
                this.pDFormData.amount = null
            }
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 文件上传成功
        handleUploadSuccess(res, file) {
            if (res.code === 200) {
                this.wCFormData.completionImages.push({
                    name: file.name,
                    url: res.data
                })
            }
        },
        //移除
        handleRemove(file) {
            this.wCFormData.completionImages.forEach((item, i) => {
                if (item.url === file.url) {
                    this.wCFormData.completionImages.splice(i, 1)
                    return true
                }
            })
        },
        beforeUpload(file){
            let fileName = file.name
            let pos = fileName.lastIndexOf('.')
            let lastName = fileName.substring(pos, fileName.length)
            let suffix = lastName.toLowerCase()
            // JPG、JPEG、PNG
            if (!(suffix === '.jpg' || suffix === '.jpeg' || suffix === '.png')){
                this.$message.warning('请上传后缀为 .jpg/.jpeg/.png 格式的文件')
                return false;
            }
            return true;
        },
        statusFormatter(row){
            if (row.status === 1) {
                return '报修中'
            } else if (row.status === 2) {
                return '确认'
            } else if (row.status === 3) {
                return '派单'
            } else {
                return '已完成'
            }
        },
        getPreviewImgList(index, flag) {
            let arr = []
            let i = 0;
            if (flag === 1){
                for(i;i < this.imagesShowList.length;i++){
                    arr.push(this.imagesShowList[i+index])
                    if(i+index >= this.imagesShowList.length-1){
                        index = 0-(i+1);
                    }
                }
            }else {
                for(i;i < this.completionImagesShowList.length;i++){
                    arr.push(this.completionImagesShowList[i+index])
                    if(i+index >= this.completionImagesShowList.length-1){
                        index = 0-(i+1);
                    }
                }
            }
            return arr;
        },
    }
}
</script>
<style scoped>
.contract-class {
    color: #009aff;
}
</style>