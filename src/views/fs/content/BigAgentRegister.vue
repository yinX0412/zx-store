<template>
    <div v-loading="loading">
        <el-image src="/img/loginLogo.png" style="width: 100%;margin-bottom: 10px;"></el-image>
        <h3 style="display: block;text-align: center">绑定公众号</h3>
        <div style="width: 70%;margin: 20px auto 0">
            <el-input v-model="form.phone" placeholder="手机号码" style="margin-bottom: 10px" autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
        </div>
        <div style="font-size: 12px;text-align: center;margin-top: 20px">
            <i style="color: #F56C6C;">* </i>
            <span>绑定代表您同意</span>
            <el-link type="primary" style="font-size: 12px;margin-bottom: 3px;">《筑馨家会员协议》</el-link>
        </div>
        <div style="text-align: center">
            <el-button type="primary" @click="register">绑定</el-button>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import router from '../../../router';
    import {RegisterArgs, registerBigAgent, registerUser, userAuthCodeLogin} from '../../../service/fs/fs-auth-service';
    import AuthImp from '../../../service/auth/AuthImp';

    @Component
    export default class FsBigAgentRegister extends Vue {
        private loading = false;
        private form: any = {
            phone: '',
        };

        private created(): void {
            if ((this.$route.query as any).code) {
                userAuthCodeLogin((router.currentRoute.query as any).code as string)
                    .then((res: any) => {
                        if (res.token) {
                            new AuthImp().setAccessToken(res.token);
                        }
                        this.$router.replace(window.location.pathname);
                    })
                    .catch((error) => {
                        if (error.data && error.data.token) {
                            new AuthImp().setAccessToken(error.data.token);
                        }
                        if (error.code === 2003) {
                            this.$router.replace(window.location.pathname);
                            return;
                        }
                        alert(error.toString());
                    });
                return;
            }
            this.$router.replace(decodeURIComponent(window.location.pathname + window.location.search).trim());
            new AuthImp().getAccessToken()
                         .then((ak) => {
                             if (!ak) {
                                 new AuthImp().redirectToGetAuthCode();
                             }
                         });
        }

        private register() {
            if (!/^1[3456789]\d{9}$/.test(this.form.phone)) {
                alert('请填写正确手机号');
                return;
            }
            this.loading = true;
            registerBigAgent(this.form.phone)
                .then((res) => {
                    this.$message({
                        message: '绑定成功',
                        type: 'success'
                    });
                    this.$router.replace('/fs');
                })
                .catch((error) => {
                    this.$message({
                        type: 'warning',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }
    }
</script>