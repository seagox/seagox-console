<template>
	<div>
		<div class="toolView">
			<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
			<el-upload
				style="display:inline;margin-left:10px;margin-right:10px;"
				:action="action"
				:show-file-list="false"
				accept=".xlsx,.xls"
				:headers="headers"
				:before-upload="beforeUpload"
				:on-success="successHandle"
				:data="uploadParams"
			>
				<el-button type="text" icon="el-icon-upload2">导入</el-button>
			</el-upload>
			<el-button type="text" icon="el-icon-download" @click="downloadTemplate" size="small">下载模版</el-button>
		</div>
		<div class="searchView">
			<el-form label-width="65px">
				<el-row>
					<el-col :span="6">
						<el-form-item label="字段名">
							<el-input v-model="searchForm.name" clearable placeholder="请输入字段名"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="注释">
							<el-input v-model="searchForm.remark" clearable placeholder="请输入注释"></el-input>
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
			</el-form>
		</div>
		<div class="table">
			<!--列表-->
			<el-table :data="tableData" border highlight-current-row stripe>
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="字段名" align="center"></el-table-column>
				<el-table-column prop="type" label="字段类型" align="center"></el-table-column>
				<el-table-column prop="length" label="长度" align="center"></el-table-column>
				<el-table-column prop="decimals" label="小数" align="center">
					<template slot-scope="scope">
						<div v-if="scope.row.decimals">{{scope.row.decimals}}</div>
						<div v-else>-</div>
					</template>
				</el-table-column>
				<el-table-column label="是否为空" align="center">
					<template slot-scope="scope">
						<i class="el-icon-check" style="color:green;font-weight:bold;" v-if="scope.row.notNull === 0"></i>
						<i class="el-icon-close" style="color:red;font-weight:bold;" v-else></i>
					</template>
				</el-table-column>
				<el-table-column prop="defaultValue" label="默认值" align="center">
					<template slot-scope="scope">
						<div v-if="scope.row.defaultValue">{{scope.row.defaultValue}}</div>
						<div v-else>-</div>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="注释" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column
					prop="kind"
					label="种类"
					align="center"
					:formatter="kindFormatter"
				></el-table-column>
				<el-table-column label="操作" align="center" width="100">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="showEditDialog(scope.row)"
							>编辑</el-button
						>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="small" @click="deleteSubmit(scope.row)"
							>删除</el-button
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
		<!--新增界面-->
		<el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
				<el-col :span="12">
					<el-form-item label="字段名" prop="name">
						<el-input v-model.trim="addForm.name" placeholder="请输入字段名"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="类型" prop="type">
						<el-select v-model="addForm.type" filterable placeholder="请选择类型" @change="typeChange">
							<el-option label="枚举" value="integer" v-if="datasourceType != 'oracle'"></el-option>
							<el-option label="整数值" value="bigint" v-if="datasourceType != 'oracle'"></el-option>
							<el-option label="小数值" value="decimal" v-if="datasourceType != 'oracle'"></el-option>
							<el-option label="数字值" value="number" v-if="datasourceType === 'oracle'"></el-option>
							<el-option label="日期值" value="date"></el-option>
							<el-option label="日期时间值" value="timestamp"></el-option>
							<el-option label="字符串" value="varchar"></el-option>
							<el-option label="长文本" value="text"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" v-if="addForm.type === 'varchar' || addForm.type === 'number'">
					<el-form-item label="长度" prop="length">
						<el-input-number
							v-model="addForm.length"
							:controls="false"
							:precision="0"
							:min="0"
							:max="3000"
							placeholder="请输入长度"
						>
						</el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="12" v-if="addForm.type === 'decimal' || addForm.type === 'number'">
					<el-form-item label="小数" prop="decimals">
						<el-input-number
							v-model="addForm.decimals"
							:controls="false"
							:precision="0"
							:min="0"
							:max="30"
							placeholder="请输入小数"
						>
						</el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="注释" prop="remark">
						<el-input v-model="addForm.remark" placeholder="请输入注释"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="addForm.type === 'varchar' || addForm.type === 'decimal' ? 24 : 12">
					<el-form-item label="种类" prop="kind">
						<el-select v-model="addForm.kind" placeholder="请选择种类">
							<el-option
								v-for="item in kindOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="是否为空" prop="notNull">
						<el-switch v-model="addForm.notNull" :active-value="0" :inactive-value="1"> </el-switch>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="外键" prop="targetTableId">
						<el-select
							v-model="addForm.targetTableId"
							placeholder="请选择表名"
							clearable
							filterable
						>
							<el-option
								v-for="item in tableOptions"
								:key="item.id"
								:label="item.remark + '(' + item.name + ')'"
								:value="item.id"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24" v-if="addForm.type != 'text'">
					<el-form-item label="默认值" prop="defaultValue">
						<el-input
							type="textarea"
							:rows="6"
							placeholder="请输入默认值"
							v-model="addForm.defaultValue"
							:maxlength="200"
							:show-word-limit="true"
						>
						</el-input>
					</el-form-item>
				</el-col>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="750px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
				<el-col :span="12">
					<el-form-item label="字段名" prop="name">
						<el-input v-model.trim="editForm.name" placeholder="请输入字段名"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="类型" prop="type">
						<el-select
							v-model="editForm.type"
							filterable
							placeholder="请选择类型"
							@change="typeChange"
						>
							<el-option label="枚举" value="integer" v-if="datasourceType != 'oracle'"></el-option>
							<el-option label="整数值" value="bigint" v-if="datasourceType != 'oracle'"></el-option>
							<el-option label="小数值" value="decimal" v-if="datasourceType != 'oracle'"></el-option>
							<el-option label="数字值" value="number" v-if="datasourceType === 'oracle'"></el-option>
							<el-option label="日期值" value="date"></el-option>
							<el-option label="日期时间值" value="timestamp"></el-option>
							<el-option label="字符串" value="varchar"></el-option>
							<el-option label="长文本" value="text"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" v-if="editForm.type === 'varchar' || editForm.type === 'number'">
					<el-form-item label="长度" prop="length">
						<el-input-number
							v-model="editForm.length"
							:controls="false"
							:precision="0"
							:min="0"
							:max="3000"
							placeholder="请输入长度"
						>
						</el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="12" v-if="editForm.type === 'decimal' || editForm.type === 'number'">
					<el-form-item label="小数" prop="decimals">
						<el-input-number
							v-model="editForm.decimals"
							:controls="false"
							:precision="0"
							:min="0"
							:max="30"
							placeholder="请输入小数"
						>
						</el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="注释" prop="remark">
						<el-input v-model="editForm.remark" placeholder="请输入注释"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="editForm.type === 'varchar' || editForm.type === 'decimal' ? 24 : 12">
					<el-form-item label="种类" prop="kind">
						<el-select v-model="editForm.kind" placeholder="请选择种类">
							<el-option
								v-for="item in kindOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="是否为空" prop="notNull">
						<el-switch v-model="editForm.notNull" :active-value="0" :inactive-value="1"> </el-switch>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="外键" prop="targetTableId">
						<el-select
							v-model="editForm.targetTableId"
							placeholder="请选择表名"
							clearable
							filterable
						>
							<el-option
								v-for="item in tableOptions"
								:key="item.id"
								:label="item.remark + '(' + item.name + ')'"
								:value="item.id"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24" v-if="editForm.type != 'text'">
					<el-form-item label="默认值" prop="defaultValue">
						<el-input
							type="textarea"
							:rows="6"
							placeholder="请输入默认值"
							v-model="editForm.defaultValue"
							:maxlength="200"
							:show-word-limit="true"
						>
						</el-input>
					</el-form-item>
				</el-col>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editSubmit">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			action: this.$axios.defaults.baseURL + 'businessField/import',
			headers: {
				Authorization: localStorage.getItem('Authorization')
			},
			uploadParams: {
				tableId: this.$route.query.businessTableId
			},
			clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
			searchForm: {
                name: '',
				remark: ''
            },
			tableData: [],
			pageNo: 1,
			total: 0,
			addFormVisible: false,
			addForm: {
				businessTableId: '',
				name: '',
				length: 30,
				decimals: 2,
				remark: '',
				kind: 1,
				type: '',
				notNull: 0,
				defaultValue: '',
				targetTableId: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				businessTableId: '',
				name: '',
				length: 30,
				decimals: 2,
				remark: '',
				kind: 1,
				type: '',
				notNull: 0,
				defaultValue: '',
				targetTableId: ''
			},
			rules: {
				name: [
					{ required: true, message: '请输入字段名', trigger: 'blur' },
					{ pattern: /^[a-z_]{1,}$/, message: '只能输入小写英文字母或下划线' }
				],
				length: [{ required: true, message: '请输入长度', trigger: 'blur' }],
				decimals: [{ required: true, message: '请输入小数', trigger: 'blur' }],
				remark: [{ required: true, message: '请输入注释', trigger: 'blur' }],
				type: [{ required: true, message: '请选择类型', trigger: 'change' }]
			},
			kindOptions: [
				{
					label: '单行文本',
					value: 1
				},
				{
					label: '枚举',
					value: 2
				},
				{
					label: '单位',
					value: 3
				},
				{
					label: '部门',
					value: 4
				},
				{
					label: '用户',
					value: 5
				},
				{
					label: '富文本',
					value: 6
				},
				{
					label: '整数',
					value: 7
				},
				{
					label: '浮点数',
					value: 8
				},
				{
					label: '多行文本',
					value: 9
				},
				{
					label: '日期',
					value: 10
				},
				{
					label: '附件',
					value: 11
				},
				{
					label: '图片',
					value: 12
				},
				{
					label: '省市区',
					value: 13
				}
			],
			tableOptions: []
		}
	},
	computed: {
		datasourceType() {
			return localStorage.getItem('_databaseId')
		}
	},
	mounted() {
		this.queryByPage()
		this.queryTable()
	},
	methods: {
		async queryByPage() {
			const params = {
				pageNo: this.pageNo,
				businessTableId: this.$route.query.businessTableId,
				name: this.searchForm.name,
				remark: this.searchForm.remark
			}
			let res = await this.$axios.get('businessField/queryByPage', { params })
			if (res.data.code == 200) {
				this.tableData = res.data.data.list
				this.total = res.data.data.total
			}
		},
		async queryTable() {
			let res = await this.$axios.get('businessTable/queryAll')
			if (res.data.code == 200) {
				this.tableOptions = res.data.data
			}
		},
		handleSearch() {
            this.pageNo = 1
            this.queryByPage()
        },
		handleCurrentChange() {
			this.queryByPage()
		},
		//显示新增界面
		showAddDialog() {
			this.addFormVisible = true
			if (this.$refs.addForm) {
				this.$refs.addForm.resetFields()
			}
			this.addForm.businessTableId = this.$route.query.businessTableId
		},
		//新增
		addSubmit() {
			let that = this
			if (that.addForm.type === 'varchar') {
				if (that.addForm.length == 0) {
					that.$message.error('长度不能为0')
					return
				}
			}
			this.$refs.addForm.validate(valid => {
				if (valid) {
					that.$axios.post('businessField/insert', that.addForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('新增成功')
							that.addFormVisible = false
							that.queryByPage()
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
			if (that.editForm.type === 'varchar') {
				if (that.editForm.length == 0) {
					that.$message.error('长度不能为0')
					return
				}
			}
			this.$refs.editForm.validate(valid => {
				if (valid) {
					that.$axios.post('businessField/update', that.editForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('修改成功')
							that.editFormVisible = false
							that.queryByPage()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		deleteSubmit(row) {
			let that = this
			this.$confirm('亲，确认要删除吗', '提示', { type: 'warning' }).then(() => {
				that.$axios.post('businessField/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						that.$message.success('删除成功')
						that.pageNo = 1
						that.queryByPage()
					} else {
						that.$message.error(res.data.message)
					}
				})
			})
		},
		kindFormatter(row) {	
			if (row.kind === 1) {
				return '单行文本'
			} else if (row.kind === 2) {
				return '枚举'
			} else if (row.kind === 3) {
				return '单位'
			} else if (row.kind === 4) {
				return '部门'
			} else if (row.kind === 5) {
				return '用户'
			} else if (row.kind === 6) {
				return '富文本'
			} else if (row.kind === 7) {
				return '整数'
			} else if (row.kind === 8) {
				return '浮点数'
			} else if (row.kind === 9) {
				return '多行文本'
			} else if (row.kind === 10) {
				return '日期'
			} else if (row.kind === 11) {
				return '附件'
			} else if (row.kind === 12) {
				return '图片'
			}  else if (row.kind === 13) {
				return '省市区'
			}
		},
		typeChange(value) {
			if (value === 'text') {
				if (this.addFormVisible) {
					this.addForm.decimals = 0
					this.addForm.defaultValue = ''
				} else {
					this.addForm.decimals = 0
					this.editForm.defaultValue = ''
				}
			} else if (value === 'number') {
				if (this.addFormVisible) {
					this.addForm.decimals = 2
				} else {
					this.editForm.decimals = 2
				}
			} else {
				if (this.addFormVisible) {
					this.addForm.decimals = 0
				} else {
					this.editForm.decimals = 0
				}
			}
		},
		beforeUpload(file) {
			const suffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
			if (suffix != 'xlsx' && suffix != 'xls') {
				this.$message.error(`只能选择excel文件`)
				return false
			}
			return true
		},
		successHandle(res, file, fileList) {
			if (res.code === 200) {
				this.$message.success('导入成功')
				this.queryByPage()
			} else {
				this.$message.error(res.message)
			}
		},
		downloadTemplate() {
			let params = {
				templateName: 'fieldModel.xlsx'
			}
			this.$axios.post('upload/downloadTemplate', params, { responseType: 'blob' }).then(res => {
				let content = res.data
				let blob = new Blob([content])
				if ('download' in document.createElement('a')) {
					// 非IE下载
					let elink = document.createElement('a')
					elink.download = '数据建模.xlsx'
					elink.style.display = 'none'
					elink.href = URL.createObjectURL(blob)
					document.body.appendChild(elink)
					elink.click()
					URL.revokeObjectURL(elink.href) // 释放URL 对象
					document.body.removeChild(elink)
				} else {
					// IE10+下载
					navigator.msSaveBlob(blob, '数据建模.xlsx')
				}
			})
		}
	}
}
</script>
<style scoped>
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
