<template>
	<div class="container" v-loading="loading">
		<!--简化版-->
		<div v-if="formDesignType === 1">
			<simplify-form
				ref="simplifyForm"
				:action="action"
				:formModel="formModel"
				:formCofig="formCofig"
				:property="property"
				:calculate="calculate"
				:textModel="textModel"
			/>
		</div>
		<!--高级版-->
		<div v-if="formDesignType === 2">
			<senior-form
				ref="seniorForm"
				:action="action"
				:formModel="formModel"
				:formCofig="formCofig"
				:property="property"
				:calculate="calculate"
			/>
		</div>
		<div class="footer">
			<div class="footer-right">
				<el-dropdown
					trigger="click"
					style="margin-right:10px"
					@command="handleTextCommand"
					v-if="textModel.flag"
				>
					<el-button type="primary" icon="el-icon-document"
						>正文类型<i class="el-icon-arrow-down el-icon--right"></i
					></el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="text">标准正文</el-dropdown-item>
						<el-dropdown-item command="word">Word正文</el-dropdown-item>
						<el-dropdown-item command="excel">Excel正文</el-dropdown-item>
						<el-dropdown-item command="pdf">Pdf正文</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-button
					type="primary"
					icon="el-icon-document"
					@click="saveForm"
					v-if="flowFlag === 1"
					:disabled="disableButtonFlag.temp"
					>暂存</el-button
				>
				<el-button
					type="primary"
					icon="el-icon-document-checked"
					@click="submitForm"
					:disabled="disableButtonFlag.submit"
					>提交</el-button
				>
			</div>
		</div>
		<!--温馨提示-->
		<el-dialog title="温馨提示" width="500px" :visible.sync="verifyVisible" :close-on-click-modal="false">
			<div
				v-for="(item, index) in messageArray"
				:key="index"
				style="color:#e6a23c;margin-bottom:10px;font-size:16px;"
			>
				<i class="el-icon-warning-outline"></i> {{ item }}
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="verifyVisible = false">取消</el-button>
				<el-button type="primary" @click="verifySubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--审批自选-->
		<el-dialog title="请选择" width="500px" :visible.sync="approveOptionalVisible" :close-on-click-modal="false">
			<div>
				<el-table
					:data="approveOptionalList"
					style="width: 100%"
					:show-header="true"
					:max-height="450"
					@selection-change="handleApproveOptionalChange"
				>
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column label="全选" prop="name"></el-table-column>
				</el-table>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="approveOptionalVisible = false">取消</el-button>
				<el-button type="primary" @click="approveOptionalSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--流程自选-->
		<el-dialog title="请选择" width="500px" :visible.sync="flowOptionalVisible" :close-on-click-modal="false">
			<div>
				<el-table
					:data="flowOptionalList"
					style="width: 100%"
					:show-header="true"
					:max-height="450"
					@selection-change="handleFlowOptionalChange"
				>
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column label="全选" prop="label"></el-table-column>
				</el-table>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="flowOptionalVisible = false">取消</el-button>
				<el-button type="primary" @click="flowOptionalSubmit">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import seniorForm from '@/views/senior/senior-form'
