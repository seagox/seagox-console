<template>
	<grid-layout
		:layout.sync="layout"
		:col-num="24"
		:row-height="6"
		:is-draggable="false"
		:is-resizable="false"
		:is-mirrored="false"
		:responsive="false"
		:vertical-compact="false"
		:margin="[12, 12]"
		:use-css-transforms="true"
	>
		<grid-item
			v-for="(item, index) in layout"
			:x="item.x"
			:y="item.y"
			:w="item.w"
			:h="item.h"
			:i="item.i"
			:maxH="item.maxH"
			:key="index"
		>
			<!-- container -->
			<div
				:id="item.i"
				v-if="item.type === 'container'"
				:style="[
					{
						height: '100%'
					},
					customStyles(item.styles)
				]"
			>
				<gauge-show-component v-if="item.children" :layout="item.children" @handleEvent="handleEvent" />
			</div>
			<!-- listView -->
			<div
				:id="item.i"
				v-if="item.type === 'listView'"
				:style="[
					{
						height: '100%'
					},
					customStyles(item.styles)
				]"
			>
				<gauge-show-component v-if="item.children" :layout="item.children" @handleEvent="handleEvent" />
			</div>
			<!-- card -->
			<div :id="item.i" v-else-if="item.type === 'card'" style="height: 100%">
				<el-card
					:style="[
						{
							height: '100%'
						},
						customStyles(item.styles)
					]"
				>
					<div slot="header">
						<span>{{ item.title }}</span>
					</div>
					<gauge-show-component v-if="item.children" :layout="item.children" @handleEvent="handleEvent" />
				</el-card>
			</div>
			<!-- text -->
			<div
				:id="item.i"
				v-else-if="item.type === 'text'"
				:style="[
					{
						display: 'flex',
						height: '100%',
						overflow: 'auto'
					},
					customStyles(item.styles)
				]"
			>
				{{ item.text }}
			</div>
			<!-- image -->
			<div :id="item.i" v-else-if="item.type === 'image'" style="height: 100%">
				<el-image
					:src="item.src"
					:fit="item.fit"
					:style="[{ width: '100%', height: '100%' }, customStyles(item.styles)]"
					@click="handleEvent('click', item)"
				></el-image>
			</div>
			<!-- tabs -->
			<div :id="item.i" v-else-if="item.type === 'tabs'" style="height: 100%">
				<el-tabs
					type="border-card"
					:style="[{ height: '100%' }, customStyles(item.styles)]"
					v-model="item.selectedTab"
				>
					<el-tab-pane v-for="(tab, index) in item.tabs" :key="index" :label="tab.name" :name="tab.name">
						<div :style="{ height: item.h * 18 - 39 + 'px' }">
							<gauge-show-component :layout="tab.children" @handleEvent="handleEvent" />
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
			<!-- chart -->
			<div
				v-else-if="item.type === 'chart'"
				:style="[
					{
						height: '100%',
						'padding-top': '15px',
						'box-sizing': 'border-box'
					},
					customStyles(item.styles)
				]"
			>
				<div :id="item.i" style="height:100%;" v-if="item.data && item.hasData"></div>
				<el-empty :image-size="200" style="height: 100%; background: #fff;color:#5e6d82;" description="暂无数据" v-if="item.data && !item.hasData"></el-empty>
			</div>
			<!-- 按钮 -->
			<div
				v-else-if="item.type === 'button'"
				:style="[
					{
						width: '100%',
						height: '100%',
						display: 'flex',
						'justify-content': 'center',
						'align-items': 'center'
					},
					customStyles(item.styles)
				]"
				@click="handleEvent('click', item)"
			>
				{{ item.text }}
			</div>
			<!-- 链接 -->
			<div
				v-else-if="item.type === 'link'"
				:style="[
					customStyles(item.styles)
				]"
				@click="handleEvent('click', item)"
			>
				{{ item.text }}
			</div>
			<!-- 输入框 -->
			<div
				v-else-if="item.type === 'input'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth }"
				>
					<el-input :type="item.dataType" size="medium" v-model="item.value" :placeholder="item.placeholder" :show-password="item.dataType === 'password'" clearable resize="none" :rows="5"></el-input>
				</div>
			</div>
			<!-- 单选选择器 -->
			<div
				v-else-if="item.type === 'select'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth }"
				>
					<el-select
						size="medium"
						v-model="item.value"
						:placeholder="item.placeholder"
						@change="handleEvent('change', item)"
						filterable
						clearable
					>
						<el-option
							v-for="option in item.options"
							:key="option.value"
							:label="option.label"
							:value="option.value"
						>
						</el-option>
					</el-select>
				</div>
			</div>
			<!-- 多选选择器 -->
			<div
				v-else-if="item.type === 'multiSelect'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth }"
				>
					<el-select
						size="medium"
						v-model="item.value"
						:placeholder="item.placeholder"
						@change="handleEvent('change', item)"
						multiple
						filterable
						clearable
					>
						<el-option
							v-for="option in item.options"
							:key="option.value"
							:label="option.label"
							:value="option.value"
						>
						</el-option>
					</el-select>
				</div>
			</div>
			<!-- 日期选择器 -->
			<div
				v-else-if="item.type === 'datePicker'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth }"
				>
					<el-date-picker
						:type="item.dateFormat"
						:value-format="item.valueFormat"
						size="medium"
						align="center"
						v-model="item.value"
						:placeholder="item.placeholder"
						@change="handleEvent('change', item)"
					></el-date-picker>
				</div>
			</div>
			<!-- 时间选择器 -->
			<div
				v-else-if="item.type === 'timePicker'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth }"
				>
					<el-time-picker
						size="medium"
						align="center"
						v-model="item.value"
						:placeholder="item.placeholder"
						@change="handleEvent('change', item)"
					></el-time-picker>
				</div>
			</div>
			<!-- 单选级联选择器 -->
			<div
				v-else-if="item.type === 'cascader'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth }"
				>
					<el-cascader
						size="medium"
						v-model="item.value"
						:options="item.options"
						:props="{ checkStrictly: true, emitPath: false }"
						:placeholder="item.placeholder"
						@change="handleEvent('change', item)"
						filterable
						clearable
					></el-cascader>
				</div>
			</div>
			<!-- 多选级联选择器 -->
			<div
				v-else-if="item.type === 'multiCascader'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth }"
				>
					<el-cascader
						size="medium"
						v-model="item.value"
						:options="item.options"
						:props="{ multiple: true }"
						:placeholder="item.placeholder"
						@change="handleEvent('change', item)"
						collapse-tags
						filterable
						clearable
					></el-cascader>
				</div>
			</div>
			<!-- 单选器 -->
			<div
				v-else-if="item.type === 'radio'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth }"
				>
					<el-radio-group v-model="item.value" @change="handleEvent('change', item)">
						<el-radio
							v-for="option in item.options"
							:key="option.value"
							:label="option.value"
						>
						{{option.label}}
						</el-radio>
					</el-radio-group>
				</div>
			</div>
			<!-- 多选器 -->
			<div
				v-else-if="item.type === 'checkbox'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth }"
				>
					<el-checkbox-group v-model="item.value" @change="handleEvent('change', item)">
						<el-checkbox
							v-for="option in item.options"
							:key="option.value"
							:label="option.value"
						>
						{{option.label}}
						</el-checkbox>
					</el-checkbox-group>
				</div>
			</div>
			<!-- 开关  -->
			<div
				v-else-if="item.type === 'switch'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth,'line-height':'32px' }"
				>
					<el-switch
						v-model="item.value"
						:inactive-value="item.inactiveValue"
						:active-value="item.activeValue"
						@change="handleEvent('change', item)"
					></el-switch>
				</div>
			</div>
			<!-- 评分  -->
			<div
				v-else-if="item.type === 'rate'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth,'line-height':'32px', 'margin-top': '10px' }"
				>
					<el-rate v-model="item.value" @change="handleEvent('change', item)"></el-rate>
				</div>
			</div>
			<!-- 滑块  -->
			<div
				v-else-if="item.type === 'slider'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.i === currentIndex ? 'grid-item-checked' : 'grid-item-unchecked',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth }"
				>
					<el-slider v-model="item.value" @change="handleEvent('change', item)"></el-slider>
				</div>
			</div>
			<!-- 进度条  -->
			<div
				v-else-if="item.type === 'progress'"
				:class="[]"
			>
				<el-progress :text-inside="true" :stroke-width="24" :percentage="item.value"></el-progress>
			</div>
			<!-- 分割线  -->
			<div
				v-else-if="item.type === 'divider'"
				:class="[]"
			>
				<el-divider :direction="item.direction"></el-divider>
			</div>
			<!-- 文件上传 -->
			<div
				v-else-if="item.type === 'upload'"
				:class="[
					'el-form-item',
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]"
			>
				<label
					class="el-form-item__label"
					:style="{
						width: item.labelPosition === 'top' ? '' : item.labelWidth,
						'line-height': item.labelPosition === 'top' ? '26px' : '40px'
					}"
					>{{ item.label }}</label
				>
				<div
					class="el-form-item__content"
					:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth }"
				>
					<el-upload
						:ref="item.i"
						:action="action"
						:headers="headers"
						multiple
						:show-file-list="false"
						:file-list="item.value"
						:before-upload="
							file => {
								return beforeFileUpload(file, item)
							}
						"
						:on-success="
							(res, file, fileList) => {
								return handleFileSuccess(res, file, fileList, item)
							}
						"
					>
						<el-button size="medium" icon="el-icon-upload2"> 上传</el-button>
					</el-upload>
					<el-table
						:data="item.value"
						:height="item.h * 18 - 64"
						border
						stripe
						style="margin-top: 10px"
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
									class="el-icon-download"
									style="font-size: 16px; margin-left: 10px; margin-right: 10px"
									@click="handleFileDownload(scope.row)"
								></i>
								<i
									class="el-icon-delete"
									style="font-size: 16px"
									@click="handleFileRemove(scope.row, item)"
								></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<!-- 富文本 -->
			<div v-else-if="item.type === 'richText'">
				<editor
					:ref="item.i"
					:id="item.i + Date.now()"
					v-model="item.value"
					:placeholder="item.placeholder"
					:height="item.h * 18 - 68"
				>
				</editor>
			</div>
			<!-- 表格 -->
			<div v-else-if="item.type === 'table'">
				<el-table
					stripe
					border
					:data="item.tableData"
					style="width: 100%"
					:height="item.showPagination ? item.h * 18 - 86 : item.h * 18 - 26"
					:show-header="item.showHeader"
					@row-dblclick="(row, column, event) => handleEvent('rowDblclick', item, row)">
				>
					<el-table-column type="selection" width="50" align="center" v-if="item.allowMultiRowSelect"></el-table-column>
					<custom-table-column v-for="(column, index) in item.columns" :key="index" :column="column"/>
				</el-table>
				<!--分页-->
				<div class="pagination" v-if="item.showPagination">
					<el-pagination
						background
						layout="total, prev, pager, next"
						:current-page.sync="item.pageNo"
						:total="item.total"
						@current-change="handleEvent('pageChange', item)"
					>
					</el-pagination>
				</div>
			</div>
			<!-- 对话框 -->
			<div v-else-if="item.type === 'modal'">
				<el-dialog :title="item.title" :width="item.width" :visible.sync="item.isVisible" append-to-body>
					<span>这是一段信息</span>
					<span slot="footer" class="dialog-footer">
						<el-button @click="item.isVisible = false">取 消</el-button>
						<el-button type="primary" @click="item.isVisible = false">确 定</el-button>
					</span>
				</el-dialog>
			</div>
			<!-- 签名 -->
			<div v-else-if="item.type === 'signature'" 
				:style="[
					{
						padding: '4px',
						'box-sizing': 'border-box'
					},
					customStyles(item.styles)
				]"
				@click="handleEvent('click', item)">
				<canvas :id="item.i" :height="item.h * 18 - 24"></canvas>
			</div>
			<!-- 树 -->
			<div v-else-if="item.type === 'tree'">
				<el-tree :data="item.treeData" style="height:100%;overflow:auto"></el-tree>
			</div>
			<!-- 我的工作 -->
			<div
				class="work"
				v-else-if="item.type === 'work'"
				style="height:100%;box-sizing:border-box"
			>
				<el-card
					:style="[
						{
							height: '100%'
						},
						customStyles(item.styles)
					]"
				>
					<div slot="header">
						<span>{{ item.title }}</span>
						<el-link type="primary" style="float: right" @click="handleWorkMore(item)">更多</el-link>
					</div>
					<div style="margin:-20px">
						<el-tabs v-model="item.activeName">
							<el-tab-pane :label="'待办事项（' + item.todoTotal + '）'" name="todoItem">
								<el-table
									:height="item.h * 18 - 110"
									:data="item.todoItem"
									:show-header="false"
									empty-text="暂无待办事项"
									@row-dblclick="(row, column, event) => handleEvent('rowDblclick', item, row)"
								>
									<el-table-column property="name" show-overflow-tooltip>
										<template slot-scope="scope">
											<span v-if="scope.row.returnNumber > 2" style="color: #ef0022">{{
												scope.row.name
											}}</span>
											<span v-else>{{ scope.row.name }}</span>
										</template>
									</el-table-column>
									<el-table-column property="assigneeName" align="right"></el-table-column>
									<el-table-column property="createTime"></el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane :label="'待发事项（' + item.readyTotal + '）'" name="readyItem">
								<el-table
									:height="item.h * 18 - 110"
									:data="item.readyItem"
									:show-header="false"
									empty-text="暂无待发事项"
									@row-dblclick="(row, column, event) => handleEvent('rowDblclick', item, row)"
								>
									<el-table-column property="name" show-overflow-tooltip></el-table-column>
									<el-table-column property="createTime" align="center"></el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane :label="'已办事项（' + item.doneTotal + '）'" name="doneItem">
								<el-table
									:height="item.h * 18 - 110"
									:data="item.doneItem"
									:show-header="false"
									empty-text="暂无已办事项"
									@row-dblclick="(row, column, event) => handleEvent('rowDblclick', item, row)"
								>
									<el-table-column property="name" show-overflow-tooltip></el-table-column>
									<el-table-column property="assigneeName" align="right"></el-table-column>
									<el-table-column property="createTime" align="center"></el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane :label="'抄送事项（' + item.copyTotal + '）'" name="copyItem">
								<el-table
									:height="item.h * 18 - 110"
									:data="item.copyItem"
									:show-header="false"
									empty-text="暂无抄送事项"
									@row-dblclick="(row, column, event) => handleEvent('rowDblclick', item, row)"
								>
									<el-table-column property="name" show-overflow-tooltip></el-table-column>
									<el-table-column property="assigneeName" align="right"></el-table-column>
									<el-table-column property="createTime" align="center"></el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane :label="'我发起的（' + item.selfTotal + '）'" name="selfItem">
								<el-table
									:height="item.h * 18 - 110"
									:data="item.selfItem"
									:show-header="false"
									empty-text="暂无我发起的"
									@row-dblclick="(row, column, event) => handleEvent('rowDblclick', item, row)"
								>
									<el-table-column property="name" show-overflow-tooltip></el-table-column>
									<el-table-column property="createTime" align="center"></el-table-column>
								</el-table>
							</el-tab-pane>
						</el-tabs>
					</div>
				</el-card>
			</div>
			<!-- 快捷入口 -->
			<div
				v-else-if="item.type === 'quick'"
				style="height:100%;box-sizing:border-box;"
			>
				<el-card
					:style="[
						{
							height: '100%'
						},
						customStyles(item.styles)
					]"
				>
					<div slot="header">
						<span>{{ item.title }}</span>
					</div>
					<div :style="{
								height: item.h * 18 - 84 + 'px'
							}">
						<el-scrollbar style="height:100%">
							<el-row>
								<el-col
									:span="6"
									v-for="(option, index) in item.options"
									:key="index"
									style="margin-bottom: 20px; cursor: pointer"
								>
									<div
										@click="handleQuickAccess(option)"
										style="
											display: flex;
											flex-direction: column;
											justify-content: center;
											align-items: center;
										"
									>
										<div
											:style="{
												width: '48px',
												height: '48px',
												'border-radius': '18px',
												'text-align': 'center',
												'line-height': '48px',
												background: option.color
											}"
										>
											<i :class="option.icon" style="color: #fff; font-size: 17px"></i>
										</div>
										<div style="margin-top: 10px;">{{ option.quick_name ? option.quick_name : option.name }}</div>
									</div>
								</el-col>
							</el-row>
						</el-scrollbar>
					</div>
				</el-card>
			</div>
		</grid-item>
	</grid-layout>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import editor from '@/views/components/quill/editor'
