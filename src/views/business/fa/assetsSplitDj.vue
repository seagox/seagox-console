<template>
  <div>
    <div class="searchView">
      <el-form label-width="85px" :inline="true">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单据日期">
              <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="searchForm.djDate"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拆分期间">
              <el-date-picker
                  v-model="searchForm.cfDate"
                  type="monthrange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="单据编号">
              <el-input v-model="searchForm.djCode" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产分类">
              <el-input v-model="searchForm.classifName" clearable>
                <el-button @click="clickClass" style="padding-right:10px" slot="suffix" type="text">
                  <i class="el-icon-more"></i></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="110px" label="拆分前资产名称">
              <el-input v-model="searchForm.cfqAssetsName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="110px" label="拆分后资产名称">
              <el-input v-model="searchForm.cfhAssetsName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拆分前数量">
              <el-input v-model="searchForm.number" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拆分原因">
              <el-select
                  v-model="searchForm.reason"
                  filterable
                  clearable
              >
                <el-option
                    v-for="item in cfyyOptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="110px" label="备注">
              <el-input v-model="searchForm.remark" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click.native="handleSearch">查询</el-button>
              <!--              <el-button type="primary" icon="el-icon-plus" @click.native="goAdd">新增</el-button>-->
              <!--              <el-button type="primary" icon="el-icon-delete" @click.native="deleteButton">删除</el-button>-->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="toolView" style="margin-top: 0px">
      <el-button style="font-size: 15px" type="text" icon="el-icon-plus" @click="goAdd" size="small">新增</el-button>
      <el-button style="font-size: 15px" type="text" icon="el-icon-delete" @click="deleteButton" size="small">删除</el-button>
    </div>
    <div class="table">
      <!--列表-->
      <el-table :data="tableData" border stripe @row-dblclick="goDetail" @selection-change="selectionChange"
                max-height="650" row-key="id">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column type="selection" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dj_date" label="单据日期" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dj_code" label="单据编号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cf_date" label="拆分期间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="cfyyFormatter" prop="reason" label="拆分原因" align="center"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="assets_code" label="资产编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="assets_name" label="资产名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="number" label="数量" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jldw" label="计量单位" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="original_value" label="原值" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="yzje" label="本月折旧/摊销" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ljzj_tx" label="累计折旧/摊销" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <!--分页-->
      <div class="pagination">
        <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next"
            :page-size="pageSize"
            :current-page.sync="pageNo"
            :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <!--显示资产分类选择界面-->
    <el-dialog title="请选择" width="750px" :visible.sync="assetsClassifsVisible" :close-on-click-modal="false">
      <div class="searchView">
        <el-form label-width="115px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="资产分类名称">
                <el-input v-model="classifsForm.name" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产分类编码">
                <el-input v-model="classifsForm.code" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click.native="handleSearchClassif"
                  style="margin-left: 15px"
              >查询
              </el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="table">
        <!--列表-->
        <el-table :data="tableDataClassif" border highlight-current-row stripe>
          <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
          <el-table-column prop="code" label="资产分类编码" align="center"></el-table-column>
          <el-table-column prop="name" label="资产分类名称" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="185">
            <template slot-scope="scope">
              <el-button
                  type="text"
                  size="small"
                  @click="showSelectDialog(scope.row)"
              >选择
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <div class="pagination">
          <el-pagination
              background
              @current-change="handleCurrentChangeClassif"
              layout="total, prev, pager, next"
              :current-page.sync="pageNoClassif"
              :total="totalClassif"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>


</template>

