<template>
    <div>
        <el-dialog 
            title="请选择" 
            width="900px"
            append-to-body
            :visible.sync="formVisible" 
            :close-on-click-modal="false"
            >
            <div class="searchView">
                <el-form label-width="90px">
                    <el-row>
                        <el-col :span="20">
                            <el-col :span="12" v-for="(item,index) in searchJsonList" :key="index">
                                <el-form-item :label="item.desc + ':'" v-if="index > 1 && !moreFlag ? false : true">
                                    <el-input
                                        v-model="item.value" 
                                        :placeholder="'请输入' + item.desc" 
                                        clearable 
                                        v-if="item.type === 'input'">
                                    </el-input>
                                    <el-select 
                                        v-model="item.value" 
                                        :placeholder="'请选择' + item.desc"
                                        clearable
                                        filterable
                                        :multiple="item.multiple"
                                        v-if="item.type === 'select'">
                                        <el-option
                                            v-for="item in item.sourceOptions"
                                            :key="item.code"
                                            :label="item.name"
                                            :value="item.code">
                                        </el-option>
                                    </el-select>
                                    <el-date-picker
                                        v-model="item.value"
                                        :type="item.dateType.split('|')[0]"
                                        :value-format="item.dateType.split('|')[1]"
                                        :placeholder="'请选择' + item.desc" 
                                        clearable
                                        align="center"
                                        v-if="item.type === 'datePicker'">
                                    </el-date-picker>
                                    <el-select 
                                        v-model="item.value" 
                                        :placeholder="'请选择' + item.desc"
                                        clearable
                                        filterable
                                        :multiple="item.multiple"
                                        v-if="item.type === 'company'">
                                        <el-option
                                            v-for="item in item.sourceOptions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-select 
                                        v-model="item.value" 
                                        :placeholder="'请选择' + item.desc"
                                        clearable
                                        filterable
                                        :multiple="item.multiple"
                                        v-if="item.type === 'department'">
                                        <el-option
                                            v-for="item in item.sourceOptions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-col>
                        <el-col :span="4">
                            <div style="margin-left:15px;">
                                <el-button type="primary" icon="el-icon-search" @click.native="handleSearch" v-if="searchJsonList.length != 0">查询</el-button>
                                <el-button type="text" icon="el-icon-arrow-down" @click="moreFlag = true" v-if="searchJsonList.length > 2 && !moreFlag"></el-button>
                                <el-button type="text" icon="el-icon-arrow-up" @click="moreFlag = false" v-else-if="searchJsonList.length > 2 && moreFlag"></el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="table">
                <!--列表-->
                <el-table 
                    :data="tableData" 
                    border
                    stripe
                    max-height="450"
                    @selection-change="handleSelectionChange"
                    @cell-dblclick="cellDBClick">
                    <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                    <el-table-column 
                        type="selection" 
                        width="50" 
                        align="center"
                        v-if="multiple">
                    </el-table-column>
                    <table-column v-for="(item,index) in tableHeaderList" :key="index" :element="item" :regions="regions"/>
                </el-table>
                <!--分页-->
                <div class="pagination">
                    <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        layout="total, prev, pager, next"
                        :current-page.sync="pageNo"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" v-if="multiple">
                <el-button @click="formVisible = false">取消</el-button>
                <el-button type="primary" @click="confirm">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import tableColumn from "@/views/components/form/table-column"
