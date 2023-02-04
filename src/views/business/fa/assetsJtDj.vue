<template>
  <div>
    <div class="searchView">
      <el-form label-width="80px" :inline="true">
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

        <el-form-item label="计提期间">
          <el-date-picker
              v-model="searchForm.jtDate"
              type="monthrange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click.native="handleSearch">查询</el-button>
          <!--          <el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading" icon="el-icon-refresh"-->
          <!--                     @click.native="ksjt">快速计提-->
          <!--          </el-button>-->
          <!--          <el-button type="primary" icon="el-icon-plus" @click.native="dialogAdd">新增</el-button>-->
          <!--          <el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading" icon="el-icon-delete"-->
          <!--                     @click.native="deleteButton">删除-->
          <!--          </el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <div class="toolView" style="margin-top: 0px">
      <el-button style="font-size: 15px" type="text" v-loading.fullscreen.lock="fullscreenLoading" icon="el-icon-refresh" @click="ksjt" size="small">快速计提</el-button>
      <el-button style="font-size: 15px" type="text" icon="el-icon-plus" @click="dialogAdd" size="small">新增</el-button>
      <el-button style="font-size: 15px" type="text" v-loading.fullscreen.lock="fullscreenLoading" icon="el-icon-delete" @click="deleteButton" size="small">删除</el-button>
    </div>
    <div class="table">
      <!--列表-->
      <el-table :data="tableData" border stripe @row-dblclick="goDetail" @selection-change="selectionChange"
                max-height="650" row-key="id">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column type="selection" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jt_date" label="计提期间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dj_date" label="单据日期" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="user" label="制单人" align="center" show-overflow-tooltip></el-table-column>
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
    <!--新增界面-->
    <el-dialog title="新增" width="1200px" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <div class="searchView">
        <el-form label-width="100px" :model="dialogSearchForm" :rules="rules" ref="ruleForm">
          <el-row>
            <el-col :span="6">
              <el-form-item label="计提期间">
                <el-input :disabled="true" v-model="dialogSearchForm.jt_date" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单据日期">
                <el-input :disabled="true" v-model="dialogSearchForm.dj_date" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单据编号" prop="dj_code">
                <el-input v-model="dialogSearchForm.dj_code" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="制单人">
                <el-input :disabled="true" v-model="dialogSearchForm.user" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="dialogSearchForm.remark" clearable></el-input>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </div>

      <div class="table">
        <!--列表-->
        <el-table max-height="700px" :data="dialogTableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                  :summary-method="getSummaries"
                  show-summary
                  border highlight-current-row stripe>
          <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
              {{ scope.$index + (currentPage - 1) * pageSize + 1 }}
            </template>

          </el-table-column>
          <el-table-column prop="assets_code" label="资产编码" align="center"></el-table-column>
          <el-table-column prop="assets_name" label="资产名称" align="center"></el-table-column>
          <el-table-column prop="original_value" label="原值" align="center"></el-table-column>
          <el-table-column prop="qcljzj_tx" label="期初累计折旧/摊销" align="center"></el-table-column>
          <el-table-column prop="yjsy" label="预计使用年限(月)" align="center"></el-table-column>
          <el-table-column prop="yjt" label="已计提年限(月)" align="center"></el-table-column>
          <el-table-column prop="yjjczl" label="预计净残值率" align="center"></el-table-column>
          <el-table-column prop="yjjcz" label="预计净残值" align="center"></el-table-column>
          <el-table-column prop="qcsyjt" label="期初剩余计提" align="center"></el-table-column>
          <el-table-column prop="yzje" label="本月折旧/摊销" align="center"></el-table-column>
          <el-table-column prop="yzjl" label="月折旧率/摊销率" align="center"></el-table-column>
          <el-table-column prop="qmljzj_tx" label="期末累计折旧/摊销" align="center"></el-table-column>
          <el-table-column prop="qmsyjt" label="期末剩余计提" align="center"></el-table-column>


        </el-table>
        <!--分页-->
        <div class="pagination">
          <el-pagination
              background
              @current-change="handleCurrentChange1"
              :current-page="currentPage"
              :page-size="pageSize"
              layout="total,prev,pager,next"
              :total="dialogTableData.length">
          </el-pagination>
        </div>
      </div>


      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="add">提交</el-button>
      </div>
    </el-dialog>
  </div>


