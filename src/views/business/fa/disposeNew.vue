<template>
  <div>
    <div class="searchView disposeNew">
      <el-form :model="searchForm" ref="searchForm" label-width="110px" :rules="rules" :inline="true">
        <el-row>
          <el-col :span="6">
            <el-form-item label="单据日期" prop="dj_date">
              <el-date-picker
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  v-model="searchForm.dj_date"
                  type="date"
                  placeholder="选择单据日期"
                  @change="changePicker"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处置期间">
              <el-input disabled v-model="searchForm.cz_date" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编号" prop="dj_code">
              <el-input v-model="searchForm.dj_code" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="处置方式">
              <el-select
                  v-model="searchForm.czfs"
                  filterable
                  placeholder="请选择处置方式"
              >
                <el-option
                    v-for="item in czfsOptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>

          <el-col :span="6">
            <el-form-item label="备注">
              <el-input v-model="searchForm.remark" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="制单人">
              <el-input disabled v-model="searchForm.user" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-folder-add" @click.native="add">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <div class="table">
      <div class="toolView" style="margin-top: 0px">
        <el-button style="font-size: 15px" type="text" icon="el-icon-plus" @click="addLine()" size="small">添加一行</el-button>
      </div>
      <el-table :key="randomKey" max-height="450px" :summary-method="getSummaries" show-summary
                @cell-dblclick="editCell"
                :data="tableData" border highlight-current-row stripe>
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>

        </el-table-column>
        <el-table-column :render-header="addRedStar" label="资产编码" prop="assets_code" align="center">
          <template slot-scope="{row,column,$index}">
            <el-input
                @blur="alterData(row,column)"
                :ref="column.property"
                type="text"
                v-model="row.assets_code"
                v-show="row[column.property + 'isShow']"
            >
              <el-button v-show="row[column.property + 'isShow']" @mousedown.native="queryAssetsPage(row,column,$index)"
                         style="padding-right:10px" slot="suffix" type="text">
                <i class="el-icon-more"></i></el-button>

            </el-input>
            <span v-show="!row[column.property + 'isShow']">{{ row.assets_code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资产名称" prop="assets_name" align="center"></el-table-column>
        <el-table-column label="资产分类" prop="classif_name" align="center"></el-table-column>
        <el-table-column label="数量" prop="number" align="center"></el-table-column>
        <el-table-column label="原值" prop="original_value" align="center"></el-table-column>
        <el-table-column label="本月计提" prop="sfbyjt" align="center">
          <template slot-scope="{row,column,$index}">
            <el-select
                @change="selectChan1(row,column,$index)"
                v-model="row.sfbyjt"
                v-show="row[column.property + 'isShow'] && sfbyjtShow"
                :ref="column.property"
                placeholder="请选择"
            >
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
            <span v-show="!row[column.property + 'isShow'] && !sfbyjtShow">{{ row.sfbyjt }}</span>
            <span v-show="!row[column.property + 'isShow'] && sfbyjtShow">{{ row.sfbyjt }}</span>
          </template>

        </el-table-column>
        <el-table-column label="本月折旧/摊销" prop="yzje" align="center"></el-table-column>
        <el-table-column label="累计折旧/摊销" prop="ljzj_tx" align="center"></el-table-column>
        <el-table-column label="净值" prop="net_value" align="center"></el-table-column>
        <el-table-column :render-header="addRedStar" label="处置方式" prop="czfsname" align="center">
          <template slot-scope="{row,column,$index}">
            <el-select
                @change="selectChan(row,column,$index)"
                v-model="row.czfsname"
                v-show="row[column.property + 'isShow']"
                :ref="column.property"
                placeholder="请选择"
            >
              <el-option
                  v-for="item in czfsOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
              >
              </el-option>
            </el-select>
            <span v-show="!row[column.property + 'isShow']">{{ row.czfsname }}</span>
          </template>

        </el-table-column>

        <el-table-column width="150px" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="addLine()"
            > 添加
            </el-button
            >
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>

    </div>

    <!--显示资产选择界面-->
    <el-dialog @close='handleCancle' title="请选择" width="750px" :visible.sync="assetsVisible"
               :close-on-click-modal="false">
      <div class="searchView">
        <el-form label-width="115px">
          <el-row>
            <el-col :span="9">
              <el-form-item label="资产分类编码">
                <el-input v-model="assetsSearchForm.assetsCode" clearable placeholder="请输入编码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="资产分类名称">
                <el-input v-model="assetsSearchForm.name" clearable placeholder="请输入名称"></el-input>
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
      <div class="table">
        <!--列表-->
        <el-table :data="assetsTableData" border highlight-current-row stripe>
          <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
          <el-table-column prop="assets_code" label="资产分类编码" align="center"></el-table-column>
          <el-table-column prop="assets_name" label="资产分类名称" align="center"></el-table-column>
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
              @current-change="handleCurrentChange"
              layout="total, prev, pager, next"
              :current-page.sync="pageNo"
              :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>


</template>

<script>
export default {
  name: 'assetsSplitNew',
  data() {
    return {
      sfbyjtShow: false,
      randomKey: Math.random(),
      assetsVisible: false,
      rules: {
        dj_code: [{required: true, message: '请输入编码', trigger: 'blur'}],
        dj_date: [{required: true, message: '请输入编码', trigger: 'blur'}],
        czfs: [{required: true, message: '请输入选择', trigger: 'change'}]
      },
      searchForm: {
        dj_date: new Date().getFullYear()+ "-" + (new Date().getMonth() + 1).toString().padStart(2, "0") + "-"+ new Date().getDate().toString().padStart(2, "0"),
        dj_code: '',
        cz_date: '',
        czfs: '',
        remark: '',
        user: localStorage.getItem("name"),

      },
      assetsSearchForm: {
        name: '',
        assetsCode: '',

      },
      tableData: [],
      tableData2: [],

      assetsTableData: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      czfsOptions: [],
      row: {},

      sums: [],
      tableRow: null,
      tableColumn: null,
      tableIndex: null,
      options: [
        {
          value: '是',
          label: '是'
        }, {
          value: '否',
          label: '否'
        }
      ]


    }
  },
  mounted() {
    this.changePicker()
    this.queryCzfs()
  },

  methods: {
    selectChan(row, column, i) {
      this.alterData(row, column)
      if (row.czfsname) {
        let a = this.czfsOptions.find(v => row.czfsname == v.code)
        this.tableData[i].czfsname = a.name
        this.tableData[i].czfscode = a.code
      }
    },
    selectChan1(row, column, i) {
      this.alterData(row, column)
    },
    //资产编码弹窗关闭事件
    handleCancle() {
      this.assetsVisible = false
      this.alterData(this.tableRow, this.tableColumn)
    },
    //查询资产属性列表
    queryAssetsPage(row, column, $index) {
      this.tableRow = row
      this.tableColumn = column
      this.tableIndex = $index
      let that = this
      const params = {
        pageNo: this.pageNo,
        name: this.assetsSearchForm.name,
        assetsCode: this.assetsSearchForm.assetsCode,
        //zjState: "1",
        fc: "2",
      }
      that.$axios.post('cloud/entrance/getBaseInfoList', params).then(res => {
        if (res.data.code == 200) {
          that.assetsTableData = res.data.data.list
          that.total = res.data.data.total
          that.assetsVisible = true
        }
      })
    },
    //显示资产分类界面
    showSelectDialog(row) {
      let a = this.tableData.find(v => row.id == v.id)
      if (a != null) {
        this.assetsVisible = false
        return this.$message.warning("[" + row.assets_code + "资产重复选择！]")
      }
      this.tableData[this.tableIndex].assets_code = row.assets_code
      this.tableData[this.tableIndex].assets_name = row.assets_name
      this.tableData[this.tableIndex].number = row.number
      this.tableData[this.tableIndex].original_value = row.original_value
      this.tableData[this.tableIndex].yzje = row.yzje
      this.tableData[this.tableIndex].yzjeShow = row.yzje
      this.tableData[this.tableIndex].ljzj_tx = row.ljzj_tx
      this.tableData[this.tableIndex].net_value = row.net_value
      this.tableData[this.tableIndex].id = row.id
      this.tableData[this.tableIndex].classif_name = row.classif_name
      this.tableData[this.tableIndex].classif_code = row.classif_code
      this.tableData[this.tableIndex].carryto_date = row.carryto_date
      this.tableData[this.tableIndex].sfbyjt = '是'
      this.tableData[this.tableIndex].yjt_year = row.yjt_year
      this.tableData[this.tableIndex].yjt_month = row.yjt_month
      this.assetsVisible = false
    },
    //单据期间
    changePicker() {
      this.searchForm.cz_date = this.searchForm.dj_date.substr(0, 7)
      this.searchForm.dj_code = "CZ-" + this.searchForm.cz_date + "-" + Math.floor(Math.random() * 10000)
      this.$axios.post('cloud/entrance/getMxDjDate').then(res => {
        if (res.data.code == 200) {
          if (res.data.data != null && res.data.data.length > 0) {
            res.data.data.maxDate
            if (this.searchForm.dj_date > res.data.data[0].maxDate) {
              this.sfbyjtShow = true
            } else {
              this.sfbyjtShow = false
            }
          }

        }
      })
    },
    //卡片日期
    changePicker1(row, column) {
      if (row.card_date > this.searchForm.dj_date) {
        row.card_date = this.searchForm.dj_date
        this.$message.error("卡片日期不能大于单据日期")
      }
    },


    //判断是否有提计
    add() {
      if (this.tableData == 0) {
        return this.$message.error("请添加数据")
      }
      //验证必填
      let flag = this.flag()
      if (flag) {
        //资产处置的单据日期不能早于固定资产卡片的入账日期
        let a = this.tableData.find(value => this.searchForm.dj_date < value.carryto_date)
        if (a != null) {
          return this.$message.error("处置日期早于当前资产入账日期,不能保存")
        }
        let that = this
        var params = {
          date: that.searchForm.dj_date.substring(0, 7)
        }
        that.$axios.post('cloud/entrance/getjtDate', params).then(res => {
          if (res.data.code == 200) {
            if (res.data.data.flag == true ) {
              that.add3()
            } else if (res.data.data.flag == false && that.searchForm.dj_date == res.data.data.max){
              that.add3()
            } else  {
              that.$message.error(res.data.data.dj_date + "日存在计提折旧/摊销单据，当前单据日期必须大于该日期，请修改单据日期。")
            }
          } else {
            that.$message.error(res.data.message)
          }

        })
      }
    },
    //保存新增
    add3() {
      //验证新增规则
      this.$axios.post('cloud/entrance/ruleAdd', {date: this.searchForm.dj_date}).then(res => {
        if (res.data.code == 200) {
          this.$refs.searchForm.validate(valid => {
            if (valid) {
              let that = this
              const params = {
                searchForm: JSON.stringify(this.searchForm),
                tableData: JSON.stringify(this.tableData),
              }
              that.$axios.post('cloud/entrance/addDispose', params).then(res => {
                if (res.data.code == 200) {
                  this.$data.searchForm = this.$options.data().searchForm
                  this.tableData = []
                  this.tableData2 = []
                  this.changePicker()
                  this.$message.success("保存成功")
                }

              })


            }

          })

        } else {
          return this.$message.error(res.data.message)
        }
      })
    },
    //判断tableData必填项
    flag() {
      let flag = true
      this.tableData.forEach((v, i) => {
        if (!v.czfsname) {
          flag = false
          return this.$message.error("请选择处置方式")
        }
      })
      return flag
    },

    /* 删除 */
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
    },
    /* 添加新的一行 (默认是可编辑状态)*/
    addLine() {

      let obj = {
        assets_code: '',
        assets_name: '',
        classif_name: '',
        number: '',
        original_value: '',
        yzje: '',
        ljzj_tx: '',
        net_value: '',
        czfscode: '',
        czfsname: '',
        sfbyjt: '',
        isShow: true
      };
      this.tableData.push(obj);
    },


    handleSearch() {
      this.pageNo = 1
      this.queryAssetsPage(this.tableRow, this.tableColumn, this.tableIndex)
    },
    handleCurrentChange(val) {
      this.queryAssetsPage(this.tableRow, this.tableColumn, this.tableIndex)
    },
    addHeaderCellClassName({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0 || columnIndex === 1) {
        return 'requiredclass'
      }
    },
    // 处理鼠标双击单元格
    editCell(row, column) {
      // 把该行该列（某单元格）标记属性是否显示
      row[column.property + 'isShow'] = true
      if (column.property == 'sfbyjt' && !this.sfbyjtShow) {
        row[column.property + 'isShow'] = false
      }
      this.refreshTable()
      this.$nextTick(() => {
        this.$refs[column.property] && this.$refs[column.property].focus()
      })
    },
    // 重新渲染该列
    refreshTable() {
      // 因为设置了isShow，但是该节点并不是响应式的，所以需要通过修改key重新渲染节点上去
      this.randomKey = Math.random()
    },
    // 失去焦点处理
    alterData(row, column) {
      row[column.property + 'isShow'] = false
      this.refreshTable()
    },
    // 求和操作
    getSummaries(param) {

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

        else if (index === 4 || index === 5 || index === 7 || index === 8 || index === 9
        ) {
          const values = data.map(item => Number(item[column.property]))
          if (index === 4){
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
                return isNaN(Number(prev)) ? 0 : (Number(prev).toFixed(point))
              }
            }, 0)
           // sums[index] += ' ';
          } else {
            sums[index] = ' '
          }
        } else {
          // sums[index] = ''
        }
      })
      sums.forEach((v,i)=>{
        if (i!=0 && !isNaN(v) && v!=''){
          sums[i] = i==4?Number(v+'').toLocaleString():this.b0(Number(v+'').toLocaleString(),2)
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
    // 给表头加必填符号*
    addRedStar(h, {column}) {
      return [
        h("span", {style: "color: red"}, "*"),
        h("span", " " + column.label),
      ];
    },

    //获取拆分原因
    async queryCzfs() {
      let params = {
        name: '处置方式'
      }
      let res = await this.$axios.post('/cloud/entrance/getDictDetailByName', params)
      if (res.data.code == 200) {
        this.czfsOptions = res.data.data
      }
    },
  }
}
</script>
<style scoped>

.disposeNew .el-input.is-disabled .el-input__inner{
  color: #070707 !important;
}

.container {
  padding: 15px;
}

.el-main {
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

.el-table__body tr.current-row td:not(.is-center) {
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
}

.el-aside .el-table__body tr.current-row .is-center {
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}

.aside .el-table td {
  border-bottom: 0px solid #ebeef5;
}
</style>
