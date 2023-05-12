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
				<el-table-column prop="remark" label="注释" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" align="center" width="100">
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
		<!--新增界面-->
		<el-dialog title="新增" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
				<el-form-item label="字段名" prop="name">
					<el-input v-model.trim="addForm.name" placeholder="请输入字段名"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-select v-model="addForm.type" filterable placeholder="请选择类型">
						<el-option
							label="整数值(-2147483648~2147483647)"
							value="integer"
							v-if="datasourceType != 'oracle'"
						></el-option>
						<el-option
							label="大整数值(-9223372036854775808~9223372036854775807)"
							value="bigint"
							v-if="datasourceType != 'oracle'"
						></el-option>
						<el-option label="小数值" value="decimal" v-if="datasourceType != 'oracle'"></el-option>
						<el-option
							label="number(数字值)"
							value="number"
							v-if="datasourceType === 'oracle'"
						></el-option>
						<el-option label="日期值(YYYY-MM-DD)" value="date"></el-option>
						<el-option label="日期时间值(YYYY-MM-DD HH:MM:SS)" value="timestamp"></el-option>
						<el-option label="字符串(0~65535)" value="varchar"></el-option>
						<el-option label="长文本" value="text"></el-option>
						<el-option label="json" value="json"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="注释" prop="remark">
					<el-input v-model="addForm.remark" placeholder="请输入注释"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
				<el-form-item label="字段名" prop="name">
					<el-input v-model.trim="editForm.name" placeholder="请输入字段名"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-select
						v-model="editForm.type"
						filterable
						placeholder="请选择类型"
					>
						<el-option
							label="整数值(-2147483648~2147483647)"
							value="integer"
							v-if="datasourceType != 'oracle'"
						></el-option>
						<el-option
							label="大整数值(-9223372036854775808~9223372036854775807)"
							value="bigint"
							v-if="datasourceType != 'oracle'"
						></el-option>
						<el-option label="小数值" value="decimal" v-if="datasourceType != 'oracle'"></el-option>
						<el-option
							label="number(数字值)"
							value="number"
							v-if="datasourceType === 'oracle'"
						></el-option>
						<el-option label="date(日期值 YYYY-MM-DD)" value="date"></el-option>
						<el-option label="日期时间值(YYYY-MM-DD HH:MM:SS)" value="timestamp"></el-option>
						<el-option label="字符串(0~65535)" value="varchar"></el-option>
						<el-option label="长文本" value="text"></el-option>
						<el-option label="json" value="json"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="注释" prop="remark">
					<el-input v-model="editForm.remark" placeholder="请输入注释"></el-input>
				</el-form-item>
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
			action: this.$axios.defaults.baseURL + 'viewField/import',
			headers: {
				Authorization: localStorage.getItem('Authorization')
			},
			uploadParams: {
				viewId: this.$route.query.viewId
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
				viewId: '',
				name: '',
				remark: '',
				type: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				viewId: '',
				name: '',
				type: ''
			},
			rules: {
				name: [
					{ required: true, message: '请输入字段名', trigger: 'blur' },
					{ pattern: /^[a-z_]{1,}$/, message: '只能输入小写英文字母或下划线' }
				],
				remark: [{ required: true, message: '请输入注释', trigger: 'blur' }],
				type: [{ required: true, message: '请选择类型', trigger: 'change' }]
			}
		}
	},
	computed: {
		datasourceType() {
			return localStorage.getItem('_databaseId')
		}
	},
	mounted() {
		this.queryByPage()
	},
	methods: {
		async queryByPage() {
			const params = {
				pageNo: this.pageNo,
				viewId: this.$route.query.viewId,
				name: this.searchForm.name,
				remark: this.searchForm.remark
			}
			let res = await this.$axios.get('viewField/queryByPage', { params })
			if (res.data.code == 200) {
				this.tableData = res.data.data.list
				this.total = res.data.data.total
			}
		},
		handleSearch() {
            this.pageNo = 1
            this.queryByPage()
        },
		handleCurrentChange(val) {
			this.queryByPage()
		},
		//显示新增界面
		showAddDialog() {
			this.addFormVisible = true
			if (this.$refs.addForm) {
				this.$refs.addForm.resetFields()
			}
			this.addForm.viewId = this.$route.query.viewId
		},
		//新增
		addSubmit() {
			this.$refs.addForm.validate(valid => {
				if (valid) {
					this.$axios.post('viewField/insert', this.addForm).then(res => {
						if (res.data.code == 200) {
							this.$message.success('新增成功')
							this.addFormVisible = false
							this.queryByPage()
						} else {
							this.$message.error(res.data.message)
						}
					})
				}
			})
		},
		//显示编辑界面
		showEditDialog(row) {
			this.editForm = Object.assign({}, row)
			this.editFormVisible = true
			if (this.$refs.editForm) {
				this.$refs.editForm.resetFields()
			}
		},
		//编辑
		editSubmit() {
			this.$refs.editForm.validate(valid => {
				if (valid) {
					this.$axios.post('viewField/update', this.editForm).then(res => {
						if (res.data.code == 200) {
							this.$message.success('修改成功')
							this.editFormVisible = false
							this.queryByPage()
						} else {
							this.$message.error(res.data.message)
						}
					})
				}
			})
		},
		deleteSubmit(row) {
			this.$confirm('亲，确认要删除吗', '提示', { type: 'warning' }).then(() => {
				this.$axios.post('viewField/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						this.$message.success('删除成功')
						this.pageNo = 1
						this.queryByPage()
					} else {
						this.$message.error(res.data.message)
					}
				})
			})
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
				templateName: 'viewFieldModel.xlsx'
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
