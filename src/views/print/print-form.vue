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
						<div v-else-if="td.type">
							{{ model[td.field] }}
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	props: {
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
		}
	},
	watch: {
		formCofig: {
			handler(newVal) {
				this.loadView()
			},
			immediate: false,
			deep: true
		}
	},
	data() {
		return {
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
			model: {},
			regions: {}
		}
	},
	created() {
		this.regions = JSON.parse(localStorage.getItem('regions'))
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
								td.field = property.table + '|' + property.field[0]
								this.$set(this.model, td.field, this.formModel[td.field])
							} else if (td.type === 'number') {
								//数字
								td.field = property.table + '|' + property.field[0]
								this.$set(this.model, td.field, this.formModel[td.field])
							} else if (td.type === 'radio') {
								//单选框
								td.field = property.table + '|' + property.field[0]
								td.source = property.source
								if (this.formModel[td.field]) {
									this.queryDictionaryDetail(td)
								}
							} else if (td.type === 'checkbox') {
								//多选框
								td.field = property.table + '|' + property.field[0]
								td.source = property.source
								td.multiple = true
								if (this.formModel[td.field]) {
									this.queryDictionaryDetail(td)
								}
							} else if (td.type === 'select') {
								//下拉选择
								td.field = property.table + '|' + property.field[0]
								td.source = property.source
								td.multiple = property.multiple
								if (this.formModel[td.field]) {
									this.queryDictionaryDetail(td)
								}
							} else if (td.type === 'switch') {
								//开关组件
								td.activeValue = property.activeValue.toString() || '1'
								td.inactiveValue = property.inactiveValue.toString() || '0'
								td.field = property.table + '|' + property.field[0]
								if (this.formModel[td.field] == td.activeValue) {
									this.$set(this.model, td.field, '开')
								} else {
									this.$set(this.model, td.field, '关')
								}
							} else if (td.type === 'timePicker') {
								//时间选择
								td.field = property.table + '|' + property.field[0]
								this.$set(this.model, td.field, this.formModel[td.field])
							} else if (td.type === 'datePicker') {
								//日期选择
								td.field = property.table + '|' + property.field[0]
								this.$set(this.model, td.field, this.formModel[td.field])
							} else if (td.type === 'timeRangePicker') {
								//时间范围
								td.field = [
									property.table + '|' + property.field[0],
									property.table + '|' + property.field[1]
								]
								this.$set(this.model, td.field, this.formModel[td.field])
							} else if (td.type === 'dateRangePicker') {
								//日期范围
								td.field = [
									property.table + '|' + property.field[0],
									property.table + '|' + property.field[1]
								]
								this.$set(this.model, td.field, this.formModel[td.field])
							} else if (td.type === 'calculate') {
								//计算公式
								td.field = property.table + '|' + property.field[0]
								this.$set(this.model, td.field, this.formModel[td.field])
							} else if (td.type === 'table') {
								//明细、表格
							} else if (td.type === 'upload') {
								td.field = property.table + '|' + property.field[0]
								//this.$set(this.model, td.field, this.formModel[td.field])
							} else if (td.type === 'business') {
								//业务应用
								td.field = property.table + '|' + property.field[0]
								this.$set(this.model, td.field, this.formModel[td.field])
							} else if (td.type === 'editor') {
								td.field = property.table + '|' + property.field[0]
								this.$set(this.model, td.field, this.formModel[td.field])
							} else if (td.type === 'bill') {
								//单据组件
								td.field = property.table + '|' + property.field[0]
								this.$set(this.model, td.field, this.formModel[td.field])
							} else if (td.type === 'picture') {
								//图片上传
								td.field = property.table + '|' + property.field[0]
								//this.$set(this.model, td.field, this.formModel[td.field])
							} else if (td.type === 'area') {
								//省市区
								td.format = property.format
								if (td.format != 1 && property.appoint && property.appoint.length > 0) {
									td.format = property.appoint[property.appoint.length - 1]
								}
								td.field = property.table + '|' + property.field[0]

								let cellValueArray = this.formModel[td.field]
								let cellValueStr = ''
								for (var k = 0; k < cellValueArray.length; k++) {
									if (k === cellValueArray.length - 1) {
										cellValueStr = cellValueStr + this.regions[cellValueArray[k]]
									} else {
										cellValueStr = cellValueStr + this.regions[cellValueArray[k]] + '/'
									}
								}
								this.$set(this.model, td.field, cellValueStr)
							} else if (td.type === 'department') {
								//部门组件
								td.field = property.table + '|' + property.field[0]
								td.multiple = property.multiple
								this.queryDynamic(td)
							} else if (td.type === 'member') {
								//成员组件
								td.field = property.table + '|' + property.field[0]
								td.multiple = property.multiple
								this.queryDynamic(td)
							}
						} else {
							// 纯文本
							td.text = cell.text || '&nbsp;'
							td.text = td.text.replace('*', '<span style="color:#f56c6c;">*</span>')
						}
						this.getStyles(cell, td, styles)

						tr.push(td)
					}
				}
				this.tableData.push(tr)
			}
		},
		// 获取样式
		getStyles(cell, td, styles) {
			if (cell.style) {
				var cellStyle = styles[cell.style]
				for (let styleType in cellStyle) {
					if (styleType === 'bgcolor') {
						td.style['backgroundColor'] = cellStyle[styleType]
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
				for (var l = 0; l < res.data.data.length; l++) {
					if (this.formModel[td.field] == res.data.data[l].code) {
						this.$set(this.model, td.field, res.data.data[l].name)
					}
				}
			}
		},
		//部门或成员数据
		async queryDynamic(td) {
			let res = await this.$axios.get('jellyForm/queryDynamic?path=' + td.type + '&type=list')
			if (res.data.code === 200) {
				for (var l = 0; l < res.data.data.length; l++) {
					if (this.formModel[td.field] == res.data.data[l].id) {
						this.$set(this.model, td.field, res.data.data[l].name)
					}
				}
			}
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
</style>