</template>
<script>
export default {
  name: 'assetsJtDj',
  data() {
    return {
      fullscreenLoading: false,
      dialogVisible: false,
      dialogTableData: [],
      rules: {
        dj_code: [{required: true, message: '请输入编码', trigger: 'blur'}]
      },
      currentPage: 1,  // 当前页码
      dialogSearchForm: {
        user: localStorage.getItem('name'),
        remark: '',
        dj_code: '',
        dj_date: '',
        jt_date: ''
      },


      searchForm: {
        djDate: [],
        jtDate: []
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
    }
  },
  mounted() {
    this.queryByPage()
  },
  methods: {
    goDetail(row) {
      this.$history.push({
        path: 'runCode?path=JtDetails&title=计提折旧明细',
        query: {
          id: row.id
        }
      })

    },
    //快速计提
    ksjt() {
      this.fullscreenLoading = true;
      let params = {
        pageNo: this.pageNo,
        userName: localStorage.getItem('name'),
      }
      this.$axios.post('cloud/entrance/jtCount', params).then(res => {
        if (res.data.code === 200) {
          this.$message.success("计提成功")
          this.queryByPage()
          this.fullscreenLoading = false;
        } else {
          this.fullscreenLoading = false;
          this.$message.error(res.data.message)
        }
      })
    },
    queryByPage() {
      let params = {
        pageNo: this.pageNo,

      }
      //单据日期
      if (this.searchForm.djDate != null) {
        if (this.searchForm.djDate.length > 1) {
          params.djDateStart = this.searchForm.djDate[0]
          params.djDateEnd = this.searchForm.djDate[1]
        }
      }
      //计提期间
      if (this.searchForm.jtDate != null) {
        if (this.searchForm.jtDate.length > 1) {
          params.jtDateStart = this.searchForm.jtDate[0]
          params.jtDateEnd = this.searchForm.jtDate[1]
        }
      }
      this.$axios.post('cloud/entrance/getJtDjPage', params).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
          this.pageSize = res.data.data.pageSize
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    //新增弹窗
    dialogAdd() {
      let params = {
        pageNo: this.pageNo,
        userName: localStorage.getItem('name'),
      }
      this.$axios.post('cloud/entrance/jtCountShow', params).then(res => {
        if (res.data.code === 200) {
          this.dialogTableData = res.data.data
          if (this.dialogTableData != null || this.dialogTableData.length > 0) {
            this.dialogSearchForm.dj_date = this.dialogTableData[0].dj_date
            this.dialogSearchForm.jt_date = this.dialogTableData[0].jt_date
            this.dialogSearchForm.dj_code = this.dialogTableData[0].dj_code
            this.dialogSearchForm.remark = this.dialogTableData[0].remark
          }
          this.dialogVisible = true
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    //新增提交
    add() {
      this.fullscreenLoading = true;
      let params = {
        userName: localStorage.getItem('name'),
        dj_code: this.dialogSearchForm.dj_code,
        remark: this.dialogSearchForm.remark
      }
      this.$axios.post('cloud/entrance/jtCount', params).then(res => {
        if (res.data.code === 200) {
          this.$message.success("计提成功")
          this.dialogVisible = false
          this.fullscreenLoading = false;
          this.queryByPage()
        } else {
          this.fullscreenLoading = false;
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
      this.fullscreenLoading = true;
      let params = {
        id:JSON.stringify(this.row)
      }
      this.$axios.post('cloud/entrance/jtDelete', params).then(res => {
        if (res.data.code === 200) {
          this.$message.success("删除成功")
          this.queryByPage()
          this.fullscreenLoading = false;
        } else {
          this.queryByPage()
          this.fullscreenLoading = false;
          this.$message.error(res.data.message)
        }
      })

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
          this.ids += ',' + data.id
        } else {
          this.ids = data.id
        }
      })
    },
    handleCurrentChange1(val) {
      this.currentPage = val;
    },

    // 求和操作
    getSummaries(param) {
      param.data = this.dialogTableData
      const {columns, data} = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计:'
        }
            // if (index === 8) {
            //   sums[index] = '总记录数:' + this.total
            // }
            // index >= 5 || index <= 7 是你需要计算的列
            // 当然也可以指定一个或者多个列
        // index === 2 || index === 3 这样值求和第二个与第三个列

        else if (index === 3 || index === 4 || index === 5 || index === 6 ||
            index === 8 || index === 9 || index === 10 || index === 12 || index === 13) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                // 保存了两位小数点
                return Math.floor((prev + curr) * 100) / 100;
              } else {
                // 保存了两位小数点
                return Math.floor(prev * 100) / 100;
              }
            }, 0)
            sums[index] += ' ';
          } else {
            sums[index] = 'N/A'
          }
        } else {
          // sums[index] = ''
        }
      })
      return sums
    },
  }
}
</script>
<style scoped>
.container {
  padding: 15px;
}

</style>