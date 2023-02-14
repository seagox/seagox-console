<template>
	<div class="container">
		<el-steps :active="active" finish-status="success" align-center>
			<el-step title="基础设置"></el-step>
			<el-step title="数据表设置"></el-step>
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
					<el-select v-model="form.icon" filterable placeholder="请选择图标">
						<el-option v-for="icon in iconOptions" :key="icon" :label="icon" :value="icon"> </el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="表单设计" prop="designId">
					<el-select v-model="form.designId" filterable placeholder="请选择表单设计">
						<el-option
							v-for="item in formDesignOptions"
							:key="item.id"
							:label="item.name"
							:value="String(item.id)"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="表格表头" prop="tableHeader">
					<el-select v-model="form.tableHeader" filterable placeholder="请选择表格表头">
						<el-option
							v-for="item in tableHeaderOptions"
							:key="item.id"
							:label="item.name"
							:value="String(item.id)"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="颜色" prop="color">
					<el-color-picker v-model="form.color" :predefine="predefine"></el-color-picker>
				</el-form-item>
			</el-col>
			<el-col :span="12">
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
				<el-button icon="el-icon-plus" @click="showDataSheetAddDialog" size="small">新增</el-button>
			</div>
			<div class="table">
				<el-table :data="dataSheetTableData" border highlight-current-row stripe>
					<el-table-column prop="tableName" label="数据表名" align="center"></el-table-column>
					<el-table-column
						prop="singleFlag"
						label="数据类型"
						align="center"
						:formatter="singleFLagFormatter"
					></el-table-column>
					<el-table-column prop="sort" label="排序" align="center"></el-table-column>
					<el-table-column prop="relateTable" label="关联表" align="center"></el-table-column>
					<el-table-column prop="relateField" label="关联字段" align="center"></el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" @click="showDataSheetEditDialog(scope.$index, scope.row)" size="small"
								>编辑</el-button
							>
							<el-divider direction="vertical"></el-divider>
							<el-button type="text" @click="dataSheetDelSubmit(scope.$index)" size="small">删除</el-button>
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
		<el-dialog title="新增" width="500px" :visible.sync="addDataSheetVisible" :close-on-click-modal="false">
			<el-form :model="addDataSheetForm" label-width="80px" :rules="dataSheetRules" ref="addDataSheetForm">
				<el-form-item label="数据表名" prop="tableName">
					<el-select
						v-model="addDataSheetForm.tableName"
						placeholder="请选择数据表名"
						@change="handleRelateTableChange"
						filterable
					>
						<el-option
							v-for="item in tableOptions"
							:key="item.name"
							:label="item.remark"
							:value="item.name"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="数据类型" prop="singleFlag">
					<el-select v-model="addDataSheetForm.singleFlag" placeholder="请选择数据类型">
						<el-option
							v-for="item in singleFlagOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input-number v-model="addDataSheetForm.sort" label="请选择排序"></el-input-number>
				</el-form-item>
				<el-form-item label="关联表">
					<el-select v-model="addDataSheetForm.relateTable" placeholder="请选择关联表" clearable filterable>
						<el-option
							v-for="item in tableOptions"
							:key="item.name"
							:label="item.comment"
							:value="item.name"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="关联字段">
					<el-select v-model="addDataSheetForm.relateField" placeholder="请选择关联字段" clearable filterable>
						<el-option
							v-for="item in fieldOptions"
							:key="item.name"
							:label="item.comment"
							:value="item.name"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addDataSheetVisible = false">取消</el-button>
				<el-button type="primary" @click="addDataSheetSubmit">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="编辑" width="500px" :visible.sync="editDataSheetVisible" :close-on-click-modal="false">
			<el-form :model="editDataSheetForm" label-width="80px" :rules="dataSheetRules" ref="editDataSheetForm">
				<el-form-item label="数据表名" prop="tableName">
					<el-select
						v-model="editDataSheetForm.tableName"
						placeholder="请选择数据表名"
						@change="handleRelateTableChange"
						filterable
					>
						<el-option
							v-for="item in tableOptions"
							:key="item.name"
							:label="item.comment"
							:value="item.name"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="数据类型" prop="singleFlag">
					<el-select v-model="editDataSheetForm.singleFlag" placeholder="请选择数据类型">
						<el-option
							v-for="item in singleFlagOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input-number v-model="editDataSheetForm.sort" label="请选择排序"></el-input-number>
				</el-form-item>
				<el-form-item label="关联表">
					<el-select v-model="editDataSheetForm.relateTable" placeholder="请选择关联表" clearable filterable>
						<el-option
							v-for="item in tableOptions"
							:key="item.name"
							:label="item.remark"
							:value="item.name"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="关联字段">
					<el-select
						v-model="editDataSheetForm.relateField"
						placeholder="请选择关联字段"
						clearable
						filterable
					>
						<el-option
							v-for="item in fieldOptions"
							:key="item.name"
							:label="item.comment"
							:value="item.name"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editDataSheetVisible = false">取消</el-button>
				<el-button type="primary" @click="editDataSheetSubmit">提交</el-button>
			</div>
		</el-dialog>
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
				flowId: '',
				dataSource: '',
				searchJson: '',
				tableHeader: '',
				designId: '',
				listExportPath: []
			},
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
			dataSheetTableData: [],
			tableOptions: [],
			fieldOptions: [],
			dataSheetRules: {
				tableName: [{ required: true, message: '请选择数据表名', trigger: 'change' }],
				singleFlag: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
				sort: [{ required: true, message: '请选择排序', trigger: 'change' }]
			},
			singleFlagOptions: [
				{
					label: '单条数据',
					value: 1
				},
				{
					label: '多条数据',
					value: 2
				}
			],
			addDataSheetVisible: false,
			addDataSheetForm: {
				formId: '',
				tableName: '',
				singleFalg: '',
				sort: 1,
				relateTable: '',
				relateField: ''
			},
			editDataSheetVisible: false,
			editDataSheetForm: {
				formId: '',
				tableName: '',
				singleFlag: '',
				sort: 1,
				relateTable: '',
				relateField: ''
			},
			currentDataSheetIndex: -1,
			formDesignOptions: [],
			tableHeaderOptions: [],
			rules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				icon: [{ required: true, message: '请输入图标', trigger: 'blur' }],
				color: [{ required: true, message: '请选择颜色', trigger: 'blur' }],
				designId: [{ required: true, message: '请选择表单设计', trigger: 'change' }],
				tableHeader: [{ required: true, message: '请选择表格表头', trigger: 'change' }]
			},
			iconOptions: [
				'location-o',
				'like-o',
				'star-o',
				'phone-o',
				'setting-o',
				'fire-o',
				'coupon-o',
				'cart-o',
				'shopping-cart-o',
				'cart-circle-o',
				'friends-o',
				'comment-o',
				'gem-o',
				'gift-o',
				'point-gift-o',
				'send-gift-o',
				'service-o',
				'bag-o',
				'todo-list-o',
				'balance-list-o'
			],
			predefine: ['#1879fe', '#5d0bc7', '#1700c2', '#1cb6b4', '#35a110', '#f5b017', '#ee6c16', '#ef0022'],
			tags: ['select', 'where', 'if', 'foreach', 'insert', 'update', 'delete'],
			flowOptions: [],
			height: (document.documentElement.clientHeight || document.body.clientHeight) - 360
		}
	},
	created() {
		this.queryBusinessTable()
		this.queryFormatter()
		this.queryFormDesign()
		this.queryTableHeader()
		this.queryFlowData()
	},
	methods: {
		async queryFormatter() {
			let res = await this.$axios.get('dictionaryClassify/queryDisplay')
			if (res.data.code === 200) {
				this.formatterOptions = res.data.data
			}
		},
		async queryBusinessTable() {
			let res = await this.$axios.get('businessTable/queryAll')
			if (res.data.code === 200) {
				this.tableOptions = res.data.data
			}
		},
		async queryFormDesign() {
			let res = await this.$axios.get('jellyFormDesign/queryAll')
			if (res.data.code === 200) {
				this.formDesignOptions = res.data.data
			}
		},
		async queryTableHeader() {
			let res = await this.$axios.get('tableClassify/queryAll')
			if (res.data.code === 200) {
				this.tableHeaderOptions = res.data.data
			}
		},
		async queryFlowData() {
			let res = await this.$axios.get('seaDefinition/queryAll')
			if (res.data.code === 200) {
				this.flowOptions = res.data.data
			}
		},
		verifySql() {
			if (!this.form.dataSource) {
				this.$message.error('数据源不能为空')
				return
			}

			if (this.searchTableData.length === 0) {
				this.$message.error('搜索条件不能为空')
				return
			}

			let that = this
			var params = {
				searchJson: JSON.stringify(this.searchTableData),
				sql: this.form.dataSource
			}
			that.$axios.post('jellyForm/verifySql', params).then(res => {
				if (res.data.code == 200) {
					that.$message.success('验证成功')
				} else {
					that.$message.error('SQL有误')
				}
			})
		},
		handleLast() {
			this.active--
		},
		handleNext() {
			if (this.active === 0) {
				this.$refs['ruleForm'].validate(valid => {
					if (valid) {
						this.active++
					}
				})
			} else if (this.active === 1) {
				if (this.dataSheetTableData.length === 0) {
					this.$message.error('数据表不能为空')
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
		submitForm() {
			if (this.dataSheetTableData.length === 0) {
				this.$message.error('数据表不能为空')
				return
			}
			if (!this.form.dataSource) {
				this.$message.error('数据源不能为空')
				return
			}
			// if (this.searchTableData.length === 0) {
			// 	this.$message.error('搜索条件不能为空')
			// 	return
			// }

			let that = this
			this.$refs['ruleForm'].validate(valid => {
				if (valid) {
					var params = {
						name: that.form.name,
						icon: that.form.icon,
						color: that.form.color,
						flowId: that.form.flowId,
						listExportPath: JSON.stringify(that.form.listExportPath),
						dataSource: that.form.dataSource,
						searchJson: JSON.stringify(this.searchTableData),
						tableHeader: that.form.tableHeader,
						designId: that.form.designId,
						dataSheetTableJson: JSON.stringify(this.dataSheetTableData)
					}

					that.$axios.post('jellyForm/insert', params).then(function(response) {
						if (response.data.code == 200) {
							that.$message.success('新增成功')
							that.$store.commit('worktabRemove', that.$route.fullPath)
						} else {
							that.$message.error(response.data.message)
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
			let that = this
			this.$refs.addSearchForm.validate(valid => {
				if (valid) {
					that.searchTableData = that.searchTableData.concat(JSON.parse(JSON.stringify(that.addSearchForm)))
					that.addSearchVisible = false
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
			let that = this
			this.$refs.editSearchForm.validate(valid => {
				if (valid) {
					that.editSearchVisible = false
					that.searchTableData.splice(
						that.currentSearchIndex,
						1,
						JSON.parse(JSON.stringify(that.editSearchForm))
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
			let that = this
			that.$axios.get('dictionaryDetail/queryDisplay?classifyId=' + value).then(res => {
				if (res.data.code == 200) {
					if (that.addHeaderVisible) {
						that.addSearchForm.sourceOptions = res.data.data
					} else {
						that.editSearchForm.sourceOptions = res.data.data
					}
				}
			})
		},
		showDataSheetAddDialog() {
			this.addDataSheetVisible = true
			if (this.$refs.addDataSheetForm) {
				this.$refs.addDataSheetForm.resetFields()
			}
			this.addDataSheetForm.relateTable = ''
			this.addDataSheetForm.relateField = ''
		},
		singleFLagFormatter(row) {
			if (row.singleFlag === 1) {
				return '单条'
			} else {
				return '多条'
			}
		},
		handleRelateTableChange(value) {
			let that = this
			that.$axios.get('businessField/queryAll?display=0&tableName=' + value).then(res => {
				if (res.data.code === 200) {
					that.fieldOptions = res.data.data
				}
			})
		},
		addDataSheetSubmit() {
			let that = this
			this.$refs.addDataSheetForm.validate(valid => {
				if (valid) {
					that.dataSheetTableData = that.dataSheetTableData.concat(
						JSON.parse(JSON.stringify(that.addDataSheetForm))
					)
					that.addDataSheetVisible = false
				}
			})
		},
		editDataSheetSubmit() {
			let that = this
			this.$refs.editDataSheetForm.validate(valid => {
				if (valid) {
					that.editDataSheetVisible = false
					that.dataSheetTableData.splice(
						that.currentDataSheetIndex,
						1,
						JSON.parse(JSON.stringify(that.editDataSheetForm))
					)
				}
			})
		},
		showDataSheetEditDialog(index, row) {
			this.editDataSheetVisible = true
			if (this.$refs.editDataSheetForm) {
				this.$refs.editDataSheetForm.resetFields()
			}
			this.editDataSheetForm = Object.assign({}, row)
			this.currentDataSheetIndex = index
		},
		dataSheetDelSubmit(index) {
			this.dataSheetTableData.splice(index, 1)
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
		}
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
</style>
