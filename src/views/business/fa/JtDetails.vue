<template>
  <div class="container JtDetails">


    <div class="searchView">
      <el-form label-width="100px" :model="searchForm" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="计提期间">
              <el-input :disabled="true" v-model="searchForm.jt_date" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据日期">
              <el-input :disabled="true" v-model="searchForm.dj_date" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编号" prop="dj_code">
              <el-input :disabled="true" v-model="searchForm.dj_code" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="制单人">
              <el-input :disabled="true" v-model="searchForm.user" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input :disabled="true" v-model="searchForm.remark" clearable></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </div>

    <div class="table">
      <!--列表-->
      <el-table max-height="600px" :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
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
        <el-table-column  label="预计净残值率" align="center">
          <template slot-scope="scope">
            {{ scope.row.yjjczl?b0(scope.row.yjjczl,6):scope.row.yjjczl }}
          </template>
        </el-table-column>
        <el-table-column prop="yjjcz" label="预计净残值" align="center"></el-table-column>
        <el-table-column prop="qcsyjt" label="期初剩余计提" align="center"></el-table-column>
        <el-table-column prop="yzje" label="本月折旧/摊销" align="center"></el-table-column>
        <el-table-column prop="yzjl" label="月折旧率/摊销率" align="center">
          <template slot-scope="scope">
            {{ scope.row.yzjl?b0(scope.row.yzjl,4):scope.row.yzjl }}
          </template>
        </el-table-column>
        <el-table-column prop="qmljzj_tx" label="期末累计折旧/摊销" align="center"></el-table-column>
        <el-table-column prop="qmsyjt" label="期末剩余计提" align="center"></el-table-column>


      </el-table>
      <!--分页-->
      <div class="pagination">
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total,prev,pager,next"
            :total="tableData.length">
        </el-pagination>
      </div>
    </div>


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
      tableData: [],
      tableDataSum: [],
      pageNo: 1,

      searchForm: {
        user: localStorage.getItem('name'),
        remark: '',
        dj_code: ''
      },
      rules: {
        dj_code: [{required: true, message: '请输入编码', trigger: 'blur'}]
      },
      currentPage: 1,  // 当前页码
      pageSize: 10,  // 每页显示的行数


    }
  },
  created() {
    this.queryByPage()
  },
  methods: {
    //查询详情
    queryByPage() {
      let that = this
      const params = {
        id: this.$history.history.current.query.id
      }
      that.$axios.post('cloud/entrance/getMxByDjId', params).then(res => {
        if (res.data.code == 200) {
          that.tableData = res.data.data
          if (that.tableData != null || that.tableData.length > 0) {
            that.searchForm.dj_date = that.tableData[0].dj_date
            that.searchForm.jt_date = that.tableData[0].jt_date
            that.searchForm.dj_code = that.tableData[0].dj_code
            that.searchForm.user = that.tableData[0].user
            that.searchForm.remark = that.tableData[0].remark

          }
        }
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },

    // 求和操作
    getSummaries(param) {
      param.data = this.tableData
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
          if (index === 5 || index === 6){
            var point = 0 // 几位小数点
          }else {
            var point = 2 // 几位小数点
          }
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                var decimals = String(curr).indexOf(".") + 1
                if (decimals > 0 && String(curr).length - decimals > point) {
                  point = String(curr).length - decimals
                }
                prev = this.$BigNumber(prev)
                return isNaN(Number(prev.plus(curr).toString())) ? 0 : Number(prev.plus(curr).toString()).toFixed(point)
              } else {
                return isNaN(Number(prev)) ? 0 : Number(prev).toFixed(point)
              }
            }, 0)
            //sums[index] += ' ';
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      sums.forEach((v,i)=>{
        if (i!=0 && !isNaN(v) && v!=''){
          sums[i] = i==5||i==6?Number(v+'').toLocaleString():this.b0(Number(v+'').toLocaleString(),2)
        }
      })
      return sums
    },
    //保留几位小数补0
    b0(v,n){
      var s = v.toString();
      var rs = s.indexOf('.');
      if (rs < 0) {
        rs = s.length;
        s += '.';
      }
      while (s.length <= rs + n) {
        s += '0';
      }
      return s
    },


  }
}
</script>
<style scoped>

.JtDetails .el-input.is-disabled .el-input__inner{
  color: #070707 !important;
}

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
