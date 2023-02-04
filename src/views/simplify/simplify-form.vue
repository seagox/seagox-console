<template>
    <div class="container">
        <el-row :gutter="formModelConfig.gutter">
            <el-form
                :model="formModel"
                :label-position="formModelConfig.labelPosition"
                :label-width="formModelConfig.labelWidth + 'px'"
                :size="formModelConfig.size"
                :rules="rules"
                ref="form"
            >
                <el-col :span="element.span" v-for="(element, index) in formModelConfig.fieldOptions" :key="index">
                    <div
                        v-if="element.type === 'word'"
                        :style="{
                            color: element.color,
                            'font-size': element.fontSize,
                            padding: '20px',
                            'text-align': element.textAlign
                        }"
                    >
                        {{ element.label }}
                    </div>
                    <div class="textType" v-if="element.type === 'wps'">
                        <el-button type="primary" icon="el-icon-document" @click="handleWps(element)">{{
                            element.label
                        }}</el-button>
                    </div>
                    <div class="textType" v-if="element.type === 'et'">
                        <el-button type="primary" icon="el-icon-document" @click="handleEt(element)">{{
                            element.label
                        }}</el-button>
                    </div>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'text'"
                    >
                        <el-input
                            v-model="formModel[element.field]"
                            :placeholder="element.disabled ? '' : element.placeholder"
                            clearable
                            :readonly="element.readonly"
                            :disabled="element.disabled"
                            :maxlength="element.maxlength"
                            show-word-limit
                            @input="inputChange(element.field)"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'textarea'"
                    >
                        <el-input
                            type="textarea"
                            v-model="formModel[element.field]"
                            :placeholder="element.disabled ? '' : element.placeholder"
                            clearable
                            :readonly="element.readonly"
                            :disabled="element.disabled"
                            :maxlength="element.maxlength"
                            show-word-limit
                            :rows="element.rows"
                            @input="inputChange(element.field)"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'password'"
                    >
                        <el-input
                            v-model="formModel[element.field + '_plaintext']"
                            :placeholder="element.disabled ? '' : element.placeholder"
                            clearable
                            :readonly="element.readonly"
                            :disabled="element.disabled"
                            show-password
                            @change="passwordChange($event, element)"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'number'"
                    >
                        <el-input-number
                            v-model="formModel[element.field]"
                            clearable
                            :placeholder="element.disabled ? '' : element.placeholder"
                            :disabled="element.disabled"
                            :controls="false"
                            @mousewheel.native.prevent
                            :precision="element.decimal ? element.precision : 0"
                            @change="inputChange(element.field)"
                        ></el-input-number>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'radio'"
                    >
                        <el-radio-group v-model="formModel[element.field]" :disabled="element.disabled">
                            <el-radio
                                v-for="item in element.options"
                                :key="item.code"
                                :label="item.code"
                                :disabled="item.status == 0"
                            >
                                {{ item.name }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'checkbox'"
                    >
                        <el-checkbox-group v-model="formModel[element.field]" :disabled="element.disabled">
                            <el-checkbox
                                v-for="item in element.options"
                                :key="item.code"
                                :label="item.code"
                                :disabled="item.status == 0"
                            >
                                {{ item.name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'select'"
                    >
                        <el-select
                            v-model="formModel[element.field]"
                            filterable
                            :placeholder="element.disabled ? '' : element.placeholder"
                            :disabled="element.disabled"
                            clearable
                            :multiple="element.multiple"
                            @change="handleChangeRule(element)"
                        >
                            <el-option
                                v-for="item in element.options"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                                :disabled="item.status == 0"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'cascader'"
                    >
                        <el-cascader
                            v-model="formModel[element.field]"
                            :options="element.options"
                            :props="{ checkStrictly: true, emitPath: false, multiple: element.multiple }"
                            :disabled="element.disabled"
                            :placeholder="element.disabled ? '' : element.placeholder"
                            filterable
                            clearable
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'switch'"
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
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'datePicker'"
                    >
                        <el-date-picker
                            v-model="formModel[element.field]"
                            :type="element.dateType"
                            :value-format="element.valueFormat"
                            :placeholder="element.disabled ? '' : element.placeholder"
                            :disabled="element.disabled"
                            clearable
                            :readonly="element.readonly"
                            :default-value="element.defaultShowValue"
                            align="center"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'timePicker'"
                    >
                        <el-time-select
                            v-model="formModel[element.field]"
                            :placeholder="element.disabled ? '' : element.placeholder"
                            :disabled="element.disabled"
                            clearable
                            :readonly="element.readonly"
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
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'dateRangePicker'"
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
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'timeRangePicker'"
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
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'editor'"
                    >
                        <editor
                            v-if="!textModel.type || textModel.type === 'text'"
                            :ref="element.field"
                            :id="element.field + Date.now()"
                            v-model="formModel[element.field]"
                            :placeholder="element.disabled ? '' : element.placeholder"
                            :enable="!element.disabled"
                            :height="element.height"
                        >
                        </editor>
                        <div class="textType" v-if="textModel.type === 'word'">
                            <el-button type="primary" icon="el-icon-document" @click="handleTextWps(element)"
                                >打开Word</el-button
                            >
                        </div>
                        <div class="textType" v-if="textModel.type === 'excel'">
                            <el-button type="primary" icon="el-icon-document" @click="handleTextEt(element)"
                                >打开Excel</el-button
                            >
                        </div>
                        <div class="textType" v-if="textModel.type === 'pdf'">
                            <el-upload
                                v-if="!element.disabled"
                                :ref="element.field"
                                :action="action"
                                :headers="headers"
                                :limit="1"
                                :show-file-list="false"
                                :before-upload="
                                    file => {
                                        return beforeTextFileUpload(file, element)
                                    }
                                "
                                :on-success="
                                    (res, file, fileList) => {
                                        return handleTextFileSuccess(res, file, fileList, element)
                                    }
                                "
                            >
                                <el-button type="primary" icon="el-icon-document">上传Pdf</el-button>
                            </el-upload>
                            <el-button
                                v-if="formModel[element.field] && formModel[element.field].url"
                                type="primary"
                                icon="el-icon-view"
                                style="margin-left:15px"
                                @click="handlePdfPreview(element)"
                                >预览Pdf</el-button
                            >
                        </div>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'area'"
                    >
                        <el-cascader
                            v-model="formModel[element.field]"
                            clearable
                            :placeholder="element.disabled ? '' : element.placeholder"
                            :disabled="element.disabled"
                            :options="element.options"
                            :props="{ value: 'code', label: 'name' }"
                            filterable
                        >
                        </el-cascader>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'bill'"
                    >
                        <el-input
                            v-model="formModel[element.field]"
                            :placeholder="element.disabled ? '' : element.placeholder"
                            clearable
                            :readonly="element.readonly"
                            :disabled="element.disabled"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'calculate'"
                    >
                        <el-input
                            v-model="formModel[element.field]"
                            :placeholder="element.disabled ? '' : element.placeholder"
                            clearable
                            :readonly="element.readonly"
                            :disabled="element.disabled"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'picture'"
                    >
                        <el-upload
                            v-if="!element.multiple"
                            :ref="element.field"
                            :action="action"
                            :headers="headers"
                            :file-list="formModel[element.field]"
                            :disabled="element.disabled"
                            :limit="1"
                            :class="
                                element.disabled
                                    ? 'upload-disabled'
                                    : formModel[element.field].length === 1
                                    ? 'upload-disabled'
                                    : ''
                            "
                            :before-upload="
                                file => {
                                    return beforeFileUpload(file, element)
                                }
                            "
                            list-type="picture-card"
                            :on-success="
                                (res, file, fileList) => {
                                    return handleFileSuccess(res, file, fileList, element)
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
                                    style="width: 148px; height: 148px"
                                />
                                <span class="el-upload-list__item-actions">
                                    <span
                                        class="el-upload-list__item-preview"
                                        @click="handleFilePreview(file, element.field)"
                                    >
                                        <i class="el-icon-view"></i>
                                    </span>
                                    <span class="el-upload-list__item-delete" @click="handleFileDownload(file)">
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
                        <el-upload
                            v-else
                            :ref="element.field"
                            :action="action"
                            :headers="headers"
                            :file-list="formModel[element.field]"
                            :disabled="element.disabled"
                            multiple
                            :class="element.disabled ? 'upload-disabled' : ''"
                            :before-upload="
                                file => {
                                    return beforeFileUpload(file, element)
                                }
                            "
                            list-type="picture-card"
                            :on-success="
                                (res, file, fileList) => {
                                    return handleFileSuccess(res, file, fileList, element)
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
                                    style="width: 148px; height: 148px"
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
                                <img class="el-upload-list__item-thumbnail" src="@/assets/fileType/other.svg" v-else />
                                <span class="el-upload-list__item-actions">
                                    <span
                                        class="el-upload-list__item-preview"
                                        @click="handleFilePreview(file, element.field)"
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
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'upload'"
                    >
                        <el-upload
                            :ref="element.field"
                            :action="action"
                            :headers="headers"
                            multiple
                            :show-file-list="false"
                            v-if="!element.disabled"
                            :file-list="formModel[element.field]"
                            :before-upload="
                                file => {
                                    return beforeFileUpload(file, element)
                                }
                            "
                            :on-success="
                                (res, file, fileList) => {
                                    return handleFileSuccess(res, file, fileList, element)
                                }
                            "
                        >
                            <el-button type="primary" icon="el-icon-upload"> 上传</el-button>
                        </el-upload>
                        <el-table
                            :data="formModel[element.field]"
                            max-height="300"
                            border
                            stripe
                            style="margin-top: 15px"
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
                                        style="font-size: 16px"
                                        v-if="
                                            scope.row.type === 'image' ||
                                                scope.row.type === 'tiff' ||
                                                scope.row.type === 'pdf' ||
                                                scope.row.type === 'word' ||
                                                scope.row.type === 'excel' ||
                                                scope.row.type === 'ppt' ||
                                                scope.row.type === 'txt' ||
                                                scope.row.type === 'ofd' ||
                                                scope.row.type === 'rtf'
                                        "
                                        @click="handleFilePreview(scope.row, element.field)"
                                    ></i>
                                    <i
                                        class="el-icon-download"
                                        style="font-size: 16px; margin-left: 10px; margin-right: 10px"
                                        @click="handleFileDownload(scope.row)"
                                    ></i>
                                    <i
                                        class="el-icon-delete"
                                        style="font-size: 16px"
                                        v-if="!element.disabled"
                                        @click="handleFileRemove(scope.row, element.field)"
                                    ></i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'department'"
                        class="inside-input"
                    >
                        <el-select
                            v-model="formModel[element.field]"
                            :placeholder="element.disabled ? '' : element.placeholder"
                            clearable
                            filterable
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
                            v-show="!element.disabled"
                            @click="handleDeptDynamicDialog(element)"
                        ></i>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'member'"
                        class="inside-input"
                    >
                        <el-select
                            v-model="formModel[element.field]"
                            :placeholder="element.disabled ? '' : element.placeholder"
                            clearable
                            filterable
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
                            v-show="!element.disabled"
                            @click="handleMemberDynamicDialog(element)"
                        ></i>
                    </el-form-item>
                    <el-form-item
                        :label="element.label"
                        :label-width="
                            element.labelWidth ? element.labelWidth + 'px' : formModelConfig.labelWidth + 'px'
                        "
                        :prop="element.field"
                        v-if="!element.hidden && element.type === 'business'"
                    >
                        <el-select
                            :ref="element.field"
                            v-model="formModel[element.field]"
                            :placeholder="element.disabled ? '' : element.placeholder"
                            clearable
                            :multiple="element.multiple"
                            :disabled="element.disabled"
                            @focus="handleBusinessDialog(element)"
                        >
                            <el-option
                                v-for="item in element.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <div :label="element.label" v-if="!element.hidden && element.type === 'table'">
                        <el-table
                            :data="formModel[element.field]"
                            border
                            highlight-current-row
                            stripe
                            max-height="210"
                            :show-summary="element.showSummary"
                            :summary-method="
                                ({ columns, data }) => getSummaries({ columns, data }, element.summaryArray)
                            "
                        >
                            <el-table-column
                                :prop="item.field"
                                :label="item.title"
                                v-for="(item, index) in element.values"
                                :key="index"
                                align="center"
                                :render-header="(h, { column, $index }) => renderHeader(h, { column, $index }, item)"
                            >
                                <template slot-scope="scope">
                                    <div v-if="item.type === 'input'">
                                        <el-input v-model="scope.row[item.field]" :disabled="element.disabled">
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
                                            v-html="$options.filters.numberFormat(scope.row[item.field])"
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
                                        {{ calculationFormat(scope, item.field, item.calculation, element.field) }}
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
                                                handleTableDialog(scope.$index, element.field + '.' + item.field, item)
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
                                                handleTableDialog(scope.$index, element.field + '.' + item.field, item)
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
                                                handleTableDialog(scope.$index, element.field + '.' + item.field, item)
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
                            <div slot="empty" @click="handleTableAdd(0, element)" v-if="!element.disabled">
                                暂无数据 <i class="el-icon-circle-plus-outline"></i>
                            </div>
                        </el-table>
                    </div>
                </el-col>
            </el-form>
        </el-row>
        <el-image-viewer
            v-if="previewDialogVisible"
            :on-close="closeViewer"
            :zIndex="9999"
            :url-list="previewSrcList"
        />
        <simplify-business ref="simplifyBusiness" @confirm="businessConfirm" />
        <excel-dept ref="excelDept" @confirm="deptConfirm" />
        <excel-multiple-dept ref="excelMultipleDept" @confirm="deptConfirm" />
        <excel-member ref="excelMember" @confirm="memberConfirm" />
        <excel-multiple-member ref="excelMultipleMember" @confirm="memberConfirm" />
    </div>
</template>

<script>
import excelDept from '@/views/components/form/dept'
import excelMultipleDept from '@/views/components/form/multiple-dept'
import excelMember from '@/views/components/form/member'
import excelMultipleMember from '@/views/components/form/multiple-member'
import editor from '@/views/components/quill/editor'
import { Image } from 'element-ui'
import simplifyBusiness from '@/views/simplify/simplify-business'
import md5 from 'md5'
import { handleFormula } from '@/utils/formula.js'
export default {
    components: {
        excelDept,
        excelMultipleDept,
        excelMember,
        excelMultipleMember,
        editor,
        ElImageViewer: Image.components.ImageViewer,
        simplifyBusiness
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
        textModel: {
            type: Object,
            default: () => {}
        },
        disabledField: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            headers: {
                Authorization: window.localStorage.getItem('Authorization')
            },
            rules: {},
            formModelConfig: {},
            previewDialogVisible: false,
            previewSrcList: [],
            tableKey: Math.random()
        }
    },
    watch: {
        formCofig: {
            handler(newVal) {
                this.loadView()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        loadView() {
            this.formModelConfig = JSON.parse(JSON.stringify(this.formCofig))
            for (let i = 0; i < this.formModelConfig.fieldOptions.length; i++) {
                let item = this.formModelConfig.fieldOptions[i]
                item.index = i

                if (item.type != 'word') {
                    if (this.disabled.indexOf(item.field.split('|')[0] + '.' + item.field.split('|')[1]) > -1) {
                        item.disabled = true
                        item.readonly = false
                    }
                    if (this.editable.indexOf(item.field.split('|')[0] + '.' + item.field.split('|')[1]) > -1) {
                        item.disabled = false
                        item.readonly = false
                    }
                    this.$set(this.property, item.field, item)
                }
                if (item.type === 'text' || item.type === 'textarea') {
                    if (!this.formModel[item.field]) {
                        if (item.defaultValue) {
                            this.$set(this.formModel, item.field, item.defaultValue)
                        } else {
                            this.$set(this.formModel, item.field, '')
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'blur' }
                        ])
                    }
                } else if (item.type === 'password') {
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'blur' }
                        ])
                    }
                } else if (item.type === 'number') {
                    if (!this.formModel[item.field]) {
                        if (item.defaultValue) {
                            this.$set(this.formModel, item.field, item.defaultValue)
                        } else {
                            if (item.defaultValue === 0) {
                                this.$set(this.formModel, item.field, 0)
                            } else {
                                this.$set(this.formModel, item.field, undefined)
                            }
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'blur' }
                        ])
                    }
                } else if (item.type === 'radio') {
                    if (!this.formModel[item.field]) {
                        if (item.defaultValue) {
                            this.$set(this.formModel, item.field, String(item.defaultValue))
                            this.handleChangeRule(item)
                        } else {
                            this.$set(this.formModel, item.field, '')
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'blur' }
                        ])
                    }
                    this.queryDicDetail(item, i)
                } else if (item.type === 'checkbox') {
                    if (!this.formModel[item.field]) {
                        if (item.defaultValue) {
                            this.$set(this.formModel, item.field, item.defaultValue)
                            this.handleChangeRule(item)
                        } else {
                            this.$set(this.formModel, item.field, [])
                        }
                    } else {
                        this.$set(this.formModel, item.field, JSON.parse(this.formModel[item.field]))
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'blur' }
                        ])
                    }
                    this.queryDicDetail(item, i)
                } else if (item.type === 'select') {
                    if (!this.formModel[item.field]) {
                        if (item.defaultValue) {
                            this.$set(this.formModel, item.field, item.defaultValue)
                            this.handleChangeRule(item)
                        } else {
                            if (item.multiple) {
                                this.$set(this.formModel, item.field, [])
                            } else {
                                this.$set(this.formModel, item.field, '')
                            }
                        }
                    } else {
                        if (item.multiple) {
                            this.$set(this.formModel, item.field, this.formModel[item.field].split(','))
                        } else {
                            this.$set(this.formModel, item.field, String(this.formModel[item.field]))
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'change' }
                        ])
                    }
                    this.queryDicDetail(item, i)
                } else if (item.type === 'cascader') {
                    if (item.multiple) {
                        if (!this.formModel[item.field]) {
                            this.$set(this.formModel, item.field, [])
                        } else {
                            this.$set(this.formModel, item.field, String(this.formModel[item.field]).split(','))
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'change' }
                        ])
                    }
                    this.queryCascader(item, i)
                } else if (item.type === 'switch') {
                    if (!this.formModel[item.field]) {
                        if (item.defaultValue) {
                            this.$set(this.formModel, item.field, item.defaultValue)
                            this.handleChangeRule(item)
                        } else {
                            if (item.defaultValue === 0) {
                                this.$set(this.formModel, item.field, item.defaultValue)
                            }
                        }
                    }
                } else if (item.type === 'datePicker') {
                    if (!this.formModel[item.field]) {
                        if (item.defaultsCurrent) {
                            let currentDate = new Date()
                            let year = currentDate.getFullYear()
                            let month =
                                currentDate.getMonth() + 1 < 10
                                    ? '0' + (currentDate.getMonth() + 1)
                                    : currentDate.getMonth() + 1
                            let day = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()
                            let hours =
                                currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours()
                            let minutes =
                                currentDate.getMinutes() < 10
                                    ? '0' + currentDate.getMinutes()
                                    : currentDate.getMinutes()
                            let seconds =
                                currentDate.getSeconds() < 10
                                    ? '0' + currentDate.getSeconds()
                                    : currentDate.getSeconds()
                            if (item.valueFormat === 'yyyy') {
                                this.$set(this.formModel, item.field, String(year))
                            } else if (item.valueFormat === 'yyyy-MM') {
                                this.$set(this.formModel, item.field, String(year) + '-' + String(month))
                            } else if (item.valueFormat === 'yyyy-MM-dd') {
                                this.$set(
                                    this.formModel,
                                    item.field,
                                    String(year) + '-' + String(month) + '-' + String(day)
                                )
                            } else if (item.valueFormat === 'yyyy-MM-dd HH:mm:ss') {
                                this.$set(
                                    this.formModel,
                                    item.field,
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
                            } else if (item.valueFormat === 'yyyy-MM-dd hh:mm:ss') {
                                this.$set(
                                    this.formModel,
                                    item.field,
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
                            if (item.defaultValue) {
                                this.$set(this.formModel, item.field, item.defaultValue)
                            } else {
                                this.$set(this.formModel, item.field, '')
                            }
                        }
                    } else {
                        if (item.valueFormat === 'yyyy-MM-dd HH:mm') {
                            this.$set(
                                this.formModel,
                                item.field,
                                this.formModel[item.field].substring(0, 19).replace('T', ' ')
                            )
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'change' }
                        ])
                    }
                } else if (item.type === 'timePicker') {
                    if (!this.formModel[item.field]) {
                        if (item.defaultValue) {
                            this.$set(this.formModel, item.field, item.defaultValue)
                        } else {
                            this.$set(this.formModel, item.field, '')
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'change' }
                        ])
                    }
                } else if (item.type === 'dateRangePicker') {
                    if (!this.formModel[item.field]) {
                        if (item.defaultValue) {
                            this.$set(this.formModel, item.field, item.defaultValue)
                        } else {
                            this.$set(this.formModel, item.field, '')
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'change' }
                        ])
                    }
                } else if (item.type === 'timeRangePicker') {
                    if (!this.formModel[item.field]) {
                        if (item.defaultValue) {
                            this.$set(this.formModel, item.field, item.defaultValue)
                        } else {
                            this.$set(this.formModel, item.field, '')
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'change' }
                        ])
                    }
                } else if (item.type === 'editor') {
                    if (this.formModel[item.field] && this.formModel[item.field].url) {
                        this.$set(this.textModel, 'type', this.formModel[item.field].type)
                    } else {
                        this.$nextTick(() => {
                            this.$refs[item.field][0].quill.setContents(this.formModel[item.field])
                        })
                        this.$set(this.textModel, 'type', 'text')
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'blur' }
                        ])
                    }
                    if (window.location.href.indexOf('addCustomForm') > 0) {
                        this.$set(this.textModel, 'flag', item.isText)
                    }
                    this.$set(this.textModel, 'field', item.field)
                } else if (item.type === 'area') {
                    if (!this.formModel[item.field]) {
                        this.$set(this.formModel, item.field, '')
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { type: 'array', required: true, message: item.placeholder }
                        ])
                    }
                    this.queryRegions(item, i)
                } else if (item.type === 'picture' || item.type === 'upload') {
                    if (!this.formModel[item.field]) {
                        this.$set(this.formModel, item.field, [])
                    } else {
                        if (this.formModel[item.field] instanceof Array) {
                            this.$set(this.formModel, item.field, this.formModel[item.field])
                        } else {
                            this.$set(this.formModel, item.field, JSON.parse(this.formModel[item.field]))
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { type: 'array', required: true, message: item.placeholder }
                        ])
                    }
                } else if (item.type === 'bill') {
                    if (!this.formModel[item.field]) {
                        this.queryBill(item.field, item.prefix, item.format, item.digit)
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'blur' }
                        ])
                    }
                } else if (item.type === 'calculate') {
                    //计算公式
                    this.calculate[item.field] = item.calculate
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'blur' }
                        ])
                    }
                } else if (item.type === 'department') {
                    if (this.formModel[item.field]) {
                        if (item.multiple) {
                            if (this.formModel[item.field] == 'null') {
                                this.$set(this.formModel, item.field, [])
                            } else {
                                this.$set(this.formModel, item.field, String(this.formModel[item.field]).split(','))
                            }
                        } else {
                            if (this.formModel[item.field] == 'null') {
                                this.$set(this.formModel, item.field, '')
                            } else {
                                this.$set(this.formModel, item.field, String(this.formModel[item.field]))
                            }
                        }
                    } else {
                        if (item.multiple) {
                            if (item.defaultValue) {
                                this.$set(this.formModel, item.field, [String(localStorage.getItem('departmentId'))])
                            } else {
                                this.$set(this.formModel, item.field, [])
                            }
                        } else {
                            if (item.defaultValue) {
                                this.$set(this.formModel, item.field, String(localStorage.getItem('departmentId')))
                            }
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'change' }
                        ])
                    }
                    this.queryDynamic(item, i)
                } else if (item.type === 'member') {
                    if (this.formModel[item.field]) {
                        if (item.multiple) {
                            if (this.formModel[item.field] == 'null') {
                                this.$set(this.formModel, item.field, [])
                            } else {
                                this.$set(this.formModel, item.field, String(this.formModel[item.field]).split(','))
                            }
                        } else {
                            if (this.formModel[item.field] == 'null') {
                                this.$set(this.formModel, item.field, '')
                            } else {
                                this.$set(this.formModel, item.field, String(this.formModel[item.field]))
                            }
                        }
                    } else {
                        if (item.multiple) {
                            if (item.defaultValue) {
                                this.$set(this.formModel, item.field, [String(localStorage.getItem('userId'))])
                            } else {
                                this.$set(this.formModel, item.field, [])
                            }
                        } else {
                            if (item.defaultValue) {
                                this.$set(this.formModel, item.field, String(localStorage.getItem('userId')))
                            }
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'change' }
                        ])
                    }
                    this.queryDynamic(item, i)
                } else if (item.type === 'table') {
                    if (!this.formModel[item.field]) {
                        this.$set(this.formModel, item.field, [])
                    }
                } else if (item.type === 'business') {
                    item.options = []
                    if (this.formModel[item.field]) {
                        if (item.multiple) {
                            this.$set(this.formModel, item.field, String(this.formModel[item.field]).split(','))
                        } else {
                            this.$set(this.formModel, item.field, String(this.formModel[item.field]))
                        }
                        this.queryBusinessData(item, i)
                    } else {
                        if (item.multiple) {
                            this.$set(this.formModel, item.field, [])
                        }
                    }
                    if (item.required) {
                        this.$set(this.rules, item.field, [
                            { required: true, message: item.placeholder, trigger: 'change' }
                        ])
                    }
                }

                // 设置禁用字段
                this.disabledField.forEach(field => {
                    field = field.replace(/./g, '|')
                    if (item.field == field) {
                        item.disabled = true
                    }
                })
            }
            //计算公式处理
            for (let key in this.calculate) {
                let text = this.calculate[key]
                this.handleCalculate(key, text)
            }
        },
        //字典详情
        async queryDicDetail(obj, index) {
            let res = await this.$axios.get('dictionaryDetail/queryDisplay?classifyId=' + obj.source)
            if (res.data.code === 200) {
                let item = this.formModelConfig.fieldOptions[index]
                item.options = res.data.data
                this.$set(this.formModelConfig.fieldOptions, index, item)
            }
        },
        // 级联数据
        async queryCascader(obj, index) {
            let res = await this.$axios.get('cloud/entrance/' + obj.source)
            if (res.data.code === 200) {
                let item = this.formModelConfig.fieldOptions[index]
                item.options = res.data.data
                this.$set(this.formModelConfig.fieldOptions, index, item)
            }
        },
        //地区数据
        async queryRegions(obj, index) {
            let res = await this.$axios.get('jellyForm/queryRegions/' + obj.format)
            if (res.data.code === 200) {
                let item = this.formModelConfig.fieldOptions[index]
                item.options = res.data.data
                this.$set(this.formModelConfig.fieldOptions, index, item)
            }
        },
        //单据编号
        async queryBill(field, prefix, billDate, digit) {
            if (this.$route.query.id) {
                let params = {
                    id: this.$route.query.id,
                    field: field.split('|')[1],
                    prefix: prefix,
                    billDate: billDate,
                    digit: digit
                }

                let res = await this.$axios.post('jellyForm/queryBill', params)
                if (res.data.code === 200) {
                    this.$set(this.formModel, field, res.data.data)
                }
            }
        },
        //部门或成员数据
        async queryDynamic(obj, index) {
            let res = await this.$axios.get('jellyForm/queryDynamic?path=' + obj.type + '&type=list')
            if (res.data.code === 200) {
                let item = this.formModelConfig.fieldOptions[index]
                var options = []
                for (var l = 0; l < res.data.data.length; l++) {
                    options.push({
                        id: res.data.data[l].id,
                        label: res.data.data[l].name,
                        value: String(res.data.data[l].id)
                    })
                }
                item.options = options
                this.$set(this.formModelConfig.fieldOptions, index, item)
            }
        },
        //查询业务数据
        async queryBusinessData(obj, index) {
            let params = {
                value: this.formModel[obj.field].toString(),
                source: obj.source,
                showField: obj.showField
            }
            let res = await this.$axios.post('jellyForm/queryOptions', params)
            if (res.data.code === 200) {
                let item = this.formModelConfig.fieldOptions[index]
                var options = []
                for (var l = 0; l < res.data.data.length; l++) {
                    options.push({
                        label: res.data.data[l][obj.showField],
                        value: String(res.data.data[l].id)
                    })
                }
                obj.options = options
                this.$set(this.formModelConfig.fieldOptions, index, item)
            }
        },
        //附件容量
        sizeUnit(capacity) {
            var unitArr = new Array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
            var index = 0
            var srcsize = parseFloat(capacity)
            index = Math.floor(Math.log(srcsize) / Math.log(1024))
            var size = srcsize / Math.pow(1024, index)
            return size + unitArr[index]
        },
        // 文件上传之前
        beforeFileUpload(file, element) {
            this.$loading({ text: '上传中，请稍后...' })
            const suffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
            if (element.minValue) {
                if (file.size < element.minValue) {
                    this.$loading().close()
                    this.$message.error('文档大小至少要' + this.sizeUnit(element.minValue))
                    return false
                }
            }
            if (element.maxValue) {
                if (file.size > element.maxValue) {
                    this.$loading().close()
                    this.$message.error('文档大小不能超过' + this.sizeUnit(element.maxValue))
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
                        if (element.width) {
                            widthValid = img.width == element.width
                        }
                        if (element.height) {
                            heightValid = img.height == element.height
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
                        if (element.width && element.height) {
                            this.$loading().close()
                            this.$message.error(`上传的图片宽高必须是${element.width}*${element.height}!`)
                        } else if (element.width) {
                            this.$loading().close()
                            this.$message.error(`上传的图片宽度必须是${element.width}!`)
                        } else if (element.height) {
                            this.$loading().close()
                            this.$message.error(`上传的图片高度必须是${element.height}!`)
                        }
                        return Promise.reject()
                    }
                )
                return isSize
            }
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
                let index = (fileArray || []).findIndex(item => item.uid === file.uid)
                fileArray[index] = {
                    type: fileType,
                    name: file.name,
                    size: file.size,
                    url: res.data
                }
                this.formModel[element.field] = JSON.parse(JSON.stringify(fileArray))
            } else {
                let fileList = this.$refs[element.field][0].uploadFiles
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
        // 文件预览
        handleFilePreview(file, field) {
            if (file.type === 'image') {
                let previewSrcList = this.formModel[field].map(item => item.url)
                let index = previewSrcList.indexOf(file.url)
                for (let i = 0; i < index; i++) {
                    previewSrcList.push(previewSrcList.shift())
                }
                this.previewSrcList = previewSrcList
                this.previewDialogVisible = true
            } else if (
                file.type === 'pdf' ||
                file.type === 'tif' ||
                file.type === 'word' ||
                file.type === 'excel' ||
                file.type === 'ppt' ||
                file.type === 'txt' ||
                file.type === 'ofd' ||
                file.type === 'rtf'
            ) {
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
        // 附件文件单位格式化
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
        //关闭图片预览
        closeViewer() {
            this.previewDialogVisible = false
        },
        //表单验证
        validate() {
            let result = false
            this.$refs.form.validate(valid => {
                if (valid) {
                    result = true
                } else {
                    result = false
                }
            })
            return result
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
        //业务应用弹窗
        handleBusinessDialog(item) {
            this.$refs[item.field][0].blur()
            this.$refs.simplifyBusiness.showDialog(item)
        },
        //业务应用选择确认
        businessConfirm(modelData, value, options) {
            this.$set(this.formModel, modelData.field, value) //用String(value)破坏多选需要array的要求所以去掉
            modelData.options = []
            for (var i = 0; i < options.length; i++) {
                let option = options[i]
                // modelData.options = []
                modelData.options.push({
                    label: option[modelData.showField],
                    value: String(option.id)
                })
                if (modelData.assignment) {
                    for (var j = 0; j < modelData.assignment.length; j++) {
                        let assignmentDetail = modelData.assignment[j]
                        let property = this.property[assignmentDetail.target]
                        if (property) {
                            if (option.hasOwnProperty(assignmentDetail.source.split('|')[1])) {
                                let value = option[assignmentDetail.source.split('|')[1]]
                                let target = modelData.assignment[j].target

                                if (
                                    property.type === 'text' ||
                                    property.type === 'textarea' ||
                                    property.type === 'number'
                                ) {
                                    if (value) {
                                        this.$set(this.formModel, target, value)
                                    }
                                } else if (
                                    property.type === 'radio' ||
                                    property.type === 'switch' ||
                                    property.type === 'timePicker' ||
                                    property.type === 'datePicker' ||
                                    property.type === 'calculate' ||
                                    property.type === 'bill'
                                ) {
                                    if (value) {
                                        this.$set(this.formModel, target, String(value))
                                    }
                                } else if (property.type === 'checkbox') {
                                    if (value) {
                                        if (value instanceof Array) {
                                            this.$set(this.formModel, target, value)
                                        } else {
                                            this.$set(this.formModel, target, value.split(','))
                                        }
                                    }
                                } else if (property.type === 'select') {
                                    if (value) {
                                        if (property.multiple) {
                                            if (value instanceof Array) {
                                                this.$set(this.formModel, target, String(value))
                                            } else {
                                                this.$set(this.formModel, target, value.split(','))
                                            }
                                        } else {
                                            this.$set(this.formModel, target, String(value))
                                        }
                                    }
                                } else if (
                                    property.type === 'upload' ||
                                    property.type === 'picture' ||
                                    property.type === 'area'
                                ) {
                                    if (value) {
                                        if (value instanceof Array) {
                                            this.$set(this.formModel, target, value)
                                        } else {
                                            this.$set(this.formModel, target, JSON.parse(value))
                                        }
                                    }
                                } else if (property.type === 'editor') {
                                    if (value) {
                                        this.$set(this.formModel, target, JSON.parse(value))
                                    }
                                } else {
                                    console.log(this.property[target])
                                    if (value) {
                                        this.$set(this.formModel, target, String(value))
                                    }
                                }
                            }
                        } else {
                            this.$set(
                                this.formModel,
                                modelData.assignment[j].target,
                                String(option[assignmentDetail.source.split('|')[1]])
                            )
                        }
                    }
                }
            }
            this.$set(this.formModelConfig.fieldOptions, modelData.index, modelData)
        },
        //处理开关、单选框、多选框、选择器逻辑
        handleChangeRule(element) {
            if (element.logic) {
                for (var i = 0; i < element.logic.length; i++) {
                    let item = element.logic[i]
                    if (element.multiple) {
                        if (this.formModel[element.field].indexOf(item.value) > -1) {
                            for (let j = 0; j < this.formModelConfig.fieldOptions.length; j++) {
                                let formItem = this.formModelConfig.fieldOptions[j]
                                if (item.target.indexOf(formItem.field) > -1) {
                                    if (item.type === 'show') {
                                        formItem.hidden = false
                                    } else if (item.type === 'hidden') {
                                        formItem.hidden = true
                                    }
                                    this.$set(this.formModelConfig.fieldOptions, j, formItem)
                                }
                            }
                        }
                    } else {
                        if (item.value == this.formModel[element.field]) {
                            for (let j = 0; j < this.formModelConfig.fieldOptions.length; j++) {
                                let formItem = this.formModelConfig.fieldOptions[j]
                                if (item.target.indexOf(formItem.field) > -1) {
                                    if (item.type === 'show') {
                                        formItem.hidden = false
                                    } else if (item.type === 'hidden') {
                                        formItem.hidden = true
                                    }
                                    this.$set(this.formModelConfig.fieldOptions, j, formItem)
                                }
                            }
                        }
                    }
                }
            }

            //计算公式
            for (let key in this.calculate) {
                let text = this.calculate[key]
                if (text.indexOf(element.field) > -1) {
                    this.handleCalculate(key, text)
                }
            }
        },
        //处理密码change事件
        passwordChange(value, element) {
            this.$set(this.formModel, element.field, md5(value))
        },
        //重置
        resetForm() {
            this.$refs.form.resetFields()
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
        //计算公式逻辑处理
        handleCalculate(key, text) {
            try {
                if (text) {
                    console.log(key, text)
                    var result = handleFormula(text, this.formModel)
                    console.log(result)
                    //赋值
                    this.$set(this.formModel, key, isNaN(eval(result)) ? result : eval(result))
                }
            } catch (err) {
                this.$set(this.formModel, key, '')
                console.log(err)
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
        // word
        handleWps(item) {
            // 单线程
            WpsInvoke.RegWebNotify(WpsInvoke.ClientType.wps, 'WpsAssist', messageText => {
                var result = JSON.parse(messageText)
                console.log(result)
                if (result.type === 'save') {
                    this.$set(this.formModel, result.field, result.value)
                    var params = {
                        table: result.field.split('|')[0],
                        field: result.field.split('|')[1],
                        primaryKey: this.formModel[result.field.split('|')[0] + '|' + 'id'],
                        value: JSON.stringify({ type: 'word', url: result.value })
                    }
                    this.$axios.post('jellyForm/updateFileValue', params).then(res => {})
                }
            })
            var invokeParam = {}
            if (this.formModel[item.field]) {
                invokeParam = {
                    type: 'openFile',
                    apiUrl: window.platform.url,
                    companyId: localStorage.getItem('companyId'),
                    field: item.field,
                    fileUrl: this.formModel[item.field],
                    redHeadUrl: item.redHeadUrl,
                    bookMarks: {}
                }
            } else {
                invokeParam = {
                    type: 'newDocument',
                    apiUrl: window.platform.url,
                    companyId: localStorage.getItem('companyId'),
                    field: item.field,
                    redHeadUrl: item.redHeadUrl,
                    bookMarks: {}
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
        },
        // excel
        handleEt(item) {
            // 单线程
            WpsInvoke.RegWebNotify(WpsInvoke.ClientType.et, 'EtAssist', messageText => {
                var result = JSON.parse(messageText)
                if (result.type === 'save') {
                    this.$set(this.formModel, result.field, result.value)
                    var params = {
                        table: result.field.split('|')[0],
                        field: result.field.split('|')[1],
                        primaryKey: this.formModel[result.field.split('|')[0] + '|' + 'id'],
                        value: JSON.stringify({ type: 'word', url: result.value })
                    }
                    this.$axios.post('jellyForm/updateFileValue', params).then(res => {})
                }
            })
            var invokeParam = {}
            if (this.formModel[item.field]) {
                invokeParam = {
                    type: 'openFile',
                    apiUrl: window.platform.url,
                    companyId: localStorage.getItem('companyId'),
                    field: item.field,
                    fileUrl: this.formModel[item.field]
                }
            } else {
                invokeParam = {
                    type: 'newDocument',
                    apiUrl: window.platform.url,
                    companyId: localStorage.getItem('companyId'),
                    field: item.field
                }
            }
            if (window.location.protocol === 'http:') {
                // 单线程
                WpsInvoke.InvokeAsHttp(
                    WpsInvoke.ClientType.et,
                    'EtAssist',
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
                    WpsInvoke.ClientType.et,
                    'EtAssist',
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
        },
        // 正文word
        handleTextWps(item) {
            // 单线程
            WpsInvoke.RegWebNotify(WpsInvoke.ClientType.wps, 'WpsAssist', messageText => {
                var result = JSON.parse(messageText)
                console.log(result)
                if (result.type === 'save') {
                    this.$set(this.formModel, result.field, { type: 'word', url: result.value })
                    var params = {
                        table: result.field.split('|')[0],
                        field: result.field.split('|')[1],
                        primaryKey: this.formModel[result.field.split('|')[0] + '|' + 'id'],
                        value: JSON.stringify({ type: 'word', url: result.value })
                    }
                    this.$axios.post('jellyForm/updateFileValue', params).then(res => {})
                }
            })
            var invokeParam = {}
            if (this.formModel[item.field].url) {
                invokeParam = {
                    type: 'openFile',
                    apiUrl: window.platform.url,
                    companyId: localStorage.getItem('companyId'),
                    field: item.field,
                    fileUrl: this.formModel[item.field].url,
                    redHeadUrl: item.redHeadUrl,
                    bookMarks: {}
                }
            } else {
                invokeParam = {
                    type: 'newDocument',
                    apiUrl: window.platform.url,
                    companyId: localStorage.getItem('companyId'),
                    field: item.field,
                    redHeadUrl: item.redHeadUrl,
                    bookMarks: {}
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
        },
        // 正文excel
        handleTextEt(item) {
            // 单线程
            WpsInvoke.RegWebNotify(WpsInvoke.ClientType.et, 'EtAssist', messageText => {
                var result = JSON.parse(messageText)
                if (result.type === 'save') {
                    this.$set(this.formModel, result.field, { type: 'excel', url: result.value })
                    var params = {
                        table: result.field.split('|')[0],
                        field: result.field.split('|')[1],
                        primaryKey: this.formModel[result.field.split('|')[0] + '|' + 'id'],
                        value: JSON.stringify({ type: 'word', url: result.value })
                    }
                    this.$axios.post('jellyForm/updateFileValue', params).then(res => {})
                }
            })
            var invokeParam = {}
            if (this.formModel[item.field].url) {
                invokeParam = {
                    type: 'openFile',
                    apiUrl: window.platform.url,
                    companyId: localStorage.getItem('companyId'),
                    field: item.field,
                    fileUrl: this.formModel[item.field].url
                }
            } else {
                invokeParam = {
                    type: 'newDocument',
                    apiUrl: window.platform.url,
                    companyId: localStorage.getItem('companyId'),
                    field: item.field
                }
            }
            if (window.location.protocol === 'http:') {
                // 单线程
                WpsInvoke.InvokeAsHttp(
                    WpsInvoke.ClientType.et,
                    'EtAssist',
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
                    WpsInvoke.ClientType.et,
                    'EtAssist',
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
        },
        // 正文文件上传之前
        beforeTextFileUpload(file, element) {
            this.$loading({ text: '上传中，请稍后...' })
            const suffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
            const filelist = ['pdf']
            let result = filelist.find(item => item === suffix)
            if (!result) {
                this.$loading().close()
                this.$message.error('请上传PDF文件类型')
                return false
            }
            return true
        },
        // 正文文件上传成功
        handleTextFileSuccess(res, file, fileList, element) {
            this.$loading().close()
            if (res.code === 200) {
                this.formModel[element.field] = {
                    type: 'pdf',
                    name: file.name,
                    size: file.size,
                    url: res.data
                }
            } else {
                let fileList = this.$refs[element.field][0].uploadFiles
                let index = fileList.findIndex(fileItem => {
                    return fileItem.url === file.url
                })
                fileList.splice(index, 1)
                this.$message.error(res.message)
            }
        },
        // 预览pdf
        handlePdfPreview(item) {
            window.open(
                this.$axios.defaults.baseURL +
                    'upload/preview?url=' +
                    encodeURIComponent(this.formModel[item.field].url) +
                    '&fileName=' +
                    encodeURIComponent(this.formModel[item.field].name)
            )
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
::v-deep .el-input.is-disabled .el-input__inner {
    color: #000;
}
::v-deep .el-textarea.is-disabled .el-textarea__inner {
    color: #000;
}
::v-deep .el-switch.is-disabled {
    opacity: 0.8;
}
::v-deep .el-radio__input.is-disabled + span.el-radio__label {
    color: #333;
}
::v-deep .upload-disabled .el-upload--picture-card {
    display: none;
}
::v-deep .ql-disabled {
    background-color: #f5f7fa;
    cursor: not-allowed;
}
.container {
    padding-top: 0px;
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
.textType {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    width: 100%;
    height: 120px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px 0px;
}
</style>
