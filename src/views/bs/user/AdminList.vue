<template>
    <div v-loading="loading">
        <el-button type="primary" size="small" @click="dialogVisible=true">添加</el-button>
        <el-table
            :data="adminList"
            style="width: 100%">
            <el-table-column
                prop="id"
                label="id">
            </el-table-column>
            <el-table-column
                prop="account"
                label="账号">
            </el-table-column>
            <el-table-column
                label="身份">
                <template slot-scope="scope">
                    <div>{{scope.row.identity==1?'管理员':'超级管理员'}}</div>
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button size="small" @command="moreOperation(scope.row.id, 'resetPwd')">密码重置</el-button>
                    <el-button size="small" @command="moreOperation(scope.row.id, '删除账户')">删除账户</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="添加管理员"
            :visible.sync="dialogVisible"
            width="500px"
            @close="closeDialog">
            <el-input v-model="newAdminAccount" placeholder="请输入管理员账号" size="small"></el-input>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog" size="small">取 消</el-button>
            <el-button type="primary" @click="addAdmin" size="small">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {AdminList, deleteAccount, getAdminList, resetAdminPwd} from '../../../service/bs/bs-user-service';
    import {addAdmin} from '@/service/fs/fs-auth-service';

    @Component
    export default class BsAdminManager extends Vue {
        private loading: boolean = false;
        private dialogVisible: boolean = false;
        private adminList: AdminList[] = [];
        private newAdminAccount: string = '';

        private created(): void {
            this.getAdminList();
        }

        private getAdminList() {
            this.loading = true;
            getAdminList()
                .then((res) => {
                    this.adminList = res;
                })
                .catch((error) => {
                    this.$message({
                        type: 'warning',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }

        private moreOperation(id: string, command: string) {
            if (command == 'resetPwd') {
                this.$confirm('确认重置密码？')
                    .then(() => {
                        this.loading = true;
                        return resetAdminPwd(id);
                    })
                    .then(() => {
                        this.$message({
                            type: 'success',
                            message: '重置成功'
                        });
                    })
                    .catch((error) => {
                        this.$message({
                            type: 'warning',
                            message: error,
                        });
                    })
                    .finally(() => this.loading = false);
                return;
            }
            if (command == 'deleteAccount') {
                this.$confirm('确认删除此账户？')
                    .then(() => {
                        this.loading = true;
                        return deleteAccount(id);
                    })
                    .then(() => {
                        this.getAdminList();
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                    })
                    .catch((error) => {
                        this.$message({
                            type: 'warning',
                            message: error,
                        });
                    })
                    .finally(() => this.loading = false);
                return;
            }
        }

        private closeDialog() {
            this.dialogVisible = false;
            this.newAdminAccount = '';
        }

        private addAdmin() {
            if (!this.newAdminAccount) {
                this.$message({
                    type: 'warning',
                    message: '请输入管理员账号',
                });
                return;
            }
            this.loading = true;
            addAdmin(this.newAdminAccount)
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '添加成功',
                    });
                    this.getAdminList();
                })
                .catch((error) => {
                    this.$message({
                        type: 'warning',
                        message: error,
                    });
                })
                .finally(() => {
                    this.loading = false;
                    this.closeDialog();
                });
        }
    }
</script>