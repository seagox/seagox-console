<template>
	<div class="calculate-box" :style="styleObject">
		<textarea id="codeMirror" :placeholder="placeholder"></textarea>
	</div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/xml/xml.js'

export default {
	props: {
		value: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		},
		height: {
			type: Number,
			default: 360
		}
	},
	data() {
		return {
			editor: null,
			styleObject: {
				height: this.height + 'px',
				border: '1px solid #409eff'
			}
		}
	},
	mounted() {
		this.codeMirrorInit()
	},
	methods: {
		codeMirrorInit() {
			const codeMirror = document.getElementById('codeMirror')
			this.editor = CodeMirror.fromTextArea(codeMirror, {
				lineNumbers: true,
				line: true,
				tabSize: 4,
				indentUnit: 4,
				mode: 'xml',
				lineWrapping: true,
				autofocus: true
			})

			if (this.value) {
				this.editor.setValue(this.value)
			}

			this.editor.on('change', instance => {
				this.$emit('input', this.editor.getValue())
				instance.focus()
			})
		}
	}
}
</script>

<style scoped>
::v-deep .CodeMirror {
	height: 100% !important;
	font-size: 14px;
	text-align: start !important;
}

.calculate-box {
	border-radius: 8px;
	overflow: hidden;
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
::v-deep .CodeMirror pre.CodeMirror-placeholder {
	color: #999;
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