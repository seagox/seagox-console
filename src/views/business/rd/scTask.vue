<template>
    <div class="container">
        <el-main>
            <div class="searchView">
                <el-form :model="searchForm" label-width="80px">
                    <el-row>
                        <el-col :span="3">
                            <el-form-item label="年度">
                                <el-date-picker
                                    v-model="searchForm.year"
                                    type="year"
                                    value-format="yyyy"
                                    placeholder="请选择年度"
                                    align="center"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="业务类型">
                                <el-select
                                    v-model="searchForm.businessConfigId"
                                    clearable
                                    @change="businessConfigChange"
                                >
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
                        <el-col :span="5">
                            <el-form-item label="审查阶段">
                                <el-select v-model="searchForm.businessDetailId" clearable>
                                    <el-option
                                        v-for="item in businessDetails"
                                        :key="item.id + ''"
                                        :label="item.name"
                                        :value="item.id + ''"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item label="状态">
                                <el-select v-model="searchForm.status" clearable>
                                    <el-option
                                        v-for="item in statusList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
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
                        <el-button type="primary" @click="addScTask" size="small">新建任务</el-button>
                        <el-button
                            v-if="
                                this.tempRow &&
                                    (this.tempRow.status == 1 ||
                                        this.tempRow.status == 2 ||
                                        this.account == 'fjctAdmin')
                            "
                            type="default"
                            @click="fenpeiScTask"
                            size="small"
                            >任务分配</el-button
                        >
                        <el-button
                            v-if="
                                this.tempRow &&
                                    (this.tempRow.status == 1 || this.tempRow.status == 2 || this.tempRow.status == 4)
                            "
                            type="default"
                            @click="updateScTaskStatus('3')"
                            size="small"
                            >开始任务</el-button
                        >
                        <el-button
                            v-if="
                                this.tempRow &&
                                    (this.tempRow.status == 1 || this.tempRow.status == 2 || this.tempRow.status == 4)
                            "
                            type="default"
                            @click="updateScTask"
                            size="small"
                            >修改任务</el-button
                        >
                        <el-button
                            v-if="this.tempRow && (this.tempRow.status == 1 || this.tempRow.status == 2)"
                            type="default"
                            @click="deleteScTask"
                            size="small"
                            >删除任务</el-button
                        >
                        <el-button
                            v-if="this.tempRow && this.tempRow.status == 3"
                            type="default"
                            @click="updateScTaskStatus('4')"
                            size="small"
                            >中止任务</el-button
                        >
                        <el-button
                            v-if="this.tempRow && this.tempRow.status == 3"
                            type="default"
                            @click="updateScTaskStatus('5')"
                            size="small"
                            >结束任务</el-button
                        >
                    </div>
                </el-form>
                <div class="table">
                    <!--列表-->
                    <el-table
                        :data="tableData"
                        border
                        stripe
                        highlight-current-row
                        @current-change="handleCurrentChange"
                        max-height="250"
                    >
                        <el-table-column width="55" align="center">
                            <template slot-scope="scope">
                                <div
                                    v-if="tempRow && tempRow.id == scope.row.id"
                                    class="select-yes"
                                    :style="selectYesType"
                                ></div>
                                <div
                                    v-if="!tempRow || (tempRow && tempRow.id != scope.row.id)"
                                    class="select-no"
                                    :style="selectNoType"
                                ></div>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column label="审查菜单" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.menuPname + '-' + scope.row.scMenuName }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="任务名称" align="center"></el-table-column>
                        <el-table-column prop="year" label="任务年度" width="80" align="center"></el-table-column>
                        <el-table-column prop="businessConfigName" label="任务类型" align="center"></el-table-column>
                        <el-table-column prop="businessDetailName" label="审查阶段" align="center"></el-table-column>
                        <el-table-column
                            prop="status"
                            label="任务状态"
                            width="90"
                            align="center"
                            :formatter="statusFormtter"
                        ></el-table-column>
                        <el-table-column
                            prop="zxfs"
                            label="执行方式"
                            align="center"
                            :formatter="zxfsFormtter"
                        ></el-table-column>
                        <el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
                        <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
                        <el-table-column prop="sjStartTime" label="实际开始时间" align="center"></el-table-column>
                        <el-table-column prop="sjEndTime" label="实际结束时间" align="center"></el-table-column>
                    </el-table>
                    <!--分页-->
                    <div class="pagination">
                        <el-pagination
                            background
                            @current-change="pageNoChange"
                            layout="total, prev, pager, next"
                            :current-page.sync="pageNo"
                            :total="total"
                        >
                        </el-pagination>
                    </div>
                </div>

                <el-tabs v-model="groupIdOne">
                    <el-tab-pane
                        v-for="(item, index) in scTaskgroupListOne"
                        :key="item.id + ''"
                        :label="item.name + (item.type == '1' ? '(分配到组)' : '(分配到人)')"
                        :name="item.id + ''"
                    >
                        <el-table
                            :data="item.tableData"
                            border
                            stripe
                            highlight-current-row
                            max-height="250"
                            style="margin-top: 10px"
                        >
                            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                            <el-table-column prop="company" label="单位" align="center"></el-table-column>
                            <el-table-column prop="position" label="职务" align="center"></el-table-column>
                            <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                            <el-table-column prop="year" label="年度" align="center"></el-table-column>
                            <el-table-column label="成员意见" align="center">
                                <template slot-scope="scope">
                                    <span style="color: blue" @click="lookOpinion(scope.row)"> 查看意见</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="isLeader" label="是否组长" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.isLeader == 1 ? '是' : '否' }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-main>
        <el-dialog title="审查任务" width="55%" :visible.sync="scTaskFormVisible" :close-on-click-modal="false">
            <el-form :model="scTaskForm" label-width="120px" :rules="formRules" ref="scTaskForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="审查菜单" prop="scMenuId">
                            <el-select
                                v-model="scTaskForm.scMenuId"
                                filterable
                                placeholder="请选择审查菜单"
                                @change="scMenuChange"
                            >
                                <el-option-group v-for="group in scMenus" :key="group.id" :label="group.name">
                                    <el-option
                                        v-for="item in group.children"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-option-group>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="执行方式" prop="zxfs">
                            <el-radio v-model="scTaskForm.zxfs" label="1">手动</el-radio>
                            <el-radio v-model="scTaskForm.zxfs" label="2">自动</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="任务名称" prop="name">
                            <el-input v-model.trim="scTaskForm.name" placeholder="请输入任务名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="任务年度" prop="year">
                            <el-date-picker
                                v-model="scTaskForm.year"
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
                    <el-col :span="12">
                        <el-form-item label="业务类型" prop="businessConfigId">
                            <el-select v-model="scTaskForm.businessConfigId" disabled @change="businessConfigChangeAdd">
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
                    <el-col :span="12">
                        <el-form-item label="审查阶段" prop="businessDetailId">
                            <el-select v-model="scTaskForm.businessDetailId" disabled>
                                <el-option
                                    v-for="item in businessDetailsAdd"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="任务开始时间" prop="startTime">
                            <el-date-picker
                                v-model="scTaskForm.startTime"
                                value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="请选择任务开始时间"
                                align="center"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="任务结束时间" prop="endTime">
                            <el-date-picker
                                v-model="scTaskForm.endTime"
                                value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="请选择任务结束时间"
                                align="center"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="scTaskFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveSubmit">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="新增分组" :visible.sync="addScTaskgroupDailog" width="20%" center>
            <el-form
                ref="scTaskgroupForm"
                :model="scTaskgroupForm"
                label-width="90px"
                :rules="scTaskgroupFormRules"
                class="info-show"
            >
                <el-form-item label="分组名称" prop="name">
                    <el-input v-model="scTaskgroupForm.name" placeholder="请输入分组名称" maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="审查方式" prop="type">
                    <el-radio v-model="scTaskgroupForm.type" label="1">分配到组</el-radio>
                    <el-radio v-model="scTaskgroupForm.type" label="2">分配到人</el-radio>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" style="text-align: center">
                <el-button type="primary" size="small" @click="saveTaskgroupSubmit">确定</el-button>
                <el-button size="small" @click="addScTaskgroupDailog = false">返回</el-button>
            </div>
        </el-dialog>
        <el-dialog title="任务分配" width="100%" :visible.sync="showFenpei" :close-on-click-modal="false">
            <div class="rwfp-view">
                <div style="width: 72%">
                    <el-button type="primary" @click="addScTaskgroup" size="small">新建分组</el-button>
                    <el-button type="default" @click="delScTaskgroup" size="small">删除分组</el-button>
                    <div v-if="scTaskgroupList.length <= 0" style="color: red">还没有添加分组，请添加分组！</div>
                    <el-tabs v-model="groupId" @tab-click="handleClick">
                        <el-tab-pane
                            v-for="(item, index) in scTaskgroupList"
                            :key="item.id + ''"
                            :label="item.name + (item.type == '1' ? '(分配到组)' : '(分配到人)')"
                            :name="item.id + ''"
                        >
                            <el-table
                                ref="tableDataGroup"
                                :data="item.tableData"
                                border
                                stripe
                                highlight-current-row
                                @current-change="handleCurrentChangeGroup"
                                max-height="250"
                                style="margin-top: 10px"
                            >
                                <el-table-column width="55" align="center">
                                    <template slot-scope="scope">
                                        <div
                                            v-if="tempGroupRow && tempGroupRow.id == scope.row.id"
                                            class="select-yes"
                                            :style="selectYesType"
                                        ></div>
                                        <div
                                            v-if="!tempGroupRow || (tempGroupRow && tempGroupRow.id != scope.row.id)"
                                            class="select-no"
                                            :style="selectNoType"
                                        ></div>
                                    </template>
                                </el-table-column>
                                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                                <el-table-column prop="company" label="单位" align="center"></el-table-column>
                                <el-table-column prop="position" label="职务" align="center"></el-table-column>
                                <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                                <el-table-column prop="year" label="年度" align="center"></el-table-column>

                                <el-table-column prop="isLeader" label="是否组长" align="center">
                                    <template slot-scope="scope">
                                        <el-switch
                                            v-model="scope.row.isLeader"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            :active-value="1"
                                            :inactive-value="2"
                                            @change="isLeaderChange(scope.row, $event)"
                                        >
                                        </el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <el-button type="text" size="small" @click="deleteScTaskgroupDetail(scope.row)"
                                            >删除</el-button
                                        >
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                    <div style="margin-top: 20px">
                        <div style="display: flex">
                            <div style="height: 40px; line-height: 40px">
                                <el-button type="primary" icon="el-icon-top" @click="addScTaskgroupDetail" size="small"
                                    >添加</el-button
                                >
                            </div>
                            <div style="height: 40px; line-height: 40px; margin-left: 10px">成员类型:</div>
                            <div style="height: 40px; line-height: 40px; margin-left: 10px; width: 130px">
                                <el-select v-model="userType" placeholder="请选择" @change="userTypeChange">
                                    <el-option
                                        v-for="item in userTypes"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <el-table
                            v-if="userType == 1"
                            ref="userTable"
                            :data="userTableData"
                            border
                            :row-style="isRed"
                            @selection-change="selected"
                            highlight-current-row
                            stripe
                            max-height="250"
                            style="margin-top: 10px"
                        >
                            <el-table-column type="selection" width="55"> </el-table-column>
                            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                            <el-table-column prop="company_name" label="单位" align="center"></el-table-column>
                            <el-table-column prop="duty" label="职务" align="center"></el-table-column>
                            <el-table-column prop="telephone" label="手机号" align="center"></el-table-column>
                            <el-table-column prop="year" label="年度" align="center"></el-table-column>
                            <el-table-column prop="delegation" label="代表团" align="center"></el-table-column>
                        </el-table>
                        <el-table
                            v-if="userType == 2"
                            ref="userTable"
                            :data="userTableData"
                            border
                            :row-style="isRed"
                            @selection-change="selected"
                            highlight-current-row
                            stripe
                            max-height="250"
                        >
                            <el-table-column type="selection" width="55"> </el-table-column>
                            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                            <el-table-column prop="company_name" label="单位" align="center"></el-table-column>
                            <el-table-column prop="duty" label="职务" align="center"></el-table-column>
                            <el-table-column prop="telephone" label="手机号" align="center"></el-table-column>
                            <el-table-column prop="year" label="年度" align="center"></el-table-column>
                        </el-table>
                        <el-table
                            v-if="userType == 3"
                            ref="userTable"
                            :data="userTableData"
                            border
                            :row-style="isRed"
                            @selection-change="selected"
                            highlight-current-row
                            stripe
                            max-height="250"
                        >
                            <el-table-column type="selection" width="55"> </el-table-column>
                            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                        </el-table>
                    </div>
                </div>
                <div style="width: 25%">
                    <el-button type="primary" @click="addScTaskgroupReport" size="small">保存</el-button>
                    <el-tabs v-model="scDetailType" @tab-click="scTypeHandleClick">
                        <el-tab-pane label="审查列表" name="reportList" style="max-height: 400px; overflow: auto">
                            <el-input
                                placeholder="输入关键字进行过滤"
                                v-model="reportFilterText"
                                clearable
                                style="margin-top: 10px;width: 60%;"
                            ></el-input>
                            <el-tree
                                :data="reportData"
                                show-checkbox
                                node-key="id"
                                ref="reportTree"
                                :default-expand-all="true"
                                style="margin-top: 15px"
                                :filter-node-method="reportFilterNode"
                            >
                                <!-- check-strictly 要求能全选和反选所以去掉 -->

                                <div v-if="data.reportId" slot-scope="{ node, data }" style="color: red">
                                    {{ data.name }}
                                </div>
                                <div v-else slot-scope="{ node, data }">
                                    {{ data.name }}
                                </div>
                            </el-tree>
                        </el-tab-pane>
                        <el-tab-pane label="审查部门" name="departmentList" style="max-height: 400px; overflow: auto">
                            <el-input
                                placeholder="输入关键字进行过滤"
                                v-model="departmentFilterText"
                                clearable
                                style="margin-top: 10px;width: 60%;"
                            ></el-input>
                            <div><el-checkbox v-model="isSelectAll" @change="selectAll">全选/全不选</el-checkbox></div>

                            <el-tree
                                :data="departmentData"
                                show-checkbox
                                node-key="id"
                                ref="departmentTree"
                                check-strictly
                                :default-expand-all="true"
                                :filter-node-method="departmentFilterNode"
                                style="margin-top: 15px"
                            >
                                <div slot-scope="{ node, data }">
                                    {{ data.code + data.name }}
                                </div>
                            </el-tree>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-dialog>
        <el-dialog width="60%" :visible.sync="scOpinionDialog" :close-on-click-modal="false">
            <div class="opinion-tab-text">联网意见表</div>
            <div style="max-height: 350px; overflow: auto" v-if="opinions.length > 0">
                <div v-for="item in opinions" class="opinion-item">
                    <div>
                        {{ item.accountName }}<span style="margin: 0 10px 0 20px"> 发表于:</span>{{ item.createTime }}
                    </div>
                    <div style="margin-top: 10px">{{ item.content }}</div>
                </div>
            </div>
            <div v-else>暂无数据</div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    components: {},
    watch: {
        reportFilterText(val) {
            this.$refs.reportTree.filter(val)
        },
        departmentFilterText(val) {
            this.$refs.departmentTree.filter(val)
        }
    },
    data() {
        return {
            departmentDataCheckKeys: [],
            isSelectAll: false,
            selectYesType: {
                background:
                    '' + (localStorage.getItem('color') != 'undefined' ? localStorage.getItem('color') : '#409eff'),
                border:
                    '1px solid' +
                    (localStorage.getItem('color') != 'undefined' ? localStorage.getItem('color') : '#409eff')
            },
            selectNoType: {
                background: '#ffffff',
                border:
                    '1px solid' +
                    (localStorage.getItem('color') != 'undefined' ? localStorage.getItem('color') : '#409eff')
            },
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            searchForm: {
                year: '2022',
                businessConfigId: '',
                businessDetailId: '',
                status: ''
            },
            businessConfigs: [],
            businessDetails: [],
            businessDetailsAdd: [],
            _databaseId: '',
            statusList: [
                { value: 1, name: '待分配' },
                { value: 2, name: '未启动' },
                { value: 3, name: '已启动' },
                { value: 4, name: '已中止' },
                { value: 5, name: '已结束' }
            ],
            tableData: [],
            pageNo: 1,
            total: 0,
            scTaskFormVisible: false,
            scTaskForm: {
                id: '',
                scMenuId: '',
                businessConfigId: '',
                businessDetailId: '',
                endTime: '',
                name: '',
                startTime: '',
                year: '',
                zxfs: '1'
            },
            formRules: {
                name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
                year: [{ required: true, message: '请选择任务年度', trigger: 'change' }],
                scMenuId: [{ required: true, message: '请选择审查菜单', trigger: 'change' }],
                businessConfigId: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
                businessDetailId: [{ required: true, message: '请选择审查阶段', trigger: 'change' }],
                startTime: [{ required: true, message: '请选择任务开始时间', trigger: 'change' }],
                endTime: [{ required: true, message: '请选择任务结束时间', trigger: 'change' }],
                zxfs: [{ required: true, message: '请选择执行方式', trigger: 'change' }]
            },
            tempRow: {},
            showFenpei: false,
            addScTaskgroupDailog: false,
            scTaskgroupForm: {
                taskId: '',
                name: '',
                type: ''
            },
            scTaskgroupFormRules: {
                name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
                type: [{ required: true, message: '请选择审查方式', trigger: 'change' }]
            },
            scTaskgroupList: [],
            groupId: '',
            tempGroupRow: {},
            userTypes: [
                {
                    value: '1',
                    label: '代表'
                },
                {
                    value: '2',
                    label: '专家'
                },
                {
                    value: '3',
                    label: '专委会'
                }
            ],
            userType: '1',
            userTableData: [],
            selectedArrData: [],
            nowGroup: {},
            scDetailType: 'reportList',
            reportData: [],
            departmentData: [],
            scMenus: [],
            scTaskgroupListOne: [],
            groupIdOne: '',
            opinions: [],
            scOpinionDialog: false,
            account: '',
            reportFilterText: '',
            departmentFilterText: ''
        }
    },
    mounted() {
        this.account = localStorage.getItem('account')
        this._databaseId = localStorage.getItem('_databaseId')
        this.queryBusinessConfigs()
        this.queryByPage()
        this.getScMenuList()
    },
    methods: {
        // 全选/不全选
        selectAll() {
            if (this.isSelectAll) {
                // 	设置目前勾选的节点，使用此方法必须设置 node-key 属性
                this.$refs.departmentTree.setCheckedNodes(this.departmentData)
                this.departmentDataCheckKeys = this.$refs.departmentTree.getCheckedKeys()
                this.departmentDataCheckKeys.forEach((i, n) => {
                    //fix el-tree过滤Selectall,全部都选择上
                    var node = this.$refs.departmentTree.getNode(i)
                    if (!node.visible && node.checked) {
                        //过滤隐藏and选中的节点。设置为false
                        this.$refs.departmentTree.setChecked(i, false) //搞定
                    }
                })
            } else {
                // 全部不选中
                this.$refs.departmentTree.setCheckedNodes([])
            }
        },
        reportFilterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        departmentFilterNode(value, data) {
            var name = data.code + data.name
            if (!value) return true
            return name.indexOf(value) !== -1
        },
        lookOpinion(row) {
            let params = {
                taskId: row.taskId,
                groupId: row.groupId,
                accountId: row.accountId,
                _databaseId: this._databaseId
            }
            this.$axios.post('/cloud/entrance/queryScOpinionByPanams', params).then(res => {
                if (res.data.code == 200) {
                    this.opinions = res.data.data
                    this.scOpinionDialog = true
                }
            })
        },
        // 查询菜单列表
        getScMenuList() {
            let that = this
            that.$axios.post('/cloud/entrance/getScMenuList', { _databaseId: this._databaseId }).then(res => {
                if (res.data.code == 200) {
                    that.scMenus = res.data.data
                }
            })
        },
        scMenuChange() {
            let that = this
            let params = {
                id: this.scTaskForm.scMenuId,
                _databaseId: this._databaseId
            }
            that.$axios.post('/cloud/entrance/getScMenuById', params).then(res => {
                if (res.data.code == 200) {
                    that.scTaskForm.businessConfigId = res.data.data.businessConfigId
                    that.businessConfigChangeAdd()
                    that.scTaskForm.businessDetailId = res.data.data.businessDetailId
                }
            })
        },
        //查询 业务配置
        queryBusinessConfigs() {
            let that = this
            that.$axios.post('/cloud/entrance/getBusinessConfigList', { _databaseId: this._databaseId }).then(res => {
                if (res.data.code == 200) {
                    that.businessConfigs = res.data.data
                }
            })
        },
        //搜索框业务配置切换事件
        businessConfigChange() {
            if (this.searchForm.businessConfigId) {
                this.queryBusinessDetailList()
            }
        },
        //新增页面业务配置切换事件
        businessConfigChangeAdd() {
            if (this.scTaskForm.businessConfigId) {
                this.queryBusinessDetailListAdd()
            }
        },
        //搜索条件查询业务配置的审查阶段
        queryBusinessDetailList() {
            let that = this
            const params = {
                configId: this.searchForm.businessConfigId,
                _databaseId: this._databaseId
            }
            that.$axios.get('/cloud/entrance/getDetailListByConfigId', { params }).then(res => {
                if (res.data.code == 200) {
                    that.businessDetails = res.data.data
                }
            })
        },
        //新增页面查询业务配置的审查阶段
        queryBusinessDetailListAdd() {
            let that = this
            const params = {
                configId: this.scTaskForm.businessConfigId,
                _databaseId: this._databaseId
            }
            that.$axios.get('/cloud/entrance/getDetailListByConfigId', { params }).then(res => {
                if (res.data.code == 200) {
                    that.businessDetailsAdd = res.data.data
                }
            })
        },
        //查询按钮
        handleSearch() {
            this.pageNo = 1
            this.queryByPage()
        },
        //页卡切换
        pageNoChange(val) {
            this.pageNo = val
            this.scTaskgroupListOne = []
            this.groupIdOne = ''
            this.queryByPage()
        },
        //查询任务列表
        queryByPage() {
            let that = this
            const params = {
                pageNo: this.pageNo,
                year: this.searchForm.year,
                businessConfigId: this.searchForm.businessConfigId,
                businessDetailId: this.searchForm.businessDetailId,
                status: this.searchForm.status,
                _databaseId: this._databaseId
            }
            that.$axios.get('/cloud/entrance/getScTaskList', { params }).then(res => {
                if (res.data.code == 200) {
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
                    that.tempRow.id = 0
                    that.tempRow.status = '0'
                }
            })
        },
        // 状态回显
        statusFormtter(row) {
            if (row.status === '1') {
                return '待分配'
            } else if (row.status === '2') {
                return '未启动'
            } else if (row.status === '3') {
                return '已启动'
            } else if (row.status === '4') {
                return '已中止'
            } else if (row.status === '5') {
                return '已结束'
            }
        },
        // 执行方式回显
        zxfsFormtter(row) {
            if (row.zxfs === '1') {
                return '手动'
            } else if (row.zxfs === '2') {
                return '自动'
            }
        },
        //新增任务按钮
        addScTask() {
            this.scTaskFormVisible = true
            if (this.$refs.scTaskForm) {
                this.$refs.scTaskForm.resetFields()
            }
        },
        //任务编辑页的保存提交
        saveSubmit() {
            let that = this
            this.$refs.scTaskForm.validate(valid => {
                if (valid) {
                    this.scTaskForm._databaseId = this._databaseId
                    if (this.scTaskForm.id) {
                        that.$axios.post('cloud/entrance/updateScTask', this.scTaskForm).then(res => {
                            if (res.data.code == 200) {
                                that.$message.success('任务修改成功')
                                that.scTaskFormVisible = false
                                that.queryByPage()
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    } else {
                        that.$axios.post('cloud/entrance/insertScTask', this.scTaskForm).then(res => {
                            if (res.data.code == 200) {
                                that.$message.success('任务新建成功')
                                that.scTaskFormVisible = false
                                that.queryByPage()
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    }
                }
            })
        },
        // 任务列表单击事件
        handleCurrentChange(row) {
            if (row) {
                this.tempRow = row
                this.queryScTaskgroupListOne()
            }
        },
        //编辑任务按钮
        updateScTask() {
            if (this.tempRow.id) {
                this.scTaskForm = Object.assign({}, this.tempRow)
                if (this.scTaskForm.businessConfigId) {
                    let that = this
                    const params = {
                        configId: this.scTaskForm.businessConfigId,
                        _databaseId: this._databaseId
                    }
                    that.$axios.get('/cloud/entrance/getDetailListByConfigId', { params }).then(res => {
                        if (res.data.code == 200) {
                            that.businessDetailsAdd = res.data.data
                        }
                    })
                }
                this.scTaskFormVisible = true
                if (this.$refs.scTaskForm) {
                    this.$refs.scTaskForm.resetFields()
                }
            } else {
                this.$message.error('请选中一条任务')
            }
        },
        //删除任务按钮
        deleteScTask() {
            if (this.tempRow.id) {
                this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' })
                    .then(() => {
                        let that = this
                        const params = {
                            id: this.tempRow.id,
                            _databaseId: this._databaseId
                        }
                        that.$axios.get('/cloud/entrance/deleteScTask', { params }).then(res => {
                            if (res.data.code == 200) {
                                that.$message.success('任务成功删除')
                                that.queryByPage()
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    })
                    .catch(() => {})
            } else {
                this.$message.error('请选中一条任务')
            }
        },
        // 任务分配按钮
        fenpeiScTask() {
            let that = this
            this.showFenpei = true
            this.isSelectAll = false
            this.groupId = ''
            this.queryScTaskgroupList()
            setTimeout(function() {
                that.queryUser()
            }, 1000)
            //查询报表
            this.queryReport()
            this.queryYsdwByJc()
        },
        //查询任务分组
        queryScTaskgroupListOne() {
            let that = this
            that.scTaskgroupListOne = []
            let params = {
                taskId: this.tempRow.id,
                _databaseId: this._databaseId
            }
            that.$axios.post('cloud/entrance/queryScTaskgroupListByTaskId', params).then(res => {
                if (res.data.code == 200) {
                    that.scTaskgroupListOne = res.data.data
                    if (that.scTaskgroupListOne.length > 0) {
                        this.groupIdOne = that.scTaskgroupListOne[0].id + ''
                    }
                }
            })
        },
        //查询任务分组
        queryScTaskgroupList() {
            let that = this
            that.scTaskgroupList = []
            let params = {
                taskId: this.tempRow.id,
                _databaseId: this._databaseId
            }
            that.$axios.post('cloud/entrance/queryScTaskgroupListByTaskId', params).then(res => {
                if (res.data.code == 200) {
                    that.scTaskgroupList = res.data.data
                    if (that.scTaskgroupList.length > 0) {
                        if (this.groupId != 0 && this.groupId != '') {
                            for (var i = 0; i < that.scTaskgroupList.length; i++) {
                                if (that.scTaskgroupList[i].id == this.groupId) {
                                    this.nowGroup = that.scTaskgroupList[i]
                                }
                            }
                        } else {
                            this.groupId = that.scTaskgroupList[0].id + ''
                            this.nowGroup = that.scTaskgroupList[0]
                        }
                    }
                }
            })
        },
        //新增任务分组按钮
        addScTaskgroup() {
            this.addScTaskgroupDailog = true
            if (this.$refs.scTaskgroupForm) {
                this.$refs.scTaskgroupForm.resetFields()
            }
            this.scTaskgroupForm.taskId = this.tempRow.id
        },
        //提交新增任务分组
        saveTaskgroupSubmit() {
            let that = this
            this.$refs.scTaskgroupForm.validate(valid => {
                if (valid) {
                    this.scTaskgroupForm._databaseId = this._databaseId
                    that.$axios.post('cloud/entrance/insertScTaskgroup', this.scTaskgroupForm).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('分组新建成功')
                            that.addScTaskgroupDailog = false
                            this.queryScTaskgroupList()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //分组选项卡切换
        handleClick() {
            let that = this
            if (this.tempGroupRow.id) {
                this.$confirm('亲，您对成员的配置还未保存,是否需要保存？', '提示', { type: 'warning' })
                    .then(() => {
                        this.addScTaskgroupReport()
                    })
                    .catch(() => {})
            }
            for (var i = 0; i < that.scTaskgroupList.length; i++) {
                if (that.scTaskgroupList[i].id == that.groupId) {
                    that.nowGroup = that.scTaskgroupList[i]
                    this.$refs.tableDataGroup[i].setCurrentRow()
                }
            }
            this.queryUser()
        },
        // 分组的明细列表点击事件
        handleCurrentChangeGroup(row) {
            let that = this
            if (row) {
                if (this.tempGroupRow.id && this.tempGroupRow.id != row.id) {
                    this.$confirm('亲，您对成员的配置还未保存,是否需要保存？', '提示', { type: 'warning' })
                        .then(() => {
                            this.addScTaskgroupReportOne(
                                this.tempGroupRow,
                                this.$refs.reportTree.getCheckedKeys().join(','),
                                this.$refs.departmentTree.getCheckedKeys().join(',')
                            )
                            setTimeout(function() {
                                that.mlb(row)
                            }, 1000)
                        })
                        .catch(() => {
                            that.mlb(row)
                        })
                } else {
                    this.mlb(row)
                }
            }
        },
        mlb(row) {
            console.log(row)
            this.tempGroupRow = row
            this.$nextTick(() => {
                this.$refs.reportTree.setCheckedKeys([])
            })
            if (row.scDetailIds != null) {
                this.$nextTick(() => {
                    this.$refs.reportTree.setCheckedKeys(row.scDetailIds.split(','))
                })
            }
            this.$nextTick(() => {
                this.$refs.departmentTree.setCheckedKeys([])
            })
            if (row.departmentIds != null) {
                this.$nextTick(() => {
                    this.$refs.departmentTree.setCheckedKeys(row.departmentIds.split(','))
                })
            }
        },
        // 成员类型变化事件
        userTypeChange() {
            this.queryUser()
        },
        // 查询人员列表
        queryUser() {
            this.userTableData = []
            if (this.userType == 1) {
                this.$axios.post('cloud/entrance/getAllDelegate').then(res => {
                    if (res.data.code == 200) {
                        this.userTableData = res.data.data
                        if (this.nowGroup.id) {
                            var i = this.userTableData.length
                            while (i--) {
                                for (var j = 0; j < this.nowGroup.tableData.length; j++) {
                                    if (
                                        this.nowGroup.tableData[j].userType == 1 &&
                                        this.nowGroup.tableData[j].uId == this.userTableData[i].id
                                    ) {
                                        this.userTableData.splice(i, 1)
                                        break
                                    }
                                }
                            }
                        }
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            } else if (this.userType == 2) {
                this.$axios.post('cloud/entrance/getAllExpert').then(res => {
                    if (res.data.code == 200) {
                        this.userTableData = res.data.data
                        if (this.nowGroup.id) {
                            var i = this.userTableData.length
                            while (i--) {
                                for (var j = 0; j < this.nowGroup.tableData.length; j++) {
                                    if (
                                        this.nowGroup.tableData[j].userType == 2 &&
                                        this.nowGroup.tableData[j].uId == this.userTableData[i].id
                                    ) {
                                        this.userTableData.splice(i, 1)
                                        break
                                    }
                                }
                            }
                        }
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            } else if (this.userType == 3) {
                this.$axios.post('cloud/entrance/getSpecialUser').then(res => {
                    if (res.data.code == 200) {
                        this.userTableData = res.data.data
                        if (this.nowGroup.id) {
                            var i = this.userTableData.length
                            while (i--) {
                                for (var j = 0; j < this.nowGroup.tableData.length; j++) {
                                    if (
                                        this.nowGroup.tableData[j].userType == 3 &&
                                        this.nowGroup.tableData[j].uId == this.userTableData[i].id
                                    ) {
                                        this.userTableData.splice(i, 1)
                                        break
                                    }
                                }
                            }
                        }
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            }
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
        //删除分组
        delScTaskgroup() {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' })
                .then(() => {
                    let that = this
                    const params = {
                        groupId: this.groupId,
                        _databaseId: this._databaseId
                    }
                    that.$axios.get('/cloud/entrance/deleteScTaskgroup', { params }).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('分组已删除')
                            this.groupId = ''
                            that.queryScTaskgroupList()
                            setTimeout(function() {
                                that.queryUser()
                            }, 1000)
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                })
                .catch(() => {})
        },
        //添加分组明细
        addScTaskgroupDetail() {
            if (this.groupId == 0) {
                return this.$message.warning('请选择一个分组')
            }
            let that = this
            let list = []
            for (var i = 0; i < this.selectedArrData.length; i++) {
                if (this.userType == 1) {
                    let user = {
                        taskId: this.tempRow.id,
                        groupId: this.groupId,
                        name: this.selectedArrData[i].name || '',
                        company: this.selectedArrData[i].company_name || '',
                        position: this.selectedArrData[i].duty || '',
                        phone: this.selectedArrData[i].telephone || '',
                        year: this.selectedArrData[i].year || '2022',
                        uId: this.selectedArrData[i].id || '',
                        userType: this.userType,
                        accountId: this.selectedArrData[i].account_id || ''
                    }
                    list.push(user)
                } else if (this.userType == 2) {
                    let user = {
                        taskId: this.tempRow.id,
                        groupId: this.groupId,
                        name: this.selectedArrData[i].name || '',
                        company: this.selectedArrData[i].company_name || '',
                        position: this.selectedArrData[i].duty || '',
                        phone: this.selectedArrData[i].telephone || '',
                        year: this.selectedArrData[i].year || '',
                        uId: this.selectedArrData[i].id || '',
                        userType: this.userType,
                        accountId: this.selectedArrData[i].account_id || ''
                    }
                    list.push(user)
                } else if (this.userType == 3) {
                    let user = {
                        taskId: this.tempRow.id,
                        groupId: this.groupId,
                        name: this.selectedArrData[i].name || '',
                        company: this.selectedArrData[i].company_name || '',
                        position: this.selectedArrData[i].duty || '',
                        phone: this.selectedArrData[i].telephone || '',
                        year: this.selectedArrData[i].year || '',
                        uId: this.selectedArrData[i].id || '',
                        userType: this.userType,
                        accountId: this.selectedArrData[i].id || ''
                    }
                    list.push(user)
                }
            }
            const params = {
                list: JSON.stringify(list),
                _databaseId: this._databaseId
            }
            that.$axios.post('/cloud/entrance/addScTaskgroupDetail', params).then(res => {
                if (res.data.code == 200) {
                    that.$message.success('添加成功')
                    that.queryScTaskgroupList()
                    setTimeout(function() {
                        that.queryUser()
                    }, 1000)
                } else {
                    that.$message.error(res.data.message)
                }
            })
        },
        //删除分组明细
        deleteScTaskgroupDetail(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' })
                .then(() => {
                    let that = this
                    const params = {
                        id: row.id,
                        _databaseId: this._databaseId
                    }
                    that.$axios.get('/cloud/entrance/deleteScTaskgroupDetail', { params }).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('成员已删除')
                            this.tempGroupRow = ''
                            that.queryScTaskgroupList()
                            setTimeout(function() {
                                that.queryUser()
                            }, 1000)
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                })
                .catch(() => {})
        },
        //更新组长
        isLeaderChange(row, value) {
            let that = this
            const params = {
                id: row.id,
                groupId: row.groupId,
                isLeader: value,
                _databaseId: this._databaseId
            }
            that.$axios.get('/cloud/entrance/updateGroupDetailIsLeader', { params }).then(res => {
                if (res.data.code == 200) {
                    that.$message.success('更新成功')
                } else {
                    if (value == 1) {
                        row.isLeader = 2
                    } else {
                        row.isLeader = 1
                    }
                    that.$message.error(res.data.message)
                }
            })
        },
        //查询该任务关联的报表
        queryReport() {
            let that = this
            const params = {
                scMenuId: this.tempRow.scMenuId,
                year: this.tempRow.year,
                _databaseId: this._databaseId
            }
            that.$axios.get('/cloud/entrance/queryReportByScMenuId', { params }).then(res => {
                if (res.data.code == 200) {
                    this.reportData = res.data.data
                    //this.reportData[0].disabled = false //要求能全选和反选所以去掉
                } else {
                    that.$message.error(res.data.message)
                }
            })
        },
        // 查询预算部门
        queryYsdwByJc() {
            let that = this
            const params = {
                //jc: 1,
                //year: this.tempRow.year,
                _databaseId: this._databaseId
            }
            that.$axios.get('/cloud/entrance/getDetpartmentOne', { params }).then(res => {
                if (res.data.code == 200) {
                    this.departmentData = res.data.data
                } else {
                    that.$message.error(res.data.message)
                }
            })
        },
        // 审查报表/部门切换
        scTypeHandleClick() {
            console.log(this.scDetailType)
        },
        addScTaskgroupReportOne(row, scDetailIds, departmentIds) {
            let that = this
            //if (scDetailIds != '') {
            const params = {
                id: row.id,
                scDetailIds: scDetailIds,
                _databaseId: this._databaseId
            }
            that.$axios.get('/cloud/entrance/updateGroupDetailScDetailIds', { params }).then(res => {
                if (res.data.code == 200) {
                    that.$message.success('保存报表成功')
                } else {
                    that.$message.error(res.data.message)
                }
            })
            //}
            //if (departmentIds != '') {
            const paramsDepart = {
                id: row.id,
                departmentIds: departmentIds,
                _databaseId: this._databaseId
            }
            that.$axios.get('/cloud/entrance/updateGroupDetailDepartmentIds', { paramsDepart }).then(res => {
                if (res.data.code == 200) {
                    that.$message.success('保存部门成功')
                } else {
                    that.$message.error(res.data.message)
                }
            })
            //}
            setTimeout(function() {
                that.queryScTaskgroupList()
                that.queryUser()
            }, 2000)
        },
        //保存审查列表(报表)
        addScTaskgroupReport() {
            let that = this
            if (this.tempGroupRow.id) {
                // if (this.scDetailType == 'reportList') {
                let scDetailIds = this.$refs.reportTree.getCheckedKeys().join(',')
                //if (scDetailIds != '') {
                const params = {
                    id: this.tempGroupRow.id,
                    scDetailIds: scDetailIds,
                    _databaseId: this._databaseId
                }
                that.$axios.post('/cloud/entrance/updateGroupDetailScDetailIds', params).then(res => {
                    if (res.data.code == 200) {
                        that.$message.success('保存报表成功')
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
                //}

                // } else if (this.scDetailType == 'departmentList') {
                let departmentIds = this.$refs.departmentTree.getCheckedKeys().join(',')
                //if (departmentIds != '') {
                const paramsDepart = {
                    id: this.tempGroupRow.id,
                    departmentIds: departmentIds,
                    _databaseId: this._databaseId
                }
                that.$axios.post('/cloud/entrance/updateGroupDetailDepartmentIds', paramsDepart).then(res => {
                    if (res.data.code == 200) {
                        that.$message.success('保存部门成功')
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
                //}
                setTimeout(function() {
                    that.queryUser()
                    that.queryScTaskgroupList()
                }, 2000)
                this.tempGroupRow = ''
                // }
            }
        },
        // 修改任务状态
        updateScTaskStatus(status) {
            let str = ''
            if (status == '3') {
                str = '开始任务'
            } else if (status == '4') {
                str = '中止任务'
            } else if (status == '5') {
                str = '结束任务'
            }
            if (this.tempRow.id) {
                this.$confirm('亲，确认要' + str + '吗？', '提示', { type: 'warning' })
                    .then(() => {
                        let that = this
                        const params = {
                            id: this.tempRow.id,
                            status: status,
                            _databaseId: this._databaseId
                        }
                        that.$axios.get('/cloud/entrance/updateScTaskStatus', { params }).then(res => {
                            if (res.data.code == 200) {
                                that.$message.success(str)
                                that.queryByPage()
                            } else {
                                that.$message.error(res.data.message)
                            }
                        })
                    })
                    .catch(() => {})
            } else {
                this.$message.error('请选中一条任务')
            }
        }
    }
}
</script>
<style scoped>
.select-yes {
    margin-left: 15px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
.select-no {
    margin-left: 15px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
.rwfp-view {
    display: flex;
    justify-content: space-between;
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
