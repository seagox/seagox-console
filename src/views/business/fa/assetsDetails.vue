<template>
  <div class="container assetsDetails">
    <el-tabs @tab-click="handleClick" type="card" v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <el-container>

          <el-form :model="addForm" label-width="125px" :rules="formRules" ref="addForm">

            <el-form-item></el-form-item>

            <el-row>
              <el-col :span="6">
                <el-form-item label="卡片日期" prop="card_date">
                  <el-date-picker
                      :disabled="flag"
                      :clearable="false"
                      @change="changeDate1"
                      v-model="addForm.card_date"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="资产编码" prop="assets_code">
                  <el-input :disabled="flag" v-model="addForm.assets_code" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="资产名称" prop="assets_name">
                  <el-input :disabled="flag" v-model="addForm.assets_name" placeholder="请选择资产名称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="规格型号">
                  <el-input v-model="addForm.model" placeholder="请输入规格型号" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="资产分类编码" prop="classif_code">
                  <el-input v-model="addForm.classif_code" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="资产分类名称" prop="classif_name">
                  <el-input :disabled="flag" :readonly="true" v-model="addForm.classif_name" placeholder="请选择"
                            clearable>
                    <el-button v-if="!flag" @click="assetsClassifsVisible = true" style="padding-right:10px"
                               slot="suffix" type="text">
                      <i class="el-icon-more"></i></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="数量" prop="number">
                  <el-input :disabled="flag" onkeyup="value=value.replace(/[^\d]/g,'');" v-model="addForm.number"
                            placeholder="请输入数量" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="计量单位">
                  <el-input v-model="addForm.jldw" placeholder="请输入计量单位" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="存放位置">
                  <el-input v-model="addForm.cfwe" placeholder="请输入名称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="使用状况" prop="syzk">
                  <el-select :disabled="flag" v-model="addForm.syzk">
                    <el-option
                        v-for="item in syzkOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="增加方式" prop="zjfs">
                  <el-select :disabled="flag" v-model="addForm.zjfs">
                    <el-option
                        v-for="item in zjfsOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="使用人">
                  <el-input v-model="addForm.syr" placeholder="请输入名称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="多部门使用">
                  <el-switch
                      :disabled="flag"
                      v-model="addForm.dbmsy"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-value="1"
                      inactive-value="2"
                      @change="switchDbm()"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="addForm.dbmsy=='1'">
                <el-form-item label="使用部门" prop="classif_name">
                  <el-input :readonly="true" v-model="addForm.department" placeholder="请选择" clearable>
                    <el-button :disabled="flag" @click="dbmVisible = true" style="padding-right:10px" slot="suffix"
                               type="text">
                      <i class="el-icon-more"></i></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="addForm.dbmsy=='2'">
                <el-form-item v-if="az?false:true" label="使用部门" prop="classif_name">
                  <el-input :readonly="true" v-model="addForm.department" placeholder="请选择" clearable>
                    <el-button :disabled="flag" @click="azz()" style="padding-right:10px" slot="suffix" type="text">
                      <i class="el-icon-more"></i></el-button>
                  </el-input>
                </el-form-item>
                <el-form-item v-if="az?true:false" label="使用部门" prop="department">
                  <el-cascader
                      ref='ownArea'
                      @change="selectArea"
                      v-model="addForm.department"
                      :options="parentDeptData"
                      :props="{ checkStrictly: true, emitPath: false }"
                      clearable
                      placeholder="请选择部门"
                  >
                  </el-cascader>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="入账日期" prop="carryto_date">
                  <el-date-picker
                      :disabled="flag"
                      :clearable="false"
                      @change="changeDate1"
                      value-format="yyyy-MM-dd"
                      v-model="addForm.carryto_date"
                      type="date"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="预计使用年限" prop="yjsy_year">
                  <el-input :disabled="flag" v-model="addForm.yjsy_year" placeholder="年" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label-width="40px" label="月" prop="yjsy_month">
                  <el-input :disabled="flag" v-model="addForm.yjsy_month" placeholder="月" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
              </el-col>
              <el-col :span="4">
                <el-form-item label="已计提年限(年)">
                  <el-input :disabled="flag" v-model="addForm.yjt_year" placeholder="年" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label-width="40px" label="月">
                  <el-input :disabled="flag" v-model="addForm.yjt_month" placeholder="月" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="原值" prop="original_value">
                  <el-input :disabled="flag" @change="countJxs()" onkeyup="value=value.replace(/[^0-9.]/g,'');"
                            placeholder="请输入原值" v-model="addForm.original_value" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="税率(%)">
                  <el-input :disabled="flag" @change="countJxs()" onkeyup="value=value.replace(/[^0-9.]/g,'');"
                            placeholder="请输入税率" v-model="addForm.sr" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="进项税额">
                  <el-input :disabled="flag" onkeyup="value=value.replace(/[^0-9.]/g,'');"
                            placeholder="请输入进项税额" v-model="addForm.jxse" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="累计折旧">
                  <el-input :disabled="flag" @change="countJxs()" onkeyup="value=value.replace(/[^0-9.]/g,'');"
                            placeholder="请输入累计折旧" v-model="addForm.ljzj_tx" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="净值">
                  <el-input :disabled="flag" readonly="readonly" onkeyup="value=value.replace(/[^0-9.]/g,'');"
                            v-model="addForm.net_value" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="预计净残值率%" prop="yjjczl">
                  <el-input :disabled="flag" @change="countJxs()" onkeyup="value=value.replace(/[^0-9.]/g,'');"
                            placeholder="预计净残值率%" v-model="addForm.yjjczl" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="预计净残值" prop="yjjcz">
                  <el-input :disabled="flag" onkeyup="value=value.replace(/[^0-9.]/g,'');"
                            placeholder="预计净残值" v-model="addForm.yjjcz" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="折旧方法">
                  <el-select :disabled="flag" v-model="addForm.zjff_id">
                    <el-option
                        v-for="item in zjffOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="计提方式">
                  <el-select :disabled="flag" v-model="addForm.jtfs">
                    <el-option
                        v-for="item in jtfsOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="月折旧率">
                  <el-input disabled onkeyup="value=value.replace(/[^0-9.]/g,'');" v-model="addForm.yzjl"
                            clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="月折旧额">
                  <el-input disabled onkeyup="value=value.replace(/[^0-9.]/g,'');" v-model="addForm.yzje"
                            clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="备注">
                  <el-input v-model="addForm.remark" placeholder="请输入备注" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="封存">
                  <el-select disabled v-model="addForm.fc">
                    <el-option
                        v-for="item in archiveOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="建卡人">
                  <el-input disabled :readonly="true" v-model="addForm.user" placeholder="请输入建卡人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="建卡日期">
                  <el-date-picker
                      disabled
                      value-format="yyyy-MM-dd"
                      v-model="addForm.jk_date"
                      type="date"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="入账期间">
                  <el-date-picker
                      disabled
                      value-format="yyyy-MM"
                      v-model="addForm.rzqz"
                      type="month"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item size="large" align="left">
              <el-button type="primary" @click="submitInfo">保存编辑</el-button>
              <el-button type="primary" @click="lc">联查拆分前卡片</el-button>
              <el-button type="primary" @click="history">历史状态</el-button>
            </el-form-item>

          </el-form>


        </el-container>
      </el-tab-pane>
      <el-tab-pane label="变动" name="second">
        <div class="table">
          <!--列表-->
          <el-table @row-dblclick="openDetailsBd" :data="bdTableData" border highlight-current-row stripe>
            <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
            <el-table-column prop="dj_date" label="单据日期" align="center"></el-table-column>
            <el-table-column prop="dj_code" label="单据编号" align="center"></el-table-column>
            <el-table-column prop="lr" label="变动内容" align="center"></el-table-column>
            <el-table-column prop="reason" label="变动原因" align="center"></el-table-column>
            <!--            <el-table-column :formatter="formatter" prop="ago" label="变动前" align="center"></el-table-column>-->
            <!--            <el-table-column :formatter="formatter2" prop="alter" label="变动后" align="center"></el-table-column>-->
          </el-table>

        </div>
      </el-tab-pane>
      <el-tab-pane label="折旧" name="third">
        <div class="table">
          <!--列表-->
          <el-table @row-dblclick="openDetailsZj" :data="zjTableData"
                    :summary-method="getSummaries"
                    show-summary
                    border highlight-current-row stripe>
            <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
            <el-table-column prop="jt_date" label="计提期间" align="center"></el-table-column>
            <el-table-column prop="dj_date" label="单据日期" align="center"></el-table-column>
            <el-table-column prop="yzje" label="本月折旧/摊销" align="center">
              <template slot-scope="scope">
                {{ zjFormatter(scope.row.yzje,2)}}
              </template>
            </el-table-column>
            <el-table-column   prop="yzjl" label="月折旧/摊销率" align="center">
              <template slot-scope="scope">
                {{ zjFormatter(scope.row.yzjl,4)}}
              </template>
            </el-table-column>
            <el-table-column  prop="qmljzj_tx" label="累计折旧/摊销" align="center">
              <template slot-scope="scope">
                {{ zjFormatter(scope.row.qmljzj_tx,2)}}
              </template>
            </el-table-column>
            <el-table-column prop="qmsyjt" label="剩余计提" align="center">
              <template slot-scope="scope">
                {{ zjFormatter(scope.row.qmsyjt,2)}}
              </template>
            </el-table-column>
          </el-table>

        </div>
      </el-tab-pane>
      <el-tab-pane label="处置" name="fourth">
        <div class="table">
          <!--列表-->
          <el-table @row-dblclick="openDetailsCz" :data="czTableData" border highlight-current-row stripe>
            <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
            <el-table-column prop="djDate" label="单据日期" align="center"></el-table-column>
            <el-table-column prop="djCode" label="处置单号" align="center"></el-table-column>
            <el-table-column prop="czfsname" label="处置方式" align="center"></el-table-column>
            <el-table-column prop="remark" label="备注" align="center"></el-table-column>
            <el-table-column prop="user" label="制单人" align="center"></el-table-column>
          </el-table>
        </div>

      </el-tab-pane>
    </el-tabs>
    <!--联查拆分前卡片界面-->
    <el-dialog title="拆分前卡片" width="1500px" :visible.sync="lcVisible" :close-on-click-modal="false">
      <el-container>

        <el-form :model="lcForm" label-width="125px" ref="addForm">
          <el-row>
            <el-col :span="6">
              <el-form-item label="卡片日期" prop="card_date">
                <el-date-picker
                    disabled
                    :clearable="false"
                    @change="changeDate1"
                    v-model="lcForm.card_date"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产编码" prop="assets_code">
                <el-input v-model="lcForm.assets_code" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产名称" prop="assets_name">
                <el-input disabled v-model="lcForm.assets_name" placeholder="请选择资产名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规格型号" prop="model">
                <el-input disabled v-model="lcForm.model" placeholder="请输入规格型号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产分类编码" prop="classif_code">
                <el-input v-model="lcForm.classif_code" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产分类名称" prop="classif_name">
                <el-input disabled :readonly="true" v-model="lcForm.classif_name" placeholder="请选择" clearable>
                  <!--                <el-button  @click="assetsClassifsVisible = true" style="padding-right:10px" slot="suffix" type="text" >-->
                  <!--                  <i class="el-icon-more" ></i></el-button>-->
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="数量" prop="number">
                <el-input disabled onkeyup="value=value.replace(/[^\d]/g,'');" v-model="lcForm.number"
                          placeholder="请输入数量" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计量单位">
                <el-input disabled v-model="lcForm.jldw" placeholder="请输入计量单位" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="存放位置">
                <el-input disabled v-model="lcForm.cfwe" placeholder="请输入名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="使用状况" prop="syzk">
                <el-select disabled v-model="lcForm.syzk">
                  <el-option
                      v-for="item in syzkOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="增加方式" prop="zjfs">
                <el-select disabled v-model="lcForm.zjfs">
                  <el-option
                      v-for="item in zjfsOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="使用人">
                <el-input disabled v-model="lcForm.syr" placeholder="请输入名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="多部门使用">
                <el-switch
                    disabled
                    v-model="lcForm.dbmsy"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="1"
                    inactive-value="2"
                    @change="switchDbm()"
                >
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="使用部门" prop="classif_name">
                <el-input disabled :readonly="true" v-model="lcForm.department" clearable>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="入账日期" prop="carryto_date">
                <el-date-picker
                    disabled
                    :clearable="false"
                    @change="changeDate1"
                    value-format="yyyy-MM-dd"
                    v-model="lcForm.carryto_date"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="预计使用年限" prop="yjsy_year">
                <el-input disabled v-model="lcForm.yjsy_year" placeholder="年" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item label-width="40px" label="月" prop="yjsy_month">
                <el-input disabled v-model="lcForm.yjsy_month" placeholder="月" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
            </el-col>
            <el-col :span="4">
              <el-form-item label="已计提年限(年)">
                <el-input disabled v-model="lcForm.yjt_year" placeholder="年" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item label-width="40px" label="已计提年限(月)">
                <el-input disabled v-model="lcForm.yjt_month" placeholder="月" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="原值" prop="original_value">
                <el-input disabled @change="countJxs()" onkeyup="value=value.replace(/[^0-9.]/g,'');"
                          placeholder="请输入原值" v-model="lcForm.original_value" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="税率(%)">
                <el-input disabled @change="countJxs()" onkeyup="value=value.replace(/[^0-9.]/g,'');"
                          placeholder="请输入税率" v-model="lcForm.sr" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="进项税额">
                <el-input disabled onkeyup="value=value.replace(/[^0-9.]/g,'');"
                          placeholder="请输入进项税额" v-model="lcForm.jxse" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="累计折旧">
                <el-input disabled @change="countJxs()" onkeyup="value=value.replace(/[^0-9.]/g,'');"
                          placeholder="请输入累计折旧" v-model="lcForm.ljzj_tx" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="净值">
                <el-input disabled readonly="readonly" onkeyup="value=value.replace(/[^0-9.]/g,'');"
                          v-model="lcForm.net_value" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="预计净残值率%" prop="yjjczl">
                <el-input disabled @change="countJxs()" onkeyup="value=value.replace(/[^0-9.]/g,'');"
                          placeholder="预计净残值率%" v-model="lcForm.yjjczl" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="预计净残值" prop="yjjcz">
                <el-input disabled onkeyup="value=value.replace(/[^0-9.]/g,'');" placeholder="预计净残值"
                          v-model="lcForm.yjjcz" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="折旧方法">
                <el-select disabled v-model="lcForm.zjff_id">
                  <el-option
                      v-for="item in zjffOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计提方式">
                <el-select disabled v-model="lcForm.jtfs">
                  <el-option
                      v-for="item in jtfsOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="月折旧率">
                <el-input disabled onkeyup="value=value.replace(/[^0-9.]/g,'');" v-model="lcForm.yzjl"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="月折旧额">
                <el-input disabled onkeyup="value=value.replace(/[^0-9.]/g,'');" v-model="lcForm.yzje"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="备注">
                <el-input disabled v-model="lcForm.remark" placeholder="请输入备注" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="封存">
                <el-select disabled v-model="lcForm.fc">
                  <el-option
                      v-for="item in archiveOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="建卡人">
                <el-input disabled :readonly="true" v-model="lcForm.user" placeholder="请输入建卡人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="建卡日期">
                <el-date-picker
                    disabled
                    value-format="yyyy-MM-dd"
                    v-model="lcForm.jk_date"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="入账期间">
                <el-date-picker
                    disabled
                    value-format="yyyy-MM"
                    v-model="lcForm.rzqz"
                    type="month"
                    placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>

      </el-container>
    </el-dialog>

    <!--显示历史记录界面-->
    <el-dialog title="历史状态" width="1500px" :visible.sync="historyVisible" :close-on-click-modal="false">
      <el-table max-height="600" :data="historyData" border highlight-current-row stripe>
        <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
        <el-table-column prop="create_time" label="历史日期" align="center"></el-table-column>
        <el-table-column prop="card_date" label="卡片日期" align="center"></el-table-column>
        <el-table-column prop="classif_name" label="资产分类名称" align="center"></el-table-column>
        <el-table-column prop="assets_code" label="资产编码" align="center"></el-table-column>
        <el-table-column prop="assets_name" label="资产名称" align="center"></el-table-column>
        <el-table-column prop="model" label="规格型号" align="center"></el-table-column>
        <el-table-column prop="number" label="数量" align="center"></el-table-column>
        <el-table-column prop="department" label="使用部门" align="center"></el-table-column>
        <el-table-column prop="carryto_date" label="入账日期" align="center"></el-table-column>
        <el-table-column label="预计使用年限" align="center">
          <template slot-scope="scope">
            {{
              scope.row.yjsy_year != null && scope.row.yjsy_year != 0 && scope.row.yjsy_year != 'null' && scope.row.yjsy_year != '0' ? scope.row.yjsy_year + '年' : ''
            }}
            {{
              scope.row.yjsy_month != null && scope.row.yjsy_month != 0 && scope.row.yjsy_month != 'null' && scope.row.yjsy_month != '0' ? scope.row.yjsy_month + '月' : ''
            }}
          </template>
        </el-table-column>
        <el-table-column label="已计提年限" align="center">
          <template slot-scope="scope">
            {{
              scope.row.yjt_year != null && scope.row.yjt_year != 0 && scope.row.yjt_year != 'null' && scope.row.yjt_year != '0' ? scope.row.yjt_year + '年' : ''
            }}
            {{
              scope.row.yjt_month != null && scope.row.yjt_month != 0 && scope.row.yjt_month != 'null' && scope.row.yjt_month != '0' ? scope.row.yjt_month + '月' : ''
            }}
          </template>

        </el-table-column>
        <el-table-column prop="original_value" label="原值" align="center"></el-table-column>
        <el-table-column prop="ljzj_tx" label="累计折旧/摊销" align="center"></el-table-column>
        <el-table-column prop="net_value" label="净值" align="center"></el-table-column>
        <el-table-column prop="yjjcz" label="预计净残值" align="center"></el-table-column>
        <el-table-column prop="yzje" label="月折旧额" align="center"></el-table-column>
        <el-table-column prop="jk_date" label="建卡日期" align="center"></el-table-column>
      </el-table>
    </el-dialog>

    <!--多部门比例界面-->
    <el-dialog title="新增" width="750px" :visible.sync="dbmVisible" :close-on-click-modal="false">
      <div @click="addLine()" style="cursor: pointer; color: #409eff">
        添加一行
      </div>
      <el-table :data="tableDbm" border highlight-current-row stripe>
        <el-table-column label="部门" prop="date" align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.isShow">{{ scope.row.name }}</span>

            <el-cascader
                ref="myCascader"
                v-show="!scope.row.isShow"
                v-model="scope.row.date"
                :options="parentDeptData"
                :props="{ checkStrictly: true, emitPath: false }"
                @change="changed($event, scope.$index)"
                clearable
                placeholder="请选择部门"
            >
            </el-cascader>

          </template>
        </el-table-column>
        <el-table-column label="比例" prop="name" align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.isShow">{{ scope.row.bl }}</span>
            <el-input
                type="text"
                :placeholder="scope.row.bl"
                v-model="scope.row.bl"
                v-show="!scope.row.isShow"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                v-show="scope.row.isShow"
            >编辑
            </el-button
            >
            <el-button
                @click="hold(scope.$index, scope.row)"
                size="mini"
                v-show="!scope.row.isShow"
            >保存
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDbm">确认</el-button>
      </div>
    </el-dialog>
    <!--显示资产分类选择界面-->
    <el-dialog title="请选择" width="750px" :visible.sync="assetsClassifsVisible" :close-on-click-modal="false">
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
              >查询
              </el-button
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

    <!--新增资产分类界面-->
    <el-dialog title="新增" width="750px" :visible.sync="addAssetsClassifsVisible" :close-on-click-modal="false">
      <el-form :model="addAssetsClassifsForm" label-width="115px" :rules="formRules" ref="addAssetsClassifsForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="资产分类编码" prop="code">
              <el-input v-model="addAssetsClassifsForm.code" placeholder="请输入编码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产分类名称" prop="name">
              <el-input
                  v-model="addAssetsClassifsForm.name"
                  placeholder="请输入名称"
                  clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产属性" prop="propertyId">
              <el-select
                  v-model="addAssetsClassifsForm.propertyId"
                  filterable
                  placeholder="请选择资产属性"
              >
                <el-option
                    v-for="item in propertyData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAssetsClassifsVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit">提交</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