export default {
    components: {
        tableColumn
    },
    data() {
        return {
            formVisible: false,
            searchJsonList: [],
            tableData: [],
            pageNo: 1,
            total: 0,
            tableHeaderList: [],
            multipleSelection: [],
            type: '',
            multiple: false,
            source: '',
            field: '',
            td: null,
            regions: {},
            moreFlag: false,
            searchConfig: null
        }
    },
    created() {
        this.regions = JSON.parse(localStorage.getItem("regions"))
    },
    methods: {
        async queryById(type, searchConfig) {
            let that = this
            var search = {}
            for(var i=0;i<this.searchJsonList.length;i++) {
                if(Array.isArray(this.searchJsonList[i].value)) {
                    search[this.searchJsonList[i].field] = this.searchJsonList[i].value.toString()
                } else {
                    search[this.searchJsonList[i].field] = this.searchJsonList[i].value ? this.searchJsonList[i].value : ''
                }
            }

            if (searchConfig) {
                Object.assign(search, searchConfig)
            }
            
            let res = await this.$axios.get('jellyForm/queryById/' + this.source)
            if (res.data.code == 200) {
                let that = this
                const params = {
                    id: res.data.data.id,
                    pageNo: this.pageNo,
                    search: JSON.stringify(search)
                }
                that.$axios.post('jellyForm/queryListById', params)
                .then((response) => {
                    if (response.data.code == 200) {
                        if(type === 1) {
                            that.searchJsonList = JSON.parse(response.data.data.searchJson)
                            for(let k=0;k<that.searchJsonList.length;k++) {
                                if(that.searchJsonList[k].type === 'select') {
                                    that.queryByClassifyId(that.searchJsonList[k].source,k)
                                } else if (that.searchJsonList[k].type === 'company') {
                                    that.queryCompany(k)
                                } else if (that.searchJsonList[k].type === 'department') {
                                    that.queryDepartment(k)
                                }
                            }
                        }
                        
                        that.tableHeaderList = response.data.data.tableHeaderJson
                        that.tableData = response.data.data.tableData.list
                        that.total = response.data.data.tableData.total
                    }
                })
            }
        },
        async queryByClassifyId(classifyId, index) {
            let res = await this.$axios.get('dictionaryDetail/queryByClassifyId/' + classifyId)
            if (res.data.code == 200) {
                let item = this.searchJsonList[index]
                item.sourceOptions = res.data.data
                this.$set(this.searchJsonList, index, item)
            }
        },
        async queryCompany(index) {
            let res = await this.$axios.get('company/queryListByCompanyId')
            if (res.data.code == 200) {
                let item = this.searchJsonList[index]
                item.sourceOptions = res.data.data
                this.$set(this.searchJsonList, index, item)
            }
        },
        async queryDepartment(index) {
            let res = await this.$axios.get('department/queryByCompanyId')
            if (res.data.code == 200) {
                let item = this.searchJsonList[index]
                item.sourceOptions = res.data.data
                this.$set(this.searchJsonList, index, item)
            }
        },
        handleCurrentChange(val) {
            this.queryById(2, this.searchConfig)
        },
        handleSearch() {
            this.queryById(2, this.searchConfig)
        },
        formatter(row, column, cellValue, element) {
            if (element.formatter) {
                let options = JSON.parse(element.options)
                for(var i=0;i<options.length;i++) {
                    if (options[i].code == cellValue) {
                        return options[i].name
                    }
                }
            }
            return cellValue
        },
        showDialog(type, field, multiple, source, td, search) {
            this.type = type
            this.field = field
            this.multiple = multiple
            this.source = source
            this.td = td
            this.searchConfig = search
            this.queryById(1, this.searchConfig)
            this.formVisible = true
        },
        handleSelectionChange(value) {
            this.multipleSelection = value
        },
        cellDBClick(row, column, cell, event) {
            if(!this.multiple) {
                this.$emit("confirm", this.type, this.field, String(row.id), this.td, row)
                this.formVisible = false
            }
        },
        confirm() {
            let result = []
            for(let j=0;j<this.multipleSelection.length;j++) {
                result.push(String(this.multipleSelection[j].id))
            }
            this.$emit("confirm", this.type, this.field, result, this.td, this.multipleSelection)
            this.formVisible = false
        }
    }
}
</script>

<style scoped>
    .searchView {
        margin: 0px;
        padding: 0px;
    }
</style>
