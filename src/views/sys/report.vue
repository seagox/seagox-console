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
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleCopy(scope.row)">复制</el-button>
                        <el-divider direction="vertical"></el-divider>
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
				name: ''
			}
        }
    },
    created() {
        this.queryByPage()
    },
    methods: {
        queryByPage() {
            let that = this
            const params = {
                pageNo: this.pageNo,
				name: this.searchForm.name
            }
            that.$axios.get('jellyReport/queryByPage', { params }).then(res => {
                if (res.data.code == 200) {
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
                }
            })
        },
		handleSearch() {
			this.pageNo = 1
			this.queryByPage()
		},
        handleCurrentChange() {
            this.queryByPage()
        },
        showAddDialog() {
            this.$router.push('/addReport')
        },
        showEditDialog(row) {
            this.$router.push({ path: '/editReport', query: { id: row.id } })
        },
        deleteSubmit(row) {
            this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
                this.$axios.post('jellyReport/delete/' + row.id, {}).then(res => {
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
        handleCopy(row) {
            var params = {
                name: row.name + '_copy',
                icon: row.icon,
                color: row.color,
                templateSource: row.templateSource,
                dataSource: row.dataSource,
                searchJson: row.searchJson,
                exportPath: row.exportPath
            }
            this.$axios.post('jellyReport/insert', params).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('复制成功')
                    this.pageNo = 1
                    this.queryByPage()
                } else {
                    this.$message.error(res.data.message)
                }
            })
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
