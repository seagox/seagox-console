<template>
    <div>
        <el-dialog 
            title="表单赋值" 
            width="900px"
            append-to-body
            :visible.sync="formVisible" 
            :close-on-click-modal="false">
            <div class="toolView">
                <el-button icon="el-icon-plus" size="small" @click="handleAdd">新增</el-button>
            </div>
            <el-table 
                :data="tableData"
                border 
                highlight-current-row 
                stripe>
                <el-table-column prop="source" label="源字段" align="center">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.source" clearable filterable placeholder="请选择源字段">
                            <el-option
                                v-for="item in sourceOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="target" label="目标字段" align="center">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.target" clearable filterable placeholder="请选择目标字段">
                            <el-option
                                v-for="item in targetOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="75">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleDel(scope.$index)" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="formVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formVisible: false,
            tableData: [],
            sourceOptions: [],
            targetOptions: []
        }
    },
    created() {
        this.queryTargetBusinessField()
    },
    methods: {
        async queryTargetBusinessField() {
            let url = ''
            if (this.$route.query.type && this.$route.query.type === 'print'){
                url = 'jellyPrint/queryBusinessField/'
            }else {
                url = 'jellyFormDesign/queryBusinessField/'
            }
            let res = await this.$axios.get(url + this.$route.query.id)
            if(res.data.code === 200){
                let targetOptions = []
                for(let i=0;i<res.data.data.length;i++) {
                    let fieldObject = res.data.data[i]
                    targetOptions.push({
                        value: fieldObject.tableName + '.' + fieldObject.name,
                        label: fieldObject.tableComment + '-' + fieldObject.remark
                    })
                }
                this.targetOptions = targetOptions
            }
        },
        async querySourceBusinessField(value) {
            let res = await this.$axios.get('jellyForm/queryBusinessField/' + value)
            if(res.data.code === 200){
                let sourceOptions = []
                for(let i=0;i<res.data.data.length;i++) {
                    let fieldObject = res.data.data[i]
                    sourceOptions.push({
                        value: fieldObject.tableName + '.' + fieldObject.name,
                        label: fieldObject.tableComment + '-' + fieldObject.remark
                    })
                }
                this.sourceOptions = sourceOptions
            }
        },
        showDialog(data) {
            this.tableData = data.assignment || []
            this.querySourceBusinessField(data.source)
            this.formVisible = true
        },
        handleAdd() {
            this.tableData.push({
                source: '',
                target: ''
            })
        },
        handleDel(index) {
            this.tableData.splice(index,1)
        },
        handleSubmit() {
            for(let i=0;i<this.tableData.length;i++) {
                let item = this.tableData[i]
                if(!item.source) {
                    this.$message.error('源字段不能为空')
                    return
                }
                if(!item.target) {
                    this.$message.error('目标字段不能为空')
                    return
                }
            }
            this.formVisible = false
            this.$emit("assignmentSubmit", this.tableData)
        }
    }
}
</script>

<style scoped>
    ::v-deep .el-dialog__body {
        padding: 10px 20px;
    }
</style>
