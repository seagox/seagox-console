<template>
    <div class="container">
        <div class="left-board">
            <div class="logo-wrapper">
                <div class="logo">表单设计</div>
            </div>
            <div class="left-scrollbar el-scrollbar">
                <div class="components-list">
                    <div class="components-title">基础组件</div>
                    <draggable
                        :list="basicLeftArray"
                        :group="{ name: 'form', pull: 'clone', put: false }"
                        ghost-class="ghost"
                        :sort="false"
                    >
                        <transition-group class="components-draggable">
                            <div
                                class="components-item"
                                v-for="element in basicLeftArray"
                                :key="element.type"
                                @click="handleAddFormItem(element)"
                            >
                                {{ element.label }}
                            </div>
                        </transition-group>
                    </draggable>
                    <div class="components-title" style="margin-top:15px">高级组件</div>
                    <draggable
                        :list="seniorLeftArray"
                        :group="{ name: 'form', pull: 'clone', put: false }"
                        ghost-class="ghost"
                        :sort="false"
                    >
                        <transition-group class="components-draggable">
                            <div
                                class="components-item"
                                v-for="element in seniorLeftArray"
                                :key="element.type"
                                @click="handleAddFormItem(element)"
                            >
                                {{ element.label }}
                            </div>
                        </transition-group>
                    </draggable>
                </div>
            </div>
        </div>
        <div class="center-board">
            <div class="action-bar">
                <button type="button" class="el-button el-button--text" @click="handleSave">
                    <i class="el-icon-document"></i><span> 保存 </span>
                </button>
                <!-- <button type="button" class="el-button el-button--text" @click="handlePreview">
					<i class="el-icon-view"></i><span> 预览 </span>
				</button> -->
                <button type="button" class="el-button delete-btn el-button--text" @click="handleEmpty">
                    <i class="el-icon-delete"></i><span> 清空 </span>
                </button>
                <button type="button" class="el-button delete-btn el-button--text" @click="handleBack">
                    <i class="el-icon-circle-close"></i><span> 返回 </span>
                </button>
            </div>
            <div class="center-scrollbar el-scrollbar">
                <div class="center-board-row el-row">
                    <el-form label-width="80px" :rules="rules">
                        <draggable v-model="centerArray" group="form" animation="300">
                            <el-col
                                :gutter="20"
                                :span="element.span"
                                v-for="(element, index) in centerArray"
                                :key="index"
                                class="drawing-item"
                                :class="activeIndex === index ? 'active-from-item' : ''"
                            >
                                <div
                                    @click="handleElement(index)"
                                    v-if="element.type != 'tabs' && element.type != 'card'"
                                >
                                    <div
                                        v-if="element.type === 'word'"
                                        :style="{
                                            color: element.color,
                                            'font-size': element.fontSize,
                                            textAlign: element.textAlign,
                                            padding: '20px'
                                        }"
                                    >
                                        {{ element.label }}
                                    </div>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'text'"
                                    >
                                        <el-input
                                            v-model="formModel[element.field]"
                                            :placeholder="element.placeholder"
                                            clearable
                                            :readonly="element.readonly"
                                            :disabled="element.disabled"
                                            :maxlength="element.maxlength"
                                            show-word-limit
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'textarea'"
                                    >
                                        <el-input
                                            type="textarea"
                                            v-model="formModel[element.field]"
                                            :placeholder="element.placeholder"
                                            clearable
                                            :readonly="element.readonly"
                                            :disabled="element.disabled"
                                            :maxlength="element.maxlength"
                                            show-word-limit
                                            :rows="element.rows"
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'password'"
                                    >
                                        <el-input
                                            v-model="formModel[element.field]"
                                            :placeholder="element.placeholder"
                                            clearable
                                            :readonly="element.readonly"
                                            :disabled="element.disabled"
                                            show-password
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'number'"
                                    >
                                        <el-input-number
                                            v-model="formModel[element.field]"
                                            clearable
                                            :placeholder="element.placeholder"
                                            :disabled="element.disabled"
                                            :controls="false"
                                            @mousewheel.native.prevent
                                            :precision="element.decimal ? element.precision : 0"
                                        ></el-input-number>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'radio'"
                                    >
                                        <el-radio-group v-model="formModel[element.field]" :disabled="element.disabled">
                                            <el-radio
                                                v-for="item in element.options"
                                                :key="item.code"
                                                :label="item.code"
                                            >
                                                {{ item.name }}
                                            </el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'checkbox'"
                                    >
                                        <el-checkbox-group
                                            v-model="formModel[element.field]"
                                            :disabled="element.disabled"
                                        >
                                            <el-checkbox
                                                v-for="item in element.options"
                                                :key="item.code"
                                                :label="item.code"
                                            >
                                                {{ item.name }}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'select'"
                                    >
                                        <el-select
                                            v-model="formModel[element.field]"
                                            filterable
                                            :placeholder="element.placeholder"
                                            :disabled="element.disabled"
                                            clearable
                                            :multiple="element.multiple"
                                        >
                                            <el-option
                                                v-for="item in element.options"
                                                :key="item.code"
                                                :label="item.name"
                                                :value="item.code"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'cascader'"
                                    >
                                        <el-cascader
                                            v-model="formModel[element.field]"
                                            :options="element.options"
                                            :props="{ multiple: element.multiple }"
                                            :placeholder="element.placeholder"
                                            filterable
                                            clearable
                                        ></el-cascader>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        v-if="element.type === 'switch'"
                                    >
                                        <el-switch
                                            v-model="formModel[element.field]"
                                            :inactive-value="element.inactiveValue"
                                            :active-value="element.activeValue"
                                            :disabled="element.disabled"
                                        ></el-switch>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'datePicker'"
                                    >
                                        <el-date-picker
                                            v-model="formModel[element.field]"
                                            :type="element.dateType"
                                            :value-format="element.valueFormat"
                                            :placeholder="element.placeholder"
                                            :disabled="element.disabled"
                                            clearable
                                            :default-value="element.defaultValue"
                                            align="center"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'timePicker'"
                                    >
                                        <el-time-select
                                            v-model="formModel[element.field]"
                                            :placeholder="element.placeholder"
                                            :disabled="element.disabled"
                                            clearable
                                            :picker-options="{
                                                start: '00:00',
                                                step: '00:15',
                                                end: '24:00'
                                            }"
                                        >
                                        </el-time-select>
                                    </el-form-item>

                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'dateRangePicker'"
                                    >
                                        <el-date-picker
                                            v-model="formModel[element.field]"
                                            type="daterange"
                                            range-separator="-"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd"
                                            :disabled="element.disabled"
                                            clearable
                                            align="center"
                                        ></el-date-picker>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'timeRangePicker'"
                                    >
                                        <el-time-picker
                                            is-range
                                            arrow-control
                                            v-model="formModel[element.field]"
                                            range-separator="-"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            value-format="HH:mm:ss"
                                            :disabled="element.disabled"
                                            clearable
                                        ></el-time-picker>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'editor'"
                                    >
                                        <editor
                                            :id="element.field"
                                            v-model="formModel[element.field]"
                                            :placeholder="element.placeholder"
                                            :enable="!element.disabled"
                                        >
                                        </editor>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'area'"
                                    >
                                        <el-cascader
                                            v-model="formModel[element.field]"
                                            clearable
                                            :placeholder="element.placeholder"
                                            :disabled="element.disabled"
                                            :options="element.options"
                                            :props="{ value: 'code', label: 'name' }"
                                            filterable
                                        >
                                        </el-cascader>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'bill'"
                                    >
                                        <el-input
                                            v-model="formModel[element.field]"
                                            :placeholder="element.placeholder"
                                            clearable
                                            :readonly="element.readonly"
                                            :disabled="element.disabled"
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'calculate'"
                                    >
                                        <el-input
                                            v-model="formModel[element.field]"
                                            :placeholder="element.placeholder"
                                            clearable
                                            :readonly="element.readonly"
                                            :disabled="element.disabled"
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'department'"
                                        class="inside-input"
                                    >
                                        <el-select
                                            v-model="formModel[element.field]"
                                            :placeholder="element.placeholder"
                                            clearable
                                            :multiple="element.multiple"
                                            :disabled="element.disabled"
                                        >
                                            <el-option
                                                v-for="item in element.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                        <i
                                            class="el-icon-more iconE"
                                            @click="handleDeptDynamicDialog(element)"
                                            v-show="!element.disabled"
                                        ></i>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'member'"
                                        class="inside-input"
                                    >
                                        <el-select
                                            v-model="formModel[element.field]"
                                            :placeholder="element.placeholder"
                                            clearable
                                            :multiple="element.multiple"
                                            :disabled="element.disabled"
                                        >
                                            <el-option
                                                v-for="item in element.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                        <i
                                            class="el-icon-more iconE"
                                            @click="handleMemberDynamicDialog(element)"
                                            v-show="!element.disabled"
                                        ></i>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'business'"
                                        class="inside-input"
                                    >
                                        <el-select
                                            v-model="formModel[element.field]"
                                            :placeholder="element.placeholder"
                                            clearable
                                            :multiple="element.multiple"
                                            :disabled="element.disabled"
                                        >
                                            <el-option
                                                v-for="item in element.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                        <i class="el-icon-more iconE" v-show="!element.disabled"></i>
                                    </el-form-item>
                                    <div :label="element.label" v-if="element.type === 'table'">
                                        <el-table
                                            :data="formModel[element.field]"
                                            border
                                            highlight-current-row
                                            stripe
                                            max-height="210"
                                            :show-summary="element.showSummary"
                                            :summary-method="
                                                ({ columns, data }) =>
                                                    getSummaries({ columns, data }, element.summaryArray)
                                            "
                                        >
                                            <el-table-column
                                                :prop="item.field"
                                                :label="item.title"
                                                v-for="(item, index) in element.values"
                                                :key="index"
                                                align="center"
                                                :render-header="
                                                    (h, { column, $index }) => renderHeader(h, { column, $index }, item)
                                                "
                                            >
                                                <template slot-scope="scope">
                                                    <div v-if="item.type === 'input'">
                                                        <el-input
                                                            v-model="scope.row[item.field]"
                                                            :disabled="element.disabled"
                                                        >
                                                        </el-input>
                                                    </div>
                                                    <div v-if="item.type === 'number'">
                                                        <el-input
                                                            v-model="scope.row[item.field]"
                                                            :disabled="element.disabled"
                                                            @input="handleTableChange(element.field, item.field, item)"
                                                            type="number"
                                                            v-if="!scope.row.$status"
                                                            v-focus
                                                            @blur="handleTableBlur(element.field, scope.$index, false)"
                                                            oninput="value=value.indexOf('.') > -1?value.slice(0, value.indexOf('.') + 3):value"
                                                        ></el-input>
                                                        <div
                                                            v-else
                                                            @click="handleTableBlur(element.field, scope.$index, true)"
                                                            v-html="
                                                                $options.filters.numberFormat(scope.row[item.field])
                                                            "
                                                        ></div>
                                                    </div>
                                                    <div v-else-if="item.type === 'select'">
                                                        <el-select
                                                            v-model="scope.row[item.field]"
                                                            filterable
                                                            :disabled="element.disabled"
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
                                                            :disabled="element.disabled"
                                                        ></el-switch>
                                                    </div>
                                                    <div v-else-if="item.type === 'timePicker'">
                                                        <el-time-select
                                                            v-model="scope.row[item.field]"
                                                            :disabled="element.disabled"
                                                            :picker-options="{
                                                                start: '00:00',
                                                                step: '00:15',
                                                                end: '24:00'
                                                            }"
                                                        >
                                                        </el-time-select>
                                                    </div>
                                                    <div v-else-if="item.type === 'datePicker'">
                                                        <el-date-picker
                                                            v-model="scope.row[item.field]"
                                                            type="date"
                                                            value-format="yyyy-MM-dd"
                                                            :disabled="element.disabled"
                                                            align="center"
                                                        >
                                                        </el-date-picker>
                                                    </div>
                                                    <div v-else-if="item.type === 'calculation'">
                                                        {{
                                                            calculationFormat(
                                                                scope,
                                                                item.field,
                                                                item.calculation,
                                                                element.field
                                                            )
                                                        }}
                                                    </div>
                                                    <div class="inside-input" v-else-if="item.type === 'department'">
                                                        <el-select
                                                            v-model="scope.row[item.field]"
                                                            filterable
                                                            :disabled="element.disabled"
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
                                                                handleTableDialog(
                                                                    scope.$index,
                                                                    element.field + '.' + item.field,
                                                                    item
                                                                )
                                                            "
                                                            v-show="!element.disabled"
                                                        ></i>
                                                    </div>
                                                    <div class="inside-input" v-else-if="item.type === 'member'">
                                                        <el-select
                                                            v-model="scope.row[item.field]"
                                                            filterable
                                                            :disabled="element.disabled"
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
                                                                handleTableDialog(
                                                                    scope.$index,
                                                                    element.field + '.' + item.field,
                                                                    item
                                                                )
                                                            "
                                                            v-show="!element.disabled"
                                                        ></i>
                                                    </div>
                                                    <div class="inside-input" v-else-if="item.type === 'business'">
                                                        <el-select
                                                            v-model="scope.row[item.field]"
                                                            filterable
                                                            :disabled="element.disabled"
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
                                                                handleTableDialog(
                                                                    scope.$index,
                                                                    element.field + '.' + item.field,
                                                                    item
                                                                )
                                                            "
                                                            v-show="!element.disabled"
                                                        ></i>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="操作"
                                                width="90px"
                                                align="center"
                                                fixed="right"
                                                v-if="!element.disabled"
                                            >
                                                <template slot-scope="scope">
                                                    <i
                                                        class="el-icon-circle-plus-outline tableAdd"
                                                        @click="handleTableAdd(scope.$index, element)"
                                                    ></i>
                                                    <i
                                                        class="el-icon-remove-outline tableDel"
                                                        @click="handleTableDel(scope.$index, element)"
                                                    ></i>
                                                </template>
                                            </el-table-column>
                                            <div
                                                slot="empty"
                                                @click="handleTableAdd(0, element)"
                                                v-if="!element.disabled"
                                            >
                                                暂无数据 <i class="el-icon-circle-plus-outline"></i>
                                            </div>
                                        </el-table>
                                    </div>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'picture'"
                                    >
                                        <el-upload
                                            v-if="!element.multiple"
                                            class="avatar-uploader"
                                            :action="action"
                                            :headers="headers"
                                            :show-file-list="false"
                                            :disabled="element.disabled"
                                            :before-upload="
                                                file => {
                                                    return beforeUpload(file, element)
                                                }
                                            "
                                            :on-success="
                                                (res, file, fileList) => {
                                                    return handleUploadSuccess(res, file, fileList, element)
                                                }
                                            "
                                            :on-preview="
                                                file => {
                                                    return handleFilePreview(file, element.field)
                                                }
                                            "
                                        >
                                            <el-image
                                                v-if="formModel[element.field].length != 0"
                                                :src="formModel[element.field][0].url"
                                                class="avatar"
                                                lazy
                                            ></el-image>
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                        <el-upload
                                            v-else
                                            :ref="element.field"
                                            :action="action"
                                            :headers="headers"
                                            :file-list="formModel[element.field]"
                                            :disabled="element.disabled"
                                            multiple
                                            :before-upload="
                                                file => {
                                                    return beforeUpload(file, element)
                                                }
                                            "
                                            list-type="picture-card"
                                            :on-success="
                                                (res, file, fileList) => {
                                                    return handleUploadSuccess(res, file, fileList, element)
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
                                                    src="@/assets/fileType/other.svg"
                                                    v-else
                                                />
                                                <span class="el-upload-list__item-actions">
                                                    <span
                                                        class="el-upload-list__item-preview"
                                                        @click="handleFilePreview(file, element.field)"
                                                        v-if="
                                                            file.type != 'video' ||
                                                                file.type != 'radio' ||
                                                                file.type != 'zip' ||
                                                                file.type != 'other'
                                                        "
                                                    >
                                                        <i class="el-icon-view"></i>
                                                    </span>
                                                    <span
                                                        class="el-upload-list__item-delete"
                                                        @click="handleFileDownload(file)"
                                                    >
                                                        <i class="el-icon-download"></i>
                                                    </span>
                                                    <span
                                                        class="el-upload-list__item-delete"
                                                        @click="handleFileRemove(file, element.field)"
                                                    >
                                                        <i class="el-icon-delete"></i>
                                                    </span>
                                                </span>
                                            </div>
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item
                                        :label="element.label"
                                        :label-width="element.labelWidth ? element.labelWidth + 'px' : 80 + 'px'"
                                        :prop="element.field"
                                        v-if="element.type === 'upload'"
                                    >
                                        <el-upload
                                            :action="action"
                                            :headers="headers"
                                            :show-file-list="false"
                                            :disabled="element.disabled"
                                        >
                                            <el-button type="primary" icon="el-icon-upload"> 上传</el-button>
                                        </el-upload>
                                    </el-form-item>
                                    <div
                                        v-if="element.type === 'wps' || element.type === 'et'"
                                        style="text-align:center;padding-top:15px;padding-bottom:15px;"
                                    >
                                        <el-button type="primary">{{ element.label }}</el-button>
                                    </div>
                                    <span title="复制" class="drawing-item-copy" @click.stop="handleItemCopy(index)">
                                        <i class="el-icon-copy-document"></i>
                                    </span>
                                    <span
                                        title="删除"
                                        class="drawing-item-delete"
                                        @click.stop="handleItemDelete(index)"
                                    >
                                        <i class="el-icon-delete"></i>
                                    </span>
                                </div>
                                <draggable
                                    v-model="element.list"
                                    group="form"
                                    animation="300"
                                    v-if="element.type === 'card'"
                                >
                                    asd
                                </draggable>
                            </el-col>
                        </draggable>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="right-board">
            <el-tabs v-model="activeName">
                <el-tab-pane label="组件属性" name="first">
                    <div class="el-scrollbar__view">
                        <el-form :model="formData" label-width="80px" size="medium" v-if="formData.type">
                            <el-form-item label="字段" v-if="!(formData.type === 'word' || formData.type === 'table')">
                                <el-select
                                    v-model="formData.field"
                                    filterable
                                    placeholder="请选择字段"
                                    clearable
                                    @change="fieldChange($event, formData)"
                                >
                                    <el-option
                                        v-for="item in fieldOptions"
                                        :key="item.id"
                                        :label="item.remark"
                                        :value="item.name"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="表" v-if="formData.type === 'table'">
                                <el-select v-model="formData.field" filterable placeholder="请选择表" clearable>
                                    <el-option
                                        v-for="item in tableOptions"
                                        :key="item.name"
                                        :label="item.remark"
                                        :value="item.name"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="标题" v-if="formData.type != 'word'">
                                <el-input v-model="formData.label"></el-input>
                            </el-form-item>
                            <el-form-item label="占位提示" v-if="formData.type != 'word'">
                                <el-input v-model="formData.placeholder"></el-input>
                            </el-form-item>
                            <el-form-item label="标签" v-if="formData.type === 'word'">
                                <el-input v-model="formData.label" placeholder="请输入文本"></el-input>
                            </el-form-item>
                            <el-form-item label="颜色" v-if="formData.type === 'word'">
                                <el-color-picker v-model="formData.color"></el-color-picker>
                            </el-form-item>
                            <el-form-item label="对齐方式" v-if="formData.type === 'word'">
                                <el-radio-group v-model="formData.textAlign">
                                    <el-radio-button label="left">左</el-radio-button>
                                    <el-radio-button label="center">居中</el-radio-button>
                                    <el-radio-button label="right">右</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="字体大小" v-if="formData.type === 'word'">
                                <el-select v-model="formData.fontSize" placeholder="请选择字体大小">
                                    <el-option label="12px" value="12px"> </el-option>
                                    <el-option label="14px" value="14px"> </el-option>
                                    <el-option label="16px" value="16px"> </el-option>
                                    <el-option label="18px" value="18px"> </el-option>
                                    <el-option label="20px" value="20px"> </el-option>
                                    <el-option label="22px" value="22px"> </el-option>
                                    <el-option label="24px" value="24px"> </el-option>
                                    <el-option label="26px" value="26px"> </el-option>
                                    <el-option label="28px" value="28px"> </el-option>
                                    <el-option label="30px" value="30px"> </el-option>
                                    <el-option label="32px" value="32px"> </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="表单栅格">
                                <el-slider v-model="formData.span" :min="1" :max="24"></el-slider>
                            </el-form-item>
                            <el-form-item label="标签宽度" v-if="formData.type != 'word'">
                                <el-input-number
                                    v-model="formData.labelWidth"
                                    placeholder="请输入标签宽度"
                                    :step="5"
                                    :min="60"
                                    :max="150"
                                    @mousewheel.native.prevent
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="默认值"
                                v-if="
                                    formData.type === 'text' ||
                                        formData.type === 'textarea' ||
                                        formData.type === 'password'
                                "
                            >
                                <el-input v-model="formData.defaultValue" placeholder="请输入默认值"></el-input>
                            </el-form-item>
                            <el-form-item label="默认值" v-if="formData.type === 'number'">
                                <el-input-number
                                    v-model="formData.defaultValue"
                                    placeholder="请输入默认值"
                                    :controls="false"
                                    @mousewheel.native.prevent
                                    :precision="formData.precision"
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="默认值"
                                v-if="
                                    formData.type === 'radio' ||
                                        formData.type === 'checkbox' ||
                                        formData.type === 'select'
                                "
                            >
                                <el-select
                                    v-model="formData.defaultValue"
                                    filterable
                                    placeholder="请选择默认值"
                                    clearable
                                    :multiple="formData.type === 'checkbox' || formData.multiple"
                                >
                                    <el-option
                                        v-for="item in formData.options"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="默认值" v-if="formData.type === 'switch'">
                                <el-select v-model="formData.defaultValue" placeholder="请选择默认值" clearable>
                                    <el-option label="打开" :value="formData.activeValue"></el-option>
                                    <el-option label="关闭" :value="formData.inactiveValue"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="允许小数" v-if="formData.type === 'number'">
                                <el-switch v-model="formData.decimal"></el-switch>
                            </el-form-item>
                            <el-form-item label="限制位数" v-if="formData.type === 'number' && formData.decimal">
                                <el-input-number
                                    v-model="formData.precision"
                                    step-strictly
                                    :min="0"
                                    :max="6"
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item label="组件高度" v-if="formData.type === 'editor'">
                                <el-input-number
                                    v-model="formData.height"
                                    step-strictly
                                    :min="1"
                                    :max="1000"
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="最多输入"
                                v-if="formData.type === 'text' || formData.type === 'textarea'"
                            >
                                <el-input placeholder="请输入字符长度" v-model="formData.maxlength" type="number">
                                    <template slot="append">个字符</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="行数" v-if="formData.type === 'textarea'">
                                <el-input-number
                                    v-model="formData.rows"
                                    step-strictly
                                    :min="1"
                                    :max="10"
                                ></el-input-number>
                            </el-form-item>
                            <!-- 开关 -->
                            <el-form-item label="打开时值" v-if="formData.type === 'switch'">
                                <el-input-number v-model="formData.activeValue"></el-input-number>
                            </el-form-item>
                            <el-form-item label="关闭时值" v-if="formData.type === 'switch'">
                                <el-input-number v-model="formData.inactiveValue"></el-input-number>
                            </el-form-item>
                            <!-- 流水号 -->
                            <el-form-item label="流水前缀" v-if="formData.type === 'bill'">
                                <el-input v-model="formData.prefix" placeholder="请输入流水前缀"></el-input>
                            </el-form-item>
                            <el-form-item label="流水日期" v-if="formData.type === 'bill'">
                                <el-select v-model="formData.format" placeholder="请选择流水日期">
                                    <el-option label="yyyyMMdd" value="yyyyMMdd"></el-option>
                                    <el-option label="yyyyMM" value="yyyyMM"></el-option>
                                    <el-option label="yyyy" value="yyyy"></el-option>
                                    <el-option label="no" value="no"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="流水位数" v-if="formData.type === 'bill'">
                                <el-input-number
                                    v-model="formData.digit"
                                    step-strictly
                                    :min="1"
                                    :max="8"
                                ></el-input-number>
                            </el-form-item>
                            <!-- 附件上传 -->
                            <el-form-item
                                label="最小值"
                                v-if="formData.type === 'picture' || formData.type === 'upload'"
                            >
                                <el-input-number
                                    v-model="formData.minValue"
                                    :min="0"
                                    :precision="0"
                                    :controls="false"
                                    placeholder="请输入大小最小值(单位:B)"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item
                                label="最大值"
                                v-if="formData.type === 'picture' || formData.type === 'upload'"
                            >
                                <el-input-number
                                    v-model="formData.maxValue"
                                    :min="0"
                                    :precision="0"
                                    :controls="false"
                                    placeholder="请输入大小最大值(单位:B)"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="宽度" v-if="formData.type === 'picture' || formData.type === 'upload'">
                                <el-input-number
                                    v-model="formData.width"
                                    :min="0"
                                    :precision="0"
                                    :controls="false"
                                    placeholder="请输入宽度"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="高度" v-if="formData.type === 'picture' || formData.type === 'upload'">
                                <el-input-number
                                    v-model="formData.height"
                                    :min="0"
                                    :precision="0"
                                    :controls="false"
                                    placeholder="请输入高度"
                                >
                                </el-input-number>
                            </el-form-item>
                            <!-- 省市区 -->
                            <el-form-item label="显示格式" v-if="formData.type === 'area'">
                                <el-select v-model="formData.format" @change="areaChange">
                                    <el-option label="省" :value="1"></el-option>
                                    <el-option label="省市" :value="2"></el-option>
                                    <el-option label="省市区" :value="3"></el-option>
                                    <el-option label="省市区-街道" :value="4"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="指定地区" v-if="formData.type === 'area' && formData.format != 1">
                                <el-cascader
                                    v-model="formData.appoint"
                                    clearable
                                    placeholder="请选择指定地区"
                                    :options="areaOptions"
                                    :props="{ checkStrictly: true, value: 'code', label: 'name' }"
                                    filterable
                                >
                                </el-cascader>
                            </el-form-item>
                            <el-form-item label="日期类型" v-if="formData.type === 'datePicker'">
                                <el-select v-model="formData.format" @change="formatChange">
                                    <el-option label="年" value="year|yyyy"></el-option>
                                    <el-option label="年-月" value="month|yyyy-MM"></el-option>
                                    <el-option label="年-月-日" value="date|yyyy-MM-dd"></el-option>
                                    <el-option label="年-月-日 时:分" value="datetime|yyyy-MM-dd HH:mm"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="默认当前" v-if="formData.type === 'datePicker'">
                                <el-switch v-model="formData.defaultsCurrent"></el-switch>
                            </el-form-item>
                            <el-form-item
                                label="默认值"
                                v-if="formData.type === 'datePicker' && !formData.defaultsCurrent"
                            >
                                <el-date-picker
                                    v-model="formData.defaultValue"
                                    :type="formData.format.split('|')[0]"
                                    :value-format="formData.format.split('|')[1]"
                                    placeholder="请选择默认值"
                                    clearable
                                    align="center"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item
                                label="默认显示"
                                v-if="formData.type === 'datePicker' && !formData.defaultsCurrent"
                            >
                                <el-date-picker
                                    v-model="formData.defaultShowValue"
                                    :type="formData.format.split('|')[0]"
                                    :value-format="formData.format.split('|')[1]"
                                    placeholder="请选择选择器默认值"
                                    clearable
                                    align="center"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <!-- 部门 -->
                            <el-form-item label="默认值" v-if="formData.type === 'department'">
                                <el-select v-model="formData.defaultValue" placeholder="请选择默认值" clearable>
                                    <el-option label="当前部门" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <!-- 成员 -->
                            <el-form-item label="默认值" v-if="formData.type === 'member'">
                                <el-select v-model="formData.defaultValue" placeholder="请选择默认值" clearable>
                                    <el-option label="当前用户" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                label="数据来源"
                                v-if="
                                    formData.type === 'radio' ||
                                        formData.type === 'checkbox' ||
                                        formData.type === 'select'
                                "
                            >
                                <el-select
                                    v-model="formData.source"
                                    filterable
                                    placeholder="请选择数据来源"
                                    @change="sourceChange($event, formData)"
                                >
                                    <el-option
                                        v-for="item in sourceOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="数据来源" v-if="formData.type === 'cascader'">
                                <el-select v-model="formData.source" filterable placeholder="请选择数据来源">
                                    <el-option
                                        v-for="item in metaFunctionOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.path"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <!-- 业务应用 -->
                            <el-form-item label="数据来源" v-if="formData.type === 'business'">
                                <el-select
                                    v-model="formData.source"
                                    filterable
                                    placeholder="请选择数据来源"
                                    @change="businessChange"
                                >
                                    <el-option
                                        v-for="item in businessOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="显示字段" v-if="formData.type === 'business'">
                                <el-select v-model="formData.showField" placeholder="请选择显示字段">
                                    <el-option
                                        v-for="(item, index) in showFieldOptions"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.prop"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否必填" v-if="formData.type != 'word'">
                                <el-switch v-model="formData.required"></el-switch>
                            </el-form-item>
                            <el-form-item
                                label="是否多选"
                                v-if="
                                    formData.type === 'select' ||
                                        formData.type === 'cascader' ||
                                        formData.type === 'picture' ||
                                        formData.type === 'upload' ||
                                        formData.type === 'department' ||
                                        formData.type === 'member' ||
                                        formData.type === 'business'
                                "
                            >
                                <el-switch
                                    v-model="formData.multiple"
                                    @change="multipleChange($event, formData)"
                                ></el-switch>
                            </el-form-item>
                            <el-form-item
                                label="是否只读"
                                v-if="
                                    formData.type === 'text' ||
                                        formData.type === 'textarea' ||
                                        formData.type === 'password' ||
                                        formData.type === 'select' ||
                                        formData.type === 'datePicker' ||
                                        formData.type === 'timePicker'
                                "
                            >
                                <el-switch v-model="formData.readonly"></el-switch>
                            </el-form-item>
                            <el-form-item label="是否禁用" v-if="formData.type != 'word'">
                                <el-switch v-model="formData.disabled"></el-switch>
                            </el-form-item>
                            <el-form-item label="是否正文" v-if="formData.type === 'editor'">
                                <el-switch v-model="formData.isText"></el-switch>
                            </el-form-item>
                            <!-- 计算公式 -->
                            <el-row v-if="formData.type === 'calculate'">
                                <el-button size="medium" @click="handleCalculate" style="width:100%"
                                    >设置计算公式</el-button
                                >
                            </el-row>
                            <!-- 表格 -->
                            <el-form-item label="是否合计" v-if="formData.type === 'table'">
                                <el-switch v-model="formData.showSummary"></el-switch>
                            </el-form-item>
                            <el-row v-if="formData.type === 'table'">
                                <el-button
                                    size="medium"
                                    style="width:100%;border-style:dashed;"
                                    @click="showTableSetting"
                                    >设置字段</el-button
                                >
                            </el-row>
                            <el-row
                                v-if="
                                    formData.type === 'switch' ||
                                        formData.type === 'radio' ||
                                        formData.type === 'checkbox' ||
                                        formData.type === 'select'
                                "
                            >
                                <el-button
                                    size="medium"
                                    style="width:100%;border-style:dashed;"
                                    @click="showLogicSetting"
                                    icon="el-icon-plus"
                                    >显隐规则</el-button
                                >
                            </el-row>
                            <el-row v-if="formData.type === 'business'">
                                <el-button
                                    size="medium"
                                    style="width:100%;border-style:dashed;"
                                    @click="handleSelectAssignment"
                                    icon="el-icon-plus"
                                    >表单赋值</el-button
                                >
                            </el-row>
                            <el-row v-if="formData.type === 'wps'">
                                <el-button
                                    type="primary"
                                    style="width:100%;border-style:dashed;"
                                    icon="el-icon-document"
                                    @click="handleRedFile"
                                    >套红文件</el-button
                                >
                            </el-row>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="表单属性" name="second">
                    <div class="el-scrollbar__view">
                        <el-form :model="form" label-width="80px" size="medium">
                            <el-form-item label="组件尺寸">
                                <el-radio-group v-model="form.size" size="small">
                                    <el-radio-button label="">默认</el-radio-button>
                                    <el-radio-button label="medium">中等</el-radio-button>
                                    <el-radio-button label="small">较小</el-radio-button>
                                    <el-radio-button label="mini">迷你</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="标签对齐">
                                <el-radio-group v-model="form.labelPosition" size="small">
                                    <el-radio-button label="left">左对齐</el-radio-button>
                                    <el-radio-button label="right">右对齐</el-radio-button>
                                    <el-radio-button label="top">顶部对齐</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="标签宽度">
                                <el-input-number
                                    v-model="form.labelWidth"
                                    step-strictly
                                    :min="60"
                                    :max="120"
                                ></el-input-number>
                            </el-form-item>
                            <el-form-item label="栅格间隔">
                                <el-input-number
                                    v-model="form.gutter"
                                    step-strictly
                                    :min="1"
                                    :max="30"
                                ></el-input-number>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <simplify-table ref="simplifyTable" v-if="formData.type === 'table'" :data="formData" />
        <simplify-logic
            ref="simplifyLogic"
            v-if="
                formData.type === 'switch' ||
                    formData.type === 'radio' ||
                    formData.type === 'checkbox' ||
                    formData.type === 'select'
            "
            :data="formData"
            :fieldOptions="fieldOptions"
        />
        <simplify-assignment ref="simplifyAssignment" :data="formData" v-if="formData.type === 'business'" />
        <simplify-calculate ref="simplifyCalculate" @calculateSubmit="calculateSubmit" />
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import editor from '@/views/components/quill/editor'
import simplifyTable from '@/views/simplify/simplify-table'
import simplifyLogic from '@/views/simplify/simplify-logic'
import simplifyAssignment from '@/views/simplify/simplify-assignment'
import simplifyCalculate from '@/views/components/form/calculate'
export default {
    components: {
        draggable,
        editor,
        simplifyTable,
        simplifyLogic,
        simplifyAssignment,
        simplifyCalculate
    },
    data() {
        return {
            action: this.$axios.defaults.baseURL + 'upload/putObject/oss',
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            basicLeftArray: [
                {
                    type: 'word',
                    label: '文字',
                    color: '#1f2f3d',
                    fontSize: '22px',
                    textAlign: 'left',
                    span: 24
                },
                {
                    type: 'text',
                    label: '单行文本',
                    required: true,
                    placeholder: '请输入单行文本',
                    readonly: false,
                    disabled: false,
                    span: 12,
                    labelWidth: 80
                },
                {
                    type: 'textarea',
                    label: '多行文本',
                    required: true,
                    placeholder: '请输入多行文本',
                    rows: 6,
                    readonly: false,
                    disabled: false,
                    span: 24,
                    labelWidth: 80
                },
                {
                    type: 'password',
                    label: '密码',
                    required: true,
                    placeholder: '请输入密码',
                    readonly: false,
                    disabled: false,
                    span: 12,
                    labelWidth: 80
                },
                {
                    type: 'number',
                    label: '数字',
                    required: true,
                    placeholder: '请输入数字',
                    disabled: false,
                    span: 12,
                    decimal: false,
                    precision: 2,
                    labelWidth: 80
                },
                {
                    type: 'radio',
                    label: '单选框',
                    required: true,
                    placeholder: '请选择单选框',
                    disabled: false,
                    span: 12,
                    labelWidth: 80,
                    options: [
                        { name: '选项一', code: '1' },
                        { name: '选项二', code: '2' }
                    ]
                },
                {
                    type: 'checkbox',
                    label: '多选框',
                    required: true,
                    placeholder: '请选择多选框',
                    disabled: false,
                    span: 12,
                    labelWidth: 80,
                    options: [
                        { name: '选项一', code: '1' },
                        { name: '选项二', code: '2' }
                    ]
                },
                {
                    type: 'select',
                    label: '下拉选择',
                    required: true,
                    placeholder: '请选择下拉选择',
                    disabled: false,
                    multiple: false,
                    span: 12,
                    labelWidth: 80
                },
                {
                    type: 'cascader',
                    label: '级联选择',
                    required: true,
                    placeholder: '请选择下拉选择',
                    disabled: false,
                    multiple: false,
                    span: 12,
                    labelWidth: 80
                },
                {
                    type: 'switch',
                    label: '开关',
                    required: true,
                    placeholder: '请选择开关',
                    disabled: false,
                    span: 12,
                    labelWidth: 80,
                    inactiveValue: 0,
                    activeValue: 1
                },
                {
                    type: 'datePicker',
                    label: '日期选择',
                    required: true,
                    placeholder: '请选择日期',
                    readonly: false,
                    disabled: false,
                    span: 12,
                    format: 'date|yyyy-MM-dd',
                    dateType: 'date',
                    valueFormat: 'yyyy-MM-dd',
                    labelWidth: 80
                },
                {
                    type: 'timePicker',
                    label: '时间选择',
                    required: true,
                    placeholder: '请选择时间',
                    readonly: false,
                    disabled: false,
                    span: 12,
                    labelWidth: 80
                },
                {
                    type: 'dateRangePicker',
                    label: '日期范围',
                    required: true,
                    placeholder: '请选择日期范围',
                    readonly: false,
                    disabled: false,
                    span: 12,
                    labelWidth: 80
                },
                {
                    type: 'timeRangePicker',
                    label: '时间范围',
                    required: true,
                    placeholder: '请选择时间范围',
                    readonly: false,
                    disabled: false,
                    span: 12,
                    labelWidth: 80
                },
                {
                    type: 'picture',
                    label: '图片上传',
                    required: true,
                    placeholder: '请上传附件',
                    span: 24,
                    multiple: true,
                    labelWidth: 80
                },
                {
                    type: 'upload',
                    label: '附件上传',
                    required: true,
                    placeholder: '请上传附件',
                    span: 24,
                    multiple: true,
                    labelWidth: 80
                },
                {
                    type: 'editor',
                    label: '富文本',
                    required: true,
                    placeholder: '请输入富文本',
                    span: 24,
                    disabled: false,
                    isText: false,
                    height: 280,
                    labelWidth: 80
                },
                {
                    type: 'area',
                    label: '省市区',
                    required: true,
                    placeholder: '请选择省市区',
                    disabled: false,
                    span: 12,
                    labelWidth: 80
                }
            ],
            seniorLeftArray: [
                {
                    type: 'bill',
                    label: '流水号',
                    required: true,
                    placeholder: '请输入流水号',
                    disabled: true,
                    span: 12,
                    digit: 4,
                    format: 'yyyyMMdd',
                    prefix: 'BH',
                    labelWidth: 80
                },
                {
                    type: 'calculate',
                    label: '公式',
                    required: true,
                    placeholder: '请输入公式',
                    disabled: true,
                    span: 12,
                    labelWidth: 80
                },
                {
                    type: 'department',
                    label: '部门',
                    required: true,
                    placeholder: '请选择部门',
                    disabled: false,
                    multiple: false,
                    span: 12,
                    labelWidth: 80
                },
                {
                    type: 'member',
                    label: '成员',
                    placeholder: '请选择成员',
                    required: true,
                    disabled: false,
                    multiple: false,
                    span: 12,
                    labelWidth: 80
                }
            ],
            layoutLeftArray: [
                {
                    type: 'tabs',
                    label: '标签页',
                    span: 24,
                    columns: [
                        {
                            label: '选项1',
                            list: []
                        },
                        {
                            label: '选项1',
                            list: []
                        }
                    ]
                },
                {
                    type: 'card',
                    label: '卡片',
                    span: 24,
                    list: []
                }
            ],
            centerArray: [],
            formModel: {},
            activeIndex: -1,
            activeName: 'first',
            formData: {},
            form: {
                size: '',
                labelPosition: 'right',
                labelWidth: 80,
                gutter: 15
            },
            sourceOptions: [],
            areaOptions: [],
            fieldOptions: [],
            tableOptions: [],
            businessOptions: [],
            showFieldOptions: [],
            rules: {},
            metaFunctionOptions: []
        }
    },
    created() {
        this.queryById()
        this.queryBusinessField()
        this.queryDicClassify()
        this.queryBusinessData()
        this.queryMetaFunction()
    },
    watch: {
        centerArray: {
            handler(newVal) {
                this.generateRules()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async queryById() {
            const res = await this.$axios.get('jellyForm/queryById/' + this.$route.query.id)
            if (res.data.code === 200) {
                if (res.data.data.design) {
                    this.form = JSON.parse(res.data.data.design)
                    this.centerArray = this.form.fieldOptions
                    for (let i = 0; i < this.centerArray.length; i++) {
                        let item = this.centerArray[i]
                        if (!item.labelWidth) {
                            item.labelWidth = 80
                        }
                        if (item.type === 'picture' || item.type === 'upload' || item.type === 'table') {
                            this.$set(this.formModel, item.field, [])
                        } else if (item.type === 'radio') {
                            this.queryDicDetail(item.source, item.field)
                        } else if (item.type === 'checkbox') {
                            this.$set(this.formModel, item.field, [])
                            this.queryDicDetail(item.source, item.field)
                        } else if (item.type === 'select') {
                            if (item.multiple) {
                                this.$set(this.formModel, item.field, [])
                            }
                            this.queryDicDetail(item.source, item.field)
                        }
                    }
                }
            }
        },
        async queryMetaFunction() {
            let res = await this.$axios.get('metaFunction/queryByCompanyId')
            if (res.data.code === 200) {
                this.metaFunctionOptions = res.data.data
            }
        },
        async queryBusinessData() {
            let res = await this.$axios.get('jellyForm/queryByCompanyId')
            if (res.data.code === 200) {
                this.businessOptions = res.data.data
            }
        },
        async queryBusinessField() {
            let res = await this.$axios.get('jellyForm/queryBusinessField/' + this.$route.query.id)
            if (res.data.code === 200) {
                this.fieldOptions = res.data.data
            }
        },
        async queryDicClassify() {
            let res = await this.$axios.get('dictionaryClassify/queryDisplay')
            if (res.data.code === 200) {
                this.sourceOptions = res.data.data
            }
        },
        async queryDicDetail(classifyId, field) {
            let res = await this.$axios.get('dictionaryDetail/queryDisplay?classifyId=' + classifyId)
            if (res.data.code === 200) {
                for (let i = 0; i < this.centerArray.length; i++) {
                    if (this.centerArray[i].field === field) {
                        let item = this.centerArray[i]
                        item.options = res.data.data
                        this.$set(this.centerArray, i, item)
                        break
                    }
                }
            }
        },
        async handleRelationTypeChange(value) {
            let res = await this.$axios.get('jellyForm/queryById/' + value)
            if (res.data.code === 200) {
                this.showFieldOptions = JSON.parse(res.data.data.tableHeaderJson)
            }
        },
        handleAddFormItem(element) {
            let item = JSON.parse(JSON.stringify(element))
            if (item.type === 'checkbox') {
                this.$set(this.formModel, item.field, [])
            } else if (item.type === 'number') {
                this.$set(this.formModel, item.field, undefined)
            } else if (item.type === 'picture' || item.type === 'upload') {
                this.$set(this.formModel, item.field, [])
            } else if (item.type === 'table') {
                this.$set(this.formModel, item.field, [])
            } else if (item.type === 'editor') {
            } else {
                this.$set(this.formModel, item.field, '')
            }
            this.centerArray.push(item)
            this.activeIndex = this.centerArray.length - 1
            this.formData = this.centerArray[this.activeIndex]
        },
        handleItemCopy(index) {
            this.centerArray.push(this.centerArray[index])
            this.activeIndex = this.centerArray.length - 1
            this.formData = this.centerArray[this.activeIndex]
        },
        handleItemDelete(index) {
            this.centerArray.splice(index, 1)
            this.activeIndex = this.centerArray.length - 1
            if (this.activeIndex != -1) {
                this.formData = this.centerArray[this.activeIndex]
            } else {
                this.formData = {}
            }
        },
        handleElement(index) {
            this.activeIndex = index
            this.formData = this.centerArray[this.activeIndex]
        },
        sourceChange(value, formData) {
            this.queryDicDetail(value, formData.field)
        },
        businessChange(value) {
            this.handleRelationTypeChange(value)
        },
        areaChange(value) {},
        fieldChange(value, obj) {
            if (obj.type === 'checkbox') {
                this.$set(this.formModel, obj.field, [])
            } else if (obj.type === 'number') {
                this.$set(this.formModel, obj.field, undefined)
            } else if (obj.type === 'select') {
                if (obj.multiple) {
                    this.$set(this.formModel, obj.field, [])
                    this.$set(this.formModel, obj.defaultValue, [])
                } else {
                    this.$set(this.formModel, obj.field, '')
                    this.$set(this.formModel, obj.defaultValue, '')
                }
                for (let i = 0; i < this.centerArray.length; i++) {
                    let item = this.centerArray[i]
                    if (item.field === obj.field) {
                        if (item.multiple) {
                            item.defaultValue = []
                        } else {
                            item.defaultValue = ''
                        }
                        this.$set(this.centerArray, i, item)
                        break
                    }
                }
            } else {
                this.$set(this.formModel, obj.field, '')
            }
        },
        multipleChange(value, obj) {
            if (obj.multiple) {
                this.$set(this.formModel, obj.field, [])
                this.$set(this.formModel, obj.defaultValue, [])
            } else {
                this.$set(this.formModel, obj.field, '')
                this.$set(this.formModel, obj.defaultValue, '')
            }
            for (let i = 0; i < this.centerArray.length; i++) {
                let item = this.centerArray[i]
                if (item.field === obj.field) {
                    if (item.multiple) {
                        item.defaultValue = []
                    } else {
                        item.defaultValue = ''
                    }
                    this.$set(this.centerArray, i, item)
                    break
                }
            }
        },
        formatChange(value) {
            let item = this.centerArray[this.activeIndex]
            if (value) {
                item.dateType = value.split('|')[0]
                item.valueFormat = value.split('|')[1]
            } else {
                item.dateType = 'date'
                item.valueFormat = 'yyyy-MM-dd'
            }
            this.$set(this.centerArray, this.activeIndex, item)
        },
        generateRules() {
            let rules = {}
            for (let i = 0; i < this.centerArray.length; i++) {
                let item = this.centerArray[i]
                if (
                    item.type === 'text' ||
                    item.type === 'textarea' ||
                    item.type === 'password' ||
                    item.type === 'number' ||
                    item.type === 'radio' ||
                    item.type === 'checkbox' ||
                    item.type === 'editor' ||
                    item.type === 'bill' ||
                    item.type === 'calculate'
                ) {
                    if (item.required) {
                        rules[item.field] = [{ required: true, message: item.placeholder, trigger: 'blur' }]
                    }
                } else if (
                    item.type === 'select' ||
                    item.type === 'datePicker' ||
                    item.type === 'timePicker' ||
                    item.type === 'dateRangePicker' ||
                    item.type === 'timeRangePicker' ||
                    item.type === 'department' ||
                    item.type === 'member' ||
                    item.type === 'business' ||
                    item.type === 'cascader'
                ) {
                    if (item.required) {
                        rules[item.field] = [{ required: true, message: item.placeholder, trigger: 'change' }]
                    }
                } else if (item.type === 'area' || item.type === 'picture' || item.type === 'upload') {
                    if (item.required) {
                        rules[item.field] = [{ type: 'array', required: true, message: item.placeholder }]
                    }
                }
            }
            this.rules = rules
        },
        showTableSetting() {
            if (!this.formData.field) {
                this.$message.error(this.formData.label + '表不能为空')
                return
            }
            this.$refs.simplifyTable.showDialog()
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
            for (var i = 0; i < obj.values.length; i++) {
                item[obj.values[i].field] = ''
            }
            this.formModel[obj.field].splice(index + 1, 0, item)
        },
        //表格删除
        handleTableDel(index, obj) {
            this.formModel[obj.field].splice(index, 1)
            // for (let i = 0; i < obj.values.length; i++) {
            // 	let item = obj.values[i]
            // 	this.handleTableChange(obj.field, item.filed, item)
            // }
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
        // 显隐规则设置
        showLogicSetting() {
            if (this.formData.type === 'switch') {
                this.$set(this.formData, 'options', [
                    { code: this.formData.activeValue, name: '打开' },
                    { code: this.formData.inactiveValue, name: '关闭' }
                ])
            } else {
                if (!this.formData.source) {
                    this.$message.error(this.formData.label + '数据来源不能为空')
                    return
                }
            }
            this.$refs.simplifyLogic.showDialog()
        },
        handleSave() {
            for (let i = 0; i < this.centerArray.length; i++) {
                let item = this.centerArray[i]
                if (item.type != 'word') {
                    if (!item.label) {
                        this.$message.error('请输入标题')
                        return
                    }
                    if (!item.placeholder) {
                        this.$message.error('请输入占位提示')
                        return
                    }
                    if (item.type === 'table') {
                        if (!item.field) {
                            this.$message.error(item.label + '表不能为空')
                            return
                        }
                        if (item.values.length === 0) {
                            this.$message.error(item.label + '表格字段不能为空')
                            return
                        }
                    } else {
                        if (!item.field) {
                            this.$message.error(item.label + '字段不能为空')
                            return
                        }
                    }
                    if (
                        item.type === 'radio' ||
                        item.type === 'checkbox' ||
                        item.type === 'select' ||
                        item.type === 'cascader'
                    ) {
                        if (!item.source) {
                            this.$message.error(item.label + '数据来源不能为空')
                            return
                        }
                    } else if (item.type === 'area') {
                        if (!item.format) {
                            this.$message.error(item.label + '显示格式不能为空')
                            return
                        }
                    } else if (item.type === 'business') {
                        if (!item.source) {
                            this.$message.error(item.label + '数据来源不能为空')
                            return
                        }
                        if (!item.showField) {
                            this.$message.error(item.label + '显示字段不能为空')
                            return
                        }
                    } else if (item.type === 'calculate') {
                        if (!item.calculate) {
                            this.$message.error(item.label + '中计算公式不能为空')
                            return
                        }
                    }
                }
            }
            this.form.fieldOptions = this.centerArray
            var params = {
                id: this.$route.query.id,
                design: JSON.stringify(this.form)
            }
            this.$axios.post('jellyForm/update', params).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('保存成功')
                }
            })
        },
        handlePreview() {},
        handleEmpty() {
            this.$confirm('确定要清空所有组件吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.centerArray = []
                this.formData = {}
            })
        },
        handleBack() {
            this.$router.go(-1)
        },
        handleSelectAssignment() {
            if (this.formData.source) {
                if (this.formData.showField) {
                    this.$refs.simplifyAssignment.showDialog(this.formData)
                } else {
                    this.$message.error('显示字段不能为空')
                }
            } else {
                this.$message.error('数据来源不能为空')
            }
        },
        handleCalculate() {
            this.$refs.simplifyCalculate.showDialog('calculate', this.formData.calculate)
        },
        calculateSubmit(type, data) {
            console.log(data)
            if (type === 'calculate') {
                this.formData.calculate = data
            } else if (type === 'rule') {
                // this.formData.rules.splice(this.ruleIndex, 1, {
                // 	type: 'eval',
                // 	expression: data,
                // 	message: this.form.rules[this.ruleIndex].message
                // })
            }
        },
        handleRedFile() {
            // 单线程
            WpsInvoke.RegWebNotify(WpsInvoke.ClientType.wps, 'WpsAssist', messageText => {
                var result = JSON.parse(messageText)
                if (result.type === 'save') {
                    this.$set(this.formData, result.field, result.value)
                }
            })
            var invokeParam = {}
            if (this.formData.redHeadUrl) {
                invokeParam = {
                    type: 'openFile',
                    apiUrl: window.platform.url,
                    companyId: localStorage.getItem('companyId'),
                    field: 'redHeadUrl',
                    fileUrl: this.formData.redHeadUrl
                }
            } else {
                invokeParam = {
                    type: 'newDocument',
                    apiUrl: window.platform.url,
                    companyId: localStorage.getItem('companyId'),
                    field: 'redHeadUrl'
                }
            }
            if (window.location.protocol === 'http:') {
                // 单线程
                WpsInvoke.InvokeAsHttp(
                    WpsInvoke.ClientType.wps,
                    'WpsAssist',
                    'InvokeFromSystem',
                    JSON.stringify(invokeParam),
                    result => {
                        // 调用回调，status为0为成功，其他是错误
                        if (result.status !== 0) {
                            console.log(result)
                        }
                    }
                )
            } else {
                // 单线程
                WpsInvoke.InvokeAsHttps(
                    WpsInvoke.ClientType.wps,
                    'WpsAssist',
                    'InvokeFromSystem',
                    JSON.stringify(invokeParam),
                    result => {
                        // 调用回调，status为0为成功，其他是错误
                        if (result.status !== 0) {
                            console.log(result)
                        }
                    }
                )
            }
        }
    }
}
</script>

