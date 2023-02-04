<template>
    <div class="container report-show-page">
        <div class="searchView" style="min-width: 950px">
            <el-form :model="searchForm" label-width="80px" style="margin-left:-10px">
                <el-row :gutter="10">
                    <el-col :span="5" v-if="menuConfigData.isYear == 1">
                        <el-form-item label="年度">
                            <el-date-picker
                                v-model="searchForm.year"
                                type="year"
                                value-format="yyyy"
                                placeholder="请选择年度"
                                align="center"
                                :clearable="false"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="5">
                        <el-form-item label="审查部门">
                            <el-select v-model="scCompanyCode" @change="scCompanyChange" clearable>
                                <el-option
                                    v-for="item in scCompanys"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="menuConfigData.isYear == 1">
                        <el-button
                            type="primary"
                            icon="el-icon-search"
                            @click.native="handleSearch"
                            style="margin-left: 15px"
                            >查询</el-button
                        >
                        <el-button
                            type="primary"
                            icon="el-icon-search"
                            @click.native="lookGauge"
                            style="margin-left: 10px"
                            >仪表盘</el-button
                        >
                    </el-col>
                    <el-col :span="8" class="report-gn" v-if="reports.length > 0 && menuConfigData.isSczs == 1">
                        <!--<el-tooltip class="report-gn-item" effect="dark" content="审查依据" placement="top-start">
                            <img class="icon" src="/rd/scyj.png" @click="gnBtn('scyj')" />
                        </el-tooltip>-->
                        <el-button type="plain" @click="gnBtn('rwwd')">任务文档</el-button>
                        <el-button type="plain" @click="gnBtn('xgwd')">相关文档</el-button>
                        <el-button type="plain" @click="gnBtn('zbyj')">整表意见</el-button>
                        <!--<el-tooltip class="report-gn-item" effect="dark" content="任务文档" placement="top-start">
                            <img class="icon" src="/rd-web/rd/xgwd.png" @click="gnBtn('rwwd')" />
                        </el-tooltip>
                        <el-tooltip class="report-gn-item" effect="dark" content="相关文档" placement="top-start">
                            <img class="icon" src="/rd-web/rd/xgwd.png" @click="gnBtn('xgwd')" />
                        </el-tooltip>-->
                        <!--<el-tooltip class="report-gn-item" effect="dark" content="意见箱" placement="top-start">
                            <img class="icon" src="/rd/yjx.png" @click="gnBtn('yjx')" />
                        </el-tooltip>-->
                        <!--<el-tooltip class="report-gn-item" effect="dark" content="整表意见" placement="top-start">
                            <img class="icon" src="/rd-web/rd/zbyj.png" @click="gnBtn('zbyj')" />
                        </el-tooltip>-->
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-container :style="'height:' + (clientHeight - 180) + 'px;'">
            <el-aside
                width="200px"
                class="aside"
                v-if="menuConfigLength > 1 || (menuConfigLength == 1 && menuConfigData.list[0].children)"
            >
                <el-table
                    :data="menuConfigData.list"
                    highlight-current-row
                    :show-header="false"
                    @current-change="handleNodeClick"
                    default-expand-all
                    class="border"
                    row-key="id"
                >
                    <el-table-column show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i class="el-icon-document" style="font-size: 15px" v-if="!scope.row.children"></i>
                            <span style="font-size: 15px; margin-left: 8px" v-if="!scope.row.children">{{
                                scope.row.name
                            }}</span>
                            <span style="font-size: 15px" v-if="scope.row.children">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-aside>
            <el-main
                :style="
                    menuConfigLength > 1 || (menuConfigLength == 1 && menuConfigData.list[0].children)
                        ? 'padding-left: 20px'
                        : 'margin:0'
                "
            >
                <div v-if="reports.length <= 0" style="padding: 100px; text-align: center">
                    <img src="/rd/kong.png" style="width: 200px; height: 200px" />
                </div>
                <div v-else>
                    <el-tabs v-model="reportId" @tab-click="handleClick">
                        <el-tab-pane
                            v-for="(item, index) in reports"
                            :key="item.id + '-' + index"
                            :label="item.name"
                            :name="item.id + '-' + index"
                        >
                            <el-tooltip
                                v-if="item.id == nowReportInfo.id"
                                content="Bottom center"
                                placement="top"
                                slot="label"
                                effect="light"
                            >
                                <div slot="content" class="tooltip_content">
                                    <el-button type="text" @click="gnBtn('bbwd')">报表文档</el-button>
                                </div>
                                <span>{{ item.name }}</span>
                            </el-tooltip>
                            <div
                                v-if="reportId == item.id + '-' + index"
                                class="report"
                                @contextmenu.prevent="openTip"
                                @click.stop="lookYijian"
                                v-html="html"
                                :style="'height:' + (clientHeight - 230) + 'px'"
                            ></div>
                            <div
                                v-if="showAdd"
                                :style="{
                                    background: '#fff',
                                    top: mouseY + 'px',
                                    left: mouseX + 'px',
                                    position: 'fixed',
                                    padding: '5px',
                                    border: '1px solid #000'
                                }"
                                @click="addPizhu"
                            >
                                添加批注
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-main>
        </el-container>
        <el-dialog width="60%" :visible.sync="scOpinionDialog" :close-on-click-modal="false">
            <div class="opinion-tab-text">整表意见</div>
            <el-form :model="scOpinionForm" label-width="120px" :rules="scOpinionFormRules" ref="scOpinionForm">
                <el-form-item label="意见类型" prop="type">
                    <el-radio v-model="scOpinionForm.type" label="1">符合性意见</el-radio>
                    <el-radio v-model="scOpinionForm.type" label="2">违规意见</el-radio>
                    <el-radio v-model="scOpinionForm.type" label="3">建议意见</el-radio>
                </el-form-item>
                <el-form-item label="意见内容" prop="content">
                    <el-input type="textarea" v-model="scOpinionForm.content"></el-input>
                </el-form-item>
                <div style="text-align: right">
                    <el-button type="mini" @click="saveScOpinion">发表意见</el-button>
                </div>
            </el-form>
            <div class="opinion-tab-text">
                联网意见表
                <el-radio-group style="margin-left: 40px" @change="isQuanbuClick" v-model="isQuanbu">
                    <el-radio label="1">全部</el-radio>
                    <el-radio label="2">自己</el-radio>
                </el-radio-group>
            </div>
            <div style="max-height: 350px; overflow: auto">
                <div v-for="(item, index) in opinions" class="opinion-item" :key="index">
                    <div style="display: flex; align-items: center; justify-content: space-between">
                        <div>
                            {{ item.accountName }}<span style="margin: 0 10px 0 20px"> 发表于:</span
                            >{{ item.createTime }}
                        </div>
                        <div>
                            <el-button
                                v-if="item.status == 0 && userId == item.accountId"
                                type="text"
                                icon="el-icon-edit"
                                @click="opinionEditBtn(item, index)"
                            ></el-button>
                            <el-button
                                v-if="item.status == 0 && userId == item.accountId"
                                type="text"
                                icon="el-icon-delete"
                                @click="opinionDel(item, index)"
                            ></el-button>
                        </div>
                    </div>

                    <el-input
                        style="margin-top: 10px"
                        type="textarea"
                        v-model="item.content"
                        :disabled="item.disabled == 'true'"
                    ></el-input>
                    <div v-if="item.disabled == 'false'">
                        <el-button type="text" @click="saveScOpinionEdit(item)">保存</el-button>
                        <el-button type="text" @click="quxiaoEdit(item)">取消</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog width="40%" :visible.sync="pizhuShow" :close-on-click-modal="false">
            <div class="opinion-tab-text" v-if="showType == 'edit'">新增联网意见</div>
            <el-form
                v-if="showType == 'edit'"
                :model="annotationForm"
                label-width="120px"
                :rules="scOpinionFormRules"
                ref="annotationForm"
            >
                <el-form-item label="意见类型" prop="type">
                    <el-radio v-model="annotationForm.type" label="1">符合性意见</el-radio>
                    <el-radio v-model="annotationForm.type" label="2">违规意见</el-radio>
                    <el-radio v-model="annotationForm.type" label="3">建议意见</el-radio>
                </el-form-item>
                <el-form-item label="意见内容" prop="content">
                    <el-input type="textarea" v-model="annotationForm.content"></el-input>
                </el-form-item>
                <div style="text-align: right">
                    <el-button type="mini" @click="saveAnnotation">发表意见</el-button>
                </div>
            </el-form>
            <div class="opinion-tab-text">
                联网意见表
                <el-radio-group
                    style="margin-left: 40px"
                    @change="isQuanbuClickAnnotation"
                    v-model="isQuanbuAnnotation"
                >
                    <el-radio label="1">全部</el-radio>
                    <el-radio label="2">自己</el-radio>
                </el-radio-group>
            </div>
            <div style="max-height: 350px; overflow: auto">
                <div v-for="(item, index) in opinions" class="opinion-item" :key="index">
                    <div style="display: flex; align-items: center; justify-content: space-between">
                        <div>
                            {{ item.accountName }}<span style="margin: 0 10px 0 20px"> 发表于:</span
                            >{{ item.createTime }}
                        </div>
                        <div>
                            <el-button
                                v-if="item.status == 0 && userId == item.accountId"
                                type="text"
                                icon="el-icon-edit"
                                @click="opinionEditBtn(item, index)"
                            ></el-button>
                            <el-button
                                v-if="item.status == 0 && userId == item.accountId"
                                type="text"
                                icon="el-icon-delete"
                                @click="opinionDel(item, index)"
                            ></el-button>
                        </div>
                    </div>

                    <el-input
                        style="margin-top: 10px"
                        type="textarea"
                        v-model="item.content"
                        :disabled="item.disabled == 'true'"
                    ></el-input>
                    <div v-if="item.disabled == 'false'">
                        <el-button type="text" @click="saveScOpinionEdit(item)">保存</el-button>
                        <el-button type="text" @click="quxiaoEdit(item)">取消</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!--相关文档-->
        <el-dialog width="60%" :visible.sync="xgwdShow" :close-on-click-modal="false">
            <el-main>
                <div class="searchView">
                    <el-form label-width="80px" :model="xgwdSearchForm">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="标题">
                                    <el-input
                                        v-model="xgwdSearchForm.title"
                                        clearable
                                        placeholder="请输入标题"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="文档类型">
                                    <el-select v-model="xgwdSearchForm.docType">
                                        <el-option
                                            v-for="item in docTypeOptions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-button
                                    type="primary"
                                    icon="el-icon-search"
                                    @click.native="xgwdHandleSearch"
                                    style="margin-left:15px"
                                    >查询</el-button
                                >
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="table">
                    <!--列表-->
                    <el-table
                        ref="xgwdTable"
                        :data="xgwdTableData"
                        max-height="500"
                        border
                        highlight-current-row
                        stripe
                    >
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="title" label="标题" align="center"></el-table-column>
                        <el-table-column
                            prop="doc_type"
                            label="文档类型"
                            align="center"
                            :formatter="typeFormtter"
                        ></el-table-column>
                        <el-table-column prop="file_name" label="文档路径" align="center">
                            <template slot-scope="scope">
                                <el-dropdown @command="handleCommand($event, scope.row)">
                                    <span class="el-dropdown-link">
                                        <span>{{ scope.row.file_name }}</span>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="view" icon="el-icon-view">查看</el-dropdown-item>
                                        <el-dropdown-item command="download" icon="el-icon-download"
                                            >下载
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <div class="pagination">
                        <el-pagination
                            background
                            @current-change="xgwdHandleCurrentChange"
                            @size-change="xgwdHandleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page.sync="xgwdPageNo"
                            :page-size.sync="xgwdPageSize"
                            :page-sizes="[10, 20, 30, 50, 100, 200, 300]"
                            :total="xgwdTotal"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-main>
        </el-dialog>
        <!--任务文档-->
        <el-dialog width="40%" :visible.sync="rwwdShow" :close-on-click-modal="false">
            <el-main>
                <div class="searchView" v-if="caozuo">
                    <el-row>
                        <el-col :span="4">
                            <el-upload
                                class="avatar-uploader"
                                :action="action"
                                :headers="headers"
                                :on-success="successHandle"
                                :before-upload="beforeUpload"
                                accept=".doc,.docx,.pdf"
                                :show-file-list="false"
                            >
                                <el-button size="small" type="primary">上传文档</el-button>
                            </el-upload>
                        </el-col>
                        <el-col :span="4">
                            <el-button size="small" type="primary" @click="delDoc('rwwd')">删除</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="table">
                    <!--列表-->
                    <el-table
                        ref="rwwdTable"
                        :data="rwwdTableData"
                        max-height="500"
                        border
                        highlight-current-row
                        stripe
                    >
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="file_name" label="文档路径" align="center">
                            <template slot-scope="scope">
                                <el-dropdown @command="handleCommand($event, scope.row)">
                                    <span class="el-dropdown-link">
                                        <span>{{ scope.row.file_name }}</span>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="view" icon="el-icon-view">查看</el-dropdown-item>
                                        <el-dropdown-item command="download" icon="el-icon-download"
                                            >下载
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <div class="pagination">
                        <el-pagination
                            background
                            @current-change="rwwdHandleCurrentChange"
                            @size-change="rwwdHandleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page.sync="rwwdPageNo"
                            :page-size.sync="rwwdPageSize"
                            :page-sizes="[10, 20, 30, 50, 100, 200, 300]"
                            :total="rwwdTotal"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-main>
        </el-dialog>
        <!--报表文档-->
        <el-dialog width="40%" :visible.sync="bbwdShow" :close-on-click-modal="false">
            <el-main>
                <div class="searchView" v-if="caozuo">
                    <el-row>
                        <el-col :span="4">
                            <el-upload
                                class="avatar-uploader"
                                :action="action"
                                :headers="headers"
                                :on-success="successHandle"
                                :before-upload="beforeUpload"
                                accept=".doc,.docx,.pdf"
                                :show-file-list="false"
                            >
                                <el-button size="small" type="primary">上传文档</el-button>
                            </el-upload>
                        </el-col>
                        <el-col :span="4">
                            <el-button size="small" type="primary" @click="delDoc('bbwd')">删除</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="table">
                    <!--列表-->
                    <el-table
                        ref="bbwdTable"
                        :data="bbwdTableData"
                        max-height="500"
                        border
                        highlight-current-row
                        stripe
                    >
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="file_name" label="文档路径" align="center">
                            <template slot-scope="scope">
                                <el-dropdown @command="handleCommand($event, scope.row)">
                                    <span class="el-dropdown-link">
                                        <span>{{ scope.row.file_name }}</span>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="view" icon="el-icon-view">查看</el-dropdown-item>
                                        <el-dropdown-item command="download" icon="el-icon-download"
                                            >下载
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <div class="pagination">
                        <el-pagination
                            background
                            @current-change="bbwdHandleCurrentChange"
                            @size-change="bbwdHandleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page.sync="bbwdPageNo"
                            :page-size.sync="bbwdPageSize"
                            :page-sizes="[10, 20, 30, 50, 100, 200, 300]"
                            :total="bbwdTotal"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-main>
        </el-dialog>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            clientHeight: document.documentElement.clientHeight || handleCurrentChangedocument.body.clientHeight,
            searchForm: {
                year: '2022'
            },
            scMenuId: '',
            menuName: '',
            menuPname: '',
            _databaseId: '',
            userId: '',
            reports: [],
            letter: [
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z',
                'AA',
                'AB',
                'AC',
                'AD',
                'AE',
                'AF',
                'AG',
                'AH',
                'AI',
                'AJ',
                'AK',
                'AL',
                'AM',
                'AN',
                'AO',
                'AP',
                'AQ',
                'AR',
                'AS',
                'AT',
                'AU',
                'AV',
                'AW',
                'AX',
                'AY',
                'AZ',
                'BA',
                'BB',
                'BC',
                'BD',
                'BE',
                'BF',
                'BG',
                'BH',
                'BI',
                'BJ',
                'BK',
                'BL',
                'BM',
                'BN',
                'BO',
                'BP',
                'BQ',
                'BR',
                'BS',
                'BT',
                'BU',
                'BV',
                'BW',
                'BX',
                'BY',
                'BZ',
                'CA',
                'CB',
                'CC',
                'CD',
                'CE',
                'CF',
                'CG',
                'CH',
                'CI',
                'CJ',
                'CK',
                'CL',
                'CM',
                'CN',
                'CO',
                'CP',
                'CQ',
                'CR',
                'CS',
                'CT',
                'CU',
                'CV',
                'CW',
                'CX',
                'CY',
                'CZ',
                'DA',
                'DB',
                'DC',
                'DD',
                'DE',
                'DF',
                'DG',
                'DH',
                'DI',
                'DJ',
                'DK',
                'DL',
                'DM',
                'DN',
                'DO',
                'DP',
                'DQ',
                'DR',
                'DS',
                'DT',
                'DU',
                'DV',
                'DW',
                'DX',
                'DY',
                'DZ'
            ],
            html: '',
            menuData: '',
            menuConfigData: {},
            scConfigId: '',
            reportId: '',
            leftShow: false,
            nowReportInfo: {},
            scCompanys: [],
            scCompanyCode: '',
            departmentIds: '',
            scOpinionDialog: false,
            scOpinionForm: {
                year: '',
                businessConfigId: '',
                businessDetailId: '',
                taskId: '',
                groupId: '',
                reportId: '',
                departmentCode: '',
                projectName: '',
                content: '',
                type: '',
                accountId: '',
                roleName: ''
            },
            scOpinionFormRules: {
                type: [{ required: true, message: '请选择类型', trigger: 'change' }],
                content: [{ required: true, message: '请输入意见内容', trigger: 'blur' }]
            },
            userName: '',
            opinions: [],
            isQuanbu: '1',
            menuConfigLength: 0,
            showAdd: false,
            mouseX: 0,
            mouseY: 0,
            pizhuShow: false,
            annotationForm: {
                year: '',
                businessConfigId: '',
                businessDetailId: '',
                taskId: '',
                groupId: '',
                reportId: '',
                departmentCode: '',
                projectName: '',
                content: '',
                type: '',
                accountId: '',
                roleName: '',
                rowIndex: ''
            },
            isQuanbuAnnotation: '1',
            annotationFormContent: '',
            showType: '',
            tempItemContent: '',
            tempIndex: -1,
            urlReportId: undefined,
            //相关文档
            xgwdShow: false,
            docTypeOptions: [
                {
                    id: 0,
                    name: '绩效文档'
                },
                {
                    id: 1,
                    name: '审计报告'
                },
                {
                    id: 2,
                    name: '预算资料'
                }
            ],
            xgwdPageNo: 1,
            xgwdPageSize: 10,
            xgwdTotal: 0,
            xgwdSearchForm: {
                title: '',
                docType: 0
            },
            xgwdTableData: [],
            //任务文档
            rwwdShow: false,
            rwwdPageNo: 1,
            rwwdPageSize: 10,
            rwwdTotal: 0,
            rwwdTableData: [],
            //报表文档
            bbwdShow: false,
            bbwdPageNo: 1,
            bbwdPageSize: 10,
            bbwdTotal: 0,
            bbwdTableData: [],
            roleNames: '',
            caozuo: false,
            curExcel: [],
            excelColNum: 0
        }
    },
    created() {
        this.menuName = this.$history.history.current.query.title || ''
        this.menuPname = this.$history.history.current.query.pname || ''
        this.scMenuId = this.$history.history.current.query.scMenuId || ''
        this.urlReportId = this.$history.history.current.query.urlReportId
        if (this.$history.history.current.query.departmentCode) {
            this.scCompanyCode = this.$history.history.current.query.departmentCode
        }
        if (this.$history.history.current.query.year) {
            this.searchForm.year = this.$history.history.current.query.year + ''
        }
        this._databaseId = localStorage.getItem('_databaseId')
        this.userId = localStorage.getItem('userId')
        this.userName = localStorage.getItem('name')
        this.queryMenuConfig()
        // this.queryReport()
        this.roleNames = localStorage.getItem('roleNames')
        if (this.roleNames.indexOf('文档管理') != -1) {
            this.caozuo = true
        } else {
            this.caozuo = false
        }
    },
    methods: {
        opinionEditBtn(item, index) {
            if (this.tempIndex != -1) {
                if (this.tempIndex != index) {
                    let params = this.opinions[this.tempIndex]
                    this.$confirm('您还未保存,是否需要保存?', '提示', { type: 'warning' })
                        .then(() => {
                            this.saveScOpinionEdit(params)
                            this.opinions[this.tempIndex].disabled = 'true'
                            this.tempItemContent = item.content
                            this.opinions[index].disabled = 'false'
                            this.tempIndex = index
                        })
                        .catch(() => {
                            this.opinions[this.tempIndex].content = this.tempItemContent
                            this.opinions[this.tempIndex].disabled = 'true'
                            this.opinions[index].disabled = 'false'
                            this.tempItemContent = item.content
                            this.tempIndex = index
                        })
                }
            } else {
                this.tempItemContent = item.content
                this.tempIndex = index
                this.opinions[index].disabled = 'false'
            }
        },
        quxiaoEdit(item) {
            item.content = this.tempItemContent
            item.disabled = 'true'
            this.tempIndex = -1
            this.tempItemContent = ''
        },
        saveScOpinionEdit(item) {
            let that = this
            let params = {
                id: item.id,
                content: item.content
            }
            that.$axios.post('cloud/entrance/updateScOpinionContent', params).then(res => {
                if (res.data.code == 200) {
                    that.$message.success('保存成功')
                    if (this.scOpinionDialog) {
                        this.queryScOpinion()
                    } else {
                        this.queryAnnotation()
                    }
                } else {
                    that.$message.error(res.data.message)
                }
            })
        },
        opinionDel(item, index) {
            this.$confirm('您确定要删除此条意见吗?', '提示', { type: 'warning' })
                .then(() => {
                    let that = this
                    let params = {
                        id: item.id
                    }
                    that.$axios.post('cloud/entrance/deleteScOpinion', params).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('删除成功')
                            this.queryScOpinion()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                })
                .catch(() => {})
        },
        gnBtn(type) {
            if (type == 'scyj') {
                console.log('审查依据')
                this.$message.warning('敬请期待')
            }
            if (type == 'rwwd') {
                //任务文档
                this.rwwdShow = true
                this.rwwdPageNo = 1
                this.queryRwwdList()
            }
            if (type == 'bbwd') {
                //报表文档
                this.bbwdShow = true
                this.bbwdPageNo = 1
                this.queryBbwdList()
            }
            if (type == 'xgwd') {
                //相关文档
                this.xgwdShow = true
                this.xgwdPageNo = 1
                this.xgwdSearchForm.title = ''
                this.queryXgwdList()
            }
            if (type == 'yjx') {
                console.log('意见箱')
                this.$message.warning('敬请期待')
            }
            if (type == 'zbyj') {
                //整表意见
                this.scOpinionForm = {
                    year: this.searchForm.year,
                    businessConfigId: this.nowReportInfo.businessConfigId,
                    businessDetailId: this.nowReportInfo.businessDetailId,
                    taskId: this.nowReportInfo.taskId,
                    groupId: this.nowReportInfo.groupId,
                    reportId: this.reportId.split('-')[0] || '',
                    departmentCode: this.scCompanyCode,
                    projectName: '对报表批注意见',
                    content: '',
                    type: '',
                    accountId: this.userId,
                    roleName: this.userName
                }
                if (this.scOpinionForm.reportId == '') {
                    return this.$message.warning('请选择报表')
                }
                this.queryScOpinion()
                this.tempItemContent = ''
                this.tempIndex = -1
                this.scOpinionDialog = true
            }
        },
        queryXgwdList() {
            let that = this
            let params = {
                year: this.searchForm.year,
                docType: this.xgwdSearchForm.docType,
                title: this.xgwdSearchForm.title,
                pageNo: this.xgwdPageNo,
                pageSize: this.xgwdPageSize,
                _databaseId: this._databaseId
            }
            that.$axios.post('cloud/entrance/queryXgwdList', params).then(res => {
                if (res.data.code == 200) {
                    that.xgwdTableData = res.data.data.list
                    that.xgwdTotal = res.data.data.total
                }
            })
        },
        queryRwwdList() {
            let that = this
            let params = {
                year: this.searchForm.year,
                docType: 3,
                taskId: this.nowReportInfo.taskId,
                pageNo: this.rwwdPageNo,
                pageSize: this.rwwdPageSize,
                _databaseId: this._databaseId
            }
            that.$axios.post('cloud/entrance/queryRwwdList', params).then(res => {
                if (res.data.code == 200) {
                    that.rwwdTableData = res.data.data.list
                    that.rwwdTotal = res.data.data.total
                }
            })
        },
        delDoc(str) {
            let _selectData = []
            if (str == 'rwwd') {
                _selectData = this.$refs.rwwdTable.selection
            } else if (str == 'bbwd') {
                _selectData = this.$refs.bbwdTable.selection
            }
            if (_selectData.length <= 0) {
                this.$message({
                    message: '请选择一条文档资料！',
                    type: 'warning'
                })
                return
            }
            this.$confirm(`确定要删除所选数据吗？`, '提示', {
                cancelButtonClass: 'btn-custom-cancel',
                confirmButtonClass: 'btn-custom-confirm',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let idss = []
                for (let i = 0; i < _selectData.length; i++) {
                    idss.push(_selectData[i].id)
                }
                let ids = idss.join(',')
                let param = {
                    ids: ids
                }
                this.$axios.post('cloud/entrance/delDocInfo', param).then(res => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    if (str == 'rwwd') {
                        this.rwwdPageNo = 1
                        this.queryRwwdList()
                    } else if (str == 'bbwd') {
                        this.bbwdPageNo = 1
                        this.queryBbwdList()
                    }
                })
            })
        },
        queryBbwdList() {
            let that = this
            let params = {
                year: this.searchForm.year,
                docType: 4,
                taskId: this.nowReportInfo.taskId,
                reportId: this.reportId.split('-')[0] || '',
                pageNo: this.rwwdPageNo,
                pageSize: this.rwwdPageSize,
                _databaseId: this._databaseId
            }
            that.$axios.post('cloud/entrance/queryBbwdList', params).then(res => {
                if (res.data.code == 200) {
                    that.bbwdTableData = res.data.data.list
                    that.bbwdTotal = res.data.data.total
                }
            })
        },
        beforeUpload(file) {
            let fileName = file.name
            let pos = fileName.lastIndexOf('.')
            let lastName = fileName.substring(pos, fileName.length)
            let suffix = lastName.toLowerCase()
            if (!(suffix === '.pdf' || suffix === '.doc' || suffix === '.docx')) {
                this.$message.warning('请上传后缀为 .pdf/.doc/.docx 格式的文件')
                return false
            }
            return true
        },
        successHandle(res, file, fileList) {
            let that = this
            if (res.code === 200) {
                if (that.rwwdShow) {
                    let params = {
                        year: that.searchForm.year,
                        taskId: that.nowReportInfo.taskId,
                        menuName: '审查任务',
                        fileName: file.name,
                        fileUrl: res.data,
                        docType: 3
                    }
                    that.$axios.post('cloud/entrance/insertScDoc', params).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('文档新增成功')
                            that.rwwdPageNo = 1
                            that.queryRwwdList()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                } else if (that.bbwdShow) {
                    let params = {
                        year: that.searchForm.year,
                        taskId: that.nowReportInfo.taskId,
                        menuName: '审查任务报表',
                        fileName: file.name,
                        fileUrl: res.data,
                        docType: 4,
                        reportId: this.reportId.split('-')[0] || ''
                    }
                    that.$axios.post('cloud/entrance/insertScDoc', params).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('文档新增成功')
                            that.bbwdPageNo = 1
                            that.queryBbwdList()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            } else {
                this.$message.error(res.message)
            }
        },
        xgwdHandleSearch() {
            this.xgwdPageNo = 1
            this.queryXgwdList()
        },
        xgwdHandleCurrentChange(val) {
            this.xgwdPageNo = val
            this.queryXgwdList()
        },
        xgwdHandleSizeChange(val) {
            this.xgwdPageSize = val
            this.queryXgwdList()
        },
        rwwdHandleCurrentChange(val) {
            this.rwwdPageNo = val
            this.queryRwwdList()
        },
        rwwdHandleSizeChange(val) {
            this.rwwdPageSize = val
            this.queryRwwdList()
        },
        bbwdHandleCurrentChange(val) {
            this.bbwdPageNo = val
            this.queryBbwdList()
        },
        bbwdHandleSizeChange(val) {
            this.bbwdPageSize = val
            this.queryBbwdList()
        },
        typeFormtter(row) {
            if (row.doc_type === 0) {
                return '绩效文档'
            } else if (row.doc_type === 1) {
                return '审计报告'
            } else if (row.doc_type === 2) {
                return '预算资料'
            }
        },
        handleCommand(command, row) {
            let url
            let fileName
            url = row.file_url
            fileName = row.file_name

            if (command === 'download') {
                this.getBlob(url, blob => {
                    this.saveAs(blob, fileName)
                })
            } else if (command === 'view') {
                window.open(
                    this.$axios.defaults.baseURL +
                        'upload/preview?url=' +
                        encodeURIComponent(url) +
                        '&fileName=' +
                        encodeURIComponent(fileName)
                )
            }
        },
        getBlob(url, cb) {
            let xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)
            xhr.responseType = 'blob'
            xhr.onload = function() {
                if (xhr.status === 200) {
                    cb(xhr.response)
                }
            }
            xhr.send()
        },
        saveAs(blob, filename) {
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename)
            } else {
                let link = document.createElement('a')
                let body = document.querySelector('body')

                link.href = window.URL.createObjectURL(blob)
                link.download = filename

                link.style.display = 'none'
                body.appendChild(link)

                link.click()
                body.removeChild(link)
                window.URL.revokeObjectURL(link.href)
            }
        },
        isQuanbuClick() {
            this.queryScOpinion()
        },
        isQuanbuClickAnnotation() {
            this.queryAnnotation()
        },
        saveScOpinion() {
            let that = this
            this.$refs.scOpinionForm.validate(valid => {
                if (valid) {
                    this.scOpinionForm._databaseId = this._databaseId
                    that.$axios.post('cloud/entrance/insertScOpinion', this.scOpinionForm).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('意见提交成功')
                            that.scOpinionForm.type = ''
                            that.scOpinionForm.content = ''
                            this.queryScOpinion()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        saveAnnotation() {
            let that = this
            this.$refs.annotationForm.validate(valid => {
                if (valid) {
                    this.annotationForm._databaseId = this._databaseId
                    that.$axios.post('cloud/entrance/insertScOpinion', this.annotationForm).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('意见提交成功')
                            that.annotationForm.type = ''
                            that.annotationForm.content = this.annotationFormContent
                            this.queryAnnotation()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        queryScOpinion() {
            this.opinions = []
            let params = {
                taskId: this.nowReportInfo.taskId,
                groupId: this.nowReportInfo.groupId,
                reportId: this.reportId.split('-')[0] || '',
                departmentCode: this.scCompanyCode,
                _databaseId: this._databaseId
            }
            if (this.isQuanbu == '1') {
                params.accountId = ''
            } else {
                params.accountId = this.userId
            }
            this.$axios.post('/cloud/entrance/queryScOpinionByPanams', params).then(res => {
                if (res.data.code == 200) {
                    this.opinions = res.data.data
                    this.tempIndex = -1
                    this.tempItemContent = ''
                }
            })
        },
        queryAnnotation() {
            this.opinions = []
            let params = {
                taskId: this.nowReportInfo.taskId,
                groupId: this.nowReportInfo.groupId,
                reportId: this.reportId.split('-')[0] || '',
                departmentCode: this.scCompanyCode,
                rowIndex: this.annotationFormRowIndex,
                _databaseId: this._databaseId
            }
            if (this.isQuanbuAnnotation == '1') {
                params.accountId = ''
            } else {
                params.accountId = this.userId
            }
            this.$axios.post('/cloud/entrance/queryScOpinionByPanams', params).then(res => {
                if (res.data.code == 200) {
                    this.opinions = res.data.data
                    this.tempIndex = -1
                    this.tempItemContent = ''
                }
            })
        },
        // test
        queryMenuConfig() {
            let params = {
                year: this.searchForm.year,
                menuName: this.menuName,
                menuPname: this.menuPname,
                scMenuId: this.scMenuId,
                // scMenuId: 4,
                // menuName: '预算草案',
                // menuPname: '部门预算',
                _databaseId: this._databaseId
            }
            this.$axios.post('/cloud/entrance/getMenuByNameAndYear', params).then(res => {
                if (res.data.code == 200) {
                    this.menuConfigData = res.data.data
                    this.menuConfigLength = this.menuConfigData.list.length || 0
                    if (!this.$history.history.current.query.year) {
                        this.searchForm.year = this.menuConfigData.year
                        this.queryReport()
                    }
                }
            })
        },
        handleSearch() {
            this.queryReport()
        },
        queryReport() {
            console.log(this.searchForm.year)
            let params = {
                accountId: this.userId,
                scMenuId: this.scMenuId,
                menuName: this.menuName,
                menuPname: this.menuPname,
                // accountId: 1,
                // scMenuId: 4,
                // menuName: '预算草案',
                // menuPname: '部门预算',
                year: this.searchForm.year,
                scConfigId: this.scConfigId,
                _databaseId: this._databaseId
            }
            this.reports = []
            this.$axios.post('/cloud/entrance/queryReportByAccountAndMenu', params).then(res => {
                if (res.data.code == 200) {
                    if (res.data.data != null) {
                        this.reports = res.data.data
                        if (this.reports.length > 0) {
                            if (this.urlReportId) {
                                for (let i = 0; i < this.reports.length; i++) {
                                    if (this.reports[i].id == this.urlReportId) {
                                        this.reportId = this.reports[i].id + '-' + i
                                        this.nowReportInfo = this.reports[i]
                                        this.departmentIds = this.reports[i].departmentIds
                                        break
                                    }
                                }
                                this.urlReportId = undefined
                            } else {
                                this.reportId = res.data.data[0].id + '-0'
                                this.nowReportInfo = res.data.data[0]
                                this.departmentIds = res.data.data[0].departmentIds
                            }
                            this.queryCompanysByIds()
                            //this.queryListById()
                        }
                    }
                }
            })
        },
        handleClick() {
            this.nowReportInfo = this.reports[this.reportId.split('-')[1]]
            this.departmentIds = this.nowReportInfo.departmentIds
            this.queryCompanysByIds()
            //this.queryListById()
        },
        queryCompanysByIds() {
            let that = this
            const params = {
                //jc: 1,
                //year: this.searchForm.year,
                ids: this.departmentIds,
                _databaseId: this._databaseId
            }
            that.$axios.post('/cloud/entrance/queryDepartmentByIds', params).then(res => {
                if (res.data.code == 200) {
                    res.data.data.unshift({
                        code: res.data.data.map(v => v.code).join(),
                        name: '全部'
                    })
                    this.scCompanys = res.data.data
                    if (!this.scCompanyCode) {
                        this.scCompanyCode = res.data.data[0].code
                    }
                    this.queryListById()
                } else {
                    that.$message.error(res.data.message)
                }
            })
        },
        handleNodeClick(row) {
            this.scConfigId = row.id
            this.queryReport()
        },
        scCompanyChange() {
            this.queryListById()
        },
        async queryListById() {
            var search = {
                _flag: true,
                dept_code: this.scCompanyCode,
                date_year: this.searchForm.year
            }
            const params = {
                id: this.reportId.split('-')[0],
                search: JSON.stringify(search)
            }
            let that = this
            let res = await this.$axios.post('jellyReport/queryListById', params)
            if (res.data.code == 200) {
                var resultMap = res.data.data
                //为了实现选中变色

                var workbook = JSON.parse(res.data.data.templateSource)
                var row = workbook.row
                var col = workbook.col
                //为了实现选中变色
                that.excelColNum = workbook.col

                var rows = workbook.data.rows
                var cols = workbook.data.cols
                var rowHeight = 32
                var colWidth = 120
                var styles = workbook.data.styles
                var merges = workbook.data.merges
                var html_table =
                    '<table border="1" cellpadding="0" cellspacing="0" bordercolor="#fff" style="border-collapse:collapse;table-layout:fixed;position:absolute;left:0;top:0" width="100%">'

                var html = '<tbody>'
                var thead_table =
                    '<table border="1" cellpadding="0" cellspacing="0" bordercolor="#fff" style="border-collapse:collapse;table-layout:fixed;background:#fff;position:sticky;left:0;top:0;z-index:100" width="100%">'
                var thead = '<tbody >'
                var colgroup = '<colgroup>'
                let freezerow = 0
                if (workbook.data.freeze != null && workbook.data.freeze != undefined && workbook.data.freeze != '') {
                    var freezeReg = /\d+/g
                    freezerow = Number(workbook.data.freeze.match(freezeReg)[0])
                }
                for (let i = 0; i < row; i++) {
                    var trHtml = '<tr>'
                    var trText = ''
                    var cells = {}
                    if (rows[i]) {
                        cells = rows[i].cells
                    }
                    for (var j = 0; j < col; j++) {
                        var cell = cells[j] || {}
                        var td = {
                            rowspan: 1,
                            colspan: 1,
                            style: { width: colWidth + 'px', height: rowHeight + 'px', 'word-break': 'break-all' }
                        }
                        if (rows[i] && rows[i].height) {
                            td.style.height = rows[i].height + 'px'
                        }
                        if (cols[j] && cols[j].width) {
                            td.style.width = cols[j].width + 'px'
                        }
                        if (i == 0) {
                            if (cols[j] && cols[j].width) {
                                colgroup = colgroup + `<col width='${cols[j].width}'>`
                            } else {
                                colgroup = colgroup + `<col width='${colWidth}'>`
                            }
                        }
                        td = this.handleMerge(merges, i, j, td)
                        if (td.rowspan != 0 && td.colspan != 0) {
                            td.style['border'] = 'solid 1px #D3D3D3'
                            td.style['white-space'] = 'pre-wrap'
                            td.text = cell.text || ' '

                            var start_reg = td.text.match(/\{\{each.*?\}\}/g)
                            var end_reg = td.text.match(/\{\{\/each*?\}\}/g)
                            //获取渲染的表格数据
                            if (start_reg) {
                                let listname = start_reg[0]
                                    .replace('{{', '')
                                    .replace('}}', '')
                                    .replace('each', '')
                                    .replace(/ /g, '')
                                that.curExcel = res.data.data[listname]
                            }
                            if (start_reg || end_reg) {
                                trText = td.text
                            }
                            this.getStyles(cell, td, styles)

                            var styleStr = JSON.stringify(td.style)
                            styleStr = styleStr.replace(/{/g, '')
                            styleStr = styleStr.replace(/}/g, '')
                            styleStr = styleStr.replace(/"/g, '')
                            styleStr = styleStr.replace(/,/g, ';')

                            //trHtml = trHtml + `<td rowspan=${td.rowspan} colspan=${td.colspan} style='${styleStr}'>`
                            trHtml =
                                trHtml +
                                `<td rowspan=${td.rowspan} colspan=${td.colspan} style='${styleStr}' id="{{$index}}-${j}">`
                            trHtml = trHtml + td.text
                            trHtml = trHtml + '</td>'
                        }
                    }
                    trHtml = trHtml + '</tr>'
                    if (trText) {
                        html = html + trText
                        if (i < freezerow - 1) {
                            //假定固定到的行数为前三行，集成修改该部分
                            thead = thead + trText
                        }
                    } else {
                        html = html + trHtml
                        if (i < freezerow - 1) {
                            thead = thead + trHtml
                        }
                    }
                }
                html = html_table + colgroup + '</colgroup>' + html + '</tbody>'
                html = html + '</table>'
                thead = thead_table + colgroup + '</colgroup>' + thead + '</tbody>'
                thead = thead + '</table>'
                //方法二
                this.html = this.$template.render(thead, resultMap) + this.$template.render(html, resultMap)
            }
        },
        // 获取样式
        getStyles(cell, td, styles) {
            if (cell.style || cell.style === 0) {
                var cellStyle = styles[cell.style]
                for (let styleType in cellStyle) {
                    if (styleType === 'bgcolor') {
                        td.style['backgroundColor'] = cellStyle[styleType]
                    } else if (styleType === 'align') {
                        td.style['text-align'] = cellStyle[styleType]
                    } else if (styleType === 'valign') {
                        td.style['vertical-align'] = cellStyle[styleType]
                    } else if (styleType === 'strike') {
                        td.text = '<strike>' + td.text + '</strike>'
                    } else if (styleType === 'underline') {
                        td.style['text-decoration'] = 'underline'
                    } else if (styleType === 'textwrap') {
                        td.style['word-wrap'] = 'break-word'
                        td.style['word-break'] = 'normal'
                    } else if (styleType === 'font') {
                        if (cellStyle[styleType].size) {
                            td.style['font-size'] = cellStyle[styleType].size + 'px'
                        }
                        if (cellStyle[styleType].bold) {
                            td.style['font-weight'] = 'bold'
                        }
                        if (cellStyle[styleType].italic) {
                            td.style['font-style'] = 'italic'
                        }
                        if (cellStyle[styleType].name) {
                            td.style['font-family'] = cellStyle[styleType].name
                        }
                    } else if (styleType === 'border') {
                        if (cellStyle[styleType].top) {
                            var topBorder = cellStyle[styleType].top
                            if (topBorder[0] === 'thick') {
                                td.style['border-top'] = 'solid 3px ' + topBorder[1]
                            } else if (topBorder[0] === 'thin') {
                                td.style['border-top'] = 'solid 1px ' + topBorder[1]
                            } else if (topBorder[0] === 'medium') {
                                td.style['border-top'] = 'solid 2px ' + topBorder[1]
                            } else if (topBorder[0] === 'dashed') {
                                td.style['border-top'] = 'dashed 1px ' + topBorder[1]
                            } else if (topBorder[0] === 'dotted') {
                                td.style['border-top'] = 'dotted 1px ' + topBorder[1]
                            } else if (topBorder[0] === 'double') {
                                td.style['border-top'] = 'double 1px ' + topBorder[1]
                            }
                        }
                        if (cellStyle[styleType].bottom) {
                            var bottomBorder = cellStyle[styleType].bottom
                            if (bottomBorder[0] === 'thick') {
                                td.style['border-bottom'] = 'solid 3px ' + bottomBorder[1]
                            } else if (bottomBorder[0] === 'thin') {
                                td.style['border-bottom'] = 'solid 1px ' + bottomBorder[1]
                            } else if (bottomBorder[0] === 'medium') {
                                td.style['border-bottom'] = 'solid 2px ' + bottomBorder[1]
                            } else if (bottomBorder[0] === 'dashed') {
                                td.style['border-bottom'] = 'dashed 1px ' + bottomBorder[1]
                            } else if (bottomBorder[0] === 'dotted') {
                                td.style['border-bottom'] = 'dotted 1px ' + bottomBorder[1]
                            } else if (bottomBorder[0] === 'double') {
                                td.style['border-bottom'] = 'double 1px ' + bottomBorder[1]
                            }
                        }
                        if (cellStyle[styleType].left) {
                            var leftBorder = cellStyle[styleType].left
                            if (leftBorder[0] === 'thick') {
                                td.style['border-left'] = 'solid 3px ' + leftBorder[1]
                                //tr[tr.length - 1].style['border-right'] = 'solid 3px ' + leftBorder[1]
                            } else if (leftBorder[0] === 'thin') {
                                td.style['border-left'] = 'solid 1px ' + leftBorder[1]
                                //tr[tr.length - 1].style['border-right'] = 'solid 1px ' + leftBorder[1]
                            } else if (leftBorder[0] === 'medium') {
                                td.style['border-left'] = 'solid 2px ' + leftBorder[1]
                                //tr[tr.length - 1].style['border-right'] = 'solid 2px ' + leftBorder[1]
                            } else if (leftBorder[0] === 'dashed') {
                                td.style['border-left'] = 'dashed 1px ' + leftBorder[1]
                                //tr[tr.length - 1].style['border-right'] = 'dashed 2px ' + leftBorder[1]
                            } else if (leftBorder[0] === 'dotted') {
                                td.style['border-left'] = 'dotted 1px ' + leftBorder[1]
                                //tr[tr.length - 1].style['border-right'] = 'dotted 2px ' + leftBorder[1]
                            } else if (leftBorder[0] === 'double') {
                                td.style['border-left'] = 'double 1px ' + leftBorder[1]
                                //tr[tr.length - 1].style['border-right'] = 'double 2px ' + leftBorder[1]
                            }
                        }
                        if (cellStyle[styleType].right) {
                            var rightBorder = cellStyle[styleType].right
                            if (rightBorder[0] === 'thick') {
                                td.style['border-right'] = 'solid 3px ' + rightBorder[1]
                            } else if (rightBorder[0] === 'thin') {
                                td.style['border-right'] = 'solid 1px ' + rightBorder[1]
                            } else if (rightBorder[0] === 'medium') {
                                td.style['border-right'] = 'solid 2px ' + rightBorder[1]
                            } else if (rightBorder[0] === 'dashed') {
                                td.style['border-right'] = 'dashed 1px ' + rightBorder[1]
                            } else if (rightBorder[0] === 'dotted') {
                                td.style['border-right'] = 'dotted 1px ' + rightBorder[1]
                            } else if (rightBorder[0] === 'double') {
                                td.style['border-right'] = 'double 1px ' + rightBorder[1]
                            }
                        }
                    } else {
                        td.style[styleType] = cellStyle[styleType]
                    }
                }
            }
        },
        //合并单元格
        handleMerge(merges, row, col, td) {
            for (var i = 0; i < merges.length; i++) {
                var startMerge = merges[i].split(':')[0]
                var endMerge = merges[i].split(':')[1]
                var col_start_len = startMerge.replace(/[^\d]/g, '').length
                var col_end_len = endMerge.replace(/[^\d]/g, '').length
                var row_start = Number(startMerge.substr(startMerge.length - col_start_len, startMerge.length))
                var row_end = Number(endMerge.substr(endMerge.length - col_end_len, endMerge.length))
                var col_start = this.letter.indexOf(startMerge.substr(0, startMerge.length - col_start_len))
                var col_end = this.letter.indexOf(endMerge.substr(0, endMerge.length - col_end_len))

                if (row >= row_start - 1 && row <= row_end - 1) {
                    if (col >= col_start && col <= col_end) {
                        if (row === row_start - 1 && col === col_start) {
                            td.rowspan = row_end - row_start + 1
                            td.colspan = col_end - col_start + 1
                            td.style.width =
                                Number(td.style.width.substr(0, td.style.width.length - 2)) * td.colspan + 'px'
                            break
                        } else {
                            td.rowspan = 0
                            td.colspan = 0
                            break
                        }
                    }
                }
            }
            return td
        },
        isNumber(num) {
            return /^[0-9]+.?[0-9]*$/.test(num.replace(/,/g, ''))
        },
        openTip(event) {
            let that = this
            //通过路径取id,id中有行列信息
            if (event.path[0].localName == 'td') {
                this.mouseX = event.clientX
                this.mouseY = event.clientY
                let cur = event.path[0].id
                if (cur.split('-')[0]) {
                    this.annotationFormRowIndex = cur.split('-')[0]
                    var value = event.path[0].innerText
                    if (this.isNumber(value) === true) {
                        //开始计算前缀文字
                        let i = cur.split('-')[1]
                        let str = ''
                        while (i > 0) {
                            i--
                            if (!this.isNumber(event.path[1].childNodes[i].innerText)) {
                                str = event.path[1].childNodes[i].innerText
                                i = 0
                                break
                            }
                        }
                        str += '-' + document.getElementById('-' + cur.split('-')[1]).innerText
                        console.log(cur)
                        this.annotationFormContent = str + ':' // event.path[1].innerText.split(/[\s]/g)[0] + ': '
                        this.tempItemContent = ''
                        this.tempIndex = -1
                        this.showAdd = true
                        that.curExcel.forEach((key, index) => {
                            for (var i = 0; i < that.excelColNum; i++) {
                                if (i == cur.split('-')[1] || index == cur.split('-')[0]) {
                                    document.getElementById(index + '-' + i).style['backgroundColor'] = '#C6E0B4'
                                    if (i == cur.split('-')[1] && index == cur.split('-')[0]) {
                                        document.getElementById(index + '-' + i).style['backgroundColor'] = '#c6ebb4'
                                    }
                                } else {
                                    document.getElementById(index + '-' + i).style['backgroundColor'] = ''
                                }
                            }
                        })
                    } else {
                        this.showAdd = false
                    }
                } else {
                    this.showAdd = false
                }
            }
        },
        addPizhu() {
            this.queryAnnotation()
            this.annotationForm = {
                year: this.searchForm.year,
                businessConfigId: this.nowReportInfo.businessConfigId,
                businessDetailId: this.nowReportInfo.businessDetailId,
                taskId: this.nowReportInfo.taskId,
                groupId: this.nowReportInfo.groupId,
                reportId: this.reportId.split('-')[0] || '',
                departmentCode: this.scCompanyCode,
                content: this.annotationFormContent,
                type: '',
                accountId: this.userId,
                roleName: this.userName,
                projectName: '对报表批注意见',
                rowIndex: this.annotationFormRowIndex
            }
            this.showType = 'edit'
            this.pizhuShow = true
            this.showAdd = false
        },
        lookYijian(event) {
            this.showAdd = false

            if (event.path[0].localName == 'td') {
                this.mouseX = event.clientX
                this.mouseY = event.clientY
                let cur = event.path[0].id
                if (cur.split('-')[0]) {
                    this.annotationFormRowIndex = cur.split('-')[0]
                    var value = event.path[0].innerText
                    if (value == '查看') {
                        this.tempItemContent = ''
                        this.tempIndex = -1
                        this.showType = 'look'
                        this.pizhuShow = true
                        this.queryAnnotation()
                    }
                }

                let that = this
                if (this.isNumber(value) === true) {
                    that.curExcel.forEach((key, index) => {
                        for (var i = 0; i < that.excelColNum; i++) {
                            if (i == cur.split('-')[1] || index == cur.split('-')[0]) {
                                document.getElementById(index + '-' + i).style['backgroundColor'] = '#C6E0B4'
                                if (i == cur.split('-')[1] && index == cur.split('-')[0]) {
                                    document.getElementById(index + '-' + i).style['backgroundColor'] = '#c6ebb4'
                                }
                            } else {
                                document.getElementById(index + '-' + i).style['backgroundColor'] = ''
                            }
                        }
                    })
                }
            }
        },
        lookGauge() {
            if (this.nowReportInfo && this.nowReportInfo.gaugeId) {
                this.$history.push({
                    path: '/analysis',
                    query: {
                        id: this.nowReportInfo.gaugeId,
                        title: this.nowReportInfo.gaugeName
                    }
                })
            } else {
                return this.$message.warning('暂无报表或该报表还没有配置仪表盘')
            }
        }
    }
}
</script>

<style scoped>
.report-show-page .searchView {
    padding-top: 0 !important;
    margin-top: 0px !important;
    height: 36px !important;
    overflow: hidden !important;
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
.report-show-page .el-tabs__nav-wrap {
    margin-bottom: 0;
}
.container {
    padding: 15px;
}
.el-main {
    padding: 0px;
    margin-left: 15px;
    overflow: hidden;
}
.add-Business {
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
.el-aside {
    border-right: 1px solid #e5e9f2;
}
.el-aside .el-table__body tr.current-row .is-center {
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
}
.aside .el-table td {
    border-bottom: 0px solid #ebeef5;
}
.report-show-page .report {
    /* padding: 5px;*/
    overflow: auto;
    position: relative;
}
/* 为了报表表格中不为居中对齐的格式数据不贴边 */
.report table tr td {
    padding: 0 2px;
}
.report-gn {
    text-align: right;
}
.report-gn-item {
    margin: 5px;
}
.icon {
    width: 30px;
    height: 30px;
}
.opinion-tab-text {
    font-size: 18px;
    font-weight: bold;
    display: flex;
}
.opinion-item {
    margin: 10px;
    padding: 10px;
    border-bottom: 1px solid #ebeef5;
}
</style>
