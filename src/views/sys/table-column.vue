<template>
	<div>
		<el-container :style="'height:' + (clientHeight - 110) + 'px'">
			<el-aside width="240px" class="aside" style="padding-left:15px;padding-top:15px;">
				<div class="add-classify" @click="showAddClassifyDialog">
					<i class="el-icon-circle-plus"></i>
					<span style="margin-left:10px;">添加分类</span>
				</div>
				<el-table
					:data="treeData"
					highlight-current-row
					:show-header="false"
					@current-change="handleNodeClick"
					class="border"
					:max-height="clientHeight - 180"
				>
					<el-table-column show-overflow-tooltip>
						<template slot-scope="scope">
							<i class="el-icon-document" style="font-size:14px;"></i>
							<span style="font-size:14px;margin-left:8px;">{{ scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column width="45" align="center">
						<template slot-scope="scope">
							<el-dropdown @command="handleCommand($event, scope.row)">
								<span class="el-dropdown-link">
									<i class="el-icon-more"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item icon="el-icon-edit" command="edit">编辑</el-dropdown-item>
									<el-dropdown-item icon="el-icon-delete" command="delete">删除</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</el-aside>
			<el-main>
				<div class="toolView">
					<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
				</div>
				<div class="table">
					<!--列表-->
					<el-table
						:data="tableData"
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
								<el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
								<el-divider direction="vertical"></el-divider>
								<el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
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
		<!--新增界面-->
		<el-dialog title="新增" width="500px" :visible.sync="addClassifyFormVisible" :close-on-click-modal="false">
			<el-form :model="addClassifyForm" label-width="80px" :rules="formRules" ref="addClassifyForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="addClassifyForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addClassifyFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addClassifySubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="500px" :visible.sync="editClassifyFormVisible" :close-on-click-modal="false">
			<el-form :model="editClassifyForm" label-width="60px" :rules="formRules" ref="editClassifyForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="editClassifyForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editClassifyFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editClassifySubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="字段名" prop="prop">
							<el-input v-model="addForm.prop" placeholder="请输入字段名"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="标题" prop="label">
							<el-input v-model="addForm.label" placeholder="请输入标题"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上级" prop="parentId">
							<el-cascader
								v-model="addForm.parentId"
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
								v-model="addForm.width"
								:controls="false"
								:precision="0"
								placeholder="请输入宽度"
							></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="锁定" prop="locking">
							<el-select v-model="addForm.locking">
								<el-option label="左" :value="1"></el-option>
								<el-option label="右" :value="2"></el-option>
								<el-option label="无" :value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="数据对象" prop="target">
							<el-select v-model="addForm.target">
								<el-option label="无" :value="0"></el-option>
								<el-option label="数据字典" :value="1"></el-option>
								<el-option label="区域数据" :value="2"></el-option>
								<el-option label="图片数据" :value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="addForm.target === 1">
						<el-form-item label="格式化" prop="formatter">
							<el-select
								v-model="addForm.formatter"
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
							<el-input-number v-model="addForm.sort"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="公式" prop="formula">
							<el-input placeholder="请选择公式" v-model="addForm.formula" readonly>
								<i
									slot="suffix"
									class="el-input__icon el-icon-c-scale-to-original"
									@click="showFormulaDialog"
								></i>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="汇总" prop="summary">
							<el-switch v-model="addForm.summary" :active-value="1" :inactive-value="2"> </el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="合计" prop="total">
							<el-switch v-model="addForm.total" :active-value="1" :inactive-value="2"> </el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="路由配置" prop="routerJson">
							<codemirrorJavascript
								ref="codemirrorJavascript"
								v-if="addFormVisible"
								v-model="editForm.routerJson"
								placeholder="请输入脚本"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="750px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="字段名" prop="prop">
							<el-input v-model="editForm.prop" placeholder="请输入字段名"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="标题" prop="label">
							<el-input v-model="editForm.label" placeholder="请输入标题"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上级" prop="parentId">
							<el-cascader
								v-model="editForm.parentId"
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
								v-model="editForm.width"
								:controls="false"
								:precision="0"
								placeholder="请输入宽度"
							></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="锁定" prop="locking">
							<el-select v-model="editForm.locking">
								<el-option label="左" :value="1"></el-option>
								<el-option label="右" :value="2"></el-option>
								<el-option label="无" :value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="数据对象" prop="target">
							<el-select v-model="editForm.target">
								<el-option label="无" :value="0"></el-option>
								<el-option label="数据字典" :value="1"></el-option>
								<el-option label="区域数据" :value="2"></el-option>
								<el-option label="图片数据" :value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="editForm.target === 1">
						<el-form-item label="格式化" prop="formatter">
							<el-select
								v-model="editForm.formatter"
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
							<el-input-number v-model="editForm.sort"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="公式" prop="formula">
							<el-input placeholder="请选择公式" v-model="editForm.formula" readonly>
								<i
									slot="suffix"
									class="el-input__icon el-icon-c-scale-to-original"
									@click="showFormulaDialog"
								></i>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="汇总" prop="summary">
							<el-switch v-model="editForm.summary" :active-value="1" :inactive-value="2"> </el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="合计" prop="total">
							<el-switch v-model="editForm.total" :active-value="1" :inactive-value="2"> </el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="路由配置" prop="routerJson">
							<codemirrorJavascript
								ref="codemirrorJavascript"
								v-if="editFormVisible"
								v-model="editForm.routerJson"
								placeholder="请输入脚本"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--公式设置-->
		<el-dialog title="公式设置" width="750px" :visible.sync="formulaVisible" :close-on-click-modal="false">
			<codemirrorCalculate v-if="formulaVisible" v-model="calculate" :options="fieldOptions" />
			<div slot="footer" class="dialog-footer">
				<el-button @click="formulaVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleFormulaSave">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import codemirrorCalculate from '@/views/components/codemirror/calculate'
import codemirrorJavascript from '@/views/components/codemirror/javascript'
export default {
	components: {
		codemirrorCalculate,
		codemirrorJavascript
	},
	data() {
		return {
			clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
			treeData: [],
			addClassifyFormVisible: false,
			addClassifyForm: {
				name: ''
			},
			editClassifyFormVisible: false,
			editClassifyForm: {
				id: '',
				name: ''
			},
			classifyId: '',
			pageNo: 1,
			total: 0,
			tableData: [],
			parentOptions: [],
			addFormVisible: false,
			addForm: {
				classifyId: '',
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
				options: '',
				formula: '',
				routerJson: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				classifyId: '',
				parentId: '',
				prop: '',
				label: '',
				width: undefined,
				fixed: '',
				summary: '',
				total: '',
				target: 0,
				formatter: '',
				sort: '',
				options: '',
				formula: '',
				routerJson: ''
			},
			formatterOptions: [],
			formRules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				prop: [{ required: true, message: '请输入字段名', trigger: 'blur' }],
				label: [{ required: true, message: '请输入标题', trigger: 'blur' }],
				formatter: [{ required: true, message: '请选择格式化', trigger: 'change' }]
			},
			calculate: '',
			formulaVisible: false,
			fieldOptions: [
				{
					id: 1,
					name: '${return_number}',
					comment: '退回次数'
				}
			]
		}
	},
	mounted() {
		this.queryClassify()
		this.queryFormatter()
	},
	methods: {
		queryClassify() {
			let that = this
			that.$axios.get('tableClassify/queryAll').then(res => {
				if (res.data.code == 200) {
					that.treeData = res.data.data
				}
			})
		},
		async queryFormatter() {
			let res = await this.$axios.get('dictionaryClassify/queryDisplay')
			if (res.data.code === 200) {
				this.formatterOptions = res.data.data
			}
		},
		handleNodeClick(row) {
			if (row) {
				this.classifyId = row.id
				this.pageNo = 1
				this.queryByClassifyId()
				this.queryAllByClassifyId()
			}
		},
		handleCommand(command, row) {
			if (command === 'edit') {
				this.editClassifyForm = Object.assign({}, row)
				this.editClassifyFormVisible = true
				if (this.$refs.editClassifyForm) {
					this.$refs.editClassifyForm.resetFields()
				}
			} else if (command === 'delete') {
				this.deleteClassifySubmit(row)
			}
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
		handleCurrentChange(val) {
			this.queryByClassifyId()
		},
		queryByClassifyId() {
			let that = this
			const params = {
				pageNo: this.pageNo,
				classifyId: this.classifyId
			}
			that.$axios.get('tableColumn/queryByPage', { params }).then(res => {
				if (res.data.code == 200) {
					that.tableData = res.data.data.list
					that.total = res.data.data.total
				}
			})
		},
		queryAllByClassifyId() {
			let that = this
			const params = {
				classifyId: this.classifyId
			}
			that.$axios.get('tableColumn/queryByClassifyId', { params }).then(res => {
				if (res.data.code == 200) {
					that.parentOptions = res.data.data
				}
			})
		},
		showAddClassifyDialog() {
			this.addClassifyFormVisible = true
			if (this.$refs.addClassifyForm) {
				this.$refs.addClassifyForm.resetFields()
			}
		},
		addClassifySubmit() {
			let that = this
			this.$refs.addClassifyForm.validate(valid => {
				if (valid) {
					that.$axios.post('tableClassify/insert', that.addClassifyForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('新增成功')
							that.addClassifyFormVisible = false
							that.queryClassify()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		editClassifySubmit() {
			let that = this
			this.$refs.editClassifyForm.validate(valid => {
				if (valid) {
					that.$axios.post('tableClassify/update', that.editClassifyForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('修改成功')
							that.editClassifyFormVisible = false
							that.queryClassify()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		deleteClassifySubmit(row) {
			let that = this
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				that.$axios.post('tableClassify/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						that.$message.success('删除成功')
						that.queryClassify()
					} else {
						that.$message.error(res.data.message)
					}
				})
			})
		},
		formatterChange(value) {
			if (this.addFormVisible) {
				if (value) {
					let that = this
					that.$axios.get('dictionaryDetail/queryDisplay?classifyId=' + value).then(res => {
						if (res.data.code == 200) {
							that.addForm.options = JSON.stringify(res.data.data)
						}
					})
				} else {
					this.addForm.options = ''
				}
			} else {
				if (value) {
					let that = this
					that.$axios.get('dictionaryDetail/queryDisplay?classifyId=' + value).then(res => {
						if (res.data.code == 200) {
							that.editForm.options = JSON.stringify(res.data.data)
						}
					})
				} else {
					this.editForm.options = ''
				}
			}
		},
		//显示新增界面
		showAddDialog() {
			if (this.classifyId) {
				this.resetAddForm()
				this.addFormVisible = true
				if (this.$refs.addForm) {
					this.$refs.addForm.resetFields()
				}
				this.addForm.classifyId = this.classifyId
				this.addForm.parentId = ''
				this.addForm.sort = this.total + 1
			} else {
				this.$message.error('请选择表头分类')
			}
		},
		// 重置新增表单
		resetAddForm() {
			this.addForm = {
				classifyId: '',
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
				options: '',
				formula: '',
				routerJson: ''
			}
		},
		//新增
		addSubmit() {
			let that = this
			this.$refs.addForm.validate(valid => {
				if (valid) {
					that.$axios.post('tableColumn/insert', that.addForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('新增成功')
							that.addFormVisible = false
							that.queryByClassifyId()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		//显示编辑界面
		showEditDialog(row) {
			let that = this
			this.editForm = Object.assign({}, row)
			this.editFormVisible = true
			if (this.$refs.editForm) {
				this.$refs.editForm.resetFields()
			}
		},
		//编辑
		editSubmit() {
			let that = this
			this.$refs.editForm.validate(valid => {
				if (valid) {
					that.$axios.post('tableColumn/update', that.editForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('修改成功')
							that.editFormVisible = false
							that.queryByClassifyId()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		deleteSubmit(row) {
			let that = this
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				that.$axios.post('tableColumn/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						that.$message.success('删除成功')
						that.queryByClassifyId()
						that.pageNo = 1
					} else {
						that.$message.error(res.data.message)
					}
				})
			})
		},
		showFormulaDialog() {
			if (this.addFormVisible) {
				this.calculate = this.addForm.formula
				this.formulaVisible = true
			} else {
				this.calculate = this.editForm.formula
				this.formulaVisible = true
			}
		},
		handleFormulaSave() {
			this.formulaVisible = false
			if (this.addFormVisible) {
				this.addForm.formula = this.calculate
			} else {
				this.editForm.formula = this.calculate
			}
		}
	}
}
</script>
<style scoped>
::v-deep .el-main {
	border-left: 1px solid #e5e9f2;
	padding: 0px;
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
	cursor: pointer;
}
::v-deep .el-table__body tr.current-row td:not(.is-center) {
	border-top-left-radius: 8px !important;
	border-bottom-left-radius: 8px !important;
}
::v-deep .el-aside .el-table__body tr.current-row .is-center {
	border-top-right-radius: 8px !important;
	border-bottom-right-radius: 8px !important;
}
::v-deep .aside .el-table td {
	border-bottom: 0px solid #ebeef5;
}
</style>