import simplifyForm from '@/views/simplify/simplify-form'
export default {
	components: {
		seniorForm,
		simplifyForm
	},
	data() {
		return {
			action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
			tableData: [],
			formModel: {},
			calculate: {},
			property: {},
			formId: '',
			verifyVisible: false,
			messageArray: [],
			flowFlag: 2,
			formDesignType: 0,
			formCofig: {},
			approveOptionalVisible: false,
			approveOptionalList: [],
			approveOptionalSelection: [],
			flowOptionalVisible: false,
			flowOptionalList: [],
			flowOptionalSelection: [],
			textModel: { flag: false, type: 'text' },
			loading: false,
			disableButtonFlag: {
				temp: false,
				submit: false,
				audit: false,
				seaView: false,
				abandon: false,
				backFront: false,
				backStart: false,
				delete: false
			}
		}
	},
	created() {
		this.queryByMark()
	},
	methods: {
		async queryByMark() {
			this.loading = true
			const res = await this.$axios.get('jellyForm/queryByMark/' + this.$route.query.id)
			this.loading = false
			if (res.data.code == 200) {
				this.formId = res.data.data.id
				if (res.data.data.hasOwnProperty('flowId') && res.data.data.flowId != null) {
					this.flowFlag = 1
				}
				this.disableButtonFlag = res.data.data.disableButtonFlag
				for (let i = 0; i < res.data.data.formDesignList.length; i++) {
					let formDesign = res.data.data.formDesignList[i]
					this.formDesignType = formDesign.type
					this.formCofig = JSON.parse(formDesign.excelJson)
				}
			}
		},
		handleApproveOptionalChange(val) {
			let approveOptionalSelection = []
			for (let i = 0; i < val.length; i++) {
				approveOptionalSelection.push(val[i].id)
			}
			this.approveOptionalSelection = approveOptionalSelection
		},
		handleFlowOptionalChange(val) {
			let flowOptionalSelection = []
			for (let i = 0; i < val.length; i++) {
				flowOptionalSelection.push(val[i].id)
			}
			this.flowOptionalSelection = flowOptionalSelection
		},
		verifySubmit() {
			this.verifyVisible = false
			let that = this
			var params = {
				$formId: that.formId
			}

			//表单验证
			if (this.formDesignType === 1) {
				let result = this.$refs.simplifyForm.validate()
				if (!result) {
					return
				}
			} else if (this.formDesignType === 2) {
				let result = this.$refs.seniorForm.validate()
				if (!result) {
					return
				}
			}

			params = Object.assign(params, this.formModel)

			Object.keys(params).forEach((key, index) => {
				let property = this.property[key]
				if (property) {
					if (
						(property.type === 'checkbox' ||
							property.type === 'select' ||
							property.type === 'department' ||
							property.type === 'member' ||
							property.type === 'business' ||
							property.type === 'cascader') &&
						property.multiple
					) {
						params[key] = params[key].toString()
					}
					if (
						property.type === 'picture' ||
						property.type === 'upload' ||
						property.type === 'table' ||
						property.type === 'area'
					) {
						params[key] = JSON.stringify(params[key])
					}
				}
				if (params[key] instanceof Array || params[key] instanceof Object) {
					params[key] = JSON.stringify(params[key])
				}
			})

			if (this.approveOptionalSelection.length > 0) {
				params['approverOptionalList'] = this.approveOptionalSelection.toString()
			}

			if (this.flowOptionalSelection.length > 0) {
				params['flowOptionalList'] = this.flowOptionalSelection.toString()
			}

			that.$axios.post('jellyForm/insertCustom', params).then(res => {
				if (res.data.code == 200) {
					that.$message.success('提交成功')
					that.$store.commit('worktabRemove', that.$route.fullPath)
				} else if (res.data.code == 10004) {
					// 审批人自选
					that.approveOptionalList = JSON.parse(res.data.message)
					that.approveOptionalVisible = true
				} else if (res.data.code == 10009) {
					// 流程手动选择
					that.flowOptionalList = JSON.parse(res.data.message)
					that.flowOptionalVisible = true
				} else {
					that.$message.error(res.data.message)
				}
			})
		},
		submitForm() {
			let that = this
			var params = {
				$formId: that.formId
			}
			//表单验证
			if (this.formDesignType === 1) {
				let result = this.$refs.simplifyForm.validate()
				if (!result) {
					return
				}
			} else if (this.formDesignType === 2) {
				let result = this.$refs.seniorForm.validate()
				if (!result) {
					return
				}
			}

			params = Object.assign(params, this.formModel)

			Object.keys(params).forEach((key, index) => {
				let property = this.property[key]
				if (property) {
					if (
						(property.type === 'checkbox' ||
							property.type === 'select' ||
							property.type === 'department' ||
							property.type === 'member' ||
							property.type === 'business' ||
							property.type === 'cascader') &&
						property.multiple
					) {
						params[key] = params[key].toString()
					}
					if (
						property.type === 'picture' ||
						property.type === 'upload' ||
						property.type === 'table' ||
						property.type === 'area'
					) {
						params[key] = JSON.stringify(params[key])
					}
				}
				if (params[key] instanceof Array || params[key] instanceof Object) {
					params[key] = JSON.stringify(params[key])
				}

				if (key.indexOf('|') > -1) {
					params[key.split('|')[0] + '.' + key.split('|')[1]] = params[key]
					delete params[key]
				}
			})

			if (this.approveOptionalSelection.length > 0) {
				params['approverOptionalList'] = this.approveOptionalSelection.toString()
			}

			if (this.flowOptionalSelection.length > 0) {
				params['flowOptionalList'] = this.flowOptionalSelection.toString()
			}

			that.loading = true
			that.$axios.post('jellyForm/insertCustom', params).then(res => {
				that.loading = false
				if (res.data.code == 200) {
					that.$message.success('提交成功')
					that.$store.commit('worktabRemove', that.$route.fullPath)
				} else if (res.data.code == 10004) {
					// 审批人自选
					that.approveOptionalList = JSON.parse(res.data.message)
					that.approveOptionalVisible = true
				} else if (res.data.code == 10009) {
					// 流程手动选择
					that.flowOptionalList = JSON.parse(res.data.message)
					that.flowOptionalVisible = true
				} else {
					that.$message.error(res.data.message)
				}
			})
		},
		approveOptionalSubmit() {
			if (this.approveOptionalSelection.length === 0) {
				this.$message.warning('请选择节点执行人')
			} else {
				this.approveOptionalVisible = false
				this.submitForm()
			}
		},
		flowOptionalSubmit() {
			if (this.flowOptionalSelection.length === 0) {
				this.$message.warning('请选择流程节点')
			} else {
				this.flowOptionalVisible = false
				this.submitForm()
			}
		},
		saveForm() {
			let that = this
			var params = {
				$formId: that.formId,
				temporaryStorage: true
			}

			params = Object.assign(params, this.formModel)

			Object.keys(params).forEach((key, index) => {
				let property = this.property[key]
				if (property) {
					if (
						(property.type === 'checkbox' ||
							property.type === 'select' ||
							property.type === 'department' ||
							property.type === 'member' ||
							property.type === 'business' ||
							property.type === 'cascader') &&
						property.multiple
					) {
						params[key] = params[key].toString()
					}
					if (
						property.type === 'picture' ||
						property.type === 'upload' ||
						property.type === 'table' ||
						property.type === 'area'
					) {
						params[key] = JSON.stringify(params[key])
					}
				}
				if (params[key] instanceof Array || params[key] instanceof Object) {
					params[key] = JSON.stringify(params[key])
				}

				if (key.indexOf('|') > -1) {
					params[key.split('|')[0] + '.' + key.split('|')[1]] = params[key]
					delete params[key]
				}
			})

			that.loading = true
			that.$axios.post('jellyForm/insertCustom', params).then(res => {
				that.loading = false
				if (res.data.code == 200) {
					that.$message.success('保存成功')
					that.$store.commit('worktabRemove', that.$route.fullPath)
				} else {
					that.$message.error(res.data.message)
				}
			})
		},
		handleTextCommand(command) {
			this.textModel.type = command
			if (command === 'text') {
				// 标准正文
				this.$set(this.formModel, this.textModel.field, {})
			} else if (command === 'word') {
				// Word正文
				this.$set(this.formModel, this.textModel.field, { type: 'word' })
			} else if (command === 'excel') {
				// Excel正文
				this.$set(this.formModel, this.textModel.field, { type: 'word' })
			} else if (command === 'pdf') {
				// Pdf正文
				this.$set(this.formModel, this.textModel.field, { type: 'pdf' })
			}
		}
	}
}
</script>
<style scoped>
.container {
	padding: 5px 0px 45px 5px;
}
.footer {
	position: fixed;
	left: 230px;
	bottom: 0px;
	width: 100%;
	background: #fff;
	box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
	height: 65px;
	border-bottom: 1px solid #ebeef5;
	box-sizing: border-box;
	border-top: 1px solid #ebeef5;
}
.footer-right {
	position: fixed;
	bottom: 0px;
	right: 15px;
	padding: 10px;
}
</style>
