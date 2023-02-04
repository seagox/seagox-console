<template>
	<el-table-column
		v-if="!element.display || element.display === 1"
		:prop="element.prop"
		:label="element.label"
		:width="element.width"
		align="center"
		:sortable="!element.children"
	>
		<template slot-scope="scope">
			<div
				v-if="element.routerJson"
				class="column-path"
				v-html="$options.filters.formatter(scope.row, scope.row[element.prop], element, regions)"
				@click="goPath(element.routerJson, scope.row)"
			></div>
			<div v-else v-html="$options.filters.formatter(scope.row, scope.row[element.prop], element, regions)"></div>
		</template>
		<template v-if="element.children">
			<table-column
				v-for="(item, index) in element.children"
				:key="index"
				:element="item"
				:regions="regions"
			></table-column>
		</template>
	</el-table-column>
</template>

<script>
import { handleFormula } from '@/utils/formula'
export default {
	name: 'tableColumn',
	props: {
		element: {
			type: Object,
			required: true
		},
		regions: {
			type: Object,
			required: false
		}
	},
	filters: {
		formatter(row, cellValue, element, regions) {
			if (element.target === 1) {
				//数据字典
				if (element.formatter) {
					let resultArray = []
					let options = JSON.parse(element.options)
					if (String(cellValue).indexOf(',') > -1) {
						//数组
						let cellArray = cellValue.split(',')
						for (var i = 0; i < options.length; i++) {
							if (cellArray.includes(options[i].code)) {
								resultArray.push(options[i].name)
							}
						}
					} else {
						let cellArray = [String(cellValue)]
						for (var i = 0; i < options.length; i++) {
							if (cellArray.includes(options[i].code)) {
								resultArray.push(options[i].name)
							}
						}
					}
					cellValue = resultArray.toString()
				}
			} else if (element.target === 2) {
				//区域数据
				let cellValueArray = JSON.parse(cellValue)
				let cellValueStr = ''
				for (var i = 0; i < cellValueArray.length; i++) {
					if (i === cellValueArray.length - 1) {
						cellValueStr = cellValueStr + regions[cellValueArray[i]]
					} else {
						cellValueStr = cellValueStr + regions[cellValueArray[i]] + '/'
					}
				}
				cellValue = cellValueStr
			} else if (element.target === 3) {
				//图片数据
				if (row[element.prop]) {
					let resources = JSON.parse(row[element.prop])
					if (resources.length === 0) {
						return ''
					} else {
						return '<img style="width: 100px; height: 100px" src="' + resources[0].url + '"></img>'
					}
				}
			}
			if (typeof cellValue == 'undefined') {
				cellValue = ''
			}
			if (element.formula) {
				try {
					let color = handleFormula(element.formula, row)
					return '<span style="color:' + color + '">' + cellValue + '</span>'
				} catch (err) {
					return cellValue
				}
			} else {
				return cellValue
			}
		}
	},
	methods: {
		// 路由跳转
		goPath(routerScript, row) {
			try {
				let func = new Function('that', 'row', routerScript)
				func(this, row)
			} catch (e) {
				console.log(e)
			}
		}
	}
}
</script>

<style scoped>
.column-path {
	color: #1a43a9;
	cursor: pointer;
	text-decoration: underline;
}
</style>
