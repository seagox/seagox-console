<template>
	<div class="formContainer" :style="{ height: clientHeight + 'px' }">
		<el-form ref="form" :model="form" :rules="rules" label-width="80px" class="form">
			<el-divider>基础属性</el-divider>
			<el-form-item label="组件类型">
				<el-select v-model="form.type" filterable>
					<el-option label="文字" value="word"></el-option>
					<el-option label="单行文本" value="text"></el-option>
					<el-option label="多行文本" value="textarea"></el-option>
					<el-option label="数字" value="number"></el-option>
					<el-option label="富文本" value="editor"></el-option>
					<el-option label="单选框" value="radio"></el-option>
					<el-option label="多选框" value="checkbox"></el-option>
					<el-option label="下拉选择" value="select"></el-option>
					<el-option label="开关组件" value="switch"></el-option>
					<el-option label="时间选择" value="timePicker"></el-option>
					<el-option label="日期选择" value="datePicker"></el-option>
					<el-option label="图片上传" value="picture"></el-option>
					<el-option label="时间范围" value="timeRangePicker"></el-option>
					<el-option label="日期范围" value="dateRangePicker"></el-option>
					<el-option label="附件上传" value="upload"></el-option>
					<el-option label="明细/表格" value="table"></el-option>
					<el-option label="计算公式" value="calculate"></el-option>
					<el-option label="流水号" value="bill"></el-option>
					<el-option label="流程组件" value="process"></el-option>
					<el-option label="省市区" value="area"></el-option>
					<el-option label="部门组件" value="department"></el-option>
					<el-option label="成员组件" value="member"></el-option>
					<el-option label="业务应用" value="business"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="绑定表" prop="table" v-if="form.type != 'process' && form.type != 'word'">
				<el-select v-model="form.table" @change="handleTableChange(1, $event)" placeholder="请选择绑定表">
					<el-option v-for="item in tableOptions" :key="item.name" :label="item.comment" :value="item.name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item
				label="绑定字段"
				prop="field"
				v-if="form.type != 'table' && form.type != 'process' && form.type != 'word'"
			>
				<el-select v-model="form.field" filterable placeholder="请选择绑定字段" multiple>
					<el-option v-for="item in fieldOptions" :key="item.name" :label="item.comment" :value="item.name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="占位提示" prop="placeholder" v-if="form.type != 'process' && form.type != 'word'">
				<el-input v-model="form.placeholder"></el-input>
			</el-form-item>
			<el-divider v-if="form.type != 'word'">其他属性</el-divider>
			<!-- text或textarea -->
			<div v-if="form.type === 'number'">
				<el-form-item label="默认值">
					<el-input-number
						:controls="false"
						:precision="0"
						v-model="form.defaults"
						placeholder="请输入默认值">
					</el-input-number>
				</el-form-item>
			</div>
			<!-- text或textarea -->
			<div v-if="form.type === 'text' || form.type === 'textarea'">
				<el-form-item label="默认值">
					<el-input v-model="form.defaults" placeholder="请输入默认值"></el-input>
				</el-form-item>
				<el-form-item label="最多输入">
					<el-input placeholder="请输入字符长度" v-model="form.maxlength" type="number">
						<template slot="append">个字符</template>
					</el-input>
				</el-form-item>
			</div>
			<!-- 流水号 -->
			<div v-if="form.type === 'bill'">
				<el-form-item label="流水前缀" prop="prefix">
					<el-input v-model="form.prefix" placeholder="请输入流水前缀"></el-input>
				</el-form-item>
				<el-form-item label="流水日期" prop="billDate">
					<el-select v-model="form.billDate" placeholder="请选择流水日期">
						<el-option label="yyyyMMdd" value="yyyyMMdd"></el-option>
						<el-option label="yyyyMM" value="yyyyMM"></el-option>
						<el-option label="yyyy" value="yyyy"></el-option>
						<el-option label="no" value="no"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="流水位数" prop="digit">
					<el-input-number v-model="form.digit" step-strictly :min="1" :max="8"></el-input-number>
				</el-form-item>
			</div>
			<!-- 流程组件 -->
			<div v-if="form.type === 'process'">
				<el-form-item label="节点名称" prop="nodeName">
					<el-input v-model="form.nodeName" placeholder="请输入节点名称"></el-input>
				</el-form-item>
				<el-form-item label="显示格式" prop="processFormat">
					<el-select v-model="form.processFormat" placeholder="请选择显示格式">
						<el-option label="姓名意见日期时间" value="1"></el-option>
						<el-option label="姓名意见" value="2"></el-option>
						<el-option label="意见" value="3"></el-option>
					</el-select>
				</el-form-item>
			</div>
			<!-- datePicker -->
			<div v-if="form.type === 'datePicker'">
				<el-form-item label="日期类型" prop="dateType">
					<el-select v-model="form.dateType">
						<el-option label="年" value="year|yyyy"></el-option>
						<el-option label="年-月" value="month|yyyy-MM"></el-option>
						<el-option label="年-月-日" value="date|yyyy-MM-dd"></el-option>
						<el-option label="年-月-日 时:分:秒(24小时制)" value="datetime|yyyy-MM-dd HH:mm:ss"></el-option>
						<el-option label="年-月-日 时:分:秒(12小时制)" value="datetime|yyyy-MM-dd hh:mm:ss"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="默认当前">
					<el-switch v-model="form.defaultsCurrent"></el-switch>
				</el-form-item>
				<el-form-item label="默认值" v-if="!form.defaultsCurrent">
					<el-date-picker
						v-model="form.defaults"
						:type="form.dateType.split('|')[0]"
						:value-format="form.dateType.split('|')[1]"
						placeholder="请选择默认值"
						clearable
						align="center"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="默认显示" v-if="!form.defaultsCurrent">
					<el-date-picker
						v-model="form.defaultValue"
						:type="form.dateType.split('|')[0]"
						:value-format="form.dateType.split('|')[1]"
						placeholder="请选择选择器默认值"
						clearable
						align="center"
					>
					</el-date-picker>
				</el-form-item>
			</div>
			<!-- 省市区 -->
			<div v-if="form.type === 'area'">
				<el-form-item label="显示格式">
					<el-select v-model="form.format" @change="changeRegions">
						<el-option label="省" :value="1"></el-option>
						<el-option label="省市" :value="2"></el-option>
						<el-option label="省市区" :value="3"></el-option>
						<el-option label="省市区-街道" :value="4"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="指定地区" v-if="form.format != 1">
					<el-cascader
						v-model="form.appoint"
						clearable
						placeholder="请选择指定地区"
						:options="appointRegions"
						:props="{ checkStrictly: true, value: 'code', label: 'name' }"
						filterable
					>
					</el-cascader>
				</el-form-item>
			</div>
			<!-- 开关 -->
			<div v-if="form.type === 'switch'">
				<el-form-item label="打开时值">
					<el-input-number v-model="form.activeValue"></el-input-number>
				</el-form-item>
				<el-form-item label="关闭时值">
					<el-input-number v-model="form.inactiveValue"></el-input-number>
				</el-form-item>
			</div>
			<!-- 图片上传 -->
			<div v-if="form.type === 'picture' || form.type === 'upload'">
				<el-form-item label="最小值">
					<el-input-number
						v-model="form.minValue"
						:min="0"
						:precision="0"
						:controls="false"
						placeholder="请输入最小值(单位:B)"
					>
					</el-input-number>
				</el-form-item>
				<el-form-item label="最大值">
					<el-input-number
						v-model="form.maxValue"
						:min="0"
						:precision="0"
						:controls="false"
						placeholder="请输入最大值(单位:B)"
					>
					</el-input-number>
				</el-form-item>
			</div>
			<el-form-item label="宽度" v-if="form.type === 'picture' || form.type === 'upload'">
				<el-input-number
					v-model="form.width"
					:min="0"
					:precision="0"
					:controls="false"
					placeholder="请输入宽度"
				>
				</el-input-number>
			</el-form-item>
			<el-form-item label="高度" v-if="form.type === 'picture' || form.type === 'upload'">
				<el-input-number
					v-model="form.height"
					:min="0"
					:precision="0"
					:controls="false"
					placeholder="请输入高度"
				>
				</el-input-number>
			</el-form-item>
			<!-- 多选组件 -->
			<div v-if="form.type === 'radio' || form.type === 'checkbox' || form.type === 'select'">
				<el-form-item label="数据来源" prop="source">
					<el-select v-model="form.source" filterable placeholder="请选择数据来源" @change="dictionaryChange">
						<el-option
							v-for="item in dictionaryClassifyOptions"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="默认值">
					<el-select
						v-model="form.defaults"
						filterable
						placeholder="请选择默认值"
						clearable
						:multiple="form.multiple"
					>
						<el-option
							v-for="item in dictionaryDetailOptions"
							:key="item.code"
							:label="item.name"
							:value="item.code"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</div>
			<!-- 部门组件 -->
			<div v-if="form.type === 'department'">
				<el-form-item label="默认值">
					<el-select v-model="form.defaults" placeholder="请选择默认值" clearable>
						<el-option label="当前用户数据" value="default"></el-option>
					</el-select>
				</el-form-item>
			</div>
			<!-- 成员组件 -->
			<div v-if="form.type === 'member'">
				<el-form-item label="默认值">
					<el-select v-model="form.defaults" placeholder="请选择默认值" clearable>
						<el-option label="当前用户数据" value="default"></el-option>
					</el-select>
				</el-form-item>
			</div>
			<!-- 业务应用 -->
			<div v-if="form.type === 'business'">
				<el-form-item label="数据来源" prop="source">
					<el-select v-model="form.source" filterable placeholder="请选择数据来源" @change="businessChange">
						<el-option v-for="item in businessOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="显示字段" prop="showField">
					<el-select v-model="form.showField" placeholder="请选择显示字段">
						<el-option
							v-for="(item, index) in showFieldOptions"
							:key="index"
							:label="item.label"
							:value="item.prop"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</div>
			<!-- 按钮开关 -->
			<el-form-item
				label="是否必填"
				v-if="form.type != 'calculate' && form.type != 'process' && form.type != 'word'"
			>
				<el-switch v-model="form.required"></el-switch>
			</el-form-item>
			<el-form-item
				label="是否禁用"
				v-if="form.type != 'table' && form.type != 'calculate' && form.type != 'process' && form.type != 'word'"
			>
				<el-switch v-model="form.disabled"></el-switch>
			</el-form-item>
			<el-form-item label="允许小数" v-if="form.type === 'number' || form.type === 'calculate'">
				<el-switch v-model="form.decimal" @change="decimalSwitch"></el-switch>
			</el-form-item>
			<el-form-item label="限制位数" v-if="form.type === 'number' && form.decimal">
				<el-input-number v-model="form.precision" step-strictly :min="0" :max="6"></el-input-number>
			</el-form-item>
			<el-form-item
				label="是否多选"
				v-if="
					form.type === 'select' ||
						form.type === 'picture' ||
						form.type === 'department' ||
						form.type === 'member' ||
						form.type === 'business'
				"
			>
				<el-switch v-model="form.multiple"></el-switch>
			</el-form-item>
			<el-form-item label="是否合计" v-if="form.type === 'table'">
				<el-switch v-model="form.showSummary"></el-switch>
			</el-form-item>
			<!-- 按钮 -->
			<el-row v-if="form.type === 'business' && form.source">
				<el-button size="medium" @click="handleSelectAssignment" style="width:100%;border-style:dashed;"
					>表单赋值</el-button
				>
			</el-row>
			<el-row v-if="form.type === 'business' && form.source">
				<el-button size="medium" @click="handleConditionAssignment" style="width:100%;border-style:dashed;"
					>条件赋值</el-button
				>
			</el-row>
			<el-row v-if="form.source === 'calculate'">
				<el-button size="medium" @click="handleTwoDimensionalTableCalculate" style="width:100%"
					>设置计算公式</el-button
				>
			</el-row>
			<el-row
				v-if="
					form.type === 'switch' ||
						form.type === 'radio' ||
						form.type === 'checkbox' ||
						form.type === 'select'
				"
			>
				<el-button size="medium" @click="handleSelectLogic" style="width:100%;border-style:dashed;"
					>逻辑表单</el-button
				>
			</el-row>
			<el-form-item label="详情表单" v-if="form.type === 'table'">
				<el-select v-model="form.detailForm" placeholder="请选择详情表单" clearable>
					<el-option v-for="item in businessOptions" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-row v-if="form.type === 'table'">
				<el-button type="primary" size="medium" @click="handleTable" style="width:100%">设置表格字段</el-button>
			</el-row>
			<el-row v-if="form.type === 'calculate'">
				<el-button type="primary" size="medium" @click="handleCalculate" style="width:100%"
					>设置计算公式</el-button
				>
			</el-row>
			<!-- 验证规则 -->
			<div v-if="form.type === 'text' || form.type === 'textarea' || form.type === 'number'">
				<el-divider>验证规则</el-divider>
				<div class="formVerify" v-for="(item, index) in form.rules" :key="index">
					<el-form-item label="类型">
						<el-select v-model="item.type" placeholder="请选择类型">
							<el-option label="正则表达式" value="regex"></el-option>
							<el-option label="运算符" value="eval"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="表达式">
						<el-input v-model="item.expression" placeholder="请输入表达式" :readonly="item.type === 'eval'">
							<i
								class="el-icon-document el-input__icon"
								slot="suffix"
								v-if="item.type === 'eval'"
								@click="handleRuleCalculate(index, item)"
							>
							</i>
						</el-input>
					</el-form-item>
					<el-form-item label="错误提示">
						<el-input v-model="item.message" placeholder="请输入错误提示"></el-input>
					</el-form-item>
					<i class="el-icon-circle-close" @click="handleDelRule(index)"></i>
				</div>
				<el-button type="text" icon="el-icon-circle-plus-outline" @click="handleAddRule">添加规则</el-button>
			</div>
			<el-row v-if="form.type != 'table' && form.type != 'calculate' && form.type != 'word'">
				<el-button type="primary" size="medium" @click="submitConfigForm" style="width:100%">保存</el-button>
			</el-row>
			<el-row v-if="form.type != 'word'">
				<el-button type="danger" size="medium" @click="deleteConfigForm" style="width:100%">删除</el-button>
			</el-row>
		</el-form>
		<excel-table ref="excelTable" @submitForm="submitForm" :form="form" :fieldOptions="fieldOptions" />
		<excel-calculate ref="excelCalculate" @calculateSubmit="calculateSubmit" />
		<excel-logic
			ref="excelLogic"
			@logicSubmit="logicSubmit"
			:form="form"
			:dictionaryDetailOptions="dictionaryDetailOptions"
			:fieldOptions="fieldOptions"
		/>
		<excel-assignment ref="excelAssignment" @assignmentSubmit="assignmentSubmit" />
		<excel-condition-assignment ref="excelConditionAssignment" @assignmentSubmit="conditionAssignmentSubmit" />
	</div>
