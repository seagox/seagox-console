<template>
	<div class="container">
		<el-steps :active="active" finish-status="success" align-center>
			<el-step title="基础设置"></el-step>
			<el-step title="表头设置"></el-step>
			<el-step title="数据源设置"></el-step>
			<el-step title="搜索条件"></el-step>
		</el-steps>
		<el-form
			:model="form"
			:rules="rules"
			ref="ruleForm"
			label-width="100px"
			style="margin-top:20px;"
			v-show="active === 0"
		>
			<el-col :span="12">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="form.name" placeholder="请输入名称"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="图标" prop="icon">
                    <div class="inside-input">
                        <div class="iconView">
                            <div v-html="form.icon"></div>
                        </div>
                        <i class="el-icon-document-copy iconE" @click="handleIconDialog"></i>
                    </div>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="颜色" prop="color">
					<el-color-picker v-model="form.color" :predefine="predefine"></el-color-picker>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="数据模型" prop="tableId">
					<el-select v-model="form.tableId" filterable placeholder="请选择数据模型">
						<el-option
							v-for="item in tableOptions"
							:key="item.id"
							:label="item.remark + ' - ' + item.name"
							:value="item.id"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="24">
				<el-form-item label="流程">
					<el-select v-model="form.flowId" filterable placeholder="请选择流程" clearable>
						<el-option v-for="item in flowOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="24">
				<el-form-item label="导出模版">
					<el-upload
						:limit="1"
						:action="action"
						:headers="headers"
						:file-list="form.listExportPath"
						list-type="picture-card"
						:before-upload="beforeUpload"
						:class="form.listExportPath.length === 1 ? 'upload-disabled' : ''"
						:on-success="
							(res, file, fileList) => {
								return handleFileSuccess(res, file, fileList)
							}
						"
					>
						<i class="el-icon-plus"></i>
						<div slot="file" slot-scope="{ file }">
							<img class="el-upload-list__item-thumbnail" src="@/assets/fileType/excel.svg" />
							<span class="el-upload-list__item-actions">
								<span class="el-upload-list__item-delete" @click="handleFileDownload(file)">
									<i class="el-icon-download"></i>
								</span>
								<span class="el-upload-list__item-delete" @click="handleFileRemove(file)">
									<i class="el-icon-delete"></i>
								</span>
							</span>
						</div>
					</el-upload>
				</el-form-item>
			</el-col>
		</el-form>
		<div v-show="active === 1">
			<div class="toolView">
				<el-button icon="el-icon-plus" @click="showTableHeaderAddDialog" size="small">新增</el-button>
			</div>
			<div class="table" style="margin-top:10px">
				<el-table
					:data="tableHeaderData"
					border
					highlight-current-row
					stripe
					row-key="id"
					:tree-props="{ children: 'children' }"
				>
					<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
					<el-table-column prop="label" label="标题" align="center"></el-table-column>
					<el-table-column prop="prop" label="字段名" align="center"></el-table-column>
					<el-table-column prop="width" label="宽度" align="center"></el-table-column>
					<el-table-column label="锁定" align="center" :formatter="lockingFormatter"></el-table-column>
					<el-table-column label="汇总" align="center" :formatter="summaryFormatter"></el-table-column>
					<el-table-column label="合计" align="center" :formatter="totalFormatter"></el-table-column>
					<el-table-column prop="sort" label="排序" align="center"></el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="showTableHeaderEditDialog(scope.$index, scope.row)">编辑</el-button>
							<el-divider direction="vertical"></el-divider>
							<el-button type="text" size="small" @click="tableHeaderDelSubmit(scope.$index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<el-form :model="form" label-width="30px" style="margin-top:15px" v-show="active === 2">
			<div class="source">
				<el-tag v-for="tag in tags" :key="tag" class="tag" @click="insertCode(tag)">
					{{ tag }}
				</el-tag>
			</div>
			<el-form-item>
				<codemirrorXml ref="codemirror" v-model="form.dataSource" v-if="active === 2" placeholder="请输入SQL" :height="height"/>
			</el-form-item>
		</el-form>
		<div v-show="active === 3">
			<div class="toolView">
				<el-button icon="el-icon-plus" @click="showSearchAddDialog" size="small">新增</el-button>
			</div>
			<div class="table">
				<el-table :data="searchTableData" border highlight-current-row stripe max-height="500">
					<el-table-column prop="field" label="字段" align="center"></el-table-column>
					<el-table-column prop="type" label="类型" align="center" :formatter="typeFormatter"></el-table-column>
					<el-table-column prop="desc" label="说明" align="center"></el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" @click="showSearchEditDialog(scope.$index, scope.row)" size="small"
								>编辑</el-button
							>
							<el-divider direction="vertical"></el-divider>
							<el-button type="text" @click="searchDelSubmit(scope.$index)" size="small">删除</el-button>
							<el-divider direction="vertical"></el-divider>
							<el-button type="text" @click="moveUp(scope.$index)" size="small">上移</el-button>
							<el-divider direction="vertical"></el-divider>
							<el-button type="text" @click="moveDown(scope.$index)" size="small">下移</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div style="margin-top:15px;float:right;">
			<el-button @click="handleLast" v-if="active != 0">上一步</el-button>
			<el-button type="primary" @click="handleNext" v-if="active != 3">下一步</el-button>
			<el-button type="primary" @click="submitForm">保存</el-button>
		</div>
		<!--图标选择界面-->
        <el-dialog title="图标选择" width="950px" :visible.sync="iconFormVisible" :close-on-click-modal="false">
			<el-form label-width="65px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="名称">
							<el-input v-model="searchIconName" clearable placeholder="请输入名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="3">
						<el-button
							type="primary"
							icon="el-icon-search"
							@click.native="handleCurrentChange"
							style="margin-left: 15px"
						>查询</el-button
						>
					</el-col>
				</el-row>
			</el-form>
            <el-scrollbar style="height:100%">
                <el-row>
                    <el-col
                        :span="4"
                        v-for="(item, index) in iconData"
                        :key="index"
                        style="margin-bottom: 15px; cursor: pointer;padding-right:15px;box-sizing:border-box"
                    >
                        <el-card shadow="hover">
                            <div @click="handleIconClick(item)" style="display:flex;align-items: center;">
                                <i v-html="item.content" style="display:flex;align-items: center;"></i>
                                <span style="margin-left:15px;">{{ item.name }}</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-scrollbar>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :current-page.sync="pageNo"
                    :page-size.sync="pageSize"
                    :total="total"
                >
                </el-pagination>
            </div>
        </el-dialog>
		<!--新增表头界面-->
		<el-dialog title="新增" width="750px" :visible.sync="addTableHeaderVisible" :close-on-click-modal="false">
			<el-form :model="addTableHeaderForm" label-width="80px" :rules="tableHeaderRules" ref="addTableHeaderForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="字段名" prop="prop">
							<el-input v-model="addTableHeaderForm.prop" placeholder="请输入字段名"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="标题" prop="label">
							<el-input v-model="addTableHeaderForm.label" placeholder="请输入标题"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上级" prop="parentId">
							<el-cascader
								v-model="addTableHeaderForm.parentId"
								:options="parentOptions"
								:props="{ checkStrictly: true, emitPath: false, value: 'id' }"
								clearable
								placeholder="请选择上级"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="宽度" prop="width">
							<el-input-number
								v-model="addTableHeaderForm.width"
								:controls="false"
								:precision="0"
								placeholder="请输入宽度"
							></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="锁定" prop="locking">
							<el-select v-model="addTableHeaderForm.locking">
								<el-option label="左" :value="1"></el-option>
								<el-option label="右" :value="2"></el-option>
								<el-option label="无" :value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="数据对象" prop="target">
							<el-select v-model="addTableHeaderForm.target">
								<el-option label="无" :value="0"></el-option>
								<el-option label="数据字典" :value="1"></el-option>
								<el-option label="区域数据" :value="2"></el-option>
								<el-option label="图片数据" :value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="addTableHeaderForm.target === 1">
						<el-form-item label="格式化" prop="formatter">
							<el-select
								v-model="addTableHeaderForm.formatter"
								placeholder="请选择数据源"
								clearable
								@change="formatterChange"
							>
								<el-option
									v-for="item in formatterOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序号" prop="sort">
							<el-input-number v-model="addTableHeaderForm.sort"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="汇总" prop="summary">
							<el-switch v-model="addTableHeaderForm.summary" :active-value="1" :inactive-value="2"> </el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="合计" prop="total">
							<el-switch v-model="addTableHeaderForm.total" :active-value="1" :inactive-value="2"> </el-switch>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addTableHeaderVisible = false">取消</el-button>
				<el-button type="primary" @click="addTableHeaderSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑表头界面-->
		<el-dialog title="编辑" width="750px" :visible.sync="editTableHeaderVisible" :close-on-click-modal="false">
			<el-form :model="editTableHeaderForm" label-width="80px" :rules="tableHeaderRules" ref="editTableHeaderForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="字段名" prop="prop">
							<el-input v-model="editTableHeaderForm.prop" placeholder="请输入字段名"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="标题" prop="label">
							<el-input v-model="editTableHeaderForm.label" placeholder="请输入标题"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上级" prop="parentId">
							<el-cascader
								v-model="editTableHeaderForm.parentId"
								:options="parentOptions"
								:props="{ checkStrictly: true, emitPath: false, value: 'id' }"
								clearable
								placeholder="请选择上级"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="宽度" prop="width">
							<el-input-number
								v-model="editTableHeaderForm.width"
								:controls="false"
								:precision="0"
								placeholder="请输入宽度"
							></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="锁定" prop="locking">
							<el-select v-model="editTableHeaderForm.locking">
								<el-option label="左" :value="1"></el-option>
								<el-option label="右" :value="2"></el-option>
								<el-option label="无" :value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="数据对象" prop="target">
							<el-select v-model="editTableHeaderForm.target">
								<el-option label="无" :value="0"></el-option>
								<el-option label="数据字典" :value="1"></el-option>
								<el-option label="区域数据" :value="2"></el-option>
								<el-option label="图片数据" :value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="editTableHeaderForm.target === 1">
						<el-form-item label="格式化" prop="formatter">
							<el-select
								v-model="editTableHeaderForm.formatter"
								placeholder="请选择数据源"
								clearable
								@change="formatterChange"
							>
								<el-option
									v-for="item in formatterOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序号" prop="sort">
							<el-input-number v-model="editTableHeaderForm.sort"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="汇总" prop="summary">
							<el-switch v-model="editTableHeaderForm.summary" :active-value="1" :inactive-value="2"> </el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="合计" prop="total">
							<el-switch v-model="editTableHeaderForm.total" :active-value="1" :inactive-value="2"> </el-switch>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editTableHeaderVisible = false">取消</el-button>
				<el-button type="primary" @click="editTableHeaderSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!-- 新增搜索页面 -->
		<el-dialog title="新增" width="500px" :visible.sync="addSearchVisible" :close-on-click-modal="false">
			<el-form :model="addSearchForm" label-width="80px" :rules="searchRules" ref="addSearchForm">
				<el-form-item label="字段" prop="field">
					<el-input v-model="addSearchForm.field" placeholder="请输入字段"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-select v-model="addSearchForm.type" placeholder="请选择类型">
						<el-option
							v-for="item in typeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="说明" prop="desc">
					<el-input
						v-model="addSearchForm.desc"
						placeholder="请输入说明"
						maxlength="5"
						show-word-limit
					></el-input>
				</el-form-item>
				<el-form-item label="占位提示">
					<el-input
							v-model="addSearchForm.placeholder"
							placeholder="请输入占位提示"
							show-word-limit
					></el-input>
				</el-form-item>
				<el-form-item label="数据源" prop="source" filterable v-if="addSearchForm.type === 'select'">
					<el-select
						v-model="addSearchForm.source"
						placeholder="请选择数据源"
						clearable
						@change="sourceChange"
						filterable
					>
						<el-option v-for="item in formatterOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="是否多选"
					v-if="
						addSearchForm.type === 'select' ||
							addSearchForm.type === 'company' ||
							addSearchForm.type === 'department'
					"
				>
					<el-switch v-model="addSearchForm.multiple"></el-switch>
				</el-form-item>
				<el-form-item label="日期类型" v-if="addSearchForm.type === 'datePicker'" prop="dateType">
					<el-select v-model="addSearchForm.dateType" placeholder="请选择日期类型">
						<el-option label="年" value="year|yyyy"></el-option>
						<el-option label="年-月" value="month|yyyy-MM"></el-option>
						<el-option label="年-月-日" value="date|yyyy-MM-dd"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addSearchVisible = false">取消</el-button>
				<el-button type="primary" @click="addSearchSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!-- 编辑搜索页面 -->
		<el-dialog title="编辑" width="500px" :visible.sync="editSearchVisible" :close-on-click-modal="false">
			<el-form :model="editSearchForm" label-width="80px" :rules="searchRules" ref="editSearchForm">
				<el-form-item label="字段" prop="field">
					<el-input v-model="editSearchForm.field" placeholder="请输入字段"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-select v-model="editSearchForm.type" placeholder="请选择类型">
						<el-option
							v-for="item in typeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="说明" prop="desc">
					<el-input
						v-model="editSearchForm.desc"
						placeholder="请输入说明"
						maxlength="5"
						show-word-limit
					></el-input>
				</el-form-item>
				<el-form-item label="占位提示">
					<el-input
							v-model="editSearchForm.placeholder"
							placeholder="请输入占位提示"
							show-word-limit
					></el-input>
				</el-form-item>
				<el-form-item label="数据源" prop="source" filterable v-if="editSearchForm.type === 'select'">
					<el-select
						v-model="editSearchForm.source"
						placeholder="请选择数据源"
						clearable
						@change="sourceChange"
						filterable
					>
						<el-option v-for="item in formatterOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="是否多选"
					v-if="
						editSearchForm.type === 'select' ||
							editSearchForm.type === 'company' ||
							editSearchForm.type === 'department'
					"
				>
					<el-switch v-model="editSearchForm.multiple"></el-switch>
				</el-form-item>
				<el-form-item label="日期类型" v-if="editSearchForm.type === 'datePicker'" prop="dateType">
					<el-select v-model="editSearchForm.dateType" placeholder="请选择日期类型">
						<el-option label="年" value="year|yyyy"></el-option>
						<el-option label="年-月" value="month|yyyy-MM"></el-option>
						<el-option label="年-月-日" value="date|yyyy-MM-dd"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editSearchVisible = false">取消</el-button>
				<el-button type="primary" @click="editSearchSubmit">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import codemirrorXml from '@/views/components/codemirror/xml'