import customTableColumn from "@/views/components/gauge/custom-table-column"
import { fabric } from "fabric"
export default {
	name: 'gauge-show-component',
	props: {
		layout: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	components: {
		GridLayout: VueGridLayout.GridLayout,
		GridItem: VueGridLayout.GridItem,
		editor,
		customTableColumn
	},
	data() {
		return {
			action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
			headers: {
				Authorization: window.localStorage.getItem('Authorization')
			},
			canvas: null
		}
	},
	computed: {
		permissions() {
			let permissions = localStorage.getItem('permissions')
			if (permissions) {
				return permissions.split(',')
			}
			return []
		}
	},
	methods: {
		customStyles(styles) {
			return styles
		},
		handleEvent(type, params, row) {
			if(params.type === 'signature') {
				this.initfreeDraw(params)
			}
			this.$emit('handleEvent', type, params, row)
		},
		initfreeDraw(item) {
			var parentWidth = document.getElementById(item.i).parentNode.getBoundingClientRect().width
			document.getElementById(item.i).width = parentWidth - 12
			this.canvas = new fabric.Canvas(item.i)
			this.canvas.backgroundColor = '#fff'
			this.canvas.isDrawingMode= true
			this.canvas.freeDrawingBrush.color = '#000'
			this.canvas.freeDrawingBrush.width = 3
			this.canvas.renderAll()
		},
		// 单位格式化
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
		// 获取文件类型
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
		// 文件上传之前
		beforeFileUpload(file, element) {
			this.$loading({ text: '上传中，请稍后...' })
			// if (element.minValue) {
			// 	if (file.size < element.minValue) {
			// 		this.$loading().close()
			// 		this.$message.error('文档大小至少要' + this.sizeUnit(element.minValue))
			// 		return false
			// 	}
			// }
			// if (element.maxValue) {
			// 	if (file.size > element.maxValue) {
			// 		this.$loading().close()
			// 		this.$message.error('文档大小不能超过' + this.sizeUnit(element.maxValue))
			// 		return false
			// 	}
			// }
			return true
		},
		// 文件上传成功
		handleFileSuccess(res, file, fileList, element) {
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
				element.value = JSON.parse(JSON.stringify(fileArray))
			} else {
				let index = element.value.findIndex(fileItem => {
					return fileItem.url === file.url
				})
				fileList.splice(index, 1)
				this.$message.error(res.message)
			}
		},
		// 文件下载
		handleFileDownload(file) {
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
		// 文件删除
		handleFileRemove(file, element) {
			let fileList = this.$refs[element.i][0].uploadFiles
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
			element.value = fileArray
		},
		handleQuickAccess(item) {
			if (item.type === 1) {
				// 列表
				this.$router.push({
					path: '/formList',
					query: {
						id: item.path,
						title: item.name
					}
				})
			} else if (item.type === 3) {
				// 新增页面
				this.$router.push({
					path: '/addCustomForm',
					query: {
						id: item.path,
						title: item.name,
						time: new Date().getTime()
					}
				})
			} else if (item.type === 4) {
				// 系统菜单
				this.$router.push('/' + item.path)
			} else if (item.type === 6) {
				// 仪表板
				this.$router.push({
					path: '/analysis',
					query: {
						id: item.path,
						title: item.name,
						time: new Date().getTime()
					}
				})
			} else if (item.type === 7) {
				// 自定义页面
				this.$router.push('/' + item.path)
			} else if (item.type === 8) {
				// 报表
				this.$router.push({
					path: '/reportList',
					query: {
						id: item.path,
						title: item.name
					}
				})
			} else if (item.type === 9) {
				// 单页面
				this.$router.push('/' + item.path)
			} 
		},
		handleWorkMore(item) {
			if(item.rowDblclick) {
				this.$router.push({
					path: '/runCode',
					query: {
						path: item.activeName,
						title: '事项详情'
					}
				})
			} else {
				this.$router.push({
					path: '/' + item.activeName
				})
			}
			
		}
	}
}
</script>

<style scoped>
::v-deep .el-scrollbar__wrap {
	overflow-x: hidden !important;
}
::v-deep .work .el-tabs__nav {
	transform: translateX(15px) !important;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
	padding: 0px;
}
::-webkit-scrollbar {
	width: 4px;
	height: 4px;
}
::-webkit-scrollbar-thumb {
	width: 4px;
	background: #ccc;
}
::-webkit-scrollbar-track {
	width: 4px;
	background: #eee;
}
</style>
