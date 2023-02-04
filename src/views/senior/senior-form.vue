<template>
	<div class="container">
		<slot name="header"></slot>
		<table border="1" cellpadding="0" cellspacing="0" bordercolor="#fff" class="content">
			<tbody class="tbody">
				<tr v-for="(tr, tr_index) in tableData" :key="tr_index">
					<td
						v-for="(td, td_index) in tr"
						:key="td_index"
						:style="[td.style]"
						:rowspan="td.rowspan"
						:colspan="td.colspan"
					>
						<div v-if="!td.type" v-html="td.text" />
						<div v-else-if="td.type === 'text'">
							<el-input
								v-show="td.show"
								:type="td.inputType"
								v-model="formModel[td.field]"
								clearable
								:placeholder="td.disabled ? '' : td.placeholder"
								:maxlength="td.maxlength"
								:disabled="td.disabled"
								@input="inputChange(td.field)"
							></el-input>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'textarea'">
							<el-input
								v-show="td.show"
								type="textarea"
								autosize
								v-model="formModel[td.field]"
								clearable
								:placeholder="td.disabled ? '' : td.placeholder"
								:maxlength="td.maxlength"
								:disabled="td.disabled"
								@input="inputChange(td.field)"
							></el-input>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'number'" style="text-align:left;">
							<el-input-number
								:ref="td.field"
								v-show="td.show"
								v-model="formModel[td.field]"
								clearable
								:placeholder="td.disabled ? '' : td.placeholder"
								:disabled="td.disabled"
								@change="inputChange(td.field)"
								:controls="false"
								v-if="td.$status"
								@blur="handNumberBlur(td)"
								@mousewheel.native.prevent
								:precision="td.precision"
							></el-input-number>
							<div
								v-else
								@click="handNumberClick(td)"
								v-html="$options.filters.numberFormat(formModel[td.field])"
								style="padding-left:15px;font-size:14px;color:#606266;"
							></div>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'radio'">
							<el-radio-group
								v-model="formModel[td.field]"
								:disabled="td.disabled"
								v-show="td.show"
								@change="radioChange($event, td)"
							>
								<el-radio
									v-for="(item, index) in td.options"
									:key="index"
									:label="item.value"
									:disabled="item.disabled"
								>
									{{ item.label }}
								</el-radio>
							</el-radio-group>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'checkbox'">
							<el-checkbox-group
								v-model="td.value"
								:disabled="td.disabled"
								v-show="td.show"
								@change="checkboxChange($event, td)"
							>
								<el-checkbox
									v-for="(item, index) in td.options"
									:key="index"
									:label="item.value"
									:disabled="item.disabled"
								>
									{{ item.label }}
								</el-checkbox>
							</el-checkbox-group>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'select'">
							<el-select
								v-model="formModel[td.field]"
								filterable
								:placeholder="td.disabled ? '' : td.placeholder"
								:disabled="td.disabled"
								clearable
								:multiple="td.multiple"
								v-show="td.show"
								@change="selectChange($event, td)"
							>
								<el-option
									v-for="item in td.options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
									:disabled="item.disabled"
								></el-option>
							</el-select>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'switch'">
							<el-switch
								v-model="formModel[td.field]"
								:inactive-value="td.inactiveValue"
								:active-value="td.activeValue"
								:disabled="td.disabled"
								v-show="td.show"
								@change="switchChange($event, td)"
							></el-switch>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'timePicker'">
							<el-time-picker
								v-model="formModel[td.field]"
								value-format="HH:mm:ss"
								:placeholder="td.disabled ? '' : td.placeholder"
								:disabled="td.disabled"
								clearable
								v-show="td.show"
								@change="timePickerChange($event, td)"
							>
							</el-time-picker>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'datePicker'">
							<el-date-picker
								v-model="formModel[td.field]"
								:type="td.dateType"
								:value-format="td.valueFormat"
								:placeholder="td.disabled ? '' : td.placeholder"
								:disabled="td.disabled"
								clearable
								:default-value="td.defaultValue"
								@change="datePickerChange($event, td)"
								v-show="td.show"
								align="center"
							>
							</el-date-picker>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'timeRangePicker'">
							<el-time-picker
								is-range
								arrow-control
								v-model="td.value"
								range-separator="至"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								value-format="HH:mm:ss"
								:disabled="td.disabled"
								clearable
								@change="timeRangePickerChange($event, td)"
								v-show="td.show"
							></el-time-picker>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'dateRangePicker'">
							<el-date-picker
								v-model="td.value"
								type="daterange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="yyyy-MM-dd"
								:disabled="td.disabled"
								clearable
								@change="dateRangePickerChange($event, td)"
								v-show="td.show"
								align="center"
							></el-date-picker>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'calculate'" style="padding-left: 10px; padding-right: 10px;font-size:14px;">
							{{ formModel[td.field] }}
						</div>
						<div v-else-if="td.type === 'table'">
							<el-table
								:data="formModel[td.field]"
								border
								highlight-current-row
								stripe
								max-height="210"
								:show-summary="td.showSummary"
								@cell-dblclick="
									(row, column, cell, event) => cellDblclick(row, column, cell, event, td)
								"
								:summary-method="
									({ columns, data }) => getSummaries({ columns, data }, td.summaryArray)
								"
							>
								<el-table-column
									:prop="item.field"
									:label="item.name"
									v-for="(item, index) in td.tableData"
									:key="index"
									align="center"
									:render-header="
										(h, { column, $index }) => renderHeader(h, { column, $index }, item)
									"
								>
									<template slot-scope="scope">
										<div v-if="item.type === 'input'">
											<el-input v-model="scope.row[item.field]" :disabled="td.disabled">
											</el-input>
										</div>
										<div v-if="item.type === 'number'">
											<el-input-number
												v-model="scope.row[item.field]"
												:disabled="td.disabled"
												@input="handleTableChange(td.field, item.field, item)"
												type="number"
												v-if="!scope.row.$status"
												v-focus
												@blur="handleTableBlur(td.field, scope.$index, false)"
												oninput="value=value.indexOf('.') > -1?value.slice(0, value.indexOf('.') + 3):value"
												@mousewheel.native.prevent
												:controls="false"
											></el-input-number>
											<div
												v-else
												@click="handleTableBlur(td.field, scope.$index, true)"
												v-html="$options.filters.numberFormat(scope.row[item.field])"
											></div>
										</div>
										<div v-else-if="item.type === 'select'">
											<el-select
												v-model="scope.row[item.field]"
												filterable
												:disabled="td.disabled"
											>
												<el-option
													v-for="option in tableDynamic[item.field]"
													:key="option.value"
													:label="option.label"
													:value="
														typeof scope.row[item.field] === 'number'
															? +option.value
															: option.value
													"
												></el-option>
											</el-select>
										</div>
										<div v-else-if="item.type === 'switch'">
											<el-switch
												v-model="scope.row[item.field]"
												:disabled="td.disabled"
											></el-switch>
										</div>
										<div v-else-if="item.type === 'timePicker'">
											<el-time-picker
												v-model="scope.row[item.field]"
												value-format="HH:mm:ss"
												:disabled="td.disabled"
											>
											</el-time-picker>
										</div>
										<div v-else-if="item.type === 'datePicker'">
											<el-date-picker
												v-model="scope.row[item.field]"
												type="date"
												value-format="yyyy-MM-dd"
												:disabled="td.disabled"
												align="center"
											>
											</el-date-picker>
										</div>
										<div v-else-if="item.type === 'calculation'">
											{{ calculationFormat(scope, item.field, item.calculation, td.field) }}
										</div>
										<div class="inside-input" v-else-if="item.type === 'department'">
											<el-select
												v-model="scope.row[item.field]"
												filterable
												:disabled="td.disabled"
											>
												<el-option
													v-for="item in tableDynamic[item.field]"
													:key="item.value"
													:label="item.label"
													:value="+item.value"
												></el-option>
											</el-select>
											<i
												class="el-icon-document-copy iconE"
												@click="
													handleTableDialog(scope.$index, td.field + '.' + item.field, item)
												"
												v-show="td.show && !td.disabled"
											></i>
										</div>
										<div class="inside-input" v-else-if="item.type === 'member'">
											<el-select
												v-model="scope.row[item.field]"
												filterable
												:disabled="td.disabled"
											>
												<el-option
													v-for="option in tableDynamic[item.field]"
													:key="option.value"
													:label="option.label"
													:value="+option.value"
												></el-option>
											</el-select>
											<i
												class="el-icon-document-copy iconE"
												@click="
													handleTableDialog(scope.$index, td.field + '.' + item.field, item)
												"
												v-show="td.show && !td.disabled"
											></i>
										</div>
										<div class="inside-input" v-else-if="item.type === 'business'">
											<el-select
												v-model="scope.row[item.field]"
												filterable
												:disabled="td.disabled"
											>
												<el-option
													v-for="option in tableDynamic[item.field]"
													:key="option.value"
													:label="option.label"
													:value="option.value"
												></el-option>
											</el-select>
											<i
												class="el-icon-document-copy iconE"
												@click="
													handleTableDialog(scope.$index, td.field + '.' + item.field, item)
												"
												v-show="td.show && !td.disabled"
											></i>
										</div>
									</template>
								</el-table-column>
								<el-table-column
									label="操作"
									width="90px"
									align="center"
									fixed="right"
									v-if="!td.disabled"
								>
									<template slot-scope="scope">
										<i
											class="el-icon-circle-plus-outline tableAdd"
											@click="handleTableAdd(scope.$index, td)"
										></i>
										<i
											class="el-icon-remove-outline tableDel"
											@click="handleTableDel(scope.$index, td)"
										></i>
									</template>
								</el-table-column>
								<div slot="empty" @click="handleTableAdd(0, td)" v-if="!td.disabled">
									暂无数据 <i class="el-icon-circle-plus-outline"></i>
								</div>
							</el-table>
						</div>
						<div v-else-if="td.type === 'upload'" class="upload">
							<el-upload
								:ref="td.field"
								:action="action"
								:headers="headers"
								multiple
								:show-file-list="false"
								v-if="!td.disabled"
								:file-list="formModel[td.field]"
								:before-upload="
									file => {
										return beforeFileUpload(file, td)
									}
								"
								:on-success="
									(res, file, fileList) => {
										return handleFileSuccess(res, file, fileList, td)
									}
								"
							>
								<el-button type="primary" icon="el-icon-upload"> 上传</el-button>
							</el-upload>
							<el-table
								:data="formModel[td.field]"
								max-height="300"
								border
								stripe
								style="margin-top:15px"
								:key="tableKey"
							>
								<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
								<el-table-column prop="name" label="文件名" align="center"></el-table-column>
								<el-table-column
									prop="size"
									label="大小"
									align="center"
									:formatter="sizeFormatter"
								></el-table-column>
								<el-table-column label="操作" align="center">
									<template slot-scope="scope">
										<i
											class="el-icon-view"
											style="font-size:16px"
											@click="handleFilePreview(scope.row, td.field)"
										></i>
										<i
											class="el-icon-download"
											style="font-size:16px;margin-left:10px;margin-right:10px;"
											v-if="!td.disabled"
											@click="handleFileDownload(scope.row)"
										></i>
										<i
											class="el-icon-delete"
											style="font-size:16px"
											v-if="!td.disabled"
											@click="handleFileRemove(scope.row, td.field)"
										></i>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<div v-else-if="td.type === 'editor'">
							<editor
								:id="td.field"
								v-model="formModel[td.field]"
								:placeholder="td.disabled ? '' : td.placeholder"
								:enable="!td.disabled"
							>
							</editor>
						</div>
						<div v-else-if="td.type === 'bill'">
							<el-input
								v-show="td.show"
								v-model="formModel[td.field]"
								clearable
								:placeholder="td.disabled ? '' : td.placeholder"
								:disabled="td.disabled"
							></el-input>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'process'" v-html="formModel[td.field]"></div>
						<div v-else-if="td.type === 'picture'" style="padding:10px;text-align:left;">
							<el-upload
								v-if="!td.multiple"
								class="avatar-uploader"
								:action="action"
								:headers="headers"
								:show-file-list="false"
								:disabled="td.disabled"
								:class="td.disabled ? 'upload-disabled' : ''"
								:before-upload="
									file => {
										return beforeFileUpload(file, td)
									}
								"
								:on-success="
									(res, file, fileList) => {
										return handleFileSuccess(res, file, fileList, td)
									}
								"
								:on-preview="
									file => {
										return handleFilePreview(file, td.field)
									}
								"
							>
								<el-image
									v-if="formModel[td.field].length != 0"
									:src="formModel[td.field][0].url"
									class="avatar"
									lazy
								></el-image>
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
							<el-upload
								v-else
								:ref="td.field"
								:action="action"
								:headers="headers"
								:file-list="formModel[td.field]"
								:disabled="td.disabled"
								:class="td.disabled ? 'upload-disabled' : ''"
								multiple
								:before-upload="
									file => {
										return beforeFileUpload(file, td)
									}
								"
								list-type="picture-card"
								:on-success="
									(res, file, fileList) => {
										return handleFileSuccess(res, file, fileList, td)
									}
								"
							>
								<i class="el-icon-plus"></i>
								<div slot="file" slot-scope="{ file }">
									<img
										class="el-upload-list__item-thumbnail"
										:src="
											file.url +
												'?x-oss-process=image/resize,w_148,h_148/auto-orient,1/quality,q_90/format,jpg'
										"
										v-if="file.type === 'image'"
										style="width:148px;height:148px;"
									/>
									<img
										class="el-upload-list__item-thumbnail"
										src="@/assets/fileType/tif.svg"
										v-else-if="file.type === 'tif'"
									/>
									<img
										class="el-upload-list__item-thumbnail"
										src="@/assets/fileType/txt.svg"
										v-else-if="file.type === 'txt'"
									/>
									<img
										class="el-upload-list__item-thumbnail"
										src="@/assets/fileType/excel.svg"
										v-else-if="file.type === 'excel'"
									/>
									<img
										class="el-upload-list__item-thumbnail"
										src="@/assets/fileType/word.svg"
										v-else-if="file.type === 'word'"
									/>
									<img
										class="el-upload-list__item-thumbnail"
										src="@/assets/fileType/pdf.svg"
										v-else-if="file.type === 'pdf'"
									/>
									<img
										class="el-upload-list__item-thumbnail"
										src="@/assets/fileType/ppt.svg"
										v-else-if="file.type === 'ppt'"
									/>
									<img
										class="el-upload-list__item-thumbnail"
										src="@/assets/fileType/video.svg"
										v-else-if="file.type === 'video'"
									/>
									<img
										class="el-upload-list__item-thumbnail"
										src="@/assets/fileType/zip.svg"
										v-else-if="file.type === 'zip'"
									/>
									<img
										class="el-upload-list__item-thumbnail"
										src="@/assets/fileType/ofd.svg"
										v-else-if="file.type === 'ofd'"
									/>
									<img
										class="el-upload-list__item-thumbnail"
										src="@/assets/fileType/rtf.svg"
										v-else-if="file.type === 'rtf'"
									/>
									<img
										class="el-upload-list__item-thumbnail"
										src="@/assets/fileType/other.svg"
										v-else
									/>
									<span class="el-upload-list__item-actions">
										<span
											class="el-upload-list__item-preview"
											@click="handleFilePreview(file, td.field)"
											v-if="
												file.type === 'image' ||
													file.type === 'tif' ||
													file.type === 'pdf' ||
													file.type === 'word' ||
													file.type === 'excel' ||
													file.type === 'ppt' ||
													file.type === 'txt' ||
													file.type === 'ofd' ||
													file.type === 'rtf'
											"
										>
											<i class="el-icon-view"></i>
										</span>
										<span class="el-upload-list__item-delete" @click="handleFileDownload(file)">
											<i class="el-icon-download"></i>
										</span>
										<span
											class="el-upload-list__item-delete"
											@click="handleFileRemove(file, td.field)"
											v-if="!td.disabled"
										>
											<i class="el-icon-delete"></i>
										</span>
									</span>
								</div>
							</el-upload>
						</div>
						<div v-else-if="td.type === 'area'">
							<el-cascader
								:key="td.key"
								v-show="td.show"
								v-model="formModel[td.field]"
								clearable
								:placeholder="td.disabled ? '' : td.placeholder"
								:disabled="td.disabled"
								:options="td.regions"
								:props="{ value: 'code', label: 'name' }"
								filterable
							>
							</el-cascader>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'department'" class="inside-input">
							<el-select
								v-model="formModel[td.field]"
								:placeholder="td.disabled ? '' : td.placeholder"
								clearable
								:multiple="td.multiple"
								v-show="td.show"
								:disabled="td.disabled"
							>
								<el-option
									v-for="item in td.options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
							<i
								class="el-icon-document-copy iconE"
								@click="handleDeptDynamicDialog(td)"
								v-show="td.show && !td.disabled"
							></i>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'member'" class="inside-input">
							<el-select
								v-model="formModel[td.field]"
								:placeholder="td.disabled ? '' : td.placeholder"
								clearable
								:multiple="td.multiple"
								v-show="td.show"
								:disabled="td.disabled"
							>
								<el-option
									v-for="item in td.options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
							<i
								class="el-icon-document-copy iconE"
								@click="handleMemberDynamicDialog(td)"
								v-show="td.show && !td.disabled"
							></i>
							<div v-show="!td.show">******</div>
						</div>
						<div v-else-if="td.type === 'business'" class="inside-input">
							<el-select
								:ref="td.field"
								v-model="formModel[td.field]"
								:placeholder="td.disabled ? '' : td.placeholder"
								clearable
								:multiple="td.multiple"
								v-show="td.show"
								:disabled="td.disabled"
								@click.native="handleBusinessDetail(td)"
								@focus="handleSelectFocus(td.field)"
							>
								<el-option
									v-for="item in td.options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
							<i
								class="el-icon-document-copy iconE"
								@click="handleBusinessDialog(td)"
								v-show="td.show && !td.disabled"
							></i>
							<div v-show="!td.show">******</div>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<excel-dept ref="excelDept" @confirm="deptConfirm" />
		<excel-multiple-dept ref="excelMultipleDept" @confirm="deptConfirm" />
		<excel-member ref="excelMember" @confirm="memberConfirm" />
		<excel-multiple-member ref="excelMultipleMember" @confirm="memberConfirm" />
		<excel-business ref="excelBusiness" @confirm="businessConfirm" />
		<el-image-viewer v-if="previewDialogVisible" :on-close="closeViewer" :zIndex="9999" :url-list="previewSrcList" />
	</div>
