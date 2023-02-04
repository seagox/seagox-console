<template>
  <div class="container">
    <el-container :style="'height:' + (clientHeight - 140) + 'px'">
      <el-aside width="240px" class="aside">
        <div class="add-dept" >
          <span style="margin-left: 10px">资产大类</span>
        </div>
        <el-table
            :data="propertyData"
            highlight-current-row
            :show-header="false"
            @current-change="handleNodeClick"
            class="border"
            default-expand-all
            row-key="id"
            :tree-props="{ children: 'children' }"
        >
          <el-table-column show-overflow-tooltip>
            <template slot-scope="scope">
              <i class="el-icon-document" style="font-size: 14px"></i>
              <span style="font-size: 14px; margin-left: 8px">{{
                  scope.row.code + ' ' + scope.row.name
                }}</span>
            </template>
          </el-table-column>
          <el-table-column width="45" align="center">
            <template slot-scope="scope">
              <el-dropdown @command="handleCommand($event, scope.row)">
                                <span class="el-dropdown-link">

                                </span>

              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
      <el-main>

        <div class="searchView">
          <el-form label-width="115px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="资产分类名称">
                  <el-input v-model="searchForm.name" clearable placeholder="请输入名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="资产分类编码">
                  <el-input v-model="searchForm.code" clearable placeholder="请输入编码"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click.native="handleSearch"
                    style="margin-left: 15px"
                >查询</el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="toolView" style="margin-top: 0px">
          <el-button type="text" icon="el-icon-plus" @click="showAddDialog" size="small">新增资产分类</el-button>
        </div>
        <div class="table">
          <!--列表-->
          <el-table :data="tableData" border highlight-current-row stripe>
            <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
            <el-table-column prop="code" label="资产分类编码" align="center"></el-table-column>
            <el-table-column prop="name" label="资产分类名称" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="185">
              <template slot-scope="scope">
                <el-button
                    type="text"
                    size="small"
                    @click="showEditDialog(scope.row)"
                    v-if="scope.row.account != 'fjctAdmin'"
                >编辑</el-button
                >
                <el-divider direction="vertical" v-if="scope.row.account != 'fjctAdmin'"></el-divider>
                <el-button
                    type="text"
                    size="small"
                    @click="deleteSubmit(scope.row)"
                    v-if="scope.row.account != 'fjctAdmin'"
                >删除</el-button
                >
                <el-divider direction="vertical" v-if="scope.row.account != 'fjctAdmin'"></el-divider>

              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <div class="pagination">
            <el-pagination
                background
                @current-change="handleCurrentChange"
                layout="total, prev, pager, next"
                :current-page.sync="pageNo"
                :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
    <!--新增资产分类界面-->
    <el-dialog title="新增" width="750px" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="115px" :rules="formRules" ref="addForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="资产分类编码" prop="code">
              <el-input v-model="addForm.code" placeholder="请输入编码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产分类名称" prop="name">
              <el-input
                  v-model="addForm.name"
                  placeholder="请输入名称"
                  clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑用户界面-->
    <el-dialog title="编辑" width="750px" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="115px" :rules="formRules" ref="editForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="资产分类编码" prop="code">
              <el-input v-model="editForm.code" placeholder="请输入编码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产分类名称" prop="name">
              <el-input v-model="editForm.name" placeholder="请输入名称" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editSubmit">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      action: this.$axios.defaults.baseURL + 'user/import',
      headers: {
        Authorization: localStorage.getItem('Authorization')
      },
      clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
      jtfsOptions:[],
      jldwOptions:[],
      zjfsOptions:[],
      propertyData:[],
      addDeptFormVisible: false,
      addDeptForm: {
        code: '',
        name: '',
        jtfs: '1',
        mrzjTx:'1'
      },
      tableData: [],
      pageNo: 1,
      total: 0,
      addFormVisible: false,
      addForm: {
        code:'',
        name: '',
      },
      editFormVisible: false,
      editForm: {
        id:'',
        code: '',
        name: ''
      },
      formRules: {
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      searchForm: {
        propertyId: '',
        code:'',
        name: ''
      },
      curDept: undefined,
      classify:[]
    }
  },
  created() {
    this.queryJtfs()
    this.queryJldw()
    this.queryZjfs()
    this.queryClassify()
    this.queryProperty()
    this.queryByPage()
  },
  methods: {
    //获取计提方式
    async queryJtfs() {
      let params = {
        name:'计提方式'
      }
      let res = await this.$axios.post('/cloud/entrance/getDictDetailByName',params)
      if (res.data.code == 200) {
        this.jtfsOptions = res.data.data
      }
    },
    //获取折旧方式
    async queryZjfs() {
      let res = await this.$axios.post('/cloud/entrance/getZjMethod')
      if (res.data.code == 200) {
        this.zjfsOptions = res.data.data
      }
    },
    //获取计量单位
    async queryJldw() {
      let params = {
        name:'计量单位'
      }
      let res = await this.$axios.post('/cloud/entrance/getDictDetailByName',params)
      if (res.data.code == 200) {
        this.jldwOptions = res.data.data
      }
    },
    //查询资产分类
    async queryClassify() {
      let res = await this.$axios.post('/cloud/entrance/queryAssetsClassif')
      if (res.data.code == 200) {
        this.classify = res.data.data
      }

    },
    //获取属性
    async queryProperty() {
      let res = await this.$axios.post('/cloud/entrance/queryPropertyList')
      if (res.data.code == 200) {
        this.propertyData = res.data.data
      }
    },
    handleNodeClick(row) {
      if (row) {
        this.curDept = row
        this.searchForm.propertyId = row.id
        this.pageNo = 1
        this.queryByPage()
      }
    },
    //查询资产属性列表
    queryByPage() {
      let that = this
      const params = {
        pageNo: this.pageNo,
        propertyId: this.searchForm.propertyId.toString(),
        name:this.searchForm.name,
        code:this.searchForm.code
      }
      that.$axios.post('cloud/authority/queryAssetsClassif2', params).then(res => {
        if (res.data.code == 200) {
          that.tableData = res.data.data.list
          that.total = res.data.data.total
        }
      })
    },
    handleSearch() {
      this.pageNo = 1
      this.queryByPage()
    },
    handleCurrentChange(val) {
      this.queryByPage()
    },
    //计量单位格式化
    jldwFormatter(obj) {
      if (obj.jldw !=null && obj.jldw !='') {
        let name = ''
        this.jldwOptions.forEach(value => {
          if (value.code==obj.jldw){
            name=value.name
          }
        })
        return name
      } else {
        return ''
      }
    },
    sexFormatter(obj) {
      if (obj.sex === 1) {
        return '男'
      } else {
        return '女'
      }
    },
    statusFormatter(obj) {
      if (obj.status === 1) {
        return '启用'
      } else {
        return '禁用'
      }
    },
    //显示用户新增界面
    showAddDialog() {
      if (this.searchForm.propertyId) {
        this.addFormVisible = true
        if (this.$refs.addForm) {
          this.$refs.addForm.resetFields()
        }
        this.addForm.propertyId = this.searchForm.propertyId
      } else {
        this.$message.error('请选择资产大类')
      }
    },
    //新增用户
    addSubmit() {
      let that = this
      var params = this.addForm
      this.$refs.addForm.validate(valid => {
        if (valid) {
          that.$axios.post('cloud/authority/insertClassif', params).then(res => {
            if (res.data.code == 200) {
              that.$message.success('新增成功')
              that.addFormVisible = false
              that.queryByPage()
            } else {
              that.$message.error(res.data.message)
            }
          })
        }
      })
    },
    //显示用户编辑界面
    showEditDialog(row) {
      this.editForm = Object.assign({}, row)
      this.editFormVisible = true
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }

    },
    //编辑用户
    editSubmit() {
      let that = this
      var params = {
        id: this.editForm.id,
        code: this.editForm.code,
        name: this.editForm.name,
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          that.$axios.post('cloud/authority/updateClassif', params).then(res => {
            if (res.data.code == 200) {
              that.$message.success('修改成功')
              that.editFormVisible = false
              that.queryByPage()
            } else {
              that.$message.error(res.data.message)
            }
          })
        }
      })
    },
    deleteSubmit(row) {
      let that = this
      var params = {
        id: row.id
      }
      this.$confirm('亲，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
        that.$axios.post('cloud/authority/deleteClassif',params).then(res => {
          if (res.data.code == 200) {
            that.$message.success('删除成功')
            that.pageNo = 1
            that.queryByPage()
          } else {
            that.$message.error(res.data.message)
          }
        })
      })
    },
  }
}
</script>
<style scoped>
.container {
  padding: 15px;
}
::v-deep .el-main {
  border-left: 1px solid #e5e9f2;
  padding: 0px;
  margin-left: 15px;
}
.add-dept {
  border: 1px dashed #e5e9f2;
  border-radius: 6px;
  text-align: center;
  padding: 8px;
  margin-bottom: 15px;
  cursor: pointer;
}
::v-deep .el-table__body tr.current-row td:not(.is-center) {
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
}
::v-deep .el-aside .el-table__body tr.current-row .is-center {
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}
::v-deep .aside .el-table td {
  border-bottom: 0px solid #ebeef5;
}

.bmxx-box {
  margin: 10px 10px 20px 10px;
  padding: 5px;
  border-bottom: 1px solid #ebeef5;
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
