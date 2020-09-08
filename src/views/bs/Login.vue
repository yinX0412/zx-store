<template>
    <div v-loading="loading" style="background: #fff;height: 100vh;">
        <div style="text-align: center;padding-top: 200px">
            <h2 style="margin-bottom: 20px">筑馨家商场后台管理系统</h2>
            <div style="margin-bottom: 20px">
                <span style="color: #606266;font-size: 14px;margin-right: 10px">账号</span>
                <el-input v-model="form.account" placeholder="请输入账号" style="width: 250px"></el-input>
            </div>
            <div style="margin-bottom: 20px">
                <span style="color: #606266;font-size: 14px;margin-right: 10px">密码</span>
                <el-input v-model="form.password" placeholder="请输入密码" style="width: 250px"
                          type="password"></el-input>
            </div>
            <el-button type="primary" @click="login">登录</el-button>
        </div>

    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {adminLogin} from '@/service/bs/bs-login-service';
    import AuthImp from '@/service/auth/AuthImp';

    @Component
    export default class BsLogin extends Vue {
        private loading: boolean = false;
        private form = {
            account: '',
            password: '',
        };

        private login() {
            this.loading = true;
            adminLogin(this.form.account, this.form.password)
                .then((res) => {
                    if (res.token) {
                        new AuthImp().setAccessToken(res.token);
                    }
                    if ((this.$route.query as any).redirectUrl) {
                        this.$router.replace((this.$route.query as any).redirectUrl);
                    } else {
                        this.$router.replace('/bs');
                    }
                })
                .catch((error) => this.$message({message: error, type: 'warning'}))
                .finally(() => this.loading = false);
        }
    }
</script>