</template>

<script>
import excelDept from '@/views/components/form/dept'
import excelMultipleDept from '@/views/components/form/multiple-dept'
import excelMember from '@/views/components/form/member'
import excelMultipleMember from '@/views/components/form/multiple-member'
import excelBusiness from '@/views/senior/senior-business'
import { Image } from 'element-ui'
import editor from '@/views/components/quill/editor'
import { handleFormula } from '@/utils/formula.js'

export default {
	components: {
		excelDept,
		excelMultipleDept,
		excelMember,
		excelMultipleMember,
		excelBusiness,
		ElImageViewer: Image.components.ImageViewer,
		editor
	},
	props: {
		action: {
			type: String,
			default: ''
		},
		formCofig: {
			type: Object,
			default: () => {}
		},
		formModel: {
			type: Object,
			default: () => {}
		},
		property: {
			type: Object,
			default: () => {}
		},
		calculate: {
			type: Object,
			default: () => {}
		},
		disabled: {
			type: Array,
			default: () => []
		},
		hidden: {
			type: Array,
			default: () => []
		},
		editable: {
			type: Array,
			default: () => []
		},
		disabledField: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		statusChange() {
			const { disabled, hidden, editable } = this
			return {
				disabled,
				hidden,
				editable
			}
		}
	},
	watch: {
		formCofig: {
			handler(newVal) {
				this.loadView()
			},
			immediate: false,
			deep: true
		},
		statusChange: {
			handler(newVal) {
				this.handleParameter()
			},
			immediate: false,
			deep: true
		}
	},
	directives: {
		focus: {
			inserted(el) {
				el.children[0].focus()
			}
		},
		'number-focus': {
			inserted(el) {
				el.children[0].children[0].focus()
			}
		}
	},
	filters: {
		numberFormat(value) {
			if (value) {
				return (
					value &&
					(value.toString().indexOf('.') != -1
						? value.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($1, $2) {
								return $2 + ','
						  })
						: value.toString().replace(/(\d)(?=(\d{3})+\b)/g, function($1, $2) {
								return $2 + ','
						  }))
				)
			} else {
				return '&nbsp;'
			}
		}
	},
	data() {
		return {
			headers: {
				Authorization: window.localStorage.getItem('Authorization')
			},
			letter: [
				'A',
				'B',
				'C',
				'D',
				'E',
				'F',
				'G',
				'H',
				'I',
				'J',
				'K',
				'L',
				'M',
				'N',
				'O',
				'P',
				'Q',
				'R',
				'S',
				'T',
				'U',
				'V',
				'W',
				'X',
				'Y',
				'Z'
			],
			tableData: [],
			rules: {},
			tableDynamic: {},
			tableIndex: -1,
			tableItem: {},
			previewDialogVisible: false,
			previewSrcList: [],
			resetFieldMap: {},
			tableKey: Math.random()
		}
	},
	created() {
		this.loadView()
	},
	methods: {
		//初始化
		loadView() {
			this.tableData = []

			var workbook = this.formCofig
			var row = workbook.row
			var col = workbook.col
			var module = workbook.module
			var rows = workbook.data.rows
			var cols = workbook.data.cols
			var rowHeight = 32
			var colWidth = 120
			var styles = workbook.data.styles
			var merges = workbook.data.merges

			for (let i = 0; i < row; i++) {
				var cells = {}
				if (rows[i]) {
					cells = rows[i].cells
				}
				var tr = []
				for (var j = 0; j < col; j++) {
					var cell = cells[j] || {}
					var td = {
						rowspan: 1,
						colspan: 1,
						style: { width: colWidth + 'px', height: rowHeight + 'px' }
					}
					if (rows[i] && rows[i].height) {
						td.style.height = rows[i].height + 'px'
					}
					if (cols[j] && cols[j].width) {
						td.style.width = cols[j].width + 'px'
					}
					td = this.handleMerge(merges, i, j, td)
					if (td.rowspan != 0 && td.colspan != 0) {
						td.style['border'] = 'solid 1px #8E8E8E'
						if (cell.key && module[cell.key]) {
							var property = module[cell.key]
							td.type = property.type
							td.key = cell.key
							td.row = this.tableData.length
							td.col = tr.length
							if (td.type === 'text' || td.type === 'textarea') {
								//输入框
								// 属性
								td.placeholder = property.placeholder
								td.disabled = property.disabled
								td.maxlength = property.maxlength
								td.required = property.required
								td.field = property.table + '.' + property.field[0]
								if (!this.formModel[td.field] && property.defaults) {
									this.$set(this.formModel, td.field, property.defaults)
								}
								// 验证规则
								let rules = []
								if (property.required) {
									rules.push({ required: true, message: property.placeholder })
								}
								if (property.maxlength) {
									rules.push({
										max: '长度最多' + property.maxlength + '个字符',
										message: property.placeholder
									})
								}
								if (property.rules) {
									for (let k = 0; k < property.rules.length; k++) {
										let rule = property.rules[k]
										if (rule.type === 'regex') {
											rules.push({ pattern: rule.expression, message: rule.message })
										} else if (rule.type === 'eval') {
											rules.push({ validator: rule.expression, message: rule.message })
										}
									}
								}
								if (rules.length != 0) {
									this.rules[td.field] = rules
								}
							} else if (td.type === 'number') {
								//数字
								// 属性
								td.$status = true
								td.placeholder = property.placeholder
								td.disabled = property.disabled
								td.decimal = property.decimal
								td.precision = property.precision || 0
								td.required = property.required
								td.field = property.table + '.' + property.field[0]
								// 验证规则
								let rules = []
								if (property.required) {
									rules.push({ required: true, message: property.placeholder })
								}
								if (property.rules) {
									for (let k = 0; k < property.rules.length; k++) {
										let rule = property.rules[k]
										if (rule.type === 'regex') {
											rules.push({ pattern: rule.expression, message: rule.message })
										} else if (rule.type === 'eval') {
											rules.push({ validator: rule.expression, message: rule.message })
										}
									}
								}
								if (rules.length != 0) {
									this.rules[td.field] = rules
								}
							} else if (td.type === 'radio') {
								//单选框
								td.field = property.table + '.' + property.field[0]
								td.required = property.required
								td.disabled = property.disabled
								td.source = property.source

								if (property.logic) {
									td.logic = property.logic
								}
								if (property.required) {
									this.rules[td.field] = [{ required: true, message: property.placeholder }]
								}
								if (this.formModel[td.field] || this.formModel[td.field] == 0) {
									this.formModel[td.field] = String(this.formModel[td.field])
								} else {
									if (property.defaults || property.defaults === 0) {
										this.$set(this.formModel, td.field, String(property.defaults))
									}
								}
								this.queryDictionaryDetail(td)
							} else if (td.type === 'checkbox') {
								//多选框
								td.field = property.table + '.' + property.field[0]
								td.required = property.required
								td.disabled = property.disabled
								td.source = property.source

								if (property.logic) {
									td.logic = property.logic
								}
								if (property.required) {
									this.rules[td.field] = [
										{ type: 'array', required: true, message: property.placeholder }
									]
								}

								if (this.formModel[td.field]) {
									if (!(this.formModel[td.field] instanceof Array)) {
										this.$set(this.formModel, td.field, String(this.formModel[td.field]).split(','))
									}
								} else {
									if (property.defaults) {
										this.$set(this.formModel, td.field, property.defaults)
									} else {
										this.$set(this.formModel, td.field, [])
									}
								}
								this.queryDictionaryDetail(td)
							} else if (td.type === 'select') {
								//下拉选择
								td.field = property.table + '.' + property.field[0]
								td.required = property.required
								td.disabled = property.disabled
								td.source = property.source
								td.placeholder = property.placeholder
								td.multiple = property.multiple

								if (property.logic) {
									td.logic = property.logic
								}
								if (property.required) {
									if (td.multiple) {
										this.rules[td.field] = [
											{ type: 'array', required: true, message: property.placeholder }
										]
									} else {
										this.rules[td.field] = [{ required: true, message: property.placeholder }]
									}
								}

								if (this.formModel[td.field] || this.formModel[td.field] == 0) {
									if (td.multiple) {
										if (!(this.formModel[td.field] instanceof Array)) {
											this.$set(
												this.formModel,
												td.field,
												String(this.formModel[td.field]).split(',')
											)
										}
									} else {
										this.$set(this.formModel, td.field, String(this.formModel[td.field]))
									}
								} else {
									if (td.multiple) {
										if (property.defaults) {
											this.$set(this.formModel, td.field, property.defaults)
										} else {
											this.$set(this.formModel, td.field, [])
										}
									} else {
										if (property.defaults || property.defaults === 0) {
											this.$set(this.formModel, td.field, String(property.defaults))
										}
									}
								}
								this.queryDictionaryDetail(td)
							} else if (td.type === 'switch') {
								//开关组件
								td.disabled = property.disabled
								td.activeValue = property.activeValue.toString() || '1'
								td.inactiveValue = property.inactiveValue.toString() || '0'
								td.field = property.table + '.' + property.field[0]
								if (property.logic) {
									td.logic = property.logic
								}
								if (property.required) {
									this.rules[td.field] = [{ required: true, message: property.placeholder }]
								}
								if (!this.formModel[td.field]) {
									this.$set(this.formModel, td.field, td.inactiveValue.toString())
									let tempTd = JSON.parse(JSON.stringify(td))
									this.$nextTick(() => {
										this.logicLinkage(tempTd.inactiveValue, tempTd)
									})
								} else {
									this.$set(this.formModel, td.field, this.formModel[td.field].toString())
									if (this.disabled.indexOf(td.field) === -1) {
										let tempTd = JSON.parse(JSON.stringify(td))
										this.$nextTick(() => {
											this.logicLinkage(this.formModel[tempTd.field], tempTd)
										})
									}
								}
							} else if (td.type === 'timePicker') {
								//时间选择
								td.placeholder = property.placeholder
								td.disabled = property.disabled
								td.field = property.table + '.' + property.field[0]
								td.required = property.required
								if (property.required) {
									this.rules[td.field] = [{ required: true, message: property.placeholder }]
								}
							} else if (td.type === 'datePicker') {
								//日期选择
								td.defaultValue = property.defaultValue
									? new Date(property.defaultValue.toString())
									: ''
								td.dateType = property.dateType ? property.dateType.split('|')[0] : 'date'
								td.valueFormat = property.dateType ? property.dateType.split('|')[1] : 'yyyy-MM-dd'
								td.placeholder = property.placeholder
								td.disabled = property.disabled
								td.required = property.required
								td.defaultsCurrent = property.defaultsCurrent
								td.field = property.table + '.' + property.field[0]

								if (property.required) {
									this.rules[td.field] = [{ required: true, message: property.placeholder }]
								}
								if (this.formModel[td.field]) {
									this.$set(this.formModel, td.field, this.formModel[td.field].toString())
								}
								if (!this.formModel[td.field]) {
									if (property.defaultsCurrent) {
										let currentDate = new Date()
										let year = currentDate.getFullYear()
										let month =
											currentDate.getMonth() + 1 < 10
												? '0' + (currentDate.getMonth() + 1)
												: currentDate.getMonth() + 1
										let day =
											currentDate.getDate() < 10
												? '0' + currentDate.getDate()
												: currentDate.getDate()
										let hours =
											currentDate.getHours() < 10
												? '0' + currentDate.getHours()
												: currentDate.getHours()
										let minutes =
											currentDate.getMinutes() < 10
												? '0' + currentDate.getMinutes()
												: currentDate.getMinutes()
										let seconds =
											currentDate.getSeconds() < 10
												? '0' + currentDate.getSeconds()
												: currentDate.getSeconds()
										if (td.valueFormat === 'yyyy') {
											this.$set(this.formModel, td.field, String(year))
										} else if (td.valueFormat === 'yyyy-MM') {
											this.$set(this.formModel, td.field, String(year) + '-' + String(month))
										} else if (td.valueFormat === 'yyyy-MM-dd') {
											this.$set(
												this.formModel,
												td.field,
												String(year) + '-' + String(month) + '-' + String(day)
											)
										} else if (td.valueFormat === 'yyyy-MM-dd HH:mm:ss') {
											this.$set(
												this.formModel,
												td.field,
												String(year) +
													'-' +
													String(month) +
													'-' +
													String(day) +
													' ' +
													String(hours) +
													':' +
													String(minutes) +
													':' +
													String(seconds)
											)
										} else if (td.valueFormat === 'yyyy-MM-dd hh:mm:ss') {
											this.$set(
												this.formModel,
												td.field,
												String(year) +
													'-' +
													String(month) +
													'-' +
													String(day) +
													' ' +
													String(hours) +
													':' +
													String(minutes) +
													':' +
													String(seconds)
											)
										}
									} else {
										if (property.defaults) {
											this.$set(this.formModel, td.field, property.defaults.toString())
										}
									}
								}
							} else if (td.type === 'timeRangePicker') {
								//时间范围
								td.disabled = property.disabled
								td.required = property.required
								td.field = [
									property.table + '.' + property.field[0],
									property.table + '.' + property.field[1]
								]
								if (property.required) {
									this.rules[td.field[0]] = [{ required: true, message: property.placeholder }]
									this.rules[td.field[1]] = [{ required: true, message: property.placeholder }]
								}
								if (this.formModel[td.field[0]] && this.formModel[td.field[1]]) {
									td.value = [this.formModel[td.field[0]], this.formModel[td.field[1]]]
								}
							} else if (td.type === 'dateRangePicker') {
								//日期范围
								td.disabled = property.disabled
								td.required = property.required
								td.field = [
									property.table + '.' + property.field[0],
									property.table + '.' + property.field[1]
								]
								if (property.required) {
									this.rules[td.field[0]] = [{ required: true, message: property.placeholder }]
									this.rules[td.field[1]] = [{ required: true, message: property.placeholder }]
								}
								if (this.formModel[td.field[0]] && this.formModel[td.field[1]]) {
									td.value = [
										this.formModel[td.field[0]].toString(),
										this.formModel[td.field[1]].toString()
									]
								}
							} else if (td.type === 'calculate') {
								//计算公式
								td.field = property.table + '.' + property.field[0]
								this.calculate[td.field] = property.calculate
							} else if (td.type === 'table') {
								//明细、表格
								td.field = property.table
								td.showSummary = property.showSummary
								td.tableData = property.tableData
								td.detailForm = property.detailForm

								if (!this.formModel[td.field]) {
									this.formModel[td.field] = []
								}

								if (property.required) {
									this.rules[td.field] = [
										{ type: 'table', required: true, message: property.placeholder }
									]
								}

								let summaryArray = []
								for (var k = 0; k < property.tableData.length; k++) {
									let item = property.tableData[k]

									if (item.summary) {
										summaryArray.push(item.field)
									}

									if (item.required) {
										this.rules[td.field + '.' + item.field] = [
											{ type: 'detail', required: true, message: '请填写' + item.name }
										]
									}
									if (
										item.type === 'radio' ||
										item.type === 'checkbox' ||
										item.type === 'select' ||
										item.type === 'department' ||
										item.type === 'member' ||
										item.type === 'business'
									) {
										this.tableDynamic = Object.assign(this.tableDynamic, {})
										this.$set(this.tableDynamic, td.tableData[k].field, [])
										console.log('tableDynamic', this.tableDynamic)
										this.queryTableDetailData(item)
									}
								}
								td.summaryArray = summaryArray
							} else if (td.type === 'upload') {
								td.field = property.table + '.' + property.field[0]
								td.disabled = property.disabled
								if (property.required) {
									this.rules[td.field] = [
										{ type: 'relation', required: true, message: property.placeholder }
									]
								}

								if (this.formModel[td.field]) {
									if (!(this.formModel[td.field] instanceof Array)) {
										this.formModel[td.field] = JSON.parse(this.formModel[td.field])
									}
								} else {
									this.formModel[td.field] = []
								}
							} else if (td.type === 'business') {
								//业务应用
								td.field = property.table + '.' + property.field[0]
								td.required = property.required
								td.disabled = property.disabled
								td.placeholder = property.placeholder
								td.multiple = property.multiple
								td.source = property.source
								td.showField = property.showField
								td.assignment = property.assignment
								// 设置关联字段
								if (property.hasOwnProperty('conditionAssignment')) {
									td.conditionAssignment = property.conditionAssignment
									this.resetFieldMap = {}
									if (td.conditionAssignment.length > 0) {
										let fields = []
										fields.push(td.field)
										if (td.assignment) {
											for (let i = 0; i < td.assignment.length; i++) {
												fields.push(td.assignment[i].target)
											}
										}
										for (let i = 0; i < td.conditionAssignment.length; i++) {
											this.resetFieldMap[td.conditionAssignment[i].value] = fields
										}
									}
								}

								if (property.required) {
									if (td.multiple) {
										this.rules[td.field] = [
											{ type: 'array', required: true, message: property.placeholder }
										]
									} else {
										this.rules[td.field] = [{ required: true, message: property.placeholder }]
									}
								}
								if (this.formModel[td.field]) {
									if (td.multiple) {
										if (!(this.formModel[td.field] instanceof Array)) {
											this.$set(
												this.formModel,
												td.field,
												String(this.formModel[td.field]).split(',')
											)
										}
									} else {
										this.$set(this.formModel, td.field, String(this.formModel[td.field]))
									}
									this.queryBusinessData(td)
								} else {
									this.$set(this.formModel, td.field, [])
								}
							} else if (td.type === 'editor') {
								td.field = property.table + '.' + property.field[0]
								td.required = property.required
								td.placeholder = property.placeholder
								td.disabled = property.disabled
								if (property.required) {
									this.rules[td.field] = [{ required: true, message: property.placeholder }]
								}
								if (this.formModel[td.field]) {
									this.$set(this.formModel, td.field, JSON.parse(this.formModel[td.field]))
								} else {
									this.$set(this.formModel, td.field, {})
								}
							} else if (td.type === 'bill') {
								//单据组件
								td.placeholder = property.placeholder
								td.disabled = property.disabled
								td.required = property.required
								td.field = property.table + '.' + property.field[0]
								td.billDate = property.billDate
								td.digit = property.digit
								td.prefix = property.prefix

								if (property.required) {
									this.rules[td.field] = [{ required: true, message: property.placeholder }]
								}
								if (!this.formModel[td.field]) {
									this.queryBill(property.table, property.field[0], td.prefix, td.billDate, td.digit)
								}
							} else if (td.type === 'process') {
								//流程组件
								td.field = property.nodeName
								this.queryProcessDetail(property.nodeName, property.processFormat)
							} else if (td.type === 'picture') {
								//图片上传
								td.placeholder = property.placeholder
								td.disabled = property.disabled
								td.required = property.required
								td.multiple = property.multiple
								td.minValue = property.minValue
								td.maxValue = property.maxValue
								td.field = property.table + '.' + property.field[0]
								if (property.required) {
									this.rules[td.field] = [
										{ type: 'array', required: true, message: property.placeholder }
									]
								}
								if (this.formModel[td.field] && !(this.formModel[td.field] instanceof Array)) {
									this.formModel[td.field] = JSON.parse(this.formModel[td.field])
								} else {
									this.formModel[td.field] = []
								}
							} else if (td.type === 'area') {
								//省市区
								td.key = new Date().getTime()
								td.placeholder = property.placeholder
								td.disabled = property.disabled
								td.required = property.required
								td.format = property.format
								td.regions = []
								if (td.format != 1 && property.appoint && property.appoint.length > 0) {
									td.format = property.appoint[property.appoint.length - 1]
								}
								td.field = property.table + '.' + property.field[0]
								if (property.required) {
									this.rules[td.field] = [
										{ type: 'array', required: true, message: property.placeholder }
									]
								}

								if (this.formModel[td.field] && !(this.formModel[td.field] instanceof Array)) {
									this.formModel[td.field] = JSON.parse(this.formModel[td.field])
								} else {
									this.formModel[td.field] = []
								}
								this.queryRegions(td)
							} else if (td.type === 'department') {
								//部门组件
								td.field = property.table + '.' + property.field[0]
								td.required = property.required
								td.disabled = property.disabled
								td.placeholder = property.placeholder
								td.multiple = property.multiple

								if (property.required) {
									this.rules[td.field] = [{ required: true, message: property.placeholder }]
								}
								if (this.formModel[td.field]) {
									if (td.multiple) {
										if (!(this.formModel[td.field] instanceof Array)) {
											this.$set(
												this.formModel,
												td.field,
												String(this.formModel[td.field]).split(',')
											)
										}
									} else {
										this.$set(this.formModel, td.field, String(this.formModel[td.field]))
									}
								} else {
									if (td.multiple) {
										if (property.defaults) {
											this.$set(this.formModel, td.field, [
												String(localStorage.getItem('departmentId'))
											])
										} else {
											this.$set(this.formModel, td.field, [])
										}
									} else {
										if (property.defaults) {
											this.$set(
												this.formModel,
												td.field,
												String(localStorage.getItem('departmentId'))
											)
										} else {
											this.$set(this.formModel, td.field, [])
										}
									}
								}
								this.queryDynamic(td)
							} else if (td.type === 'member') {
								//成员组件
								td.field = property.table + '.' + property.field[0]
								td.required = property.required
								td.disabled = property.disabled
								td.placeholder = property.placeholder
								td.multiple = property.multiple

								if (property.required) {
									this.rules[td.field] = [{ required: true, message: property.placeholder }]
								}
								if (this.formModel[td.field]) {
									if (td.multiple) {
										if (!(this.formModel[td.field] instanceof Array)) {
											this.$set(
												this.formModel,
												td.field,
												String(this.formModel[td.field]).split(',')
											)
										}
									} else {
										this.$set(this.formModel, td.field, String(this.formModel[td.field]))
									}
								} else {
									if (td.multiple) {
										if (property.defaults) {
											this.$set(this.formModel, td.field, [
												String(localStorage.getItem('userId'))
											])
										} else {
											this.$set(this.formModel, td.field, [])
										}
									} else {
										if (property.defaults) {
											this.$set(this.formModel, td.field, String(localStorage.getItem('userId')))
										} else {
											this.$set(this.formModel, td.field, [])
										}
									}
								}
								this.queryDynamic(td)
							}
						} else {
							// 纯文本
							td.text = cell.text || '&nbsp;'
							td.text = td.text.replace('*', '<span style="color:#f56c6c;">*</span>')
						}
						this.getStyles(cell, td, styles)

						//禁用、隐藏、可编辑处理
						if (td.field) {
							td.show = true
							//禁用
							if (td.type === 'timeRangePicker' || td.type === 'dateRangePicker') {
								let indexDisabled =
									this.disabled.indexOf(td.field[0]) || this.disabled.indexOf(td.field[1])
								if (indexDisabled != -1) {
									td.disabled = true
								}
							} else if (td.type === 'twoDimensionalTable') {
								if (property.disabled) {
									td.disabled = true
								} else {
									let indexDisabled = this.disabled.toString().indexOf(td.table)
									if (indexDisabled != -1) {
										td.disabled = true
									}
								}
							} else {
								let indexDisabled = this.disabled.indexOf(td.field)
								if (indexDisabled != -1) {
									td.disabled = true
								}
							}

							//隐藏
							if (td.type === 'timeRangePicker' || td.type === 'dateRangePicker') {
								let indexHidden = this.hidden.indexOf(td.field[0]) || this.hidden.indexOf(td.field[1])
								if (indexHidden != -1) {
									td.show = false
								}
							} else if (td.type === 'twoDimensionalTable') {
								let indexHidden = this.hidden.toString().indexOf(td.table)
								if (indexHidden != -1) {
									td.show = false
								}
							} else {
								let indexHidden = this.hidden.indexOf(td.field)
								if (indexHidden != -1) {
									td.show = false
								}
							}

							//可编辑
							if (td.type === 'timeRangePicker' || td.type === 'dateRangePicker') {
								let indexEditable =
									this.editable.indexOf(td.field[0]) || this.editable.indexOf(td.field[1])
								if (indexEditable != -1) {
									td.show = true
									td.disabled = false
								}
							} else if (td.type === 'twoDimensionalTable') {
								if (property.disabled) {
									td.disabled = true
								} else {
									let indexEditable = this.editable.toString().indexOf(td.table)
									if (indexEditable != -1) {
										td.show = true
										td.disabled = false
									}
								}
							} else {
								let indexEditable = this.editable.indexOf(td.field)
								if (indexEditable != -1) {
									td.show = true
									td.disabled = false
								}
							}

							td.style['text-align'] = 'left'
							if(td.disabled) {
								td.style['backgroundColor'] = '#fffeee'
							} else {
								td.style['backgroundColor'] = '#fff'
							}

							this.$set(this.property, td.field, td)
						}

						// 设置禁用字段
						this.disabledField.forEach(field => {
							if (td.field == field) {
								td.disabled = true
							}
						})

						tr.push(td)
					}
				}
				this.tableData.push(tr)
			}
			//计算公式处理
			for (let key in this.calculate) {
				let text = this.calculate[key]
				this.handleCalculate(key, text)
			}
		},
		// 获取样式
		getStyles(cell, td, styles) {
			td.style['white-space'] = 'pre-wrap'
			if (cell.style || cell.style === 0) {
				var cellStyle = styles[cell.style]
				for (let styleType in cellStyle) {
					if (styleType === 'bgcolor') {
						td.style['background-color'] = cellStyle[styleType]
					} else if (styleType === 'align') {
						td.style['text-align'] = cellStyle[styleType]
					} else if (styleType === 'valign') {
						td.style['vertical-align'] = cellStyle[styleType]
					} else if (styleType === 'strike') {
						td.text = '<strike>' + td.text + '</strike>'
					} else if (styleType === 'underline') {
						td.style['text-decoration'] = 'underline'
					} else if (styleType === 'textwrap') {
						td.style['word-wrap'] = 'break-word'
						td.style['word-break'] = 'normal'
					} else if (styleType === 'font') {
						if (cellStyle[styleType].size) {
							td.style['font-size'] = cellStyle[styleType].size + 'px'
						}
						if (cellStyle[styleType].bold) {
							td.style['font-weight'] = 'bold'
						}
						if (cellStyle[styleType].italic) {
							td.style['font-style'] = 'italic'
						}
						if (cellStyle[styleType].name) {
							td.style['font-family'] = cellStyle[styleType].name
						}
					} else if (styleType === 'border') {
						if (cellStyle[styleType].top) {
							var topBorder = cellStyle[styleType].top
							if (topBorder[0] === 'thick') {
								td.style['border-top'] = 'solid 3px ' + topBorder[1]
							} else if (topBorder[0] === 'thin') {
								td.style['border-top'] = 'solid 1px ' + topBorder[1]
							} else if (topBorder[0] === 'medium') {
								td.style['border-top'] = 'solid 2px ' + topBorder[1]
							} else if (topBorder[0] === 'dashed') {
								td.style['border-top'] = 'dashed 1px ' + topBorder[1]
							} else if (topBorder[0] === 'dotted') {
								td.style['border-top'] = 'dotted 1px ' + topBorder[1]
							} else if (topBorder[0] === 'double') {
								td.style['border-top'] = 'double 1px ' + topBorder[1]
							}
						}
						if (cellStyle[styleType].bottom) {
							var bottomBorder = cellStyle[styleType].bottom
							if (bottomBorder[0] === 'thick') {
								td.style['border-bottom'] = 'solid 3px ' + bottomBorder[1]
							} else if (bottomBorder[0] === 'thin') {
								td.style['border-bottom'] = 'solid 1px ' + bottomBorder[1]
							} else if (bottomBorder[0] === 'medium') {
								td.style['border-bottom'] = 'solid 2px ' + bottomBorder[1]
							} else if (bottomBorder[0] === 'dashed') {
								td.style['border-bottom'] = 'dashed 1px ' + bottomBorder[1]
							} else if (bottomBorder[0] === 'dotted') {
								td.style['border-bottom'] = 'dotted 1px ' + bottomBorder[1]
							} else if (bottomBorder[0] === 'double') {
								td.style['border-bottom'] = 'double 1px ' + bottomBorder[1]
							}
						}
						if (cellStyle[styleType].left) {
							var leftBorder = cellStyle[styleType].left
							if (leftBorder[0] === 'thick') {
								td.style['border-left'] = 'solid 3px ' + leftBorder[1]
								//tr[tr.length - 1].style['border-right'] = 'solid 3px ' + leftBorder[1]
							} else if (leftBorder[0] === 'thin') {
								td.style['border-left'] = 'solid 1px ' + leftBorder[1]
								//tr[tr.length - 1].style['border-right'] = 'solid 1px ' + leftBorder[1]
							} else if (leftBorder[0] === 'medium') {
								td.style['border-left'] = 'solid 2px ' + leftBorder[1]
								//tr[tr.length - 1].style['border-right'] = 'solid 2px ' + leftBorder[1]
							} else if (leftBorder[0] === 'dashed') {
								td.style['border-left'] = 'dashed 1px ' + leftBorder[1]
								//tr[tr.length - 1].style['border-right'] = 'dashed 2px ' + leftBorder[1]
							} else if (leftBorder[0] === 'dotted') {
								td.style['border-left'] = 'dotted 1px ' + leftBorder[1]
								//tr[tr.length - 1].style['border-right'] = 'dotted 2px ' + leftBorder[1]
							} else if (leftBorder[0] === 'double') {
								td.style['border-left'] = 'double 1px ' + leftBorder[1]
								//tr[tr.length - 1].style['border-right'] = 'double 2px ' + leftBorder[1]
							}
						}
						if (cellStyle[styleType].right) {
							var rightBorder = cellStyle[styleType].right
							if (rightBorder[0] === 'thick') {
								td.style['border-right'] = 'solid 3px ' + rightBorder[1]
							} else if (rightBorder[0] === 'thin') {
								td.style['border-right'] = 'solid 1px ' + rightBorder[1]
							} else if (rightBorder[0] === 'medium') {
								td.style['border-right'] = 'solid 2px ' + rightBorder[1]
							} else if (rightBorder[0] === 'dashed') {
								td.style['border-right'] = 'dashed 1px ' + rightBorder[1]
							} else if (rightBorder[0] === 'dotted') {
								td.style['border-right'] = 'dotted 1px ' + rightBorder[1]
							} else if (rightBorder[0] === 'double') {
								td.style['border-right'] = 'double 1px ' + rightBorder[1]
							}
						}
					} else {
						td.style[styleType] = cellStyle[styleType]
					}
				}
			}
		},
		//合并单元格
		handleMerge(merges, row, col, td) {
			for (var i = 0; i < merges.length; i++) {
				var startMerge = merges[i].split(':')[0]
				var endMerge = merges[i].split(':')[1]
				var row_start = Number(startMerge.substr(1, startMerge.length))
				var row_end = Number(endMerge.substr(1, endMerge.length))
				var col_start = this.letter.indexOf(startMerge.substr(0, 1))
				var col_end = this.letter.indexOf(endMerge.substr(0, 1))

				if (row >= row_start - 1 && row <= row_end - 1) {
					if (col >= col_start && col <= col_end) {
						if (row === row_start - 1 && col === col_start) {
							td.rowspan = row_end - row_start + 1
							td.colspan = col_end - col_start + 1
							break
						} else {
							td.rowspan = 0
							td.colspan = 0
							break
						}
					}
				}
			}
			return td
		},
		//字典详情数据
		async queryDictionaryDetail(td) {
			let res = await this.$axios.get('dictionaryDetail/queryDisplay?classifyId=' + td.source)
			if (res.data.code === 200) {
				var options = []
				for (var l = 0; l < res.data.data.length; l++) {
					options.push({
						label: res.data.data[l].name,
						value: String(res.data.data[l].code),
						disabled: res.data.data[l].status == 0
					})
				}
				td.options = options
				this.$set(this.tableData[td.row], td.col, td)
			}
		},
		//部门或成员数据
		async queryDynamic(td) {
			let res = await this.$axios.get('jellyForm/queryDynamic?path=' + td.type + '&type=list')
			if (res.data.code === 200) {
				var options = []
				for (var l = 0; l < res.data.data.length; l++) {
					options.push({
						id: res.data.data[l].id,
						label: res.data.data[l].name,
						value: String(res.data.data[l].id)
					})
				}
				td.options = options
				this.$set(this.tableData[td.row], td.col, td)
			}
		},
		// 设置业务规则数据
		setBusinessData(td, data) {
			var options = []
			options.push({
				label: data[td.showField],
				value: this.formModel[td.field].toString()
			})
			td.options = options
			this.$set(this.tableData[td.row], td.col, td)
			//其他字段赋值
			if (td.assignment && !td.multiple) {
				for (let i = 0; i < td.assignment.length; i++) {
					let item = td.assignment[i]
					let property = this.property[item.target]
					let value = data[item.source.split('.')[1]]
					if(property) {
						if(property.type === 'text' || property.type === "textarea" || property.type === "number") {
							if(value) {
								this.$set(this.formModel, item.target, value)
							}
						} else if (property.type === "radio"
							|| property.type === "switch"
							|| property.type === "timePicker"
							|| property.type === "datePicker"
							|| property.type === "calculate"
							|| property.type === "bill") {
							if(value) {
								this.$set(this.formModel, item.target, String(value))
							}
						} else if (property.type === "checkbox") {
							if(value) {
								if(value instanceof Array) {
									this.$set(this.formModel, item.target, value)
								} else {
									this.$set(this.formModel, item.target, value.split(','))
								}
							}
						} else if (property.type === "select") {
							if(value) {
								if(property.multiple) {
									if(value instanceof Array) {
										this.$set(this.formModel, item.target, String(value))
									} else {
										this.$set(this.formModel, item.target, value.split(','))
									}
								} else {
									this.$set(this.formModel, item.target, String(value))
								}
							}
						} else if (property.type === "upload" || property.type === "picture" || property.type === "area") {
							if(value) {
								if(value instanceof Array) {
									this.$set(this.formModel, item.target, value)
								} else {
									this.$set(this.formModel, item.target, JSON.parse(value))
								}
							}
						} else if (property.type === "editor") {
							if(value) {
								this.$set(this.formModel, item.target, JSON.parse(value))
							}
						} else {
							console.log(this.property[item.target])
							if(value) {
								this.$set(this.formModel, item.target, String(value))
							}
						}
					} else {
						this.$set(this.formModel, item.target, String(value))
						console.log(item)
					}
				}
			}
		},
		//查询业务数据
		async queryBusinessData(td) {
			let params = {
				value: this.formModel[td.field].toString(),
				source: td.source,
				showField: td.showField
			}
			let res = await this.$axios.post('jellyForm/queryOptions', params)
			if (res.data.code === 200) {
				var options = []
				for (var l = 0; l < res.data.data.length; l++) {
					options.push({
						label: res.data.data[l][td.showField],
						value: String(res.data.data[l].id)
					})
				}
				td.options = options
				this.$set(this.tableData[td.row], td.col, td)
				//其他字段赋值
				if (td.assignment && !td.multiple) {
					for (let i = 0; i < td.assignment.length; i++) {
						let item = td.assignment[i]
						if (item.target.indexOf(item.source.split('.')[0] + '.') > -1) {
							this.$set(this.formModel, item.target, String(res.data.data[0][item.source.split('.')[1]]))
						}
					}
				}
			}
		},
		//表格详情数据
		async queryTableDetailData(td) {
			if (td.type === 'radio' || td.type === 'checkbox' || td.type === 'select') {
				let res = await this.$axios.get('dictionaryDetail/queryDisplay?classifyId=' + td.source)
				if (res.data.code === 200) {
					var options = []
					for (var l = 0; l < res.data.data.length; l++) {
						options.push({
							label: res.data.data[l].name,
							value: String(res.data.data[l].code)
						})
					}
					this.tableDynamic[td.field] = options
				}
			} else if (td.type === 'department' || td.type === 'member') {
				let res = await this.$axios.get('jellyForm/queryDynamic?path=' + td.type + '&type=list')
				if (res.data.code === 200) {
					var options = []
					for (var l = 0; l < res.data.data.length; l++) {
						options.push({
							label: res.data.data[l].name,
							value: String(res.data.data[l].id)
						})
					}
					this.tableDynamic[td.field] = options
				}
			} else if (td.type === 'business') {
				// let res = await this.$axios.get('jellyForm/queryListAllById?formId=' + td.businessType)
				// if (res.data.code === 200) {
				//     var options = []
				//     for(var l=0;l<res.data.data.length;l++) {
				//         options.push({
				//             label: res.data.data[l][td.showField],
				//             value: String(res.data.data[l].id)
				//         })
				//     }
				//     this.tableDynamic[td.field] = options
				// }
			}
		},
		//单据编号
		async queryBill(table, field, prefix, billDate, digit) {
			let formId = this.$route ? this.$route.query.id : this.$history.currentRoute.query.id
			if (formId) {
				let params = {
					id: formId,
					field: field,
					prefix: prefix,
					billDate: billDate,
					digit: digit
				}

				let res = await this.$axios.post('jellyForm/queryBill', params)
				if (res.data.code === 200) {
					this.$set(this.formModel, table + '.' + field, res.data.data)
				}
			}
		},
		//流程详情
		async queryProcessDetail(nodeName, processFormat) {
			if (this.$route.query.id && this.$route.query.formId) {
				let params = {
					businessKey: this.$route.query.id,
					businessType: this.$route.query.formId,
					nodeName: nodeName
				}

				let res = await this.$axios.post('flow/queryProcessDetail', params)
				if (res.data.code === 200) {
					if (res.data.data) {
						let result = ''
						for (let i = 0; i < res.data.data.length; i++) {
							if (processFormat == 1) {
								if (res.data.data[i].comment) {
									result =
										res.data.data[i].name +
										'&nbsp;&nbsp;&nbsp;' +
										res.data.data[i].comment +
										'&nbsp;&nbsp;&nbsp;' +
										res.data.data[i].endTime +
										'<br/>'
								} else {
									result =
										res.data.data[i].name +
										'&nbsp;&nbsp;&nbsp;' +
										res.data.data[i].endTime +
										'&nbsp;&nbsp;&nbsp;同意<br/>'
								}
							} else if (processFormat == 2) {
								if (res.data.data[i].comment) {
									result =
										res.data.data[i].name +
										'&nbsp;&nbsp;&nbsp;' +
										res.data.data[i].comment +
										'<br/>'
								} else {
									result = res.data.data[i].name + '&nbsp;&nbsp;&nbsp;同意<br/>'
								}
							} else {
								if (res.data.data[i].comment) {
									result = res.data.data[i].comment + '<br/>'
								} else {
									result = '同意<br/>'
								}
							}
						}
						this.$set(this.formModel, nodeName, result)
					}
				}
			}
		},
		//地区数据
		async queryRegions(td) {
			let res = await this.$axios.get('jellyForm/queryRegions/' + td.format)
			if (res.data.code === 200) {
				td.regions = res.data.data
				this.$set(this.tableData[td.row], td.col, td)
			}
		},
		//输入框或数字组件值改变
		inputChange(value) {
			//计算公式
			for (let key in this.calculate) {
				let text = this.calculate[key]
				if (text.indexOf(value) > -1) {
					this.handleCalculate(key, text)
				}
			}
		},
		//数字框组件失去焦点
		handNumberBlur(td) {
			if (this.formModel[td.field]) {
				td.$status = true
			}
		},
		//数字框组件点击
		handNumberClick(td) {
			td.$status = true
			this.$nextTick(() => {
				this.$refs[td.field][0].focus()
			})
		},
		//开关组件值变化
		switchChange(value, td) {
			this.logicLinkage(value, td)
		},
		//单选框组件值变化
		radioChange(value, td) {
			this.logicLinkage(value, td)
		},
		//多选框组件变化
		checkboxChange(value, td) {
			//this.$set(this.formModel, field, value.toString())
		},
		//选择器组件变化
		selectChange(value, td) {
			if (!td.multiple) {
				this.logicLinkage(value, td)
			}
			//计算公式
			for (let key in this.calculate) {
				let text = this.calculate[key]
				if (text.indexOf(td.field) > -1) {
					this.handleCalculate(key, text)
				}
			}
		},
		//日期选择器组件变化
		datePickerChange(value, td) {
			//计算公式
			this.inputChange(td.field)
			//this.$set(this.formModel, field, value)
		},
		//时间选择器组件变化
		timePickerChange(value, td) {},
		//时间选择器范围组件变化
		timeRangePickerChange(value, td) {
			this.$set(this.formModel, td.field[0], td.value[0])
			this.$set(this.formModel, td.field[1], td.value[1])
		},
		//日期选择器范围组件变化
		dateRangePickerChange(value, td) {
			this.$set(this.formModel, td.field[0], td.value[0])
			this.$set(this.formModel, td.field[1], td.value[1])
		},
		//附件上传之前
		handleBeforeUpload(file) {
			const fileSize = file.size / 1024 / 1024 < 10
			if (!fileSize) {
				this.$message.error('文件大小不能超过 10MB!')
				return false
			}
			return fileSize
		},
		//附件上传成功
		handleUploadSuccess(res, file, fileList, td) {
			let fileArray = this.formModel[td.field]
			fileArray.push({
				name: file.name,
				size: file.size,
				url: res.data
			})
			this.formModel[td.field] = fileArray
		},
		//附件删除
		handleUploadRemove(file, fileList, td) {
			let fileArray = []
			for (let i = 0; i < fileList.length; i++) {
				fileArray.push({
					name: fileList[i].name,
					size: fileList[i].size,
					url: fileList[i].response.data
				})
			}
			this.formModel[td.field] = fileArray
		},
		//附件文件单位格式化
		sizeFormatter(row) {
			if (!row.size) {
				return '0 B'
			}
			var unitArr = new Array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
			var index = 0
			var srcsize = parseFloat(row.size)
			index = Math.floor(Math.log(srcsize) / Math.log(1024))
			var size = srcsize / Math.pow(1024, index)
			if (index != 0) {
				size = size.toFixed(2) //保留的小数位数
			}
			return size + unitArr[index]
		},
		sizeUnit(capacity) {
			var unitArr = new Array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
			var index = 0
			var srcsize = parseFloat(capacity)
			index = Math.floor(Math.log(srcsize) / Math.log(1024))
			var size = srcsize / Math.pow(1024, index)
			return size + unitArr[index]
		},
		// 文件上传之前
		beforeFileUpload(file, td) {
			this.$loading({ text: '上传中，请稍后...' })
			const suffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
			if (td.minValue) {
				if (file.size < td.minValue) {
					this.$loading().close()
					this.$message.error('文档大小至少要' + this.sizeUnit(td.minValue))
					return false
				}
			}
			if (td.maxValue) {
				if (file.size > td.maxValue) {
					this.$loading().close()
					this.$message.error('文档大小不能超过' + this.sizeUnit(td.maxValue))
					return false
				}
			}
			const filelist = [
				'png',
				'jpg',
				'jpeg',
				'bmp',
				'gif',
				'tiff',
				'tif',
				'txt',
				'xls',
				'xlsx',
				'doc',
				'docx',
				'pdf',
				'ppt',
				'pptx',
				'mp4'
			]
			let result = filelist.find(item => item === suffix)
			if (!result) {
				this.$loading().close()
				this.$message.error(
					'请上传正确文件类型(png、jpg、jpeg、bmp、gif、tiff、tif、txt、xls、xlsx、doc、docx、pdf、ppt、pptx、mp4)'
				)
				return false
			}

			let imageTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/png']
			const isImage = imageTypes.includes(file.type)
			if (isImage) {
				const isSize = new Promise(function(resolve, reject) {
					let _URL = window.URL || window.webkitURL
					let img = new Image()
					img.onload = function() {
						let widthValid = true
						let heightValid = true
						if (td.width) {
							widthValid = img.width == td.width
						}
						if (td.height) {
							heightValid = img.height == td.height
						}
						let valid = widthValid && heightValid
						valid ? resolve() : reject()
					}
					img.src = _URL.createObjectURL(file)
				}).then(
					() => {
						return file
					},
					() => {
						if (td.width && td.height) {
							this.$loading().close()
							this.$message.error(`上传的图片宽高必须是${td.width}*${td.height}!`)
						} else if (td.width) {
							this.$loading().close()
							this.$message.error(`上传的图片宽度必须是${td.width}!`)
						} else if (td.height) {
							this.$loading().close()
							this.$message.error(`上传的图片高度必须是${td.height}!`)
						}
						return Promise.reject()
					}
				)
				return isSize
			}
			return true
		},
		// 文件上传成功
		handleFileSuccess(res, file, fileList, td) {
			this.$loading().close()
			if (res.code === 200) {
				let fileArray = JSON.parse(JSON.stringify(fileList))
				let suffix = ''
				let fileType = ''
				try {
					const flieArr = file.name.split('.')
					suffix = flieArr[flieArr.length - 1]
				} catch (err) {}
				if (suffix) {
					suffix = suffix.toLocaleLowerCase()
					fileType = this.getFileType(suffix)
					file.type = fileType
					file.url = res.data
				}
				let index = (fileArray  || []).findIndex((item) => item.uid === file.uid)

				fileArray[index] = {
					type: fileType,
					name: file.name,
					size: file.size,
					url: res.data
				}
				this.formModel[td.field] = JSON.parse(JSON.stringify(fileArray))
			} else {
				let fileList = this.$refs[td.field][0].uploadFiles
				let index = fileList.findIndex(fileItem => {
					return fileItem.url === file.url
				})
				fileList.splice(index, 1)
				this.$message.error(res.message)
			}
		},
		// 文件删除
		handleFileRemove(file, field) {
			let fileList = this.$refs[field][0].uploadFiles
			let index = fileList.findIndex(fileItem => {
				return fileItem.url === file.url
			})
			fileList.splice(index, 1)
			let fileArray = []
			for (let i = 0; i < fileList.length; i++) {
				let item = fileList[i]
				fileArray.push({
					type: item.type,
					name: item.name,
					size: item.size,
					url: item.url
				})
			}
			this.formModel[field] = fileArray
			this.tableKey = Math.random()
		},
		//获取文件类型
		getFileType(suffix) {
			let result = ''
			// 图片格式
			const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
			// 进行图片匹配
			result = imglist.find(item => item === suffix)
			if (result) {
				return 'image'
			}
			// 图片格式
			const tiflist = ['tiff', 'tif']
			// 进行图片匹配
			result = tiflist.find(item => item === suffix)
			if (result) {
				return 'tif'
			}
			// 匹配txt
			const txtlist = ['txt']
			result = txtlist.find(item => item === suffix)
			if (result) {
				return 'txt'
			}
			// 匹配 excel
			const excelist = ['xls', 'xlsx']
			result = excelist.find(item => item === suffix)
			if (result) {
				return 'excel'
			}
			// 匹配 word
			const wordlist = ['doc', 'docx']
			result = wordlist.find(item => item === suffix)
			if (result) {
				return 'word'
			}
			// 匹配 pdf
			const pdflist = ['pdf']
			result = pdflist.find(item => item === suffix)
			if (result) {
				return 'pdf'
			}
			// 匹配 ppt
			const pptlist = ['ppt', 'pptx']
			result = pptlist.find(item => item === suffix)
			if (result) {
				return 'ppt'
			}
			// 匹配 视频
			const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v']
			result = videolist.find(item => item === suffix)
			if (result) {
				return 'video'
			}
			// 匹配 音频
			const radiolist = ['mp3', 'wav', 'wmv']
			result = radiolist.find(item => item === suffix)
			if (result) {
				return 'radio'
			}
			// 匹配 压缩
			const ziplist = ['zip', 'rar']
			result = ziplist.find(item => item === suffix)
			if (result) {
				return 'zip'
			}
			// 匹配 ofd
			const ofdlist = ['ofd']
			result = ofdlist.find(item => item === suffix)
			if (result) {
				return 'ofd'
			}
			// 匹配 rtf
			const rtflist = ['rtf']
			result = rtflist.find(item => item === suffix)
			if (result) {
				return 'rtf'
			}
			// 其他 文件类型
			return 'other'
		},
		// 文件预览
		handleFilePreview(file, field) {
			if (file.type === 'image') {
				let previewSrcList = this.formModel[field].map(item => item.url)
				let index = previewSrcList.indexOf(file.url)
				for (let i = 0; i < index; i++) {
					previewSrcList.push(previewSrcList.shift());
				}
				this.previewSrcList = previewSrcList
				this.previewDialogVisible = true
			} else if (file.type === 'pdf'
				|| file.type === 'tif'
				|| file.type === 'word'
				|| file.type === 'excel'
				|| file.type === 'ppt'
				|| file.type === 'txt'
				|| file.type === 'ofd'
				|| file.type === 'rtf') {
				window.open(
					this.$axios.defaults.baseURL +
						'upload/preview?url=' +
						encodeURIComponent(file.url) +
						'&fileName=' +
						encodeURIComponent(file.name)
				)
			}
		},
		// 文件下载
		handleFileDownload(file) {
			//window.open(file.url)
			let params = {
				url: file.url,
				fileName: file.name
			}
			this.$axios.post('upload/download', params, { responseType: 'blob' }).then(res => {
				let content = res.data
				let blob = new Blob([content])
				if ('download' in document.createElement('a')) {
					// 非IE下载
					let elink = document.createElement('a')
					elink.download = file.name
					elink.style.display = 'none'
					elink.href = URL.createObjectURL(blob)
					document.body.appendChild(elink)
					elink.click()
					URL.revokeObjectURL(elink.href) // 释放URL 对象
					document.body.removeChild(elink)
				} else {
					// IE10+下载
					navigator.msSaveBlob(blob, file.name)
				}
			})
		},
		//业务应用弹窗
		handleBusinessDialog(td) {
			if (td.multiple) {
				this.$refs.excelBusiness.showDialog(
					'default',
					td.field,
					td.multiple,
					td.source,
					td,
					this.setBusinessSearch(td),
					this.formModel[td.field]
				)
			} else {
				this.$refs.excelBusiness.showDialog(
					'default',
					td.field,
					td.multiple,
					td.source,
					td,
					this.setBusinessSearch(td)
				)
			}
		},
		//设置业务应用查询条件
		setBusinessSearch(td) {
			let result = {}
			if (td.hasOwnProperty('conditionAssignment') && td.conditionAssignment) {
				for (const conditionAssignment of td.conditionAssignment) {
					result[conditionAssignment.field] = this.formModel[conditionAssignment.value]
				}
			}
			return result
		},
		//业务应用详情
		handleBusinessDetail(td) {
			if (td.show && this.formModel[td.field]) {
				this.$history.push({
					path: '/handleCustomForm',
					query: {
						id: this.formModel[td.field],
						formId: td.source,
						title: '详情'
					}
				})
			}
		},
		//业务应用确认处理
		businessConfirm(type, field, value, td, data) {
			if (type === 'default') {
				this.$set(this.formModel, field, value)
				// this.queryBusinessData(td)
				this.setBusinessData(td, data)
				// if (td.assignment && !td.multiple) {
				// 	for (let i = 0; i < td.assignment.length; i++) {
				// 		let item = td.assignment[i]
				// 		let value = String(data[item.source.split('.')[1]])
				// 		// 是否存在值
				// 		if (value !== 'undefined') {
				// 			this.$set(this.formModel, item.target, value)
				// 		}
				// 	}
				// }
				// 重置关联字段
				if (this.resetFieldMap.hasOwnProperty(field)) {
					for (let i = 0; i < this.resetFieldMap[field].length; i++) {
						this.$set(this.formModel, this.resetFieldMap[field][i], null)
					}
				}
			} else if (type === 'table') {
				// let fieldArray = field.split('.')
				// let item = this.formModel[fieldArray[0]][this.tableIndex]
				// item[fieldArray[1]] = value.toString()
				// this.$set(this.formModel[fieldArray[0]], this.tableIndex, item)
			}
		},
		//部门组件弹窗
		handleDeptDynamicDialog(td) {
			if (td.multiple) {
				this.$refs.excelMultipleDept.showDialog('default', td.field, this.formModel[td.field])
			} else {
				this.$refs.excelDept.showDialog('default', td.field)
			}
		},
		//部门组件确定处理
		deptConfirm(type, field, value) {
			if (type === 'default') {
				this.$set(this.formModel, field, value)
			} else if (type === 'table') {
				let fieldArray = field.split('.')
				let item = this.formModel[fieldArray[0]][this.tableIndex]
				item[fieldArray[1]] = value
				this.$set(this.formModel[fieldArray[0]], this.tableIndex, item)
			}
		},
		//成员组件弹窗
		handleMemberDynamicDialog(td) {
			if (td.multiple) {
				this.$refs.excelMultipleMember.showDialog('default', td.field, td.options, this.formModel[td.field])
			} else {
				this.$refs.excelMember.showDialog('default', td.field)
			}
		},
		//成员组件确定处理
		memberConfirm(type, field, value) {
			if (type === 'default') {
				this.$set(this.formModel, field, value)
			} else if (type === 'table') {
				let fieldArray = field.split('.')
				let item = this.formModel[fieldArray[0]][this.tableIndex]
				item[fieldArray[1]] = value
				this.$set(this.formModel[fieldArray[0]], this.tableIndex, item)
			}
		},
		//计算公式格式化
		calculationFormat(scope, field, value, tableName) {
			scope.row[field] = Number(eval(value)).toFixed(2)
			// 公式计算
			this.inputChange(tableName + '.' + field)
			return Number(eval(value)).toFixed(2)
		},
		//表格必填渲染
		renderHeader(h, { column, $index }, item) {
			return h('div', {
				attrs: {
					class: 'cell'
				},
				domProps: {
					innerHTML: item.required ? column.label + '<span style="color:#f56c6c"> *</span>' : column.label
				}
			})
		},
		//表格添加
		handleTableAdd(index, obj) {
			var item = {
				$status: false
			}
			for (var k = 0; k < obj.tableData.length; k++) {
				item[obj.tableData[k].field] = ''
			}
			this.formModel[obj.field].splice(index + 1, 0, item)
		},
		//表格删除
		handleTableDel(index, obj) {
			this.formModel[obj.field].splice(index, 1)
			for (let i = 0; i < obj.tableData.length; i++) {
				let item = obj.tableData[i]
				this.handleTableChange(obj.field, item.filed, item)
			}
		},
		//表格合计
		getSummaries(param, summaryArray) {
			const { columns, data } = param
			const sums = []
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计'
					return
				}

				if (summaryArray.indexOf(column.property) != -1) {
					const values = data.map(item => Number(item[column.property]))
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr)
							if (!isNaN(value)) {
								prev = this.$BigNumber(prev)
								return prev.plus(curr).toString()
							} else {
								return prev
							}
						}, 0)
					} else {
						sums[index] = 0
					}
				} else {
					sums[index] = ''
				}
			})
			return sums
		},
		//表格双击
		cellDblclick(row, column, cell, event, td) {
			if (td.show && td.disabled && td.detailForm) {
				this.$router.push({
					path: '/handleCustomForm',
					query: {
						id: row.id,
						formId: td.detailForm,
						title: '详情'
					}
				})
			}
		},
		//表单验证
		validate() {
			for (let key in this.rules) {
				for (let i = 0; i < this.rules[key].length; i++) {
					let item = this.rules[key][i]
					if (!item.type && item.required && !this.formModel[key] && this.formModel[key] !== 0) {
						this.$message.error(item.message)
						return false
					}
					if (item.max && this.formModel[key] && this.formModel[key].length > item.max) {
						this.$message.error(item.message)
						return false
					}
					if (item.pattern) {
						var reg = new RegExp(item.pattern)
						if (!reg.test(this.formModel[key])) {
							this.$message.error(item.message)
							return false
						}
					}
					if (item.validator) {
						let validator = item.validator
						let pattern = /\$\{(.*?)\}/g
						var matches = validator.match(pattern)
						if (matches) {
							for (let i = 0; i < matches.length; i++) {
								let matche = matches[i]
								let field = matche.substring(2, matche.length - 1)
								let flag = this.formModel.hasOwnProperty(field.split('.')[0])
								if (flag) {
									//明细、表格
									let totalDetail = 0
									for (let j = 0; j < this.formModel[field.split('.')[0]].length; j++) {
										totalDetail += Number(
											this.formModel[field.split('.')[0]][j][field.split('.')[1]]
										)
									}
									validator = validator.replace(matche, totalDetail)
								} else {
									validator = validator.replace(
										matche,
										isNaN(Number(this.formModel[field])) ? 0 : Number(this.formModel[field])
									)
								}
							}
						}
						if (!eval(validator)) {
							this.$message.error(item.message)
							return false
						}
					}

					//明细、表格
					if (item.type && item.type === 'table') {
						if (item.required && this.formModel[key].length === 0) {
							this.$message.error(item.message)
							return false
						}
						var verifyFlag = true
						for (var l = 0; l < this.formModel[key].length; l++) {
							var obj = this.formModel[key][l]
							try {
								Object.keys(obj).forEach((field, index) => {
									if (this.rules[key + '.' + field] && !obj[field]) {
										verifyFlag = false
										this.$message.error(
											item.message +
												'中第' +
												(l + 1) +
												'行' +
												this.rules[key + '.' + field][0].message
										)
										throw new Error('break')
									}
								})
							} catch (e) {}

							if (!verifyFlag) {
								return false
							}
						}
					}
					//多选
					if (item.type && item.type === 'array') {
						if (item.required && this.formModel[key].length === 0) {
							this.$message.error(item.message)
							return false
						}
					}
				}
			}
			return true
		},
		//部分表单验证
		validateField() {
			for (let key in this.rules) {
				if (this.editable.indexOf(key) > -1) {
					// 验证
					for (let i = 0; i < this.rules[key].length; i++) {
						let item = this.rules[key][i]
						if (!item.type && item.required && !this.formModel[key] && this.formModel[key] !== 0) {
							this.$message.error(item.message)
							return false
						}
						if (item.max && this.formModel[key] && this.formModel[key].length > item.max) {
							this.$message.error(item.message)
							return false
						}
						if (item.pattern) {
							var reg = new RegExp(item.pattern)
							if (!reg.test(this.formModel[key])) {
								this.$message.error(item.message)
								return false
							}
						}
						if (item.validator) {
							let validator = item.validator
							let pattern = /\$\{(.*?)\}/g
							var matches = validator.match(pattern)
							if (matches) {
								for (let i = 0; i < matches.length; i++) {
									let matche = matches[i]
									let field = matche.substring(2, matche.length - 1)
									let flag = this.formModel.hasOwnProperty(field.split('.')[0])
									if (flag) {
										//明细、表格
										let totalDetail = 0
										for (let j = 0; j < this.formModel[field.split('.')[0]].length; j++) {
											totalDetail += Number(
												this.formModel[field.split('.')[0]][j][field.split(',')[1]]
											)
										}
										validator = validator.replace(matche, totalDetail)
									} else {
										validator = validator.replace(
											matche,
											isNaN(Number(this.formModel[field])) ? 0 : Number(this.formModel[field])
										)
									}
								}
							}
							if (!eval(validator)) {
								this.$message.error(item.message)
								return false
							}
						}

						//明细、表格
						if (item.type && item.type === 'table') {
							if (item.required && this.formModel[key].length === 0) {
								this.$message.error(item.message)
								return false
							}
							var verifyFlag = true
							for (var l = 0; l < this.formModel[key].length; l++) {
								var obj = this.formModel[key][l]
								try {
									Object.keys(obj).forEach((field, index) => {
										if (this.rules[key + '.' + field] && !obj[field]) {
											verifyFlag = false
											this.$message.error(
												item.message +
													'中第' +
													(l + 1) +
													'行' +
													this.rules[key + '.' + field][0].message
											)
											throw new Error('break')
										}
									})
								} catch (e) {}

								if (!verifyFlag) {
									return false
								}
							}
						}
						//附件上传、关联应用、图片上传、区域
						if (item.type && item.type === 'array') {
							if (item.required && this.formModel[key].length === 0) {
								this.$message.error(item.message)
								return false
							}
						}
					}
				}
			}
			return true
		},
		//处理编辑、禁用、隐藏
		handleParameter() {
			for (let i = 0; i < this.tableData.length; i++) {
				let tr = this.tableData[i]
				for (let j = 0; j < tr.length; j++) {
					let td = tr[j]
					td.show = true
					td.disabled = false
					// 默认值
					let property = this.formCofig.module[td.key]
					if (property) {
						td.disabled = property.disabled
					}

					//禁用
					if (td.type === 'timeRangePicker' || td.type === 'dateRangePicker') {
						let indexDisabled = this.disabled.indexOf(td.field[0]) || this.disabled.indexOf(td.field[1])
						if (indexDisabled != -1) {
							td.disabled = true
						}
					} else if (td.type === 'twoDimensionalTable') {
						if (property.disabled) {
							td.disabled = true
						} else {
							let indexDisabled = this.disabled.toString().indexOf(td.table)
							if (indexDisabled != -1) {
								td.disabled = true
							}
						}
					} else {
						let indexDisabled = this.disabled.indexOf(td.field)
						if (indexDisabled != -1) {
							td.disabled = true
						}
					}
					//隐藏
					if (td.type === 'timeRangePicker' || td.type === 'dateRangePicker') {
						let indexHidden = this.hidden.indexOf(td.field[0]) || this.hidden.indexOf(td.field[1])
						if (indexHidden != -1) {
							td.show = false
						}
					} else if (td.type === 'twoDimensionalTable') {
						let indexHidden = this.hidden.toString().indexOf(td.table)
						if (indexHidden != -1) {
							td.show = false
						}
					} else {
						let indexHidden = this.hidden.indexOf(td.field)
						if (indexHidden != -1) {
							td.show = false
						}
					}
					//可编辑
					if (td.type === 'timeRangePicker' || td.type === 'dateRangePicker') {
						let indexEditable = this.editable.indexOf(td.field[0]) || this.editable.indexOf(td.field[1])
						if (indexEditable != -1) {
							td.show = true
							td.disabled = false
						}
					} else if (td.type === 'twoDimensionalTable') {
						if (property.disabled) {
							td.disabled = true
						} else {
							let indexEditable = this.editable.toString().indexOf(td.table)
							if (indexEditable != -1) {
								td.show = true
								td.disabled = false
							}
						}
					} else {
						let indexEditable = this.editable.indexOf(td.field)
						if (indexEditable != -1) {
							td.show = true
							td.disabled = false
						}
					}

					if (td.type === 'datePicker') {
						// if(this.formModel[td.field]) {
						//     this.$set(this.formModel, td.field, this.formModel[td.field].toString())
						// }
					} else if (td.type === 'twoDimensionalTable') {
						// td.$status = false
						// if(this.formModel[td.field]) {
						//     this.$set(this.formModel, td.field, Number(this.formModel[td.field]).toFixed(2))
						// }
					} else if (td.type === 'select') {
						// if(this.formModel[td.field]) {
						//     if(td.multiple) {
						//         this.$set(this.multiple, td.field, this.formModel[td.field].split(','))
						//     } else {
						//         this.$set(this.multiple, td.field, String(this.formModel[td.field]))
						//     }
						// }
					} else if (td.type === 'radio') {
						// if(this.formModel[td.field]) {
						//     this.formModel[td.field] = String(this.formModel[td.field])
						// }
					} else if (td.type === 'area') {
						td.key = new Date().getTime()
					}
				}
				this.$set(this.tableData, i, tr)
			}
		},
		//逻辑表单处理(上)
		logicLinkage(value, td) {
			if (td.logic && td.logic.length > 0) {
				var disabled = []
				var hidden = []
				var editable = []
				for (let i = 0; i < td.logic.length; i++) {
					let item = td.logic[i]
					if (value == item.value) {
						for (let j = 0; j < item.field.length; j++) {
							let currentRules = this.rules[item.tableName + '.' + item.field[j]]
							if (item.type === 'disabled') {
								if (currentRules) {
									// 去掉
									if (currentRules.length === 0) {
										if (currentRules[0].required) {
											delete this.rules[item.tableName + '.' + item.field[j]]
										}
									} else {
										for (let k = 0; k < currentRules.length; k++) {
											if (currentRules[k].required) {
												currentRules.splice(k, 1)
												break
											}
										}
									}
								}
								disabled.push(item.tableName + '.' + item.field[j])
							} else if (item.type === 'hidden') {
								if (currentRules) {
									// 去掉
									if (currentRules.length === 0) {
										if (currentRules[0].required) {
											delete this.rules[item.tableName + '.' + item.field[j]]
										}
									} else {
										for (let k = 0; k < currentRules.length; k++) {
											if (currentRules[k].required) {
												currentRules.splice(k, 1)
												break
											}
										}
									}
								}
								hidden.push(item.tableName + '.' + item.field[j])
							} else if (item.type === 'editable') {
								if (currentRules) {
									// 添加
									let flag = false
									for (let k = 0; k < currentRules.length; k++) {
										if (currentRules[k].required) {
											flag = true
											break
										}
									}
									if (!flag) {
										this.$nextTick(() => {
											let currentProperty = this.property[item.tableName + '.' + item.field[j]]
											if (currentProperty.required) {
												currentRules.push({
													required: true,
													message: currentProperty.placeholder
												})
											}
										})
									}
								} else {
									this.$nextTick(() => {
										let currentProperty = this.property[item.tableName + '.' + item.field[j]]
										if (currentProperty.required) {
											this.$set(this.rules, item.tableName + '.' + item.field[j], [
												{ required: true, message: currentProperty.placeholder }
											])
										}
									})
								}
								editable.push(item.tableName + '.' + item.field[j])
							}
						}
					}
				}

				// 逻辑处理
				this.handleLogic(disabled, hidden, editable)
			}
		},
		//逻辑表单处理(下)
		handleLogic(disabled, hidden, editable) {
			if (disabled.length > 0) {
				for (let i = 0; i < disabled.length; i++) {
					let indexDisabled = this.disabled.indexOf(disabled[i])
					if (indexDisabled === -1) {
						this.disabled.push(disabled[i])
					}
					let indexHidden = this.hidden.indexOf(disabled[i])
					if (indexHidden != -1) {
						this.hidden.splice(indexHidden, 1)
					}
					let indexEditable = this.editable.indexOf(disabled[i])
					if (indexEditable != -1) {
						this.editable.splice(indexEditable, 1)
					}
				}
			}
			if (hidden.length > 0) {
				for (let i = 0; i < hidden.length; i++) {
					let indexHidden = this.hidden.indexOf(hidden[i])
					if (indexHidden === -1) {
						this.hidden.push(hidden[i])
					}
					let indexDisabled = this.disabled.indexOf(hidden[i])
					if (indexDisabled != -1) {
						this.disabled.splice(indexDisabled, 1)
					}
					let indexEditable = this.editable.indexOf(hidden[i])
					if (indexEditable != -1) {
						this.editable.splice(indexEditable, 1)
					}
				}
			}
			if (editable.length > 0) {
				for (let i = 0; i < editable.length; i++) {
					let indexEditable = this.editable.indexOf(editable[i])
					if (indexEditable === -1) {
						this.editable.push(editable[i])
					}
					let indexDisabled = this.disabled.indexOf(editable[i])
					if (indexDisabled != -1) {
						this.disabled.splice(indexDisabled, 1)
					}
					let indexHidden = this.hidden.indexOf(editable[i])
					if (indexHidden != -1) {
						this.hidden.splice(indexHidden, 1)
					}
				}
			}
		},
		//计算公式逻辑处理
		handleCalculate(key, text) {
			try {
				var result = handleFormula(text, this.formModel)
				//赋值
				this.$set(this.formModel, key, isNaN(eval(result)) ? result : eval(result))
			} catch (err) {
				this.$set(this.formModel, key, '')
				console.log(err)
			}
		},
		//表格子组件失去焦点
		handleTableBlur(field, index, flag) {
			let detail = this.formModel[field][index]
			detail.$status = flag
			this.$set(this.formModel[field], index, detail)
		},
		//表格子组件值变化
		handleTableChange(tableName, field, item) {
			if (item.logic) {
				let tableData = this.formModel[tableName]
				if (item.type === 'number') {
					let total = 0
					for (let i = 0; i < tableData.length; i++) {
						total += Number(tableData[i][field])
					}
					this.$set(this.formModel, item.logic, isNaN(total) ? '' : total.toFixed(2))
				} else if (item.type === 'select') {
					let logicArray = []
					for (let i = 0; i < tableData.length; i++) {
						if (logicArray.indexOf(tableData[i][field]) == -1) {
							logicArray.push(tableData[i][field])
						}
					}
					this.$set(this.formModel, item.logic, logicArray.toString())
				}
			}
			// 公式计算
			this.inputChange(tableName + '.' + field)
		},
		//表格子组件弹窗
		handleTableDialog(index, field, item) {
			this.tableIndex = index
			this.tableItem = item
			if (item.type === 'department') {
				this.$refs.excelDept.showDialog('table', field)
			} else if (item.type === 'member') {
				this.$refs.excelMember.showDialog('table', field)
			} else if (item.type === 'business') {
			}
		},
		//关闭图片预览
		closeViewer() {
			this.previewDialogVisible = false
		},
		handleSelectFocus(field) {
			this.$refs[field][0].blur()
		}
	}
}
</script>

