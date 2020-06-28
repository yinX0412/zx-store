<template>
    <div>
        <el-image src="/img/loginLogo.png" style="width: 100%;margin-bottom: 10px;"></el-image>
        <h3 style="display: block;text-align: center">会员注册登录</h3>
        <div style="width: 70%;margin: 20px auto 0">
            <el-input v-model="form.mobile" placeholder="手机号码" style="margin-bottom: 20px" autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
            <el-input v-model="form.code" placeholder="验证码" style="margin-bottom: 20px" autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
            <el-input v-model="form.password" placeholder="密码" show-password style="margin-bottom: 20px"
                      autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/password.svg"
                          style="width: 18px"></el-image>
            </el-input>
            <el-input v-model="form.inviteCode" placeholder="邀请码" style="margin-bottom: 20px" autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
        </div>
        <div style="font-size: 12px;text-align: center">
            <i style="color: #F56C6C;">* </i>
            <span>注册代表您同意</span>
            <el-link type="primary" style="font-size: 12px;margin-bottom: 3px;">《筑馨家会员协议》</el-link>
        </div>
        <div style="text-align: center">
            <el-button type="primary">注册</el-button>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';

    @Component
    export default class FsRegister extends Vue {
        private form = {
            mobile: '',
            code: '',
            password: '',
            inviteCode: '',
        };
    }
</script>