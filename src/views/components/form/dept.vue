<template>
    <div>
        <el-dialog 
            title="请选择部门" 
            width="750px"
            append-to-body
            :visible.sync="formVisible" 
            :close-on-click-modal="false"
            >
            <el-table 
                :data="tableData" 
                @row-dblclick="rowDblclick"
                border
                default-expand-all
                highlight-current-row 
                row-key="id"
                style="z-index:2000;"
                max-height="480"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
				<el-table-column type="index" label="#" width="50" align="center"></el-table-column>
				<el-table-column property="name" label="名称" align="center"></el-table-column>
			</el-table>
            <div slot="footer" class="dialog-footer"></div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formVisible: false,
            tableData: [],
            type: '',
            field: ''
        }
    },
    created() {
        this.queryTableData('department')
    },
    methods: {
        async queryTableData(dynamic) {
            let res = await this.$axios.get('jellyForm/queryDynamic?path=' + dynamic + '&type=tree')
            if(res.data.code === 200){
                this.tableData = res.data.data
            }
		},
        showDialog(type, field) {
            this.type = type
            this.field = field
            this.formVisible = true
        },
        rowDblclick(row, column, event) {
            this.formVisible = false
            this.$emit("confirm", this.type, this.field, String(row.id))
		}
    }
}
</script>
