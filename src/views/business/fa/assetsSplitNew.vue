<template>
  <div>
    <div class="searchView assetsSplitNew">
      <el-form :model="searchForm" ref="searchForm" label-width="110px" :rules="rules" :inline="true">
        <el-row>
          <el-col :span="6">
            <el-form-item label="拆分期间">
              <el-input disabled v-model="searchForm.cf_date" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编号" prop="dj_code">
              <el-input v-model="searchForm.dj_code" clearable></el-input>
            </el-form-item>
          </el-col>
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
            <el-form-item label="拆分原因">
              <el-select
                  v-model="searchForm.reason"
                  filterable
                  placeholder="请选择拆分原因"
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

        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="资产编码" prop="cfq_code">
              <el-input :readonly="true" v-model="searchForm.cfq_code" placeholder="请选择" clearable>
                <el-button @click="queryAssetsPage()" style="padding-right:10px" slot="suffix" type="text">
                  <i class="el-icon-more"></i></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产名称">
              <el-input disabled v-model="searchForm.cfq_name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产分类">
              <el-input disabled v-model="searchForm.classif_name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格型号">
              <el-input disabled v-model="searchForm.cfq_model" clearable></el-input>
            </el-form-item>
          </el-col>


        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="数量">
              <el-input disabled v-model="searchForm.cfq_number" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计量单位">
              <el-input disabled v-model="searchForm.cfq_jldw" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="按数量拆">
              <el-checkbox @change="aslcChange()" :disabled="aslc" v-model="searchForm.checkedAslc">{{
                  ''
                }}
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="6">

            <el-form-item label="原值">
              <el-input disabled v-model="searchForm.cfq_original_value" clearable></el-input>
            </el-form-item>
          </el-col>


        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="税率%">
              <el-input disabled v-model="searchForm.sr" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="进项税额">
              <el-input disabled v-model="searchForm.jxse" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="本月计提">
              <el-checkbox @change="byjtChange()" v-model="searchForm.checkedByjt">{{ '' }}</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="110px" label="本月折旧/摊销">
              <el-input disabled v-model="searchForm.cfq_yzje" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="累计折旧/摊销">
              <el-input disabled v-model="searchForm.cfq_ljzj_tx" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="净值">
              <el-input disabled v-model="searchForm.cfq_net_value" clearable></el-input>
            </el-form-item>
          </el-col>

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
      <el-table :key="randomKey" max-height="450px" :summary-method="getSummaries" show-summary @cell-dblclick="editCell"
                :data="tableData" border highlight-current-row stripe>
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>

        </el-table-column>
        <el-table-column :render-header="addRedStar"  label="资产编码" prop="assets_code" align="center">
          <template slot-scope="{row,column}">
            <el-input
                @blur="alterData(row,column)"
                :ref="column.property"
                type="text"
                v-model="row.assets_code"
                v-show="row[column.property + 'isShow']"
            />
            <span v-show="!row[column.property + 'isShow']">{{ row.assets_code }}</span>
          </template>
        </el-table-column>
        <el-table-column :render-header="addRedStar"  label="资产名称" prop="assets_name" align="center">
          <template slot-scope="{row,column}">
            <el-input
                @blur="alterData(row,column)"
                :ref="column.property"
                type="text"
                v-model="row.assets_name"
                v-show="row[column.property + 'isShow']"
            />
            <span v-show="!row[column.property + 'isShow']">{{ row.assets_name }}</span>
          </template>
        </el-table-column>
        <el-table-column  label="规格型号" prop="model" align="center">
          <template slot-scope="{row,column}">
            <el-input
                @blur="alterData(row,column)"
                :ref="column.property"
                type="text"
                v-model="row.model"
                v-show="row[column.property + 'isShow']"
            />
            <span v-show="!row[column.property + 'isShow']">{{ row.model }}</span>
          </template>
        </el-table-column>
        <el-table-column :formatter="jtFormatter" label="计提方式" prop="jtfs" align="center"></el-table-column>
        <el-table-column :render-header="addRedStar"  label="数量" prop="number" align="center">
          <template slot-scope="{row,column}">
            <el-input
                @blur="alterData(row,column)"
                :ref="column.property"
                type="number"
                v-model="row.number"
                v-show="row[column.property + 'isShow']"
            />
            <span v-show="!row[column.property + 'isShow']">{{ row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column  label="计量单位" prop="jldw" align="center">
          <template slot-scope="{row,column}">
            <el-input
                @blur="alterData(row,column)"
                :ref="column.property"
                type="text"
                v-model="row.jldw"
                v-show="row[column.property + 'isShow']"
            />
            <span v-show="!row[column.property + 'isShow']">{{ row.jldw }}</span>
          </template>
        </el-table-column>
        <el-table-column :render-header="addRedStar"  label="原值" prop="original_value" align="center">
          <template slot-scope="{row,column,$index}">
            <el-input
                @change="upChange(row,column,$index)"
                @blur="alterData(row,column)"
                :ref="column.property"
                onkeyup="value=value.replace(/[^0-9.]/g,'');"
                v-model="row.original_value"
                v-show="row[column.property + 'isShow']"
            />
            <span v-show="!row[column.property + 'isShow']">{{ row.original_value }}</span>
          </template>
        </el-table-column>
        <el-table-column :render-header="addRedStar"  label="进项税额" prop="jxse" align="center">
          <template slot-scope="{row,column,$index}">
            <el-input

                @blur="alterData(row,column)"
                :ref="column.property"
                type="number"
                v-model="row.jxse"
                v-show="row[column.property + 'isShow']"
            />
            <span v-show="!row[column.property + 'isShow']">{{ row.jxse }}</span>
          </template>
        </el-table-column>
        <el-table-column :render-header="addRedStar"  label="累计折旧/摊销" prop="ljzj_tx" align="center">
          <template slot-scope="{row,column,$index}">
            <el-input

                @blur="alterData(row,column)"
                :ref="column.property"
                type="number"
                v-model="row.ljzj_tx"
                v-show="row[column.property + 'isShow']"
            />
            <span v-show="!row[column.property + 'isShow']">{{ row.ljzj_tx }}</span>
          </template>
        </el-table-column>
        <el-table-column label="净值" prop="net_value" align="center">
          <template slot-scope="{row,column}">

            <span>{{ row.net_value }}</span>
          </template>
        </el-table-column>
        <el-table-column :key="randomKey" label="卡片日期" prop="card_date" align="center">
          <template slot-scope="{row,column}">
            <el-date-picker
                @change="changePicker1(row,column)"
                value-format="yyyy-MM-dd"
                @blur="alterData(row,column)"
                :ref="column.property"
                v-model="row.card_date"
                v-show="row[column.property + 'isShow']"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
            <span v-show="!row[column.property + 'isShow']">{{ row.card_date }}</span>
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
    <el-dialog title="请选择" width="750px" :visible.sync="assetsVisible" :close-on-click-modal="false">
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
      randomKey: Math.random(),
      assetsVisible: false,
      dialogVisible: false,
      dialogTableData: [],
      rules: {
        dj_code: [{required: true, message: '请输入编码', trigger: 'blur'}],
        dj_date: [{required: true, message: '请输入编码', trigger: 'blur'}],
        cfq_code: [{required: true, message: '请输入编码', trigger: 'change'}],
        reason: [{required: true, message: '请输入选择', trigger: 'change'}]
      },
      searchForm: {
        dj_date: new Date().getFullYear()+ "-" + (new Date().getMonth() + 1).toString().padStart(2, "0") + "-"+ new Date().getDate().toString().padStart(2, "0"),
        dj_code: '',
        cf_date: '',
        reason: '',
        cfq_code: '',
        cfq_name: '',
        cfq_model: '',
        cfq_number: '',
        cfq_jldw: '',
        cfq_original_value: '',
        cfq_yzje: '',
        cfq_ljzj_tx: '',
        cfq_net_value: '',
        assets_id: '',
        remark: '',
        user: localStorage.getItem("name"),
        classif_code: '',


        checkedAslc: false,
        checkedByjt: false
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

      cfyyOptions: [],
      jtfsOptions: [],
      row: {},
      aslc: true,
      sums: []


    }
  },
  mounted() {
    this.querycfyy()
    this.changePicker()
    this.queryjtfs()
  },

  methods: {
    //本月计提
    byjtChange(){
      if (this.searchForm.checkedByjt){
        this.searchForm.jtfs = "1"
        if (this.tableData!=null&&this.tableData.length>0){
          this.tableData.forEach((v,i)=>{
            this.tableData[i].jtfs = "1"
          })
        }
      }else {
        this.searchForm.jtfs = "2"
        if (this.tableData!=null&&this.tableData.length>0){
          this.tableData.forEach((v,i)=>{
            this.tableData[i].jtfs = "2"
          })
        }
      }

    },
    //查询资产属性列表
    queryAssetsPage() {
      let that = this
      const params = {
        pageNo: this.pageNo,
        name: this.assetsSearchForm.name,
        assetsCode: this.assetsSearchForm.assetsCode,
        zjState: "1",
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
      this.row = row
      this.searchForm.cfq_code = row.assets_code
      this.searchForm.cfq_name = row.assets_name
      this.searchForm.cfq_model = row.model
      this.searchForm.cfq_number = row.number
      this.searchForm.cfq_jldw = row.jldw
      this.searchForm.cfq_original_value = row.original_value
      this.searchForm.cfq_yzje = row.yzje
      this.searchForm.cfq_ljzj_tx = row.ljzj_tx
      this.searchForm.cfq_net_value = row.net_value
      this.searchForm.assets_id = row.id
      this.searchForm.classif_code = row.classif_code
      this.searchForm.classif_name = row.classif_name
      this.searchForm.sr = row.sr
      this.searchForm.jxse = row.jxse
      this.searchForm.jtfs = row.jtfs
      this.searchForm.card_date = row.card_date
      //数量大于1可按数量拆分
      if (row.number > 1) {
        this.aslc = false
      } else {
        this.aslc = true
      }
      var m = (new Date().getMonth() + 1)>9?(new Date().getMonth() + 1):'0'+(new Date().getMonth() + 1)
      //计提方式判断,当月已计提
      if (row.zjqj == new Date().getFullYear() + "-" + m) {
        this.searchForm.jtfs = "1"
        this.searchForm.checkedByjt = true
      } else if (row.zjqj != new Date().getFullYear() + "-" + m
          && this.searchForm.cfq_yzje != '' && this.searchForm.cfq_yzje != undefined) {
        this.searchForm.jtfs = "2"
        this.searchForm.checkedByjt = false
      }
      this.tableData = []
      this.tableData2 = []
      this.assetsVisible = false
    },
    //单据期间
    changePicker() {
      this.searchForm.cf_date = this.searchForm.dj_date.substr(0, 7)
      this.searchForm.dj_code = "CF-" + this.searchForm.cf_date + "-" + Math.floor(Math.random() * 10000)
    },
    //卡片日期
    changePicker1(row, column) {
      if (row.card_date > this.searchForm.dj_date) {
        row.card_date = this.searchForm.dj_date
        this.$message.error("卡片日期不能大于单据日期")
      }
    },
    //计提方式格式化
    jtFormatter(obj) {
      let param = this.jtfsOptions.find(value => value.code == obj.jtfs)
      if (param) {
        return param.name
      } else {
        return obj.jtfs
      }
    },

    //判断是否有提计
    add() {
      //原值
      if (this.sums[9] != this.searchForm.cfq_ljzj_tx && this.searchForm.cfq_ljzj_tx != '' &&
          this.searchForm.cfq_ljzj_tx != null && this.searchForm.cfq_ljzj_tx != undefined) {
        return this.$message.error("被拆分资产累计折旧与拆分后资产累计折旧合计不等，不能保存。")
      }
      //进项税额
      if (this.sums[8] != this.searchForm.jxse && this.searchForm.jxse != '' &&
          this.searchForm.jxse != null && this.searchForm.jxse != undefined) {
        return this.$message.error("被拆分资产进项税额与拆分后资产进项税额合计不等，不能保存。")
      }
      //原值
      if (this.sums[7] != this.searchForm.cfq_original_value) {
        return this.$message.error("被拆分资产原值与拆分后资产原值合计不等，不能保存。")
      }
      if (this.sums[5] > this.searchForm.cfq_number) {

        this.$confirm("被拆分资产数量与拆分后资产数量不等,是否继续?", "提示", {

          confirmButtonText: "确定",

          cancelButtonText: "取消",

          type: "warning"

        })

            .then(() => {

              this.add2()

            })

            .catch(() => {

              this.$message({

                type: "info",

                message: "已取消"

              });

            });

      } else {
        this.add2()
      }

    },
    add2() {
      let that = this
      var params = {
        date: that.searchForm.dj_date.substring(0, 7)
      }
      that.$axios.post('cloud/entrance/getjtDate', params).then(res => {
        if (res.data.code == 200) {
          if (res.data.data.flag == true) {
            that.add3()
          } else {
            that.$message.error(res.data.data.dj_date + "日存在计提折旧/摊销单据，当前单据日期必须大于该日期，请修改单据日期。")
          }
        } else {
          that.$message.error(res.data.message)
        }

      })
    },
    //保存新增
    add3() {
      if (this.tableData == 0) {
        return this.$message.error("请添加数据")
      }

      if (this.flag()) {
        this.$refs.searchForm.validate(valid => {
          if (valid) {
            let that = this
            const params = {
              searchForm: JSON.stringify(this.searchForm),
              tableData: JSON.stringify(this.tableData),
            }
            that.$axios.post('cloud/entrance/insertAssetsSplit', params).then(res => {
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


      }

    },
    //判断tableData必填项
    flag() {
      let flag = true
      this.tableData.forEach((v, i) => {
        if (!v.assets_code) {
          flag = false
          return this.$message.error("资产编码不能为空")
        }
        if (!v.assets_name) {
          flag = false
          return this.$message.error("资产名称不能为空")
        }
        if (!v.original_value||v.original_value == 0) {
          flag = false
          return this.$message.error("原值不能为0")
        }
        if (!v.jxse && v.jxse != 0) {
          flag = false
        }
        if (!v.ljzj_tx && v.ljzj_tx != 0) {
          flag = false
        }
        if (!v.number) {
          flag = false
        }
      })
      return flag
    },
    //计算tableData重新赋值
    upChange(row, column, index) {

      if (this.tableData.length > 0) {
        let original_value = this.$BigNumber(this.searchForm.cfq_original_value)
        let ljzj_tx = this.$BigNumber(this.searchForm.cfq_ljzj_tx)
        let jxse = this.$BigNumber(this.searchForm.jxse == undefined ? 0 : this.searchForm.jxse)
        //单条数据
        if (this.tableData.length == 1) {
          this.tableData.forEach((v, i) => {
            v.original_value = original_value.toFixed(2)
            v.ljzj_tx = ljzj_tx.toFixed(2)
            v.jxse = jxse.toFixed(2)
            v.net_value = original_value.minus(ljzj_tx).toFixed(2)
          })

        } else {
          let obj = this.tableData.filter(value => value.assets_code !== row.assets_code)
          let a = original_value.minus(this.$BigNumber(row.original_value))
          let b = ljzj_tx.minus(this.$BigNumber(row.ljzj_tx))
          let c = jxse.minus(this.$BigNumber(row.jxse))
          obj.forEach((v, i) => {
            if (obj.length == i + 1) {
              v.original_value = a
              v.ljzj_tx = ((a.div(original_value)).times(ljzj_tx)).toFixed(2)
              v.jxse = ((a.div(original_value)).times(jxse)).toFixed(2)
              v.net_value = (this.$BigNumber(v.original_value).minus(v.ljzj_tx)).toFixed(2)
            } else {
              v.ljzj_tx = ((this.$BigNumber(v.original_value).div(original_value)).times(ljzj_tx) ).toFixed(2)
              v.jxse = ((this.$BigNumber(v.original_value).div(original_value) ).times(jxse) ).toFixed(2)
              v.net_value = (this.$BigNumber(v.original_value).minus(v.ljzj_tx)).toFixed(2)
              a = a.minus(v.original_value)
              b = b.minus(v.ljzj_tx)
              c = c.minus(v.jxse)
            }
          })
          let p = Object.assign([], this.tableData)
          p.forEach((v, i) => {
            obj.forEach((item) => {
              if (v.assets_code == item.assets_code) {
                v.original_value = this.$BigNumber(item.original_value).toFixed(2)
                v.ljzj_tx = this.$BigNumber(item.ljzj_tx).toFixed(2)
                v.jxse = this.$BigNumber(item.jxse).toFixed(2)
              } else {
                v.ljzj_tx = ((this.$BigNumber(v.original_value).div(original_value) ).times(ljzj_tx) ).toFixed(2)
                v.jxse = ((this.$BigNumber(v.original_value).div(original_value) ).times(jxse) ).toFixed(2)
                v.net_value = (this.$BigNumber(v.original_value).minus(v.ljzj_tx) ).toFixed(2)
              }
            })

          })
          this.tableData = p
        }

      }

      // //最后平均分
      // this.tableData.forEach((v, i) => {
      //   //只存在一条
      //   if (this.tableData.length==1){
      //     v.original_value = original_value
      //     v.ljzj_tx = ljzj_tx
      //     v.jxse = jxse
      //     v.net_value = original_value-ljzj_tx
      //   }
      //   //多条的情况
      //   else {
      //     if (this.tableData.length == i + 1) {
      //       v.original_value = original_value
      //       v.ljzj_tx = ljzj_tx
      //       v.jxse = jxse
      //       v.net_value = original_value-ljzj_tx
      //     } else {
      //       original_value = original_value - Number(v.original_value)
      //       ljzj_tx = ljzj_tx - Number(v.ljzj_tx)
      //       jxse = jxse - Number(v.jxse)
      //       v.net_value = Number(v.original_value)-Number(v.ljzj_tx)
      //
      //     }
      //   }
      //
      //
      // })

    },
    /* 删除 */
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
      this.upChange()
    },
    /* 添加新的一行 (默认是可编辑状态)*/
    addLine() {
      if (this.searchForm.cfq_code.trim() == null || this.searchForm.cfq_code.trim() == '' || this.searchForm.cfq_code.trim() == undefined) {
        this.$message.error('请选择资产编码!')
        return
      }
      let obj = {
        assets_code: "xz-" + this.searchForm.classif_code + "-" + this.searchForm.dj_date.replaceAll("-", "") + "-" + Math.floor((Math.random() + 1) * 1000),
        assets_name: '',
        model: this.searchForm.cfq_model,
        number: 1,
        jtfs: this.searchForm.jtfs,
        jldw: '',
        original_value: '',
        jxse: 0,
        ljzj_tx: 0,
        net_value: '',
        card_date: this.searchForm.card_date,
        isShow: true
      };
      this.tableData.push(obj);
    },
    //按数量拆
    aslcChange() {
      if (this.searchForm.checkedAslc == true) {
        this.tableData = []
        this.tableData2 = []

        let original_value = this.searchForm.cfq_original_value;
        let number = this.searchForm.cfq_number;
        let jxse = this.searchForm.jxse != '' || this.searchForm.jxse != null || this.searchForm.jxse != undefined ? this.searchForm.jxse : 0;
        let ljzj_tx = this.searchForm.cfq_ljzj_tx != '' || this.searchForm.cfq_ljzj_tx != null || this.searchForm.cfq_ljzj_tx != undefined ? this.searchForm.cfq_ljzj_tx : 0;
        let net_value = this.searchForm.cfq_net_value;
        for (let i = 0; i < number; i++) {
          let obj = {
            assets_code: "xz-" + this.searchForm.classif_code + "-" + this.searchForm.dj_date.replaceAll("-", "") + "-" + Math.floor((Math.random() + 1) * 1000),
            assets_name: this.searchForm.cfq_name,
            model: this.searchForm.cfq_model,
            number: 1,
            jtfs: this.searchForm.jtfs,
            jldw: this.searchForm.cfq_jldw,
            original_value: (original_value / number).toFixed(2),
            jxse: (jxse / number).toFixed(2),
            ljzj_tx: (ljzj_tx / number).toFixed(2),
            net_value: (net_value / number).toFixed(2),
            card_date: this.searchForm.card_date,
            isShow: true
          };
          this.tableData2.push(obj);

        }
        this.tableData = this.tableData2
      } else {
        this.tableData = []
        this.tableData2 = []
      }


    },

    handleSearch() {
      this.pageNo = 1
      this.queryAssetsPage()
    },
    handleCurrentChange(val) {
      this.queryAssetsPage()
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

        else if (index === 5 || index === 7 || index === 8 ||
            index === 9 || index === 10) {
          const values = data.map(item => Number(item[column.property]))
          if (index === 5){
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
      this.sums = JSON.parse(JSON.stringify(sums))
      sums.forEach((v,i)=>{
        if (i!=0 && !isNaN(v) && v!=''){
          sums[i] = i==5?Number(v+'').toLocaleString():this.b0(Number(v+'').toLocaleString(),2)
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
    async querycfyy() {
      let params = {
        name: '拆分原因'
      }
      let res = await this.$axios.post('/cloud/entrance/getDictDetailByName', params)
      if (res.data.code == 200) {
        this.cfyyOptions = res.data.data
      }
    },
    //计提方式
    async queryjtfs() {
      let params = {
        name: '计提方式'
      }
      let res = await this.$axios.post('/cloud/entrance/getDictDetailByName', params)
      if (res.data.code == 200) {
        this.jtfsOptions = res.data.data
      }
    },
  }
}
</script>
<style scoped>

.assetsSplitNew .el-input.is-disabled .el-input__inner{
  color: #070707 !important;
}

.container {
  padding: 15px;
}


</style>
