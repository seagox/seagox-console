<template>
	<div class="calculate-box">
		<div class="left-box">
			<el-tabs v-model="activeName" stretch>
				<el-tab-pane label="公式" name="calculate" style="max-height:400px;overflow:auto;">
					<el-popover
						v-for="(item, index) in calculateOptions"
						:key="index"
						placement="right"
						:title="item.title"
						trigger="hover"
						:content="item.desc"
					>
						<div slot="reference" style="margin-top:15px;cursor:pointer;" @click="formulaInsert(item.type)">
							<div>{{ item.type }}</div>
							<div style="color:#b0b0b9;font-size:12px;">{{ item.subtitle }}</div>
						</div>
					</el-popover>
				</el-tab-pane>
				<el-tab-pane label="字段" name="field">
					<el-table
						:data="options"
						row-key="id"
						max-height="400px"
						:show-header="false"
						:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
						@row-click="rowClick"
					>
						<el-table-column prop="comment" show-overflow-tooltip></el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</div>
		<div class="right-box" ref="myinput" id="myinput">
			<textarea id="codeMirror"></textarea>
		</div>
	</div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'

export default {
	props: {
		value: {
			type: String,
			default: ''
		},
		options: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data() {
		return {
			activeName: 'calculate',
			editor: null,
			formula: ['SUM', 'AVERAGE', 'CONCAT', 'IF', 'IFS', 'DAYS', 'MONTHDIFF', 'CURDATE'],
			keywords: [],
			calculateOptions: [
				{
					type: 'SUM',
					title: 'SUM ( 数字字段,数字字段,... )',
					subtitle: '返回所有参与字段中数值的总和',
					desc: '返回所有参与字段中数值的总和'
				},
				{
					type: 'AVERAGE',
					title: 'AVERAGE ( 数字字段,数字字段,... )',
					subtitle: '计算所有参与运算字段的平均值',
					desc: '计算所有参与运算字段的平均值'
				},
				{
					type: 'CONCAT',
					title: 'CONCAT（ 字段1,字段2,... )',
					subtitle: '字符串连接函数，连接函数中的所有字段',
					desc:
						'将多个文本字符串合并成一个文本字符串。如CONCAT(A,B,C)，即返回值为ABC。字段或者函数之间，用逗号隔开。如果是字符串，需要用引号包裹起来。'
				},
				{
					type: 'IF',
					title: 'IF ( 判断条件,真值,假值 )',
					subtitle: '根据判断条件，返回正确或错误的值。',
					desc:
						'判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值。IF(A,B,C)，表示如果满足条件A，那么返回B，否则返回C。'
				},
				{
					type: 'IFS',
					title: 'IFS(判断条件1，真值1，判断条件2（可选），真值2（可选），···)',
					subtitle: '检查是否满足一个或多个条件，且返回符合第一个 TRUE 条件的值',
					desc: '检查是否满足一个或多个条件，且返回符合第一个 TRUE 条件的值'
				},
				{
					type: 'DAYS',
					title: 'DAYS(end_timestamp, start_timestamp)',
					subtitle: '返回两个日期字段之间的天数，可返回负值。例如，2018/1/30与2018/1/28相差2天。',
					desc: 'end_timestamp: 必填项。结束日期。start_timestamp: 必填项。起始日期。'
				},
				{
					type: 'MONTHDIFF',
					title: 'MONTHDIFF(end_timestamp, start_timestamp, mode)',
					subtitle: '返回两个日期字段之间相差的月份，可返回负值。例如，2018/1/30与2018/3/28相差2个月。',
					desc: 'end_timestamp: 必填项。结束日期。start_timestamp: 必填项。起始日期。mode: 可选项，1:向上取整 2:向下取整。'
				},
				{
					type: 'NOW',
					title: 'NOW()',
					subtitle: '返回当前日期时间,精准到时／分／秒。',
					desc: '括号中无需填写内容，可以直接使用'
				},
				{
					type: 'CURDATE',
					title: 'CURDATE()',
					subtitle: '返回当前日期，可以在单行文本字段和日期字段中使用。',
					desc: '括号中无需填写内容，可以直接使用'
				},
				{
					type: 'SUBTRACT',
					title: 'SUBTRACT ( 数字字段,数字字段,... )',
					subtitle: '返回所有参与字段中数值相减',
					desc: '返回所有参与字段中数值相减'
				},
				{
					type: 'PRODUCT',
					title: 'PRODUCT ( 数字字段,数字字段,... )',
					subtitle: '返回所有参与字段中数值相乘',
					desc: '返回所有参与字段中数值相乘'
				},
				{
					type: 'DIVIDE',
					title: 'DIVIDE ( 除数, 被除数 )',
					subtitle: '返回除数/被除数相除',
					desc: '返回除数/被除数相除'
				}
			],
			businessObj: {}
		}
	},
	created() {
		this.keywords = []
		this.businessObj = {}
		this.options.forEach(key => {
			if (key.children) {
				key.children.forEach(keys => {
					this.keywords.push(keys['comment'])
					this.businessObj[keys['name']] = keys['comment']
				})
			} else {
				this.keywords.push(key['comment'])
				this.businessObj[key['name']] = key['comment']
			}
		})
	},
	mounted() {
		CodeMirror.defineMode('custom', config => {
			return {
				token: stream => {
					if (stream.eatSpace()) {
						return null
					}
					let ch = stream.next()
					if (ch == "'") {
						return 'string'
					} else if (/[+\-*&%=<>!?|~^@]/.test(ch)) {
						stream.eatWhile(/[+\-*&%=<>!?|~^@]/)
						return 'number'
					} else if (/\d/.test(ch)) {
						stream.eatWhile(/[\w\.]/)
						return 'number'
					} else if (ch == ',') {
						return 'atom'
					} else if (ch == '(' || ch == ')') {
						return 'keyword'
					} else {
						stream.eatWhile(/[\w\$_{}\xa1-\uffff]/)
						let word = stream.current()
						if (this.formula.indexOf(word) != -1) {
							return 'keyword'
						}
						if (this.keywords.indexOf(word) != -1) {
							return 'field'
						}
						return null
					}
				}
			}
		})
		const codeMirror = document.getElementById('codeMirror')
		this.editor = CodeMirror.fromTextArea(codeMirror, {
			lineNumbers: true,
			line: true,
			tabSize: 4,
			mode: 'custom',
			lineWrapping: true,
			autofocus: true
		})

		if (this.value) {
			this.editor.setValue(this.transStr(this.value))
		}

		this.editor.on('change', instance => {
			this.$emit('input', this.transValue(this.editor.getValue()))
			instance.focus()
		})
	},
	methods: {
		formulaInsert(value) {
			let cursor = this.editor.getCursor()
			this.editor.replaceRange(value + '()', cursor, cursor, '+insert')
			this.editor.doc.setCursor({ line: cursor.line, ch: cursor.ch + value.length + 1 })
		},
		rowClick(row, column, event) {
			if (!row.children) {
				let cursor = this.editor.getCursor()
				this.editor.replaceRange(row.comment, cursor, cursor, '+insert')
				this.editor.doc.setCursor({ line: cursor.line, ch: cursor.ch + row.comment.length })
			}
		},
		transValue(value) {
			for (let key in this.businessObj) {
				value = value.replace(new RegExp(this.businessObj[key], 'gm'), key)
			}
			return value
		},
		transStr(value) {
			let pattern = /\$\{(.*?)\}/g
			var matches = value.match(pattern)
			if (matches) {
				for (let i = 0; i < matches.length; i++) {
					let matche = matches[i]
					value = value.replace(matche, this.businessObj[matche])
				}
			}
			return value
		}
	}
}
</script>

<style scoped>
::v-deep .CodeMirror {
	font-size: 14px;
	text-align: start !important;
}

.calculate-box {
	display: flex;
	width: 100%;
	max-height: 600px;
}
.left-box {
	width: 35%;
	border-right: 1px solid #eee;
}
.left-box ::v-deep .el-table .cell {
	text-align: start !important;
}
.right-box {
	width: 70%;
}

/* 编辑器内部样式 */
::v-deep span.cm-field {
	color: #fff;
	background-image: linear-gradient(-117deg, #90dcd4, #7cdfc2) !important;
	padding: 4px !important;
	border-radius: 4px;
	margin-right: 4px !important;
}
::v-deep .cm-keyword {
	font-size: 19px;
}
::v-deep .CodeMirror pre.CodeMirror-line,
.CodeMirror pre.CodeMirror-line-like {
	line-height: 2;
}

::v-deep .CodeMirror-linenumber {
	text-align: center;
	color: #807d7c;
	border: none;
}
::v-deep .CodeMirror-gutters {
	border-right: 1px solid #fff;
	background-color: #fff;
}
</style>
