<template>
  <div class="container">


    <div class="searchView">
      <el-form label-width="115px">
        <el-row>
          <!--              <el-col :span="1">-->
          <!--                <el-form-item label-width="50px">-->
          <!--                <el-radio label="1" v-model="searchForm.radio">{{''}}</el-radio>-->
          <!--                </el-form-item>-->
          <!--              </el-col>-->
          <!--              <el-col :span="5">-->
          <!--                <el-form-item label="入账期间">-->
          <!--                  <el-date-picker-->
          <!--                      :disabled="searchForm.radio=='1'?false:true"-->
          <!--                      v-model="searchForm.rzqj"-->
          <!--                      type="monthrange"-->
          <!--                      align="right"-->
          <!--                      unlink-panels-->
          <!--                      range-separator="至"-->
          <!--                      start-placeholder="开始月份"-->
          <!--                      end-placeholder="结束月份"-->
          <!--                      :picker-options="pickerOptions">-->
          <!--                  </el-date-picker>-->
          <!--                </el-form-item>-->
          <!--              </el-col>-->
          <!--              <el-col :span="1">-->
          <!--                <el-form-item label-width="50px">-->
          <!--                  <el-radio v-model="searchForm.radio" label="2">{{''}}</el-radio>-->
          <!--                </el-form-item>-->
          <!--              </el-col>-->
          <el-col :span="6">
            <el-form-item label="入账日期">
              <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="searchForm.carryto_date"
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
          <el-col :span="6">
            <el-form-item label="卡片日期">
              <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="searchForm.card_date"
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
          <el-col :span="6">
            <el-form-item label="资产分类">
              <el-select v-model="searchForm.classifCode" multiple placeholder="请选择资产分类">
                <el-option
                    v-for="item in classify"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产名称">
              <el-input v-model="searchForm.name" clearable placeholder="请输入资产名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="折旧期间">
              <el-date-picker
                  value-format="yyyy-MM"
                  v-model="searchForm.zjqj"
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
          <el-col :span="6">
            <el-form-item label="折旧/摊销状态">
              <el-select clearable v-model="searchForm.zjState" placeholder="请选择折旧/摊销状态">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否封存">
              <el-select clearable v-model="searchForm.fc" placeholder="请选择是否封存">
                <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button
                type="primary"
                icon="el-icon-search"
                @click.native="handleSearch"
                style="margin-left: 15px"
            >查询
            </el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="toolView" style="margin-top: 0px">
      <el-button style="font-size: 15px" type="text" icon="el-icon-plus" @click="routerNewAssets()" size="small">新增资产</el-button>
      <el-button style="font-size: 15px" type="text" icon="el-icon-delete" @click="deleteAssets()" size="small">删除</el-button>
      <el-button style="font-size: 15px" type="text" icon="el-icon-document-copy" @click="copy" size="small">复制</el-button>
    </div>
    <div class="table">
      <!--列表-->
      <el-table  :data="tableData"
                 ref="tableList"
                 :summary-method="getSummaries"
                 show-summary
                 @row-dblclick="openDetails"
                 border
                 stripe
                 max-height="600"
                 default-expand-all
      >
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column type="selection" width="55"  align="center"></el-table-column>
        <el-table-column width="100" sortable prop="card_date" label="卡片日期" align="center"></el-table-column>
        <el-table-column width="120" sortable prop="classif_name" label="资产分类名称" align="center" ></el-table-column>
        <el-table-column width="160" sortable prop="assets_code" label="资产编码" align="center" ></el-table-column>
        <el-table-column width="120" sortable prop="assets_name" label="资产名称" align="center"></el-table-column>
        <el-table-column width="100" sortable prop="model" label="规格型号" align="center"></el-table-column>
        <el-table-column width="70" sortable prop="number" label="数量" align="center"></el-table-column>
        <el-table-column width="100" sortable prop="carryto_date" label="入账日期" align="center"></el-table-column>
        <el-table-column width="120" sortable label="预计使用年限" align="center">
          <template slot-scope="scope">
            {{ scope.row.yjsy_year != null&&scope.row.yjsy_year != 0 &&scope.row.yjsy_year != 'null'&&scope.row.yjsy_year != '0' ? scope.row.yjsy_year + '年' : '' }}
            {{ scope.row.yjsy_month != null&&scope.row.yjsy_month != 0 &&scope.row.yjsy_month != 'null'&&scope.row.yjsy_month != '0' ? scope.row.yjsy_month + '月' : '' }}
          </template>
        </el-table-column>
        <el-table-column width="110" sortable label="已计提年限" align="center">
          <template slot-scope="scope">
            {{ scope.row.yjt_year != null&&scope.row.yjt_year != 0 &&scope.row.yjt_year != 'null'&&scope.row.yjt_year != '0'? scope.row.yjt_year + '年' : '' }}
            {{ scope.row.yjt_month != null&&scope.row.yjt_month != 0 &&scope.row.yjt_month != 'null'&&scope.row.yjt_month != '0' ? scope.row.yjt_month + '月' : '' }}
          </template>
        </el-table-column>
        <el-table-column width="80" sortable prop="original_value" label="原值" align="center"></el-table-column>
        <el-table-column width="130" sortable prop="ljzj_tx" label="累计折旧/摊销" align="center"></el-table-column>
        <el-table-column width="80" sortable prop="net_value" label="净值" align="center"></el-table-column>
        <el-table-column width="110" sortable prop="yjjcz" label="预计净残值" align="center"></el-table-column>
        <el-table-column width="100" sortable prop="yzje" label="月折旧额" align="center"></el-table-column>
        <el-table-column width="70" sortable :formatter="qcFormatter" prop="qc" label="期初" align="center"></el-table-column>
        <el-table-column width="70" sortable :formatter="qcFormatter2" prop="fc" label="封存" align="center">
        </el-table-column>
        <el-table-column width="100" sortable prop="jk_date" label="建卡日期" align="center"></el-table-column>
        <el-table-column width="100" sortable prop="qjzje" label="期间折旧" align="center"></el-table-column>
        <el-table-column width="100" sortable prop="cj_date" label="处置日期" align="center"></el-table-column>
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

    <!--多部门比例界面-->
    <el-dialog title="复制数量:" width="400px" :visible.sync="copyVisible" :close-on-click-modal="false">

      <el-input type="number" v-model="copyNum" placeholder="请输入数量" clearable></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="copySubmit">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      copyNum:1,
      copyVisible:false,
      ids:'',
      action: this.$axios.defaults.baseURL + 'user/import',
      headers: {
        Authorization: localStorage.getItem('Authorization')
      },
      clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
      tableData: [],
      tableDataSum: [],
      pageNo: 1,
      total: 0,
      searchForm: {
        carryto_date: '',
        card_date: '',
        classifCode: '',
        name: '',
        zjqj: '',
        zjState: '',
        fc: '',
        propertyId: '',
        rzqj: undefined,
      },
      classify: [],
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
      options: [{
        value: '1',
        label: '已折旧/摊销完毕'
      }, {
        value: '2',
        label: '未折旧/摊销完毕'
      }],
      options1: [{
        value: '1',
        label: '是'
      }, {
        value: '2',
        label: '否'
      }]
    }
  },
  created() {
    this.queryClassify()
    this.queryByPage()
    this.queryBySum()
  },
  methods: {
    //复制
    copy(){
      let _selectData=this.$refs.tableList.selection;
      if (_selectData.length<=0){
        this.$message({
          message: '请至少选择一个资产！',
          type: 'warning'
        });
        return
      }
      let idss=[]
      for (let i=0 ;i<_selectData.length;i++){
        idss.push(_selectData[i].id)
      }
      idss =idss.join(',')
      this.ids=idss
      let params = {
        ids:idss
      }
      this.$axios.post('cloud/entrance/copyRule', params).then(res => {
        if (res.data.code == 200) {
          this.copyVisible=true
        }else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          });
        }
      })


    },
    //复制确认
    copySubmit(){
      if (!this.copyNum>0){
        this.$message({
          message: '请输入整数数量！',
          type: 'warning'
        });
        return
      }
      let params = {
        ids:this.ids,
        copyNum:this.copyNum
      }//
      this.$axios.post('cloud/entrance/copyAdd', params).then(res => {
        if (res.data.code == 200) {
          this.queryByPage()
          this.copyVisible=false
          this.copyNum=1
        }else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          });
        }
      })


    },
    //查询资产分类
    async queryClassify() {
      let res = await this.$axios.post('/cloud/entrance/queryAssetsClassif')
      if (res.data.code == 200) {
        this.classify = res.data.data
      }

    },
    //查询资产属性列表
    queryByPage() {
      let that = this
      const params = {
        pageNo: this.pageNo,
        name: this.searchForm.name,
        zjState: this.searchForm.zjState,
        fc: this.searchForm.fc,
      }
      //入账时间
      if (this.searchForm.carryto_date != null) {
        if (this.searchForm.carryto_date.length > 1) {
          params.carrytoDateStart = this.searchForm.carryto_date[0]
          params.carrytoDateEnd = this.searchForm.carryto_date[1]
        }

      }
      //卡片时间
      if (this.searchForm.card_date != null) {
        if (this.searchForm.card_date.length > 1) {
          params.cardDateStart = this.searchForm.card_date[0]
          params.cardDateEnd = this.searchForm.card_date[1]
        }
      }
      //折旧期间
      if (this.searchForm.zjqj != null && this.searchForm.zjqj.length > 1) {
        params.zjqjStart = this.searchForm.zjqj[0]
        params.zjqjEnd = this.searchForm.zjqj[1]
      }
      if (this.searchForm.classifCode) {
        params.ccode = this.searchForm.classifCode.join(",")
      }
      that.$axios.post('cloud/entrance/getBaseInfoList', params).then(res => {
        if (res.data.code == 200) {
          that.queryBySum()
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    //合计数据
    queryBySum() {
      let that = this
      const params = {
        name: this.searchForm.name,
        zjState: this.searchForm.zjState,
        fc: this.searchForm.fc,
      }
      //入账时间
      if (this.searchForm.carryto_date != null && this.searchForm.carryto_date.length > 1) {
        params.carrytoDateStart = this.searchForm.carryto_date[0]
        params.carrytoDateEnd = this.searchForm.carryto_date[1]
      }
      //卡片时间
      if (this.searchForm.card_date != null && this.searchForm.card_date.length > 1) {
        params.cardDateStart = this.searchForm.card_date[0]
        params.cardDateEnd = this.searchForm.card_date[1]
      }
      //折旧期间
      if (this.searchForm.zjqj != null && this.searchForm.zjqj.length > 1) {
        params.zjqjStart = this.searchForm.zjqj[0]
        params.zjqjEnd = this.searchForm.zjqj[1]
      }
      if (this.searchForm.classifCode) {
        params.ccode = this.searchForm.classifCode.join(",")
      }
      that.$axios.post('cloud/entrance/getBaseInfoList', params).then(res => {
        if (res.data.code == 200) {
          that.tableDataSum = res.data.data
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
    qcFormatter(obj) {
      if (obj.qc == '1') {
        return '是'
      } else {
        return '否'
      }
    },
    qcFormatter2(obj) {
      if (obj.fc == '1') {
        return '是'
      } else {
        return '否'
      }
    },
    routerNewAssets() {
      this.$history.push("runCode?path=newAssets&title=新增资产")
    },
    deleteAssets(){
      let _selectData=this.$refs.tableList.selection;
      if (_selectData.length<=0){
        this.$message({
          message: '请至少选择一个资产！',
          type: 'warning'
        });
        return
      }
      let idss=[]
      for (let i=0 ;i<_selectData.length;i++){
        idss.push(_selectData[i].id)
      }
      idss =idss.join(',')
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids:idss
        }
        this.$axios.post('/cloud/authority/batchDeleteBase', params).then(res => {
          if (res.data.code == 200) {
            this.$message.success("删除成功")
            this.queryByPage()
          }else{
            this.$message({
              dangerouslyUseHTMLString: true,
              message: res.data.message,
              type: 'warning'
            });
          }
        })
      })

    },
    // 求和操作
    getSummaries(param) {
      param.data = this.tableDataSum
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

        else if (index === 7 || index === 11 || index === 12|| index === 13|| index === 14|| index === 15 ) {
          const values = data.map(item => Number(item[column.property]))
          if (index === 7){
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
            sums[index] = ' '
          }
        } else {
          // sums[index] = ''
        }
      })
      sums.forEach((v,i)=>{
        if (i!=0 && !isNaN(v) && v!=''){
          sums[i] = i==7?Number(v+'').toLocaleString():this.b0(Number(v+'').toLocaleString(),2)
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
    //跳转详情
    openDetails(row) {
      //row.path='assetsDetails'
      //row.title='资产详情'
      let p = {
        id: row.id
      }
      this.$history.push({
        //path: '/test',
        path: 'runCode?path=assetsDetails&title=资产详情',
        query: p
      });
    }


  }
}
</script>
<style scoped>
.container {
  padding: 15px;
}


</style>
