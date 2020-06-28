<template>
    <div>
        <h3 style="display: block;text-align: center">会员注册登录</h3>
        <div style="width: 70%;margin: 20px auto 0">
            <el-input v-model="form.name" placeholder="姓名" style="margin-bottom: 20px" autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
            <el-input v-model="form.city" placeholder="城市" style="margin-bottom: 20px" autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
            <el-input v-model="form.address" placeholder="地址" show-password style="margin-bottom: 20px"
                      autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/password.svg"
                          style="width: 18px"></el-image>
            </el-input>
            <el-input v-model="form.money" placeholder="会员金额599元" style="margin-bottom: 20px" autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
        </div>
        <div style="font-size: 12px;text-align: center;">
            <i style="color: #F56C6C;">* </i>
            <span>支付代表您同意</span>
            <el-link style="font-size: 12px;margin-bottom: 3px" type="primary">《筑馨家会员协议》</el-link>
        </div>
        <div style="text-align: center">
            <el-button type="primary">确认支付</el-button>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';

    @Component
    export default class FsRegister extends Vue {
        private form = {
            name: '',
            city: '',
            address: '',
            money: '',
        };
    }
</script>