export default {
	components: {
		codemirrorXml
	},
	data() {
		return {
			action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
			headers: {
				Authorization: window.localStorage.getItem('Authorization')
			},
			active: 0,
			form: {
				name: '',
				design: '',
				icon: '',
				color: '#1879FE',
				tableId: '',
				flowId: '',
				tableHeader: '',
				dataSource: '',
				searchJson: '',
				listExportPath: []
			},
			rules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				icon: [{ required: true, message: '请输入图标', trigger: 'blur' }],
				color: [{ required: true, message: '请选择颜色', trigger: 'blur' }],
				tableId: [{ required: true, message: '请选择数据模型', trigger: 'change' }]
			},
			iconFormVisible: false,
            pageSize: 30,
            pageNo: 1,
            total: 0,
            searchIconName: '',
            iconData: [],
			predefine: ['#1879fe', '#5d0bc7', '#1700c2', '#1cb6b4', '#35a110', '#f5b017', '#ee6c16', '#ef0022'],
			flowOptions: [],
			tags: ['select', 'where', 'if', 'foreach', 'insert', 'update', 'delete'],
			tableHeaderData: [],
			parentOptions: [],
			tableHeaderRules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				prop: [{ required: true, message: '请输入字段名', trigger: 'blur' }],
				label: [{ required: true, message: '请输入标题', trigger: 'blur' }],
				formatter: [{ required: true, message: '请选择格式化', trigger: 'change' }]
			},
			addTableHeaderVisible: false,
			addTableHeaderForm: {
				parentId: '',
				prop: '',
				label: '',
				width: undefined,
				locking: 3,
				summary: 2,
				total: 2,
				target: 0,
				formatter: '',
				sort: 1,
				options: ''
			},
			editTableHeaderVisible: false,
			editTableHeaderForm: {
				parentId: '',
				prop: '',
				label: '',
				width: undefined,
				locking: 3,
				summary: 2,
				total: 2,
				target: 0,
				formatter: '',
				sort: 1,
				options: ''
			},
			currentTableHeaderIndex: -1,
			searchTableData: [],
			addSearchVisible: false,
			addSearchForm: {
				type: '',
				field: '',
				desc: '',
				source: ''
			},
			editSearchVisible: false,
			editSearchForm: {
				type: '',
				field: '',
				desc: '',
				source: ''
			},
			searchRules: {
				type: [{ required: true, message: '请选择类型', trigger: 'change' }],
				field: [{ required: true, message: '请输入字段', trigger: 'blur' }],
				desc: [{ required: true, message: '请输入说明', trigger: 'blur' }],
				source: [{ required: true, message: '请选择数据源', trigger: 'change' }],
				dateType: [{ required: true, message: '请选择日期类型', trigger: 'change' }]
			},
			currentSearchIndex: -1,
			typeOptions: [
				{
					label: '输入框',
					value: 'input'
				},
				{
					label: '下拉选择',
					value: 'select'
				},
				{
					label: '日期选择',
					value: 'datePicker'
				},
				{
					label: '单位选择',
					value: 'company'
				},
				{
					label: '部门选择',
					value: 'department'
				}
			],
			formatterOptions: [],
			height: (document.documentElement.clientHeight || document.body.clientHeight) - 360,
			tableOptions: []
		}
	},
	created() {
		this.queryBusinessTable()
		this.queryFlowData()
		this.queryFormatter()
	},
	methods: {
		async queryBusinessTable() {
            let res = await this.$axios.get('businessTable/queryAll')
            if (res.data.code === 200) {
                this.tableOptions = res.data.data
            }
        },
		async queryFlowData() {
			let res = await this.$axios.get('seaDefinition/queryAll')
			if (res.data.code === 200) {
				this.flowOptions = res.data.data
			}
		},
		async queryFormatter() {
			let res = await this.$axios.get('dictionaryClassify/queryDisplay')
			if (res.data.code === 200) {
				this.formatterOptions = res.data.data
			}
		},
		beforeUpload(file) {
			let pattern = /.(xls|xlsx)$/g
			if (!pattern.test(file.name)) {
				this.$message.error('只能上传xls/xlsx文件')
				return false
			}
			const fileSize = file.size / 1024 / 1024 < 10
			if (!fileSize) {
				this.$message.error('上传文件大小不能超过 10MB')
				return false
			}
			return true
		},
		handleFileSuccess(res, file, fileList, type) {
			if (res.code === 200) {
				let fileArray = this.form.listExportPath

				fileArray.push({
					name: file.name,
					size: file.size,
					url: res.data
				})
				this.form.listExportPath = fileArray
			} else {
				this.$message.error(res.message)
			}
		},
		handleFileDownload(file) {
			let params = {
				url: file.url,
				fileName: file.name
			}
			this.$axios.post('upload/download', params, { responseType: 'blob' }).then(res => {
				let content = res.data
				let blob = new Blob([content])
				if ('download' in document.createElement('a')) {
					// 非IE下载
					let elink = document.createElement('a')
					elink.download = file.name
					elink.style.display = 'none'
					elink.href = URL.createObjectURL(blob)
					document.body.appendChild(elink)
					elink.click()
					URL.revokeObjectURL(elink.href) // 释放URL 对象
					document.body.removeChild(elink)
				} else {
					// IE10+下载
					navigator.msSaveBlob(blob, file.name)
				}
			})
		},
		handleFileRemove(file) {
			this.form.listExportPath = []
		},
		handleLast() {
			this.active--
		},
		handleNext() {
			if (this.active === 0) {
				this.$refs.ruleForm.validate(valid => {
					if (valid) {
						this.active++
					}
				})
				if(this.tableHeaderData.length === 0) {
					this.queryTableField()
				}
			} else if (this.active === 1) {
				if (this.tableHeaderData.length === 0) {
					this.$message.error('表头不能为空')
					return
				}
				this.active++
			} else if (this.active === 2) {
				if (!this.form.dataSource) {
					this.$message.error('数据源不能为空')
					return
				}
				this.active++
			}
		},
		async queryTableField() {
			let res = await this.$axios.get('businessField/queryByTableId/' + this.form.tableId)
			if (res.data.code === 200) {
				for(let i=0;i<res.data.data.length;i++) {
					let field = res.data.data[i]
					if(!(field.name == 'company_id' || field.name == 'user_id')) {
						this.tableHeaderData.push({
							parentId: '',
							prop: field.name,
							label: field.remark,
							width: undefined,
							locking: 3,
							summary: 2,
							total: 2,
							target: 0,
							formatter: '',
							sort: 1,
							options: ''
						})
					}
				}
			}
		},
		showTableHeaderAddDialog() {
			this.addTableHeaderVisible = true
			if (this.$refs.addTableHeaderForm) {
				this.$refs.addTableHeaderForm.resetFields()
			}
		},
		addTableHeaderSubmit() {
			this.$refs.addTableHeaderForm.validate(valid => {
				if (valid) {
					this.tableHeaderData = this.tableHeaderData.concat(
						JSON.parse(JSON.stringify(this.addTableHeaderForm))
					)
					this.addTableHeaderVisible = false
				}
			})
		},
		editTableHeaderSubmit() {
			this.$refs.editTableHeaderForm.validate(valid => {
				if (valid) {
					this.editTableHeaderVisible = false
					this.tableHeaderData.splice(
						this.currentTableHeaderIndex,
						1,
						JSON.parse(JSON.stringify(this.editTableHeaderForm))
					)
				}
			})
		},
		showTableHeaderEditDialog(index, row) {
			this.editTableHeaderVisible = true
			if (this.$refs.editTableHeaderForm) {
				this.$refs.editTableHeaderForm.resetFields()
			}
			this.editTableHeaderForm = Object.assign({}, row)
			this.currentTableHeaderIndex = index
		},
		tableHeaderDelSubmit(index) {
			this.tableHeaderData.splice(index, 1)
		},
		lockingFormatter(row) {
			if (row.locking === 1) {
				return '左'
			} else if (row.locking === 2) {
				return '右'
			} else {
				return '无'
			}
		},
		summaryFormatter(row) {
			if (row.summary === 1) {
				return '是'
			} else {
				return '否'
			}
		},
		totalFormatter(row) {
			if (row.total === 1) {
				return '是'
			} else {
				return '否'
			}
		},
		submitForm() {
			if (this.tableHeaderData.length === 0) {
				this.$message.error('表头不能为空')
				return
			}
			if (!this.form.dataSource) {
				this.$message.error('数据源不能为空')
				return
			}
			let that = this
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					var params = {
						name: this.form.name,
						tableId: this.form.tableId,
						design: this.form.design,
						icon: this.form.icon,
						color: this.form.color,
						flowId: this.form.flowId,
						dataSource: this.form.dataSource,
						searchJson: JSON.stringify(this.searchTableData),
						tableHeader: JSON.stringify(this.tableHeaderData)
					}
					this.$axios.post('jellyForm/insert', params).then(res => {
						if (res.data.code == 200) {
							that.$message.success('新增成功')
							that.$store.commit('worktabRemove', that.$route.fullPath)
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		showSearchAddDialog() {
			this.addSearchVisible = true
			if (this.$refs.addSearchForm) {
				this.$refs.addSearchForm.resetFields()
			}
		},
		addSearchSubmit() {
			this.$refs.addSearchForm.validate(valid => {
				if (valid) {
					this.searchTableData = this.searchTableData.concat(JSON.parse(JSON.stringify(this.addSearchForm)))
					this.addSearchVisible = false
				}
			})
		},
		showSearchEditDialog(index, row) {
			this.editSearchVisible = true
			if (this.$refs.editSearchForm) {
				this.$refs.editSearchForm.resetFields()
			}
			this.editSearchForm = Object.assign({}, row)
			this.currentSearchIndex = index
		},
		editSearchSubmit() {
			this.$refs.editSearchForm.validate(valid => {
				if (valid) {
					this.editSearchVisible = false
					this.searchTableData.splice(
						this.currentSearchIndex,
						1,
						JSON.parse(JSON.stringify(this.editSearchForm))
					)
				}
			})
		},
		searchDelSubmit(index) {
			this.searchTableData.splice(index, 1)
		},
		typeFormatter(row) {
			if (row.type === 'input') {
				return '输入框'
			} else if (row.type === 'radio') {
				return '单选框'
			} else if (row.type === 'checkbox') {
				return 'checkbox'
			} else if (row.type === 'select') {
				return '下拉选择'
			} else if (row.type === 'datePicker') {
				return '日期选择'
			} else if (row.type === 'company') {
				return '单位选择'
			} else if (row.type === 'department') {
				return '部门选择'
			}
		},
		sourceChange(value) {
			this.$axios.get('dictionaryDetail/queryDisplay?classifyId=' + value).then(res => {
				if (res.data.code == 200) {
					if (this.addHeaderVisible) {
						this.addSearchForm.sourceOptions = res.data.data
					} else {
						this.editSearchForm.sourceOptions = res.data.data
					}
				}
			})
		},
		moveUp(index) {
			if (index === 0) {
				return
			}
			this.searchTableData.splice(index - 1, 0, this.searchTableData[index])
			this.searchTableData.splice(index + 1, 1)
		},
		moveDown(index) {
			if (index === this.searchTableData.length - 1) {
				return
			}
			this.searchTableData.splice(index + 2, 0, this.searchTableData[index])
			this.searchTableData.splice(index, 1)
		},
		insertCode(value) {
			let script = ''
			if (value === 'select') {
				script = '<select></select>'
			} else if (value === 'insert') {
				script = '<insert></insert>'
			} else if (value === 'update') {
				script = '<update></update>'
			} else if (value === 'delete') {
				script = '<delete></delete>'
			} else if (value === 'where') {
				script = '<where></where>'
			} else if (value === 'if') {
				script = '<if test="name != null and name != \'\'">AND name = #{name}</if>'
			} else if (value === 'foreach') {
				script =
					'<foreach item="item" collection="collection" separator="," open="(" close=")">#{item}</foreach>'
			}
			let curPos = this.$refs.codemirror.editor.getCursor()
			let insertPos = {}
			insertPos.line = curPos.line
			insertPos.ch = curPos.ch
			this.$refs.codemirror.editor.replaceRange(script, insertPos)
		},
		queryIconByPage(){
            var params = {
                pageSize: this.pageSize,
                pageNo: this.pageNo,
                name: this.searchIconName
            }
            this.$axios.get('jellySvg/queryByPage', {params}).then(res => {
                if (res.data.code == 200) {
                    this.iconData = res.data.data.list
                    this.total = res.data.data.total
                }
            })
        },
        handleCurrentChange(){
            this.queryIconByPage()
        },
        handleIconDialog(){
            this.queryIconByPage()
            this.iconFormVisible = true
        },
        handleIconClick(item){
            this.form.icon = item.content
            this.iconFormVisible = false
        },
	}
}
</script>
<style scoped>
.container {
	padding: 15px;
}
.source {
	padding: 15px;
}
.tag {
	margin-left: 15px;
}
::v-deep .upload-disabled .el-upload--picture-card {
	display: none;
}
::v-deep .is-without-controls .el-input .el-input__inner {
	text-align: left;
}
.inside-input {
    position: relative;
}
.inside-input .iconE {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
    color: #c0c4cc;
}
::v-deep .inside-input .el-input--suffix .el-input__inner {
    padding-right: 48px;
}
::v-deep .inside-input .el-select .el-input__suffix .el-icon-arrow-up {
    display: none;
}
::v-deep .inside-input .el-select .el-input__suffix .el-icon-circle-close {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    color: #c0c4cc;
}
.iconView {
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 0px 20px;
    height: 40px;
}
</style>
