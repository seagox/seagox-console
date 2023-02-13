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
						<el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="small" @click="deleteSubmit(scope.row)">删除</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-dropdown @command="handleCommand($event, scope.row)">
							<el-button type="text" size="small">
								更多<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="authority">权限配置</el-dropdown-item>
								<el-dropdown-item command="rule">业务规则</el-dropdown-item>
								<el-dropdown-item command="detail">详情路由</el-dropdown-item>
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
		<!--业务规则-->
		<el-dialog title="业务规则" width="900px" :visible.sync="businessRuleVisible" :close-on-click-modal="false">
			<el-form :model="businessRuleForm" label-width="100px" ref="businessRuleForm">
				<el-col :span="12">
					<el-form-item label="新增前规则">
						<el-select
							v-model="businessRuleForm.insertBeforeRule"
							filterable
							clearable
							placeholder="请选择新增前规则"
						>
							<el-option
								v-for="item in businessRuleOptions"
								:key="item.id"
								:label="item.name"
								:value="String(item.id)"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="新增后规则">
						<el-select
							v-model="businessRuleForm.insertAfterRule"
							filterable
							clearable
							placeholder="请选择新增后规则"
						>
							<el-option
								v-for="item in businessRuleOptions"
								:key="item.id"
								:label="item.name"
								:value="String(item.id)"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="更新前规则">
						<el-select
							v-model="businessRuleForm.updateBeforeRule"
							filterable
							clearable
							placeholder="请选择更新前规则"
						>
							<el-option
								v-for="item in businessRuleOptions"
								:key="item.id"
								:label="item.name"
								:value="String(item.id)"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="更新后规则">
						<el-select
							v-model="businessRuleForm.updateAfterRule"
							filterable
							clearable
							placeholder="请选择更新后规则"
						>
							<el-option
								v-for="item in businessRuleOptions"
								:key="item.id"
								:label="item.name"
								:value="String(item.id)"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="删除前规则">
						<el-select
							v-model="businessRuleForm.deleteBeforeRule"
							filterable
							clearable
							placeholder="请选择删除前规则"
						>
							<el-option
								v-for="item in businessRuleOptions"
								:key="item.id"
								:label="item.name"
								:value="String(item.id)"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="删除后规则">
						<el-select
							v-model="businessRuleForm.deleteAfterRule"
							filterable
							clearable
							placeholder="请选择删除后规则"
						>
							<el-option
								v-for="item in businessRuleOptions"
								:key="item.id"
								:label="item.name"
								:value="String(item.id)"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="流程结束后">
						<el-select
							v-model="businessRuleForm.processEndRule"
							filterable
							clearable
							placeholder="请选择流程结束后规则"
						>
							<el-option
								v-for="item in businessRuleOptions"
								:key="item.id"
								:label="item.name"
								:value="String(item.id)"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="弃审规则">
						<el-select
							v-model="businessRuleForm.abandonRule"
							filterable
							clearable
							placeholder="请选择弃审规则"
						>
							<el-option
								v-for="item in businessRuleOptions"
								:key="item.id"
								:label="item.name"
								:value="String(item.id)"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="导出规则">
						<el-select
							v-model="businessRuleForm.exportRule"
							filterable
							clearable
							placeholder="请选择导出规则"
						>
							<el-option
								v-for="item in businessRuleOptions"
								:key="item.id"
								:label="item.name"
								:value="String(item.id)"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="businessRuleVisible = false">取消</el-button>
				<el-button type="primary" @click="businessRuleSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--详情路由-->
		<el-dialog title="详情路由" width="750px" :visible.sync="routerVisible" :close-on-click-modal="false">
			<el-form>
				<el-form-item>
					<codemirrorJavascript
						ref="codemirror"
						v-model="routerScript"
						v-if="routerVisible"
						placeholder="请输入脚本"
					/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="routerVisible = false">取消</el-button>
				<el-button type="primary" @click="routerSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--权限设置-->
		<el-dialog title="权限设置" width="750px" :visible.sync="authorityVisible" :close-on-click-modal="false">
			<el-form :model="authorityForm" label-width="60px">
				<el-tabs v-model="authorityActiveName">
					<el-tab-pane label="新增" name="add">
						<el-form-item label="角色" style="margin-top:15px">
							<el-select v-model="authorityForm.addRoleValue" multiple placeholder="请选择角色">
								<el-option
									v-for="item in roleOptions"
									:key="item.id"
									:label="item.name"
									:value="String(item.id)"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="编辑" name="edit">
						<el-form-item label="角色" style="margin-top:15px">
							<el-select v-model="authorityForm.editRoleValue" multiple placeholder="请选择角色">
								<el-option
									v-for="item in roleOptions"
									:key="item.id"
									:label="item.name"
									:value="String(item.id)"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="删除" name="delete">
						<el-form-item label="角色" style="margin-top:15px">
							<el-select v-model="authorityForm.deleteRoleValue" multiple placeholder="请选择角色">
								<el-option
									v-for="item in roleOptions"
									:key="item.id"
									:label="item.name"
									:value="String(item.id)"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="导出" name="export">
						<el-form-item label="角色" style="margin-top:15px">
							<el-select v-model="authorityForm.exportRoleValue" multiple placeholder="请选择角色">
								<el-option
									v-for="item in roleOptions"
									:key="item.id"
									:label="item.name"
									:value="String(item.id)"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="激活" name="open">
						<el-form-item label="角色" style="margin-top:15px">
							<el-select v-model="authorityForm.openRoleValue" multiple placeholder="请选择角色">
								<el-option
									v-for="item in roleOptions"
									:key="item.id"
									:label="item.name"
									:value="String(item.id)"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="关闭" name="close">
						<el-form-item label="角色" style="margin-top:15px">
							<el-select v-model="authorityForm.closeRoleValue" multiple placeholder="请选择角色">
								<el-option
									v-for="item in roleOptions"
									:key="item.id"
									:label="item.name"
									:value="String(item.id)"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="数据权限" name="dataAuthority">
						<el-tabs v-model="dataAuthorityActiveName">
							<el-tab-pane label="查看本公司" name="company">
								<el-form-item label="角色" style="margin-top:15px">
									<el-select
										v-model="authorityForm.dataAuthority.company"
										multiple
										placeholder="请选择角色"
									>
										<el-option
											v-for="item in roleOptions"
											:key="item.id"
											:label="item.name"
											:value="String(item.id)"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="查看本部门" name="deptment">
								<el-form-item label="角色" style="margin-top:15px">
									<el-select
										v-model="authorityForm.dataAuthority.deptment"
										multiple
										placeholder="请选择角色"
									>
										<el-option
											v-for="item in roleOptions"
											:key="item.id"
											:label="item.name"
											:value="String(item.id)"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
						</el-tabs>
					</el-tab-pane>
					<el-tab-pane label="禁用按钮" name="disabledButton">
						<el-tabs v-model="disabledButtonActiveName">
							<el-tab-pane label="暂存" name="temp">
								<el-form-item label="角色" style="margin-top:15px">
									<el-select
										v-model="authorityForm.disabledButton.temp"
										multiple
										placeholder="请选择角色"
									>
										<el-option
											v-for="item in roleOptions"
											:key="item.id"
											:label="item.name"
											:value="String(item.id)"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="提交" name="submit">
								<el-form-item label="角色" style="margin-top:15px">
									<el-select
										v-model="authorityForm.disabledButton.submit"
										multiple
										placeholder="请选择角色"
									>
										<el-option
											v-for="item in roleOptions"
											:key="item.id"
											:label="item.name"
											:value="String(item.id)"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="审批" name="audit">
								<el-form-item label="角色" style="margin-top:15px">
									<el-select
										v-model="authorityForm.disabledButton.audit"
										multiple
										placeholder="请选择角色"
									>
										<el-option
											v-for="item in roleOptions"
											:key="item.id"
											:label="item.name"
											:value="String(item.id)"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="流程查看" name="seaView">
								<el-form-item label="角色" style="margin-top:15px">
									<el-select
										v-model="authorityForm.disabledButton.seaView"
										multiple
										placeholder="请选择角色"
									>
										<el-option
											v-for="item in roleOptions"
											:key="item.id"
											:label="item.name"
											:value="String(item.id)"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="弃审" name="abandon">
								<el-form-item label="角色" style="margin-top:15px">
									<el-select
										v-model="authorityForm.disabledButton.abandon"
										multiple
										placeholder="请选择角色"
									>
										<el-option
											v-for="item in roleOptions"
											:key="item.id"
											:label="item.name"
											:value="String(item.id)"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="退回上一节点" name="backFront">
								<el-form-item label="角色" style="margin-top:15px">
									<el-select
										v-model="authorityForm.disabledButton.backFront"
										multiple
										placeholder="请选择角色"
									>
										<el-option
											v-for="item in roleOptions"
											:key="item.id"
											:label="item.name"
											:value="String(item.id)"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="退回初始节点" name="backStart">
								<el-form-item label="角色" style="margin-top:15px">
									<el-select
										v-model="authorityForm.disabledButton.backStart"
										multiple
										placeholder="请选择角色"
									>
										<el-option
											v-for="item in roleOptions"
											:key="item.id"
											:label="item.name"
											:value="String(item.id)"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="删除" name="delete">
								<el-form-item label="角色" style="margin-top:15px">
									<el-select
										v-model="authorityForm.disabledButton.delete"
										multiple
										placeholder="请选择角色"
									>
										<el-option
											v-for="item in roleOptions"
											:key="item.id"
											:label="item.name"
											:value="String(item.id)"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="打印" name="print">
								<el-form-item label="角色" style="margin-top:15px">
									<el-select
										v-model="authorityForm.disabledButton.print"
										multiple
										placeholder="请选择角色"
									>
										<el-option
											v-for="item in roleOptions"
											:key="item.id"
											:label="item.name"
											:value="String(item.id)"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
							<el-tab-pane label="撤回" name="recall">
								<el-form-item label="角色" style="margin-top:15px">
									<el-select
										v-model="authorityForm.disabledButton.recall"
										multiple
										placeholder="请选择角色"
									>
										<el-option
											v-for="item in roleOptions"
											:key="item.id"
											:label="item.name"
											:value="String(item.id)"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
						</el-tabs>
					</el-tab-pane>
					<el-tab-pane label="禁用字段" name="disabledField">
						<el-tabs v-model="disabledFieldActiveName">
							<el-tab-pane
								v-for="(item, index) in roleOptions"
								:key="index"
								:label="item.name"
								:name="item.name"
							>
								<el-form-item label="禁用字段" label-width="80px" style="margin-top:15px">
									<el-select
										v-model="authorityForm.disabledField[item.id + '']"
										multiple
										placeholder="请选择禁用字段"
									>
										<el-option
											v-for="item in formFieldOptions"
											:key="item.id"
											:label="item.comment"
											:value="item.name"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-tab-pane>
						</el-tabs>
					</el-tab-pane>
					<el-tab-pane label="其他" name="generateType">
						<el-form-item label="生成类型" style="margin-top:15px" label-width="70px">
							<el-radio-group v-model="authorityForm.generateType" size="medium">
								<el-radio-button label="view">页面</el-radio-button>
								<el-radio-button label="dialog">弹窗</el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-tab-pane>
				</el-tabs>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="authorityVisible = false">取消</el-button>
				<el-button type="primary" @click="authorityVisibleSubmit">提交</el-button>
			</div>
		</el-dialog>
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
import codemirrorJavascript from '@/views/components/codemirror/javascript'
export default {
	components: {
		codemirrorJavascript
	},
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
			businessRuleVisible: false,
			businessRuleForm: {
				id: '',
				insertBeforeRule: '',
				insertAfterRule: '',
				updateBeforeRule: '',
				updateAfterRule: '',
				deleteBeforeRule: '',
				deleteAfterRule: '',
				processEndRule: '',
				abandonRule: '',
				exportRule: ''
			},
			businessRuleOptions: [],
			routerVisible: false,
			routerScript: '',
			copySourceOptions: [],
			fieldOptions: [],
			authorityVisible: false,
			roleOptions: [],
			authorityActiveName: 'add',
			authorityForm: {
				addRoleValue: [],
				editRoleValue: [],
				deleteRoleValue: [],
				exportRoleValue: [],
				openRoleValue: [],
				closeRoleValue: [],
				generateType: 'dialog',
				dataAuthority: {
					company: [],
					deptment: []
				},
				disabledButton: {
					temp: [],
					submit: [],
					audit: [],
					seaView: [],
					abandon: [],
					backFront: [],
					backStart: [],
					delete: [],
					print: [],
					recall: []
				},
				disabledField: {}
			},
			printOptions: [],
			printVisible: false,
			detailExportPath: '',
			dataAuthorityActiveName: 'company',
			disabledButtonActiveName: 'temp',
			disabledFieldActiveName: '',
			formFieldOptions: []
		}
	},
	created() {
		this.queryByPage()
		this.queryBusinessRule()
		this.queryRole()
		this.queryPrintList()
	},
	methods: {
		async queryRole() {
			let res = await this.$axios.get('role/queryAll')
			if (res.data.code == 200) {
				this.roleOptions = res.data.data
			}
		},
		async queryPrintList() {
			let res = await this.$axios.get('jellyPrint/queryAll')
			if (res.data.code == 200) {
				this.printOptions = res.data.data
			}
		},
		async queryBusinessRule() {
			let res = await this.$axios.get('metaFunction/queryByCompanyId')
			if (res.data.code == 200) {
				this.businessRuleOptions = res.data.data
			}
		},
		queryByPage() {
			let that = this
			const params = {
				pageNo: this.pageNo,
				name: this.searchForm.name
			}
			that.$axios.get('jellyForm/queryByPage', { params }).then(res => {
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
			this.$router.push('/addForm')
		},
		showEditDialog(row) {
			this.$router.push({ path: '/editForm', query: { id: row.id } })
		},
		deleteSubmit(row) {
			let that = this
			this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
				that.$axios.post('jellyForm/delete/' + row.id, {}).then(res => {
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
		businessRuleSubmit() {
			let that = this
			that.$axios.post('jellyForm/update', that.businessRuleForm).then(res => {
				if (res.data.code == 200) {
					that.$message.success('配置成功')
					that.businessRuleVisible = false
					that.pageNo = 1
					that.queryByPage()
				} else {
					that.$message.error(res.data.message)
				}
			})
		},
		handleCommand(command, row) {
			this.currentRow = row
			if (command === 'authority') {
				this.authorityActiveName = 'add'
				this.dataAuthorityActiveName = 'company'
				this.disabledButtonActiveName = 'temp'

				if (this.roleOptions.length > 0) {
					this.disabledFieldActiveName = this.roleOptions[0].name
					this.queryFormField(row)
				}
				// 先将权限置空，避免保存上次记录
				this.authorityForm = {
					addRoleValue: [],
					editRoleValue: [],
					deleteRoleValue: [],
					exportRoleValue: [],
					openRoleValue: [],
					closeRoleValue: [],
					generateType: 'dialog',
					dataAuthority: {
						company: [],
						deptment: []
					},
					disabledButton: {
						temp: [],
						submit: [],
						audit: [],
						seaView: [],
						abandon: [],
						backFront: [],
						backStart: [],
						delete: [],
						print: [],
						recall: []
					},
					disabledField: {}
				}

				if (this.roleOptions.length > 0) {
					this.disabledFieldActiveName = this.roleOptions[0].name
				}

				if (row.authority) {
					let authority = JSON.parse(row.authority)
					if (authority.add) {
						this.authorityForm.addRoleValue = authority.add.split(',')
					} else {
						this.authorityForm.addRoleValue = []
					}
					if (authority.edit) {
						this.authorityForm.editRoleValue = authority.edit.split(',')
					} else {
						this.authorityForm.editRoleValue = []
					}
					if (authority.delete) {
						this.authorityForm.deleteRoleValue = authority.delete.split(',')
					} else {
						this.authorityForm.deleteRoleValue = []
					}
					if (authority.export) {
						this.authorityForm.exportRoleValue = authority.export.split(',')
					} else {
						this.authorityForm.exportRoleValue = []
					}
					if (authority.open) {
						this.authorityForm.openRoleValue = authority.open.split(',')
					} else {
						this.authorityForm.openRoleValue = []
					}
					if (authority.close) {
						this.authorityForm.closeRoleValue = authority.close.split(',')
					} else {
						this.authorityForm.closeRoleValue = []
					}
					if (authority.generateType) {
						this.authorityForm.generateType = authority.generateType
					} else {
						this.authorityForm.generateType = 'dialog'
					}
					if (authority.dataAuthority) {
						this.authorityForm.dataAuthority = JSON.parse(authority.dataAuthority)
					}
					if (authority.disabledButton) {
						this.authorityForm.disabledButton = JSON.parse(authority.disabledButton)
					}
					if (authority.disabledField) {
						this.authorityForm.disabledField = JSON.parse(authority.disabledField)
					}
				}
				this.authorityVisible = true
			} else if (command === 'rule') {
				this.businessRuleForm = Object.assign({}, row)
				this.businessRuleVisible = true
			} else if (command === 'detail') {
				this.routerVisible = true
				if (row.options) {
					this.routerScript = row.options
				} else {
					this.routerScript = ''
				}
			} else if (command === 'print') {
				this.printVisible = true
				this.detailExportPath = row.detailExportPath
			}
		},
		routerSubmit() {
			let that = this
			let params = that.currentRow
			params.options = this.routerScript
			that.$axios.post('jellyForm/update', params).then(res => {
				if (res.data.code == 200) {
					that.$message.success('配置成功')
					that.routerVisible = false
					that.queryByPage()
				} else {
					that.$message.error(res.data.message)
				}
			})
		},
		async queryBusinessField(row) {
			let res = await this.$axios.get('jellyForm/queryBusinessField/' + row.id)
			if (res.data.code == 200) {
				let fieldOptions = []
				fieldOptions.push({
					name: '${sponsor}',
					comment: '发起人'
				})
				// fieldOptions.push({
				//     name: '${sponsorDepartment}',
				//     comment: '发起人部门'
				// })
				fieldOptions.push({
					name: '${formName}',
					comment: '表单名称'
				})
				for (let i = 0; i < res.data.data.length; i++) {
					let fieldObject = res.data.data[i]
					if (fieldObject.children) {
						let children = []
						for (let j = 0; j < fieldObject.children.length; j++) {
							children.push({
								id: fieldObject.children[j].id,
								name:
									'${' + fieldObject.children[j].tableName + '.' + fieldObject.children[j].name + '}',
								comment: fieldObject.children[j].remark
							})
						}
						fieldOptions.push({
							id: fieldObject.id,
							children: children,
							comment: fieldObject.remark
						})
					} else {
						fieldOptions.push({
							name: '${' + fieldObject.tableName + '.' + fieldObject.name + '}',
							comment: fieldObject.remark
						})
					}
				}
				this.fieldOptions = fieldOptions
			}
		},
		authorityVisibleSubmit() {
			let that = this
			let params = that.currentRow
			let authority = {}
			authority.add = this.authorityForm.addRoleValue.toString()
			authority.edit = this.authorityForm.editRoleValue.toString()
			authority.delete = this.authorityForm.deleteRoleValue.toString()
			authority.export = this.authorityForm.exportRoleValue.toString()
			authority.open = this.authorityForm.openRoleValue.toString()
			authority.close = this.authorityForm.closeRoleValue.toString()
			authority.generateType = this.authorityForm.generateType
			authority.dataAuthority = JSON.stringify(this.authorityForm.dataAuthority)
			authority.disabledButton = JSON.stringify(this.authorityForm.disabledButton)
			authority.disabledField = JSON.stringify(this.authorityForm.disabledField)

			params.authority = JSON.stringify(authority)
			that.$axios.post('jellyForm/update', params).then(res => {
				if (res.data.code == 200) {
					that.$message.success('配置成功')
					that.authorityVisible = false
					that.queryByPage()
				} else {
					that.$message.error(res.data.message)
				}
			})
		},
		printVisibleSubmit() {
			let that = this
			let params = that.currentRow

			params.detailExportPath = this.detailExportPath
			that.$axios.post('jellyForm/update', params).then(res => {
				if (res.data.code == 200) {
					that.$message.success('配置成功')
					that.printVisible = false
					that.queryByPage()
				} else {
					that.$message.error(res.data.message)
				}
			})
		},

		// 查询表单字段
		async queryFormField(row) {
			let res = await this.$axios.get('jellyForm/queryBusinessField/' + row.id)
			if (res.data.code == 200) {
				let fieldOptions = []
				for (let i = 0; i < res.data.data.length; i++) {
					let fieldObject = res.data.data[i]
					if (fieldObject.children) {
						let children = []
						for (let j = 0; j < fieldObject.children.length; j++) {
							children.push({
								id: fieldObject.children[j].id,
								name: fieldObject.children[j].tableName + '.' + fieldObject.children[j].name,
								comment: fieldObject.children[j].remark
							})
						}
						fieldOptions.push({
							id: fieldObject.id,
							children: children,
							comment: fieldObject.remark
						})
					} else {
						fieldOptions.push({
							name: fieldObject.tableName + '.' + fieldObject.name,
							comment: fieldObject.remark
						})
					}
				}
				this.formFieldOptions = fieldOptions
			}
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
