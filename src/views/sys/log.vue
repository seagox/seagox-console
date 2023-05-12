<template>
	<div>
		<div class="searchView">
			<el-form label-width="60px">
				<el-row :gutter="15">
					<el-col :span="4">
						<el-form-item label="账户">
							<el-input v-model="searchForm.account" clearable placeholder="请输入账户"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="名称">
							<el-input v-model="searchForm.name" clearable placeholder="请输入名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div class="table">
			<!--列表-->
			<el-table :data="tableData" border highlight-current-row stripe>
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="account" label="账户" align="center"></el-table-column>
				<el-table-column prop="name" label="名称" align="center"></el-table-column>
				<el-table-column prop="ip" label="IP" align="center"></el-table-column>
				<el-table-column prop="ua" label="浏览器" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="uri" label="地址" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					align="center"
					:formatter="statusFormatter"
				></el-table-column>
				<el-table-column prop="createTime" label="操作时间" align="center" width="175"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-view" size="small" @click="showDetailDialog(scope.row)"
							>详情</el-button
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
		<!--详情界面-->
		<el-dialog title="详情" width="750px" :visible.sync="formVisible" :close-on-click-modal="false">
			<el-form :model="form" label-width="80px" ref="form">
				<el-form-item label="调用方法">
					<el-input v-model="form.method" disabled></el-input>
				</el-form-item>
				<el-form-item label="请求参数">
					<json-viewer :value="form.params" copyable boxed></json-viewer>
				</el-form-item>
				<el-form-item label="操作结果">
					<json-viewer :value="form.result" copyable boxed></json-viewer>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import JsonViewer from 'vue-json-viewer'
export default {
	components: {
		JsonViewer
  	},
	data() {
		return {
			tableData: [],
			pageNo: 1,
			total: 0,
			searchForm: {
				account: '',
				name: ''
			},
			formVisible: false,
			form: {
				name: '',
				path: '',
				dataAuthority: ''
			}
		}
	},
	mounted() {
		this.queryByPage()
	},
	methods: {
		queryByPage() {
			let that = this
			const params = {
				pageNo: this.pageNo,
				account: this.searchForm.account,
				name: this.searchForm.name
			}
			that.$axios.get('log/queryByPage', { params }).then(res => {
				if (res.data.code == 200) {
					that.tableData = res.data.data.list
					that.total = res.data.data.total
				}
			})
		},
		// 翻页
		handleCurrentChange(val) {
			this.queryByPage()
		},
		//显示详情界面
		showDetailDialog(row) {
			this.form = Object.assign({}, row)
			this.form.params = JSON.parse(this.form.params)
			this.form.result = JSON.parse(this.form.result)
			this.formVisible = true
			if (this.$refs.form) {
				this.$refs.form.resetFields()
			}
		},
		handleSearch() {
			this.pageNo = 1
			this.queryByPage()
		},
		statusFormatter(obj) {
			if (obj.status === 1) {
				return '成功'
			} else {
				return '失败'
			}
		}
	}
}
</script>