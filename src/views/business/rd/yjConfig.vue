<template>
    <div class="container">
        <el-container :style="'height:' + (clientHeight - 125) + 'px'">
            <el-aside width="300px">
                <div class="add-dept">
                    <span style="margin-left:10px;">预警规则</span>
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
                                    v-if="!(data.id === 2 || data.id === 12 || data.pid === 11)"
                                    v-show="data.show"
                                    size="mini"
                                    style="margin-left: 5px"
                                    type="primary"
                                    icon="el-icon-plus"
                                    @click="() => addMenuDialogShow(node, data, 0)"
                                ></el-link>
                                <el-link
                                    v-if="!(data.id === 1 || data.id === 2 || data.id === 12 || data.id === 11 || data.pid === 11)"
                                    v-show="data.show"
                                    size="mini"
                                    style="margin-left: 5px"
                                    type="primary"
                                    icon="el-icon-edit"
                                    @click="() => addMenuDialogShow(node, data, 1)"
                                ></el-link>
                                <el-link
                                    v-if="!(data.id === 1 || data.id === 2 || data.id === 12 || data.id === 11)"
                                    v-show="data.show"
                                    size="mini"
                                    style="margin-left: 5px"
                                    type="primary"
                                    icon="el-icon-delete"
                                    @click="removeMenu(node, data)"
                                ></el-link>
                            </span>
                        </el-tree>
                    </div>
                </el-scrollbar>
            </el-aside>
            <el-main>
                <div class="table" v-if="showVisible1">
                    <div class="toolView">
                        <el-button type="text" icon="el-icon-plus" @click="addConfigDialogShow" size="small">新增</el-button>
                    </div>
                    <!--列表-->
                    <el-table
                        ref="multipleTable1"
                        :data="tableData1"
                        :key="1"
                        border
                        highlight-current-row stripe>
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="codeName" label="编码名称" align="center"></el-table-column>
                        <el-table-column prop="status" label="状态" width="50" align="center">
                            <template slot-scope="scope">
                                <div :style="{'color':scope.row.status === 0 ? 'red':'blue'}">
                                    {{scope.row.status === 0 ? '禁用' : '启用'}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="150" align="center"></el-table-column>
                        <el-table-column prop="updateTime" label="修改时间" width="150" align="center"></el-table-column>
                        <el-table-column label="操作" width="100" align="center">
                            <template slot-scope="scope">
                                <el-link @click="editConfigDialogShow(scope.row)"><i class="el-icon-edit el-icon--right"></i></el-link>
                                <el-link @click="deleteConfig(scope.row)"><i class="el-icon-delete el-icon--right"></i></el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="table" v-if="showVisible2">
                    <div class="toolView">
                        <el-button type="text" @click="updateYjZxfa" size="small">保存</el-button>
                        <el-button type="text" @click="ljzx(1)" size="small">立即执行</el-button>
                        <el-button type="text" @click="czsj(1)" size="small">重置数据</el-button>
                    </div>
                    方案基本信息
                    <hr/>
                    <el-form ref="zxfaForm" :model="zxfaForm" label-width="80px" class="info-show">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="方案名称" prop="name">
                                    <el-input v-model="zxfaForm.name" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="是否启用" prop="status">
                                    <el-switch v-model="zxfaForm.status" :active-value="1" :inactive-value="0" placeholder="请输入"> </el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="生效日期" prop="validDate">
                                    <el-date-picker
                                        v-model="zxfaForm.validDate"
                                        align="center"
                                        type="date"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="失效日期" prop="invalidDate">
                                    <el-date-picker
                                        v-model="zxfaForm.invalidDate"
                                        align="center"
                                        type="date"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="备注" prop="remarks">
                                    <el-input
                                        v-model="zxfaForm.remarks"
                                        :rows="1"
                                        placeholder="请输入"
                                        type="textarea">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    执行列表
                    <hr/>
                    <div class="toolView">
                        <el-button type="text" @click="addZxfaXqDialogShow" size="small">添加</el-button>
                        <el-button type="text" @click="ljzx(2)" size="small">立即执行</el-button>
                        <el-button type="text" @click="czsj(2)" size="small">重置数据</el-button>
                    </div>
                    <!--列表-->
                    <el-table
                        ref="multipleTable2"
                        :data="tableData2"
                        :key="2"
                        height="300"
                        border
                        highlight-current-row stripe>
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="name" label="方案" align="center"></el-table-column>
                        <el-table-column prop="codeName" label="编码名称" align="center"></el-table-column>
                        <el-table-column prop="zxcl" label="执行策略" width="100" align="center">
                            <template slot-scope="scope">
                                {{scope.row.zxcl === 0 ? '全量' : '增量'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="validDate" label="生效日期" width="150" align="center"></el-table-column>
                        <el-table-column prop="invalidDate" label="失效日期" width="150" align="center"></el-table-column>
                        <el-table-column prop="status" label="状态" width="50" align="center">
                            <template slot-scope="scope">
                                <div :style="{'color':scope.row.status === 0 ? 'red':'blue'}">
                                    {{scope.row.status === 0 ? '禁用' : '启用'}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center">
                            <template slot-scope="scope">
                                <el-link @click="editZxfaMxDialogShow(scope.row)"><i class="el-icon-edit el-icon--right"></i></el-link>
                                <el-link @click="deleteZxfaMx(scope.row)"><i class="el-icon-delete el-icon--right"></i></el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="table" v-if="showVisible3">
                    <el-form label-width="80px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="执行方案">
                                    <el-select v-model="searchForm.zxfaId" clearable placeholder="请选择">
                                        <el-option
                                            v-for="item in optionsZxfa"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-button
                                    icon="el-icon-search"
                                    style="margin-left:15px"
                                    type="primary"
                                    @click.native="handleSearch"
                                >查询
                                </el-button
                                >
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-table :data="tableData3" :key="3" border highlight-current-row stripe>
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="faName" label="方案" align="center"></el-table-column>
                        <el-table-column prop="codeName" label="编码名称" align="center"></el-table-column>
                        <el-table-column prop="status" label="执行状态" width="100" align="center">
                            <template slot-scope="scope">
                                <div :style="{'color':scope.row.status === 0 ? 'red':'blue'}">
                                    {{scope.row.status === 0 ? '失败' : '成功'}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="message" label="提示信息" align="center">
                            <template slot-scope="scope">
                                <div :style="{'color':scope.row.status === 0 ? 'red':'blue'}">
                                    {{scope.row.message}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="执行时间" width="150" align="center"></el-table-column>
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
        <el-dialog :visible.sync="addMenuDialog" width="40%" center>
            <el-form ref="menuForm" :model="menuForm" label-width="60px" :rules="menuRules" class="info-show">
                <el-form-item prop="name" label-width="80px" label="目录名称">
                    <el-input v-model="menuForm.name" placeholder="请输入目录名称" maxlength="30"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" style="text-align: center">
                <el-button type="primary" @click="saveMenu" v-if="flag === 0">确定</el-button>
                <el-button type="primary" @click="updateMenu" v-if="flag === 1">保存</el-button>
                <el-button @click="addMenuDialog=false">返回</el-button>
            </div>
        </el-dialog>
        <!-- 新增规则配置 -->
        <el-dialog :visible.sync="addConfigDialog" width="60%" center>
            <el-form ref="configForm" :model="configForm" label-width="80px" :rules="configRules" class="info-show">
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="configForm.name" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="编码" prop="code">
                            <el-input v-model="configForm.code" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="是否启用" prop="status">
                            <el-switch v-model="configForm.status" :active-value="1" :inactive-value="0" placeholder="请输入"> </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="预警类型" prop="yjType">
                            <el-select v-model="configForm.yjType" placeholder="请选择预警类型">
                                <el-option
                                    v-for="item in optionsYJType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="描述" prop="comments">
                            <el-input
                                v-model="configForm.comments"
                                :rows="2"
                                placeholder="请输入"
                                type="textarea">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="表名称" prop="tableName">
                            <el-input v-model="configForm.tableName" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预警字段" prop="fieldName">
                            <el-input v-model="configForm.fieldName" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="金额字段" prop="moneyFieldName">
                            <el-input v-model="configForm.moneyFieldName" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="sql" prop="sql">
                            <el-input
                                v-model="configForm.sql"
                                :rows="4"
                                placeholder="请输入"
                                type="textarea">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="预警设置" prop="sql">
                            <el-button type="text" icon="el-icon-plus" @click="addRuleDialogShow" size="small">新增</el-button>
                            <el-table
                                :data="configRuleTableData"
                                border
                                height="150"
                                highlight-current-row stripe>
                                <el-table-column align="center" label="下限" prop="lowValue"></el-table-column>
                                <el-table-column align="center" label="上限" prop="highValue"></el-table-column>
                                <el-table-column align="center" label="关系说明" prop="operator" :formatter="operatorFormatter"></el-table-column>
                                <el-table-column align="center" label="预警级别" prop="level" :formatter="levelFormatter"></el-table-column>
                                <el-table-column align="center" label="评分起" prop="lowScore"></el-table-column>
                                <el-table-column align="center" label="评分止" prop="highScore"></el-table-column>
                                <el-table-column align="center" label="操作">
                                    <template slot-scope="scope">
                                        <el-link @click="editRuleDialogShow(scope.row)"><i class="el-icon-edit el-icon--right"></i></el-link>
                                        <el-link @click="deleteRule(scope.row)"><i class="el-icon-delete el-icon--right"></i></el-link>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addSubmit">确定</el-button>
                <el-button @click="addConfigDialog = false">取消</el-button>
            </div>
        </el-dialog>
        <!-- 新增预警规则-->
        <el-dialog :visible.sync="addRuleDialog" width="40%" center>
            <el-form ref="configRuleForm" :model="configRuleForm" label-width="80px" :rules="configRuleRules" class="info-show">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="下限" prop="lowValue">
                            <el-input v-model="configRuleForm.lowValue" type="number" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上限" prop="highValue">
                            <el-input v-model="configRuleForm.highValue" type="number" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="关系说明" prop="operator">
                            <el-select v-model="configRuleForm.operator" clearable placeholder="请选择预警级别">
                                <el-option
                                    v-for="item in optionsOperator"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预警级别" prop="level">
                            <el-select v-model="configRuleForm.level" clearable placeholder="请选择预警级别">
                                <el-option
                                    v-for="item in optionsLevel"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="评分起" prop="lowScore">
                            <el-input v-model="configRuleForm.lowScore" type="number" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="评分止" prop="highScore">
                            <el-input v-model="configRuleForm.highScore" type="number" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="dialog-footer" style="text-align: center">
                <el-button type="primary" @click="addRule">确定</el-button>
                <el-button @click="addRuleDialog=false">返回</el-button>
            </div>
        </el-dialog>
        <!-- 新增执行方案详情-->
        <el-dialog :visible.sync="addZxfaMxDialog" width="40%" center>
            <el-tree
                :data="zxfaTreeData"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="zxfaTree"
                highlight-current
                :props="defaultProps">
            </el-tree>
            <div class="dialog-footer" style="text-align: center">
                <el-button type="primary" @click="addZxfaMx">添加</el-button>
                <el-button @click="addZxfaMxDialog=false">返回</el-button>
            </div>
        </el-dialog>
        <!-- 编辑执行方案详情-->
        <el-dialog :visible.sync="editZxfaMxDialog" width="40%" center>
            <el-form ref="zxfaMxForm" :model="zxfaMxForm" label-width="100px" class="info-show">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="编码" prop="code">
                            <el-input v-model="zxfaMxForm.code" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="名称" prop="indexName">
                            <el-input v-model="zxfaMxForm.indexName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="是否启用" prop="status">
                            <el-switch v-model="zxfaMxForm.status" :active-value="1" :inactive-value="0" placeholder="请输入"> </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生效日期" prop="validDate">
                            <el-date-picker
                                v-model="zxfaMxForm.validDate"
                                type="date"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="失效日期" prop="invalidDate">
                            <el-date-picker
                                v-model="zxfaMxForm.invalidDate"
                                type="date"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="执行策略" prop="zxcl">
                            <el-radio-group v-model="zxfaMxForm.zxcl">
                                <el-radio :label="0">全量</el-radio>
                                <el-radio :label="1">增量</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="zxfaMxForm.zxcl === 1">
                        <el-form-item label="主键重复策略" prop="zjcfcl">
                            <el-radio-group v-model="zxfaMxForm.zjcfcl">
                                <el-radio :label="1">跳过，保留原有数据</el-radio>
                                <el-radio :label="2">覆盖，删除旧数据插入新数据</el-radio>
                                <el-radio :label="3">忽略，直接追加</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="dialog-footer" style="text-align: center">
                <el-button type="primary" @click="editZxfaMx">保存</el-button>
                <el-button @click="editZxfaMxDialog=false">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    computed: {
        treeHeight() {
            if (this.mainTreeData.length === 0) return 'width:calc(100% );'
            let no = 0
            getNext(this.mainTreeData, 1)
            function getNext(list, index) {
                list.forEach(key => {
                    if (key.children && key.children.length > 0) {
                        getNext(key.children, index + 1)
                        no = index + 1 > no ? index + 1 : no
                    }
                })
            }
            return 'width:calc( 200% + ' + 16 * no + 'px) ;'
        }
    },
    data() {
        return {
            _databaseId: '',
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            menuForm: {
                id: null,
                name: '',
                pid: null,
                catalogType: 0
            },
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            mainTreeData: [],
            addMenuDialog: false,
            flag: 0,
            pid: 0,
            menuRules: {
                name: [{ required: true, message: '请输入目录名称', trigger: 'blur' }]
            },
            addConfigDialog: false,
            configForm: {
                name: '',
                code: '',
                yjType: 1,
                comments: '',
                status: 1,
                tableName: '',
                fieldName: '',
                moneyFieldName: '',
                sql: '',
                catalogId: null
            },
            configRules: {
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
                sql: [{ required: true, message: '请输入sql', trigger: 'blur' }],
                tableName: [{ required: true, message: '请输入表名称', trigger: 'blur' }],
                fieldName: [{ required: true, message: '请输入预警字段', trigger: 'blur' }],
                moneyFieldName: [{ required: true, message: '请输入预警金额字段', trigger: 'blur' }],
                yjType: [{ required: true, message: '请选择预警类型', trigger: 'change' }],
            },
            configRuleTableData: [],
            addRuleDialog: false,
            configRuleForm: {
                id: 0,
                lowValue: null,
                highValue: null,
                operator: '',
                level: null,
                lowScore: null,
                highScore: null
            },
            configRuleRules: {
                lowValue: [{ required: true, message: '请输入下限', trigger: 'blur' }],
                highValue: [{ required: true, message: '请输入上限', trigger: 'blur' }],
                operator: [{ required: true, message: '请选择', trigger: 'change' }],
                level: [{ required: true, message: '请选择', trigger: 'change' }],
                lowScore: [{ required: true, message: '请输入', trigger: 'blur' }],
                highScore: [{ required: true, message: '请输入', trigger: 'blur' }],
            },
            ruleFlag: 0,
            optionsYJType: [{
                value: 1,
                label: '年初预算'
            }, {
                value: 2,
                label: '预算调整'
            }, {
                value: 3,
                label: '预算执行'
            }, {
                value: 4,
                label: '决算'
            }],
            optionsLevel: [{
                value: 1,
                label: '提示'
            }, {
                value: 2,
                label: '警告'
            }, {
                value: 3,
                label: '严重'
            }],
            optionsOperator: [{
                value: '[]',
                label: '全包含...[a,b]'
            }, {
                value: '()',
                label: '不包含...(a,b)'
            }, {
                value: '[)',
                label: '左包含...[a,b)'
            }, {
                value: '(]',
                label: '右包含...(a,b]'
            }],
            numberFlag: 0,
            tableData1: [],
            tableData2: [],
            tableData3: [],
            showVisible1: false,
            catalogId: null,
            showVisible2: false,
            showVisible3: false,
            zxfaForm: {
                id: 0,
                name: '',
                status: null,
                validDate: '',
                invalidDate: '',
                remarks: ''
            },
            addZxfaMxDialog: false,
            zxfaTreeData: [],
            editZxfaMxDialog: false,
            zxfaMxForm: {},
            searchForm: {
                zxfaId: null
            },
            optionsZxfa: [],
            pageNo: 1,
            total: 0
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.getYjMenuTree()
        this.getZxfaOptions()
    },
    methods: {
        //查询目录
        getYjMenuTree() {
            let params = {
                _databaseId: this._databaseId,
            }
            if (this.addZxfaMxDialog){
                params.flag = 1
                params.zxfaId = this.zxfaForm.id
            }else {
                params.flag = 2
            }
            this.$axios.get('cloud/entrance/getYjMenuTree', {params}).then(res => {
                if (res.data.code === 200){
                    if (this.addZxfaMxDialog){
                        this.zxfaTreeData = res.data.data
                    }else {
                        this.mainTreeData = res.data.data
                    }
                }
            })
        },
        //新增编辑目录按钮
        addMenuDialogShow(node, data, flag) {
            if (flag === 0) {
                this.addMenuDialog = true
                this.menuForm.name = ''
                this.menuForm.pid = data.id
                this.flag = 0
            }
            if (flag === 1) {
                this.menuForm.pid = data.pid
                this.menuForm.name = data.name
                this.menuForm.id = data.id
                this.flag = 1
                this.addMenuDialog = true
            }
        },
        //保存目录
        saveMenu() {
            this.$refs.menuForm.validate(valid => {
                if (valid) {
                    this.menuForm._databaseId = this._databaseId
                    this.menuForm.catalogType = 0
                    this.$axios.post('cloud/entrance/addYjMenu', this.menuForm).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success('新增成功')
                            this.addMenuDialog = false
                            this.getYjMenuTree()
                        } else {
                            this.$message.warning(res.data.message)
                        }
                    })
                }
            })
        },
        //修改目录
        updateMenu() {
            this.$refs.menuForm.validate(valid => {
                if (valid) {
                    this.$axios.post('cloud/entrance/updateYjMenu', this.menuForm).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success('修改成功')
                            this.addMenuDialog = false
                            this.getYjMenuTree()
                        } else {
                            this.$message.warning(res.data.message)
                        }
                    })
                }
            })
        },
        //删除目录
        removeMenu(node, data) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                let params = {
                    id: data.id,
                    _databaseId: this._databaseId,
                    status: 0
                }
                this.$axios.post('cloud/entrance/deleteYjMenu', params).then(res => {
                    if (res.data.code === 200) {
                        this.$message.success('删除成功')
                        this.showVisible1 = false
                        this.getYjMenuTree()
                    } else {
                        this.$message.error(res.data.message)
                        this.getYjMenuTree()
                    }
                })
            })
        },
        //点击目录
        getTreeNodeData(data) {
            this.catalogId = data.id
            if (data.id === 11 || data.id === 2 || data.id === 1){
                this.showVisible1 = false
                this.showVisible2 = false
                this.showVisible3 = false
                return
            }
            if (data.pid === 11){
                this.showVisible1 = false
                this.showVisible2 = true
                this.showVisible3 = false
                this.getZxfa()
                return
            }
            if (data.id === 12){
                this.showVisible1 = false
                this.showVisible2 = false
                this.showVisible3 = true
                this.getZxfaLog()
                return
            }
            this.showVisible1 = true
            this.showVisible2 = false
            this.showVisible3 = false
            this.getConfigInfo()
        },
        getZxfa(){
            let params = {
                catalogId: this.catalogId,
                _databaseId: this._databaseId
            }
            this.$axios.get('cloud/entrance/getYjZxfa', {params}).then(res => {
                if (res.data.code === 200) {
                    this.zxfaForm = res.data.data.zxfa
                    this.tableData2 = res.data.data.zxfaMx
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        getConfigInfo(){
            let params = {
                catalogId: this.catalogId,
                _databaseId: this._databaseId
            }
            this.$axios.get('cloud/entrance/getYjConfig', {params}).then(res => {
                if (res.data.code === 200) {
                    this.tableData1 = res.data.data
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        mouseenter(data) {
            this.$set(data, 'show', true)
            // this.currentTreeNode = data
        },
        mouseleave(data) {
            this.$set(data, 'show', false)
        },
        addConfigDialogShow(){
            if (this.$refs.configForm) {
                this.$refs.configForm.resetFields()
            }
            this.configForm = {status:1}
            this.configRuleTableData = []
            this.addConfigDialog = true
        },
        addRuleDialogShow(){
            this.ruleFlag = 0
            if (this.$refs.configRuleForm) {
                this.$refs.configRuleForm.resetFields()
            }
            this.configRuleForm.id = --this.numberFlag
            this.addRuleDialog = true
        },
        addRule(){
            this.$refs.configRuleForm.validate(valid => {
                if (valid) {
                    let temp = {
                        id: this.configRuleForm.id,
                        lowValue: this.configRuleForm.lowValue,
                        highValue: this.configRuleForm.highValue,
                        operator: this.configRuleForm.operator,
                        level: this.configRuleForm.level,
                        lowScore: this.configRuleForm.lowScore,
                        highScore: this.configRuleForm.highScore
                    }
                    if (parseFloat(temp.lowValue) > parseFloat(temp.highValue)){
                        this.$message.warning('设置的上限值要大于或等于下限')
                        return
                    }
                    if (parseFloat(temp.lowScore) > parseFloat(temp.highScore)){
                        this.$message.warning('设置的评分止值要大于或等于评分起值')
                        return
                    }
                    if (this.ruleFlag === 0){
                        this.configRuleTableData.push(temp)
                        this.addRuleDialog = false
                    }
                    if (this.ruleFlag === 1){
                        for(var i = 0; i < this.configRuleTableData.length; i++){
                            if (this.configRuleTableData[i].id === temp.id){
                                this.configRuleTableData[i].lowValue = temp.lowValue
                                this.configRuleTableData[i].highValue = temp.highValue
                                this.configRuleTableData[i].operator = temp.operator
                                this.configRuleTableData[i].level = temp.level
                                this.configRuleTableData[i].lowScore = temp.lowScore
                                this.configRuleTableData[i].highScore = temp.highScore
                                break
                            }
                        }
                        this.addRuleDialog = false
                    }
                }
            })
        },
        editRuleDialogShow(row){
            this.ruleFlag = 1
            this.configRuleForm = {
                id: row.id,
                lowValue: row.lowValue,
                highValue: row.highValue,
                operator: row.operator,
                level: row.level,
                lowScore: row.lowScore,
                highScore: row.highScore
            }
            this.addRuleDialog = true
        },
        deleteRule(row){
            for(var i = 0; i < this.configRuleTableData.length; i++){
                if (this.configRuleTableData[i].id === row.id){
                    this.configRuleTableData.splice(i, 1)
                    break
                }
            }
        },
        operatorFormatter(row){
            if (row.operator === '[]'){
                return '全包含...[a,b]'
            }else if (row.operator === '()'){
                return '不包含...(a,b)'
            }else if (row.operator === '[)'){
                return '左包含...[a,b)'
            }else if (row.operator === '(]') {
                return '右包含...(a,b]'
            }else {
                return row.operator
            }
        },
        levelFormatter(row){
            if (row.level === 1){
                return '提示'
            }else if (row.level === 2){
                return '警告'
            }else if (row.level === 3){
                return '严重'
            }else {
                return row.level
            }
        },
        addSubmit(){
            this.$refs.configForm.validate(valid => {
                if (valid) {
                    if (this.configRuleTableData.length === 0){
                        this.$message.warning('请配置预警设置')
                        return
                    }
                    this.configForm.configRuleData = JSON.stringify(this.configRuleTableData)
                    this.configForm.catalogId = this.catalogId
                    if (this.configForm.id){
                        this.$axios.post('cloud/entrance/updateYjConfig', this.configForm).then(res => {
                            if (res.data.code === 200) {
                                this.$message.success('修改成功')
                                this.getConfigInfo()
                                this.addConfigDialog = false
                            } else {
                                this.$message.warning(res.data.message)
                            }
                        })
                    }else {
                        this.$axios.post('cloud/entrance/addYjConfig', this.configForm).then(res => {
                            if (res.data.code === 200) {
                                this.$message.success('新增成功')
                                this.getConfigInfo()
                                this.addConfigDialog = false
                            } else {
                                this.$message.warning(res.data.message)
                            }
                        })
                    }
                }
            })
        },
        editConfigDialogShow(row){
            let params = {
                indexId: row.id,
                _databaseId: this._databaseId
            }
            this.$axios.get('cloud/entrance/getYjConfigRule', {params}).then(res => {
                if (res.data.code === 200) {
                    this.configForm = {
                        id: row.id,
                        name: row.name,
                        code: row.code,
                        comments: row.comments,
                        status: row.status,
                        tableName: row.tableName,
                        fieldName: row.fieldName,
                        moneyFieldName: row.moneyFieldName,
                        yjType: row.type,
                        sql: row.sql,
                        catalogId: row.catalogId
                    }
                    this.configRuleTableData = res.data.data
                    this.addConfigDialog = true
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        deleteConfig(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                let params = {
                    id: row.id,
                    _databaseId: this._databaseId,
                    status: 2
                }
                this.$axios.post('cloud/entrance/deleteYjConfig', params).then(res => {
                    if (res.data.code === 200) {
                        this.$message.success('删除成功')
                        this.getConfigInfo()
                    } else {
                        this.$message.error(res.data.message)
                        this.getConfigInfo()
                    }
                })
            })
        },
        updateYjZxfa(){
            this.$axios.post('cloud/entrance/updateYjZxfa', this.zxfaForm).then(res => {
                if (res.data.code === 200) {
                    this.$message.success('保存成功')
                    this.getZxfa()
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        addZxfaXqDialogShow(){
            this.addZxfaMxDialog = true
            this.getYjMenuTree()
        },
        addZxfaMx(){
            const key = this.$refs.zxfaTree.getCheckedKeys(true)
            if (key.length <= 0){
                this.$message.warning('请选择需要添加的预警规则')
                return
            }
            let params = {
                _databaseId: this._databaseId,
                catalogIds: key.toString(),
                zxfaId: this.zxfaForm.id
            }
            this.$axios.post('cloud/entrance/addYjZxfaMx', params).then(res => {
                if (res.data.code === 200) {
                    this.getZxfa()
                    this.addZxfaMxDialog = false
                    this.$message.success('添加成功')
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        editZxfaMxDialogShow(row){
            this.zxfaMxForm = {
                id: row.id,
                code: row.code,
                indexName: row.indexName,
                status: row.status,
                validDate: row.validDate,
                invalidDate: row.invalidDate,
                zxcl: row.zxcl,
                zjcfcl: row.zjcfcl
            }
            this.editZxfaMxDialog = true
        },
        editZxfaMx(){
            this.$axios.post('cloud/entrance/updateYjZxfaMx', this.zxfaMxForm).then(res => {
                if (res.data.code === 200) {
                    this.getZxfa()
                    this.editZxfaMxDialog = false
                    this.$message.success('保存成功')
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        deleteZxfaMx(row){
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                let params = {
                    id: row.id,
                    status: 2
                }
                this.$axios.post('cloud/entrance/deleteYjZxfaMx', params).then(res => {
                    if (res.data.code === 200) {
                        this.$message.success('删除成功')
                        this.getZxfa()
                    } else {
                        this.$message.error(res.data.message)
                        this.getZxfa()
                    }
                })
            })
        },
        ljzx(flag){
            if (this.zxfaForm.status !== 1){
                this.$message({message: '该执行方案未启用', type: 'warning'});
                return
            }
            let params = {
                _databaseId: this._databaseId,
                zxfaId: this.zxfaForm.id,
                flag: flag
            }
            let selectData
            if (flag !== 1) {
                selectData = this.$refs.multipleTable2.selection
                if (selectData.length <= 0) {
                    this.$message({message: '请选择具体方案', type: 'warning'});
                    return
                }
                let idsArray = []
                for (let i = 0; i < selectData.length; i++) {
                    if (selectData[i].status !== 1){
                        this.$message({message: '勾选的具体方案存在禁用状态', type: 'warning'});
                        return
                    }
                    idsArray.push(selectData[i].id)
                }
                params.ids = idsArray.toString()
            }
            this.$confirm('亲，确认要立即执行吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('cloud/entrance/zxYjZxfa', params).then(res => {
                    if (res.data.code === 200) {
                        this.$message.success('执行成功')
                    }
                })
            })
        },
        czsj(flag){
            let params = {
                _databaseId: this._databaseId,
                zxfaId: this.zxfaForm.id,
                flag: flag
            }
            let selectData
            if (flag !== 1) {
                selectData = this.$refs.multipleTable2.selection
                if (selectData.length <= 0) {
                    this.$message({message: '请选择具体方案', type: 'warning'});
                    return
                }
                let idsArray = []
                for (let i = 0; i < selectData.length; i++) {
                    idsArray.push(selectData[i].id)
                }
                params.ids = idsArray.toString()
            }
            this.$confirm('亲，确认要重置数据吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('cloud/entrance/czYjData', params).then(res => {
                    if (res.data.code === 200) {
                        this.$message.success('重置成功')
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            })
        },
        getZxfaLog(){
            let params = {
                _databaseId: this._databaseId,
                zxfaId: this.searchForm.zxfaId,
                pageNo: this.pageNo,
                pageSize: 10
            }
            this.$axios.get('cloud/entrance/getYjZxLog', {params}).then(res => {
                if (res.data.code === 200) {
                    this.tableData3 = res.data.data.list
                    this.total = res.data.data.total
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        getZxfaOptions(){
            this.$axios.get('cloud/entrance/getZxfaOptions').then(res => {
                if (res.data.code === 200) {
                    this.optionsZxfa = res.data.data
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        handleSearch(){
            this.getZxfaLog()
        },
        handleCurrentChange(){
            this.getZxfaLog()
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
</style>