<style scoped>
::v-deep .is-without-controls .el-input .el-input__inner {
    text-align: left;
}
::v-deep .el-radio {
    line-height: 40px;
}
.left-board {
    width: 260px;
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
}
.logo-wrapper {
    position: relative;
    height: 42px;
    background: #fff;
    border-bottom: 1px solid #f1e8e8;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.logo {
    position: absolute;
    left: 12px;
    top: 6px;
    line-height: 30px;
    color: #409eff;
    font-weight: 600;
    font-size: 17px;
    white-space: nowrap;
}
.logo > img {
    width: 30px;
    height: 30px;
    vertical-align: top;
}
.logo .github {
    display: inline-block;
    vertical-align: sub;
    margin-left: 15px;
}
.components-list {
    padding: 8px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%;
}
.components-title {
    font-size: 14px;
    color: #222;
    margin: 6px 2px;
}
.components-draggable {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0px 3px;
}
.components-item {
    width: 46%;
    margin: 10px 2% 0px 2%;
    padding: 8px 10px;
    background: #f6f7ff;
    font-size: 12px;
    cursor: move;
    border: 1px dashed #f6f7ff;
    border-radius: 3px;
    box-sizing: border-box;
    text-align: center;
}
.components-item:hover {
    border: 1px dashed #409eff;
}
.center-board {
    height: 100vh;
    width: auto;
    margin: 0 350px 0 260px;
}
.action-bar {
    position: relative;
    height: 42px;
    text-align: right;
    padding: 0 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #f1e8e8;
    border-top: none;
    border-left: none;
}
.action-bar .delete-btn {
    color: #f56c6c;
}
.center-board,
.center-scrollbar {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.center-scrollbar {
    border-left: 1px solid #f1e8e8;
    border-right: 1px solid #f1e8e8;
}
.center-scrollbar,
.left-scrollbar {
    height: calc(100vh - 42px);
    overflow: auto;
}
.center-board-row {
    padding: 12px 12px 15px 12px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.right-board {
    width: 350px;
    position: absolute;
    right: 0;
    top: 0;
    padding-top: 3px;
}
.drawing-item {
    position: relative;
    cursor: move;
    border-radius: 6px;
}
.drawing-item:hover {
    background: #f6f7ff;
}
.active-from-item {
    background: #f6f7ff;
}
.drawing-item .el-form-item {
    padding: 12px 10px;
}
.drawing-item-copy {
    right: 56px;
    border-color: #409eff;
    color: #409eff;
    background: #fff;
    position: absolute;
    top: -10px;
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    border-radius: 50%;
    font-size: 12px;
    border: 1px solid;
    cursor: pointer;
    z-index: 2000;
}
.drawing-item-delete {
    right: 24px;
    border-color: #f56c6c;
    color: #f56c6c;
    background: #fff;
    position: absolute;
    top: -10px;
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    border-radius: 50%;
    font-size: 12px;
    border: 1px solid;
    cursor: pointer;
    z-index: 2000;
}
::v-deep .el-tabs__nav {
    width: 100%;
}
::v-deep .el-tabs__item {
    width: 50%;
    text-align: center;
}
.el-scrollbar__view {
    padding: 12px 18px 15px 15px;
    overflow: auto;
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
    color: #c0c4cc;
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
    right: 20px;
    transform: translateY(-50%);
    color: #c0c4cc;
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
</style>
