<template>
	<!--配置界面-->
	<el-drawer title="配置" size="666px" :visible.sync="drawerVisible" custom-class="demo-drawer">
		<div class="demo-drawer__content">
			<el-form :model="nodeItem" label-width="0px">
				<el-form-item>
					<el-input
						v-model="nodeItem.label"
						placeholder="请输入标题"
						maxlength="7"
						show-word-limit
					></el-input>
				</el-form-item>
				<el-tabs v-model="activeName">
					<el-tab-pane label="设置审批人" name="approver">
						<el-radio-group v-model="nodeItem.approverType" @change="approverTypeChange">
							<el-radio :label="1" style="margin-bottom:25px">指定成员</el-radio>
							<el-radio :label="2" style="margin-bottom:25px">角色</el-radio>
							<el-radio :label="3" style="margin-bottom:25px">部门主管</el-radio>
							<el-radio :label="4" style="margin-bottom:25px">分管领导</el-radio>
							<el-radio :label="5" style="margin-bottom:25px">指定部门主管或分管领导</el-radio>
							<el-radio :label="6" style="margin-bottom:25px" v-if="nodeItem.type == 'approver'"
								>审批人自选</el-radio
							>
							<el-radio :label="7" style="margin-bottom:25px">发起人自己</el-radio>
						</el-radio-group>
						<div v-if="nodeItem.approverType == 1">
							<el-button
								type="primary"
								size="medium"
								round
								icon="el-icon-plus"
								@click="handleMember"
								v-if="memberTags.length == 0"
								>添加成员</el-button
							>
							<el-button
								type="primary"
								size="medium"
								round
								@click="handleMember"
								v-if="memberTags.length != 0"
								>修改成员</el-button
							>
							<div style="max-height:200px; overflow:auto;" v-if="memberTags.length != 0">
								<el-tag
									v-for="(tag, index) in memberTags"
									:key="tag.id"
									closable
									style="margin-top:15px;margin-right:15px"
									@close="handleClose(index)"
								>
									{{ tag.name }}
								</el-tag>
								<el-button type="text" @click="cleanTags">清空</el-button>
							</div>
						</div>
						<el-select
							v-model="roleValue"
							placeholder="请选择角色"
							multiple
							clearable
							v-if="nodeItem.approverType == 2"
						>
							<el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
						<el-select
							v-model="deptValue"
							placeholder="请选择发起人的部门主管"
							v-if="nodeItem.approverType == 3"
						>
							<el-option v-for="item in directorData" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
						<el-select
							v-model="deptValue"
							placeholder="请选择发起人的分管领导"
							v-if="nodeItem.approverType == 4"
						>
							<el-option
								v-for="item in chargeLeaderData"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							>
							</el-option>
						</el-select>
						<el-cascader
							v-model="deptValue"
							placeholder="请选择部门"
							:options="deptTreeData"
							:props="{ checkStrictly: true, emitPath: false }"
							clearable
							v-if="nodeItem.approverType == 5"
						>
						</el-cascader>
						<el-radio-group
							v-model="nodeItem.appoint"
							v-if="nodeItem.approverType == 5"
							style="margin-top:15px"
						>
							<el-radio :label="1">部门主管</el-radio>
							<el-radio :label="2">分管领导</el-radio>
						</el-radio-group>
						<!-- <div v-if="nodeItem.approverType == 5">
                            <p>审批终点</p>
                            <el-select v-model="deptValue" placeholder="请选择连续多级主管">
                                <el-option
                                    v-for="item in directorData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div> -->
						<div v-if="nodeItem.approverType == 6">
							<p>指定范围</p>
							<el-button
								type="primary"
								size="medium"
								round
								icon="el-icon-plus"
								@click="handleMember"
								v-if="memberTags.length == 0"
								>添加成员</el-button
							>
							<el-button
								type="primary"
								size="medium"
								round
								@click="handleMember"
								v-if="memberTags.length != 0"
								>修改成员</el-button
							>
							<div style="max-height:200px; overflow:auto;" v-if="memberTags.length != 0">
								<el-tag
									v-for="(tag, index) in memberTags"
									:key="tag.id"
									closable
									style="margin-top:15px;margin-right:15px"
									@close="handleClose(index)"
								>
									{{ tag.name }}
								</el-tag>
								<el-button type="text" @click="cleanTags">清空</el-button>
							</div>
						</div>
						<div v-if="nodeItem.approverType == 7">发起人自己将作为审批人处理审批单</div>
						<el-divider></el-divider>
						<div v-if="nodeItem.approverType != 7 && nodeItem.type == 'approver'">
							<p>多人审批时采用的审批方式</p>
							<el-radio-group v-model="nodeItem.way" style="margin-top:10px">
								<el-radio :label="1">或签(一名审批人同意或拒绝即可)</el-radio>
								<br />
								<el-radio :label="2" style="margin-top:20px">会签(须所有人同意)</el-radio>
							</el-radio-group>
						</div>
					</el-tab-pane>
					<el-tab-pane label="表单操作权限" name="operationAuthority">
						<span slot="label"
							>表单操作权限
							<el-tooltip
								content="根据需要，设置该审批人对审批单中不同字段拥有不同的权限。"
								placement="right-start"
								><i class="el-icon-warning-outline"></i></el-tooltip
						></span>
						<el-table :data="operationAuthorityArray" max-height="450px">
							<el-table-column prop="comment" label="表单字段"></el-table-column>
							<el-table-column prop="authority" label="可编辑">
								<template slot-scope="scope">
									<el-radio v-model="scope.row.authority" :label="1">{{ '' }}</el-radio>
								</template>
							</el-table-column>
							<el-table-column prop="authority" label="只读">
								<template slot-scope="scope">
									<el-radio v-model="scope.row.authority" :label="2">{{ '' }}</el-radio>
								</template>
							</el-table-column>
							<el-table-column prop="authority" label="隐藏">
								<template slot-scope="scope">
									<el-radio v-model="scope.row.authority" :label="3">{{ '' }}</el-radio>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</el-form>
			<div class="demo-drawer__footer">
				<el-button @click="drawerVisible = false" round>取 消</el-button>
				<el-button type="primary" @click="handleSubmit" round>确 定</el-button>
			</div>
		</div>
		<multipleMember ref="multipleMember" @confirm="multipleMemberConfirm"></multipleMember>
	</el-drawer>
