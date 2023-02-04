<template>
    <div v-loading="loading">
        <el-container :style="'height:' + (clientHeight - 125) + 'px'">
            <el-main>
                <div class="searchView">
                    <el-form :model="searchForm" label-width="80px">
                        <el-row>
                            <el-col :span="4">
                                <el-form-item label="开始日期">
                                    <el-date-picker
                                        v-model="searchForm.startTime"
                                        value-format="yyyy-MM-dd"
                                        placeholder="起"
                                        align="center"
                                        clearable
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label-width="20px">
                                    <el-date-picker
                                        clearable
                                        v-model="searchForm.endTime"
                                        value-format="yyyy-MM-dd"
                                        placeholder="止"
                                        align="center"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="状态">
                                    <el-select v-model="searchForm.status" clearable>
                                        <el-option
                                            v-for="item in statuss"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="关键字">
                                    <el-input v-model="searchForm.name" clearable placeholder="请输入关键字"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-button
                                type="primary"
                                icon="el-icon-search"
                                @click.native="handleSearch"
                                style="margin-left: 15px"
                                >查询</el-button
                            >
                            <el-button type="primary" @click.native="addShow" style="margin-left: 15px">新增</el-button>
                        </el-row>
                    </el-form>
                </div>
                <div class="table">
                    <!--列表-->
                    <el-table :data="tableData" max-height="500" border stripe>
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="name" label="标的名称" align="center"></el-table-column>
                        <el-table-column prop="code" label="标的编码" align="center"></el-table-column>
                        <el-table-column prop="startTime" label="开始时间" width="160" align="center"></el-table-column>
                        <el-table-column
                            prop="status"
                            label="状态"
                            width="100"
                            align="center"
                            :formatter="statusFormtter"
                        ></el-table-column>
                        <el-table-column
                            prop="createTime"
                            label="创建时间"
                            width="160"
                            align="center"
                        ></el-table-column>
                        <el-table-column label="操作" align="center" width="240">
                            <template slot-scope="scope">
                                <el-button
                                    v-if="scope.row.status == 1"
                                    type="text"
                                    size="small"
                                    @click="updateShow(scope.row)"
                                    >编辑</el-button
                                >
                                <el-button
                                    v-if="scope.row.status == 1"
                                    type="text"
                                    size="small"
                                    @click="deleteSubmit(scope.row)"
                                    >删除</el-button
                                >
                                <el-button type="text" size="small" @click="detailShow(scope.row)">详情</el-button>
                                <el-button
                                    v-if="scope.row.status == 1"
                                    type="text"
                                    size="small"
                                    @click="fabu(scope.row)"
                                    >发布</el-button
                                >
                                <el-button
                                    v-if="scope.row.status == 1"
                                    type="text"
                                    size="small"
                                    @click="fabuyulan(scope.row)"
                                    >发布预览</el-button
                                >
                                <el-button
                                    v-if="scope.row.status == 9"
                                    type="text"
                                    size="small"
                                    @click="printPage(scope.row)"
                                    >打印竞价确认书</el-button
                                >
                                <el-button
                                    v-if="scope.row.status == 9"
                                    type="text"
                                    size="small"
                                    @click="generateWinningBid(scope.row)"
                                    >生成中标公告</el-button
                                >
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
                            :total="total"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-main>
        </el-container>

        <el-dialog
            :visible.sync="addDialog"
            center
            title="新增标的"
            :append-to-body="true"
            width="70%"
            :close-on-click-modal="false"
        >
            <el-form :model="reportForm" :rules="rules" ref="reportForm" label-width="200px">
                <el-tabs v-model="page">
                    <el-tab-pane label="标的信息" name="1">
                        <div style="overflow: auto;" :style="'max-height:' + (clientHeight - 350) + 'px'">
                            <div class="titleView" :style="backgroundColor">关联资产</div>
                            <el-row>
                                <el-col :span="12"
                                    >I
                                    <el-form-item label="关联资产" prop="assetId">
                                        <el-select
                                            v-model="reportForm.applyDetailId"
                                            filterable
                                            @change="assetIdChange"
                                        >
                                            <el-option
                                                v-for="item in assets"
                                                :key="item.apply_detail_id"
                                                :label="item.code + '-' + item.name"
                                                :value="item.apply_detail_id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <div class="titleView" :style="backgroundColor">标的信息</div>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="名称" prop="name">
                                        <el-input
                                            v-model="reportForm.name"
                                            clearable
                                            placeholder="请输入名称"
                                            @change="changeContent"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="年递增率" prop="ndzl">
                                        <el-input
                                            v-model="reportForm.ndzl"
                                            clearable
                                            placeholder="请输入年递增率"
                                            type="number"
                                        >
                                            <template slot="append">%</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="说明" prop="remark">
                                        <el-select v-model="reportForm.remark" filterable placeholder="请选择说明">
                                            <el-option key="1" label="第二年起" value="第二年起"></el-option>
                                            <el-option key="2" label="第三年起" value="第三年起"></el-option>
                                            <el-option key="3" label="第四年起" value="第四年起"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="租期" prop="leaseTime">
                                        <el-input
                                            v-model="reportForm.leaseTime"
                                            type="number"
                                            clearable
                                            @change="changeContent"
                                        >
                                            <template slot="append">月</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="保证金" prop="earnest">
                                        <el-input v-model="reportForm.earnest" type="number" disabled>
                                            <template slot="append">元</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="竞拍周期">
                                        <el-input v-model="reportForm.biddingTime" type="number" disabled>
                                            <template slot="append">分钟</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="延时周期">
                                        <el-input v-model="reportForm.delayTime" type="number" disabled>
                                            <template slot="append">分钟</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="起拍价" prop="startingPrice">
                                        <el-input
                                            v-model="reportForm.startingPrice"
                                            type="number"
                                            @change="startingPriceChange()"
                                        >
                                            <template slot="append">月租金</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="加价幅度" prop="markup">
                                        <el-input
                                            v-model="reportForm.markup"
                                            type="number"
                                            @change="changeContent('markup')"
                                        >
                                            <template slot="append">% ( {{ jjje }} 元)</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="开标时间" prop="startTime">
                                        <el-date-picker
                                            clearable
                                            v-model="reportForm.startTime"
                                            type="datetime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            default-time="09:00:00"
                                            placeholder="开标时间"
                                            align="center"
                                            @change="changeContent('startTime')"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="自动重招">
                                        <el-radio-group v-model="reportForm.cstatus">
                                            <el-radio :label="0">否</el-radio>
                                            <el-radio :label="1">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="优先承租人" prop="prefernum">
                                        <el-input
                                            v-model="reportForm.prefernum"
                                            placeholder="请输入证件号"
                                            clearable
                                            @change="changeContent"
                                        >
                                            <template slot="append">证件号</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="优先承租人" prop="preferName">
                                        <el-input
                                            v-model="reportForm.preferName"
                                            placeholder="请输入姓名/公司名称"
                                            clearable
                                            @change="changeContent"
                                        >
                                            <template slot="append">姓名/公司名称</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="报名截止时间" prop="bidEndTime">
                                        <el-date-picker
                                            clearable
                                            v-model="reportForm.bidEndTime"
                                            type="datetime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="报名截止时间"
                                            align="center"
                                            @change="changeContent"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="竞价规则" prop="bidRule">
                                        <el-input v-model="reportForm.bidRule" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="注意事项" prop="attention">
                                        <el-input type="textarea" v-model="reportForm.attention"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="公告及须知" name="2">
                        <div style="overflow: auto;" :style="'max-height:' + (clientHeight - 350) + 'px'">
                            <div class="titleView" :style="backgroundColor">标的公告</div>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="公告模板" prop="templet">
                                        <el-select v-model="reportForm.templet" filterable @change="templetChange">
                                            <el-option
                                                v-for="item in noticeTemplateTypeOne"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item style="margin-left: -100px;margin-right: 20px;">
                                        <editor
                                            v-if="addDialog"
                                            ref="editor"
                                            id="editor"
                                            v-model="content"
                                            :max-height="250"
                                        ></editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <div class="titleView" :style="backgroundColor">竞拍须知</div>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="竞拍须知模板" prop="templetJpxz">
                                        <el-select
                                            v-model="reportForm.templetJpxz"
                                            filterable
                                            @change="templetJpxzChange"
                                        >
                                            <el-option
                                                v-for="item in noticeTemplateTypeTwo"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item style="margin-left: -100px;margin-right: 20px;">
                                        <editor
                                            v-if="addDialog"
                                            ref="editorTwo"
                                            id="editorTwo"
                                            v-model="jpxzContent"
                                            :max-height="250"
                                        ></editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="submit">保 存 </el-button>
                <el-button size="small" @click="addDialog = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog
            :visible.sync="detailDialog"
            center
            title="标的详情"
            :append-to-body="true"
            width="70%"
            :close-on-click-modal="false"
        >
            <el-form :model="reportForm" :rules="rules" ref="reportForm" label-width="200px" disabled>
                <el-tabs v-model="page">
                    <el-tab-pane label="标的信息" name="1">
                        <div style="overflow: auto;" :style="'max-height:' + (clientHeight - 350) + 'px'">
                            <div class="titleView" :style="backgroundColor">关联资产</div>
                            <el-row>
                                <el-col :span="12"
                                    >I
                                    <el-form-item label="关联资产" prop="assetId">
                                        <el-select
                                            v-model="reportForm.applyDetailId"
                                            filterable
                                            @change="assetIdChange"
                                        >
                                            <el-option
                                                v-for="item in assets"
                                                :key="item.apply_detail_id"
                                                :label="item.code + '-' + item.name"
                                                :value="item.apply_detail_id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <div class="titleView" :style="backgroundColor">标的信息</div>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="名称" prop="name">
                                        <el-input
                                            v-model="reportForm.name"
                                            clearable
                                            placeholder="请输入名称"
                                            @change="changeContent"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="年递增率" prop="ndzl">
                                        <el-input
                                            v-model="reportForm.ndzl"
                                            clearable
                                            placeholder="请输入年递增率"
                                            type="number"
                                        >
                                            <template slot="append">%</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="说明" prop="remark">
                                        <el-select v-model="reportForm.remark" filterable placeholder="请选择说明">
                                            <el-option key="1" label="第二年起" value="第二年起"></el-option>
                                            <el-option key="2" label="第三年起" value="第三年起"></el-option>
                                            <el-option key="3" label="第四年起" value="第四年起"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="租期" prop="leaseTime">
                                        <el-input
                                            v-model="reportForm.leaseTime"
                                            type="number"
                                            clearable
                                            @change="changeContent"
                                        >
                                            <template slot="append">月</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="保证金" prop="earnest">
                                        <el-input v-model="reportForm.earnest" type="number" disabled>
                                            <template slot="append">元</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="竞拍周期">
                                        <el-input v-model="reportForm.biddingTime" type="number" disabled>
                                            <template slot="append">分钟</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="延时周期">
                                        <el-input v-model="reportForm.delayTime" type="number" disabled>
                                            <template slot="append">分钟</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="起拍价" prop="startingPrice">
                                        <el-input
                                            v-model="reportForm.startingPrice"
                                            type="number"
                                            @change="startingPriceChange()"
                                        >
                                            <template slot="append">月租金</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="加价幅度" prop="markup">
                                        <el-input
                                            v-model="reportForm.markup"
                                            type="number"
                                            @change="changeContent('markup')"
                                        >
                                            <template slot="append">% ( {{ jjje }} 元)</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="开标时间" prop="startTime">
                                        <el-date-picker
                                            clearable
                                            v-model="reportForm.startTime"
                                            type="datetime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            default-time="09:00:00"
                                            placeholder="开标时间"
                                            align="center"
                                            @change="changeContent('startTime')"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="自动重招">
                                        <el-radio-group v-model="reportForm.cstatus">
                                            <el-radio :label="0">否</el-radio>
                                            <el-radio :label="1">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="优先承租人" prop="prefernum">
                                        <el-input
                                            v-model="reportForm.prefernum"
                                            placeholder="请输入证件号"
                                            clearable
                                            @change="changeContent"
                                        >
                                            <template slot="append">证件号</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="优先承租人" prop="preferName">
                                        <el-input
                                            v-model="reportForm.preferName"
                                            placeholder="请输入姓名/公司名称"
                                            clearable
                                            @change="changeContent"
                                        >
                                            <template slot="append">姓名/公司名称</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="报名截止时间" prop="bidEndTime">
                                        <el-date-picker
                                            clearable
                                            v-model="reportForm.bidEndTime"
                                            type="datetime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="报名截止时间"
                                            align="center"
                                            @change="changeContent"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="竞价规则" prop="bidRule">
                                        <el-input v-model="reportForm.bidRule" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="注意事项" prop="attention">
                                        <el-input type="textarea" v-model="reportForm.attention"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="公告及须知" name="2">
                        <div style="overflow: auto;" :style="'max-height:' + (clientHeight - 350) + 'px'">
                            <div class="titleView" :style="backgroundColor">标的公告</div>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="公告模板" prop="templet">
                                        <el-select v-model="reportForm.templet" filterable @change="templetChange">
                                            <el-option
                                                v-for="item in noticeTemplateTypeOne"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item style="margin-left: -100px;margin-right: 20px;">
                                        <editor
                                            v-if="detailDialog"
                                            ref="editor"
                                            id="editor"
                                            v-model="content"
                                            :max-height="250"
                                            :enable="false"
                                        ></editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <div class="titleView" :style="backgroundColor">竞拍须知</div>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="竞拍须知模板" prop="templetJpxz">
                                        <el-select
                                            v-model="reportForm.templetJpxz"
                                            filterable
                                            @change="templetJpxzChange"
                                        >
                                            <el-option
                                                v-for="item in noticeTemplateTypeTwo"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item style="margin-left: -100px;margin-right: 20px;">
                                        <editor
                                            v-if="detailDialog"
                                            ref="editorTwo"
                                            id="editorTwo"
                                            v-model="jpxzContent"
                                            :max-height="250"
                                            :enable="false"
                                        ></editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
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
            backgroundColor: {
                background:
                    '' + (localStorage.getItem('color') != 'undefined' ? localStorage.getItem('color') : '#409eff')
            },
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            searchForm: {
                startTime: '',
                endTime: '',
                status: '',
                name: ''
            },
            statuss: [
                { id: '1', name: '待审核' },
                { id: '2', name: '已发布' },
                { id: '7', name: '中止' },
                { id: '8', name: '流标' },
                { id: '9', name: '结标' },
                { id: '10', name: '终止' },
                { id: '11', name: '流标终止' }
            ],
            clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
            tableData: [],
            pageNo: 1,
            total: 0,
            addDialog: false,
            page: '1',
            assets: [],
            noticeTemplateTypeOne: [],
            noticeTemplateTypeTwo: [],
            jpxzContent: {},
            content: {},
            reportForm: {
                id: '',
                assetId: '', //资产id
                name: '', //标的名称
                ndzl: '', //年递增率
                remark: '', //说明
                leaseTime: '', //租期
                earnest: '', //保证金
                biddingTime: 120, //竞拍周期
                delayTime: 5, //延时周期
                startingPrice: '', //起拍价
                markup: '', //加价幅度
                startTime: '', //开标时间
                cstatus: 0, //是否重招
                prefernum: '', //优先承租人证件号
                preferName: '', //优先承租人姓名/公司名称
                bidEndTime: '', //报名截止时间
                bidRule: '至少一人报名且出价不低于起拍价，方可成交，否则按流标处理。', //竞价规则
                attention: '', //注意事项
                code: '', //编码
                content: '', //公告富文本
                jpxzContent: '', //竞拍须知富文本
                templet: '', //公告模板id
                templetJpxz: '', //竞拍须知模板id
                ggHtml: '', //公告html
                xzHtml: '', //须知html
                applyDetailId: '' //招租申请明细id
            },
            rules: {
                assetId: [{ required: true, message: '请选择资产', trigger: 'change' }],
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                ndzl: [{ required: true, message: '请输入年递增率', trigger: 'blur' }],
                leaseTime: [{ required: true, message: '请输入租期', trigger: 'blur' }],
                startingPrice: [{ required: true, message: '请输入起拍价', trigger: 'blur' }],
                startTime: [{ required: true, message: '请选择开标时间', trigger: 'change' }]
            },
            _databaseId: '',
            userId: '',
            userName: '',
            infoData: {},
            yxbhj: '',
            jjje: 0,
            stopTime: '',
            detailDialog: false,
            loading: false
        }
    },
    created() {
        this._databaseId = localStorage.getItem('_databaseId')
        this.userId = localStorage.getItem('userId')
        this.userName = localStorage.getItem('name')
        this.queryByPage()
        this.getNoticeTemplateList('1')
        this.getNoticeTemplateList('2')
        if (this.$history.currentRoute.query.assetsId) {
            this.addShow()
            this.reportForm.assetId = parseInt(this.$history.currentRoute.query.assetsId)
            //this.reportForm.assetId = 7
        }
    },
    methods: {
        //查询公告模板
        getNoticeTemplateList(type) {
            let that = this
            let params = {
                type: type,
                _databaseId: this._databaseId
            }
            that.$axios.post('/cloud/entrance/getNoticeTemplateList', params).then(res => {
                if (res.data.code == 200) {
                    if (type == '1') {
                        that.noticeTemplateTypeOne = res.data.data
                    } else {
                        that.noticeTemplateTypeTwo = res.data.data
                    }
                }
            })
        },
        //查询闲置资产
        queryAssets(containId) {
            let that = this
            let params = {}
            if (containId) {
                params.containId = containId
            }
            that.$axios.post('/cloud/entrance/getEffectiveHireApple', params).then(res => {
                if (res.data.code == 200) {
                    that.assets = res.data.data
                }
            })
        },
        //新增按钮
        addShow() {
            this.queryAssets()
            this.addDialog = true
            if (this.$refs.reportForm) {
                this.$refs.reportForm.resetFields()
            }
            this.jjje = 0
            this.reportForm = {
                id: '',
                assetId: '', //资产id
                name: '', //标的名称
                ndzl: '', //年递增率
                remark: '', //说明
                leaseTime: '', //租期
                earnest: '', //保证金
                biddingTime: 120, //竞拍周期
                delayTime: 5, //延时周期
                startingPrice: '', //起拍价
                markup: 5, //加价幅度
                startTime: '', //开标时间
                cstatus: 0, //是否重招
                prefernum: '', //优先承租人证件号
                preferName: '', //优先承租人姓名/公司名称
                bidEndTime: '', //报名截止时间
                bidRule: '至少一人报名且出价不低于起拍价，方可成交，否则按流标处理。', //竞价规则
                attention: '', //注意事项
                code: '', //编码
                content: '', //公告富文本
                jpxzContent: '', //竞拍须知富文本
                templet: '', //公告模板id
                templetJpxz: '', //竞拍须知模板id
                ggHtml: '', //公告html
                xzHtml: '', //须知html
                applyDetailId: '' //招租申请明细id
            }
            this.content = {}
            this.jpxzContent = {}
            this.page = '1'
            this.reportForm.code = 'BD' + Math.round(Math.random() * 100000000)
        },
        //编辑按钮
        updateShow(row) {
            this.queryAssets(row.applyDetailId)
            this.page = '1'
            this.reportForm.applyDetailId = row.applyDetailId
            this.reportForm.id = row.id
            this.reportForm.assetId = row.assetId
            this.reportForm.name = row.name
            this.reportForm.ndzl = row.ndzl
            this.reportForm.remark = row.remark
            this.reportForm.leaseTime = row.leaseTime
            this.reportForm.earnest = row.earnest
            this.reportForm.biddingTime = row.biddingTime
            this.reportForm.delayTime = row.delayTime
            this.reportForm.startingPrice = row.startingPrice
            this.reportForm.markup = row.markup || null
            this.reportForm.startTime = row.startTime
            this.reportForm.cstatus = row.cstatus
            this.reportForm.prefernum = row.prefernum
            this.reportForm.preferName = row.preferName
            this.reportForm.bidEndTime = row.bidEndTime
            this.reportForm.bidRule = row.bidRule
            this.reportForm.attention = row.attention
            this.reportForm.code = row.code
            this.reportForm.templet = row.templet
            this.reportForm.templetJpxz = row.templetJpxz
            this.reportForm.ggHtml = row.ggHtml
            this.reportForm.xzHtml = row.xzHtml
            this.content = JSON.parse(row.content)
            this.jpxzContent = JSON.parse(row.jpxzContent)
            this.addDialog = true
            this.setJjje()
        },
        // 查看详情
        detailShow(row) {
            this.queryAssets(row.applyDetailId)
            this.page = '1'
            this.reportForm.applyDetailId = row.applyDetailId
            this.reportForm.id = row.id
            this.reportForm.assetId = row.assetId
            this.reportForm.name = row.name
            this.reportForm.ndzl = row.ndzl
            this.reportForm.remark = row.remark
            this.reportForm.leaseTime = row.leaseTime
            this.reportForm.earnest = row.earnest
            this.reportForm.biddingTime = row.biddingTime
            this.reportForm.delayTime = row.delayTime
            this.reportForm.startingPrice = row.startingPrice
            this.reportForm.markup = row.markup || null
            this.reportForm.startTime = row.startTime
            this.reportForm.cstatus = row.cstatus
            this.reportForm.prefernum = row.prefernum
            this.reportForm.preferName = row.preferName
            this.reportForm.bidEndTime = row.bidEndTime
            this.reportForm.bidRule = row.bidRule
            this.reportForm.attention = row.attention
            this.reportForm.code = row.code
            this.reportForm.templet = row.templet
            this.reportForm.templetJpxz = row.templetJpxz
            this.reportForm.ggHtml = row.ggHtml
            this.reportForm.xzHtml = row.xzHtml
            this.content = JSON.parse(row.content)
            this.jpxzContent = JSON.parse(row.jpxzContent)
            this.detailDialog = true
            this.setJjje()
        },
        //资产变化后公告和竞拍须知也发生变化
        assetIdChange(val) {
            let obj = this.assets.find(item => item.apply_detail_id == val)
            let that = this
            that.reportForm.assetId = obj.id
            that.reportForm.leaseTime = obj.lease_time
            that.reportForm.startingPrice = obj.starting_price
            that.reportForm.name = obj.name
            this.startingPriceChange()
            let params = {
                id: obj.id,
                _databaseId: this._databaseId
            }
            that.$axios.post('/cloud/entrance/getInfoById', params).then(res => {
                if (res.data.code == 200) {
                    this.infoData = res.data.data
                }
            })
            this.changeContent()
        },
        //表单的值发生变化后公告和竞拍须知也发生变化
        changeContent(str) {
            if (this.reportForm.templet) {
                this.templetChange(this.reportForm.templet)
            }
            if (this.reportForm.templetJpxz) {
                this.templetJpxzChange(this.reportForm.templetJpxz)
            }
            if (str == 'markup' || str == 'startingPrice') {
                this.setJjje()
            }
            if (this.reportForm.startTime) {
                if (str == 'startTime') {
                    var time = new Date(this.reportForm.startTime)
                    var time1 = new Date(this.reportForm.startTime)
                    this.$set(this.reportForm, 'bidEndTime', this.getYMDHMS(time.setHours(time.getHours() + 1)))
                    this.stopTime = this.getYMDHMS(time.setHours(time1.getHours() + 2))
                }
            }
        },
        getYMDHMS(timestamp) {
            let time = new Date(timestamp)
            let year = time.getFullYear()
            let month = time.getMonth() + 1
            let date = time.getDate()
            let hours = time.getHours()
            let minute = time.getMinutes()
            let second = time.getSeconds()

            if (month < 10) {
                month = '0' + month
            }
            if (date < 10) {
                date = '0' + date
            }
            if (hours < 10) {
                hours = '0' + hours
            }
            if (minute < 10) {
                minute = '0' + minute
            }
            if (second < 10) {
                second = '0' + second
            }
            return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
        },
        getLocalTime(nS) {
            return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ')
        },
        //列表分页切换
        handleCurrentChange(val) {
            this.pageNo = val
            this.queryByPage()
        },
        //查询按钮
        handleSearch() {
            this.pageNo = 1
            this.queryByPage()
        },
        //起拍价变动事件  计算保证金
        startingPriceChange() {
            let money = this.accMul(this.reportForm.startingPrice, 12)
            if (money <= 1000) {
                this.reportForm.earnest = 500
            } else if (1000 < money && money <= 5000) {
                this.reportForm.earnest = 1000
            } else if (5000 < money && money <= 10000) {
                this.reportForm.earnest = 5000
            } else if (10000 < money && money <= 50000) {
                this.reportForm.earnest = 10000
            } else if (50000 < money && money <= 100000) {
                this.reportForm.earnest = 20000
            } else if (100000 < money) {
                this.reportForm.earnest = 30000
            }
            this.yxbhj = this.accMul(this.reportForm.startingPrice, 1.3)
            this.changeContent('startingPrice')
        },
        // 公告模板下拉框变化事件
        templetChange(val) {
            let that = this
            let params = {
                id: val,
                _databaseId: this._databaseId
            }
            that.$axios.post('/cloud/entrance/getNoticeTemplateById', params).then(res => {
                if (res.data.code == 200) {
                    this.content = JSON.parse(this.tihuan(res.data.data.content))
                    this.$refs.editor.quill.setContents(this.content)
                }
            })
        },
        // 竞拍须知下拉框变化事件
        templetJpxzChange(val) {
            let that = this
            let params = {
                id: val,
                _databaseId: this._databaseId
            }
            that.$axios.post('/cloud/entrance/getNoticeTemplateById', params).then(res => {
                if (res.data.code == 200) {
                    this.jpxzContent = JSON.parse(this.tihuan(res.data.data.content))
                    this.$refs.editorTwo.quill.setContents(this.jpxzContent)
                }
            })
        },
        //富文本替换
        tihuan(str) {
            str = this.replaceAll(str, '${TARGET_NAME}', this.reportForm.name)
            str = this.replaceAll(str, '${LEASE_TIME}', this.reportForm.leaseTime)
            str = this.replaceAll(str, '${START_TIME}', this.reportForm.startTime)
            str = this.replaceAll(str, '${EARNEST}', this.reportForm.earnest)
            str = this.replaceAll(str, '${STARTING_PRICE}', this.reportForm.startingPrice)
            str = this.replaceAll(str, '${MARKUP}', this.jjje)
            str = this.replaceAll(str, '${ASSET_OWNER}', this.infoData.owner)
            str = this.replaceAll(str, '${PREFER_BIDDER}', this.reportForm.preferName)
            str = this.replaceAll(str, '${TARGET_CODE}', this.reportForm.code)
            str = this.replaceAll(str, '${STOP_TIME}', this.stopTime)
            str = this.replaceAll(str, '${GETMONEY_TIME}', this.jssj(this.reportForm.startTime, 5))
            str = this.replaceAll(str, '${RELEASE_TIME}', this.jsDateFormatter(new Date()))
            str = this.replaceAll(str, '${FROZEN_PRICE}', Math.round(this.yxbhj))
            str = this.replaceAll(str, '${SENDMONEY_TIME}', this.jssj(this.reportForm.startTime, 7))
            return str
        },
        //日期加上指定天数后的日期
        jssj(time, days) {
            if (time) {
                return this.dateChange(days, time.split(' ')[0]) + ' ' + time.split(' ')[1]
            }
        },
        //日期加上指定天数后的日期
        dateChange(num, date) {
            if (!date) {
                date = new Date() //没有传入值时,默认是当前日期
                date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            }
            date += ' 00:00:00' //设置为当天凌晨12点
            date = Date.parse(new Date(date)) / 1000 //转换为时间戳
            date += 86400 * num //修改后的时间戳
            var newDate = new Date(parseInt(date) * 1000) //转换为时间
            return newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
        },
        //乘法运算
        accMul(arg1, arg2) {
            var m = 0,
                s1 = arg1.toString(),
                s2 = arg2.toString()
            try {
                m += s1.split('.')[1].length
            } catch (e) {}
            try {
                m += s2.split('.')[1].length
            } catch (e) {}
            return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
        },
        //获取系统时间日期
        jsDateFormatter(date) {
            var seperator1 = '-'
            var seperator2 = ':'
            var month = date.getMonth() + 1
            var strDate = date.getDate()
            if (month >= 1 && month <= 9) {
                month = '0' + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            // +
            // ' ' +
            // date.getHours() +
            // seperator2 +
            // date.getMinutes() +
            // seperator2 +
            // date.getSeconds()
            return currentdate
        },
        //字符串替换全部指定字符串
        replaceAll(source_text, find_text, replace_text) {
            var i = 0
            while (source_text.indexOf(find_text, i) != -1) {
                source_text = source_text.replace(find_text, replace_text)
                i = source_text.indexOf(find_text, i)
            }
            return source_text
        },
        //提交报告
        submit() {
            let that = this
            this.$refs.reportForm.validate(valid => {
                if (valid) {
                    this.reportForm._databaseId = this._databaseId
                    let text = ''
                    let url = ''
                    if (this.reportForm.id) {
                        text = '编辑'
                        url = 'updateHireInfo'
                    } else {
                        text = '新增'
                        url = 'insertHireInfo'
                    }
                    this.reportForm.content = JSON.stringify(this.content)
                    this.reportForm.jpxzContent = JSON.stringify(this.jpxzContent)

                    if (!this.isNull(this.getText(document.querySelector('#editor').innerHTML))) {
                        this.reportForm.ggHtml = document.querySelector('#editor .ql-editor').innerHTML
                    }
                    if (!this.isNull(this.getText(document.querySelector('#editorTwo').innerHTML))) {
                        this.reportForm.xzHtml = document.querySelector('#editorTwo .ql-editor').innerHTML
                    }
                    that.$axios.post('cloud/entrance/' + url, that.reportForm).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success(text + '成功')
                            that.addDialog = false
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            })
        },
        //富文本去除非内容的字符
        getText(str) {
            return str.replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '')
        },
        //非空判断
        isNull(str) {
            if (str == '') return true
            var regu = '^[ ]+$'
            var re = new RegExp(regu)
            return re.test(str)
        },
        //查询列表
        queryByPage() {
            let that = this
            const params = {
                pageNo: this.pageNo,
                startTime: this.searchForm.startTime,
                endTime: this.searchForm.endTime,
                status: this.searchForm.status,
                name: this.searchForm.name,
                _databaseId: this._databaseId
            }
            that.$axios.post('/cloud/entrance/getHireInfoList', params).then(res => {
                if (res.data.code == 200) {
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
                }
            })
        },
        // 删除报告
        deleteSubmit(row) {
            let that = this
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' })
                .then(() => {
                    let params = {
                        id: row.id,
                        _databaseId: this._databaseId
                    }
                    that.$axios.post('cloud/entrance/deleteHireInfo', params).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('删除成功')
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                })
                .catch(() => {})
        },
        //状态回显
        statusFormtter(row) {
            if (row.status === 1) {
                return '待审核'
            } else if (row.status === 2) {
                return '已发布'
            } else if (row.status === 7) {
                return '中止'
            } else if (row.status === 8) {
                return '流标'
            } else if (row.status === 9) {
                return '结标'
            } else if (row.status === 10) {
                return '终止'
            } else if (row.status === 11) {
                return '流标终止'
            }
        },
        //发布
        fabu(row) {
            let that = this
            this.$confirm('亲，确认要发布吗？', '提示', { type: 'warning' })
                .then(() => {
                    let params = {
                        id: row.id,
                        assetId: row.assetId,
                        templet: row.templet,
                        templetJpxz: row.templetJpxz,
                        _databaseId: this._databaseId
                    }

                    let load = this.$loading({
                        lock: true,
                        text: '正在发布...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    })

                    that.$axios.post('cloud/entrance/fabuHireInfo', params).then(res => {
                        if (res.data.code == 200) {
                            that.$message.success('发布成功')
                            that.queryByPage()
                        } else {
                            that.$message.error(res.data.message)
                        }
                        load.close()
                    })
                })
                .catch(() => {})
        },
        //发布预览
        fabuyulan(row) {
            this.$history.push({
                path: '/runCode?path=fbylPage&title=发布预览&id=' + row.id + '&assetId=' + row.assetId
            })
        },
        printPage(row) {
            this.$history.push({
                path: '/runCode?path=printPage&title=打印竞价确认书&id=' + row.id + '&assetId=' + row.assetId
            })
        },

        // 生成中标公告
        generateWinningBid(row) {
            let load = this.$loading({
                lock: true,
                text: '正在导出...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            let params = {
                id: row.id,
                company_id: localStorage.getItem('companyId')
            }
            let fileName = row.company_alias + '发布第' + row.year_period + '期房产中标公告——中标公告.docx'
            this.$axios.post('cloud/download/generateWinningBid', params, { responseType: 'blob' }).then(res => {
                let content = res.data
                let blob = new Blob([content])
                if ('download' in document.createElement('a')) {
                    // 非IE下载
                    let elink = document.createElement('a')
                    elink.download = fileName
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(blob)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob, fileName)
                }
                load.close()
            })
        },

        // 设置加价金额
        setJjje() {
            this.jjje = Math.round(this.accMul(this.reportForm.startingPrice, this.reportForm.markup / 100))
        }
    }
}
</script>
<style scoped>
.el-main {
    border-left: 0px solid #e5e9f2;
    padding: 0px;
    margin-left: 15px;
}
.el-table__body tr.current-row td:not(.is-center) {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
}
.titleView {
    height: 40px;
    line-height: 40px;
    color: #ffffff;
    font-size: 20px;
    padding: 0 20px;
    margin: 15px;
}
</style>