</template>

<script>
import excelTable from '@/views/senior/senior-table'
import excelCalculate from '@/views/components/form/calculate'
import excelLogic from '@/views/senior/senior-logic'
import excelAssignment from '@/views/senior/senior-assignment'
import excelConditionAssignment from '@/views/components/form/condition-assignment'
export default {
	components: {
		excelTable,
		excelCalculate,
		excelLogic,
		excelAssignment,
		excelConditionAssignment
	},
	props: ['currentModule', 'dataSheet'],
	watch: {
		currentModule: {
			handler(newVal) {
				this.form = newVal
				if (this.form.type === 'area') {
					if (this.form.format) {
						this.changeRegions(this.form.format)
					} else {
						this.$set(this.form, 'format', 1)
					}
				}
				if (this.form.type === 'radio' || this.form.type === 'checkbox' || this.form.type === 'select') {
					if (newVal.source) {
						this.queryDictionaryClassify()
						this.queryDictionaryDetail(newVal.source)
					}
				}

				this.handleTableChange(2, newVal.table)

				if (this.form.type === 'business' && newVal.source) {
					this.handleRelationTypeChange(newVal.source)
				}

				if (this.form.type === 'datePicker' && !this.form.dateType) {
					this.$set(this.form, 'dateType', 'date|yyyy-MM-dd')
				}

				if (this.form.type === 'switch') {
					if (!this.form.inactiveValue) {
						this.form.inactiveValue = 0
					}
					if (!this.form.activeValue) {
						this.form.activeValue = 1
					}
				}

				if (this.form.type === 'bill' && !this.form.digit) {
					this.$set(this.form, 'digit', 1)
				}
			},
			immediate: true, // 首次加载的时候执行函数
			deep: true // 深入观察,监听数组值，对象属性值的变化
		},
		dataSheet: {
			handler(newVal) {
				if (newVal) {
					this.queryBusinessTable()
				}
			},
			immediate: true, // 首次加载的时候执行函数
			deep: true // 深入观察,监听数组值，对象属性值的变化
		}
	},
	data() {
		return {
			clientHeight: 0,
			form: {},
			rules: {
				table: [{ required: true, message: '请选择绑定表', trigger: 'change' }],
				field: [{ required: true, message: '请选择绑定字段', trigger: 'change' }],
				dateType: [{ required: true, message: '请选择日期类型', trigger: 'change' }],
				placeholder: [
					{ required: true, message: '请输入占位提示', trigger: 'blur' },
					{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
				],
				dataType: [{ required: true, message: '请选择数据来源', trigger: 'change' }],
				relationType: [{ required: true, message: '请选择关联应用', trigger: 'change' }],
				showField: [{ required: true, message: '请选择显示字段', trigger: 'change' }],
				source: [{ required: true, message: '请选择数据来源', trigger: 'change' }],
				prefix: [{ required: true, message: '请输入流水前缀', trigger: 'blur' }],
				billDate: [{ required: true, message: '请选择流水日期', trigger: 'change' }],
				nodeName: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
				processFormat: [{ required: true, message: '请选择显示格式', trigger: 'change' }]
			},
			tableOptions: [],
			fieldOptions: [],
			dictionaryClassifyOptions: [],
			dictionaryDetailOptions: [],
			relationTypeOptions: [],
			showFieldOptions: [],
			calculateFlag: false,
			ruleIndex: -1,
			appointRegions: [],
			businessOptions: []
		}
	},
	beforeMount() {
		this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
	},
	created() {
		this.queryDictionaryClassify()
		this.queryBusinessData()
	},
	methods: {
		async queryDictionaryClassify() {
			let res = await this.$axios.get('dictionaryClassify/queryDisplay')
			if (res.data.code === 200) {
				this.dictionaryClassifyOptions = res.data.data
			}
		},
		async queryDictionaryDetail(classifyId) {
			let res = await this.$axios.get('dictionaryDetail/queryDisplay?classifyId=' + classifyId)
			if (res.data.code === 200) {
				this.dictionaryDetailOptions = res.data.data
			}
		},
		async queryBusinessTable() {
			var params = {
				tableIds: this.dataSheet
			}
			let res = await this.$axios.post('businessTable/queryByTableIds', params)
			if (res.data.code === 200) {
				this.tableOptions = res.data.data
			}
		},
		async queryBusinessData() {
			let res = await this.$axios.get('jellyForm/queryByCompanyId')
			if (res.data.code === 200) {
				this.businessOptions = res.data.data
			}
		},
		async handleTableChange(type, value) {
			let res = await this.$axios.get('businessField/queryAll?display=1&tableName=' + value)
			if (res.data.code === 200) {
				this.fieldOptions = res.data.data
				if (type === 1) {
					this.form.field = ''
				}
			}
		},
		async handleRelationTypeChange(value) {
			let res = await this.$axios.get('jellyForm/queryById/' + value)
			if (res.data.code === 200) {
				this.showFieldOptions = JSON.parse(res.data.data.tableHeaderJson)
			}
		},
		decimalSwitch(value) {
			if (value && !this.form.precision) {
				this.$set(this.form, 'precision', 2)
			}
		},
		businessChange(value) {
			this.form.defaults = ''
			this.handleRelationTypeChange(value)
		},
		dictionaryChange(value) {
			this.dictionaryDetailOptions = []
			this.form.defaults = ''
			this.queryDictionaryDetail(value)
		},
		submitConfigForm() {
			var that = this
			this.$refs['form'].validate(valid => {
				if (valid) {
					if (that.form.type === 'timeRangePicker' || that.form.type === 'dateRangePicker') {
						if (that.form.field.length != 2) {
							return this.$message.error('绑定字段只能选择两个')
						}
					} else if (
						that.form.type === 'text' ||
						that.form.type === 'textarea' ||
						that.form.type === 'switch' ||
						that.form.type === 'timePicker' ||
						that.form.type === 'datePicker' ||
						that.form.type === 'upload' ||
						that.form.type === 'radio' ||
						that.form.type === 'checkbox' ||
						that.form.type === 'select' ||
						that.form.type === 'business' ||
						that.form.type === 'editor' ||
						that.form.type === 'calculate' ||
						that.form.type === 'bill' ||
						that.form.type === 'picture' ||
						that.form.type === 'area' ||
						that.form.type === 'department' ||
						that.form.type === 'member'
					) {
						if (that.form.field.length != 1) {
							return this.$message.error('绑定字段只能选择一个')
						}
					}

					that.$emit('submitConfigForm', that.form)
				}
			})
		},
		deleteConfigForm() {
			this.$emit('deleteConfigForm')
		},
		submitForm(data) {
			this.form.tableData = data
			this.$emit('submitConfigForm', this.form)
		},
		calculateSubmit(type, data) {
			if (type === 'calculate') {
				this.form.calculate = data
			} else if (type === 'rule') {
				this.form.rules.splice(this.ruleIndex, 1, {
					type: 'eval',
					expression: data,
					message: this.form.rules[this.ruleIndex].message
				})
			}
			this.$emit('submitConfigForm', this.form)
		},
		logicSubmit(data) {
			this.form.logic = data
			this.$emit('submitConfigForm', this.form)
		},
		handleAddRule() {
			this.$set(this.form, 'rules', [])
			this.form.rules.push({
				type: '',
				expression: '',
				message: ''
			})
		},
		handleDelRule(index) {
			this.form.rules.splice(index, 1)
		},
		handleTable() {
			var that = this
			this.$refs['form'].validate(valid => {
				if (valid) {
					that.$refs.excelTable.showDialog()
				}
			})
		},
		handleCalculate() {
			var that = this
			this.$refs['form'].validate(valid => {
				if (valid) {
					that.$refs.excelCalculate.showDialog('calculate', this.form.calculate)
				}
			})
		},
		handleTwoDimensionalTableCalculate() {
			var that = this
			this.$refs['form'].validate(valid => {
				if (valid) {
					that.$refs.excelCalculate.showDialog('twoDimensionalTable', this.form.calculate)
				}
			})
		},
		handleRuleCalculate(index, item) {
			this.ruleIndex = index
			this.$refs.excelCalculate.showDialog('rule', item.expression)
		},
		handleSelectLogic() {
			if (this.form.type === 'switch') {
				this.dictionaryDetailOptions = [
					{
						id: this.form.activeValue,
						text: '打开时值'
					},
					{
						id: this.form.inactiveValue,
						text: '关闭时值'
					}
				]
			}
			this.$refs.excelLogic.showDialog(this.form.calculate)
		},
		handleTagClick(index, tag) {
			this.calculateFlag = tag.calculateFlag
			this.$refs.excelCalculate.showDialog('tag', tag.calculate)
		},
		handleTagClose(index) {
			this.form.logic.splice(index, 1)
		},
		handleSelectAssignment() {
			this.$refs.excelAssignment.showDialog(this.form)
		},
		handleConditionAssignment() {
			this.$refs.excelConditionAssignment.showDialog(this.form)
		},
		assignmentSubmit(data) {
			this.form.assignment = data
			this.$emit('submitConfigForm', this.form)
		},
		conditionAssignmentSubmit(data) {
			this.form.conditionAssignment = data
			this.$emit('submitConfigForm', this.form)
		},
		async changeRegions(value) {
			if (value != 1) {
				let res = await this.$axios.get('jellyForm/queryRegions/' + (value - 1))
				if (res.data.code === 200) {
					this.appointRegions = res.data.data
				}
			}
		}
	}
}
</script>

<style scoped>
::v-deep .is-without-controls .el-input .el-input__inner {
	text-align: left;
}
.formContainer {
	position: fixed;
	z-index: 200;
	border-left: 1px solid #e2e4e8;
	top: 0px;
	right: 0px;
	width: 350px;
	background-color: #fff;
	overflow: auto;
}
.form {
	padding: 0px 15px 15px 15px;
}
.formVerify {
	padding: 12px 6px 1px 6px;
	background: #f8f8f8;
	position: relative;
	border-radius: 8px;
	margin-bottom: 15px;
}
.el-icon-circle-close {
	position: absolute;
	right: -6px;
	top: -6px;
	color: red;
	cursor: pointer;
}
::v-deep .el-tabs__nav {
	width: 100%;
}
::v-deep .el-tabs__item {
	width: 50%;
	text-align: center;
}
::v-deep .el-row {
	margin-bottom: 10px;
}
::v-deep .el-date-editor.el-input {
	width: 100%;
}
</style>
