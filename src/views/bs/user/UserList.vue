<template>
    <div v-loading="loading">
        <div style="display:flex;justify-content: space-between;align-items: center">
            <div>
                <el-radio-group v-model="form.identity" @change="beforeFilter">
                    <el-radio :label="1">普通用户</el-radio>
                    <el-radio :label="2">会员</el-radio>
                    <el-radio :label="3">业务员</el-radio>
                    <el-radio :label="4">大代理</el-radio>
                </el-radio-group>
            </div>
            <div>
                <el-input v-model="form.username" placeholder="请输入用户名称" size="small"
                          style="width: 200px;vertical-align: middle;margin-right: 10px"
                          @keyup.enter.native="beforeFilter"></el-input>
                <el-button size="small" @click="beforeFilter">搜索</el-button>
            </div>
        </div>
        <el-table
            border
            :data="userList"
            style="width: 100%;margin-top: 20px">
            <el-table-column
                prop="username"
                label="用户名">
                <template slot-scope="scope">
                    <el-button type="text" @click="$router.push('/bs/user/'+scope.row.id)"
                               :disabled="scope.row.is_del==2">
                        {{scope.row.username}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                label="头像">
                <template slot-scope="scope">
                    <el-image :src="scope.row.avatar" style="width: 80px"></el-image>
                </template>
            </el-table-column>
            <el-table-column
                prop="phone"
                label="手机">
            </el-table-column>
            <el-table-column
                prop="city"
                label="城市">
            </el-table-column>
            <el-table-column
                prop="invite_code"
                label="邀请码">
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">
                    {{scope.row.is_del | formatDel}}
                </template>
            </el-table-column>
            <el-table-column
                prop="user_order_count"
                label="订单数">
            </el-table-column>
            <el-table-column
                label="门店信息">
                <template slot-scope="scope">
                    <div>名称：{{scope.row.address.store_name}}</div>
                    <div>地址：{{scope.row.address.address_content + scope.row.address.hourse_number}}</div>
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <div style="margin-bottom: 5px">
                        <el-button size="small" @click="showSubUser(scope.row.subUserInfo)">查看下级</el-button>
                    </div>
                    <div v-if="scope.row.is_del==1" style="margin-bottom: 5px">
                        <el-button type="danger" size="small" @click="confirmDel(scope.row.id, 1)">确认除名</el-button>
                    </div>
                    <div v-if="scope.row.is_del==1">
                        <el-button type="warning" size="small" @click="confirmDel(scope.row.id, 2)">驳回除名</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="sizes, total, prev, pager, next,jumper" :total="total"
                       @size-change="beforeFilter"
                       @current-change="getUserList"
                       :page-size.sync="form.page_count" :current-page.sync="form.page"
                       :page-sizes="[20, 50, 100]"
                       style="text-align: center;margin: 10px 0">
        </el-pagination>
        <el-dialog
            title="提示"
            :visible.sync="subUserDialog"
            width="500px">
            <span>下级名单：{{currentSubUser}}</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="subUserDialog = false;currentSubUser=''">关闭</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {getUserList, UserList} from '@/service/fs/fs-auth-service';
    import {Component, Vue} from 'vue-property-decorator';
    import {removeUser} from '@/service/bs/bs-user-service';

    @Component({
        filters: {
            formatDel(del: 0 | 1 | 2) {
                switch (del) {
                    case  0:
                        return '正常';
                    case  1:
                        return '审核中';
                    case  2:
                        return '已除名';
                }
            },
        },
    })
    export default class BsUserList extends Vue {
        private loading: boolean = false;
        private subUserDialog: boolean = false;
        private currentSubUser: string = '';
        private userList: UserList[] = [];
        private total: number = 0;
        private form: {
            page: number,
            page_count: number,
            username: string,
            identity: 1 | 2 | 3 | 4,
        } = {
            page: 1,
            page_count: 20,
            username: '',
            identity: 1,
        };

        private created() {
            this.getUserList();
        }

        private getUserList() {
            this.loading = true;
            getUserList(this.form.page, this.form.page_count, this.form.username, this.form.identity)
                .then((res) => {
                    this.total = res.total;
                    this.userList = res.list;
                })
                .catch((error) => this.$message({message: error, type: 'warning'}))
                .finally(() => this.loading = false);
        }

        private beforeFilter() {
            this.form.page = 1;
            this.getUserList();
        }

        private showSubUser(user: string[]) {
            this.currentSubUser = user.join('，');
        }

        private confirmDel(id: string, o: 1 | 2) {
            this.$confirm(o == 1 ? '确认除名？' : '确认驳回除名？')
                .then(() => {
                    this.loading = true;
                    return removeUser(id, o);
                })
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '操作成功',
                    });
                    this.getUserList();
                })
                .catch((error) => this.$message({message: error, type: 'warning'}))
                .finally(() => this.loading = false);
        }
    }
</script>