<style scoped>
.container {
	background: #fff;
	margin-right: 10px;
}
.content {
	width: 100%;
	border-collapse: collapse;
	border: var(--theme-color-line);
}
.tbody {
	font-size: 12px;
}
::v-deep .el-textarea__inner {
	border: none;
}
::v-deep .el-input__inner {
	border: none;
	border-radius: 0px;
}
::v-deep .el-date-editor.el-input {
	width: 100%;
}
::v-deep .el-date-editor--daterange.el-input__inner {
	width: 100%;
}
/* ::v-deep .el-table {
	border-radius: 0px;
} */
::v-deep .el-table__header tr {
	height: 36px;
}
::v-deep .el-table thead th {
	font-size: 13px;
	background: #fafafa !important;
	color: #333;
}
::v-deep .el-table__row {
	font-size: 13px;
	height: 36px;
}
::v-deep .el-table td {
	padding: 0px 0 !important;
}
::v-deep .el-table .cell {
	padding: 0px !important;
}
::v-deep .el-table--border td:first-child .cell {
	padding: 0px;
}
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
	right: 15px;
	transform: translateY(-50%);
	color: #000;
}
.tableAdd {
	top: 30px;
	left: -20px;
	font-size: 18px;
	margin-right: 4px;
}
.tableDel {
	top: 30px;
	right: -20px;
	font-size: 18px;
	color: red;
	margin-left: 4px;
}
::v-deep .input .el-input__inner {
	height: 100%;
}
::v-deep .el-input.is-disabled .el-input__inner {
	background-color: #fffeee;
	border-color: #fffeee;
	color: #000;
}
::v-deep .el-textarea.is-disabled .el-textarea__inner {
	background-color: #fffeee;
	border-color: #fffeee;
	color: #000;
}
::v-deep .el-switch.is-disabled {
	opacity: 0.8;
}
::v-deep .el-radio__input.is-disabled + span.el-radio__label {
	color: #333;
}
::v-deep .el-radio__label {
	font-size: 13px;
}
::v-deep .el-table {
	width: 100%;
}
::v-deep .el-table__header-wrapper table {
	width: 100% !important;
}
::v-deep .el-table__body-wrapper table {
	width: 100% !important;
}
::v-deep .el-table__body {
	table-layout: auto;
}
::v-deep .el-table__footer {
	table-layout: auto;
	height: 36px;
}
::v-deep .el-table__header {
	table-layout: auto;
}
::v-deep .el-table--border {
	border-top: 0px !important;
	border-bottom: 0px !important;
}
::v-deep .el-tag {
	margin-right: 10px;
	margin-top: 10px;
}
::v-deep .el-input-number .el-input__inner {
	text-align: left;
}
.relation {
	position: relative;
	margin-left: 10px;
	margin-bottom: 10px;
	text-align: left;
}
.relation-icon {
	position: absolute;
	top: calc(50% + 5px);
	right: 10px;
	transform: translateY(-50%);
}
::v-deep .el-upload-list--picture-card .el-upload-list__item {
	margin-bottom: 0px;
}
::v-deep .upload-disabled .el-upload--picture-card {
	display: none;
}
.upload {
	padding: 15px;
}
.el-textarea ::-webkit-input-placeholder {
	color: #c0c4cc;
	font-family: auto;
}
.el-textarea ::-ms-input-placeholder {
	color: #c0c4cc;
	font-family: auto;
}
.el-textarea ::-moz-input-placeholder {
	color: #c0c4cc;
	font-family: auto;
}
.el-textarea :-moz-input-placeholder {
	color: #c0c4cc;
	font-family: auto;
}
</style>
