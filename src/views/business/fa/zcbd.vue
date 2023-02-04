<template>
    <div class="container zcbd">
        <div class="searchView">
            <el-form label-width="90px">
                <el-row :gutter="40">
                    <el-col :span="4">
                        <el-form-item label="单据日期">
                            <el-date-picker
                                    v-model="searchForm.year"
                                    value-format="yyyy-MM-dd"
                                    :clearable="false"
                                    @change="getDjCode"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="单据编号">
                            <el-input readonly v-model="searchForm.djCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="变动类别">
                            <el-select v-model="searchForm.category" @change="categoryChanged" clearable placeholder="请选择变动类别">
                                <el-option
                                        v-for="item in changesOptions"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" @click="submit">提交</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table">
            <el-form class="base-form" ref="baseForm" :model="tableDataFirst" :rules="rules" auto-complete="on">
                <el-table
                        ref="multipleFirst"
                        :data="tableDataFirst.data"
                        @cell-dblclick="editData"
                        :row-class-name="tableRowClassName"
                        :key="randomKey"
                        border
                        height="700"
                        show-summary
                        :summary-method="getSummaries"
                        @row-click="selectItem"
                        highlight-current-row stripe>
                    <!--					<el-table-column type="selection" width="55"></el-table-column>-->
                    <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                    <el-table-column align="center" width="180" label="资产编码">
                        <template slot-scope="scope">
                            <el-form-item :prop="'data.'+scope.$index+'.assetsCode'" :rules="rules.assetsCode" >
                                <a v-if="scope.row.assetsCode==''" @click="showZcTable(scope)" style="color:red;cursor:pointer;font-size: 16px;">请选择资产</a>
                                <span v-else>{{ scope.row.assetsCode }}</span>
                                <!--							<el-form-item :prop="'data.'+scope.$index+'.assetsCode'" :rules="rules.assetsCode" >-->

                                <!--								<el-select v-model="scope.row.zcbm" placeholder="请选择资产编码"-->
                                <!--										   filterable-->
                                <!--										   :ref="scope.column.property"-->
                                <!--										   v-if="scope.row[scope.column.property + 'isShow']"-->
                                <!--										   @change="zcbmChanged(scope.row)"-->
                                <!--										   @blur="alterData(scope.row,scope.column)">-->
                                <!--									<el-option-->
                                <!--											v-for="item in zcbmOptions"-->
                                <!--											:key="item.id"-->
                                <!--											:label="item.assetsCode"-->
                                <!--											:value="item.id"-->
                                <!--									>-->
                                <!--									</el-option>-->
                                <!--								</el-select>-->

                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="资产名称" prop="assetsName"></el-table-column>
                    <el-table-column align="center" label="变动原因" prop="reason">
                        <template slot-scope="scope">
                            <el-form-item :prop="'data.'+scope.$index+'.reason'">
                                <el-select v-model="scope.row.reason" placeholder="请选择变动原因"
                                           filterable
                                           :ref="scope.column.property"
                                           v-if="scope.row[scope.column.property + 'isShow']"
                                           @blur="alterData(scope.row,scope.column)">
                                    <el-option
                                            v-for="item in reasonOptions"
                                            :key="item.code"
                                            :label="item.name"
                                            :value="item.name"
                                    >
                                    </el-option>
                                </el-select>
                                <!--								<span v-else>-->
                                <!--									<span v-if="syzkOptions[scope.row.reason -1]">{{ reasonOptions[scope.row.reason -1].name  }}</span>-->
                                <span v-else>{{ scope.row.reason  }}</span>
                                <!--								</span>-->

                            </el-form-item>
                        </template>
                    </el-table-column>
                    <!--					<el-table-column align="center" label="变动原因" prop="projectName"></el-table-column>-->
                    <el-table-column label="原值" v-if="searchForm.category=='1'" align="center">
                        <el-table-column
                                align="center"
                                prop="originalValue"
                                label="变动前"
                        >
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="originalValue_alter"
                                label="变动后"
                        >

                            <template slot-scope="scope">
                                <el-input v-if="scope.row[scope.column.property + 'isShow']"
                                          :ref="scope.column.property"
                                          type="number"
                                          v-model="scope.row.originalValue_alter"
                                          @change="yzChanged(scope.row)"
                                          @blur="alterData(scope.row,scope.column)"></el-input>
                                <span v-else>
                                    <span v-if="scope.row.originalValue_alter==scope.row.originalValue">{{ scope.row.originalValue_alter }}</span>
                                    <span v-else style="color: red">{{ scope.row.originalValue_alter }}</span>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="预计净残值率%" v-if="searchForm.category=='1' || searchForm.category=='5'" align="center">
                        <el-table-column
                                align="center"
                                prop="yjjczl"
                                label="变动前"
                        >
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="yjjczl_alter"
                                label="变动后"
                        >
                            <template slot-scope="scope">
                                <el-input v-if="scope.row[scope.column.property + 'isShow']"
                                          :ref="scope.column.property"
                                          v-model="scope.row.yjjczl_alter"
                                          type="number"
                                          @change="yzChanged(scope.row)"
                                          @blur="alterData(scope.row,scope.column)"></el-input>
                                <!--								<span v-else>{{ scope.row.yjjczl_alter}}</span>-->
                                <span v-else>
                                    <span v-if="scope.row.yjjczl_alter==scope.row.yjjczl">{{ scope.row.yjjczl_alter }}</span>
                                    <span v-else style="color: red">{{ scope.row.yjjczl_alter }}</span>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="预计净残值" v-if="searchForm.category=='1' || searchForm.category=='5'" align="center">
                        <el-table-column
                                align="center"
                                prop="yjjcz"
                                label="变动前"
                        >
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="yjjcz_alter"
                                label="变动后"
                        >
                            <template slot-scope="scope">

                                <span v-if="scope.row.yjjcz_alter==scope.row.yjjcz">{{ scope.row.yjjcz_alter }}</span>
                                <span v-else style="color: red">{{ scope.row.yjjcz_alter }}</span>

                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="累积折旧" v-if="searchForm.category=='2'" align="center">
                        <el-table-column
                                align="center"
                                prop="ljzjTx"
                                label="变动前"
                        >
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="ljzjTx_alter"
                                label="变动后"
                        >

                            <template slot-scope="scope">
                                <el-form-item :prop="'data.'+scope.$index+'.ljzjTx_alter'" :rules="rules.ljzjTx_alter" >
                                    <el-input v-if="scope.row[scope.column.property + 'isShow']"
                                              :ref="scope.column.property"
                                              v-model="scope.row.ljzjTx_alter"
                                              type="number"
                                              @blur="alterData(scope.row,scope.column)"></el-input>
                                    <!--								<span v-else>{{ scope.row.ljzjTx }}</span>-->
                                    <span v-else>
                                        <span v-if="scope.row.ljzjTx_alter==scope.row.ljzjTx">{{ scope.row.ljzjTx_alter }}</span>
                                        <span v-else style="color: red">{{ scope.row.ljzjTx_alter }}</span>
                                    </span>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="数量" v-if="searchForm.category=='3'" align="center">
                        <el-table-column
                                align="center"
                                prop="number"
                                label="变动前"
                        >
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="number_alter"
                                label="变动后"
                        >

                            <template slot-scope="scope">
                                <el-input v-if="scope.row[scope.column.property + 'isShow']"
                                          :ref="scope.column.property"
                                          v-model="scope.row.number_alter"
                                          type="number"
                                          @blur="alterData(scope.row,scope.column)"></el-input>
                                <!--								<span v-else>{{ scope.row.number }}</span>-->
                                <span v-else>
                                    <span v-if="scope.row.number_alter==scope.row.number">{{ scope.row.number_alter }}</span>
                                    <span v-else style="color: red">{{ scope.row.number_alter }}</span>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" v-if="searchForm.category=='4'" label="资产类别">
                        <el-table-column
                                align="center"
                                prop="classifName"
                                label="变动前"
                        >
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="classifName_alter"
                                label="变动后"
                        >
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.classifCode_alter" clearable placeholder="请选择资产分类"
                                           :ref="scope.column.property"
                                           v-if="scope.row[scope.column.property + 'isShow']"
                                           @change="zcflChanged($event, scope.$index)"
                                           @blur="alterData(scope.row,scope.column)">
                                    <el-option
                                            v-for="item in zcflOptions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                                <!--								<span v-else>{{ scope.row.classifName }}</span>-->
                                <span v-else>
                                    <span v-if="scope.row.classifName_alter==scope.row.classifName">{{ scope.row.classifName_alter }}</span>
                                    <span v-else style="color: red">{{ scope.row.classifName_alter }}</span>
                                </span>
                            </template>
                        </el-table-column>

                    </el-table-column>
                    <el-table-column label="预计使用年限(月)" v-if="searchForm.category=='7'" align="center">
                        <el-table-column
                                align="center"
                                prop="totalMonth"
                                label="变动前"
                        >
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="totalMonth_alter"
                                label="变动后"
                        >

                            <template slot-scope="scope">
                                <el-input v-if="scope.row[scope.column.property + 'isShow']"
                                          type="number"
                                          :ref="scope.column.property"
                                          @change="monthChanged(scope.row,scope.$index)"
                                          v-model="tableDataFirst.data[scope.$index].totalMonth_alter"
                                          @blur="alterData(scope.row,scope.column)"></el-input>
                                <!--								<span v-else>{{ scope.row.yjsyMonth }}</span>-->
                                <span v-else>
                                    <span v-if="scope.row.totalMonth_alter==scope.row.totalMonth">{{ scope.row.totalMonth_alter }}</span>
                                    <span v-else style="color: red">{{ scope.row.totalMonth_alter }}</span>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" v-if="searchForm.category=='8'" label="使用状况">
                        <el-table-column
                                align="center"
                                prop="syzkName"
                                label="变动前"
                        >
                            <!--							<template slot-scope="scope">-->
                            <!--								<span v-if="syzkOptions[scope.row.syzk -1]">{{ syzkOptions[scope.row.syzk -1].name  }}</span>-->
                            <!--							</template>-->
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="syzkName_alter"
                                label="变动后"
                        >
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.syzk_alter" clearable placeholder="请选择使用状况"
                                           :ref="scope.column.property"
                                           v-if="scope.row[scope.column.property + 'isShow']"
                                           @change="syzkChanged($event, scope.$index)"
                                           @blur="alterData(scope.row,scope.column)">
                                    <el-option
                                            v-for="item in syzkOptions"
                                            :key="item.code"
                                            :label="item.name"
                                            :value="item.code"
                                    >
                                    </el-option>
                                </el-select>
                                <!--								<span v-else>{{ scope.row.syzk }}</span>-->
                                <span v-else>
                                    <span v-if="scope.row.syzk_alter==scope.row.syzk">{{ scope.row.syzkName_alter  }}</span>
                                    <span v-else style="color: red">{{ scope.row.syzkName_alter }}</span>
                                </span>
                            </template>
                        </el-table-column>

                    </el-table-column>
                    <el-table-column align="center" v-if="searchForm.category=='6' || searchForm.category=='8'" label="折旧方法">
                        <el-table-column
                                align="center"
                                prop="zjffName"
                                label="变动前"
                        >
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="zjffName_alter"
                                label="变动后"
                        >
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.zjffId_alter" clearable placeholder="请选择折旧方法"
                                           :ref="scope.column.property"
                                           v-if="scope.row[scope.column.property + 'isShow']"
                                           @change="zjffChanged($event, scope.$index)"
                                           @blur="alterData(scope.row,scope.column)">
                                    <el-option
                                            v-for="item in zjffOptions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                                <!--								<span v-else>{{ scope.row.zjffName }}</span>-->
                                <span v-else>
                                    <span v-if="scope.row.zjffName_alter==scope.row.zjffName">{{ scope.row.zjffName_alter }}</span>
                                    <span v-else style="color: red">{{ scope.row.zjffName_alter }}</span>
                                </span>
                            </template>
                        </el-table-column>

                    </el-table-column>
                    <el-table-column label="计提方式" v-if="searchForm.category=='8'" align="center">
                        <el-table-column
                                align="center"
                                prop="jtfsName"
                                label="变动前"
                        >

                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="jtfsName"
                                label="变动后"
                        >
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.jtfs_alter" clearable placeholder="请选择计提方式"
                                           :ref="scope.column.property"
                                           v-if="scope.row[scope.column.property + 'isShow'] && scope.row.syzk_alter!=scope.row.syzk"
                                           @change="jtfsChanged($event, scope.$index)"
                                           @blur="alterData(scope.row,scope.column)">
                                    <el-option
                                            v-for="item in jtfsOptions"
                                            :key="item.code"
                                            :label="item.name"
                                            :value="item.code"
                                    >
                                    </el-option>
                                </el-select>
                                <!--								<span v-else>{{ scope.row.syzk }}</span>-->
                                <span v-else>
                                    <span v-if="scope.row.jtfs_alter==scope.row.jtfs">{{ scope.row.jtfsName_alter  }}</span>
                                    <span v-else style="color: red">{{ scope.row.jtfsName_alter }}</span>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template>
                            <div class="flex-c-a">
                                <el-button
                                        size="small"
                                        @click="addLine"
                                >增加</el-button>
                                <el-button
                                        size="small"
                                >删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>

            <!--分页-->
            <!--				<div class="pagination">-->
            <!--					<el-pagination-->
            <!--							:current-page.sync="pageNo"-->
            <!--							:total="total"-->
            <!--							background-->
            <!--							layout="total, prev, pager, next"-->
            <!--							@current-change="handleCurrentChange"-->
            <!--					>-->
            <!--					</el-pagination>-->
            <!--				</div>-->
        </div>
        <el-dialog
                :visible.sync="zcDialog"
                center
                title="资产卡片"
                :append-to-body="true"
                width="60%"
                :close-on-click-modal="false"
        >
            <el-form label-width="90px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="资产编码">
                            <el-input v-model="zcForm.zcCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="资产名称">
                            <el-input v-model="zcForm.zcName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" @click="seachZcCard">查询</el-button>
                    </el-col>
                </el-row>
            </el-form>
            <el-table
                    ref="multipleFirst"
                    :data="zcTableData"
                    @row-dblclick="show"
                    border
                    height="500"
                    highlight-current-row stripe>
                <!--				<el-table-column type="selection" width="55"></el-table-column>-->
                <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
                <el-table-column align="center" label="资产属性" prop="propertyName"></el-table-column>
                <el-table-column align="center" label="资产分类" prop="classifName"></el-table-column>
                <el-table-column align="center" label="资产编码" prop="assetsCode"></el-table-column>
                <el-table-column align="center" label="资产名称" prop="assetsName"></el-table-column>
                <el-table-column align="center" label="存放位置" prop="cfwe"></el-table-column>
                <el-table-column align="center" label="使用状况" prop="syzkName"></el-table-column>
                <el-table-column align="center" label="使用部门" prop="department"></el-table-column>
                <el-table-column align="center" label="使用人" prop="syr"></el-table-column>
                <el-table-column align="center" label="折旧/摊销方法" prop="zjffName"></el-table-column>
                <el-table-column align="center" label="原值" prop="originalValue"></el-table-column>
            </el-table>

            <!--分页-->
            <div class="pagination">
                <el-pagination
                        :current-page.sync="zcPageNo"
                        :total="zcTotal"
                        background
                        layout="total, prev, pager, next"
                        @current-change="handleZcChange"
                >
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        computed: {
            timeDefault() {
                var date = new Date();
                var s1 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
                return s1;
            }
        },
        data() {
            return {
                scopeIndex:0,
                zcDialog:false,
                zcTableData:[],
                zcForm:{
                    zcCode: '',
                    zcName:''
                },
                zcTotal:0,
                zcPageNo:1,

                rules: {
                    assetsCode: [{required: true, message: "请选择资产", trigger: "change"}],
                    ljzjTx_alter: [{required: true, message: "必填",trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {
                                if (value) {
                                    let index = rule.field.split('.')
                                    let originalValue = Number(this.tableDataFirst.data[index[1]].originalValue)
                                    let yjjcz = Number(this.tableDataFirst.data[index[1]].yjjcz)
                                    if (originalValue-Number(value)<yjjcz){
                                        this.$message.warning("["+this.tableDataFirst.data[index[1]].assetsName+"]"+"变动后账面价值不能小于变动后预计净残值，账面价值=原值-累计折旧!")
                                        return
                                    }
                                    callback();
                                } else {
                                    this.$message.warning("累积折旧不能为空！")
                                    return;
                                }
                            },
                            trigger: "blur",
                        }
                    ]
                },
                randomKey: Math.random(),
                activeName: 'first',
                searchForm: {
                    year: '',
                    djCode: '',
                    reason: '',
                    category:'1',
                    content: ''
                },
                index:1,
                reasonOptions: [],
                changesOptions: [],
                tableDataFirst: {
                    data: [{
                        id:'',
                        reason:'',
                        index : 0,
                        yjjczl:"",
                        yjjczl_alter:"",
                        yjjcz: "",
                        yjjcz_alter: "",
                        originalValue: "",
                        originalValue_alter: "",
                        assetsName: "",
                        assetsCode: "",
                        zcbm:'', //id
                        ljzjTx :'',
                        ljzjTx_alter :'',
                        number:'',
                        number_alter:'',
                        classifName:'',
                        classifName_alter:'',
                        classifCode:'',
                        classifCode_alter:'',
                        syzk:'',
                        syzk_alter:'',
                        syzkName:'',
                        syzkName_alter:'',
                        zjffId:'',
                        zjffId_alter:'',
                        totalMonth: '',
                        totalMonth_alter: '',
                        jtfs:'',
                        jtfs_alter:'',
                        jtfsName:'',
                        jtfsName_alter:'',
                        zjffName:'',
                        zjffName_alter:'',
                        carrytoDate:''
                    }]
                },
                total: 0,
                pageNo: 1,
                _databaseId:'',
                selectedFundRow:{},
                zcbmOptions:[],
                zcflOptions:[],
                zjffOptions:[],
                syzkOptions:[],
                jtfsOptions:[],

            }
        },
        created() {
            this.searchForm.year = this.timeDefault;
            this._databaseId = localStorage.getItem('_databaseId')
            this.getDjCode();
            this.getReasonOptions()
            this.getChangesOptions()
            this.getZcbm()
            this.getZcfl()
            this.getZjff()
            this.getSyzkOptions()
            this.random()
            this.getJtfsOptions()
        },
        methods: {
            getDjCode(){
                let param={
                    djDate:this.searchForm.year
                }
                this.$axios.post('cloud/entrance/getDjCode',param).then(res=>{
                    if (res.status==200){
                        this.searchForm.djCode=res.data.data
                    }
                })
            },
            show(row) {
                console.log(row)
                let param={
                    _databaseId:this._databaseId,
                    id:row.id
                }
                this.$axios.post('cloud/entrance/getBaseInfo',param).then(res=>{
                    if (res.data.data.length>0){
                        if (this.searchForm.category=='1' || this.searchForm.category=='5' ){
                            this.tableDataFirst.data[this.scopeIndex].id=res.data.data[0].id
                            this.tableDataFirst.data[this.scopeIndex].assetsCode=res.data.data[0].assetsCode
                            this.tableDataFirst.data[this.scopeIndex].assetsName=res.data.data[0].assetsName
                            this.tableDataFirst.data[this.scopeIndex].originalValue=res.data.data[0].originalValue
                            this.tableDataFirst.data[this.scopeIndex].originalValue_alter=res.data.data[0].originalValue
                            this.tableDataFirst.data[this.scopeIndex].yjjcz=res.data.data[0].yjjcz
                            this.tableDataFirst.data[this.scopeIndex].yjjcz_alter=res.data.data[0].yjjcz
                            this.tableDataFirst.data[this.scopeIndex].yjjczl=res.data.data[0].yjjczl
                            this.tableDataFirst.data[this.scopeIndex].yjjczl_alter=res.data.data[0].yjjczl
                        }
                        if (this.searchForm.category=='2'){
                            this.tableDataFirst.data[this.scopeIndex].id=res.data.data[0].id
                            this.tableDataFirst.data[this.scopeIndex].assetsCode=res.data.data[0].assetsCode
                            this.tableDataFirst.data[this.scopeIndex].assetsName=res.data.data[0].assetsName
                            this.tableDataFirst.data[this.scopeIndex].ljzjTx=res.data.data[0].ljzjTx
                            this.tableDataFirst.data[this.scopeIndex].ljzjTx_alter=res.data.data[0].ljzjTx
                            this.tableDataFirst.data[this.scopeIndex].originalValue=res.data.data[0].originalValue
                            this.tableDataFirst.data[this.scopeIndex].yjjcz=res.data.data[0].yjjcz
                        }
                        if (this.searchForm.category=='3'){
                            this.tableDataFirst.data[this.scopeIndex].id=res.data.data[0].id
                            this.tableDataFirst.data[this.scopeIndex].assetsCode=res.data.data[0].assetsCode
                            this.tableDataFirst.data[this.scopeIndex].assetsName=res.data.data[0].assetsName
                            this.tableDataFirst.data[this.scopeIndex].number=res.data.data[0].number
                            this.tableDataFirst.data[this.scopeIndex].number_alter=res.data.data[0].number
                        }
                        if (this.searchForm.category=='4'){
                            this.tableDataFirst.data[this.scopeIndex].id=res.data.data[0].id
                            this.tableDataFirst.data[this.scopeIndex].assetsCode=res.data.data[0].assetsCode
                            this.tableDataFirst.data[this.scopeIndex].assetsName=res.data.data[0].assetsName
                            this.tableDataFirst.data[this.scopeIndex].classifName=res.data.data[0].classifName
                            this.tableDataFirst.data[this.scopeIndex].classifName_alter=res.data.data[0].classifName
                        }
                        if (this.searchForm.category=='6'){
                            this.tableDataFirst.data[this.scopeIndex].id=res.data.data[0].id
                            this.tableDataFirst.data[this.scopeIndex].assetsCode=res.data.data[0].assetsCode
                            this.tableDataFirst.data[this.scopeIndex].assetsName=res.data.data[0].assetsName
                            this.tableDataFirst.data[this.scopeIndex].zjffName=res.data.data[0].zjffName
                            this.tableDataFirst.data[this.scopeIndex].zjffName_alter=res.data.data[0].zjffName
                        }
                        if (this.searchForm.category=='7'){
                            this.tableDataFirst.data[this.scopeIndex].id=res.data.data[0].id
                            this.tableDataFirst.data[this.scopeIndex].assetsCode=res.data.data[0].assetsCode
                            this.tableDataFirst.data[this.scopeIndex].assetsName=res.data.data[0].assetsName
                            this.tableDataFirst.data[this.scopeIndex].totalMonth=res.data.data[0].yjsyMonth *1+res.data.data[0].yjsyYear * 12
                            this.tableDataFirst.data[this.scopeIndex].totalMonth_alter=res.data.data[0].yjsyMonth *1+res.data.data[0].yjsyYear * 12
                        }
                        if (this.searchForm.category=='8'){
                            this.tableDataFirst.data[this.scopeIndex].id=res.data.data[0].id
                            this.tableDataFirst.data[this.scopeIndex].assetsCode=res.data.data[0].assetsCode
                            this.tableDataFirst.data[this.scopeIndex].assetsName=res.data.data[0].assetsName
                            this.tableDataFirst.data[this.scopeIndex].syzk=res.data.data[0].syzk
                            this.tableDataFirst.data[this.scopeIndex].syzk_alter=res.data.data[0].syzk
                            this.tableDataFirst.data[this.scopeIndex].syzkName=res.data.data[0].syzkName
                            this.tableDataFirst.data[this.scopeIndex].syzkName_alter=res.data.data[0].syzkName
                            this.tableDataFirst.data[this.scopeIndex].zjffName=res.data.data[0].zjffName
                            this.tableDataFirst.data[this.scopeIndex].zjffName_alter=res.data.data[0].zjffName
                            this.tableDataFirst.data[this.scopeIndex].jtfs=res.data.data[0].jtfs
                            this.tableDataFirst.data[this.scopeIndex].jtfs_alter=res.data.data[0].jtfs
                            this.tableDataFirst.data[this.scopeIndex].jtfsName=res.data.data[0].jtfsName
                            this.tableDataFirst.data[this.scopeIndex].jtfsName_alter=res.data.data[0].jtfsName
                        }
                        this.tableDataFirst.data[this.scopeIndex].carrytoDate=res.data.data[0].carrytoDate
                    }

                })
                this.zcDialog=false
            },
            // select(selection, row){
            // 	// this.bill_id = row.id;
            // 	// 清除 所有勾选项
            // 	this.$refs.multipleFirst.clearSelection()
            // 	// 当表格数据都没有被勾选的时候 就返回
            // 	// 主要用于将当前勾选的表格状态清除
            // 	if(selection.length == 0) return
            // 	this.$refs.multipleFirst.toggleRowSelection(row, true);
            // },
            handleZcChange(val){
                this.zcPageNo = val
                this.showZcTable()
            },
            seachZcCard(){
                this.zcPageNo=1
                this.showZcTable(null)
            },
            showZcTable(scope){

                if (scope!=null){
                    this.scopeIndex=scope.$index
                }
                let params={
                    pageNo:this.zcPageNo,
                    _databaseId:this._databaseId,
                    zcCode:this.zcForm.zcCode,
                    zcName:this.zcForm.zcName
                }
                this.$axios.post('cloud/entrance/getBaseInfoCard',params).then(res=>{
                    if (res.data.code==200){
                        console.log(res)
                        this.zcTableData=res.data.data.list
                        this.zcTotal=res.data.data.total
                        this.zcDialog=true
                    }
                })
            },
            //随机生成随机数
            random() {
                var arr = [];
                var result = "";
                var count = 0;
                while (count < 4) {
                    var n = Math.floor(Math.random() * 9 + 1);
                    if (arr.join().indexOf(n) == -1) {
                        arr.push(n);
                        count++;
                    }
                }
                for (let index = 0; index < arr.length; index++) {
                    result = result + arr[index];
                }
                this.searchForm.djCode = 'ZCBD-'+this.timeDefault.split('-')[0]+'-'+this.timeDefault.split('-')[1]+'-'+result
            },
            monthChanged(row,index){
                console.log(row)
                let sum = row.totalMonth_alter
                this.tableDataFirst.data[index].yjsyYear_alter = Math.floor(sum/12)
                this.tableDataFirst.data[index].yjsyMonth_alter = sum%12
            },
            // 提交
            submit() {
                this.$refs.baseForm.validate((valid) => {
                    if (valid) {

                        this.$confirm("您确定【提交】？", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {

                            let currentTime = new Date(this.searchForm.year)
                            for(let i  = 0; i < this.tableDataFirst.data.length; i++){
                                if (this.tableDataFirst.data[i].carrytoDate!=undefined){
                                    let eleTime = new Date(this.tableDataFirst.data[i].carrytoDate)
                                    if (currentTime<eleTime){
                                        this.$message.warning("变动日期早于当前资产入账日期，不能保存。")
                                        return
                                    }
                                }
                            }
                            let params = {
                                json:JSON.stringify(this.tableDataFirst.data),
                                djCode:this.searchForm.djCode,
                                djDate:this.searchForm.year,
                                content:this.searchForm.category,
                                currentTime:this.searchForm.year,
                                category:this.searchForm.category
                            }
                            this.$axios.post('cloud/entrance/updateBaseInfo',params).then(res=>{
                                console.log(res.data.code)
                                if (res.data.code==200){
                                    this.$message.success("成功")
                                    this.categoryChanged()
                                    this.getDjCode()
                                    this.searchForm.reason=''
                                    this.searchForm.content=''
                                }else{
                                    this.$message.warning(res.data.message)
                                    return
                                }
                            })

                        })
                    }else {
                        this.$message.warning("请选择资产！！")
                    }
                })
            },
            getZjff(){
                this.$axios.post('cloud/entrance/getZjMethod').then(res=>{
                    this.zjffOptions=res.data.data
                    console.log(res)
                })
            },
            syzkChanged(val,index){
                let obj = this.syzkOptions.find(item => item.code === val)
                // this.tableDataFirst.data[index].syzk=obj.name
                this.tableDataFirst.data[index].syzkName_alter=obj.name
            },
            jtfsChanged(val,index){
                let obj = this.jtfsOptions.find(item => item.code === val)
                // this.tableDataFirst.data[index].syzk=obj.name
                this.tableDataFirst.data[index].jtfsName_alter=obj.name
            },
            zcflChanged(val,index){
                let obj = this.zcflOptions.find(item => item.id === val)
                this.tableDataFirst.data[index].classifName_alter=obj.name
                this.tableDataFirst.data[index].classifCode_alter=obj.id
            },
            zjffChanged(val,index){
                let obj = this.zjffOptions.find(item => item.id === val)
                this.tableDataFirst.data[index].zjffName_alter=obj.name
                this.tableDataFirst.data[index].zjffId_alter=obj.id
            },
            getSummaries (param) {
                const { columns, data } = param
                const sums = []
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计'
                    } else if (index !== 2 && index !== 3 && this.searchForm.category !=8) {
                        const values = data.map(item => Number(item[column.property]))
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr)
                                if (!isNaN(value)) {
                                    return prev + curr
                                } else {
                                    return prev
                                }
                            }, 0)
                        } else {
                            sums[index] = '--'
                        }
                    } else {
                        sums[index] = '--'
                    }
                })
                return sums
            },
            categoryChanged(value){
                this.tableDataFirst=
                    {
                        data: [{
                            id:'',
                            reason:'',
                            index : 0,
                            yjjczl:"",
                            yjjczl_alter:"",
                            yjjcz: "",
                            yjjcz_alter: "",
                            originalValue: "",
                            originalValue_alter: "",
                            assetsName: "",
                            assetsCode: "",
                            zcbm:'', //id
                            ljzjTx :'',
                            ljzjTx_alter :'',
                            number:'',
                            number_alter:'',
                            classifName:'',
                            classifName_alter:'',
                            classifCode:'',
                            classifCode_alter:'',
                            syzk:'',
                            syzk_alter:'',
                            syzkName:'',
                            syzkName_alter:'',
                            zjffId:'',
                            zjffId_alter:'',
                            totalMonth: '',
                            totalMonth_alter: '',
                            jtfs:'',
                            jtfs_alter:'',
                            jtfsName:'',
                            jtfsName_alter:'',
                            zjffName:'',
                            zjffName_alter:'',
                            carrytoDate:''
                        }]
                    }
                this.refreshTable()
            },
            //原值改变触发事件
            yzChanged(row){
                this.tableDataFirst.data[row.index].yjjcz_alter=row.originalValue_alter*(row.yjjczl_alter*0.01)
            },
            getZcbm(){
                let param={
                    _databaseId:this._databaseId,
                }
                this.$axios.post('cloud/entrance/getBaseInfo',param).then(res=>{
                    this.zcbmOptions=res.data.data
                })
            },
            getZcfl(){
                this.$axios.post('cloud/entrance/queryAssetsClassif').then(res=>{
                    console.log(res)
                    this.zcflOptions=res.data.data
                })
            },
            tableRowClassName({ row, rowIndex }) {
                row.index = rowIndex;
            },
            editData (row, column) {
                row[column.property + "isShow"] = true
                //refreshTable是table数据改动时，刷新table的
                this.refreshTable()
                this.$nextTick(() => {
                    this.$refs[column.property] && this.$refs[column.property].focus()
                })
            },
            refreshTable () {
                this.randomKey = Math.random()
            },
            alterData (row, column) {
                row[column.property + "isShow"] = false
                // this.refreshTable()
            },
            selectItem(row, column, event) {
                this.selectedFundRow = row
                if (event.target.innerText == "删除") {
                    this.removeFundBtn(this.selectedFundRow)
                }
            },
            // 删除指定行
            removeFundBtn(params) {
                this.tableDataFirst.data = this.tableDataFirst.data.filter((ele) => {
                    var flag = false
                    // 如果不一致，则保留该行
                    for (const key in params) {
                        if (ele[key] != params[key]) {
                            flag = true
                            break
                        }
                    }
                    return flag
                })
                // 如果全部删除后没有可以点击的一行了，需要加一行空行
                if (!this.tableDataFirst.data.length) {
                    this.addLine()
                }
            },
            // 增加一个空行, 用于录入或显示第一行
            addLine() {
                const newLine = {
                    index:this.index,
                    id:'',
                    reason:'',
                    yjjczl:"",
                    yjjczl_alter:"",
                    yjjcz: "",
                    yjjcz_alter: "",
                    originalValue: "",
                    originalValue_alter: "",
                    assetsName: "",
                    assetsCode: "",
                    zcbm:'', //id
                    ljzjTx :'',
                    ljzjTx_alter :'',
                    number:'',
                    number_alter:'',
                    classifName:'',
                    classifName_alter:'',
                    classifCode:'',
                    classifCode_alter:'',
                    syzk:'',
                    syzk_alter:'',
                    syzkName:'',
                    syzkName_alter:'',
                    zjffId:'',
                    zjffId_alter:'',
                    totalMonth: '',
                    totalMonth_alter: '',
                    jtfs:'',
                    jtfs_alter:'',
                    jtfsName:'',
                    jtfsName_alter:'',
                    zjffName:'',
                    zjffName_alter:'',
                    carrytoDate:''
                }
                this.index++
                this.tableDataFirst.data.push(newLine)
            },


            getReasonOptions(){
                let param ={
                    name: '资产变动原因'
                }
                this.$axios.post('cloud/entrance/getDictDetailByName',param).then(res=>{
                    this.reasonOptions=res.data.data
                })
            },
            getJtfsOptions(){
                let param ={
                    name: '计提方式'
                }
                this.$axios.post('cloud/entrance/getDictDetailByName',param).then(res=>{
                    this.jtfsOptions=res.data.data
                })
            },
            getSyzkOptions(){
                let param ={
                    name: '资产变动使用状况'
                }
                this.$axios.post('cloud/entrance/getDictDetailByName',param).then(res=>{
                    this.syzkOptions=res.data.data
                })
            },
            getChangesOptions(){
                let param ={
                    name: '资产变动类别'
                }
                this.$axios.post('cloud/entrance/getDictDetailByName',param).then(res=>{
                    this.changesOptions=res.data.data
                })
            },

            handleSearch(){
                this.pageNo = 1
                this.handleClick()
            },
            handleCurrentChange(val){
                this.pageNo = val
                this.handleClick()
            },

        }
    }
</script>
<style scoped>
    .zcbd .container {
        padding: 0px;
    }
    .zcbd .el-form-item {
        margin-bottom: 0px
    }

    .zcbd .el-form-item.is-error {
        margin-bottom: 0px
    }
</style>
