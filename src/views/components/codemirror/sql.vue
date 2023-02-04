<template>
	<div class="calculate-box" :style="styleObject">
		<textarea id="codeMirror" :placeholder="placeholder"></textarea>
	</div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/sql/sql.js'

export default {
	props: {
		value: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			editor: null,
			styleObject: {
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
				mode: 'sql',
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
	font-size: 14px;
	text-align: start !important;
}

.calculate-box {
	max-height: 600px;
	border-radius: 4px;
	/* padding: 0px 10px; */
	overflow: hidden;
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