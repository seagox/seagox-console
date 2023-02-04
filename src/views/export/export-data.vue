<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-plus" @click="handleImportExcel" size="small">excel导入</el-button>
        </div>
        <div class="table">
            <el-table :data="tableData" border highlight-current-row stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="name" label="文件名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="导入时间" width="200" align="center"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :current-page.sync="pageNo"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
        <el-dialog title="请选择excel导入" width="800px" :visible.sync="importExcelVisible" v-if="importExcelVisible" :close-on-click-modal="false">
            <el-form
                ref="form"
                :model="batchForm"
                :rules="batchFormRules"
                label-width="120px">
                <el-form-item>
                    <el-button type="text" icon="el-icon-info" @click="explanationVisible=true" size="small" style="float: right">excel导入规则说明</el-button>
                </el-form-item>
                <el-form-item label="名称读取规则" prop="readRule">
                    <el-select v-model="batchForm.readRule" placeholder="名称读取规则">
                        <el-option
                            v-for="item in readRules"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年份" v-if="batchForm.readRule != '3'">
                    <el-date-picker
                        v-model="batchForm.chooseYear"
                        type="year"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="请选择年份">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="年份对应字段" prop="yearField">
                    <el-input v-model.trim="batchForm.yearField"></el-input>
                </el-form-item>
                <div v-if="batchForm.readRule == '2'">
                    <el-form-item prop="deptSource" label="单位来源表">
                        <el-input v-model.trim="batchForm.deptSource"></el-input>
                    </el-form-item>
                    <el-form-item prop="deptNameField" label="单位名称字段">
                        <el-input v-model.trim="batchForm.deptNameField"></el-input>
                    </el-form-item>
                    <el-form-item prop="deptCodeField" label="单位编码字段">
                        <el-input v-model.trim="batchForm.deptCodeField"></el-input>
                    </el-form-item>
                </div>
                <div v-if="batchForm.readRule == '3'">
                    <el-form-item label="月份对应字段" prop="monthField">
                        <el-input v-model.trim="batchForm.monthField"></el-input>
                    </el-form-item>
                    <el-form-item label="区划来源表" prop="rgSource">
                        <el-input v-model.trim="batchForm.rgSource"></el-input>
                    </el-form-item>
                    <el-form-item label="区划名称字段" prop="rgNameField">
                        <el-input v-model.trim="batchForm.rgNameField"></el-input>
                    </el-form-item>
                    <el-form-item label="区划编码字段" prop="rgCodeField">
                        <el-input v-model.trim="batchForm.rgCodeField"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="配置规则" prop="unified">
                    <el-radio v-model="batchForm.unified" label="1">单一处理</el-radio>
                    <el-radio v-model="batchForm.unified" label="2">统一处理</el-radio>
                </el-form-item>
                <el-form-item v-if="batchForm.unified == '2'">
                    只需配置第一个文件
                </el-form-item>
                <el-form-item>
                    <el-upload
                        multiple
                        :action="action"
                        :headers="headers"
                        accept=".xls, .xlsx"
                        list-type="picture-card"
                        :before-upload="beforeUpload"
                        :on-success="
                        (res, file, allFileList) => {
                            return handleFileSuccess(res, file, allFileList)
                        }"
                    >
                        <i class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{ file }">
                            <img class="el-upload-list__item-thumbnail" src="@/assets/fileType/excel.svg"/>
                            <div>
                                <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-delete" @click="handleConfigure(file)" style="margin-top: 10px" v-if="batchForm.unified == '1' ||  file.index == 0">
                                        <i class="el-icon-setting"></i>
                                    </span>
                                    <span class="el-upload-list__item-delete" @click="handleRemove(file, allFileList)">
                                        <i class="el-icon-delete"></i>
                                    </span>
                                    <span>
                                        <i style="font-size: small">{{file.name}}</i>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="exportSubmit">开始导入数据</el-button>
            </div>
        </el-dialog>
        <el-dialog title="数据导入模板配置" width="1000px" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane
                    v-for="(item, index) in sheetList"
                    :key="index"
                    :label="item.sheetName"
                    :name="String(item.index)">
                    <el-form :model="item" label-width="120px" :rules="formRule" ref="ruleForm" style="width: 70%; margin-top: 20px">
                        <el-form-item label="是否读取数据">
                            <el-radio v-model="item.bRead" label="1">是</el-radio>
                            <el-radio v-model="item.bRead" label="2">否</el-radio>
                        </el-form-item>
                        <div v-if="item.bRead == '1'">
                            <el-form-item label="数据导入规则" prop="ruleId">
                                <el-select v-model="item.ruleId" filterable placeholder="请选择数据导入规则">
                                    <el-option
                                        v-for="item in rules"
                                        :key="item.id"
                                        :label="item.code + ' - ' +item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="数据起始行" prop="startLine">
                                <el-input-number
                                    v-model="item.startLine"
                                    :controls="false"
                                    :precision="0"
                                    :min="1"
                                    :max="999999">
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="设置结束行">
                                <el-switch
                                    v-model="item.endSwitch"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="数据结束行" prop="endLine" v-if="item.endSwitch">
                                <el-input-number
                                    v-model="item.endLine"
                                    :controls="false"
                                    :precision="0"
                                    :min="1"
                                    :max="999999">
                                </el-input-number>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="singleSubmit">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="excel名称格式说明" width="800px" :visible.sync="explanationVisible" :close-on-click-modal="false">
            <el-card>
                <div>
                    规则1：无
                    <div>年份或者年份对应字段未填，不删除数据，反之，根据字段填写数据，并且根据年份删除旧数据</div>
                </div>
                <div style="margin-top: 10px">
                    规则2：预算单位
                    <div>根据文件名称读取单位来源表，获取对应编码，存入数据库</div>
                    <div>会根据文件名称编码删除旧数据，年份及年份对应字段填写后，删除数据条件就会加上年份</div>
                </div>
                <div style="margin-top: 10px">
                    规则3：XXXX年XX月_区划编码_名称
                    <div>根军文件名称获取年份、月份、区划编码，存入数据库，并根据这些数据删除旧数据</div>
                    <div>文件名也可以省略月份，XXXX年_区划编码_名称.xls</div>
                </div>
                <div style="margin-top: 20px">
                    统一处理：
                    <div>只需要配置第一个文件，则所有文件都根据第一个文件配置来读取</div>
                </div>
                <div style="margin-top: 20px">
                    注意：
                    <div>excel对应列要是设置成数据，则不能有字符串存在</div>
                    <div>合并列的时候，有可能会存入重复内容，是以为合并列拆开每个列都有内容，把多余的删了再重新合并即可</div>
                </div>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="explanationVisible=false">关闭</el-button>
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
                tableData: [],
                pageNo: 1,
                total: 0,
                rules: [],
                allFileList: [],
                currentFile: {},
                fileList: [],
                departmentOptions: [],
                currentUrl: '',
                addFormVisible: false,
                importExcelVisible: false,
                explanationVisible: false,
                formRule: {
                    ruleId: [{required: true, message: '请选择数据导入规则', trigger: 'change'}],
                    startLine: [{required: true, message: '请输入数据起始行', trigger: 'blur'}],
                },
                sheetList: [],
                activeName: '0',
                batchForm: {
                    unified: "1",
                    chooseYear: new Date(),
                    year: null,
                    yearField: 'date_year',
                    monthField: 'month',
                    readRule: "1",
                    deptSource: "rd_dim_ysdw_type",
                    deptNameField: "dept_name",
                    deptCodeField: "dept_code",
                    rgSource: "rd_dim_admdiv",
                    rgNameField: "rg_name",
                    rgCodeField: "rg_code",
                },
                batchFormRules: {
                    unified: [{required: true, message: '请选择配置规则', trigger: 'change'}],
                    readRule: [{required: true, message: '请选择名称读取规则', trigger: 'change'}],
                    monthField: [{required: true, message: '请输入月份字段', trigger: 'blur'}],
                    rgSource: [{required: true, message: '请输入区划来源表', trigger: 'blur'}],
                    rgNameField: [{required: true, message: '请输入区划名称字段', trigger: 'blur'}],
                    rgCodeField: [{required: true, message: '请输入区划编码字段', trigger: 'blur'}],
                    deptSource: [{required: true, message: '请输入单位来源表', trigger: 'blur'}],
                    deptNameField: [{required: true, message: '请输入单位名称字段', trigger: 'blur'}],
                    deptCodeField: [{required: true, message: '请输入单位编码字段', trigger: 'blur'}],
                },
                readRules: [
                    {value: "1", label: "无"},
                    {value: "2", label: "预算单位"},
                    {value: "3", label: "XXXX年XX月_区划编码_名称"}
                ]
            }
        },
        created() {
            this.queryByPage()
            this.queryRules()
            this.queryDepartmentByCompanyId()
        },
        methods: {
            queryByPage() {
                let that = this
                const params = {
                    pageNo: this.pageNo
                }
                that.$axios.get('exportData/queryByPage', {params}).then(res => {
                    if (res.data.code === 200) {
                        that.tableData = res.data.data.list
                        that.total = res.data.data.total
                    }
                })
            },
            handleCurrentChange() {
                this.queryByPage()
            },
            async queryDepartmentByCompanyId() {
                let res = await this.$axios.get('department/queryByCompanyId?searchCompanyId=' + localStorage.getItem("companyId"))
                if (res.data.code === 200) {
                    this.departmentOptions = res.data.data
                }
            },
            handleImportExcel() {
                this.importExcelVisible = true
            },
            queryRules() {
                let that = this
                that.$axios.get('exportRule/queryAll').then(res => {
                    if (res.data.code === 200) {
                        that.rules = res.data.data
                    }
                })
            },
            beforeUpload(file) {
                let pattern = /.(xls|xlsx)$/g
                if (!pattern.test(file.name)) {
                    this.$message.error('只能上传xls/xlsx文件')
                    return false
                }
                const fileSize = file.size / 1024 / 1024 < 30
                if (!fileSize) {
                    this.$message.error('上传文件大小不能超过 30MB')
                    return false
                }
                return true
            },
            // 文件删除
            handleRemove(file, fileList) {
                this.$confirm('确定要移除该文件？', '提示', {type: 'warning'}).then(() => {
                    let index = fileList.findIndex(fileItem => {
                        return fileItem.url === file.url
                    })
                    this.allFileList.splice(index, 1)
                })
            },
            handleFileSuccess(res, file, fileList) {
                this.allFileList = fileList
                if (res.code === 200) {
                    let fileArray = []
                    fileList.map((f, index) => {
                        fileArray.push({
                            name: f.name,
                            size: f.size,
                            url: res.data
                        })
                        if (f.uid == file.uid) {
                            file.index = index
                        }
                    })
                    this.fileList = fileArray
                } else {
                    this.$message.error(res.message)
                }
            },
            handleConfigure(file) {
                this.currentFile = file
                this.currentUrl = file.response.data
                if (file.edit) {
                    this.sheetList = file.sheetList
                } else {
                    this.readExcelSheets(file, file.response.data, file.name)
                }
                this.activeName = '0'
                this.addFormVisible = true
            },
            readExcelSheets(file, url, fileName) {
                let that = this
                let params = {
                    filePath: url,
                    fileName: fileName
                }
                that.$axios.get('exportData/readExcelSheets', {params}).then(res => {
                    if (res.data.code === 200) {
                        that.sheetList = res.data.data
                        // 标识为已获取数据
                        file.edit = true
                        file.sheetList = res.data.data
                    }
                })
            },
            singleSubmit() {
                // 循环校验
                let that = this
                let pass = true
                for (let i = 0; i < that.sheetList.length; i++) {
                    if (that.sheetList[i].bRead == '2') {
                        // 不读取跳过
                        continue
                    }
                    that.$refs.ruleForm[i].validate(valid => {
                        if (!valid) {
                            that.$message.warning('请正确配置：' + that.sheetList[i].sheetName + '！')
                            pass = false
                        }
                    })
                    if (!pass) {
                        break
                    }
                }
                if (pass) {
                    this.currentFile.pass = true
                    that.addFormVisible = false
                }
            },
            exportSubmit() {
                let that = this
                if (that.allFileList.length === 0) {
                    that.$message.warning('暂无数据可导入！')
                    return
                }
                let passList = []
                let pass = true
                // 校验文件是否全部配置完毕
                if (that.batchForm.unified == '1') {
                    // 单一处理
                    try {
                        that.allFileList.forEach(file => {
                            if (!file.pass) {
                                that.$message.warning('【' + file.name + '】未完整配置！')
                                pass = false
                                throw new Error('break');
                            }
                            let config = {
                                url: file.response.data,
                                fileName: file.name,
                                configList: file.sheetList
                            }
                            passList.push(config)
                        })
                    } catch (e) {
                    }
                    if (!pass) {
                        return
                    }

                } else {
                    // 统一处理(只校验第一个配置)
                    if (!that.allFileList[0].pass) {
                        that.$message.warning('请完成第一个文件【' + that.allFileList[0].name + '】的配置！')
                        return
                    }
                    that.allFileList.forEach(file => {
                        let config = {
                            url: file.response.data,
                            fileName: file.name,
                            configList: file.sheetList
                        }
                        passList.push(config)
                    })
                }
                if (this.batchForm.chooseYear) {
                    if (typeof this.batchForm.chooseYear == 'string') {
                        this.batchForm.year = this.batchForm.chooseYear.substring(0, 4)
                    } else {
                        this.batchForm.year = this.batchForm.chooseYear.getFullYear()
                    }
                }
                let params = {
                    exportNameAnalysis: JSON.stringify(this.batchForm),
                    configList: JSON.stringify(passList)
                }
                that.$axios.post('exportData/readExcelData', params).then(res => {
                    if (res.data.code === 200) {
                        that.queryByPage()
                        that.$message.success('导入成功！')
                        that.importExcelVisible = false
                        that.allFileList = []
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
        }
    }
</script>
<style scoped>
:deep(.el-input-number .el-input__inner) {
    text-align: left;
}
</style>