</template>

<script>
import multipleMember from '@/views/flow/multiple-member'
export default {
	components: {
		multipleMember
	},
	props: ['nodeInfo', 'operationAuthority'],
	data() {
		return {
			drawerVisible: false,
			activeName: 'approver',
			deptTreeData: [],
			roleData: [],
			directorData: [
				{
					id: 1,
					name: '直接主管'
				},
				{
					id: 2,
					name: '第2级主管'
				},
				{
					id: 3,
					name: '第3级主管'
				},
				{
					id: 4,
					name: '第4级主管'
				},
				{
					id: 5,
					name: '第5级主管'
				}
			],
			chargeLeaderData: [
				{
					id: 1,
					name: '直接分管领导'
				},
				{
					id: 2,
					name: '第2级分管领导'
				},
				{
					id: 3,
					name: '第3级分管领导'
				},
				{
					id: 4,
					name: '第4级分管领导'
				},
				{
					id: 5,
					name: '第5级分管领导'
				}
			],
			operationAuthorityArray: [],
			nodeItem: {},
			memberTags: [],
			roleValue: [],
			deptValue: '',
			operationAuthorityJson: []
		}
	},
	created() {
		this.queryDepartment()
		this.queryRole()
	},
	methods: {
		async queryDepartment() {
			let res = await this.$axios.get('department/queryCompanyDeptLevel')
			if (res.data.code == 200) {
				this.deptTreeData = res.data.data
			}
		},
		async queryRole() {
			let res = await this.$axios.get('role/queryAll')
			if (res.data.code == 200) {
				this.roleData = res.data.data
			}
		},
		showDialog() {
			this.drawerVisible = true
			this.activeName = 'approver'
			this.$nextTick().then(() => {
				this.nodeItem = JSON.parse(JSON.stringify(this.nodeInfo))
				if (!this.nodeItem.approverType) {
					this.$set(this.nodeItem, 'approverType', 1)
				}
				if (!this.nodeItem.way) {
					this.$set(this.nodeItem, 'way', 1)
				}
				if (this.nodeItem.value) {
					if (this.nodeItem.approverType == 1 || this.nodeItem.approverType == 6) {
						this.memberTags = this.nodeItem.value
					} else if (this.nodeItem.approverType == 2) {
						this.roleValue = this.nodeItem.value
					} else if (
						this.nodeItem.approverType == 3 ||
						this.nodeItem.approverType == 4 ||
						this.nodeItem.approverType == 5
					) {
						this.deptValue = this.nodeItem.value
					}
				} else {
					this.memberTags = []
					;(this.roleValue = []), (this.deptValue = '')
				}
				if (this.nodeItem.authority) {
					let authorityMap = {}
					for (let i = 0; i < this.nodeItem.authority.length; i++) {
						let mark = this.nodeItem.authority[i].tableName
						if (this.nodeItem.authority[i].field) {
							mark = mark + '.' + this.nodeItem.authority[i].field
						}
						authorityMap[mark] = this.nodeItem.authority[i].authority
					}

					this.operationAuthorityJson = JSON.parse(JSON.stringify(this.operationAuthority))
					let operationAuthorityArray = []
					for (let j = 0; j < this.operationAuthorityJson.length; j++) {
						let mark = this.operationAuthorityJson[j].tableName
						if (this.operationAuthorityJson[j].field) {
							mark = mark + '.' + this.operationAuthorityJson[j].field
						}
						let item = this.operationAuthorityJson[j]
						if (authorityMap.hasOwnProperty(mark)) {
							item.authority = authorityMap[mark]
						}
						operationAuthorityArray.push(item)
					}
					this.operationAuthorityArray = operationAuthorityArray
				} else {
					this.operationAuthorityArray = this.operationAuthority
				}
			})
		},
		approverTypeChange(value) {
			this.memberTags = []
			;(this.roleValue = []), (this.deptValue = '')
			if (value == 5) {
				this.$set(this.nodeItem, 'appoint', 1)
			} else {
				delete this.nodeItem.appoint
			}
		},
		handleMember() {
			this.$refs.multipleMember.showDialog(this.memberTags)
		},
		multipleMemberConfirm(data) {
			this.memberTags = data
		},
		handleClose(index) {
			this.memberTags.splice(index, 1)
		},
		cleanTags() {
			this.memberTags = []
		},
		handleSubmit() {
			if (!this.nodeItem.label) {
				this.$message.error('请输入标题')
				return
			}
			if (this.nodeItem.approverType == 1 || this.nodeItem.approverType == 6) {
				this.$set(this.nodeItem, 'value', this.memberTags)
			} else if (this.nodeItem.approverType == 2) {
				this.$set(this.nodeItem, 'value', this.roleValue)
			} else if (
				this.nodeItem.approverType == 3 ||
				this.nodeItem.approverType == 4 ||
				this.nodeItem.approverType == 5
			) {
				this.$set(this.nodeItem, 'value', this.deptValue)
			}
			this.nodeItem.authority = this.operationAuthorityArray
			this.$emit('updateNodeInfo', this.nodeItem)
			this.drawerVisible = false
		}
	}
}
</script>
<style scoped>
.demo-drawer__content {
	display: flex;
	flex-direction: column;
	height: 100%;
}
.demo-drawer__content form {
	flex: 1;
}
.demo-drawer__footer {
	text-align: right;
}
.demo-drawer__footer button {
	flex: 1;
}
/deep/ .el-drawer__body {
	padding: 20px;
}

/deep/ .el-tab-pane {
	margin-top: 25px;
}
</style>
