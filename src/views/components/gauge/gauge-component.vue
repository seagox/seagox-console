<template>
	<grid-layout
		:layout.sync="layout"
		:col-num="24"
		:row-height="6"
		:is-draggable="true"
		:is-resizable="true"
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
			:minH="item.minH"
			:key="index"
			:static="item.static"
			:is-resizable="item.i === currentIndex && item.type != 'modal'"
			@move="move"
			@resize="resize"
			v-on="$listeners"
		>
			<!-- container -->
			<div
				:id="item.i"
				v-if="item.type === 'container'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<gauge-component
					v-if="item.children"
					:layout="item.children"
					:currentIndex="currentIndex"
					@changeFocus="changeFocus"
					@move="move"
					@resize="resize"
					:style="[
						{
							'height': '100%'
						},
						customStyles(item.styles)
					]"
					v-on="$listeners"
				/>
				<div v-else 
					:style="[
						{
							'height': '100%',
							'display': 'flex',
							'align-items': 'center',
							'justify-content': 'center',
							'color': '#999'
						},
						customStyles(item.styles)
					]">
					从左侧面板拖入组件或区块
				</div>
			</div>
			<!-- listView -->
			<div
				:id="item.i"
				v-if="item.type === 'listView'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<gauge-component
					v-if="item.children"
					:layout="item.children"
					:currentIndex="currentIndex"
					@changeFocus="changeFocus"
					@move="move"
					@resize="resize"
					:style="[
						{
							'height': '100%'
						},
						customStyles(item.styles)
					]"
					v-on="$listeners"
				/>
				<div v-else 
					:style="[
						{
							'height': '100%',
							'display': 'flex',
							'align-items': 'center',
							'justify-content': 'center',
							'color': '#999'
						},
						customStyles(item.styles)
					]">
					从左侧面板拖入组件或区块
				</div>
			</div>
			<!-- card -->
			<div
				:id="item.i"
				v-else-if="item.type === 'card'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
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
					<gauge-component
						v-if="item.children"
						:layout="item.children"
						:currentIndex="currentIndex"
						@changeFocus="changeFocus"
						@move="move"
						@resize="resize"
						v-on="$listeners"
					/>
				</el-card>
			</div>
			<!-- text -->
			<div
				:id="item.i"
				v-else-if="item.type === 'text'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:style="[
					{
						display: 'flex',
						height: '100%',
						overflow: 'auto'
					},
					customStyles(item.styles)
				]">
					{{ item.text }}
				</div>	
			</div>
			<!-- image -->
			<div
				:id="item.i"
				v-else-if="item.type === 'image'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<el-image
					:src="item.src"
					:fit="item.fit"
					:style="[{ width: '100%', height: '100%' }, customStyles(item.styles)]"
				></el-image>
			</div>
			<!-- tabs -->
			<div
				:id="item.i"
				v-else-if="item.type === 'tabs'"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				@click.stop="handleEvent('click', item)"
			>
				<el-tabs
					type="border-card"
					:style="[{ height: '100%' }, customStyles(item.styles)]"
					v-model="item.selectedTab"
				>
					<el-tab-pane v-for="(tab, index) in item.tabs" :key="index" :label="tab.name" :name="tab.name">
						<div :style="{ height: item.h * 18 - 39 + 'px' }">
							<gauge-component
								:layout="tab.children"
								:currentIndex="currentIndex"
								@changeFocus="changeFocus"
								@move="move"
								@resize="resize"
								v-on="$listeners"
							/>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
			<!-- chart -->
			<div
				v-else-if="item.type === 'chart'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div :id="item.i" 
					:style="[
						{
							height: '100%',
							'padding-top': '10px',
							'box-sizing': 'border-box'
						},
						customStyles(item.styles)
					]"
					v-if="item.data && item.hasData">
				</div>
				<el-empty 
					:image-size="200"
					:style="[
						{
							height: '100%',
							background: '#fff',
							color: '#5e6d82'
						},
						customStyles(item.styles)
					]" 
					description="暂无数据" 
					v-if="item.data && !item.hasData">
				</el-empty>
				<div
					v-if="!item.data"
					:style="[{
						'height': '100%',
						'display': 'flex',
						'align-items': 'center',
						'justify-content': 'center',
						'color': '#999', 
						'background-color': '#fff'
						}, customStyles(item.styles)]"
				>
					设置右侧来生成图表
				</div>
			</div>
			<!-- 按钮 -->
			<div
				v-else-if="item.type === 'button'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:style="[
					{
						width: '100%',
						height: '100%',
						display: 'flex',
						'justify-content': 'center',
						'align-items': 'center',
						'font-size': '14px'
					},
					customStyles(item.styles)
				]">
				{{ item.text }}
				</div>
			</div>
			<!-- 链接 -->
			<div
				v-else-if="item.type === 'link'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				:style="[
					customStyles(item.styles)
				]"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:style="[
					customStyles(item.styles)
				]">
					{{ item.text }}
				</div>
			</div>
			<!-- 输入框 -->
			<div
				v-else-if="item.type === 'input'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 8px 6px 0px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
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
						:style="{ 
							'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth,
							'line-height': item.labelPosition === 'top' ? '26px' :  '40px'
						}"
					>
						<el-input :type="item.dataType" size="medium" v-model="item.value" :placeholder="item.placeholder" :show-password="item.dataType === 'password'" clearable resize="none" :rows="5"></el-input>
					</div>
				</div>
			</div>
			<!-- 选择器 -->
			<div
				v-else-if="item.type === 'select'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 8px 6px 0px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
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
								v-for="option in item.data"
								:key="option.value"
								:label="option.label"
								:value="option.value"
							>
							</el-option>
						</el-select>
					</div>
				</div>
			</div>
			<!-- 多选选择器 -->
			<div
				v-else-if="item.type === 'multiSelect'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 8px 6px 0px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
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
								v-for="option in item.data"
								:key="option.value"
								:label="option.label"
								:value="option.value"
							>
							</el-option>
						</el-select>
					</div>
				</div>
			</div>
			<!-- 日期选择器 -->
			<div
				v-else-if="item.type === 'datePicker'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 8px 6px 0px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
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
			</div>
			<!-- 时间选择器 -->
			<div
				v-else-if="item.type === 'timePicker'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 8px 6px 0px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
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
			</div>
			<!-- 单选级联选择器 -->
			<div
				v-else-if="item.type === 'cascader'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 8px 6px 0px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
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
							:options="item.data"
							:props="{ checkStrictly: true, emitPath: false }"
							:placeholder="item.placeholder"
							@change="handleEvent('change', item)"
							filterable
							clearable
						></el-cascader>
					</div>
				</div>
			</div>
			<!-- 多选级联选择器 -->
			<div
				v-else-if="item.type === 'multiCascader'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 8px 6px 0px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
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
							:options="item.data"
							:props="{ multiple: true }"
							:placeholder="item.placeholder"
							@change="handleEvent('change', item)"
							collapse-tags
							filterable
							clearable
						></el-cascader>
					</div>
				</div>
			</div>
			<!-- 单选器 -->
			<div
				v-else-if="item.type === 'radio'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 8px 6px 0px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
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
								v-for="option in item.data"
								:key="option.value"
								:label="option.value"
							>
							{{option.label}}
							</el-radio>
						</el-radio-group>
					</div>
				</div>
			</div>
			<!-- 多选器 -->
			<div
				v-else-if="item.type === 'checkbox'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 8px 6px 0px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
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
								v-for="option in item.data"
								:key="option.value"
								:label="option.value"
							>
							{{option.label}}
							</el-checkbox>
						</el-checkbox-group>
					</div>
				</div>
			</div>
			<!-- 开关  -->
			<div
				v-else-if="item.type === 'switch'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 8px 6px 0px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
				:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
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
			</div>
			<!-- 评分  -->
			<div
				v-else-if="item.type === 'rate'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
					<label
						class="el-form-item__label"
						:style="{
							width: item.labelPosition === 'top' ? '' : item.labelWidth,
							'line-height': item.labelPosition === 'top' ? '26px' : '40px', 
							'margin-top': '-10px'
						}"
						>{{ item.label }}</label
					>
					<div
						class="el-form-item__content"
						:style="{ 'margin-left': item.labelPosition === 'top' ? '' : item.labelWidth,'line-height':'32px', 'margin-top': '16px' }"
					>
						<el-rate v-model="item.value" @change="handleEvent('change', item)"></el-rate>
					</div>
				</div>
			</div>
			<!-- 滑块 -->
			<div
				v-else-if="item.type === 'slider'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 8px 6px 0px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
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
			</div>
			<!-- 进度条 -->
			<div
				v-else-if="item.type === 'progress'"
				:class="[item.i === currentIndex ? 'grid-item-checked' : '']"
				style="height:100%;padding: 7px 6px 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<el-progress :text-inside="true" :stroke-width="24" :percentage="item.value"></el-progress>
			</div>
			<!-- 分割线 -->
			<div
				v-else-if="item.type === 'divider'"
				:class="[
					item.i === currentIndex ? 'grid-item-checked' : ''
				]"
				style="height:100%;padding: 0px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<el-divider :direction="item.direction"></el-divider>
			</div>
			<!-- 文件上传 -->
			<div
				v-else-if="item.type === 'upload'"
				:class="[
					item.i === currentIndex ? 'grid-item-checked' : ''
				]"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<div
					:class="[
					item.labelPosition === 'top'
						? 'el-form--label-top'
						: item.labelPosition === 'right'
						? 'el-form--label-right'
						: 'el-form--label-left',
					item.required ? 'is-required' : ''
				]">
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
							:height="item.h * 18 - 74"
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
			</div>
			<!-- 富文本 -->
			<div
				v-else-if="item.type === 'richText'"
				:class="[
					item.i === currentIndex ? 'grid-item-checked' : ''
				]"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				
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
			<div
				v-else-if="item.type === 'table'"
				:class="[
					item.i === currentIndex ? 'grid-item-checked' : ''
				]"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				
				<el-table 
					stripe 
					border 
					:data="item.data" 
					style="width: 100%" 
					:height="item.showPagination ? item.h * 18 - 86 : item.h * 18 - 26" 
					:show-header="item.showHeader"
					@row-dblclick="(row, column, event) => handleEvent('rowDblclick', item, row)">
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
			<div
				v-else-if="item.type === 'signature'"
				:class="[
					item.i === currentIndex ? 'grid-item-checked' : ''
				]"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<canvas :id="item.i" :height="item.h * 18 - 24" :style="[
						{
							width: '100%',
							height: '100%'
						},
						customStyles(item.styles)
					]"></canvas>
			</div>
			<!-- 树 -->
			<div
				v-else-if="item.type === 'tree'"
				:class="[
					item.i === currentIndex ? 'grid-item-checked' : ''
				]"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
			>
				<el-tree :data="item.data" style="height:100%;overflow:auto"></el-tree>
			</div>
			<!-- 我的工作 -->
			<div
				v-else-if="item.type === 'work'"
				:class="[
					'work',
					item.i === currentIndex ? 'grid-item-checked' : ''
				]"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
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
					<div>
						<el-tabs>
							<el-tab-pane :label="'待办事项（' + item.todoTotal + '）'">
								<el-table
									:height="item.h * 18 - 100"
									:data="item.todoItem"
									:show-header="false"
									empty-text="暂无待办事项"
								>
								</el-table>
							</el-tab-pane>
							<el-tab-pane :label="'待发事项（' + item.readyTotal + '）'">
								<el-table
									:height="item.h * 18 - 100"
									:data="item.readyItem"
									:show-header="false"
									empty-text="暂无待发事项"
								>
								</el-table>
							</el-tab-pane>
							<el-tab-pane :label="'已办事项（' + item.doneTotal + '）'">
								<el-table
									:height="item.h * 18 - 100"
									:data="item.doneItem"
									:show-header="false"
									empty-text="暂无已办事项"
								>
								</el-table>
							</el-tab-pane>
							<el-tab-pane :label="'抄送事项（' + item.copyTotal + '）'">
								<el-table
									:height="item.h * 18 - 100"
									:data="item.copyItem"
									:show-header="false"
									empty-text="暂无抄送事项"
								>
								</el-table>
							</el-tab-pane>
							<el-tab-pane :label="'我发起的（' + item.selfTotal + '）'">
								<el-table
									:height="item.h * 18 - 100"
									:data="item.selfItem"
									:show-header="false"
									empty-text="暂无我发起的"
								>
								</el-table>
							</el-tab-pane>
						</el-tabs>
					</div>
				</el-card>
			</div>
			<!-- 快捷入口 -->
			<div
				v-else-if="item.type === 'quick'"
				:class="[
					item.i === currentIndex ? 'grid-item-checked' : ''
				]"
				style="height:100%;padding: 4px 6px;box-sizing:border-box;"
				@click.stop="handleEvent('click', item)"
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
					<div>
						<el-scrollbar style="height:100%"></el-scrollbar>
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
	name: 'gauge-component',
	props: {
		layout: {
			type: Array,
			default: () => {
				return []
			}
		},
		currentIndex: {
			type: String,
			default: ''
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
	methods: {
		customStyles(styles) {
			return styles
		},
		handleEvent(type, item, row) {
			if(item.type === 'signature') {
				this.initfreeDraw(item)
			} else if (type === 'rowDblclick') {
				item.selectedRow = row
			}
			this.$emit('changeFocus', type, item)
		},
		initfreeDraw(item) {
			var parentWidth = document.getElementById(item.i).parentNode.getBoundingClientRect().width
			document.getElementById(item.i).width = parentWidth - 16
			if(this.canvas == null) {
				this.canvas = new fabric.Canvas(item.i)
				this.canvas.backgroundColor = '#fff'
				this.canvas.isDrawingMode= true
			}
			this.canvas.freeDrawingBrush.color = '#000'
			this.canvas.freeDrawingBrush.width = 3
			this.canvas.renderAll()
		},
		changeFocus(type, item) {
			this.$emit('changeFocus', type, item)
		},
		resize(i, newH, newW) {
			let item = {
				i: i,
				w: newW,
				h: newH
			}
			this.$emit('resize', item)
		},
		move(i, newX, newY) {
			let item = {
				i: i,
				x: newX,
				y: newY
			}
			if(item.x) {
				this.$emit('move', item)
			}
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
			const suffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
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

			// let imageTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/png']
			// const isImage = imageTypes.includes(file.type)
			// if (isImage) {
			// 	const isSize = new Promise(function(resolve, reject) {
			// 		let _URL = window.URL || window.webkitURL
			// 		let img = new Image()
			// 		img.onload = function() {
			// 			let widthValid = true
			// 			let heightValid = true
			// 			if (element.width) {
			// 				widthValid = img.width == element.width
			// 			}
			// 			if (element.height) {
			// 				heightValid = img.height == element.height
			// 			}
			// 			let valid = widthValid && heightValid
			// 			valid ? resolve() : reject()
			// 		}
			// 		img.src = _URL.createObjectURL(file)
			// 	}).then(
			// 		() => {
			// 			return file
			// 		},
			// 		() => {
			// 			if (element.width && element.height) {
			// 				this.$loading().close()
			// 				this.$message.error(`上传的图片宽高必须是${element.width}*${element.height}!`)
			// 			} else if (element.width) {
			// 				this.$loading().close()
			// 				this.$message.error(`上传的图片宽度必须是${element.width}!`)
			// 			} else if (element.height) {
			// 				this.$loading().close()
			// 				this.$message.error(`上传的图片高度必须是${element.height}!`)
			// 			}
			// 			return Promise.reject()
			// 		}
			// 	)
			// 	return isSize
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
		}
	}
}
</script>

<style scoped>
::v-deep .el-tabs__content {
	padding: 0px;
}
::v-deep .el-card__body {
	padding: 0px;
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
.grid-item-checked {
	border: 1px solid #1583f2;
}
</style>
