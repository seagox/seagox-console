<template>
	<div v-loading="loading">
		<div class="toolView">
			<el-button type="text" icon="el-icon-document-checked" @click="audit" size="small">审核</el-button>
		</div>
		<div class="searchView">
			<el-form label-width="80px" :inline="true">
				<el-form-item label="标题：">
					<el-input v-model="searchContent.title" placeholder="请输入标题" clearable> </el-input>
				</el-form-item>
				<el-form-item label="状态：">
					<el-select
						v-model="searchContent.statusData"
						multiple
						clearable
						@change="statusChange"
						placeholder="请选择状态"
					>
						<el-option
							v-for="item in statusOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类别：">
					<el-select
							v-model="searchContent.businessType"
							multiple
							clearable
							placeholder="请选择类别"
					>
						<el-option
								v-for="item in businessTypeOptions"
								:key="item.id"
								:label="item.name"
								:value="item.id"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属部门">
					<el-cascader
							v-model="searchContent.departmentIds"
							:options="departmentOptions"
							:props="{ checkStrictly: true, emitPath: false, multiple: true }"
							clearable
							filterable
							placeholder="请选择所属部门"
					>
					</el-cascader>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click.native="handleSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table">
			<!--列表-->
			<el-table
				:data="tableData"
				border
				stripe
				@row-dblclick="goDetail"
				@selection-change="handleSelectionChange"
				max-height="650"
				:cell-style="cellStyle"
				row-key="id"
			>
				<el-table-column width="45" fixed type="selection" align="center"></el-table-column>
				<el-table-column prop="name" label="标题" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column
					prop="assigneeName"
					label="发起人"
					align="center"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column
					prop="createTime"
					label="提交时间"
					align="center"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					align="center"
					:formatter="statusFormatter"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column
					prop="returnNumber"
					label="退回次数"
					align="center"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="handleProcess(scope.row)">流程查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="pagination">
				<el-pagination
					background
					@current-change="handleCurrentChange"
					layout="total, prev, pager, next"
					:page-size="pageSize"
					:current-page.sync="pageNo"
					:total="total"
				>
				</el-pagination>
			</div>
		</div>

		<!--流程审批-->
		<el-dialog title="审批意见" width="500px" :visible.sync="approvalVisible" :close-on-click-modal="false">
			<el-form :model="handleForm" label-width="0px">
				<el-form-item>
					<el-radio-group v-model="handleForm.status">
						<el-radio :label="1">同意</el-radio>
						<el-radio :label="2">不同意</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item>
					<el-dropdown trigger="click" @command="handleCommand">
						<span class="el-dropdown-link">
							审批意见
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command="item" v-for="(item, index) in commonWords" :key="index">{{
								index + 1 + '、' + item
								}}</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<i class="el-icon-setting" style="margin-left:10px" @click="showCommonWordsDialog"></i>
					<el-input type="textarea" :rows="10" placeholder="请输入处理意见" v-model="handleForm.comment">
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-radio-group v-model="handleForm.rejectType" v-if="handleForm.status === 2">
						<el-radio :label="2" :disabled="disableButtonFlag.backFront">退回到上个节点</el-radio>
						<el-radio :label="1" :disabled="disableButtonFlag.backStart">退回到初始节点</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="approvalVisible = false">取消</el-button>
				<el-button
						type="primary"
						@click="auditSubmit"
						:disabled="handleForm.status === 2 && disableButtonFlag.backFront && disableButtonFlag.backStart"
				>提交</el-button
				>
			</div>
		</el-dialog>

		<!--审批意见列表-->
		<el-dialog title="审批意见" width="500px" :visible.sync="commonWordsVisible" :close-on-click-modal="false">
			<el-row style="margin-bottom:10px">
				<el-button @click="showCommonWordsAddDialog" size="small">新增</el-button>
			</el-row>
			<el-table :data="commonWordsData" style="width: 100%">
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="名称" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="showCommonWordsEditDialog(scope.row)"
						>编辑</el-button
						>
						<el-button type="text" size="small" @click="deleteCommonWordsSubmit(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer"></div>
		</el-dialog>
		<!--新增审批意见-->
		<el-dialog title="新增" width="500px" :visible.sync="addCommonWordsVisible" :close-on-click-modal="false">
			<el-form :model="addCommonWordsForm" label-width="60px" :rules="formRules" ref="addCommonWordsForm">
				<el-form-item label="名称" prop="name">
					<el-input
							v-model="addCommonWordsForm.name"
							type="textarea"
							:rows="5"
							:maxlength="50"
							show-word-limit
							clearable
							placeholder="请输入名称"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addCommonWordsVisible = false">取消</el-button>
				<el-button type="primary" @click="addCommonWordsSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑审批意见-->
		<el-dialog title="编辑" width="500px" :visible.sync="editCommonWordsVisible" :close-on-click-modal="false">
			<el-form :model="editCommonWordsForm" label-width="60px" :rules="formRules" ref="editCommonWordsForm">
				<el-form-item label="名称" prop="name">
					<el-input
							v-model="editCommonWordsForm.name"
							type="textarea"
							:rows="5"
							:maxlength="50"
							show-word-limit
							clearable
							placeholder="请输入名称"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editCommonWordsVisible = false">取消</el-button>
				<el-button type="primary" @click="editCommonWordsSubmit">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'TodoItem',
	data() {
		return {
			statusOptions: [
				{
					value: 0,
					label: '待审'
				},
				{
					value: 2,
					label: '驳回'
				},
				{
					value: 3,
					label: '撤回'
				}
			],
			searchContent: {
				title: '',
				statusData: [],
				businessType: [],
				departmentIds: []
			},
			tableData: [],
			pageNo: 1,
			total: 0,
			pageSize: 10,
			businessTypeOptions: [],
			departmentOptions: [],
			companyId: Number(localStorage.getItem('companyId')),

			// 批量审核相关参数
			multipleSelection: [],
			approvalVisible: false,
			disableButtonFlag: false,
			handleForm: {
				status: 1,
				comment: '',
				rejectType: 2
			},
			commonWords: [
				'同意',
				'交相关部门处理',
				'拟同意',
				'按单位相关规章制度办理',
				'保留意见',
				'同意，按规定办理',
				'按流程办理'
			],
			addCommonWordsVisible: false,
			addCommonWordsForm: { name: '' },
			editCommonWordsVisible: false,
			editCommonWordsForm: { name: '' },
			commonWordsVisible: false,
			commonWordsData: [],
			formRules: {
				reason: [{ required: true, message: '请输入理由', trigger: 'blur' }],
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
			},

			loading: false
		}
	},

	mounted() {
		this.queryByPage()
		this.queryBusinessTypes()
		this.queryDepartmentByCompanyId(this.companyId)
	},
	methods: {
		cellStyle(column) {
			if (column.columnIndex === 0 && column.row.returnNumber > 2) {
				return {
					color: '#ef0022 !important'
				}
			}
		},
		statusFormatter(obj) {
			if (obj.status === 0) {
				return '待审'
			} else if (obj.status === 2) {
				return '驳回'
			} else {
				return '撤回'
			}
		},
		statusChange(val) {
			this.searchContent.status = val
		},
		goDetail(row) {
			if (+row.businessType === 9 || +row.businessType === 20 || +row.businessType === 35 || +row.businessType === 36) {
				this.$history.push({
					path: '/runCode',
					query: {
						path: 'contractHandleForm',
						id: row.businessKey,
						formId: row.businessType,
						title: row.name
					}
				})
			} else if (+row.businessType === 30) {
				this.$history.push({
					path: '/runCode',
					query: {
						path: 'hireApplyHandleForm',
						id: row.businessKey,
						formId: row.businessType,
						title: row.name
					}
				})
			} else if (+row.businessType === 6 || +row.businessType === 34) {
				this.$history.push({
					path: '/runCode',
					query: {
						path: 'assetsInfoHandleForm',
						id: row.businessKey,
						formId: row.businessType,
						title: row.name
					}
				})
			} else if (+row.businessType === 29) {
				this.$history.push({
					path: '/runCode',
					query: {
						path: 'refundApplicationView',
						id: row.businessKey,
						formId: row.businessType,
						title: row.name
					}
				})
			} else {
				this.$history.push({
					path: '/handleCustomForm',
					query: {
						id: row.businessKey,
						formId: row.businessType,
						title: row.name
					}
				})
			}
		},
		// 流程查看
		handleProcess(row) {
			this.$history.push({
				path: '/flowDisplay',
				query: {
					businessKey: row.businessKey,
					businessType: row.businessType,
					title: row.name
				}
			})
		},
		queryByPage() {
			let params = {
				pageNo: this.pageNo,
				name: this.searchContent.title,
				statusStr: this.searchContent.statusData.join(','),
				businessTypeStr: this.searchContent.businessType.join(','),
				departmentIds: this.searchContent.departmentIds.join(',')
			}
			this.$axios.get('flow/queryTodoItemByPage', { params }).then(res => {
				if (res.data.code === 200) {
					this.tableData = res.data.data.list
					this.total = res.data.data.total
					this.pageSize = res.data.data.pageSize
				} else {
					this.$message.error(res.data.message)
				}
			})
		},
		handleSearch() {
			this.queryByPage()
		},
		handleCurrentChange() {
			this.queryByPage()
		},
		queryBusinessTypes() {
			let params = {
				companyId: localStorage.getItem('companyId')
			}
			this.$axios.get('jellyForm/queryBusinessTypes', { params }).then(res => {
				if (res.data.code === 200) {
					this.businessTypeOptions = res.data.data
				}
			})
		},
		queryDepartmentByCompanyId(companyId) {
			this.$axios.get('department/queryByCompanyId?searchCompanyId=' + companyId).then(res => {
				if (res.data.code == 200) {
					this.departmentOptions = res.data.data
				}
			})

		},

		handleSelectionChange(val) {
			this.multipleSelection = val
		},

		// 审核
		audit() {
			if (this.multipleSelection.length === 0) {
				this.$message.warning('请先选择要审核的数据')
				return
			}
			this.handleForm = {
				status: 1,
				comment: '',
				rejectType: 2
			}
			this.approvalVisible = true
		},

		// 审核提交
		auditSubmit() {
			let businessList = []
			this.multipleSelection.forEach(item => {
				businessList.push({businessType: item.businessType, businessKey: item.businessKey})
			})
			let params = {
				companyId: this.companyId,
				businessList: JSON.stringify(businessList),
				status: this.handleForm.status,
				comment: this.handleForm.comment,
				rejectType: this.handleForm.rejectType,
				isAudit: true,
			}
			this.loading = true
			this.$axios.post('jellyForm/batchAudit', params).then(res => {
				this.loading = false
				if (res.data.code == 200) {
					this.$message.success("共" + res.data.data.total + "条，成功" + res.data.data.success + "条，忽略" + res.data.data.ignore + "条")
					this.approvalVisible = false
					this.pageNo = 1
					this.queryByPage()
				} else {
					this.$message.error(res.data.message)
				}
			})
		},

		handleCommand(command) {
			this.handleForm.comment = command
		},
		showCommonWordsDialog() {
			this.queryCommonWordsAll()
			this.commonWordsVisible = true
		},

		async queryCommonWordsAll() {
			let res = await this.$axios.get('commonWords/queryAll')
			if (res.data.code == 200) {
				this.commonWordsData = res.data.data
				let commonWords = []
				for (let i = 0; i < this.commonWordsData.length; i++) {
					commonWords.push(this.commonWordsData[i].name)
				}
				commonWords.push('同意')
				commonWords.push('交相关部门处理')
				commonWords.push('按单位相关规章制度办理')
				commonWords.push('保留意见')
				commonWords.push('同意，按规定办理')
				commonWords.push('按流程办理')
				this.commonWords = commonWords
			}
		},
		showCommonWordsDialog() {
			this.queryCommonWordsAll()
			this.commonWordsVisible = true
		},
		showCommonWordsAddDialog() {
			this.addCommonWordsVisible = true
			if (this.$refs.addCommonWordsForm) {
				this.$refs.addCommonWordsForm.resetFields()
			}
		},
		addCommonWordsSubmit() {
			let that = this
			this.$refs.addCommonWordsForm.validate(valid => {
				if (valid) {
					that.$axios.post('commonWords/insert', that.addCommonWordsForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('新增成功')
							that.addCommonWordsVisible = false
							that.queryCommonWordsAll()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		showCommonWordsEditDialog(row) {
			this.editCommonWordsForm = Object.assign({}, row)
			this.editCommonWordsVisible = true
			if (this.$refs.editCommonWordsForm) {
				this.$refs.editCommonWordsForm.resetFields()
			}
		},
		editCommonWordsSubmit() {
			let that = this
			this.$refs.editCommonWordsForm.validate(valid => {
				if (valid) {
					that.$axios.post('commonWords/update', that.editCommonWordsForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('修改成功')
							that.editCommonWordsVisible = false
							that.queryCommonWordsAll()
						} else {
							that.$message.error(res.data.message)
						}
					})
				}
			})
		},
		deleteCommonWordsSubmit(row) {
			let that = this
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				that.$axios.post('commonWords/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						that.$message.success('删除成功')
						that.queryCommonWordsAll()
					} else {
						that.$message.error(res.data.message)
					}
				})
			})
		},
	}
}
</script>
