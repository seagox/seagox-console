<template>
    <div class="container">
        <el-container :style="'height:' + (clientHeight - 125) + 'px'">
            <el-aside width="300px">
                <div class="add-dept">
                    <el-form label-width="80px">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="选择业务: ">
                                    <el-select v-model="businessConfigId" @change="businessConfigChange">
                                        <el-option
                                            v-for="item in businessConfigs"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <el-scrollbar
                    :native="false"
                    wrapStyle=""
                    wrapClass=""
                    viewClass=""
                    viewStyle=""
                    :noresize="false"
                    tag="section"
                    style="height: calc(100vh - 300px)"
                >
                    <div :style="treeHeight + 'height: calc(100% - 50px)'">
                        <el-tree
                            class="filter-tree"
                            node-key="id"
                            :data="mainTreeData"
                            :props="defaultProps"
                            default-expand-all
                            :expand-on-click-node="false"
                            :default-expanded-keys="[pid]"
                            ref="mainTree"
                            @node-click="getTreeNodeData"
                            @mouseenter="mouseenter(data)"
                            @mouseleave="mouseleave(data)"
                            highlight-current
                        >
                            <span
                                class="custom-tree-node"
                                slot-scope="{ node, data }"
                                style="width: 100%"
                                @mouseenter="mouseenter(data)"
                                @mouseleave="mouseleave(data)"
                            >
                                <span>{{ node.label }}</span>
                                <el-link
                                    v-show="data.show"
                                    size="mini"
                                    style="margin-left: 5px"
                                    type="primary"
                                    icon="el-icon-plus"
                                    @click="() => addDialogShow(node, data, 0)"
                                ></el-link>
                                <el-link
                                    v-show="data.show"
                                    size="mini"
                                    style="margin-left: 5px"
                                    type="primary"
                                    icon="el-icon-edit"
                                    @click="() => addDialogShow(node, data, 1)"
                                ></el-link>
                                <el-link
                                    v-show="data.show"
                                    size="mini"
                                    style="margin-left: 5px"
                                    type="primary"
                                    icon="el-icon-delete"
                                    @click="remove(node, data)"
                                ></el-link>
                            </span>
                        </el-tree>
                    </div>
                </el-scrollbar>
            </el-aside>
            <el-main>
                <div class="searchView">
                    <el-form label-width="80px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="年度">
                                    <el-date-picker
                                        v-model="year"
                                        type="year"
                                        value-format="yyyy"
                                        placeholder="请选择年度"
                                        align="center"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-button
                                    type="primary"
                                    icon="el-icon-search"
                                    @click.native="handleSearch"
                                    style="margin-left: 15px"
                                    >查询</el-button
                                >
                            </el-col>
                        </el-row>
                        <div class="toolView" style="margin-top: 0px">
                            <el-button type="text" icon="el-icon-plus" @click="addDoc(0)" size="small">新增</el-button>
                            <el-button type="text" icon="el-icon-edit" @click="addDoc(1)" size="small">修改</el-button>
                            <el-button type="text" icon="el-icon-delete" @click="delDoc" size="small">删除</el-button>
                            <el-button type="text" icon="el-icon-copy-document" @click="batchCopy" size="small"
                                >批量复制</el-button
                            >
                        </div>
                    </el-form>
                </div>
                <div class="table">
                    <!--列表-->
                    <el-table
                        ref="multipleTable"
                        :data="childTableData"
                        max-height="500"
                        border
                        :row-style="isRed"
                        @selection-change="selected"
                        highlight-current-row
                        stripe
                    >
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="name" label="页签名称" align="center"></el-table-column>
                        <el-table-column prop="year" label="年度" align="center"></el-table-column>
                        <el-table-column prop="reportName" label="报表名称" align="center"></el-table-column>
                        <el-table-column prop="gaugeName" label="仪表盘" align="center"></el-table-column>
                        <el-table-column prop="moneyUnitName" label="单位" align="center"></el-table-column>
                        <el-table-column prop="sort" label="排序" align="center"></el-table-column>
                    </el-table>
                    <!--分页-->
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
            </el-main>
        </el-container>
        <!-- 新增/修改目录-->
        <el-dialog :visible.sync="addDialog" width="40%" center>
            <el-form ref="menuform" :model="menuform" label-width="60px" :rules="rules" class="info-show">
                <el-form-item prop="name" label-width="80px" label="目录名称">
                    <el-input v-model="menuform.name" placeholder="请输入目录名称" maxlength="30"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" style="text-align: center">
                <el-button type="primary" size="small" @click="save" v-if="flag == 0">确定</el-button>
                <el-button type="primary" size="small" @click="updateByid" v-if="flag == 1">保存</el-button>
                <el-button size="small" @click="goback(1)">返回</el-button>
            </div>
        </el-dialog>

        <!-- 新增/修改文档信息-->
        <el-dialog
            :visible.sync="addDocDialog"
            center
            title="页签资料"
            :append-to-body="true"
            width="30%"
            :close-on-click-modal="false"
        >
            <el-form :model="scDetailForm" :rules="docRules" ref="scDetailForm" label-width="120px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="页签名称" prop="name">
                            <el-input v-model="scDetailForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="年度" prop="year">
                            <el-date-picker
                                v-model="scDetailForm.year"
                                type="year"
                                value-format="yyyy"
                                placeholder="请选择年度"
                                align="center"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="报表名称" prop="reportId">
                            <el-select v-model="scDetailForm.reportId" filterable>
                                <el-option
                                    v-for="item in reports"
                                    :key="item.id + ''"
                                    :label="item.name"
                                    :value="item.id + ''"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="仪表盘" prop="gaugeId">
                            <el-select v-model="scDetailForm.gaugeId" filterable>
                                <el-option
                                    v-for="item in gauges"
                                    :key="item.id + ''"
                                    :label="item.name"
                                    :value="item.id + ''"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="金额单位" prop="moneyUnit">
                            <el-select v-model="scDetailForm.moneyUnit">
                                <el-option
                                    v-for="item in moneyUnits"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="排序">
                            <el-input v-model="scDetailForm.sort"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="docflag == 0" type="primary" size="small" @click="saveDoc">确 定 </el-button>
                <el-button v-if="docflag == 1" type="primary" size="small" @click="saveUpdDoc">确 定 </el-button>
                <el-button size="small" @click="goback(2)" type="default">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="selectYearDailog" width="20%" center>
            <el-form label-width="60px" class="info-show">
                <el-form-item label-width="80px" label="目标年度">
                    <el-date-picker
                        v-model="selectYear"
                        type="year"
                        value-format="yyyy"
                        placeholder="请选择年度"
                        align="center"
                    ></el-date-picker>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" style="text-align: center">
                <el-button type="primary" size="small" @click="copySubmit">确定</el-button>
                <el-button size="small" @click="goback(3)">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    computed: {
        treeHeight() {
            if (this.mainTreeData.length == 0) return 'width:calc(100% );'
            let no = 0
            getnext(this.mainTreeData, 1)
            function getnext(list, index) {
                list.forEach(key => {
                    if (key.children && key.children.length > 0) {
                        getnext(key.children, index + 1)
                        no = index + 1 > no ? index + 1 : no
                    }
                })
            }
            return 'width:calc( 200% + ' + 16 * no + 'px) ;'
        }
    },
    data() {
        return {
            year: '',
            selectedArrData: [],
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            childTableData: [],
            pageNo: 1,
            total: 0,
            addDocDialog: false,
            menuform: {
                id: 0,
                name: '',
                pid: 0,
                businessConfigId: ''
            },
            scDetailForm: {
                id: '',
                scConfigId: '',
                name: '',
                year: '',
                reportId: '',
                gaugeId: '',
                moneyUnit: '',
                sort: ''
            },
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            mainTreeData: [],
            addDialog: false,
            flag: 0,
            docflag: 0,
            pid: 0,
            rules: {
                name: [{ required: true, message: '请输入目录名称', trigger: 'blur' }]
            },
            docRules: {
                name: [{ required: true, message: '请输入页签名称', trigger: 'blur' }],
                year: [{ required: true, message: '请选择年份', trigger: 'change' }],
                reportId: [{ required: true, message: '请选择报表', trigger: 'change' }],
                gaugeId: [{ required: true, message: '请选择仪表盘', trigger: 'change' }],
                moneyUnit: [{ required: true, message: '请选择金额单位', trigger: 'change' }]
            },
            businessConfigName: '',
            businessConfigId: '',
            businessConfigs: [],
            moneyUnits: [],
            reports: [],
            selectYearDailog: false,
            selectYear: '',
            _databaseId: '',
            gauges: []
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.queryBusiness()
        this.queryDictByName()
        this.queryReport()
        this.queryGaugeAll()
    },
    methods: {
        //查询报表
        queryReport() {
            let that = this
            that.$axios.post('/cloud/entrance/getReportAll').then(res => {
                if (res.data.code == 200) {
                    this.reports = res.data.data
                }
            })
        },
        //查询仪表盘
        queryGaugeAll() {
            let that = this
            that.$axios.post('/cloud/entrance/queryGaugeAll').then(res => {
                if (res.data.code == 200) {
                    this.gauges = res.data.data
                }
            })
        },
        //查询字典
        queryDictByName() {
            let that = this
            let params = {
                name: '金额单位'
            }
            that.$axios.post('/cloud/entrance/getDictDetailByName', params).then(res => {
                if (res.data.code == 200) {
                    this.moneyUnits = res.data.data
                }
            })
        },
        //查询业务
        queryBusiness() {
            let that = this
            that.$axios.post('/cloud/entrance/getBusinessConfigList', { _databaseId: this._databaseId }).then(res => {
                if (res.data.code == 200) {
                    that.businessConfigs = res.data.data
                    if (that.businessConfigs.length > 0) {
                        that.businessConfigId = that.businessConfigs[0].id
                        that.businessConfigName = that.businessConfigs[0].name
                        this.initmainTreeData()
                    }
                }
            })
        },
        //业务切换事件
        businessConfigChange() {
            for (var i = 0; i < this.businessConfigs.length; i++) {
                if (this.businessConfigId == this.businessConfigs[i].id) {
                    this.businessConfigName = this.businessConfigs[i].name
                }
            }
            this.childTableData = []
            this.initmainTreeData()
        },
        //查询按钮
        handleSearch() {
            this.pageNo = 1
            this.getDocInfo()
        },
        //提交保存明细
        saveDoc() {
            this.$refs.scDetailForm.validate(valid => {
                if (valid) {
                    this.$axios.post('cloud/entrance/insertScDetail', this.scDetailForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.addDocDialog = false
                            this.getDocInfo()
                        } else {
                            this.$message.warning(res.data.message)
                        }
                    })
                }
            })
        },
        // 查询明细
        getDocInfo() {
            let param = {
                pageNo: this.pageNo,
                year: this.year,
                scConfigId: this.scDetailForm.scConfigId,
                _databaseId: this._databaseId
            }
            this.$axios.post('cloud/entrance/getScDetailList', param).then(res => {
                this.childTableData = res.data.data.list
                this.total = res.data.data.total
            })
        },
        //新增明细按钮
        addDoc(flag) {
            if (flag === 0) {
                if (this.scDetailForm.scConfigId == '') {
                    return this.$message.warning('请选择页签目录')
                }
                this.scDetailForm.id = ''
                this.scDetailForm.name = ''
                this.scDetailForm.year = ''
                this.scDetailForm.reportId = ''
                this.scDetailForm.gaugeId = ''
                this.scDetailForm.moneyUnit = ''
                this.addDocDialog = true
                this.docflag = 0
            }
            if (flag === 1) {
                this.docflag = 1
                this.updateDoc()
            }
        },
        //编辑明细按钮
        updateDoc() {
            const _selectData = this.$refs.multipleTable.selection
            if (_selectData.length != 1) {
                return this.$message.warning('请选择一条进行编辑！')
            }
            this.scDetailForm.id = _selectData[0].id
            this.scDetailForm.scConfigId = _selectData[0].scConfigId
            this.scDetailForm.name = _selectData[0].name
            this.scDetailForm.year = _selectData[0].year
            this.scDetailForm.reportId = _selectData[0].reportId + ''
            this.scDetailForm.gaugeId = _selectData[0].gaugeId + ''
            this.scDetailForm.moneyUnit = _selectData[0].moneyUnit
            this.scDetailForm.sort = _selectData[0].sort
            this.addDocDialog = true
        },
        //提交更新明细
        saveUpdDoc() {
            this.$refs.scDetailForm.validate(valid => {
                if (valid) {
                    this.$axios.post('cloud/entrance/updateScDetail', this.scDetailForm).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('修改成功')
                            this.addDocDialog = false
                            this.getDocInfo()
                        } else {
                            this.$message.warning(res.data.message)
                        }
                    })
                }
            })
        },
        //删除明细
        delDoc() {
            const _selectData = this.$refs.multipleTable.selection
            if (_selectData.length <= 0) {
                return this.$message.warning('至少选择一条进行删除！')
            }
            this.$confirm('亲，确定要删除所选数据吗？', '提示', { type: 'warning' }).then(() => {
                let idss = []
                for (let i = 0; i < _selectData.length; i++) {
                    idss.push(_selectData[i].id)
                }
                const ids = idss.join(',')
                let param = {
                    ids: ids
                }
                this.$axios.post('cloud/entrance/deleteScDetailByIds', param).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.getDocInfo()
                    } else {
                        this.$message.warning(res.data.message)
                    }
                })
            })
        },
        //批量复制按钮
        batchCopy() {
            const _selectData = this.$refs.multipleTable.selection
            if (_selectData.length <= 0) {
                return this.$message.warning('至少选择一条进行复制！')
            }
            this.selectYearDailog = true
        },
        //提交复制
        copySubmit() {
            if (this.selectYear != '') {
                const _selectData = this.$refs.multipleTable.selection
                let idss = []
                for (let i = 0; i < _selectData.length; i++) {
                    idss.push(_selectData[i].id)
                }
                const ids = idss.join(',')
                let param = {
                    ids: ids,
                    selectYear: this.selectYear,
                    _databaseId: this._databaseId
                }
                this.$axios.post('cloud/entrance/copyScDetailByIds', param).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('复制成功')
                        this.selectYearDailog = false
                        this.getDocInfo()
                    } else {
                        this.$message.warning(res.data.message)
                    }
                })
            } else {
                return this.$message.warning('请选择目标年度!')
            }
        },
        //保存目录
        save() {
            this.$refs.menuform.validate(valid => {
                if (valid) {
                    this.$axios.post('cloud/entrance/insertScConfig', this.menuform).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('新增成功')
                            this.addDialog = false
                            this.initmainTreeData()
                        } else {
                            this.$message.warning(res.data.message)
                        }
                    })
                }
            })
        },
        //修改目录
        updateByid() {
            this.$refs.menuform.validate(valid => {
                if (valid) {
                    this.$axios.post('cloud/entrance/updateScConfig', this.menuform).then(res => {
                        if (res.data.code == 200) {
                            this.$message.success('修改成功')
                            this.addDialog = false
                            this.initmainTreeData()
                        } else {
                            this.$message.warning(res.data.message)
                        }
                    })
                }
            })
        },
        //返回
        goback(flag) {
            if (flag == 1) {
                this.addDialog = false
            } else if (flag == 2) {
                this.addDocDialog = false
            } else {
                this.selectYearDailog = false
            }
        },
        //查询目录
        initmainTreeData() {
            this.$axios
                .post('cloud/entrance/getTreeByBusinessConfigId', { businessConfigId: this.businessConfigId })
                .then(res => {
                    this.mainTreeData = res.data.data
                    if (this.mainTreeData.length == 0) {
                        //新增一个默认的目录
                        this.$axios
                            .post('cloud/entrance/insertScConfig', {
                                businessConfigId: this.businessConfigId,
                                pid: 0,
                                name: this.businessConfigName
                            })
                            .then(res => {
                                this.initmainTreeData()
                            })
                    }
                })
        },
        //点击目录
        getTreeNodeData(data) {
            this.scDetailForm.scConfigId = data.id
            this.getDocInfo()
        },
        //切换页卡
        handleCurrentChange(val) {
            this.pageNo = val
            this.getDocInfo()
        },
        //新增编辑目录按钮
        addDialogShow(node, data, flag) {
            if (flag === 0) {
                this.addDialog = true
                this.menuform.name = ''
                this.menuform.pid = data.id
                this.flag = 0
            }
            if (flag === 1) {
                this.menuform.pid = data.pid
                this.menuform.name = data.name
                this.menuform.id = data.id
                this.flag = 1
                this.addDialog = true
            }
            this.menuform.businessConfigId = this.businessConfigId
        },
        //删除目录
        remove(node, data) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                let params = {
                    id: data.id,
                    _databaseId: this._databaseId
                }
                this.$axios.post('cloud/entrance/deleteScConfig', params).then(res => {
                    if (res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.initmainTreeData()
                    } else {
                        this.$message.error(res.data.message)
                        this.initmainTreeData()
                    }
                })
            })
        },
        // 复选框被选中的事件
        selected(row) {
            this.selectedArrData = row
        },
        isRed({ row }) {
            const checkIdList = this.selectedArrData.map(item => item.id)
            if (checkIdList.includes(row.id)) {
                return {
                    backgroundColor: '#DE6',
                    color: 'red'
                }
            }
        },
        mouseenter(data) {
            this.$set(data, 'show', true)
            this.currentTreeNode = data
        },
        mouseleave(data) {
            this.$set(data, 'show', false)
        }
    }
}
</script>
<style scoped>
.container {
    padding: 15px;
}
.el-main {
    border-left: 1px solid #e5e9f2;
    padding: 0px;
    margin-left: 15px;
}
.add-dept {
    border: 1px dashed #e5e9f2;
    border-radius: 6px;
    text-align: center;
    padding: 8px;
    margin-bottom: 15px;
    cursor: pointer;
}
.el-table__body tr.current-row td:not(.is-center) {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
}
.el-aside .el-table__body tr.current-row .is-center {
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
}
.aside .el-table td {
    border-bottom: 0px solid #ebeef5;
}
/* 要求搜索输入框小一点，原有40px,现35 */
.searchView .el-form-item {
    margin-bottom: 15px;
    height: 35px;
}
.searchView .el-form-item__content {
    height: 35px;
    line-height: 35px;
}
.searchView .el-button {
    height: 35px;
    padding-top: 0;
    text-align: center;
    line-height: 35px;
}
.searchView .el-form-item__label {
    text-align: center;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 35px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    height: 35px;
    position: relative;
    right: -1px;
    background: #efefef;
    border-radius: 4px 0 0 4px;
    padding: 0;
}
.searchView .el-input__inner {
    line-height: 34px;
    height: 35px;
    box-sizing: border-box;
}
</style>
