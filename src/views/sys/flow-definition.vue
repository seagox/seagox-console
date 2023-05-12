<template>
	<div>
        <div class="searchView">
            <el-form label-width="60px">
                <el-row :gutter="15">
                    <el-col :span="4">
                        <el-form-item label="名称">
                            <el-input v-model="searchForm.name" clearable placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" c>
                        <el-button icon="el-icon-search" @click="handleSearch">查询</el-button>
						<el-button type="primary" icon="el-icon-plus" @click="showAddDialog">新增</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
		<div class="table">
			<!--列表-->
			<el-table :data="tableData" border>
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="名称" align="center"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="small" @click="designSubmit(scope.row)">设计</el-button>
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
			<el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="数据建模" prop="dataSourceValue">
					<el-select
						v-model="addForm.dataSourceValue"
						filterable
						multiple
						placeholder="请选择数据建模"
						clearable
					>
						<el-option
							v-for="item in dataSourceOptions"
							:key="item.id"
							:label="item.remark + '(' + item.name + ')'"
							:value="String(item.id)"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="授权" prop="empower">
					<div class="inside-input">
						<el-select v-model="addForm.empowerValue" multiple placeholder="请授权">
							<el-option
								v-for="item in memberOptions"
								:key="item.id"
								:label="item.name"
								:value="String(item.id)"
							>
							</el-option>
						</el-select>
						<i class="el-icon-document-copy iconE" @click="handleMember"></i>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="formRules" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="数据建模" prop="dataSourceValue">
					<el-select
						v-model="editForm.dataSourceValue"
						filterable
						multiple
						placeholder="请选择数据建模"
						clearable
					>
						<el-option
							v-for="item in dataSourceOptions"
							:key="item.id"
							:label="item.remark + '(' + item.name + ')'"
							:value="String(item.id)"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="授权" prop="empower">
					<div class="inside-input">
						<el-select v-model="editForm.empowerValue" multiple placeholder="请授权">
							<el-option
								v-for="item in memberOptions"
								:key="item.id"
								:label="item.name"
								:value="String(item.id)"
							>
							</el-option>
						</el-select>
						<i class="el-icon-document-copy iconE" @click="handleMember"></i>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editSubmit">提交</el-button>
			</div>
		</el-dialog>
		<multipleMember ref="multipleMember" @confirm="multipleMemberConfirm"></multipleMember>
	</div>
</template>

<script>
import multipleMember from '@/views/flow/multiple-member'
export default {
	components: {
		multipleMember
	},
	data() {
		return {
			tableData: [],
			pageNo: 1,
			total: 0,
			addFormVisible: false,
			addForm: {
				name: '',
				dataSource: '',
				dataSourceValue: [],
				empower: '',
				empowerValue: []
			},
			editFormVisible: false,
			editForm: {
				id: '',
				name: '',
				dataSource: '',
				dataSourceValue: [],
				empower: '',
				empowerValue: []
			},
			formRules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
			},
			dataSourceOptions: [],
			memberOptions: [],
            searchForm: {
                name: ''
            }
		}
	},
	created() {
		this.queryByPage()
		this.queryBusinessTable()
		this.queryMember()
	},
	methods: {
		queryByPage() {
			let that = this
			const params = {
				pageNo: this.pageNo,
                name: this.searchForm.name
			}
			that.$axios.get('seaDefinition/queryByPage', { params }).then(res => {
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
		async queryBusinessTable() {
			let res = await this.$axios.get('businessTable/queryAll')
			if (res.data.code == 200) {
				this.dataSourceOptions = res.data.data
			}
		},
		async queryMember() {
            let res = await this.$axios.get('user/queryAll')
            if (res.data.code == 200) {
                this.memberOptions = res.data.data
            }
        },
		handleCurrentChange(val) {
			this.queryByPage()
		},
		showAddDialog() {
			this.addFormVisible = true
			if (this.$refs.addForm) {
				this.$refs.addForm.resetFields()
			}
		},
		addSubmit() {
			let that = this
			this.$refs.addForm.validate(valid => {
				if (valid) {
					var params = {
						name: that.addForm.name,
						dataSource: that.addForm.dataSourceValue.toString(),
						empower: that.addForm.empower.toString()
					}
					that.$axios.post('seaDefinition/insert', params).then(res => {
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
		showEditDialog(row) {
			this.editForm = Object.assign({}, row)
			this.editFormVisible = true
			if (this.$refs.editForm) {
				this.$refs.editForm.resetFields()
			}
			this.$set(this.editForm, 'dataSourceValue', this.editForm.dataSource.split(','))
			this.$set(this.editForm, 'empowerValue', this.editForm.empower.split(','))
		},
		editSubmit() {
			let that = this
			this.$refs.editForm.validate(valid => {
				if (valid) {
					var params = {
						id: that.editForm.id,
						name: that.editForm.name,
						dataSource: that.editForm.dataSourceValue.toString(),
						empower: that.editForm.empowerValue.toString()
					}
					that.$axios.post('seaDefinition/update', params).then(res => {
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
		designSubmit(row) {
			this.$router.push({
				path: '/flowDesigner',
				query: {
					id: row.id,
					title: row.name
				}
			})
		},
		deleteSubmit(row) {
			let that = this
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				that.$axios.post('seaDefinition/delete/' + row.id, {}).then(res => {
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
		handleMember() {
			if(this.addFormVisible) {
				this.$refs.multipleMember.showDialog(this.addForm.empowerValue)
			} else {
				this.$refs.multipleMember.showDialog(this.editForm.empowerValue)
			}
		},
		multipleMemberConfirm(data) {
			var empowerValue = []
			for(let i=0;i<data.length;i++) {
				empowerValue.push(data[i].id)
			}
			if(this.addFormVisible) {
				this.addForm.empowerValue = empowerValue
			} else {
				this.editForm.empowerValue = empowerValue
			}
		}
	}
}
</script>
<style scoped>
.inside-input {
    position: relative;
}
.inside-input .iconE {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
}
::v-deep .inside-input .el-input--suffix .el-input__inner {
    padding-right: 48px;
}
::v-deep .inside-input .el-select .el-input__suffix .el-icon-arrow-up {
    display: none;
}
::v-deep .inside-input .el-select .el-input__suffix .el-icon-circle-close {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    color: #c0c4cc;
}
</style>