export default {
  data() {
    return {
      az: false,
      flag: true,
      bdlbOptions: [],
      bdTableData: [],
      zjTableData: [],
      czTableData: [],
      lcForm: {},
      lcVisible: false,
      lcData: [],
      historyData: [],
      historyVisible: false,
      activeName: 'first',
      headers: {
        Authorization: localStorage.getItem('Authorization')
      },
      clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
      parentDeptData: [],
      assetsClassifsVisible: false,
      addAssetsClassifsVisible: false,
      addAssetsClassifsForm: {
        code: '',
        name: '',
        propertyId: ''
      },
      tableDbm: [],
      dbmVisible: false,
      jtfsOptions: [],
      jldwOptions: [],
      zjfsOptions: [],
      syzkOptions: [],
      propertyData: [],
      zjffOptions: [],
      archiveOptions: [],
      addDeptFormVisible: false,
      addDeptForm: {
        code: '',
        name: '',
        jtfs: '1',
        mrzjTx: '1'
      },
      tableData: [],
      pageNo: 1,
      total: 0,
      addFormVisible: false,
      addForm: {},
      formRules: {
        card_date: [{required: true, message: '请选择日期', trigger: 'blur'}],
        assets_code: [{required: true, message: '请输入编码', trigger: 'change'}],
        assets_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        classif_code: [{required: true, message: '请选择编码', trigger: 'change'}],
        classif_name: [{required: true, message: '请选择名称', trigger: 'change'}],
        propertyId: [{required: true, message: '请选择', trigger: 'blur'}],
        number: [{required: true, message: '请输入数量', trigger: 'blur'}],
        syzk: [{required: true, message: '请输入', trigger: 'change'}],
        zjfs: [{required: true, message: '请输入', trigger: 'change'}],
        department: [{required: true, message: '请输入', trigger: 'change'}],
        carryto_date: [{required: true, message: '请输入', trigger: 'blur'}],
        yjsy_year: [{required: true, message: '请输入', trigger: 'blur'}],
        yjsy_month: [{required: true, message: '请输入', trigger: 'blur'}],
        original_value: [{required: true, message: '请输入', trigger: 'blur'}],
        yjjczl: [{required: true, message: '请输入', trigger: 'blur'}],
        yjjcz: [{required: true, message: '请输入', trigger: 'change'}],
        model: [{required: true, message: '请输入', trigger: 'blur'}],

        code: [{required: true, message: '请输入编码', trigger: 'blur'}],
        name: [{required: true, message: '请输入名称', trigger: 'blur'}]
      },
      searchForm: {
        propertyId: '',
        code: '',
        name: ''
      },
      curDept: undefined,
      classify: []
    }
  },
  created() {
    this.queryByPage()
    this.submitInfo2()
    this.querybdlb()
    this.queryJtfs()
    this.queryJldw()
    this.queryClassify()
    this.queryProperty()
    this.queryParentByCompanyId()
    this.querySyzk()
    this.queryZjff()
    this.queryZjfs()
    this.querysf()
    this.queryByPage2()


  },
  watch: {},
  methods: {
    zjFormatter(param,num){
      if (param){
        if (num==2){
          return ((param*100)/100).toFixed(2)
        }else if (num==4){
          return ((param*10000)/10000).toFixed(4)
        }
      }else {
        return param
      }

    },
    azz() {
      this.az = true
    },
    //跳转详情变动
    openDetailsBd(row) {
      this.$history.push({
        path: "runCode?path=djTable&title=资产变动单据列表",
        params: ''
      });
    },
    //跳转详情折旧
    openDetailsZj(row) {
      this.$history.push({
        path: "runCode?path=assetsJtDj&title=计提折旧单据",
        params: ''
      });
    },
    //跳转详情处置
    openDetailsCz(row) {
      this.$history.push({
        path: "runCode?path=disposeDj&title=资产处置单据",
        params: ''
      });
    },
    //格式化
    formatter(row) {
      if (row.lr == '使用状况变动') {
        let p = this.syzkOptions.find(value => value.code == row.ago)
        if (p) {
          return p.name
        }
      } else {
        return row.ago
      }
    },
    //格式化
    formatter2(row) {
      if (row.lr == '使用状况变动') {
        let p = this.syzkOptions.find(value => value.code == row.alter)
        if (p) {
          return p.name
        }
      } else {
        return row.alter
      }
    },
    //资产变动类别
    async querybdlb() {
      let params = {
        name: '资产变动类别'
      }
      let res = await this.$axios.post('/cloud/entrance/getDictDetailByName', params)
      if (res.data.code == 200) {
        this.bdlbOptions = res.data.data
      }
    },
    //变动
    bd() {
      let that = this
      var params = {
        id: this.addForm.id
      }
      that.$axios.post('cloud/entrance/getDjInfoById', params).then(res => {
        if (res.data.code == 200) {
          that.bdTableData = res.data.data
          if (res.data.data.length > 0) {
            let array = [];
            res.data.data.forEach((av, ai) => {
              if (array.length == 0) {
                array.push(av)
              } else {
                let code = array.find(value => value.dj_code == av.dj_code)
                if (!code) {
                  array.push(av)
                }
              }
            })
            that.bdTableData = array
          }
        } else {
          that.$message.error(res.data.message)
        }
      })
    },
    //折旧
    zj() {
      let that = this
      var params = {
        id: this.addForm.id
      }
      that.$axios.post('cloud/entrance/getJtMx', params).then(res => {
        if (res.data.code == 200) {
          that.zjTableData = res.data.data
        } else {
          that.$message.error(res.data.message)
        }
      })
    },
    //处置
    cz() {
      let that = this
      var params = {
        assetsId: this.addForm.id
      }
      that.$axios.post('cloud/entrance/getmx', params).then(res => {
        if (res.data.code == 200) {
          that.czTableData = res.data.data
        } else {
          that.$message.error(res.data.message)
        }
      })
    },
    //页签事件
    handleClick(tab, event) {
      if (tab.index == '1') {

      }
      if (tab.index == '2') {
        this.zj()
      }
      if (tab.index == '3') {
        this.cz()
        // this.tableData = []
        // this.tableData = this.czTableData
      }
    },
    //联查拆分前卡片
    lc() {
      if (this.addForm.split_before_id) {
        let that = this
        const params = {
          id: this.addForm.split_before_id,
        }
        that.$axios.post('cloud/entrance/getBaseInfoList', params).then(res => {
          if (res.data.code == 200) {
            that.lcData = res.data.data
            if (that.lcData != null) {
              that.lcForm = that.lcData[0]
              that.lcVisible = true
            }
          }
        })

      } else {
        this.$message({
          message: '当前开卡无拆分',
          type: 'warning'
        });
      }

    },
    //历史状态
    history() {
      let that = this
      var params = {
        id: this.addForm.id
      }
      that.$axios.post('cloud/entrance/getBaseInfoLog', params).then(res => {
        if (res.data.code == 200) {
          res.data.data.forEach((v, i) => {
            that.historyData[i] = JSON.parse(v.zcxx)
            that.historyData[i].create_time = v.create_time.substr(0, 10)
          })
          this.historyVisible = true
        } else {
          that.$message.error(res.data.message)
        }
      })


    },

    //部门
    async queryParentByCompanyId() {
      let res = await this.$axios.get('department/queryByCompanyId?searchCompanyId=' + localStorage.getItem("companyId"))
      if (res.data.code == 200) {
        this.parentDeptData = res.data.data
      }
    },
    //获取增加方式增加
    async queryZjfs() {
      let params = {
        name: '增加方式增加'
      }
      let res = await this.$axios.post('/cloud/entrance/getDictDetailByName', params)
      if (res.data.code == 200) {
        this.zjfsOptions = res.data.data
      }
    },
    //获取是否
    async querysf() {
      let params = {
        name: '是否'
      }
      let res = await this.$axios.post('/cloud/entrance/getDictDetailByName', params)
      if (res.data.code == 200) {
        this.archiveOptions = res.data.data
      }
    },
    //获取使用状况
    async querySyzk() {
      let params = {
        name: '资产变动使用状况'
      }
      let res = await this.$axios.post('/cloud/entrance/getDictDetailByName', params)
      if (res.data.code == 200) {
        this.syzkOptions = res.data.data
      }
    },
    //获取计提方式
    async queryJtfs() {
      let params = {
        name: '计提方式'
      }
      let res = await this.$axios.post('/cloud/entrance/getDictDetailByName', params)
      if (res.data.code == 200) {
        this.jtfsOptions = res.data.data
      }
    },
    //获取折旧方法
    async queryZjff() {
      let res = await this.$axios.post('/cloud/entrance/getZjMethod')
      if (res.data.code == 200) {
        this.zjffOptions = res.data.data
      }
    },
    //获取计量单位
    async queryJldw() {
      let params = {
        name: '计量单位'
      }
      let res = await this.$axios.post('/cloud/entrance/getDictDetailByName', params)
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
    //查询资产
    queryByPage() {
      let that = this
      const params = {
        id: this.$history.history.current.query.id,
      }
      that.$axios.post('/cloud/entrance/getAssetsInfoOne', params).then(res => {
        if (res.data.code == 200) {
          res.data.data.yjjczl=res.data.data.yjjczl?this.b0(res.data.data.yjjczl,6) : null
          res.data.data.yzjl=res.data.data.yzjl?this.b0(res.data.data.yzjl,4) : null
          that.addForm = res.data.data
          that.addForm.zjff_id = this.addForm.zjff_id - 0
          that.addForm.rzqz = this.addForm.carryto_date.substring(0, 7)
          this.bd()
          this.zj()
        }
      })
    },
    //查询资产属性列表
    queryByPage2() {
      let that = this
      const params = {
        pageNo: this.pageNo,
        propertyId: this.searchForm.propertyId.toString(),
        name: this.searchForm.name,
        code: this.searchForm.code
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
      this.queryByPage2()
    },
    handleCurrentChange(val) {
      this.queryByPage2()
    },
    //计量单位格式化
    jldwFormatter(obj) {
      if (obj.jldw != null && obj.jldw != '') {
        let name = ''
        this.jldwOptions.forEach(value => {
          if (value.code == obj.jldw) {
            name = value.name
          }
        })
        return name
      } else {
        return ''
      }
    },
    //判断资产是否有计提过
    submitInfo2() {
      let that = this
      var params = {
        id: this.$history.history.current.query.id,
      }
      that.$axios.post('cloud/entrance/getJtMxById', params).then(res => {
        if (res.data.code == 200) {
          if (res.data.data) {
            that.flag = false
          } else {
            that.flag = true
          }
        } else {
          that.$message.error(res.data.message)
        }

      })

    },
    //保存编辑
    submitInfo() {
      let that = this
      // var params = {
      //   id: this.addForm.id,
      //   assets_name: this.addForm.assets_name,
      //   model: this.addForm.model,
      //   jldw: this.addForm.jldw,
      //
      //   number: this.addForm.number,
      //   cfwe: this.addForm.cfwe,
      //   syzk: this.addForm.syzk,
      //   zjfs: this.addForm.zjfs,
      //   syr: this.addForm.syr,
      //   dbmsy: this.addForm.dbmsy,
      //   department: this.addForm.department,
      //   yjsy_year: this.addForm.yjsy_year,
      //   yjsy_month: this.addForm.yjsy_month,
      //   original_value: this.addForm.original_value,
      //   sr: this.addForm.sr,
      //   jxse: this.addForm.jxse,
      //   ljzj_tx: this.addForm.ljzj_tx,
      //   net_value: this.addForm.net_value,
      //   yjjczl: this.addForm.yjjczl,
      //   yjjcz: this.addForm.yjjcz,
      // }
      var params = Object.assign({}, this.addForm)
      if (params.dbmsy == '2') {
        if (that.getDwName(params.department)) {
          params.department = that.getDwName(params.department).name
        }
      }
      this.$refs.addForm.validate(valid => {
        if (valid) {
          that.$axios.post('cloud/entrance/updateBaseInfo2', params).then(res => {
            if (res.data.code == 200) {
              that.$message.success('成功保存')
            } else {
              that.$message.error(res.data.message)
            }
          })
        }
      })
    },
    //显示资产分类新增界面
    showAddDialog() {
      this.addAssetsClassifsVisible = true
    },
    //提交新增资产分类
    addSubmit() {
      let that = this
      var params = this.addAssetsClassifsForm
      this.$refs.addAssetsClassifsForm.validate(valid => {
        if (valid) {
          that.$axios.post('cloud/authority/insertClassif', params).then(res => {
            if (res.data.code == 200) {
              that.$message.success('新增成功')
              that.addAssetsClassifsVisible = false
              that.queryByPage()
            } else {
              that.$message.error(res.data.message)
            }
          })
        }
      })
    },
    //显示资产分类界面
    showSelectDialog(row) {
      this.addForm.classif_code = row.code
      this.addForm.classif_name = row.name
      this.assetsClassifsVisible = false
      this.assetsCode()
    },
    //多部门确认
    submitDbm() {
      this.dbmVisible = false
      this.addForm.department = ''
      this.tableDbm.forEach((v, i) => {
        if (this.addForm.department) {
          this.addForm.department += ',' + v.name + ' ' + v.bl
        } else {
          this.addForm.department = v.name + ' ' + v.bl
        }

      })
    },
    /* 编辑 */
    handleEdit(index, row) {
      row.isShow = false;
    },
    /* 保存 */
    hold(index, row) {
      row.isShow = true;
    },
    /* 删除 */
    handleDelete(index, row) {
      this.tableDbm.splice(index, 1);
    },
    /* 添加新的一行 (默认是可编辑状态)*/
    addLine() {
      let obj = {
        date: "",
        bl: "",
        name: '',
        isShow: false
      };
      this.tableDbm.push(obj);
    },

    //资产编码
    assetsCode() {
      const projectTime = new Date() // 当前中国标准时间
      const Year = projectTime.getFullYear().toString() // 获取当前年份 支持IE和火狐浏览器.
      const Month = (projectTime.getMonth() + 1).toString() // 获取中国区月份
      const Day = projectTime.getDate().toString() // 获取几号
      var CurrentDate = Year
      if (Month >= 10) { // 判断月份和几号是否大于10或者小于10
        CurrentDate += Month
      } else {
        CurrentDate += '0' + Month
      }
      if (Day >= 10) {
        CurrentDate += Day
      } else {
        CurrentDate += '0' + Day
      }
      let params = {
        classifCode: this.addForm.classif_code
      }
      this.$axios.post('cloud/entrance/getZcNum', params).then(res => {
        if (res.data.code == 200) {
          CurrentDate = CurrentDate + '-' + res.data.data
          this.addForm.assets_code = 'xz-' + this.addForm.classif_code + '-' + CurrentDate
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    changed(val, index) {

      let obj = this.getDwName(val)
      this.tableDbm[index].name = obj.label
      this.$nextTick(() => {
        this.$refs.myCascader.dropDownVisible = false;
      })

    },
    //格式化部门名称
    getDwName(val) {
      let obj = null
      obj = this.parentDeptData.find(item => item.id === val)

      if (obj == undefined || obj == null) {

        this.parentDeptData.forEach((item, index) => {
          if (item.children != null) {
            obj = item.children.find(item => item.id === val)
          }
        })

      }
      return obj

    },
    switchDbm() {
      this.addForm.department = ''
    },
    countJxs() {

      if (this.addForm.original_value && this.addForm.sr) {
        this.addForm.jxse = (this.addForm.original_value * this.addForm.sr * 0.01).toFixed(2)
      } else {
        this.addForm.jxse = null
      }
      if (this.addForm.ljzj_tx && this.addForm.original_value) {
        this.addForm.net_value = this.addForm.original_value - this.addForm.ljzj_tx
      } else if (this.addForm.original_value) {
        this.addForm.net_value = this.addForm.original_value
      } else {
        this.addForm.net_value = 0
      }
      if (this.addForm.yjjczl && this.addForm.original_value) {
        this.addForm.yjjcz = (this.addForm.original_value * this.addForm.yjjczl * 0.01).toFixed(2)
      } else {
        this.addForm.yjjcz = null
      }
    },
    changeDate1() {
      if (this.addForm.card_date > this.addForm.carryto_date) {
        this.$message(
            "当前卡片日期大于入账日期"
        );
        this.addForm.card_date = this.addForm.carryto_date
      }
      this.addForm.rzqz = this.addForm.carryto_date.substring(0, 7)
    },
    selectArea() {
      this.$nextTick(() => {
        this.$refs.ownArea.dropDownVisible = false;
      })
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
    // 求和操作
    getSummaries(param) {
      param.data = this.zjTableData
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

        else if (index === 3 ) {
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

.assetsDetails .el-input.is-disabled .el-input__inner {
  color: #070707 !important;
}

.container {
  padding: 15px;
}


</style>
