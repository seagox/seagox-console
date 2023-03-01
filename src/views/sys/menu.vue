<template>
	<div>
		<div class="toolView">
			<el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增</el-button>
		</div>
		<div class="table">
			<!--列表-->
			<el-table
				:data="tableData"
				border
				:max-height="clientHeight - 210"
				row-key="id"
				:tree-props="{ children: 'children' }"
			>
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column prop="name" label="菜单名称" header-align="center">
					<template slot-scope="scope">
						<i v-html="scope.row.icon"></i>
						{{ scope.row.name }}
					</template>
				</el-table-column>
				<el-table-column label="类型" align="center" :formatter="typeFormatter"></el-table-column>
				<el-table-column
					prop="path"
					label="菜单路径"
					align="center"
					show-overflow-tooltip
					:formatter="pathFormatter"
				></el-table-column>
				<el-table-column prop="sort" label="排序" align="center"></el-table-column>
				<el-table-column prop="status" label="状态" align="center">
					<template slot-scope="scope">
						<el-switch
							v-model="scope.row.status"
							active-color="#13ce66"
							inactive-color="#ff4949"
							:active-value="1"
							:inactive-value="2"
							@change="statusChange(scope.row, $event)"
						>
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!--新增界面-->
		<el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
				<el-row>
					<el-col :span="24">
						<el-form-item label="类型" prop="type">
							<el-select v-model="addForm.type" placeholder="请选择类型" @change="typeChange">
								<el-option
									v-for="item in typeOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="名称" prop="name">
							<el-input v-model.trim="addForm.name" placeholder="请输入名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="简称" prop="quickName">
							<el-input v-model="addForm.quickName" placeholder="请输入简称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上级菜单" prop="parentId">
							<el-cascader
								v-model="addForm.parentId"
								:options="tableData"
								:props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }"
								clearable
								placeholder="请选择上级"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="addForm.type === 2 || addForm.type === 4 || addForm.type === 7 || addForm.type === 9">
						<el-form-item label="路径" prop="path">
							<el-input v-model="addForm.path" placeholder="请输入路径"></el-input>
						</el-form-item>
					</el-col>
					<el-col
						:span="12"
						v-if="addForm.type === 1 || addForm.type === 3 || addForm.type === 6 || addForm.type === 8"
					>
						<el-form-item label="路径" prop="path">
							<el-select v-model="addForm.path" placeholder="请选择路径" filterable>
								<el-option
									v-for="item in frgOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="图标" prop="icon">
                            <div class="inside-input">
                                <div class="iconView">
                                    <div v-html="addForm.icon"></div>
                                </div>
                                <i class="el-icon-document-copy iconE" @click="handleIconDialog"></i>
                            </div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序">
							<el-input-number v-model="addForm.sort" :min="1"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态">
							<el-switch v-model="addForm.status" :active-value="1" :inactive-value="2"> </el-switch>
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
					<el-col :span="24">
						<el-form-item label="类型" prop="type">
							<el-select v-model="editForm.type" placeholder="请选择类型" @change="typeChange">
								<el-option
									v-for="item in typeOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="名称" prop="name">
							<el-input v-model.trim="editForm.name" placeholder="请输入名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="简称" prop="quickName">
							<el-input v-model="editForm.quickName" placeholder="请输入简称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="上级菜单" prop="parentId">
							<el-cascader
								v-model="editForm.parentId"
								:options="tableData"
								:props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }"
								clearable
								placeholder="请选择上级"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="editForm.type === 2 || editForm.type === 4 || editForm.type === 7 || editForm.type === 9">
						<el-form-item label="路径" prop="path">
							<el-input v-model="editForm.path" placeholder="请输入路径"></el-input>
						</el-form-item>
					</el-col>
					<el-col
						:span="12"
						v-if="editForm.type === 1 || editForm.type === 3 || editForm.type === 6 || editForm.type === 8"
					>
						<el-form-item label="路径" prop="path">
							<el-select v-model="editForm.path" placeholder="请选择路径">
								<el-option
									v-for="item in frgOptions"
									:key="item.id"
									:label="item.name"
									:value="String(item.id)"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
                        <el-form-item label="图标" prop="icon">
                            <div class="inside-input">
                                <div class="iconView">
                                    <div v-html="editForm.icon"></div>
                                </div>
                                <i class="el-icon-document-copy iconE" @click="handleIconDialog"></i>
                            </div>
                        </el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="排序">
							<el-input-number v-model="editForm.sort" :min="1"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态">
							<el-switch v-model="editForm.status" :active-value="1" :inactive-value="2"> </el-switch>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editSubmit">提交</el-button>
			</div>
		</el-dialog>

        <!--图标选择界面-->
        <el-dialog title="图标选择" width="950px" :visible.sync="iconFormVisible" :close-on-click-modal="false">
            <div class="searchView">
                <el-form label-width="65px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="名称">
                                <el-input v-model="searchIconName" clearable placeholder="请输入名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-button
                                type="primary"
                                icon="el-icon-search"
                                @click.native="handleCurrentChange"
                                style="margin-left: 15px"
                            >查询</el-button
                            >
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <el-scrollbar style="height:100%">
                <el-row>
                    <el-col
                        :span="4"
                        v-for="(item, index) in iconData"
                        :key="index"
                        style="margin-bottom: 20px; cursor: pointer;"
                    >
                        <el-card shadow="hover">
                            <div @click="handleIconClick(item)">
                                <i v-html="item.content"></i>
                                <span style="margin-left: 30px;">{{ item.name }}</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-scrollbar>
            <!--分页-->
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :current-page.sync="pageNo"
                    :page-size.sync="pageSize"
                    :total="total"
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
			clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
			typeOptions: [
				{
					value: 1,
					label: '列表'
				},
				{
					value: 2,
					label: '按钮'
				},
				{
					value: 3,
					label: '新增页面'
				},
				{
					value: 4,
					label: '系统菜单'
				},
				{
					value: 5,
					label: '目录'
				},
				{
					value: 6,
					label: '仪表板'
				},
				{
					value: 7,
					label: '自定义页面'
				},
				{
					value: 8,
					label: '报表'
				},
				{
					value: 9,
					label: '单页面'
				}
			],
			tableData: [],
			addFormVisible: false,
			addForm: {
				companyId: '',
				type: '',
				name: '',
				parentId: '',
				icon: '',
				path: '',
				status: 1,
				sort: 1,
				quickName: ''
			},
			editFormVisible: false,
			editForm: {
				id: '',
				companyId: '',
				type: '',
				name: '',
				parentId: '',
				icon: '',
				path: '',
				status: 1,
				sort: 1,
				quickName: ''
			},
			formRules: {
				type: [{ required: true, message: '请选择类型', trigger: 'change' }],
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				path: [{ required: true, message: '请输入路径', trigger: 'blur,change' }],
				icon: [{ required: true, message: '请选择图标', trigger: 'change' }],
				quickName: [{ max: 30, message: '简称不超过30个字符', trigger: 'blur' }]
			},
			frgOptions: [],
            iconOptions: [],
            iconFormVisible: false,
            pageSize: 30,
            pageNo: 1,
            total: 0,
            searchIconName: '',
            iconData: []
		}
	},
	created() {
		this.queryByCompanyId()
	},
	methods: {
		async queryByCompanyId() {
			const res = await this.$axios.get('menu/queryByCompanyId')
			if (res.data.code == 200) {
				this.tableData = res.data.data
			}
		},
		async queryForm() {
			const res = await this.$axios.get('jellyForm/queryByCompanyId')
			if (res.data.code == 200) {
				this.frgOptions = res.data.data
			}
		},
		async queryGauge() {
			const res = await this.$axios.get('gauge/queryByCompanyId')
			if (res.data.code == 200) {
				this.frgOptions = res.data.data
			}
		},
		async queryReport() {
			const res = await this.$axios.get('jellyReport/queryByCompanyId')
			if (res.data.code == 200) {
				this.frgOptions = res.data.data
			}
		},
		typeFormatter(row) {
			if (row.type === 1) {
				return '列表'
			} else if (row.type === 2) {
				return '按钮'
			} else if (row.type === 3) {
				return '新增页面'
			} else if (row.type === 4) {
				return '系统菜单'
			} else if (row.type === 5) {
				return '目录'
			} else if (row.type === 6) {
				return '仪表板'
			} else if (row.type === 7) {
				return '自定义页面'
			} else if (row.type === 8) {
				return '报表'
			} else if (row.type === 9) {
				return '单页面'
			}
		},
		pathFormatter(row) {
			if (row.type === 1 || row.type === 3 || row.type === 6 || row.type === 8) {
				return ''
			} else {
				return row.path
			}
		},
		typeChange(value) {
			if (value === 1 || value === 3) {
				this.queryForm()
			} else if (value === 6) {
				this.queryGauge()
			} else if (value === 8) {
				this.queryReport()
			}
			if (this.addFormVisible) {
				this.addForm.path = ''
			} else {
				this.editForm.path = ''
			}
		},
		statusChange(row, value) {
			let that = this
			var params = {
				id: row.id,
				status: value,
				parentId: row.parent_id
			}
			that.$axios.post('menu/update', params).then(res => {
				if (res.data.code == 200) {
					if (value === 1) {
						that.$message.success('启用成功')
					} else {
						that.$message.success('禁用成功')
					}
				} else {
					that.$message.error(res.data.message)
				}
			})
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
					that.$axios.post('menu/insert', that.addForm).then(res => {
						if (res.data.code == 200) {
							that.$message.success('新增成功')
							that.addFormVisible = false
							that.queryByCompanyId()
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
			if (this.editForm.type === 1 || this.editForm.type === 3) {
				this.queryForm()
			} else if (this.editForm.type === 6) {
				this.queryGauge()
			} else if (this.editForm.type === 8) {
				this.queryReport()
			}
		},
		editSubmit() {
			let that = this
			this.$refs.editForm.validate(valid => {
				if (valid) {
					var params = {
						icon: that.editForm.icon,
						id: that.editForm.id,
						type: that.editForm.type,
						name: that.editForm.name,
						path: that.editForm.path,
						sort: that.editForm.sort,
						status: that.editForm.status,
						parentId: that.editForm.parentId,
						quickName: that.editForm.quickName
					}
					that.$axios.post('menu/update', params).then(res => {
						if (res.data.code == 200) {
							that.$message.success('修改成功')
							that.editFormVisible = false
							that.queryByCompanyId()
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
				that.$axios.post('menu/delete/' + row.id, {}).then(res => {
					if (res.data.code == 200) {
						that.$message.success('删除成功')
						that.pageNo = 1
						that.queryByCompanyId()
					} else {
						that.$message.error(res.data.message)
					}
				})
			})
		},
        queryIconByPage(){
            let that = this
            var params = {
                pageSize: this.pageSize,
                pageNo: this.pageNo,
                name: this.searchIconName
            }
            that.$axios.get('jellySvg/queryByPage', {params}).then(res => {
                if (res.data.code == 200) {
                    this.iconData = res.data.data.list
                    this.total = res.data.data.total
                }
            })
        },
        handleCurrentChange(){
            this.queryIconByPage()
        },
        handleIconDialog(){
		    this.queryIconByPage()
            this.iconFormVisible = true
        },
        handleIconClick(item){
		    if (this.addFormVisible){
                this.addForm.icon = item.content
            } else {
				this.editForm.icon = item.content
			}
            this.iconFormVisible = false
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
    color: #c0c4cc;
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
.iconView{
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 0px 20px;
    height: 40px;
}
</style>
