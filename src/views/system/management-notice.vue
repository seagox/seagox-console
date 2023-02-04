<template>
    <div>
        <div class="toolView">
            <el-button type="text" icon="el-icon-s-promotion" @click="publicNotice" size="small">发布公告</el-button>
        </div>
        <div class="searchView">
            <el-form label-width="80px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="标题">
                            <el-input v-model="searchForm.title" clearable placeholder="请输入标题"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-button
                            icon="el-icon-search"
                            style="margin-left:15px"
                            type="primary"
                            @click.native="handleSearch"
                        >查询
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="未读" name="first">
                    <div class="toolView">
                        <el-button type="text" icon="el-icon-message" @click="settingMessage" size="small">全部标志为已读</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="已读" name="second">
                </el-tab-pane>
                <el-tab-pane label="待发布" name="third">
                </el-tab-pane>
                <el-tab-pane label="已发布" name="fourth">
                </el-tab-pane>
                <hr>
                <!--列表-->
                <el-table :data="tableDataOne" :key="1" border highlight-current-row stripe @row-dblclick="handleNodeClick" v-if="activeName === 'first' || activeName === 'second'">
                    <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="发起人" align="center"></el-table-column>
                    <el-table-column prop="title" label="标题" align="center">
                        <template slot-scope="scope">
                            <i v-if="scope.row.classify == '3'" class="el-icon-warning" style="color: red"></i>
                            <i v-if="scope.row.classify == '2'" class="el-icon-warning" style="color: #e6a23c"></i>
                            <span v-if="scope.row.type == 2 && scope.row.businessType == 0" v-html="scope.row.title"></span>
                            <span v-else>{{scope.row.title}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发送时间" align="center"></el-table-column>
                </el-table>
                <!--列表-->
                <el-table :data="tableDataTwo"  :key="2" border highlight-current-row stripe @row-dblclick="handleNodeClick" v-if="activeName === 'third' || activeName === 'fourth'">
                    <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
                    <el-table-column prop="title" label="标题" align="center">
                        <template slot-scope="scope">
                            <i v-if="scope.row.classify == '3'" class="el-icon-warning" style="color: red"></i>
                            <i v-if="scope.row.classify == '2'" class="el-icon-warning" style="color: #e6a23c"></i>
                            <span>{{scope.row.title}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="activeName === 'fourth'" prop="createTime" label="发布时间" align="center"></el-table-column>
                    <el-table-column v-if="activeName === 'third'" prop="createTime" label="创建时间" align="center"></el-table-column>
                    <el-table-column v-if="activeName === 'fourth'" label="阅读情况(已读/未读)" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.readNum}}/{{scope.row.unreadNum}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="activeName === 'fourth'" type="text" @click="onSubmit(scope.row.id, 0)">撤回</el-button>
                            <el-button v-if="activeName === 'third'" type="text" @click="onSubmit(scope.row.id, -1)">删除</el-button>
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
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchForm: {
                title: ''
            },
            tableDataOne: [],
            tableDataTwo: [],
            pageNo: 1,
            total: 0,
            activeName: 'first',
            status: 0
        }
    },
    created() {
        this.queryByPage()
    },
    methods: {
        async queryByPage() {
            const params = {
                pageNo: this.pageNo,
                status: this.status,
                title: this.searchForm.title
            }
            if (this.activeName === 'first' || this.activeName === 'second'){
                let res = await this.$axios.get('message/queryByPage', { params })
                if (res.data.code == 200) {
                    this.tableDataOne = res.data.data.list
                    this.total = res.data.data.total
                }
            }
            if (this.activeName === 'third' || this.activeName === 'fourth'){
                params.queryType = 'only'
                let res = await this.$axios.get('notice/queryByPage', { params })
                if (res.data.code == 200) {
                    this.tableDataTwo = res.data.data.list
                    this.total = res.data.data.total
                }
            }
        },
        // 翻页
        handleCurrentChange(val) {
            this.queryByPage()
        },
        async settingMessage() {
            let res = await this.$axios.post('message/updateAll', {})
            if (res.data.code == 200) {
                this.$message.success('设置成功')
                this.queryByPage()
            }
        },
        handleNodeClick(row, column, event) {
            let that = this
            const params = {
                id: row.id
            }
            if (this.activeName === 'first'){
                that.$axios.post('message/update', params)
            }
            if (this.activeName === 'third'){
                //暂存发布
                that.$router.push({
                    path: '/publicNotice',
                    query: {
                        id: row.id
                    }
                })
            }else if (this.activeName === 'fourth'){
                //直接跳转展示页
                that.$router.push({
                    path: '/showNotice',
                    query: {
                        id: row.id
                    }
                })
            }else if (row.type == 1) {
                //流程通知
                that.$router.push({
                    path: '/handleCustomForm',
                    query: {
                        id: row.businessKey,
                        formId: row.businessType,
                        title: '事项详情'
                    }
                })
            } else if (row.type == 2) {
                //公告通知
                if (row.businessType == -1){
                    that.$router.push({
                        path: '/showNotice',
                        query: {
                            id: row.businessKey,
                            title: '通知详情'
                        }
                    })
                }
            } else if (row.type == 3) {
                //数据预警
                that.$router.push({
                    path: '/handleCustomForm',
                    query: {
                        id: row.businessKey,
                        formId: row.businessType,
                        title: '事项详情'
                    }
                })
            } else if (row.type == 4) {
                //暂存数据
                that.$router.push({
                    path: '/handleCustomForm',
                    query: {
                        id: row.businessKey,
                        formId: row.businessType,
                        title: '事项详情'
                    }
                })
            }
        },
        handleClick(tab, event) {
            this.pageNo = 1
            if (tab.name === 'first' || tab.name === 'third'){
                this.status = 0
            }
            if (tab.name === 'second' || tab.name === 'fourth'){
                this.status = 1
            }
            this.queryByPage()
        },
        handleSearch(){
            this.pageNo = 1
            this.queryByPage()
        },
        onSubmit(dataId, flag){
            let that = this
            const params = {
                id: dataId
            }
            if (flag === 0){
                this.$confirm('亲，确认要撤回吗？', '提示', {type: 'warning'}).then(() => {
                    that.$axios.post('notice/withdraw', params).then(res =>{
                        if (res.data.code == 200) {
                            this.$message.success('撤回成功')
                            this.queryByPage()
                        }else {
                            this.$message.error(res.data.message)
                        }
                    })
                })
            }
            if (flag === -1){
                this.$confirm('亲，确认要删除吗？', '提示', {type: 'warning'}).then(() => {
                    that.$axios.post('notice/deleteById', params).then(res =>{
                        if (res.data.code == 200) {
                            this.$message.success('删除成功')
                            this.queryByPage()
                        }
                    })
                })
            }
        },
        publicNotice(){
            this.$router.push({
                path: '/publicNotice'
            })
        }
    }
}
</script>