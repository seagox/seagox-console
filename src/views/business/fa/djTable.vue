<template>
	<div class="container">
		<div class="searchView">
			<el-form :model="searchForm" label-width="80px">
				<el-row>
					<el-col :span="6">
						<el-form-item label="单据日期">
							<el-date-picker
									v-model="searchForm.year"
									value-format="yyyy-MM-dd"
									type="daterange"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
					</el-col>

					<el-col :span="5">
						<el-form-item label="资产编码">
							<el-input v-model="searchForm.zcCode"></el-input>
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
			<el-table :data="tableData" max-height="500" border stripe>
				<el-table-column type="index" label="序号"  align="center"></el-table-column>
				<el-table-column prop="djDate" label="单据日期" align="center"></el-table-column>
				<el-table-column prop="bdDate" label="变动期间" align="center" ></el-table-column>
				<el-table-column prop="djCode" label="单据编号" align="center" ></el-table-column>
				<el-table-column prop="reason" label="变动原因"  align="center"></el-table-column>
				<el-table-column prop="contentName" label="变动内容" align="center"></el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button
								type="text"
								size="small"
								@click="showDetailTable(scope.row)"
						>详情</el-button>
						<el-button
								type="text"
								size="small"
								@click="deleteTable(scope.row)"
						>删除</el-button>
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
		<el-dialog
				:visible.sync="detailDialog"
				center
				title="单据明细"
				:append-to-body="true"
				width="60%"
				:close-on-click-modal="false"
		>
			<el-table
					ref="multipleFirst"
					:data="detailTableData"
					border
					height="300"
					highlight-current-row stripe>
				<el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
				<el-table-column align="center" label="资产编码" prop="assetsCode"></el-table-column>
				<el-table-column align="center" label="资产名称" prop="assetsName"></el-table-column>
				<el-table-column align="center" label="变动原因" prop="reason"></el-table-column>
				<el-table-column label="原值" v-if="category=='1'" align="center">
					<el-table-column
							align="center"
							prop="originalValue"
							label="变动前"
					>
					</el-table-column>
					<el-table-column
							align="center"
							prop="originalValue_alter"
							label="变动后"
					>
						<template slot-scope="scope">
							<span v-if="scope.row.originalValue_alter==scope.row.originalValue">{{ scope.row.originalValue_alter }}</span>
							<span v-else style="color: red">{{ scope.row.originalValue_alter }}</span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column label="预计净残值率%" v-if="category=='1' || category=='5'" align="center">
					<el-table-column
							align="center"
							prop="yjjczl"
							label="变动前"
					>
					</el-table-column>
					<el-table-column
							align="center"
							prop="yjjczl_alter"
							label="变动后"
					>
						<template slot-scope="scope">
							<span v-if="scope.row.yjjczl_alter==scope.row.yjjczl">{{ scope.row.yjjczl_alter }}</span>
							<span v-else style="color: red">{{ scope.row.yjjczl_alter }}</span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column label="预计净残值" v-if="category=='1' || category=='5'" align="center">
					<el-table-column
							align="center"
							prop="yjjcz"
							label="变动前"
					>
					</el-table-column>
					<el-table-column
							align="center"
							prop="yjjcz_alter"
							label="变动后"
					>
						<template slot-scope="scope">
							<span v-if="scope.row.yjjcz_alter==scope.row.yjjcz">{{ scope.row.yjjcz_alter }}</span>
							<span v-else style="color: red">{{ scope.row.yjjcz_alter }}</span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column label="累积折旧" v-if="category=='2'" align="center">
					<el-table-column
							align="center"
							prop="ljzjTx"
							label="变动前"
					>
					</el-table-column>
					<el-table-column
							align="center"
							prop="ljzjTx_alter"
							label="变动后"
					>
						<template slot-scope="scope">
							<span v-if="scope.row.ljzjTx_alter==scope.row.ljzjTx">{{ scope.row.ljzjTx_alter }}</span>
							<span v-else style="color: red">{{ scope.row.ljzjTx_alter }}</span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column label="数量" v-if="category=='3'" align="center">
					<el-table-column
							align="center"
							prop="number"
							label="变动前"
					>
					</el-table-column>
					<el-table-column
							align="center"
							prop="number_alter"
							label="变动后"
					>
						<template slot-scope="scope">
							<span v-if="scope.row.number_alter==scope.row.number">{{ scope.row.number_alter }}</span>
							<span v-else style="color: red">{{ scope.row.number_alter }}</span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column align="center" v-if="category=='4'" label="资产类别">
					<el-table-column
							align="center"
							prop="classifName"
							label="变动前"
					>
					</el-table-column>
					<el-table-column
							align="center"
							prop="classifName_alter"
							label="变动后"
					>
						<template slot-scope="scope">
							<span v-if="scope.row.classifName_alter==scope.row.classifName">{{ scope.row.classifName_alter }}</span>
							<span v-else style="color: red">{{ scope.row.classifName_alter }}</span>
						</template>
					</el-table-column>

				</el-table-column>
				<el-table-column label="预计使用年限(月)" v-if="category=='7'" align="center">
					<el-table-column
							align="center"
							prop="totalMonth"
							label="变动前"
					>
					</el-table-column>
					<el-table-column
							align="center"
							prop="totalMonth_alter"
							label="变动后"
					>
						<template slot-scope="scope">
							<span v-if="scope.row.totalMonth_alter==scope.row.totalMonth">{{ scope.row.totalMonth_alter }}</span>
							<span v-else style="color: red">{{ scope.row.totalMonth_alter }}</span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column align="center" v-if="category=='8'" label="使用状况">
					<el-table-column
							align="center"
							prop="syzkName"
							label="变动前"
					>
					</el-table-column>
					<el-table-column
							align="center"
							prop="syzkName_alter"
							label="变动后"
					>
						<template slot-scope="scope">
							<span v-if="scope.row.syzk_alter==scope.row.syzk">{{ scope.row.syzkName_alter  }}</span>
							<span v-else style="color: red">{{ scope.row.syzkName_alter }}</span>
						</template>
					</el-table-column>

				</el-table-column>
				<el-table-column align="center" v-if="category=='6' || category=='8'" label="折旧方法">
					<el-table-column
							align="center"
							prop="zjffName"
							label="变动前"
					>
					</el-table-column>
					<el-table-column
							align="center"
							prop="zjffName_alter"
							label="变动后"
					>
						<template slot-scope="scope">
							<span v-if="scope.row.zjffName_alter==scope.row.zjffName">{{ scope.row.zjffName_alter }}</span>
							<span v-else style="color: red">{{ scope.row.zjffName_alter }}</span>
						</template>
					</el-table-column>

				</el-table-column>
				<el-table-column label="计提方式" v-if="category=='8'" align="center">
					<el-table-column
							align="center"
							prop="jtfs"
							label="变动前"
					>
					</el-table-column>
					<el-table-column
							align="center"
							prop="jtfs"
							label="变动后"
					>
						<template slot-scope="scope">
							<span v-if="scope.row.jtfs_alter==scope.row.jtfs">{{ scope.row.jtfs_alter }}</span>
							<span v-else style="color: red">{{ scope.row.jtfs_alter }}</span>
						</template>
					</el-table-column>
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="pagination">
				<el-pagination
						:current-page.sync="detailPageNo"
						:total="detailTotal"
						background
						layout="total, prev, pager, next"
						@current-change="handleDetailChange"
				>
				</el-pagination>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {

		data() {
			return {
				searchForm: {
					year:'',
					zcCode: '',
				},
				detailDialog:false,
				tableData: [],
				detailTableData:[],
				detailTotal:0,
				detailPageNo:1,
				pageNo: 1,
				total: 0,
				_databaseId: '',
				category:0,
				djId:0
			}
		},
		created() {
			this._databaseId = localStorage.getItem('_databaseId')
			this.queryByPage()
		},
		methods: {
			deleteTable(row){
				this.$confirm('确定要删除该单据吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log(row)
					let params = {
						id:row.id,
						djDate:row.djDate
					}
					this.$axios.post('/cloud/entrance/deleteDjChange', params).then(res => {
						if (res.data.code == 200) {
							this.$message.success("删除成功")
							this.queryByPage()
						}else{
							this.$message({
								dangerouslyUseHTMLString: true,
								message: res.data.message,
								type: 'warning'
							});
						}
					})

				})
			},
			showDetailTable(row){
				if (row!=undefined){
					this.detailPageNo=1
					this.djId=row.id
					this.category = row.content
				}
				const params = {
					pageNo: this.detailPageNo,
					djId:this.djId
				}

				this.$axios.post('/cloud/entrance/getDetailTable', params).then(res => {
					if (res.data.code == 200) {
						this.detailTotal=res.data.data.total
						this.detailTableData = res.data.data.list
					}
				})
				this.detailDialog=true
			},
			handleDetailChange(val){
				this.detailPageNo = val
				this.showDetailTable()
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

			//查询列表
			queryByPage() {
				let startDate;
				let endDate;
				if (this.searchForm.year){
					startDate = this.searchForm.year[0]
					endDate = this.searchForm.year[1]
				}
				const params = {
					pageNo: this.pageNo,
					startDate: startDate,
					endDate: endDate,
					zcCode:this.searchForm.zcCode,
					_databaseId: this._databaseId
				}
				this.$axios.post('/cloud/entrance/getDjInfo', params).then(res => {
					if (res.data.code == 200) {
						this.tableData = res.data.data.list
						this.total = res.data.data.total
					}
				})
			},
		}
	}
</script>
<style scoped>
	.container {
		padding: 15px;
	}
	.el-main {
		border-left: 0px solid #e5e9f2;
		padding: 0px;
		margin-left: 15px;
	}
	.el-table__body tr.current-row td:not(.is-center) {
		border-top-left-radius: 8px !important;
		border-bottom-left-radius: 8px !important;
	}
	.importBtn {
		border-bottom: 1px solid #e5e9f2;
		margin: 0 0 15px 15px;
		padding: 0 0 10px 0;
	}
</style>
