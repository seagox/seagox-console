<template>
	<div>
		<div class="toolView">
			<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
		</div>
		<div class="searchView">
			<el-form label-width="65px">
				<el-row>
					<el-col :span="6">
						<el-form-item label="名称">
							<el-input v-model="searchForm.name" clearable placeholder="请输入名称"></el-input>
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
				<el-table-column prop="name" label="名称" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column label="操作" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="handleDesign(scope.row)">设计</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-dropdown @command="handleCommand($event, scope.row)">
							<el-button type="text" size="small">
								更多<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="print">打印模版</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
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
		<!--打印模版-->
		<el-dialog title="打印模版" width="500px" :visible.sync="printVisible" :close-on-click-modal="false">
			<el-form>
				<el-form-item>
					<el-select v-model="detailExportPath" placeholder="请选择打印模版" clearable>
						<el-option
							v-for="item in printOptions"
							:key="item.id"
							:label="item.name"
							:value="String(item.id)"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="printVisible = false">取消</el-button>
				<el-button type="primary" @click="printVisibleSubmit">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
			tableData: [],
			pageNo: 1,
			total: 0,
			searchForm: {
				name: ''
			},
			currentRow: null,
			printOptions: [],
			printVisible: false,
			detailExportPath: '',
		}
	},
	created() {
		this.queryByPage()
		this.queryPrintList()
	},
	methods: {
		async queryByPage() {
			const params = {
				pageNo: this.pageNo,
				name: this.searchForm.name
			}
			let res = await this.$axios.get('jellyForm/queryByPage', { params })
			if (res.data.code == 200) {
				this.tableData = res.data.data.list
				this.total = res.data.data.total
			}
		},
		async queryPrintList() {
			let res = await this.$axios.get('jellyPrint/queryAll')
			if (res.data.code == 200) {
				this.printOptions = res.data.data
			}
		},
		handleSearch() {
			this.pageNo = 1
			this.queryByPage()
		},
		handleCurrentChange() {
			this.queryByPage()
		},
		showAddDialog() {
			this.$router.push('/addForm')
		},
		showEditDialog(row) {
			this.$router.push({ path: '/editForm', query: { id: row.id } })
		},
		deleteSubmit(row) {
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				this.$axios.post('jellyForm/delete/' + row.id, {}).then(res => {
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
		handleCommand(command, row) {
			this.currentRow = row
			if (command === 'print') {
				this.printVisible = true
				this.detailExportPath = row.detailExportPath
			}
		},
		printVisibleSubmit() {
			let params = this.currentRow
			params.detailExportPath = this.detailExportPath
			this.$axios.post('jellyForm/update', params).then(res => {
				if (res.data.code == 200) {
					this.$message.success('配置成功')
					this.printVisible = false
					this.queryByPage()
				} else {
					this.$message.error(res.data.message)
				}
			})
		},
		handleDesign(row) {
			this.$router.push({ path: '/simplifyDesign', query: { id: row.id } })
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