<script>
export default {
  name: 'assetsSplitDj',
  data() {
    return {
      assetsClassifsVisible: false,
      classifsForm: {
        name: '',
        code: '',
      },
      tableDataClassif: [],
      pageNoClassif: 1,
      totalClassif: 0,
      rules: {
        dj_code: [{required: true, message: '请输入编码', trigger: 'blur'}]
      },
      currentPage: 1,  // 当前页码
      searchForm: {
        djDate: [],
        cfDate: [],
        djCode: '',
        classifName: '',
        cfqAssetsName: '',
        cfhAssetsName: '',
        number: '',
        reason: '',
        remark: '',
      },
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      ids: '',
      row: [],
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      cfyyOptions: [],

    }
  },
  mounted() {
    this.querycfyy()
    this.queryByPage()
  },
  methods: {
    goDetail(row) {
      this.$history.push({
        path: 'runCode?path=splitDetails&title=资产拆分明细',
        query: {
          id: row.djId
        }
      })

    },
    goAdd() {
      this.$history.push({
        path: 'runCode?path=assetsSplitNew&title=新增资产拆分',
      })
    },
    clickClass() {
      this.handleSearchClassif()
      this.assetsClassifsVisible = true

    },
    queryByPage() {
      let params = Object.assign({}, this.searchForm)
      params.pageNo = this.pageNo
      //单据日期
      if (this.searchForm.djDate != null) {
        if (this.searchForm.djDate.length > 1) {
          params.djDateStart = this.searchForm.djDate[0]
          params.djDateEnd = this.searchForm.djDate[1]
        }
      }
      //拆分期间
      if (this.searchForm.cfDate != null) {
        if (this.searchForm.cfDate.length > 1) {
          params.cfDateStart = this.searchForm.cfDate[0]
          params.cfDateEnd = this.searchForm.cfDate[1]
        }
      }
      this.$axios.post('cloud/authority/getSplitDj', params).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
          this.pageSize = res.data.data.pageSize
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    //删除
    deleteButton() {
      if (this.row.length < 1) {
        this.$message.error('请选择一条数据!')
        return
      }
      //业务
      let params = {
        ids: this.ids
      }
      this.$confirm("删除后不能恢复！是否确定删除？", "提示", {
        iconClass: "el-icon-question", //自定义图标样式
        confirmButtonText: "确认", //确认按钮文字更换
        cancelButtonText: "取消", //取消按钮文字更换
        showClose: true, //是否显示右上角关闭按钮
        type: "warning", //提示类型  success/info/warning/error
      }).then(() => {
        this.$axios.post('cloud/entrance/deleteSplit', params).then(res => {
          if (res.data.code === 200) {
            this.queryByPage()
            this.$message.success("删除成功")
          } else {

            this.$message.error(res.data.message)
          }
        })
      }).catch(function (err) { //取消按钮会视为erro
        console.log(err)
      });


    },
    handleSearch() {
      this.pageNo = 1
      this.queryByPage()
    },
    handleCurrentChange() {
      this.queryByPage()
    },
    selectionChange(selection) {
      this.ids = ''
      this.row = selection
      selection.forEach(data => {
        if (this.ids) {
          this.ids += ',' + data.djId
        } else {
          this.ids = data.djId
        }
      })
    },
    //获取拆分原因
    async querycfyy() {
      let params = {
        name: '拆分原因'
      }
      let res = await this.$axios.post('/cloud/entrance/getDictDetailByName', params)
      if (res.data.code == 200) {
        this.cfyyOptions = res.data.data
      }
    },
    cfyyFormatter(obj) {
      let param = this.cfyyOptions.find(value => value.code == obj.reason)
      if (param) {
        return param.name
      } else {
        return obj.reason
      }
    },
    //查询资产属性列表
    queryByPageClassif() {
      let that = this
      const params = {
        pageNo: this.pageNoClassif,
        name: this.classifsForm.name,
        code: this.classifsForm.code
      }
      that.$axios.post('cloud/authority/queryAssetsClassif2', params).then(res => {
        if (res.data.code == 200) {
          that.tableDataClassif = res.data.data.list
          that.totalClassif = res.data.data.total
        }
      })
    },
    handleSearchClassif() {
      this.pageNoClassif = 1
      this.queryByPageClassif()
    },
    handleCurrentChangeClassif() {
      this.queryByPageClassif()
    },
    //显示资产分类界面
    showSelectDialog(row) {
      this.searchForm.classifName = row.name
      this.assetsClassifsVisible = false
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
