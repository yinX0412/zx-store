<template>
    <div v-loading="loading">
        <div>
            <h2>筑馨家商场后台管理系统</h2>
            <el-form ref="form" :model="form">
                <el-form-item label="账号">
                    <el-input v-model="form.account" placeholder="请输入账号" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" placeholder="请输入密码" style="width: 250px"></el-input>
                </el-form-item>
            </el-form>
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
                .catch((error) => this.$message({message: error, type: 'error'}))
                .finally(() => this.loading = false);
        }
    }
</script>