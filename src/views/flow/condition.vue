<template>
	<el-dialog
		title="分支条件"
		width="750px"
		:visible.sync="branchVisible"
		:close-on-click-modal="false"
		append-to-body
	>
		<el-input v-model="nodeItem.label" placeholder="请输入节点名称" maxlength="7" show-word-limit></el-input>
		<codemirrorCalculate
			v-if="branchVisible"
			v-model="nodeItem.condition"
			:options="fieldOptions"
			style="margin-top:15px;"
		/>
		<div slot="footer" class="dialog-footer">
			<el-button @click="branchVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleBranchSave">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import codemirrorCalculate from '@/views/components/codemirror/calculate'
export default {
	components: {
		codemirrorCalculate
	},
	data() {
		return {
			branchVisible: false,
			fieldOptions: [],
			nodeItem: {}
		}
	},
	created() {
		this.queryBusinessField()
	},
	methods: {
		async queryBusinessField(value) {
			let res = await this.$axios.get('seaDefinition/queryBusinessField/' + this.$route.query.id)
			if (res.data.code == 200) {
				let fieldOptions = []
				fieldOptions.push({
					name: '${companyName}',
					comment: '发起人单位'
				})
				fieldOptions.push({
					name: '${departmentName}',
					comment: '发起人部门'
				})
				fieldOptions.push({
					name: '${roleName}',
					comment: '发起人角色'
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
		showDialog(item) {
			this.nodeItem = item
			this.branchVisible = true
		},
		handleBranchSave() {
			if (!this.nodeItem.label) {
				this.$message.error('请输入节点名称')
				return
			}
			if (!this.nodeItem.condition) {
				this.$message.error('分支条件不能为空')
				return
			}
			this.$emit('updateNodeInfo', this.nodeItem)
			this.branchVisible = false
		}
	}
}
</script>
