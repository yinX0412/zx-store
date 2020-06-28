<template>
    <div>
        <el-image src="/img/loginLogo.png" style="width: 100%;margin-bottom: 10px;"></el-image>
        <h3 style="display: block;text-align: center">会员登录</h3>
        <div style="width: 70%;margin: 20px auto">
            <el-input v-model="form.username" placeholder="请输入用户名" style="margin-bottom: 20px" autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
            <el-input v-model="form.password" placeholder="请输入密码" show-password autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/password.svg"
                          style="width: 18px"></el-image>
            </el-input>
        </div>
        <div style="text-align: center">
            <el-button type="primary">登陆</el-button>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class FsLogin extends Vue {
        private form = {
            username: '',
            password: ''
        };
    }
</script>