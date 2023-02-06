<template>
	<div>
		<div class="toolView" style="padding-top:15px">
			<el-form label-width="80px">
				<el-row>
					<el-col :span="6">
						<el-form-item label="账户">
							<el-input v-model="searchForm.account" clearable placeholder="请输入账户"></el-input>
						</el-form-item>
					</el-col>
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
							style="margin-left:15px"
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
				<el-form-item label="调用方法" prop="account">
					<el-input v-model="form.method" disabled></el-input>
				</el-form-item>
				<el-form-item label="请求参数" prop="name">
					<el-input v-model="form.params" type="textarea" autosize disabled></el-input>
				</el-form-item>
				<el-form-item label="操作结果" prop="result">
					<el-input v-model="form.result" type="textarea" autosize disabled></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="formVisible = false">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
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