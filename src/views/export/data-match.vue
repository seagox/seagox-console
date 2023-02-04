<template>
    <div>
        <el-container :style="'height:' + (clientHeight - 110) + 'px'">
            <el-aside width="420px" class="aside" style="padding-left:15px;padding-top:15px">
                <el-card style="height: 47%">
                    <div class="add-classify">
                        <span style="margin-left:10px;">报表</span>
                    </div>
                    <el-table
                        :data="odsTableList"
                        highlight-current-row
                        :show-header="false"
                        @current-change="handleNodeClick"
                        :max-height="(clientHeight * 0.32)"
                        class="border">
                        <el-table-column show-overflow-tooltip>
                            <template slot-scope="scope">
                                <i class="el-icon-document" style="font-size:14px;"></i>
                                <span style="font-size:14px;margin-left:8px;">{{ scope.row.comment }} - {{scope.row.name }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card style="height: 47%; margin-top: 10px">
                    <div class="add-classify">
                        <span style="margin-left:10px;">维度</span>
                    </div>
                    <el-table
                        :data="dimensionData"
                        highlight-current-row
                        :show-header="false"
                        @current-change="handleDimensionClick"
                        :max-height="(clientHeight * 0.32)"
                        class="border">
                        <el-table-column show-overflow-tooltip>
                            <template slot-scope="scope">
                                <i class="el-icon-document" style="font-size:14px;"></i>
                                <span style="font-size:14px;margin-left:8px;">{{ scope.row.name }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-aside>
            <el-main>
                <div class="toolView">
                    <el-form :model="searchForm" label-width="60px" :ref="searchForm" :inline="true">
                        <el-form-item label="区域">
                            <el-select v-model="searchForm.area" clearable placeholder="请选择区域">
                                <el-option
                                    v-for="item in areas"
                                    :key="item.code"
                                    :label="item.code + ' ' + item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="年份">
                            <el-date-picker
                                :clearable="false"
                                v-model="searchForm.year"
                                type="year"
                                value-format="yyyy"
                                placeholder="请选择年份"
                                align="center"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="月份">
                            <el-select v-model="searchForm.month" clearable placeholder="请选择月份">
                                <el-option
                                    v-for="item in months"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchChange">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table">
                    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" v-if="tabVisible">
                        <el-tab-pane label="未匹配" name="first">
                            <el-button type="text" style="float: right;" @click="autoMatchData">一键匹配</el-button>
                            <el-table :data="excelDataNo" border highlight-current-row stripe>
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column :label="odmCommentName" :prop="odmFieldName" show-overflow-tooltip></el-table-column>
                                <el-table-column :label="odmCommentCode" :prop="odmFieldCode" show-overflow-tooltip></el-table-column>
                                <el-table-column label="操作" align="center" width="100">
                                    <template slot-scope="scope">
                                        <el-button type="text" size="small" @click="handleConfig(scope.row)">配置</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination">
                                <el-pagination
                                    background
                                    @current-change="handleCurrentChangeN"
                                    layout="total, prev, pager, next"
                                    :current-page.sync="pageNoN"
                                    :page-size="pageSize"
                                    :total="totalN">
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="已匹配" name="second">
                            <el-button type="text" style="float: right;" @click="autoCancelMatchData">一键撤销</el-button>
                            <el-table :data="excelDataYes" border highlight-current-row stripe>
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column :label="odmCommentName" :prop="odmFieldName" show-overflow-tooltip></el-table-column>
                                <el-table-column :label="odmCommentCode" :prop="odmFieldCode" show-overflow-tooltip></el-table-column>
                                <el-table-column label="操作" align="center" width="100">
                                    <template slot-scope="scope">
                                        <el-button type="text" size="small" @click="handleCancelConfig(scope.row)">撤销配置</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination">
                                <el-pagination
                                    background
                                    @current-change="handleCurrentChangeY"
                                    layout="total, prev, pager, next"
                                    :current-page.sync="pageNoY"
                                    :page-size="pageSize"
                                    :total="totalY">
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-main>
        </el-container>
        <el-dialog title="手工匹配" width="550px" :visible.sync="matchVisible" :close-on-click-modal="false">
            <div style="margin-bottom: 10px">
                名称：{{configObject}}
            </div>
            <el-select v-model="matchValue" placeholder="请选择匹配数据" filterable clearable>
                <el-option
                    v-for="item in dimTableFiles"
                    :key="item.id"
                    :label="item.code + ' ' + item.name"
                    :value="item.code">
                </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click="matchVisible = false">取消</el-button>
                <el-button type="primary" @click="matchSubmit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
                tabVisible: true,
                odsTableList: [],
                currentODSId: null,
                dimensionData: [],
                currentDimensionId: null,
                odmFieldCode: null,
                odmCommentCode: null,
                odmFieldName: null,
                odmCommentName: null,
                odmSource: null,
                activeName: 'first',
                pageSize: 10,
                excelDataNo: [],
                pageNoN: 1,
                totalN: 0,
                excelDataYes: [],
                pageNoY: 1,
                totalY: 0,
                searchForm: {
                    area: null,
                    year: new Date(),
                    month: null
                },
                matchVisible: false,
                dimTableFiles: [],
                dimSource: null,
                matchValue: '',
                configObject: '',
                areas: [],
                months: [
                    {label: '全部', value: null},
                    {label: '一月', value: 1}, {label: '二月', value: 2}, {label: '三月', value: 3},
                    {label: '四月', value: 4}, {label: '五月', value: 5}, {label: '六月', value: 6},
                    {label: '七月', value: 7}, {label: '八月', value: 8}, {label: '九月', value: 9},
                    {label: '十月', value: 10}, {label: '十一月', value: 11}, {label: '十二月', value: 12},
                ]
            }
        },
        created() {
            this.queryArea()
            this.queryODSTableByType()

        },
        methods: {
            queryArea() {
                let that = this
                that.$axios.get('exportDimension/queryArea').then(res => {
                    if (res.data.code === 200) {
                        that.areas = res.data.data
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            queryODSTableByType() {
                let that = this
                that.$axios.post('businessTable/queryByType/ods', {}).then(res => {
                    if (res.data.code === 200) {
                        that.odsTableList = res.data.data
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            handleNodeClick(row) {
                this.tabVisible = false
                this.$nextTick().then(() => {
                    this.tabVisible = true
                    this.currentODSId = row.id
                    this.queryDimension(row.id)
                })
            },
            queryDimension(odsId) {
                let that = this
                const params = {
                    odsId: odsId
                }
                that.$axios.get('exportDimension/queryAll', {params}).then(res => {
                    if (res.data.code === 200) {
                        that.dimensionData = res.data.data
                        if (that.dimensionData.length > 0) {
                            that.handleDimensionClick(that.dimensionData[0])
                        } else {
                            that.handleDimensionClick(null)
                        }
                    }
                })
            },
            handleDimensionClick(row) {
                if (row == null) {
                    this.currentDimensionId = null
                    this.excelDataNo = []
                    this.excelDataYes = []
                    this.totalN = 0
                    this.totalY = 0
                    return
                }
                this.currentDimensionId = row.id
                this.odmFieldCode = row.odmFieldCode
                this.odmCommentCode = row.odmCommentCode
                this.odmFieldName = row.odmFieldName
                this.odmCommentName = row.odmCommentName
                this.odmSource = row.odmSource
                this.dimSource = row.dimSource
                if (this.activeName === 'first') {
                    this.queryExcelDataByPageN(row.id)
                } else {
                    this.queryExcelDataByPageY(row.id)
                }
                // 维度
                this.queryDimensionTable(row.dimSource)
            },
            queryDimensionTable(id) {
                let that = this
                let year = that.searchForm.year
                if (that.searchForm.year instanceof Date) {
                    year = year.getFullYear()
                }
                let params = {
                    tableId: id,
                    year: year,
                    area: that.searchForm.area
                }
                that.$axios.get('exportData/queryDataByTableId', {params}).then(res => {
                    if (res.data.code === 200) {
                        that.dimTableFiles = res.data.data
                    } else {
                        that.dimTableFiles = []
                        that.$message.error(res.data.message)
                    }
                })
            },
            queryExcelDataByPageN(odsId) {
                let that = this
                let year = that.searchForm.year
                if (that.searchForm.year instanceof Date) {
                    year = year.getFullYear()
                }
                const params = {
                    pageNo: that.pageNoN,
                    pageSize: that.pageSize,
                    dimensionId: odsId,
                    isConfig: 'false',
                    year: year,
                    month: that.searchForm.month,
                    area: that.searchForm.area
                }
                that.$axios.get('exportData/queryExcelDataByPage', {params}).then(res => {
                    if (res.data.code === 200) {
                        that.excelDataNo = res.data.data.list
                        that.totalN = res.data.data.total
                    }
                })
            },
            queryExcelDataByPageY(odsId) {
                let that = this
                let year = that.searchForm.year
                if (that.searchForm.year instanceof Date) {
                    year = year.getFullYear()
                }
                const params = {
                    pageNo: that.pageNoY,
                    pageSize: that.pageSize,
                    dimensionId: odsId,
                    isConfig: 'true',
                    year: year,
                    month: that.searchForm.month,
                    area: that.searchForm.area
                }
                that.$axios.get('exportData/queryExcelDataByPage', {params}).then(res => {
                    if (res.data.code === 200) {
                        that.excelDataYes = res.data.data.list
                        that.totalY = res.data.data.total
                    }
                })
            },
            handleCurrentChangeN() {
                this.queryExcelDataByPageN(this.currentDimensionId)
            },
            handleCurrentChangeY() {
                this.queryExcelDataByPageY(this.currentDimensionId)
            },
            handleConfig(row) {
                this.matchValue = ''
                this.matchVisible = true
                this.currentMatchRow = row
                this.configObject = row[this.odmFieldName]
            },
            handleClick(tab, event) {
                if (tab.name === 'first') {
                    this.queryExcelDataByPageN(this.currentDimensionId)
                } else {
                    this.queryExcelDataByPageY(this.currentDimensionId)
                }
            },
            searchChange() {
                this.queryDimensionTable(this.dimSource)
                if (this.activeName === 'first') {
                    this.queryExcelDataByPageN(this.currentDimensionId)
                } else {
                    this.queryExcelDataByPageY(this.currentDimensionId)
                }
            },
            matchSubmit() {
                if (!this.matchValue) {
                    this.$message.success('请选择匹配数据')
                    return
                }
                const params = {
                    tableId: this.odmSource,
                    rowId: this.currentMatchRow.id,
                    field: this.odmFieldCode,
                    value: this.matchValue
                }
                this.$axios.get('exportData/matchData', {params}).then(res => {
                    if (res.data.code === 200) {
                        this.$message.success('匹配成功！')
                        if (this.activeName === 'first') {
                            this.queryExcelDataByPageN(this.currentDimensionId)
                        } else {
                            this.queryExcelDataByPageY(this.currentDimensionId)
                        }
                        this.matchVisible = false
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            },
            handleCancelConfig(row) {
                let that = this
                const params = {
                    tableId: that.odmSource,
                    rowId: row.id,
                    field: that.odmFieldCode
                }
                that.$axios.get('exportData/cancelMatchData', {params}).then(res => {
                    if (res.data.code === 200) {
                        that.$message.success('撤销配置成功！')
                        if (this.activeName === 'first') {
                            this.queryExcelDataByPageN(this.currentDimensionId)
                        } else {
                            this.queryExcelDataByPageY(this.currentDimensionId)
                        }
                        that.matchVisible = false
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            autoMatchData() {
                this.$confirm('确定要自动匹配？', '提示', {type: 'warning'}).then(() => {
                    let that = this
                    let year = that.searchForm.year
                    if (that.searchForm.year instanceof Date) {
                        year = year.getFullYear()
                    }
                    const params = {
                        tableId: that.odmSource,
                        fieldName: this.odmFieldName,
                        fieldCode: this.odmFieldCode,
                        dimSourceId: that.dimSource,
                        dimField: that.dimSource,
                        year: year,
                        month: that.searchForm.month,
                        area: that.searchForm.area
                    }
                    that.$axios.get('exportData/autoMatchData', {params}).then(res => {
                        if (res.data.code === 200) {
                            that.$message.success('自动匹配成功！')
                            if (this.activeName === 'first') {
                                this.queryExcelDataByPageN(this.currentDimensionId)
                            } else {
                                this.queryExcelDataByPageY(this.currentDimensionId)
                            }
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                })
            },
            autoCancelMatchData() {
                this.$confirm('确定要一键撤销？', '提示', {type: 'warning'}).then(() => {
                    let that = this
                    let year = that.searchForm.year
                    if (that.searchForm.year instanceof Date) {
                        year = year.getFullYear()
                    }
                    const params = {
                        tableId: that.odmSource,
                        fieldCode: this.odmFieldCode,
                        dimSourceId: that.dimSource,
                        year: year,
                        month: that.searchForm.month,
                        area: that.searchForm.area
                    }
                    that.$axios.get('exportData/autoCancelMatchData', {params}).then(res => {
                        if (res.data.code === 200) {
                            that.$message.success('一键撤销成功！')
                            if (this.activeName === 'first') {
                                this.queryExcelDataByPageN(this.currentDimensionId)
                            } else {
                                this.queryExcelDataByPageY(this.currentDimensionId)
                            }
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                })
            },
        },
    }
</script>

<style scoped>
::v-deep .el-main {
    border-left: 1px solid #e5e9f2;
    padding: 0;
    margin-left: 15px;
}

::v-deep .is-without-controls .el-input .el-input__inner {
    text-align: left;
}

.add-classify {
    border: 1px dashed #e5e9f2;
    border-radius: 6px;
    text-align: center;
    padding: 8px;
    margin-bottom: 15px;
}

::v-deep .aside .el-table td {
    border-bottom: 0 solid #ebeef5;
}
</style>