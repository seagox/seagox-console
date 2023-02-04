<template>
    <div class="container">
        <el-container :style="'height:' + (clientHeight - 125) + 'px'">
            <el-aside width="300px">
                <div class="add-dept">
                    <span style="margin-left:10px;">意见分类</span>
                </div>
                <el-tree
                    :data="folderList"
                    :expand-on-click-node="false"
                    :props="defaultProps"
                    default-expand-all
                    @node-click="handleNodeClick"
                >
                    <span slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                    </span>
                </el-tree>
            </el-aside>
            <el-main>
                <div class="searchView">
                    <el-form label-width="80px">
                        <el-row>
                            <el-col :span="4">
                                <el-form-item label="年度">
                                    <el-date-picker
                                        v-model="searchForm.year"
                                        placeholder="选择年"
                                        align="center"
                                        type="year"
                                        value-format="yyyy"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-button
                                    icon="el-icon-search"
                                    style="margin-left:15px"
                                    type="primary"
                                    @click.native="handleSearch"
                                    >查询
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="table">
                    <el-tabs v-if="flag === 2" v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="未下达" name="first">
                            <hr />
                            <div class="toolView">
                                <el-button size="small" type="text" @click="showDepartDialog(1)">下达部门</el-button>
                                <el-button size="small" type="text" @click="showDepartDialog(0)">下达财政</el-button>
                            </div>
                            <el-table
                                ref="multipleOpinionTableOne"
                                :data="opinionTableData"
                                border
                                height="300"
                                highlight-current-row
                                stripe
                            >
                                <el-table-column type="selection" width="55"> </el-table-column>
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <el-table-column align="center" label="年度" prop="year"></el-table-column>
                                <el-table-column align="center" label="意见分类" prop="classifyName"></el-table-column>
                                <el-table-column align="center" label="意见报告" prop="reportName">
                                    <template slot-scope="scope">
                                        <el-dropdown @command="handleCommand($event, scope.row)">
                                            <span class="el-dropdown-link">
                                                <span>{{ scope.row.reportName }}</span>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="view" icon="el-icon-view"
                                                    >查看
                                                </el-dropdown-item>
                                                <el-dropdown-item command="download" icon="el-icon-download"
                                                    >下载
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
                            </el-table>
                            <!--分页-->
                            <div class="pagination">
                                <el-pagination
                                    :current-page.sync="pageNo"
                                    :total="total"
                                    background
                                    layout="total, prev, pager, next"
                                    @current-change="handleCurrentChange"
                                >
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="已下达" name="second">
                            <hr />
                            <div class="toolView">
                                <el-button size="small" type="text" @click="cancelSubmit">取消下达</el-button>
                            </div>
                            <el-table
                                ref="multipleOpinionTableTwo"
                                :data="opinionTableData"
                                border
                                height="300"
                                highlight-current-row
                                stripe
                                @row-click="handle"
                            >
                                <el-table-column type="selection" width="55"> </el-table-column>
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <el-table-column align="center" label="年度" prop="year"></el-table-column>
                                <el-table-column align="center" label="意见分类" prop="classifyName"></el-table-column>
                                <el-table-column align="center" label="意见报告" prop="reportName">
                                    <template slot-scope="scope">
                                        <el-dropdown @command="handleCommand($event, scope.row)">
                                            <span class="el-dropdown-link">
                                                <span>{{ scope.row.reportName }}</span>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="view" icon="el-icon-view"
                                                    >查看
                                                </el-dropdown-item>
                                                <el-dropdown-item command="download" icon="el-icon-download"
                                                    >下载
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
                            </el-table>
                            <!--分页-->
                            <div class="pagination">
                                <el-pagination
                                    :current-page.sync="pageNo"
                                    :total="total"
                                    background
                                    layout="total, prev, pager, next"
                                    @current-change="handleCurrentChange"
                                >
                                </el-pagination>
                            </div>
                            <span>整改部门</span>
                            <hr />
                            <!--列表-->
                            <el-table :data="relLogTableData" border highlight-current-row stripe>
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <el-table-column align="center" label="单位名称" prop="unitName"></el-table-column>
                                <el-table-column
                                    :formatter="statusFormatter"
                                    align="center"
                                    label="完成情况"
                                    prop="status"
                                ></el-table-column>
                                <el-table-column align="center" label="反馈报告" prop="feedbackReportName">
                                    <template slot-scope="scope">
                                        <el-dropdown @command="handleCommand($event, scope.row)">
                                            <span class="el-dropdown-link">
                                                <span>{{ scope.row.feedbackReportName }}</span>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="view" icon="el-icon-view"
                                                    >查看
                                                </el-dropdown-item>
                                                <el-dropdown-item command="download" icon="el-icon-download"
                                                    >下载
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="反馈提交时间"
                                    prop="updateTime"
                                ></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="曾经办" name="third">
                            <hr />
                            <el-table
                                :data="opinionTableData"
                                border
                                height="300"
                                highlight-current-row
                                stripe
                                @row-click="handle"
                            >
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <el-table-column align="center" label="年度" prop="year"></el-table-column>
                                <el-table-column align="center" label="意见分类" prop="classifyName"></el-table-column>
                                <el-table-column align="center" label="意见报告" prop="reportName">
                                    <template slot-scope="scope">
                                        <el-dropdown @command="handleCommand($event, scope.row)">
                                            <span class="el-dropdown-link">
                                                <span>{{ scope.row.reportName }}</span>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="view" icon="el-icon-view"
                                                    >查看
                                                </el-dropdown-item>
                                                <el-dropdown-item command="download" icon="el-icon-download"
                                                    >下载
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
                            </el-table>
                            <!--分页-->
                            <div class="pagination">
                                <el-pagination
                                    :current-page.sync="pageNo"
                                    :total="total"
                                    background
                                    layout="total, prev, pager, next"
                                    @current-change="handleCurrentChange"
                                >
                                </el-pagination>
                            </div>
                            <span>整改部门</span>
                            <hr />
                            <!--列表-->
                            <el-table :data="relLogTableData" border highlight-current-row stripe>
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <el-table-column align="center" label="单位名称" prop="unitName"></el-table-column>
                                <el-table-column
                                    :formatter="statusFormatter"
                                    align="center"
                                    label="完成情况"
                                    prop="status"
                                ></el-table-column>
                                <el-table-column align="center" label="反馈报告" prop="feedbackReportName">
                                    <template slot-scope="scope">
                                        <el-dropdown @command="handleCommand($event, scope.row)">
                                            <span class="el-dropdown-link">
                                                <span>{{ scope.row.feedbackReportName }}</span>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="view" icon="el-icon-view"
                                                    >查看
                                                </el-dropdown-item>
                                                <el-dropdown-item command="download" icon="el-icon-download"
                                                    >下载
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="反馈提交时间"
                                    prop="updateTime"
                                ></el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                    <el-tabs v-if="flag === 1" v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="未下达" name="first">
                            <hr />
                            <div class="toolView">
                                <el-button size="small" type="text" @click="showDepartDialog(1)">下达部门</el-button>
                                <el-button size="small" type="text" @click="showDepartDialog(0)">下达财政</el-button>
                            </div>
                            <el-table
                                ref="multipleOpinionTableThird"
                                :data="opinionTableData"
                                border
                                height="300"
                                highlight-current-row
                                stripe
                            >
                                <el-table-column type="selection" width="55"> </el-table-column>
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <el-table-column align="center" label="年度" prop="year"></el-table-column>
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    align="center"
                                    label="意见内容"
                                    prop="content"
                                >
                                    <template slot-scope="scope">
                                        <el-link @click="showContent(scope.row.content)"
                                            >{{ scope.row.content }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="代表姓名" prop="dbName"></el-table-column>
                                <el-table-column
                                    align="center"
                                    label="意见提交时间"
                                    prop="createTime"
                                ></el-table-column>
                                <el-table-column align="center" label="操作" width="185">
                                    <template slot-scope="scope">
                                        <el-link @click="showDialog(scope.row)"
                                            ><i class="el-icon-view el-icon--right"></i>
                                        </el-link>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--分页-->
                            <div class="pagination">
                                <el-pagination
                                    :current-page.sync="pageNo"
                                    :total="total"
                                    background
                                    layout="total, prev, pager, next"
                                    @current-change="handleCurrentChange"
                                >
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="已下达" name="second">
                            <hr />
                            <div class="toolView">
                                <el-button size="small" type="text" @click="cancelSubmit">取消下达</el-button>
                            </div>
                            <el-table
                                ref="multipleOpinionTableFore"
                                :data="opinionTableData"
                                border
                                height="300"
                                highlight-current-row
                                stripe
                                @row-click="handle"
                            >
                                <el-table-column type="selection" width="55"> </el-table-column>
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <el-table-column align="center" label="年度" prop="year"></el-table-column>
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    align="center"
                                    label="意见内容"
                                    prop="content"
                                >
                                    <template slot-scope="scope">
                                        <el-link @click="showContent(scope.row.content)"
                                            >{{ scope.row.content }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="代表姓名" prop="dbName"></el-table-column>
                                <el-table-column
                                    align="center"
                                    label="意见提交时间"
                                    prop="createTime"
                                ></el-table-column>
                                <el-table-column align="center" label="操作" width="185">
                                    <template slot-scope="scope">
                                        <el-link @click="showDialog(scope.row)"
                                            ><i class="el-icon-view el-icon--right"></i>
                                        </el-link>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--分页-->
                            <div class="pagination">
                                <el-pagination
                                    :current-page.sync="pageNo"
                                    :total="total"
                                    background
                                    layout="total, prev, pager, next"
                                    @current-change="handleCurrentChange"
                                >
                                </el-pagination>
                            </div>
                            <span>整改部门</span>
                            <hr />
                            <!--列表-->
                            <el-table :data="relLogTableData" border highlight-current-row stripe>
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <el-table-column align="center" label="单位名称" prop="unitName"></el-table-column>
                                <el-table-column
                                    :formatter="statusFormatter"
                                    align="center"
                                    label="完成情况"
                                    prop="status"
                                ></el-table-column>
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    align="center"
                                    label="反馈意见内容"
                                    prop="feedbackContent"
                                >
                                    <template slot-scope="scope">
                                        <el-link @click="showContent(scope.row.feedbackContent)"
                                            >{{ scope.row.feedbackContent }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="反馈提交时间"
                                    prop="updateTime"
                                ></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="曾经办" name="third">
                            <hr />
                            <el-table
                                ref="multipleTable"
                                :data="opinionTableData"
                                border
                                height="300"
                                highlight-current-row
                                stripe
                                @row-click="handle"
                            >
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <el-table-column align="center" label="年度" prop="year"></el-table-column>
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    align="center"
                                    label="意见内容"
                                    prop="content"
                                >
                                    <template slot-scope="scope">
                                        <el-link @click="showContent(scope.row.content)"
                                            >{{ scope.row.content }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="代表姓名" prop="dbName"></el-table-column>
                                <el-table-column
                                    align="center"
                                    label="意见提交时间"
                                    prop="createTime"
                                ></el-table-column>
                                <el-table-column align="center" label="操作" width="185">
                                    <template slot-scope="scope">
                                        <el-link @click="showDialog(scope.row)"
                                            ><i class="el-icon-view el-icon--right"></i>
                                        </el-link>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--分页-->
                            <div class="pagination">
                                <el-pagination
                                    :current-page.sync="pageNo"
                                    :total="total"
                                    background
                                    layout="total, prev, pager, next"
                                    @current-change="handleCurrentChange"
                                >
                                </el-pagination>
                            </div>
                            <span>整改部门</span>
                            <hr />
                            <!--列表-->
                            <el-table :data="relLogTableData" border highlight-current-row stripe>
                                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                                <el-table-column align="center" label="单位名称" prop="unitName"></el-table-column>
                                <el-table-column
                                    :formatter="statusFormatter"
                                    align="center"
                                    label="完成情况"
                                    prop="status"
                                ></el-table-column>
                                <el-table-column
                                    :show-overflow-tooltip="true"
                                    align="center"
                                    label="反馈意见内容"
                                    prop="feedbackContent"
                                >
                                    <template slot-scope="scope">
                                        <el-link @click="showContent(scope.row.feedbackContent)"
                                            >{{ scope.row.feedbackContent }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="反馈提交时间"
                                    prop="updateTime"
                                ></el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-main>
            <el-dialog
                :close-on-click-modal="false"
                :visible.sync="showDepartVisible"
                title="指定整改部门"
                width="750px"
            >
                <div class="searchView">
                    <el-form label-width="80px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="部门名称">
                                    <el-input
                                        v-model="searchDepartForm.departName"
                                        clearable
                                        placeholder="请输入部门名称"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-button
                                    icon="el-icon-search"
                                    style="margin-left:15px"
                                    type="primary"
                                    @click.native="handleSearchDepart"
                                    >查询
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <el-table
                    ref="multipleDepartTable"
                    :row-key="getRowKey"
                    :data="departTableData"
                    border
                    height="300"
                    highlight-current-row
                    stripe
                >
                    <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                    <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
                    <el-table-column align="center" label="代码" prop="code"></el-table-column>
                    <el-table-column align="center" label="名称" prop="name"></el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showDepartVisible = false">取消</el-button>
                    <el-button type="primary" @click="relSubmit">确定</el-button>
                </div>
            </el-dialog>
            <el-dialog :close-on-click-modal="false" :visible.sync="showContentVisible" title="内容" width="500px">
                <el-input
                    v-model="content"
                    :autosize="{ minRows: 10, maxRows: 20 }"
                    placeholder="请输入内容"
                    type="textarea"
                >
                </el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="showContentVisible = false">关闭</el-button>
                </div>
            </el-dialog>
            <el-dialog :close-on-click-modal="false" :visible.sync="showFormVisible" width="850px">
                <el-form ref="editForm" :model="showForm" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="代表姓名" prop="name">
                                <el-input v-model="showForm.userInfo.name" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="基本构成" prop="jbgc">
                                <el-input v-model="showForm.userInfo.jbgc" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="性别" prop="sex">
                                <el-select v-model="showForm.userInfo.sex" disabled>
                                    <el-option
                                        v-for="item in sexOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系电话" prop="phone">
                                <el-input v-model="showForm.userInfo.phone" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="现任职务" prop="position">
                                <el-input v-model="showForm.userInfo.position" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="所在单位" prop="departmentName">
                                <el-input v-model="showForm.userInfo.departmentName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="意见分类" prop="OpinionClassify">
                                <el-select v-model="showForm.classifyId" placeholder="请选择">
                                    <el-option
                                        v-for="item in classifyOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="具体意见" prop="content">
                                <el-input
                                    v-model="showForm.content"
                                    :autosize="{ minRows: 5, maxRows: 20 }"
                                    placeholder="请输入内容"
                                    type="textarea"
                                >
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="联名代表" prop="lmdb">
                                <el-select v-model="showForm.jointly" disabled filterable multiple placeholder=" ">
                                    <el-option
                                        v-for="item in dbTableData"
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
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showFormVisible = false">取消</el-button>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>
<script>
export default {
    data() {
        return {
            _databaseId: '',
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            userId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            folderList: [],
            defaultProps: {
                children: 'children',
                label: 'name',
                parentId: 'parentId'
            },
            searchForm: {
                year: ''
            },
            flag: 2,
            classifyId: 2,
            opinionTableData: [],
            relLogTableData: [],
            pageNo: 1,
            total: 0,
            showContentVisible: false,
            content: '',
            showFormVisible: false,
            showForm: {
                id: null,
                content: '',
                classifyId: null,
                jointly: null,
                userInfo: {}
            },
            classifyOptions: [],
            sexOptions: [
                {
                    id: 1,
                    name: '男'
                },
                {
                    id: 2,
                    name: '女'
                }
            ],
            activeName: 'first',
            status: 0,
            jb: null,
            showDepartVisible: false,
            departTableData: [],
            searchDepartForm: {
                departName: ''
            },
            opinionIds: '',
            dbTableData: []
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.getDbOpinionClassify()
        this.queryByPage()
        this.getDbList()
    },
    methods: {
        getDbList() {
            let that = this
            that.$axios.get('cloud/entrance/getDbList').then(res => {
                if (res.data.code === 200) {
                    that.dbTableData = res.data.data
                }
            })
        },
        getDbOpinionClassify() {
            let that = this
            that.$axios.get('cloud/entrance/getDbOpinionClassify').then(res => {
                if (res.data.code === 200) {
                    that.folderList = res.data.data
                }
            })
        },
        getDbOpinionClassify1() {
            let that = this
            const params = {
                flag: 1,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbOpinionClassify', { params }).then(res => {
                if (res.data.code === 200) {
                    that.classifyOptions = res.data.data
                }
            })
        },
        handleNodeClick(data) {
            this.opinionTableData = []
            this.relLogTableData = []
            this.flag = data.flag
            if (data.parentId) {
                this.classifyId = data.id
            } else {
                this.classifyId = data.children[0].id
            }
            if (this.flag === 2) {
                this.searchForm.content = null
            }
            this.queryByPage()
        },
        queryByPage() {
            let that = this
            const params = {
                pageNo: this.pageNo,
                userId: this.userId,
                flag: this.flag,
                classifyId: this.classifyId,
                range: this.searchForm.range,
                content: this.searchForm.content,
                year: this.searchForm.year,
                status: this.status,
                jb: this.jb,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbOpinionList', { params }).then(res => {
                if (res.data.code === 200) {
                    that.opinionTableData = res.data.data.list
                    that.total = res.data.data.total
                }
            })
        },
        handleClick(tab, event) {
            this.pageNo = 1
            this.year = null
            this.relLogTableData = []
            if (tab.name === 'first') {
                this.activeName = 'first'
                this.status = 0
                this.jb = null
                this.queryByPage()
            } else if (tab.name === 'second') {
                this.activeName = 'second'
                this.status = 2
                this.jb = null
                this.queryByPage()
            } else {
                this.activeName = 'third'
                this.status = null
                this.jb = 'jb'
                this.queryByPage()
            }
        },
        handleCommand(command, row) {
            let url
            let fileName
            if (row.reportUrl) {
                url = row.reportUrl
            } else {
                url = row.feedbackReportUrl
            }
            if (row.reportName) {
                fileName = row.reportName
            } else {
                fileName = row.feedbackReportName
            }
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
        handleCurrentChange(val) {
            this.queryByPage()
        },
        handleSearch() {
            this.pageNo = 1
            this.queryByPage()
        },
        showDepartDialog(relFlag) {
            if (this.$refs.multipleDepartTable) {
                this.$refs.multipleDepartTable.clearSelection()
            }
            let _selectData
            if (this.flag === 2) {
                _selectData = this.$refs.multipleOpinionTableOne.selection
            } else {
                _selectData = this.$refs.multipleOpinionTableThird.selection
            }

            if (_selectData.length <= 0) {
                this.$message({
                    message: '请选择代表意见',
                    type: 'warning'
                })
                return
            }
            let opinionIdArray = []
            for (let i = 0; i < _selectData.length; i++) {
                opinionIdArray.push(_selectData[i].id)
            }
            this.opinionIds = opinionIdArray.join(',')
            if (relFlag === 1) {
                this.queryDepart()
                this.showDepartVisible = true
            } else {
                //下达财政
                let param = {
                    opinionIds: this.opinionIds,
                    userId: this.userId,
                    companyId: this.companyId,
                    _databaseId: this._databaseId
                }
                let that = this
                that.$axios.post('cloud/authority/addRelLog', param).then(res => {
                    if (res.data.code === 200) {
                        that.$message.success('下达成功')
                        that.pageNo = 1
                        that.queryByPage()
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            }
        },
        queryDepart() {
            let that = this
            const params = {
                name: this.searchDepartForm.departName,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getRelDepartList', { params }).then(res => {
                if (res.data.code === 200) {
                    that.departTableData = res.data.data
                }
            })
        },
        handleSearchDepart() {
            this.queryDepart()
        },
        relSubmit() {
            const _selectData = this.$refs.multipleDepartTable.selection
            if (_selectData.length <= 0) {
                this.$message({
                    message: '请选择下达部门',
                    type: 'warning'
                })
                return
            }
            let departIdArray = []
            for (let i = 0; i < _selectData.length; i++) {
                departIdArray.push(_selectData[i].id)
            }
            const departIds = departIdArray.join(',')
            let param = {
                opinionIds: this.opinionIds,
                departIds: departIds,
                userId: this.userId,
                companyId: this.companyId,
                _databaseId: this._databaseId
            }
            let that = this
            that.$axios.post('cloud/authority/addRelLog', param).then(res => {
                if (res.data.code === 200) {
                    this.showDepartVisible = false
                    that.$message.success('下达成功')
                    that.pageNo = 1
                    that.queryByPage()
                } else {
                    that.$message.error(res.data.message)
                }
            })
        },
        handle(row, event, column) {
            let that = this
            const params = {
                dbOpinionId: row.id,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbOpinionRelLog', { params }).then(res => {
                if (res.data.code === 200) {
                    that.relLogTableData = res.data.data
                }
            })
        },
        statusFormatter(obj) {
            if (obj.status === 1) {
                return '已完成'
            } else {
                return '未完成'
            }
        },
        cancelSubmit() {
            let _selectData
            if (this.flag === 2) {
                _selectData = this.$refs.multipleOpinionTableTwo.selection
            } else {
                _selectData = this.$refs.multipleOpinionTableFore.selection
            }
            if (_selectData.length <= 0) {
                this.$message({
                    message: '请选择代表意见',
                    type: 'warning'
                })
                return
            }
            let opinionIdArray = []
            for (let i = 0; i < _selectData.length; i++) {
                opinionIdArray.push(_selectData[i].id)
            }
            let param = {
                opinionIds: opinionIdArray.join(',')
            }
            let that = this
            this.$confirm('亲，确认要取消下达吗？', '提示', { type: 'warning' }).then(() => {
                that.$axios.post('cloud/authority/deleteRelLog', param).then(res => {
                    if (res.data.code === 200) {
                        that.relLogTableData = []
                        that.$message.success('取消下达成功')
                        that.pageNo = 1
                        that.queryByPage()
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            })
        },
        showContent(content) {
            this.content = content
            this.showContentVisible = true
        },
        //显示编辑界面
        showDialog(row) {
            this.getDbOpinionClassify1()
            this.getUserInfo(row.userId, row)
            this.showFormVisible = true
        },
        getUserInfo(userId, row) {
            let that = this
            const params = {
                id: userId,
                _databaseId: this._databaseId
            }
            that.$axios.get('cloud/entrance/getDbUserInfo', { params }).then(res => {
                if (res.data.code === 200) {
                    that.showForm.userInfo = res.data.data
                    that.showForm.id = row.id
                    that.showForm.content = row.content
                    that.showForm.classifyId = row.classifyId
                    if (row.jointly) {
                        that.showForm.jointly = JSON.parse(row.jointly)
                    } else {
                        that.showForm.jointly = null
                    }
                }
            })
        },
        getRowKey(row) {
            return row.id
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
